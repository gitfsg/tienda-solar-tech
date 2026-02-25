
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';

const heroStyle = {
  background: `linear-gradient(rgba(255,255,255,0.4), rgba(255,255,255,0.4)), url('https://images.unsplash.com/photo-1508514177221-188b2cf16a7a?q=80&w=2070&auto=format&fit=crop') no-repeat center center`,
  backgroundSize: 'cover',
  color: 'white',
  padding: '100px 0',
  textAlign: 'center' as const, // Use as const for type safety
  textShadow: '2px 2px 8px rgba(0,0,0,0.4)',
};

export default function HomePage() {
  return (
    <div className="mb-5">
      <div style={heroStyle}>
        <Container>
          <h1 className="display-3 fw-bold" style={{ color: '#2D5A27', textShadow: '1px 1px 2px rgba(255,255,255,0.8)' }}>Energía Limpia a tu Alcance</h1>
          <p className="lead fs-4" style={{ color: '#2D5A27', fontWeight: '500' }}>
            Equipos de energía solar de alta calidad y la mejor tecnología para tu hogar y negocio.
          </p>
          <Link href="/productos" style={{ textDecoration: 'none' }}>
            <div className="banner-container">
              <div className="banner-content">
                <img src="/inversor MUST 3000w 24vdc 120vac LVHM (1).jpg" alt="Inversor MUST" className="banner-img" />
                <img src="/Paneles solares en techo 1.jpeg" alt="Paneles solares en techo" className="banner-img" />
                <img src="/Productos tecnologia 2.jpg" alt="Productos Tecnología" className="banner-img" />
                <img src="/batería LITIO 24vdc.jpg" alt="Batería de Litio" className="banner-img" />
                {/* Duplicated images for infinite loop */}
                <img src="/inversor MUST 3000w 24vdc 120vac LVHM (1).jpg" alt="Inversor MUST" className="banner-img" />
                <img src="/Paneles solares en techo 1.jpeg" alt="Paneles solares en techo" className="banner-img" />
                <img src="/Productos tecnologia 2.jpg" alt="Productos Tecnología" className="banner-img" />
                <img src="/batería LITIO 24vdc.jpg" alt="Batería de Litio" className="banner-img" />
              </div>
            </div>
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
