// HydroNova - Email Service (Nodemailer + Templates)
// Maneja confirmaciones de orden, notificaciones de estado, recordatorios

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// ============================================
// CONFIGURACIÓN DE EMAIL
// ============================================

const transporter = nodemailer.createTransport({
  host: '142.250.141.109',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER || 'hydronova166@gmail.com',
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verificar conexión
transporter.verify((error, success) => {
  if (error) {
    console.error('Error en email service:', error);
  } else {
    console.log('Email service listo para enviar');
  }
});

// ============================================
// TEMPLATES HTML
// ============================================

const emailTemplates = {
  orderConfirmation: (order, customer) => `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'DM Sans', sans-serif; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }
        .header { background: linear-gradient(135deg, #0d8fa8 0%, #1a9e52 100%); color: white; padding: 20px; text-align: center; border-radius: 10px; }
        .header h1 { margin: 0; font-size: 28px; }
        .order-details { margin: 30px 0; }
        .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .item-name { font-weight: 600; }
        .item-price { color: #0d8fa8; font-weight: bold; }
        .total { background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .total-row { display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
        .status-badge { background: #1a9e52; color: white; padding: 8px 15px; border-radius: 5px; display: inline-block; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>HydroNova</h1>
          <p>Pedido Confirmado</p>
        </div>
        <div style="margin: 20px 0;">
          <p>Hola,</p>
          <p>Tu pedido ha sido confirmado exitosamente. Aquí están los detalles:</p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Número de Orden:</strong> ${order.id}</p>
            <p><strong>Fecha:</strong> ${new Date(order.createdAt).toLocaleDateString('es-CO')}</p>
            <p><strong>Estado:</strong> <span class="status-badge">CONFIRMADO</span></p>
          </div>
        </div>
        <div class="order-details">
          <h3 style="color: #0d8fa8; margin-bottom: 15px;">Productos Pedidos:</h3>
          ${order.items.map(item => `
            <div class="item">
              <div>
                <div class="item-name">${item.productName}</div>
                <div style="color: #999; font-size: 14px;">Cantidad: ${item.quantity}</div>
              </div>
              <div class="item-price">$${(item.price * item.quantity).toLocaleString('es-CO')}</div>
            </div>
          `).join('')}
        </div>
        <div class="total">
          <div class="total-row">
            <span>TOTAL A PAGAR (Contra Entrega):</span>
            <span style="color: #1a9e52;">$${order.totalAmount.toLocaleString('es-CO')}</span>
          </div>
        </div>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h4 style="color: #1a9e52; margin-top: 0;">Información de Entrega:</h4>
          <p><strong>${customer.name}</strong></p>
          <p>${order.shippingAddress}</p>
          <p>${order.city}, Colombia</p>
          <p>${customer.phone}</p>
        </div>
        <div style="background: #fff3e0; padding: 15px; border-radius: 5px;">
          <h4 style="color: #ff9800; margin-top: 0;">Importante:</h4>
          <p>Tu pedido será entregado mediante <strong>contra entrega</strong>. El conductor te contactará para confirmar la entrega.</p>
          <p>Asegúrate de tener el dinero disponible en el momento de la entrega.</p>
        </div>
        <div style="margin-top: 30px;">
          <p>¿Preguntas sobre tu pedido? Responde a este email o contacta a:</p>
          <p><strong>${process.env.EMAIL_USER}</strong></p>
        </div>
        <div class="footer">
          <p>© 2025 HydroNova - Productos Hidropónicos Frescos. Todos los derechos reservados.</p>
          <p>Este es un email transaccional. No responder a este email.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  orderStatusUpdate: (order, customer, newStatus) => {
    const statusMessages = {
      pending: { text: 'Pendiente', detail: 'Tu pedido está siendo procesado' },
      preparing: { text: 'En Preparación', detail: 'Estamos preparando tu pedido' },
      shipped: { text: 'En Tránsito', detail: 'Tu pedido está en camino' },
      delivered: { text: 'Entregado', detail: 'Tu pedido ha sido entregado' },
      cancelled: { text: 'Cancelado', detail: 'Tu pedido fue cancelado' },
    };
    const status = statusMessages[newStatus] || statusMessages.pending;
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'DM Sans', sans-serif; background: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }
          .header { background: linear-gradient(135deg, #0d8fa8 0%, #1a9e52 100%); color: white; padding: 20px; text-align: center; border-radius: 10px; }
          .status-card { background: linear-gradient(135deg, #0d8fa8 0%, #1a9e52 100%); color: white; padding: 30px; text-align: center; border-radius: 10px; margin: 20px 0; }
          .status-text { font-size: 24px; font-weight: bold; margin: 10px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>HydroNova</h1>
            <p>Actualización de tu Pedido</p>
          </div>
          <p>Hola,</p>
          <div class="status-card">
            <div class="status-text">${status.text}</div>
            <p>${status.detail}</p>
          </div>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
            <p><strong>Número de Orden:</strong> ${order.id}</p>
            <p><strong>Actualizado:</strong> ${new Date().toLocaleDateString('es-CO')} a las ${new Date().toLocaleTimeString('es-CO')}</p>
          </div>
          <div style="margin-top: 30px;">
            <p>Si tienes preguntas sobre tu pedido, no dudes en contactarnos:</p>
            <p><strong>${process.env.EMAIL_USER}</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 HydroNova - Productos Hidropónicos Frescos.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  },

  lowStockAlert: (product) => `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'DM Sans', sans-serif; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }
        .alert { background: #fff3e0; border-left: 4px solid #ff9800; padding: 15px; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Alerta de Stock Bajo</h2>
        <div class="alert">
          <p><strong>Producto:</strong> ${product.name}</p>
          <p><strong>Stock Actual:</strong> ${product.stock} unidades</p>
          <p>El stock está por debajo del nivel mínimo. Considera hacer un pedido.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  abandonedCart: (customer, cartItems) => `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'DM Sans', sans-serif; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }
        .header { background: linear-gradient(135deg, #0d8fa8 0%, #1a9e52 100%); color: white; padding: 20px; text-align: center; border-radius: 10px; }
        .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .cta-button { background: #1a9e52; color: white; padding: 15px 30px; text-align: center; border-radius: 5px; text-decoration: none; display: inline-block; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>HydroNova</h1>
          <p>No olvides tu pedido</p>
        </div>
        <p>Hola,</p>
        <p>Notamos que dejaste algunos productos en tu carrito. ¿Necesitas ayuda?</p>
        <h3 style="color: #0d8fa8;">Productos en tu Carrito:</h3>
        ${cartItems.map(item => `
          <div class="item">
            <div><strong>${item.name}</strong> x${item.quantity}</div>
            <div style="color: #0d8fa8; font-weight: bold;">$${(item.price * item.quantity).toLocaleString('es-CO')}</div>
          </div>
        `).join('')}
        <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
          <p style="margin: 0;">Total: <strong style="color: #0d8fa8; font-size: 20px;">$${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString('es-CO')}</strong></p>
        </div>
        <div style="text-align: center;">
          <p>Completa tu compra ahora mismo:</p>
          <a href="${process.env.FRONTEND_URL}/cart" class="cta-button">IR AL CARRITO</a>
        </div>
      </div>
    </body>
    </html>
  `,

  welcomeNewUser: (customer) => `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'DM Sans', sans-serif; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }
        .header { background: linear-gradient(135deg, #0d8fa8 0%, #1a9e52 100%); color: white; padding: 20px; text-align: center; border-radius: 10px; }
        .benefit { background: #f0f0f0; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .benefit strong { color: #0d8fa8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Bienvenido a HydroNova</h1>
          <p>Nos alegra que te hayas unido a nosotros</p>
        </div>
        <p>Hola ${customer.name},</p>
        <p>Tu cuenta ha sido creada exitosamente. Ahora puedes:</p>
        <div class="benefit">
          <strong>Comprar productos frescos</strong> - Acceso a nuestro catálogo completo de productos hidropónicos
        </div>
        <div class="benefit">
          <strong>Historial de pedidos</strong> - Guarda tus compras y vuelve a ordenar favoritos
        </div>
        <div class="benefit">
          <strong>Ofertas exclusivas</strong> - Recibe promociones especiales solo para miembros
        </div>
        <div class="benefit">
          <strong>Soporte prioritario</strong> - Contacta a nuestro equipo directamente
        </div>
        <div style="background: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h4 style="color: #1a9e52; margin-top: 0;">Bono de Bienvenida</h4>
          <p>Usa el código <strong>BIENVENIDA10</strong> en tu próxima compra para obtener <strong>10% de descuento</strong>.</p>
        </div>
        <p>¿Preguntas? Responde a este email o contacta a:</p>
        <p><strong>${process.env.EMAIL_USER}</strong></p>
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #666; font-size: 12px;">© 2026 HydroNova - Productos Hidropónicos Frescos.</p>
        </div>
      </div>
    </body>
    </html>
  `,
};

// ============================================
// FUNCIONES DE ENVÍO
// ============================================

export const sendOrderConfirmation = async (order, customer) => {
  try {
    const mailOptions = {
      from: `HydroNova <${process.env.EMAIL_USER}>`,
      to: customer.email,
      subject: `Orden Confirmada ${order.id} - HydroNova`,
      html: emailTemplates.orderConfirmation(order, customer),
    };
    const result = await transporter.sendMail(mailOptions);
    console.log('Email de confirmación enviado:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error enviando confirmación:', error);
    return { success: false, error: error.message };
  }
};

export const sendOrderStatusUpdate = async (order, customer, newStatus) => {
  try {
    const mailOptions = {
      from: `HydroNova <${process.env.EMAIL_USER}>`,
      to: customer.email,
      subject: `Tu pedido ${order.id} ha sido actualizado - HydroNova`,
      html: emailTemplates.orderStatusUpdate(order, customer, newStatus),
    };
    const result = await transporter.sendMail(mailOptions);
    console.log('Email de actualización enviado:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error enviando actualización:', error);
    return { success: false, error: error.message };
  }
};

export const sendLowStockAlert = async (admin, product) => {
  try {
    const mailOptions = {
      from: `HydroNova <${process.env.EMAIL_USER}>`,
      to: admin.email,
      subject: `Alerta: Stock Bajo - ${product.name}`,
      html: emailTemplates.lowStockAlert(product),
    };
    const result = await transporter.sendMail(mailOptions);
    console.log('Alerta de stock enviada:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error enviando alerta:', error);
    return { success: false, error: error.message };
  }
};

export const sendAbandonedCartReminder = async (customer, cartItems) => {
  try {
    const mailOptions = {
      from: `HydroNova <${process.env.EMAIL_USER}>`,
      to: customer.email,
      subject: `No olvides tu pedido - HydroNova`,
      html: emailTemplates.abandonedCart(customer, cartItems),
    };
    const result = await transporter.sendMail(mailOptions);
    console.log('Recordatorio de carrito enviado:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error enviando recordatorio:', error);
    return { success: false, error: error.message };
  }
};

export const sendWelcomeEmail = async (customer) => {
  try {
    const mailOptions = {
      from: `HydroNova <${process.env.EMAIL_USER}>`,
      to: customer.email,
      subject: `Bienvenido a HydroNova`,
      html: emailTemplates.welcomeNewUser(customer),
    };
    const result = await transporter.sendMail(mailOptions);
    console.log('Email de bienvenida enviado:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error enviando bienvenida:', error);
    return { success: false, error: error.message };
  }
};

export const sendPasswordResetEmail = async (customer) => {
  try {
    const mailOptions = {
      from: `HydroNova <${process.env.EMAIL_USER}>`,
      to: customer.email,
      subject: 'Recupera tu contraseña - HydroNova',
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'DM Sans', sans-serif; background: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }
            .header { background: linear-gradient(135deg, #0d8fa8 0%, #1a9e52 100%); color: white; padding: 20px; text-align: center; border-radius: 10px; }
            .button { background: #1a9e52; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>HydroNova</h1>
              <p>Recupera tu contraseña</p>
            </div>
            <p>Hola <strong>${customer.name}</strong>,</p>
            <p>Recibimos una solicitud para restablecer tu contraseña. Si no fuiste tú, ignora este mensaje.</p>
            <p>Para crear una nueva contraseña, haz clic en el siguiente botón:</p>
            <div style="text-align: center;">
              <a href="${customer.resetLink}" class="button">Restablecer contraseña</a>
            </div>
            <p>El enlace expirará en 1 hora.</p>
            <div class="footer">
              <p>© 2026 HydroNova - Productos Hidropónicos Frescos.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    const result = await transporter.sendMail(mailOptions);
    console.log('Email de recuperación enviado:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error enviando email de recuperación:', error);
    return { success: false, error: error.message };
  }
};

export const sendMessageResponseEmail = async (userEmail, userName, asunto, respuesta) => {
  try {
    const mailOptions = {
      from: `HydroNova <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Respuesta a tu mensaje: ${asunto}`,
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'DM Sans', sans-serif; background: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }
            .header { background: linear-gradient(135deg, #0d8fa8 0%, #1a9e52 100%); color: white; padding: 20px; text-align: center; border-radius: 10px; }
            .respuesta { background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>HydroNova</h1>
              <p>Respuesta a tu mensaje</p>
            </div>
            <p>Hola <strong>${userName}</strong>,</p>
            <p>Tu mensaje ha sido respondido por nuestro equipo de soporte:</p>
            <div class="respuesta">
              <p><strong>Respuesta:</strong></p>
              <p>${respuesta}</p>
            </div>
            <p>Si tienes más preguntas, no dudes en escribirnos nuevamente.</p>
            <div class="footer">
              <p>© 2026 HydroNova - Productos Hidropónicos Frescos.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    const result = await transporter.sendMail(mailOptions);
    console.log('Email de respuesta enviado:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error enviando email de respuesta:', error);
    return { success: false, error: error.message };
  }
};

export default transporter;