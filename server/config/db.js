import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const startServer=async ()=> {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (err) {
    console.error('❌ Failed to connect to the database:', err.message);
    process.exit(1);
  }
}