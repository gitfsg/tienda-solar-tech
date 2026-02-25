
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { updateOrderStatus, findOrderById } from '@/lib/orders'; // Import order functions
import { Order } from '@/types'; // Import Order type

export async function POST(request: Request) {
  try {
    const body = await request.formData();
    const data = Object.fromEntries(body.entries());

    console.log('ePayco confirmation received:', data);

    // --- Signature Validation ---
    const p_cust_id = process.env.EPAYCO_CUST_ID;
    const p_key = process.env.EPAYCO_PRIVATE_KEY;

    const x_ref_payco = data.x_ref_payco as string;
    const x_transaction_id = data.x_transaction_id as string;
    const x_amount = data.x_amount as string;
    const x_currency_code = data.x_currency_code as string;
    const x_signature = data.x_signature as string;
    const x_invoice = data.x_invoice as string; // Our orderId

    if (!p_cust_id || !p_key) {
      console.error('Error: EPAYCO_CUST_ID or EPAYCO_PRIVATE_KEY is not configured.');
      return NextResponse.json({ success: false, message: 'Server configuration error' }, { status: 500 });
    }

    const signatureString = `${p_cust_id}^${p_key}^${x_ref_payco}^${x_transaction_id}^${x_amount}^${x_currency_code}`;
    const calculatedSignature = crypto.createHash('sha256').update(signatureString).digest('hex');

    if (x_signature !== calculatedSignature) {
      console.error('ePayco confirmation: Invalid signature.', { received: x_signature, calculated: calculatedSignature });
      return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 400 });
    }

    // --- Process Transaction State and Update Order ---
    const x_response = data.x_response as string;
    const x_cod_transaction_state = data.x_cod_transaction_state as string;
    const x_response_reason_text = data.x_response_reason_text as string;
    let newOrderStatus: Order['status'] = 'failed'; // Default to failed

    switch (x_response) {
      case 'Aceptada':
        newOrderStatus = 'paid';
        console.log(`ePayco confirmation: Payment for invoice ${x_invoice} was successful.`);
        break;
      case 'Rechazada':
        newOrderStatus = 'rejected';
        console.log(`ePayco confirmation: Payment for invoice ${x_invoice} was rejected. Reason: ${x_response_reason_text}`);
        break;
      case 'Pendiente':
        newOrderStatus = 'pending';
        console.log(`ePayco confirmation: Payment for invoice ${x_invoice} is pending.`);
        break;
      case 'Fallida':
        newOrderStatus = 'failed';
        console.log(`ePayco confirmation: Payment for invoice ${x_invoice} failed. Reason: ${x_response_reason_text}`);
        break;
      default:
        console.log(`ePayco confirmation: Unknown transaction state ${x_response} for invoice ${x_invoice}.`);
        break;
    }

    console.log(`ePayco confirmation: Order ${x_invoice} new status will be ${newOrderStatus}`);

    const paymentDetails = {
      transactionId: x_ref_payco,
      paymentMethod: 'ePayco',
      rawResponse: data, // Store the full response for records
    };

    try {
      await updateOrderStatus(x_invoice, newOrderStatus, paymentDetails);
      console.log(`Order ${x_invoice} status updated to ${newOrderStatus}`);
    } catch (error) {
      console.error(`Error updating status for order ${x_invoice}:`, error);
      // Even if order update fails, respond 200 to ePayco to prevent retries
      return NextResponse.json({ success: false, message: 'Failed to update order status internally' }, { status: 500 });
    }

    // Respond to ePayco to acknowledge receipt
    return NextResponse.json({ success: true, message: 'Confirmation received and processed' });

  } catch (error: any) {
    console.error('ePayco confirmation error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
