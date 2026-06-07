// HydroNova v1.0 - Cart Routes
// src/routes/cart.js

import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// ============================================
// OBTENER CARRITO DEL USUARIO
// ============================================
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            nombre: true,
            precio: true,
            precioOferta: true,
            imagenUrl: true,
            stock: true
          }
        }
      }
    });

    // Calcular total y verificar stock
    let total = 0;
    const items = cartItems.map(item => {
      const precioFinal = item.product.precioOferta || item.product.precio;
      const subtotal = precioFinal * item.cantidad;
      total += subtotal;

      return {
        id: item.id,
        productId: item.product.id,
        nombre: item.product.nombre,
        precio: item.product.precio,
        precioOferta: item.product.precioOferta,
        precioFinal,
        cantidad: item.cantidad,
        subtotal,
        imagenUrl: item.product.imagenUrl,
        stock: item.product.stock,
        disponible: item.product.stock > 0
      };
    });

    res.json({
      items,
      total: parseFloat(total.toFixed(2)),
      itemCount: items.length
    });
  } catch (error) {
    console.error('Error obteniendo carrito:', error);
    res.status(500).json({ error: 'Error al obtener carrito' });
  }
});

// ============================================
// AGREGAR ITEM AL CARRITO
// ============================================
router.post('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, cantidad = 1 } = req.body;

    // Validar producto existe y está en stock
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    if (!product.activo) {
      return res.status(400).json({ error: 'Producto no disponible' });
    }

    if (product.stock < cantidad) {
      return res.status(400).json({ 
        error: `Stock insuficiente. Disponibles: ${product.stock}` 
      });
    }

    // Buscar si el item ya está en el carrito
    let cartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: { userId, productId }
      }
    });

    if (cartItem) {
      // Actualizar cantidad
      const nuevaCantidad = cartItem.cantidad + cantidad;

      if (product.stock < nuevaCantidad) {
        return res.status(400).json({ 
          error: `Stock insuficiente. Máximo disponible: ${product.stock}` 
        });
      }

      cartItem = await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { cantidad: nuevaCantidad },
        include: { product: true }
      });
    } else {
      // Crear nuevo item
      cartItem = await prisma.cartItem.create({
        data: {
          userId,
          productId,
          cantidad
        },
        include: { product: true }
      });
    }

    res.status(201).json({
      message: 'Producto agregado al carrito',
      item: cartItem
    });
  } catch (error) {
    console.error('Error agregando al carrito:', error);
    res.status(500).json({ error: 'Error al agregar al carrito' });
  }
});

// ============================================
// ACTUALIZAR CANTIDAD EN CARRITO
// ============================================
router.put('/:itemId', async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    const { cantidad } = req.body;

    if (!cantidad || cantidad < 1) {
      return res.status(400).json({ error: 'Cantidad debe ser mayor a 0' });
    }

    // Verificar que el item pertenece al usuario
    const cartItem = await prisma.cartItem.findFirst({
      where: { id: itemId, userId },
      include: { product: true }
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Item no encontrado en carrito' });
    }

    // Verificar stock
    if (cartItem.product.stock < cantidad) {
      return res.status(400).json({ 
        error: `Stock insuficiente. Disponibles: ${cartItem.product.stock}` 
      });
    }

    // Actualizar
    const updated = await prisma.cartItem.update({
      where: { id: itemId },
      data: { cantidad },
      include: { product: true }
    });

    res.json({
      message: 'Carrito actualizado',
      item: updated
    });
  } catch (error) {
    console.error('Error actualizando carrito:', error);
    res.status(500).json({ error: 'Error al actualizar carrito' });
  }
});

// ============================================
// ELIMINAR ITEM DEL CARRITO
// ============================================
router.delete('/:itemId', async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    // Verificar que el item pertenece al usuario
    const cartItem = await prisma.cartItem.findFirst({
      where: { id: itemId, userId }
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }

    // Eliminar
    await prisma.cartItem.delete({
      where: { id: itemId }
    });

    res.json({ message: 'Item removido del carrito' });
  } catch (error) {
    console.error('Error eliminando del carrito:', error);
    res.status(500).json({ error: 'Error al eliminar del carrito' });
  }
});

// ============================================
// LIMPIAR CARRITO COMPLETO
// ============================================
router.delete('/', async (req, res) => {
  try {
    const userId = req.user.id;

    await prisma.cartItem.deleteMany({
      where: { userId }
    });

    res.json({ message: 'Carrito limpiado' });
  } catch (error) {
    console.error('Error limpiando carrito:', error);
    res.status(500).json({ error: 'Error al limpiar carrito' });
  }
});

export default router;