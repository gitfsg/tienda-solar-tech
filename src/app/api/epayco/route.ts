
import { NextRequest, NextResponse } from 'next/server';
import { Order, CartItem } from '@/types'; // Import Order and CartItem types
import { saveOrder } from '@/lib/orders'; // Import the saveOrder function

const epayco = require('epayco-sdk-node')({
  apiKey: process.env.EPAYCO_PUBLIC_KEY,
  privateKey: process.env.EPAYCO_PRIVATE_KEY,
  lang: 'ES',
  test: process.env.EPAYCO_TEST_MODE === 'true',
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cart, total, customerInfo } = body; // Also expect customerInfo from the frontend

    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

    // Generate a unique order ID
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create a new pending order
    const newOrder: Order = {
      id: orderId,
      customerId: customerInfo?.email || 'guest', // Use email as customerId or 'guest'
      items: cart as CartItem[],
      totalAmount: total,
      currency: 'cop',
      orderDate: new Date().toISOString(),
      status: 'pending',
      customerInfo: customerInfo, // Save customer info
    };

    // Save the pending order
    await saveOrder(newOrder);

    // Lógica para crear el objeto de pago para ePayco
    const paymentData = {
      name: 'Compra en Tienda Solar Tech',
      description: `Compra de ${cart.length} productos`,
      invoice: orderId, // Use our generated orderId as ePayco's invoice
      currency: 'cop',
      amount: Math.round(total).toString(),
      tax_base: '0',
      tax: '0',
      country: 'CO',
      lang: 'es',

      response: `${baseUrl}/checkout/response`,
      confirmation: `${baseUrl}/api/epayco-confirmation`,

      extra1: orderId, // Also pass orderId in extra1 for redundancy
      extra2: customerInfo?.email || '',
      extra3: customerInfo?.name || '',
    };

    const { data } = await epayco.checkout.create(paymentData);

    return NextResponse.json({ url: data.url_checkout, orderId: orderId }); // Return orderId to frontend

  } catch (error) {
    console.error('Error creating ePayco checkout:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
