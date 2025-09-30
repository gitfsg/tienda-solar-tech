
import { NextRequest, NextResponse } from 'next/server';

const epayco = require('epayco-sdk-node')({
  apiKey: process.env.EPAYCO_PUBLIC_KEY,
  privateKey: process.env.EPAYCO_PRIVATE_KEY,
  lang: 'ES',
  test: true,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cart, total } = body;

    // Lógica para crear el objeto de pago para ePayco
    // Esto es un ejemplo y debe ser adaptado según la documentación de ePayco
    const paymentData = {
      // Opciones de pago estándar
      name: 'Compra en Tienda Solar Tech',
      description: `Compra de ${cart.length} productos`,
      invoice: `INV-${Date.now()}`,
      currency: 'cop',
      amount: total.toString(),
      tax_base: '0',
      tax: '0',
      country: 'CO',
      lang: 'es',

      // URLs de respuesta
      response: `${process.env.NEXT_PUBLIC_URL}/checkout/response`,
      confirmation: `${process.env.NEXT_PUBLIC_URL}/api/epayco/confirmation`,

      // Atributos adicionales si son necesarios
      extra1: 'extra1',
      extra2: 'extra2',
      extra3: 'extra3',
    };

    const { data } = await epayco.checkout.create(paymentData);

    return NextResponse.json({ url: data.url_checkout });

  } catch (error) {
    console.error('Error creating ePayco checkout:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
