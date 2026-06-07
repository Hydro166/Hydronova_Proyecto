// HydroNova v1.0 - Database Seeds
// prisma/seed.js

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed de datos...');

  try {
    // ============================================
    // LIMPIAR DATOS ANTERIORES (CUIDADO)
    // ============================================
    await prisma.cartItem.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.message.deleteMany();
    await prisma.user.deleteMany();

    console.log('✓ Base de datos limpiada');

    // ============================================
    // CREAR USUARIOS
    // ============================================
    const adminPassword = await bcrypt.hash('Admin123!', 10);
    const clientePassword = await bcrypt.hash('Cliente123!', 10);

    const admin = await prisma.user.create({
      data: {
        email: 'admin@hydronova.com',
        password: adminPassword,
        nombre: 'Administrador',
        telefono: '+57-300-000-0001',
        direccion: 'Medellín, Colombia',
        rol: 'admin',
        activo: true
      }
    });

    const cliente = await prisma.user.create({
      data: {
        email: 'cliente@example.com',
        password: clientePassword,
        nombre: 'Cliente Prueba',
        telefono: '+57-300-999-9999',
        direccion: 'Medellín, Colombia',
        rol: 'cliente',
        activo: true
      }
    });

    console.log('✓ Usuarios creados:');
    console.log(`  - ${admin.email} (Admin)`);
    console.log(`  - ${cliente.email} (Cliente)`);

    // ============================================
    // CREAR PRODUCTOS CON UNIDAD DE MEDIDA
    // ============================================
    const productos = [
      {
        nombre: 'Lechuga Orgánica Hidropónica',
        descripcion: 'Lechuga fresca cultivada sin pesticidas en nuestro sistema hidropónico. Cosechada el mismo día de entrega.',
        precio: 12900,
        stock: 150,
        categoria: 'Vegetales',
        unidadMedida: 'unidad',
        imagenUrl: 'https://res.cloudinary.com/dceo7bqhd/image/upload/v1779585634/2_ufpg4u.jpg'
      },
      {
        nombre: 'Cilantro Premium',
        descripcion: 'Hierba aromática fresca, cultivada hidroponicamente en ambiente controlado. Sin pesticidas.',
        precio: 8900,
        stock: 200,
        categoria: 'Hierbas',
        unidadMedida: 'manojo',
        imagenUrl: 'https://res.cloudinary.com/dceo7bqhd/image/upload/v1779585635/3_exi30t.jpg'
      },
      {
        nombre: 'Tomate Cherry Orgánico',
        descripcion: 'Tomates cherry dulces y jugosos cultivados con hidropónica. Ideal para ensaladas.',
        precio: 15900,
        stock: 100,
        categoria: 'Vegetales',
        unidadMedida: '200g',
        imagenUrl: 'https://res.cloudinary.com/dceo7bqhd/image/upload/v1779585636/4_cxp7hv.jpg'
      },
      {
        nombre: 'Pack Ensalada Fresca',
        descripcion: 'Combo: Lechuga + Cilantro + Tomate Cherry. Todo lo necesario para una ensalada nutritiva.',
        precio: 25900,
        stock: 80,
        categoria: 'Combos',
        unidadMedida: 'paquete',
        imagenUrl: 'https://res.cloudinary.com/dceo7bqhd/image/upload/v1779585635/5_bhhwvj.jpg'
      },
      {
        nombre: 'Microgreens Superfoods',
        descripcion: 'Germinados concentrados de alta potencia nutricional. Ricos en vitaminas y minerales.',
        precio: 22900,
        stock: 60,
        categoria: 'Superfoods',
        unidadMedida: '100g',
        imagenUrl: 'https://res.cloudinary.com/dceo7bqhd/image/upload/v1779585637/14_uefh3a.jpg'
      }
    ];

    for (const producto of productos) {
      await prisma.product.create({ data: producto });
    }

    console.log(`✓ ${productos.length} productos creados`);

    // ============================================
    // RESUMEN FINAL
    // ============================================
    console.log('\n✅ SEED COMPLETADO EXITOSAMENTE\n');
    console.log('═══════════════════════════════════════════');
    console.log('CREDENCIALES PARA LOGIN');
    console.log('═══════════════════════════════════════════');
    console.log(`\n🔑 ADMIN: ${admin.email} / Admin123!`);
    console.log(`🔑 CLIENTE: ${cliente.email} / Cliente123!`);
    console.log('\n═══════════════════════════════════════════');

  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();