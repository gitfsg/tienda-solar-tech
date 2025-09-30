
import { NextRequest, NextResponse } from 'next/server';

// Configuración de ePayco (asegúrate de que las variables de entorno estén configuradas)
const epayco = require('epayco-sdk-node')({
  apiKey: process.env.EPAYCO_PUBLIC_KEY,
  privateKey: process.env.EPAYCO_PRIVATE_KEY,
  lang: 'ES',
  test: true, // Poner en false para producción
});

export async function POST(req: NextRequest) {
  try {
    const { ref_payco } = await req.json();

    if (!ref_payco) {
      return NextResponse.json({ error: 'Falta la referencia de pago (ref_payco)' }, { status: 400 });
    }

    const transaction = await epayco.charge.get(ref_payco);

    // Extraemos los datos relevantes de la transacción
    const { 
      x_response, 
      x_cod_response, 
      x_transaction_state, 
      x_amount,
      x_currency_code,
      x_invoice
    } = transaction.data;

    // x_cod_response: 1 (Aceptada), 2 (Rechazada), 3 (Pendiente), 4 (Fallida)
    return NextResponse.json({
      success: true,
      status: x_transaction_state, // e.g., 'Aceptada', 'Rechazada', 'Pendiente'
      code: x_cod_response,
      message: x_response,
      amount: x_amount,
      currency: x_currency_code,
      invoice: x_invoice,
      data: transaction.data // Opcional: devolver todos los datos para depuración
    });

  } catch (error: any) {
    console.error('Error al verificar la transacción de ePayco:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error al verificar la transacción.',
      details: error.message 
    }, { status: 500 });
  }
}
