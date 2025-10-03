import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useState => from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';

interface TransactionData {
    x_transaction_state: string;
    x_ref_payco: string;
    x_id_invoice: string;
    x_amount: string;
    x_currency_code: string;
    x_transaction_date: string;
}

export default function RespuestaPago() {
    const searchParams = useSearchParams();
    const ref_payco = searchParams.get('ref_payco');
    const [transactionData, setTransactionData] = useState<TransactionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (refPayco) {
      const verifyPayment = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/verificar-pago?ref_payco=${refPayco}`);
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Error al verificar la transacción.');
          }

          setTransaction(data.data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      verifyPayment();
    } else {
      setError('No se encontró referencia de pago.');
      setLoading(false);
    }
  }, [refPayco]);

  const getStatusMessage = () => {
    if (!transaction) return null;

    switch (transaction.x_transaction_state) {
      case 'Aceptada':
        return <Alert variant="success">¡Pago aprobado! Gracias por tu compra.</Alert>;
      case 'Rechazada':
        return <Alert variant="danger">Pago rechazado. Por favor, intenta de nuevo.</Alert>;
      case 'Pendiente':
        return <Alert variant="warning">Tu pago está pendiente. Te notificaremos cuando se confirme.</Alert>;
      default:
        return <Alert variant="info">Estado de la transacción: {transaction.x_transaction_state}</Alert>;
    }
  };

  return (
    <Container className="my-5">
      <Card>
        <Card.Header as="h4">Respuesta de la Transacción</Card.Header>
        <Card.Body className="text-center">
          {loading ? (
            <>
              <Spinner animation="border" role="status" className="me-2" />
              <span>Verificando estado del pago...</span>
            </>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <div>
              {getStatusMessage()}
              <ListGroup variant="flush" className="my-3 text-start">
                <ListGroup.Item><strong>Referencia:</strong> {transaction?.x_ref_cod_transaccion}</ListGroup.Item>
                <ListGroup.Item><strong>Factura:</strong> {transaction?.x_id_invoice}</ListGroup.Item>
                <ListGroup.Item><strong>Valor:</strong> {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(transaction?.x_amount)}</ListGroup.Item>
                <ListGroup.Item><strong>Descripción:</strong> {transaction?.x_description}</ListGroup.Item>
              </ListGroup>
            </div>
          )}
           <Link href="/" passHref>
            <Button variant="primary">Volver a la tienda</Button>
          </Link>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default function RespuestaPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <EpaycoResponse />
        </Suspense>
    )
}