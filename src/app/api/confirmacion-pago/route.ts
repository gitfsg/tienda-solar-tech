import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Get keys from environment variables
    const pCustId = process.env.EPAYCO_CUST_ID; // Corrected variable
    const pKey = process.env.EPAYCO_SECRET_KEY; // Corrected variable

    if (!pCustId || !pKey) {
      console.error('Missing ePayco merchant credentials (EPAYCO_CUST_ID or EPAYCO_SECRET_KEY)');
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    // 2. Validate the signature
    const signature = body.x_signature;
    const sign = crypto.createHash('sha256')
      .update(
        `${pCustId}^${pKey}^${body.x_ref_payco}^${body.x_transaction_id}^${body.x_amount}^${body.x_currency_code}`
      )
      .digest('hex');

    if (signature !== sign) {
      console.warn('ePayco signature mismatch. Possible tampering.', { received: signature, expected: sign });
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // 3. Process the transaction state
    const transactionState = body.x_cod_transaction_state;
    const invoiceId = body.x_id_invoice;

    console.log(`ePayco Webhook: Invoice ${invoiceId} - State: ${transactionState}`);

    switch (transactionState) {
      case 1: // Aceptada
        console.log(`Payment accepted for invoice ${invoiceId}.`);
        // TODO: Update your database here. Mark the order as paid.
        // Example: await db.orders.update({ where: { id: invoiceId }, data: { status: 'PAID' } });
        break;
      case 2: // Rechazada
        console.log(`Payment rejected for invoice ${invoiceId}.`);
        // TODO: Update your database. Mark the order as rejected or failed.
        // Example: await db.orders.update({ where: { id: invoiceId }, data: { status: 'REJECTED' } });
        break;
      case 3: // Pendiente
        console.log(`Payment pending for invoice ${invoiceId}.`);
        // TODO: Update your database. Mark the order as pending.
        // Example: await db.orders.update({ where: { id: invoiceId }, data: { status: 'PENDING' } });
        break;
      default:
        console.log(`Unknown transaction state ${transactionState} for invoice ${invoiceId}.`);
    }

    // 4. Respond to ePayco to acknowledge receipt
    return NextResponse.json({ success: true, message: 'Webhook received' }, { status: 200 });

  } catch (error: any) {
    console.error('Error processing ePayco webhook:', error.message);
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}
