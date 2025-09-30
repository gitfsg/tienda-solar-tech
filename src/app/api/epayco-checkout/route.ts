
import { NextResponse } from 'next/server';
// @ts-ignore
import Epayco from 'epayco-sdk-node';

export async function POST(request: Request) {
  const { amount, description, invoice } = await request.json();

  // Initialize Epayco with credentials from environment variables
  const epayco = new Epayco({
    apiKey: process.env.EPAYCO_PUBLIC_KEY,
    privateKey: process.env.EPAYCO_SECRET_KEY,
    lang: 'ES',
    test: true, // Use true for testing, false for production
  });

  const paymentDetails = {
    // Epayco Required Parameters
    name: description,
    description: description,
    invoice: invoice,
    currency: 'cop', // Currency (COP for Colombian Peso)
    amount: amount.toString(),
    tax_base: '0',
    tax: '0',
    country: 'co',
    lang: 'es',

    // URLs for redirection after payment
    url_response: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/response`,
    url_confirmation: `${process.env.NEXT_PUBLIC_BASE_URL}/api/epayco-confirmation`,

    // Method for confirmation
    method_confirmation: 'POST',

    // Optional: Prefill customer data
    // extra1: 'John',
    // extra2: 'Doe',
  };

  try {
    const checkoutData = await epayco.checkout.create(paymentDetails);
    return NextResponse.json(checkoutData);
  } catch (error: any) {
    console.error('Epayco API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
