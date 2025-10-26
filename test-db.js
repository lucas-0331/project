const { PrismaClient } = require('./src/generated/prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log('> Conexão bem-sucedida com o banco de dados!');
  } catch (e) {
    console.error('> Erro ao conectar:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
