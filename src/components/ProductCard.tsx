'use client';

import { Card, Button } from 'react-bootstrap';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  return (
    <Card className="h-100 shadow-sm">
      <div style={{ height: '200px', position: 'relative' }}>
        <Image
          src={product.image}
          alt={product.name}
          layout="fill"
          objectFit="contain"
          unoptimized // Since we are using a placeholder service
        />
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>{product.description}</Card.Text>
        <Card.Text className="fs-4 fw-bold mt-auto">
          ${new Intl.NumberFormat('es-CO').format(product.price)}
        </Card.Text>
        <Button variant="primary" onClick={() => addToCart(product, 1)}>
          Agregar al Carrito
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;