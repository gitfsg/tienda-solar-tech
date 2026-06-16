import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { CartItem } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cart, total, customerInfo } = body;

    // Validación básica
    if (!cart || !Array.isArray(cart) || cart.length === 0 || !customerInfo) {
      return NextResponse.json({ error: 'Datos de pedido incompletos' }, { status: 400 });
    }

    // Configuración del transportador de correo
    // Se recomienda usar variables de entorno para estos valores
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true', // true para 465, false para otros puertos
      auth: {
        user: process.env.EMAIL_USER, // Tu correo
        pass: process.env.EMAIL_PASS, // Tu contraseña o contraseña de aplicación
      },
    });

    const itemsHtml = cart.map((item: CartItem) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toLocaleString('es-CO')}</td>
      </tr>
    `).join('');

    const totalFormatted = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(total);

    // 1. Correo para el ADMINISTRADOR
    const adminMailOptions = {
      from: `"Tienda Solar Tech" <${process.env.EMAIL_USER}>`,
      to: 'francisega@gmail.com',
      subject: `NUEVO PEDIDO: ${customerInfo.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
          <h2 style="color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 10px;">Nuevo Pedido Recibido</h2>

          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #e67e22;">Datos del Cliente</h3>
            <p style="margin: 5px 0;"><strong>Nombre Completo:</strong> ${customerInfo.name}</p>
            <p style="margin: 5px 0;"><strong>Correo Electrónico:</strong> ${customerInfo.email}</p>
            <p style="margin: 5px 0;"><strong>Teléfono/Celular:</strong> ${customerInfo.phone}</p>
          </div>

          <div style="background-color: #f0f7ff; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #2980b9;">Información de Envío</h3>
            <p style="margin: 5px 0;"><strong>Dirección:</strong> ${customerInfo.shippingAddress}</p>
            <p style="margin: 5px 0;"><strong>Ciudad:</strong> ${customerInfo.city}</p>
            <p style="margin: 5px 0;"><strong>Departamento:</strong> ${customerInfo.department}</p>
          </div>

          <h3 style="color: #2c3e50;">Resumen del Pedido</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f8f8f8;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Producto</th>
                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Cant.</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 15px; font-weight: bold; text-align: right; font-size: 1.2em;">Total:</td>
                <td style="padding: 15px; font-weight: bold; text-align: right; font-size: 1.2em; color: #27ae60;">${totalFormatted}</td>
              </tr>
            </tfoot>
          </table>

          <div style="margin-top: 30px; text-align: center;">
            <a href="https://wa.me/57${customerInfo.phone.replace(/\s+/g, '')}" style="background-color: #25d366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Contactar al Cliente por WhatsApp
            </a>
          </div>
        </div>
      `,
    };

    // 2. Correo para el CLIENTE
    const customerMailOptions = {
      from: `"Tienda Solar Tech" <${process.env.EMAIL_USER}>`,
      to: customerInfo.email,
      subject: `Confirmación de tu pedido en Tienda Solar Tech`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
          <h2 style="color: #333;">¡Hola ${customerInfo.name}!</h2>
          <p>Hemos recibido tu solicitud de pedido. A continuación los detalles:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
              <tr style="background-color: #f8f8f8;">
                <th style="padding: 10px; text-align: left;">Producto</th>
                <th style="padding: 10px; text-align: center;">Cant.</th>
                <th style="padding: 10px; text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 10px; font-weight: bold; text-align: right;">Total a Pagar:</td>
                <td style="padding: 10px; font-weight: bold; text-align: right;">${totalFormatted}</td>
              </tr>
            </tfoot>
          </table>

          <div style="background-color: #fff9c4; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <h3 style="margin-top: 0;">Información de Pago</h3>
            <p>Para completar tu compra, puedes realizar el pago a través del siguiente medio:</p>
            <p><strong>Transferencia Bancaria:</strong><br>
            Banco: <strong>BANCOLOMBIA</strong><br>
            Tipo: <strong>Cuenta de ahorros</strong><br>
            Número: <strong>20723039559</strong><br>
            Titular: <strong>FRANCISCO SERNA GAVIRIA</strong></p>
            <p>Una vez realizado el pago, por favor envía el comprobante a nuestro WhatsApp: <a href="https://wa.me/573046073273">304 607 3273</a> para procesar tu envío de inmediato.</p>
          </div>

          <p style="font-size: 12px; color: #777; margin-top: 20px;">
            Si tienes alguna duda, contáctanos a francisega@gmail.com
          </p>
        </div>
      `,
    };

    // Enviar correos
    // Nota: En producción, asegúrate de tener configurado el transporte correctamente.
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(customerMailOptions);

    return NextResponse.json({ 
      success: true, 
      message: 'Pedido enviado correctamente. Revisa tu correo electrónico.' 
    });

  } catch (error: any) {
    console.error('Error al enviar el pedido:', error);
    return NextResponse.json({ 
      error: 'Error al procesar el envío del pedido',
      details: error.message 
    }, { status: 500 });
  }
}
