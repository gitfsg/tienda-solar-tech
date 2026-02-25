export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string; // Unique ID for the order, e.g., invoice number
  customerId?: string; // Optional: To link to a user if available, otherwise a guest ID
  items: CartItem[];
  totalAmount: number;
  currency: string;
  orderDate: string; // ISO date string
  status: 'pending' | 'paid' | 'rejected' | 'failed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentDetails?: { // Made optional as it might be added after payment initiation
    transactionId?: string; // ePayco x_ref_payco
    paymentMethod?: string; // e.g., 'ePayco'
    rawResponse?: any; // Store the full ePayco response for debugging/records
  };
  customerInfo?: { // Optional customer information, can be expanded
    name?: string;
    email?: string;
    // Add other relevant customer details
  };
}