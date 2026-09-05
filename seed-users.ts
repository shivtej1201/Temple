import { prisma } from './src/lib/db/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const hashedPassword = await bcrypt.hash('admin', 10);
  
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      password: hashedPassword,
    },
    create: {
      username: 'admin',
      email: 'admin@darshan.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });

  const userPassword = await bcrypt.hash('user', 10);
  await prisma.user.upsert({
    where: { username: 'user' },
    update: {
      password: userPassword,
    },
    create: {
      username: 'user',
      email: 'user@darshan.com',
      name: 'Regular User',
      password: userPassword,
      role: 'USER'
    }
  });

  console.log("Seeded users 'admin' and 'user'");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
