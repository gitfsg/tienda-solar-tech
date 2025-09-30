import { NextResponse } from 'next/server';
import Epayco from 'epayco-sdk-node';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const refPayco = searchParams.get('ref_payco');

  if (!refPayco) {
    return NextResponse.json({ error: 'Falta el parámetro ref_payco' }, { status: 400 });
  }

  try {
    const epayco = new Epayco({
      apiKey: process.env.NEXT_PUBLIC_EPAYCO_PUBLIC_KEY || '',
      privateKey: process.env.EPAYCO_PRIVATE_KEY || '',
      lang: 'ES',
      test: process.env.EPAYCO_TEST_MODE === 'true',
    });

    const transaction = await epayco.transaction.get(refPayco);

    return NextResponse.json(transaction);

  } catch (error: any) {
    console.error('Error al verificar la transacción de ePayco:', error.message);
    return NextResponse.json({ error: 'Error al consultar la transacción' }, { status: 500 });
  }
}
