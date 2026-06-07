import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { sendWelcomeEmail, sendPasswordResetEmail } from '../services/emailService.js';

const router = express.Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'hydronova-secret-key-change-in-production';
const JWT_EXPIRES_IN = '24h';

// Registro
router.post('/register', async (req, res) => {
  try {
    const { email, password, nombre, telefono, direccion } = req.body;

    if (!email || !password || !nombre) {
      return res.status(400).json({ error: 'Email, contraseña y nombre son requeridos' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nombre,
        telefono: telefono || null,
        direccion: direccion || null,
        rol: 'cliente'
      },
      select: { id: true, email: true, nombre: true, rol: true }
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Enviar correo de bienvenida sin bloquear la respuesta
    const customerData = {
      email: user.email,
      name: user.nombre
    };
    sendWelcomeEmail(customerData)
      .then(() => console.log(`Email de bienvenida enviado a ${user.email}`))
      .catch(emailError => console.error(`Error enviando email a ${user.email}:`, emailError.message));

    res.status(201).json({ message: 'Usuario registrado exitosamente', user, token });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    if (!user.activo) {
      return res.status(403).json({ error: 'Usuario inactivo' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        rol: user.rol
      },
      token
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// Verificar token (para mantener sesión)
router.post('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token requerido' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, nombre: true, rol: true, activo: true }
    });

    if (!user || !user.activo) {
      return res.status(401).json({ error: 'Usuario no válido' });
    }

    res.json({ user, valid: true });
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
});

// Obtener perfil
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, nombre: true, telefono: true, direccion: true, rol: true }
    });

    res.json(user);
  } catch (error) {
    res.status(401).json({ error: 'No autorizado' });
  }
});

// Actualizar perfil
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const { nombre, telefono, direccion, password } = req.body;

    const updateData = {};
    if (nombre) updateData.nombre = nombre;
    if (telefono) updateData.telefono = telefono;
    if (direccion) updateData.direccion = direccion;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: decoded.id },
      data: updateData,
      select: { id: true, email: true, nombre: true, telefono: true, direccion: true, rol: true }
    });

    res.json({ message: 'Perfil actualizado exitosamente', user });
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
});

// Solicitar recuperación de contraseña
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'El email es requerido' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.json({ message: 'Si el email está registrado, recibirás un enlace de recuperación' });
    }

    await prisma.passwordResetToken.deleteMany({
      where: { 
        email: email,
        used: false
      }
    });

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000);

    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expiresAt,
        used: false
      }
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    await sendPasswordResetEmail({ email, name: user.nombre, resetLink });

    console.log(`Email de recuperación enviado a ${email}`);
    res.json({ message: 'Si el email está registrado, recibirás un enlace de recuperación' });

  } catch (error) {
    console.error('Error en forgot-password:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
});

// Restablecer contraseña
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token y nueva contraseña son requeridos' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token: token,
        used: false,
        expiresAt: { gt: new Date() }
      }
    });

    if (!resetToken) {
      return res.status(400).json({ error: 'El enlace es inválido o ha expirado' });
    }

    const user = await prisma.user.findUnique({
      where: { email: resetToken.email }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    await prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true }
    });

    res.json({ message: 'Contraseña actualizada exitosamente' });

  } catch (error) {
    console.error('Error en reset-password:', error);
    res.status(500).json({ error: 'Error al restablecer la contraseña' });
  }
});

export default router;