
import { NextRequest, NextResponse } from 'next/server';
import { Order, CartItem } from '@/types'; // Import Order and CartItem types
import { saveOrder } from '@/lib/orders'; // Import the saveOrder function
import Epayco from 'epayco-sdk-node';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Received body in /api/epayco:', JSON.stringify(body, null, 2));

    const { cart, total, customerInfo } = body;

    // Validation
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      console.error('Validation failed: Cart is empty or invalid');
      return NextResponse.json({ error: 'El carrito está vacío o es inválido' }, { status: 400 });
    }

    if (!total || isNaN(total)) {
      console.error('Validation failed: Total is invalid:', total);
      return NextResponse.json({ error: 'El total de la compra no es válido' }, { status: 400 });
    }

    // ePayco SDK initialization
    let epayco: any;
    try {
      epayco = new Epayco({
        apiKey: process.env.EPAYCO_PUBLIC_KEY,
        privateKey: process.env.EPAYCO_PRIVATE_KEY,
        lang: 'ES',
        test: process.env.EPAYCO_TEST_MODE === 'true',
      });
      
      console.log('ePayco SDK initialized with new Epayco()');
      console.log('ePayco SDK properties:', Object.keys(epayco));
    } catch (initError: any) {
      console.error('Error initializing ePayco SDK:', initError);
      return NextResponse.json({ 
        error: 'Failed to initialize payment gateway', 
        details: initError.message 
      }, { status: 500 });
    }

    console.log('ePayco keys check:', {
      hasPublicKey: !!process.env.EPAYCO_PUBLIC_KEY,
      hasPrivateKey: !!process.env.EPAYCO_PRIVATE_KEY,
      testMode: process.env.EPAYCO_TEST_MODE
    });

    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3001';

    // Generate a unique order ID
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create a new pending order
    const newOrder: Order = {
      id: orderId,
      customerId: customerInfo?.email || 'guest',
      items: cart as CartItem[],
      totalAmount: total,
      currency: 'cop',
      orderDate: new Date().toISOString(),
      status: 'pending',
      customerInfo: customerInfo,
    };

    // Save the pending order
    try {
      await saveOrder(newOrder);
    } catch (saveError: any) {
      console.error('Error saving order:', saveError);
      // We continue even if saving fails, but log it. 
      // Or we can return error if we want it to be strict.
    }

    // Lógica para crear el objeto de pago para ePayco
    const paymentData = {
      name: 'Compra en Tienda Solar Tech',
      description: `Compra de ${cart.length} productos`,
      invoice: orderId,
      currency: 'cop',
      amount: Math.round(total).toString(),
      tax_base: '0',
      tax: '0',
      country: 'CO',
      lang: 'es',

      response: `${baseUrl}/checkout/response`,
      confirmation: `${baseUrl}/api/epayco-confirmation`,

      extra1: orderId,
      extra2: customerInfo?.email || '',
      extra3: customerInfo?.name || '',
    };

    console.log('Payment data prepared:', JSON.stringify(paymentData, null, 2));

    try {
      // El SDK epayco-sdk-node v1.4.4 no tiene el recurso 'checkout'.
      // En lugar de usar epayco.checkout.create, construimos la URL de la pasarela manualmente
      // o usamos la API de ePayco directamente vía fetch.
      
      const p_cust_id = process.env.EPAYCO_CUST_ID || process.env.NEXT_PUBLIC_EPAYCO_CUST_ID;
      const p_key = process.env.EPAYCO_PUBLIC_KEY || process.env.NEXT_PUBLIC_EPAYCO_PUBLIC_KEY;
      
      if (!p_cust_id || !p_key) {
        console.error('CRITICAL: Missing EPAYCO_CUST_ID or EPAYCO_PUBLIC_KEY environment variables.');
        return NextResponse.json({ 
          error: 'Configuration error', 
          details: 'Falta el ID de cliente o la Llave Pública de ePayco.' 
        }, { status: 500 });
      }

      // Construcción de la URL de Checkout (One Checkout hosted)
      // Esta es la forma más fiable cuando el SDK no tiene el método implementado.
      const queryParams = new URLSearchParams({
        p_cust_id_cliente: p_cust_id,
        p_key: p_key,
        p_id_invoice: orderId,
        p_description: paymentData.description,
        p_currency_code: 'COP',
        p_amount: paymentData.amount,
        p_tax: '0',
        p_amount_base: paymentData.amount,
        p_test_request: (process.env.EPAYCO_TEST_MODE === 'true' ? 'TRUE' : 'FALSE'),
        p_url_response: paymentData.response,
        p_url_confirmation: paymentData.confirmation,
        p_confirm_method: 'POST',
        extra1: orderId,
        extra2: customerInfo?.email || '',
        extra3: customerInfo?.name || '',
      });

      const checkoutUrl = `https://checkout.epayco.co/index.php?${queryParams.toString()}`;
      
      console.log('Generated Checkout URL:', checkoutUrl);

      // Retornamos la URL generada
      return NextResponse.json({ 
        url: checkoutUrl, 
        orderId: orderId,
        success: true 
      });

    } catch (sdkError: any) {
      console.error('Error constructing checkout URL:', sdkError);
      return NextResponse.json({ 
        error: 'Failed to create checkout session', 
        details: sdkError.message || 'Error construyendo URL de pago' 
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Global error in /api/epayco:', error);
    return NextResponse.json({ 
      error: 'Failed to create checkout session',
      details: error.message || 'Internal server error'
    }, { status: 500 });
  }
}
