// HydroNova v1.0 - Admin Routes
// src/routes/admin.js

import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Helper: Log de acciones admin
const logAdminAction = async (adminId, accion, detalles) => {
  await prisma.adminLog.create({
    data: {
      adminId,
      accion,
      detalles: JSON.stringify(detalles)
    }
  });
};

// ============================================
// DASHBOARD - KPIs Y ESTADÍSTICAS
// ============================================
router.get('/dashboard', async (req, res) => {
  try {
    const adminId = req.user.id;

    const totalVentas = await prisma.order.aggregate({
      _sum: { total: true },
      where: { estado: { in: ['ENVIADO', 'ENTREGADO'] } }
    });

    const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const ventasMes = await prisma.order.aggregate({
      _sum: { total: true },
      where: {
        createdAt: { gte: inicioMes },
        estado: { in: ['ENVIADO', 'ENTREGADO'] }
      }
    });

    const totalOrdenes = await prisma.order.count();
    const ordenesPendientes = await prisma.order.count({ where: { estado: 'PENDIENTE' } });
    const totalClientes = await prisma.user.count({ where: { rol: 'CLIENTE' } });
    const productosStock = await prisma.product.aggregate({ _sum: { stock: true } });

    const productosMasVendidos = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { cantidad: true },
      orderBy: { _sum: { cantidad: 'desc' } },
      take: 5
    });

    const masVendidos = await Promise.all(
      productosMasVendidos.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { nombre: true, precio: true }
        });
        return {
          productId: item.productId,
          nombre: product?.nombre,
          cantidadVendida: item._sum.cantidad,
          precioUnitario: product?.precio
        };
      })
    );

    const ordenesPorEstado = await prisma.order.groupBy({
      by: ['estado'],
      _count: true
    });

    res.json({
      resumen: {
        totalVentas: totalVentas._sum.total || 0,
        ventasMes: ventasMes._sum.total || 0,
        totalOrdenes,
        ordenesPendientes,
        totalClientes,
        productosEnStock: productosStock._sum.stock || 0
      },
      productosMasVendidos: masVendidos,
      ordenesPorEstado,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error en dashboard:', error);
    res.status(500).json({ error: 'Error al obtener dashboard' });
  }
});

// ============================================
// GESTIÓN DE PRODUCTOS - CREAR
// ============================================
router.post('/products', async (req, res) => {
  try {
    const adminId = req.user.id;
    const { nombre, descripcion, precio, stock, imagenUrl, categoria } = req.body;

    if (!nombre || !descripcion || !precio || !imagenUrl) {
      return res.status(400).json({ error: 'Nombre, descripción, precio e imagen son requeridos' });
    }

    const product = await prisma.product.create({
      data: {
        nombre,
        descripcion,
        precio: parseFloat(precio),
        stock: parseInt(stock) || 0,
        imagenUrl,
        categoria: categoria || 'Vegetales',
        activo: true
      }
    });

    await logAdminAction(adminId, 'crear_producto', {
      productId: product.id,
      nombre: product.nombre
    });

    res.status(201).json({ message: 'Producto creado exitosamente', product });
  } catch (error) {
    console.error('Error creando producto:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// ============================================
// GESTIÓN DE PRODUCTOS - OBTENER TODOS (SOLO ACTIVOS)
// ============================================
router.get('/products', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    // Solo productos activos (no eliminados)
    const where = { activo: true };

    const total = await prisma.product.count({ where });
    const totalPages = Math.ceil(total / limit);

    const products = await prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      data: products,
      pagination: {
        current: parseInt(page),
        total: totalPages,
        count: products.length,
        totalItems: total
      }
    });
  } catch (error) {
    console.error('Error listando productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// ============================================
// GESTIÓN DE PRODUCTOS - ACTUALIZAR
// ============================================
router.put('/products/:id', async (req, res) => {
  try {
    const adminId = req.user.id;
    const { id } = req.params;
    const { nombre, descripcion, precio, precioOferta, stock, imagenUrl, categoria, activo } = req.body;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const updateData = {};
    if (nombre) updateData.nombre = nombre;
    if (descripcion) updateData.descripcion = descripcion;
    if (precio) updateData.precio = parseFloat(precio);
    if (precioOferta !== undefined) updateData.precioOferta = precioOferta ? parseFloat(precioOferta) : null;
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (imagenUrl) updateData.imagenUrl = imagenUrl;
    if (categoria) updateData.categoria = categoria;
    if (activo !== undefined) updateData.activo = activo;

    const updated = await prisma.product.update({
      where: { id },
      data: updateData
    });

    await logAdminAction(adminId, 'editar_producto', {
      productId: id,
      cambios: updateData
    });

    res.json({ message: 'Producto actualizado exitosamente', product: updated });
  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// ============================================
// GESTIÓN DE PRODUCTOS - ELIMINAR (SOFT DELETE)
// ============================================
router.delete('/products/:id', async (req, res) => {
  try {
    const adminId = req.user.id;
    const { id } = req.params;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    await prisma.product.update({
      where: { id },
      data: { activo: false }
    });

    await logAdminAction(adminId, 'eliminar_producto', {
      productId: id,
      nombre: product.nombre
    });

    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

// ============================================
// GESTIÓN DE PEDIDOS - OBTENER TODOS
// ============================================
router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 20, estado } = req.query;

    const where = {};
    if (estado) {
      where.estado = estado;
    }

    const total = await prisma.order.count({ where });
    const orders = await prisma.order.findMany({
      where,
      skip: (page - 1) * limit,
      take: parseInt(limit),
      include: {
        user: { select: { nombre: true, email: true, telefono: true } },
        items: { include: { product: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      data: orders,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: orders.length,
        totalItems: total
      }
    });
  } catch (error) {
    console.error('Error listando órdenes:', error);
    res.status(500).json({ error: 'Error al obtener órdenes' });
  }
});

// ============================================
// GESTIÓN DE PEDIDOS - CAMBIAR ESTADO
// ============================================
router.patch('/orders/:id', async (req, res) => {
  try {
    const adminId = req.user.id;
    const { id } = req.params;
    const { estado, notas } = req.body;

    const validStates = ['PENDIENTE', 'EN_PREPARACION', 'ENVIADO', 'ENTREGADO', 'CANCELADO'];
    if (!estado || !validStates.includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    const updateData = { estado };
    if (notas) updateData.notas = notas;

    const updated = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        user: true,
        items: { include: { product: true } }
      }
    });

    await logAdminAction(adminId, 'cambiar_estado_orden', {
      orderId: id,
      nuevoEstado: estado,
      ordenAnterior: order.estado
    });

    res.json({ message: 'Estado de orden actualizado', order: updated });
  } catch (error) {
    console.error('Error actualizando orden:', error);
    res.status(500).json({ error: 'Error al actualizar orden' });
  }
});

// ============================================
// GESTIÓN DE USUARIOS - OBTENER CLIENTES
// ============================================
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const total = await prisma.user.count({
      where: { 
        OR: [
          { rol: 'cliente' },
          { rol: 'CLIENTE' }
        ]
      }
    });

    const users = await prisma.user.findMany({
      where: { 
        OR: [
          { rol: 'cliente' },
          { rol: 'CLIENTE' }
        ]
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
      select: {
        id: true,
        email: true,
        nombre: true,
        telefono: true,
        direccion: true,
        createdAt: true,
        activo: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      data: users,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: users.length,
        totalItems: total
      }
    });
  } catch (error) {
    console.error('Error listando usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// ============================================
// VENTAS POR DÍA (ÚLTIMOS 7 DÍAS)
// ============================================
router.get('/sales-by-day', async (req, res) => {
  try {
    const today = new Date();
    const last7Days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      
      const sales = await prisma.order.aggregate({
        _sum: { total: true },
        where: {
          createdAt: { gte: date, lt: nextDay },
          estado: { in: ['ENTREGADO', 'ENVIADO'] }
        }
      });

      last7Days.push({
        dia: date.toLocaleDateString('es-CO', { weekday: 'short' }).replace('.', ''),
        fecha: date.toISOString().split('T')[0],
        ventas: sales._sum.total || 0
      });
    }

    res.json(last7Days);
  } catch (error) {
    console.error('Error obteniendo ventas por día:', error);
    res.status(500).json({ error: 'Error al obtener ventas' });
  }
});

// ============================================
// ACTIVAR/DESACTIVAR USUARIO
// ============================================
router.patch('/users/:id/toggle-status', async (req, res) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { activo: activo !== undefined ? activo : !user.activo },
      select: {
        id: true,
        email: true,
        nombre: true,
        telefono: true,
        direccion: true,
        activo: true,
        createdAt: true
      }
    });

    res.json({
      message: `Usuario ${updated.activo ? 'activado' : 'desactivado'} exitosamente`,
      user: updated
    });
  } catch (error) {
    console.error('Error cambiando estado de usuario:', error);
    res.status(500).json({ error: 'Error al cambiar estado del usuario' });
  }
});

export default router;