
import { Container, Button, Row, Col } from 'react-bootstrap';
import Link from 'next/link';

const heroStyle = {
  background: `url('https://images.unsplash.com/photo-1508514177221-188b2cf16a7a?q=80&w=2070&auto=format&fit=crop') no-repeat center center`,
  backgroundSize: 'cover',
  color: 'white',
  padding: '100px 0',
  textAlign: 'center' as const, // Use as const for type safety
  textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
};

export default function HomePage() {
  return (
    <div className="mb-5">
      <div style={heroStyle}>
        <Container>
          <h1 className="display-3 fw-bold" style={{ color: '#008000' }}>Energía Limpia a tu Alcance</h1>
          <p className="lead fs-4" style={{ color: '#008000' }}>
            Equipos de energía solar de alta calidad y la mejor tecnología para tu hogar y negocio.
          </p>
          <Link href="/productos" passHref legacyBehavior>
            <Button variant="primary" size="lg">Ver Productos</Button>
          </Link>
        </Container>
      </div>

      <Container className="mt-5">
        <h2 className="text-center mb-4">¿Por qué elegirnos?</h2>
        <Row className="text-center">
          <Col md={4}>
            <h3>Paneles Solares de Alta Eficiencia</h3>
            <p>Maximiza tu independencia energética con nuestra selección de paneles de alta eficiencia.</p>
          </Col>
          <Col md={4}>
            <h3>Inversores y Baterías Confiables</h3>
            <p>El corazón de tu sistema solar. Potencia y almacenamiento seguro y duradero.</p>
          </Col>
          <Col md={4}>
            <h3>Tecnología de Punta</h3>
            <p>Descubre lo último en dispositivos electrónicos para complementar tu estilo de vida sostenible.</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
