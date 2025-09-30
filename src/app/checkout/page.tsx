'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { useCart } from '@/context/CartContext';
import { Container, Row, Col, Form, Button, Card, ListGroup, Alert } from 'react-bootstrap';

// This tells TypeScript that the Epayco object will exist on the window
declare global {
  interface Window {
    Epayco: any;
  }
}

export default function CheckoutPage() {
  const { cart } = useCart();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setError('Tu carrito está vacío.');
      return;
    }

    if (!window.Epayco) {
      setError('El servicio de pago no está disponible. Por favor, recarga la página e intenta de nuevo.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const epaycoHandler = window.Epayco.checkout.configure({
        key: process.env.NEXT_PUBLIC_EPAYCO_PUBLIC_KEY,
        test: true, // Set to true for testing, false for production
      });

      const invoice = `INV-${Date.now()}`;
      const description = cart.map(item => `${item.name} (x${item.quantity})`).join(', ');

      const checkoutData = {
        name: "Pago de productos en Tienda Solar Tech",
        description: description,
        invoice: invoice,
        currency: "cop",
        amount: total.toString(),
        tax_base: "0",
        tax: "0",
        country: "co",
        lang: "es",
        
        name_billing: formData.name,
        email_billing: formData.email,
        address_billing: formData.shippingAddress,
        mobilephone_billing: formData.phone,
        city_billing: formData.city,
        
        response: `${window.location.origin}/respuesta-pago`,
        confirmation: `${process.env.NEXT_PUBLIC_BASE_URL}/api/confirmacion-pago`,


      };

      epaycoHandler.open(checkoutData);

    } catch (error) {
      console.error('Error during ePayco checkout:', error);
      setError('Ocurrió un error al procesar el pago. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.epayco.co/checkout.js"
        strategy="afterInteractive"
      />
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