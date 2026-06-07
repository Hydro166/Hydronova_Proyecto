import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Importar middlewares
import { authMiddleware, adminOnlyMiddleware } from './middleware/auth.js';

// Importar rutas públicas
import authRoutes from './routes/auth.js';
import productsRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import ordersRoutes from './routes/orders.js';
import messagesRoutes from './routes/messages.js';

// Importar rutas de administración
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Rutas públicas
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/messages', messagesRoutes);

// Rutas protegidas (requieren autenticación)
app.use('/api/cart', authMiddleware, cartRoutes);
app.use('/api/orders', authMiddleware, ordersRoutes);

// Rutas de administración (requieren autenticación + rol admin)
app.use('/api/admin', authMiddleware, adminOnlyMiddleware, adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ message: 'HydroNova API funcionando' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Cerrar Prisma al terminar
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});