import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // Validación de campos obligatorios para una consulta
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    // Configuración del servidor de correo (Gmail)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Consulta Portal" <${process.env.EMAIL_USER}>`,
      to: 'francisega@gmail.com',
      subject: `NUEVA CONSULTA: ${subject || 'Sin Asunto'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
          <h2 style="color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 10px;">Mensaje de Contacto Directo</h2>
          <p><strong>De:</strong> ${name}</p>
          <p><strong>Email del Cliente:</strong> ${email}</p>
          <p><strong>Asunto:</strong> ${subject || 'No especificado'}</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px; border-left: 4px solid #3498db;">
            <p><strong>Mensaje:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p style="font-size: 11px; color: #999; margin-top: 20px;">Este mensaje es independiente del sistema de pedidos del carrito.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, message: 'Mensaje enviado correctamente' });

  } catch (error: any) {
    console.error('Error en API de contacto:', error);
    return NextResponse.json({ error: 'Error al enviar el mensaje', details: error.message }, { status: 500 });
  }
}
