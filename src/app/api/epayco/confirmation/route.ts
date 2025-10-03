
import { NextResponse } from 'next/server';
import crypto from 'crypto';

interface EpaycoConfirmationBody {
    x_cust_id_cliente: string;
    x_ref_payco: string;
    x_id_invoice: string;
    x_amount: string;
    x_currency_code: string;
    x_signature: string;
    x_cod_transaction_state: string;
    x_transaction_state: string;
}

export async function POST(req: Request) {
    const body: EpaycoConfirmationBody = await req.json();

    // 1. Extraer datos de la respuesta de ePayco
    const signature = data.x_signature;
    const custId = process.env.EPAYCO_CUST_ID;
    const pKey = process.env.EPAYCO_P_KEY;
    const refPayco = data.x_ref_payco;
    const transactionId = data.x_transaction_id;
    const amount = data.x_amount;
    const currencyCode = data.x_currency_code;
    const transactionState = data.x_transaction_state;

    // 2. Validar la firma para asegurar que la petición viene de ePayco
    if (!pKey || !custId) {
      console.error('Error: Las credenciales de validación de ePayco (P_KEY, CUST_ID) no están configuradas.');
      return NextResponse.json({ error: 'Configuración de servidor incompleta.' }, { status: 500 });
    }

    const signatureString = `${custId}^${pKey}^${refPayco}^${transactionId}^${amount}^${currencyCode}`;
    const calculatedSignature = crypto.createHash('sha256').update(signatureString).digest('hex');

    if (signature !== calculatedSignature) {
      console.warn('Firma de ePayco inválida. Posible intento de fraude.', { received: signature, calculated: calculatedSignature });
      return NextResponse.json({ error: 'Firma inválida' }, { status: 400 });
    }

    // 3. Si la firma es válida, procesar la transacción
    console.log(`Confirmación de ePayco recibida para ${refPayco}. Estado: ${transactionState}`);

    // TODO: Aquí va la lógica de negocio principal.
    // - Busca el pedido en tu base de datos usando `data.x_extra1` o `data.x_invoice`.
    // - Actualiza el estado del pedido según `transactionState` ('Aceptada', 'Rechazada', 'Pendiente').
    // - Si el estado es 'Aceptada', reduce el inventario, envía correos de confirmación, etc.
    // - Si es 'Rechazada', actualiza el pedido como fallido.

    switch (transactionState) {
      case 'Aceptada':
        console.log(`Pedido ${data.x_invoice} ACEPTADO. Actualizando base de datos.`);
        // Ejemplo: await updateOrderStatus(data.x_invoice, 'pagado');
        break;
      case 'Rechazada':
        console.log(`Pedido ${data.x_invoice} RECHAZADO. Actualizando base de datos.`);
        // Ejemplo: await updateOrderStatus(data.x_invoice, 'fallido');
        break;
      case 'Pendiente':
        console.log(`Pedido ${data.x_invoice} PENDIENTE. Actualizando base de datos.`);
        // Ejemplo: await updateOrderStatus(data.x_invoice, 'pendiente');
        break;
      default:
        console.log(`Estado no manejado: ${transactionState}`);
    }

    // 4. Responder a ePayco con un status 200 para que no siga enviando notificaciones.
    return NextResponse.json({ success: true, message: 'Confirmación recibida' }, { status: 200 });

  } catch (error: any) {
    console.error('Error en el webhook de confirmación de ePayco:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
