
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.formData();
    const data = Object.fromEntries(body.entries());

    console.log('ePayco confirmation received:', data);

    // --- Signature Validation ---
    const p_cust_id = process.env.EPAYCO_CUST_ID;
    const p_key = process.env.EPAYCO_SECRET_KEY; // This is the P_KEY from your ePayco dashboard

    const x_ref_payco = data.x_ref_payco as string;
    const x_transaction_id = data.x_transaction_id as string;
    const x_amount = data.x_amount as string;
    const x_currency_code = data.x_currency_code as string;
    const x_signature = data.x_signature as string;

    const signature = crypto
      .createHash('sha256')
      .update(`${p_cust_id}^${p_key}^${x_ref_payco}^${x_transaction_id}^${x_amount}^${x_currency_code}`)
      .digest('hex');

    if (signature !== x_signature) {
      console.error('ePayco confirmation: Invalid signature.');
      // Respond with an error, but still a 200 OK so ePayco doesn't retry.
      return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 400 });
    }

    // --- Process Transaction State ---
    const transactionState = data.x_cod_transaction_state as string;
    console.log(`ePayco confirmation: Transaction state is ${transactionState}`);

    switch (transactionState) {
      case '1': // Aceptada
        console.log(`ePayco confirmation: Payment for invoice ${data.x_invoice} was successful.`);
        // TODO: Update order status in your database to 'paid'
        break;
      case '2': // Rechazada
        console.log(`ePayco confirmation: Payment for invoice ${data.x_invoice} was rejected.`);
        // TODO: Update order status in your database to 'rejected'
        break;
      case '3': // Pendiente
        console.log(`ePayco confirmation: Payment for invoice ${data.x_invoice} is pending.`);
        // TODO: Update order status in your database to 'pending'
        break;
      default:
        console.log(`ePayco confirmation: Unknown transaction state ${transactionState} for invoice ${data.x_invoice}.`);
        break;
    }

    // Respond to ePayco to acknowledge receipt
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('ePayco confirmation error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
