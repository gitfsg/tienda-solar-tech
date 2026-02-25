import fs from 'fs/promises';
import path from 'path';
import { Order } from '@/types';

const ORDERS_FILE_PATH = path.join(process.cwd(), '.gemini', 'orders.json'); // Storing in .gemini directory

async function readOrdersFile(): Promise<Order[]> {
  try {
    const data = await fs.readFile(ORDERS_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // File does not exist, return empty array
      return [];
    }
    console.error('Error reading orders file:', error);
    throw new Error('Failed to read orders data.');
  }
}

async function writeOrdersFile(orders: Order[]): Promise<void> {
  try {
    // Ensure the directory exists
    await fs.mkdir(path.dirname(ORDERS_FILE_PATH), { recursive: true });
    await fs.writeFile(ORDERS_FILE_PATH, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing orders file:', error);
    throw new Error('Failed to save orders data.');
  }
}

export async function saveOrder(order: Order): Promise<void> {
  const orders = await readOrdersFile();
  orders.push(order);
  await writeOrdersFile(orders);
}

export async function findOrderById(orderId: string): Promise<Order | undefined> {
  const orders = await readOrdersFile();
  return orders.find(order => order.id === orderId);
}

export async function updateOrderStatus(orderId: string, status: Order['status'], paymentDetails?: Order['paymentDetails']): Promise<void> {
  const orders = await readOrdersFile();
  const orderIndex = orders.findIndex(order => order.id === orderId);

  if (orderIndex === -1) {
    throw new Error(`Order with ID ${orderId} not found.`);
  }

  orders[orderIndex].status = status;
  if (paymentDetails) {
    orders[orderIndex].paymentDetails = {
      ...orders[orderIndex].paymentDetails, // Keep existing details
      ...paymentDetails, // Override with new details
    };
  }

  await writeOrdersFile(orders);
}