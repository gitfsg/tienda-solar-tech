import { NextResponse } from 'next/server';

// Definición de tipos para los datos que esperamos recibir
interface UserInfo {
  name: string;
  email: string;
  address: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutRequest {
  cart: CartItem[];
  user: UserInfo;
}

export async function POST(request: Request) {
  try {
    const body: CheckoutRequest = await request.json();
    const { cart, user } = body;

    // --- Validación básica de los datos recibidos ---
    if (!cart || cart.length === 0 || !user) {
      return NextResponse.json({ message: 'Datos inválidos' }, { status: 400 });
    }

    const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // ----------------------------------------------------------------------
    // --- INTEGRACIÓN DE LA PASARELA DE PAGO (ePayco, PSE, etc.) ---
    // ----------------------------------------------------------------------
    
    // Este es el lugar donde debes integrar el SDK o la API de tu pasarela de pago.
    // Por seguridad, las claves secretas NUNCA deben estar aquí directamente.
    // Guárdalas en variables de entorno (ej: process.env.EPAYCO_SECRET_KEY)

    console.log('Iniciando proceso de pago para:', user.email);
    console.log('Monto total:', totalAmount);

    /*
    // EJEMPLO DE CÓMO SERÍA LA LÓGICA CON UNA PASARELA DE PAGO

    1. Importar el SDK de la pasarela:
       const epayco = require('epayco')({ apiKey: process.env.EPAYCO_PUBLIC_KEY, privateKey: process.env.EPAYCO_SECRET_KEY, test: true });

    2. Crear un objeto de transacción con los datos requeridos por la pasarela:
       const paymentDetails = {
         amount: totalAmount,
         currency: 'COP',
         description: 'Compra en Tienda Solar Tech',
         email: user.email,
         name: user.name,
         // ... otros campos como `tax_base`, `tax`, `invoice`, etc.
       };

    3. Realizar la llamada a la API de la pasarela para crear el cargo o la transacción:
       try {
         const charge = await epayco.charge.create(paymentDetails);
         
         if (charge.success) {
           // ¡PAGO EXITOSO!
           // Aquí deberías:
           // 1. Guardar el pedido en tu base de datos.
           // 2. Enviar un correo de confirmación al cliente.
           console.log('Pago exitoso:', charge.data);
           return NextResponse.json({ success: true, message: 'Pago procesado exitosamente', data: charge.data });
         } else {
           // PAGO RECHAZADO
           console.error('Pago rechazado:', charge.data.description);
           return NextResponse.json({ message: `Pago rechazado: ${charge.data.description}` }, { status: 400 });
         }

       } catch (error) {
         // ERROR EN LA COMUNICACIÓN CON LA PASARELA
         console.error('Error con la pasarela de pago:', error);
         return NextResponse.json({ message: 'Error técnico al contactar la pasarela de pago.' }, { status: 500 });
       }
    */

    // --- SIMULACIÓN DE PAGO EXITOSO (PARA DESARROLLO) ---
    // Se simula una espera de 2 segundos como si se estuviera procesando el pago.
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Simulación de pago exitosa para el usuario:', user.email);

    // Si la simulación es exitosa, devolvemos una respuesta positiva.
    // En un caso real, esta respuesta vendría de la pasarela de pago.
    return NextResponse.json({ 
      success: true, 
      message: 'Pago procesado exitosamente (Simulación)',
      orderId: `TS-SIM-${Date.now()}`,
      total: totalAmount
    });

  } catch (error) {
    console.error('Error en el endpoint de checkout:', error);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}
