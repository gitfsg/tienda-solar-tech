'use client';

import { useState } from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';

export default function ProductosPage() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const categories = ['Todos', ...new Set(products.map(p => p.category))];

  const filteredProducts = selectedCategory === 'Todos'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <Container>
      <h1 className="my-4">Nuestros Productos</h1>

      <Nav variant="tabs" defaultActiveKey="Todos" onSelect={(k) => setSelectedCategory(k || 'Todos')}>
        {categories.map(category => (
          <Nav.Item key={category}>
            <Nav.Link eventKey={category}>{category}</Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      <Row xs={1} md={2} lg={3} className="g-4 mt-3">
        {filteredProducts.map(product => (
          <Col key={product.id}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
