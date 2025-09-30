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