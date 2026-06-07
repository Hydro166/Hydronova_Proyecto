// HydroNova v1.0 - Messages Routes
// src/routes/messages.js

import express from 'express';
import { PrismaClient } from '@prisma/client';
import { sendMessageResponseEmail } from '../services/emailService.js';

const router = express.Router();
const prisma = new PrismaClient();

// ============================================
// CREAR MENSAJE DE CONTACTO
// ============================================
router.post('/', async (req, res) => {
  try {
    const { nombre, email, asunto, mensaje } = req.body;

    // Validaciones
    if (!nombre || !email || !asunto || !mensaje) {
      return res.status(400).json({
        error: 'Todos los campos son requeridos'
      });
    }

    // Validar email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Email inválido'
      });
    }

    const message = await prisma.message.create({
      data: {
        nombre,
        email,
        asunto,
        mensaje
      }
    });

    res.status(201).json({
      message: 'Mensaje enviado exitosamente',
      data: message
    });
  } catch (error) {
    console.error('Error creando mensaje:', error);
    res.status(500).json({ error: 'Error al enviar mensaje' });
  }
});

// ============================================
// OBTENER MENSAJES (ADMIN ONLY)
// ============================================
router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    const { page = 1, limit = 20, respondido } = req.query;

    const where = {};
    if (respondido !== undefined) {
      where.respondido = respondido === 'true';
    }

    const total = await prisma.message.count({ where });
    const totalPages = Math.ceil(total / limit);

    const messages = await prisma.message.findMany({
      where,
      skip: (page - 1) * limit,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      data: messages,
      pagination: {
        current: parseInt(page),
        total: totalPages,
        count: messages.length,
        totalItems: total
      }
    });
  } catch (error) {
    console.error('Error obteniendo mensajes:', error);
    res.status(500).json({ error: 'Error al obtener mensajes' });
  }
});

// ============================================
// MARCAR MENSAJE COMO RESPONDIDO Y ENVIAR CORREO
// ============================================
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { respuesta } = req.body;

    const message = await prisma.message.findUnique({
      where: { id }
    });

    if (!message) {
      return res.status(404).json({ error: 'Mensaje no encontrado' });
    }

    const updated = await prisma.message.update({
      where: { id },
      data: {
        respondido: true,
        respuesta: respuesta || null,
        respondidoEn: new Date()
      }
    });

    // Enviar correo al usuario con la respuesta
    if (respuesta && message.email) {
      try {
        await sendMessageResponseEmail(
          message.email,
          message.nombre,
          message.asunto,
          respuesta
        );
        console.log(`Correo de respuesta enviado a ${message.email}`);
      } catch (emailError) {
        console.error('Error enviando correo de respuesta:', emailError);
      }
    }

    res.json({
      message: 'Mensaje marcado como respondido',
      data: updated
    });
  } catch (error) {
    console.error('Error actualizando mensaje:', error);
    res.status(500).json({ error: 'Error al actualizar mensaje' });
  }
});

export default router;