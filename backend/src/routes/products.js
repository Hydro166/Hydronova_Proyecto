import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// LISTAR TODOS LOS PRODUCTOS (CON FILTROS)
router.get('/', async (req, res) => {
  try {
    const { categoria, page = 1, limit = 12, search } = req.query;

    const where = { activo: true };

    // Filtrar por categoría
    if (categoria && categoria !== 'Todos') {
      where.categoria = categoria;
    }

    // Filtrar por búsqueda
    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { descripcion: { contains: search, mode: 'insensitive' } }
      ];
    }

    const total = await prisma.product.count({ where });
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
        total: Math.ceil(total / limit),
        count: products.length,
        totalItems: total
      }
    });
  } catch (error) {
    console.error('Error listando productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// OBTENER PRODUCTO POR ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findFirst({
      where: { id, activo: true }
    });

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

// OBTENER CATEGORÍAS
router.get('/categories/all', async (req, res) => {
  try {
    const categories = await prisma.product.findMany({
      where: { activo: true },
      distinct: ['categoria'],
      select: { categoria: true }
    });

    const uniqueCategories = categories.map(c => c.categoria);
    res.json(['Todos', ...uniqueCategories]);
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

export default router;