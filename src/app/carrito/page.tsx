'use client';

import { useCart } from '@/context/CartContext';
import { Container, Row, Col, Table, Button, Image } from 'react-bootstrap';
import Link from 'next/link';

export default function CarritoPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);
  };

  return (
    <Container className="my-5">
      <h1 className="mb-4">Carrito de Compras</h1>
      {cart.length === 0 ? (
        <div className="text-center">
          <p className="fs-4">Tu carrito está vacío.</p>
          <Link href="/productos" passHref legacyBehavior>
            <Button variant="primary">Ver productos</Button>
          </Link>
        </div>
      ) : (
        <>
          <Table responsive hover className="align-middle">
            <thead>
              <tr>
                <th>Producto</th>
                <th className="text-end">Precio</th>
                <th className="text-center">Cantidad</th>
                <th className="text-end">Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <Image src={item.image} alt={item.name} width={80} height={80} style={{ objectFit: 'cover' }} rounded />
                      <span className="ms-3">{item.name}</span>
                    </div>
                  </td>
                  <td className="text-end">{formatPrice(item.price)}</td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center align-items-center">
                      <Button variant="outline-secondary" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</Button>
                      <span className="mx-2">{item.quantity}</span>
                      <Button variant="outline-secondary" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                    </div>
                  </td>
                  <td className="text-end">{formatPrice(item.price * item.quantity)}</td>
                  <td className="text-center">
                    <Button variant="danger" size="sm" onClick={() => removeFromCart(item.id)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Row className="mt-4">
            <Col md={6}>
              <Button variant="outline-danger" onClick={() => clearCart()}>Vaciar Carrito</Button>
            </Col>
            <Col md={6} className="text-end">
              <h3 className="fw-bold">Total: {formatPrice(total)}</h3>
              <Link href="/checkout" passHref legacyBehavior>
                <Button variant="success" size="lg" className="mt-2">Proceder al Pago</Button>
              </Link>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}
