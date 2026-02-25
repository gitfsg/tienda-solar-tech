'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { useCart } from '@/context/CartContext';
import { Container, Row, Col, Form, Button, Card, ListGroup, Alert } from 'react-bootstrap';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart(); // Get clearCart
  const router = useRouter(); // Initialize useRouter
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    shippingAddress: '',
    department: '',
    city: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setError('Tu carrito está vacío.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/epayco', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart: cart,
          total: total,
          customerInfo: formData, // Pass customer info
        }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        clearCart(); // Clear cart after successful checkout initiation
        router.push(data.url); // Redirect to ePayco checkout URL
      } else {
        setError(data.error || 'Ocurrió un error al iniciar el pago con ePayco.');
      }

    } catch (err) {
      console.error('Error during ePayco checkout initiation:', err);
      setError('Ocurrió un error de red al procesar el pago. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container className="my-5">
        <h1 className="mb-4">Finalizar Compra</h1>
        <Row>
          <Col md={7}>
            <Card>
              <Card.Header as="h4">Información del Cliente</Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Nombre Completo</Form.Label>
                    <Form.Control type="text" name="name" required onChange={handleInputChange} value={formData.name} />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Correo Electrónico</Form.Label>
                    <Form.Control type="email" name="email" required onChange={handleInputChange} value={formData.email} />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formShippingAddress">
                    <Form.Label>Dirección de envío</Form.Label>
                    <Form.Control type="text" name="shippingAddress" required onChange={handleInputChange} value={formData.shippingAddress} />
                  </Form.Group>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formDepartment">
                        <Form.Label>Departamento</Form.Label>
                        <Form.Control type="text" name="department" required onChange={handleInputChange} value={formData.department} />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formCity">
                        <Form.Label>Ciudad</Form.Label>
                        <Form.Control type="text" name="city" required onChange={handleInputChange} value={formData.city} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3" controlId="formPhone">
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control type="tel" name="phone" required onChange={handleInputChange} value={formData.phone} />
                  </Form.Group>
                  


                  <hr />
                  <div className="d-grid">
                    <Button variant="primary" type="submit" disabled={loading || cart.length === 0}>
                      {loading ? 'Procesando...' : 'CONTINUAR'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col md={5}>
            <Card>
              <Card.Header as="h4">Resumen del Pedido</Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  {cart.map(item => (
                    <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
                      <div>
                        {item.name} <span className="text-muted">x{item.quantity}</span>
                      </div>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </ListGroup.Item>
                  ))}
                  <ListGroup.Item className="d-flex justify-content-between align-items-center fw-bold fs-5">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          </Col>
        </Row>
      </Container>
    </>
  );
}