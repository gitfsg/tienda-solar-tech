'use client';

import { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';

const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (response.ok) {
        setSuccess(true);
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        const data = await response.json();
        setError(data.error || 'Ocurrió un error al enviar el mensaje. Por favor intenta de nuevo.');
      }
    } catch (err) {
      setError('Error de conexión. Por favor verifica tu internet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      {success && <div className="alert alert-success">¡Mensaje enviado con éxito! Nos contactaremos pronto.</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formName">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese su nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Correo Electrónico</Form.Label>
          <Form.Control
            type="email"
            placeholder="Ingrese su correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formSubject">
          <Form.Label>Asunto</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese el asunto"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            disabled={loading}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formMessage">
          <Form.Label>Mensaje</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="Escriba su mensaje aquí"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            disabled={loading}
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar Mensaje'}
        </Button>
      </Form>
    </Container>
  );
};

export default ContactForm;
