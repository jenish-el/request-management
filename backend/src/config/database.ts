import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import logger from './logger';

// Ensure environment variables are loaded
dotenv.config();

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/nextjs-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  logger.error('DATABASE_URL environment variable is not set');
  console.error('❌ ERROR: DATABASE_URL environment variable is not set!');
  console.error('Please set DATABASE_URL in your .env file');
  console.error('Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public');
  console.error('Example: postgresql://postgres:postgres@localhost:5432/employee_request_db?schema=public');
  process.exit(1);
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Test connection on startup (non-blocking)
// Prisma connects lazily, but we test it here to catch errors early
prisma.$connect()
  .then(() => {
    logger.info('Database connected successfully');
    console.log('✅ Database connected successfully');
  })
  .catch((err: any) => {
    logger.error('Database connection failed', { 
      error: err.message || err,
      errorCode: err.code,
      errorCodeName: err.errorCode,
    });
    console.error('❌ Database connection failed!');
    console.error('Error:', err.message || err);
    if (err.errorCode === 'P1000') {
      console.error('\nPossible issues:');
      console.error('1. PostgreSQL server is not running');
      console.error('2. DATABASE_URL is incorrect');
      console.error('3. Database does not exist (run: npm run prisma:migrate)');
      console.error('4. Wrong credentials in DATABASE_URL');
      console.error('\nCurrent DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));
    }
    // Don't exit - let the server start and show the error
    // The first database query will fail anyway
  });

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
  logger.info('Database disconnected');
});

export default prisma;
