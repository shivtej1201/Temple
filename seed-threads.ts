import { prisma } from './src/lib/db/prisma';

async function main() {
  const admin = await prisma.user.findUnique({ where: { username: 'admin' }});
  if (!admin) return;

  const t1 = await prisma.thread.create({
    data: {
      userId: admin.id,
      title: "What is the best time for VIP Darshan at Kashi Vishwanath?",
      content: "I am planning a visit next month with elderly parents. Does anyone know if the early morning Mangala Aarti passes are available online, or do we need to queue up?",
      viewCount: 245,
      replyCount: 14,
      status: "PUBLISHED"
    }
  });

  const t2 = await prisma.thread.create({
    data: {
      userId: admin.id,
      title: "Ashtavinayak Yatra Route Options from Pune",
      content: "I want to complete the yatra in 2 days from Pune. Which temples should I cover on day 1?",
      viewCount: 112,
      replyCount: 5,
      status: "PUBLISHED"
    }
  });

  console.log("Seeded threads!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
