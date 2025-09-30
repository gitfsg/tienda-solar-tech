import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5 p-4 text-center">
      <Container>
        <p>&copy; {new Date().getFullYear()} Tienda Solar y Tecnológica. Todos los derechos reservados.</p>
        <div className="mt-3">
          <a href="mailto:otherelec75@yahoo.com" className="text-white me-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          </a>
          <a href="https://wa.me/573164827994" target="_blank" rel="noopener noreferrer" className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19.6,4.4c-1.8-1.8-4.2-2.8-6.8-2.8c-5.3,0-9.6,4.3-9.6,9.6c0,1.7,0.4,3.4,1.3,4.9l-1.4,5.1l5.2-1.4 c1.4,0.8,3,1.2,4.6,1.2h0c5.3,0,9.6-4.3,9.6-9.6C22.4,8.6,21.4,6.2,19.6,4.4z M12.8,19.4h-0.1c-1.4,0-2.8-0.4-4-1.2l-0.3-0.2 l-3,0.8l0.8-2.9l-0.2-0.3c-0.9-1.4-1.3-3-1.3-4.7c0-4.3,3.5-7.8,7.8-7.8c2.1,0,4.1,0.8,5.5,2.3c1.5,1.5,2.3,3.4,2.3,5.5 C20.6,15.9,17.1,19.4,12.8,19.4z M16.9,14.2c-0.2-0.1-1.4-0.7-1.6-0.8c-0.2-0.1-0.4-0.1-0.5,0.1c-0.2,0.2-0.6,0.8-0.8,0.9 c-0.1,0.1-0.3,0.2-0.5,0.1c-0.2-0.1-1-0.4-1.9-1.2c-0.7-0.6-1.2-1.4-1.3-1.6c-0.1-0.2,0-0.4,0.1-0.5C10.9,11,11,10.9,11.1,10.7 c0.1-0.1,0.2-0.2,0.2-0.4c0.1-0.1,0-0.2,0-0.4C11.2,9.7,10.8,8.7,10.6,8.2c-0.2-0.5-0.4-0.4-0.5-0.4c-0.1,0-0.3,0-0.4,0 c-0.2,0-0.4,0.1-0.6,0.3c-0.2,0.2-0.8,0.7-0.8,1.8c0,1,0.8,2.1,0.9,2.2c0.1,0.1,1.6,2.5,3.9,3.4c0.5,0.2,1,0.4,1.3,0.5 c0.6,0.2,1.1,0.1,1.5-0.1c0.5-0.3,0.8-0.6,1.1-1.1c0.2-0.4,0.2-0.8,0.1-0.9C17.3,14.4,17.1,14.3,16.9,14.2z"></path></svg>
          </a>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;