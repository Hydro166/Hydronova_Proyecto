import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@hydronova.com';
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hash,
      rol: 'admin',
      nombre: 'Administrador',
      activo: true
    },
    create: {
      email: email,
      password: hash,
      nombre: 'Administrador',
      rol: 'admin',
      activo: true
    }
  });

  console.log('Usuario actualizado:', user.email);
  console.log('Contraseña:', password);
  console.log('Rol:', user.rol);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());