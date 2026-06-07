import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const email = 'admin@hydronova.com';
const password = 'admin123';

const hash = await bcrypt.hash(password, 10);

await prisma.user.upsert({
  where: { email },
  update: {
    password: hash,
    rol: 'admin',
    nombre: 'Administrador',
    activo: true
  },
  create: {
    email,
    password: hash,
    nombre: 'Administrador',
    rol: 'admin',
    activo: true
  }
});

console.log(`Admin creado/actualizado: ${email} / ${password}`);

await prisma.$disconnect();