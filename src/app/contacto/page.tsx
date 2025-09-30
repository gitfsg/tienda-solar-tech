
import ContactForm from '@/components/ContactForm';
import { Container } from 'react-bootstrap';

const ContactoPage = () => {
  return (
    <Container className="my-5">
      <h1>Contacto</h1>
      <p>
        Utilice el siguiente formulario para enviarnos un mensaje.
      </p>
      <ContactForm />
    </Container>
  );
};

export default ContactoPage;
