import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";
import { Container } from 'react-bootstrap';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tienda Solar y Tecnológica",
  description: "Venta de paneles solares, inversores, baterías y tecnología.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <CartProvider>
          <Header />
          <main>
            <Container className="mt-4">
              {children}
            </Container>
          </main>
          <Footer />
        </CartProvider>
        
      </body>
    </html>
  );
}