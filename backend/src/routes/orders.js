import express from 'express';
import { PrismaClient } from '@prisma/client';
import { sendOrderConfirmation } from '../services/emailService.js';

const router = express.Router();
const prisma = new PrismaClient();

const generateOrderNumber = async () => {
  const year = new Date().getFullYear();
  const lastOrder = await prisma.order.findFirst({
    where: { numero: { startsWith: `ORD-${year}-` } },
    orderBy: { createdAt: 'desc' }
  });

  let sequential = 1;
  if (lastOrder) {
    const lastNum = parseInt(lastOrder.numero.split('-')[2]);
    sequential = lastNum + 1;
  }

  return `ORD-${year}-${String(sequential).padStart(4, '0')}`;
};

// CREAR PEDIDO (acepta items directamente)
router.post('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      direccionEnvio,
      telefonoContacto,
      emailContacto,
      metodoPago = 'CONTRAENTREGA',
      notas,
      items: itemsFromBody
    } = req.body;

    if (!direccionEnvio || !telefonoContacto || !emailContacto) {
      return res.status(400).json({ error: 'Dirección, teléfono y email son requeridos' });
    }

    let cartItems = [];

    if (itemsFromBody && itemsFromBody.length > 0) {
      for (const item of itemsFromBody) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId }
        });
        if (!product) {
          return res.status(404).json({ error: `Producto ${item.productId} no encontrado` });
        }
        if (product.stock < item.cantidad) {
          return res.status(400).json({ error: `Stock insuficiente de ${product.nombre}` });
        }
        cartItems.push({
          productId: item.productId,
          cantidad: item.cantidad,
          precioUnitario: product.precio,
          product: product
        });
      }
    } else {
      cartItems = await prisma.cartItem.findMany({
        where: { userId },
        include: { product: true }
      });
    }

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    let total = 0;
    for (const item of cartItems) {
      total += item.precioUnitario * item.cantidad;
    }

    const numero = await generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        numero,
        userId,
        direccionEnvio,
        telefonoContacto,
        emailContacto,
        metodoPago,
        notas: notas || null,
        total: parseFloat(total.toFixed(2)),
        estado: 'PENDIENTE',
        items: {
          createMany: {
            data: cartItems.map(item => ({
              productId: item.productId,
              cantidad: item.cantidad,
              precioUnitario: item.precioUnitario
            }))
          }
        }
      },
      include: { items: { include: { product: true } } }
    });

    for (const item of cartItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.cantidad } }
      });
    }

    if (!itemsFromBody) {
      await prisma.cartItem.deleteMany({ where: { userId } });
    }

    // Enviar correo de confirmación
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      select: { nombre: true }
    });
    
    const customerData = {
      email: order.emailContacto,
      name: userData?.nombre || '',
      phone: order.telefonoContacto
    };
    
    const orderForEmail = {
      id: order.numero,
      createdAt: order.createdAt,
      items: order.items.map(item => ({
        productName: item.product.nombre,
        quantity: item.cantidad,
        price: item.precioUnitario
      })),
      totalAmount: order.total,
      shippingAddress: order.direccionEnvio,
      city: 'Medellín'
    };
    
    sendOrderConfirmation(orderForEmail, customerData)
      .then(() => console.log(`Email de confirmación enviado para orden ${order.numero}`))
      .catch(error => console.error(`Error enviando email para orden ${order.numero}:`, error.message));

    res.status(201).json({
      message: 'Pedido creado exitosamente',
      order: {
        id: order.id,
        numero: order.numero,
        total: order.total,
        estado: order.estado,
        fecha: order.createdAt,
        items: order.items
      }
    });
  } catch (error) {
    console.error('Error creando orden:', error);
    res.status(500).json({ error: 'Error al crear pedido' });
  }
});

// OBTENER MIS ÓRDENES
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    console.error('Error obteniendo órdenes:', error);
    res.status(500).json({ error: 'Error al obtener órdenes' });
  }
});

// OBTENER ORDEN POR ID
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const order = await prisma.order.findFirst({
      where: { id, userId },
      include: { items: { include: { product: true } } }
    });
    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error obteniendo orden:', error);
    res.status(500).json({ error: 'Error al obtener orden' });
  }
});

// ACTUALIZAR ESTADO DE UNA ORDEN (ADMIN)
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const validStates = ['PENDIENTE', 'EN_PREPARACION', 'ENVIADO', 'ENTREGADO', 'CANCELADO'];
    if (!estado || !validStates.includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { estado }
    });

    res.json({ message: 'Estado actualizado', order });
  } catch (error) {
    console.error('Error actualizando orden:', error);
    res.status(500).json({ error: 'Error al actualizar' });
  }
});

// CANCELAR PEDIDO (SOLO PARA CLIENTES, DENTRO DE 2 HORAS)
router.patch('/:id/cancel', async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: { id, userId },
      include: { items: true }
    });

    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    if (order.estado !== 'PENDIENTE') {
      return res.status(400).json({ error: 'No se puede cancelar un pedido que ya está en proceso' });
    }

    const ahora = new Date();
    const fechaCreacion = new Date(order.createdAt);
    const diffMinutos = (ahora - fechaCreacion) / (1000 * 60);

    if (diffMinutos > 120) {
      return res.status(400).json({ error: 'El plazo de 2 horas para cancelar el pedido ha expirado' });
    }

    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.cantidad } }
      });
    }

    const orderCancelada = await prisma.order.update({
      where: { id },
      data: { estado: 'CANCELADO' }
    });

    res.json({ message: 'Pedido cancelado exitosamente', order: orderCancelada });
  } catch (error) {
    console.error('Error cancelando orden:', error);
    res.status(500).json({ error: 'Error al cancelar el pedido' });
  }
});

export default router;