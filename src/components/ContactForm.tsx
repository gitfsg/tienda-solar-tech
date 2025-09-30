'use client';

import { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';

const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const date = new Date().toLocaleString();
    const body = `Nombre: ${name}\nCorreo: ${email}\nFecha y Hora: ${date}\n\nMensaje:\n${message}`;
    const mailtoLink = `mailto:otherelec75@yahoo.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formName">
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ingrese su nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
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
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Enviar Mensaje
      </Button>
    </Form>
  );
};

export default ContactForm;
