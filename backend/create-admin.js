import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@hydronova.com' },
    update: { 
      rol: 'admin',
      password: hashedPassword,
      nombre: 'Administrador',
      activo: true
    },
    create: {
      email: 'admin@hydronova.com',
      password: hashedPassword,
      nombre: 'Administrador',
      rol: 'admin',
      activo: true
    }
  });
  
  console.log('Admin creado exitosamente');
  console.log('Email: admin@hydronova.com');
  console.log('Contraseña: Admin123!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());