'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Container, Alert, Spinner, Card } from 'react-bootstrap';
import Link from 'next/link';

function ResponseContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [transactionData, setTransactionData] = useState<any>(null);

  useEffect(() => {
    const ref_payco = searchParams.get('ref_payco');

    if (!ref_payco) {
      setError('No se encontró una referencia de pago.');
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch('/api/epayco/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ref_payco }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Error al verificar el pago.');
        }

        setStatus(result.status);
        setTransactionData(result);

        // Si la transacción es aceptada, limpiar el carrito
        if (result.code === 1) {
          clearCart();
        }

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, clearCart]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);
  };

  const renderStatusMessage = () => {
    if (loading) {
      return (
        <div className="text-center">
          <Spinner animation="border" role="status" className="me-2" />
          <span>Verificando el estado de tu pago...</span>
        </div>
      );
    }

    if (error) {
      return <Alert variant="danger">Error: {error}</Alert>;
    }

    switch (status) {
      case 'Aceptada':
        return (
          <Alert variant="success">
            <Alert.Heading>¡Gracias por tu compra!</Alert.Heading>
            <p>Tu pago ha sido procesado exitosamente.</p>
            {transactionData && (
              <div>
                <p className="mb-1"><strong>Factura:</strong> {transactionData.invoice}</p>
                <p className="mb-0"><strong>Monto:</strong> {formatPrice(parseFloat(transactionData.amount))}</p>
              </div>
            )}
          </Alert>
        );
      case 'Pendiente':
        return (
          <Alert variant="warning">
            <Alert.Heading>Pago Pendiente</Alert.Heading>
            <p>Tu pago está pendiente de confirmación. Te notificaremos por correo electrónico una vez que se complete el proceso.</p>
             {transactionData && <p className="mb-1"><strong>Factura:</strong> {transactionData.invoice}</p>}
          </Alert>
        );
      case 'Rechazada':
      case 'Fallida':
        return (
          <Alert variant="danger">
            <Alert.Heading>Pago Rechazado</Alert.Heading>
            <p>Lo sentimos, tu pago no pudo ser procesado. Por favor, intenta con otro método de pago o contacta a tu banco.</p>
            {transactionData && <p className="mb-1"><strong>Razón:</strong> {transactionData.message}</p>}
          </Alert>
        );
      default:
        return <Alert variant="info">Estado de la transacción: {status || 'Desconocido'}</Alert>;
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              {renderStatusMessage()}
              {!loading && (
                <div className="mt-4 text-center">
                  <Link href="/" passHref>
                    <Button variant="primary">Volver a la tienda</Button>
                  </Link>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

// Usamos Suspense para poder usar useSearchParams en un componente de cliente
export default function ResponsePage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ResponseContent />
    </Suspense>
  );
}
