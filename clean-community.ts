import { prisma } from './src/lib/db/prisma';

async function main() {
  console.log("Cleaning community data...");

  // Delete all comments and threads
  await prisma.comment.deleteMany();
  await prisma.thread.deleteMany();

  console.log("Old mock discussions purged.");

  // Create a realistic thread
  const user = await prisma.user.findFirst({ where: { role: 'USER' } });
  
  if (user) {
    await prisma.thread.create({
      data: {
        title: "Best time to visit Trimbakeshwar for VIP Darshan?",
        content: "I'm planning a visit to Trimbakeshwar next month. Can anyone advise on the best time to go for VIP Darshan to avoid the massive crowds?",
        userId: user.id,
        status: "PUBLISHED",
        viewCount: 145,
        replyCount: 2,
        comments: {
          create: [
            {
              content: "Early morning around 5:30 AM is usually the best. Book online in advance if possible.",
              userId: user.id,
              status: "PUBLISHED"
            }
          ]
        }
      }
    });
    console.log("Seeded a new realistic thread.");
  } else {
    console.log("No user found to create a thread. Skipping thread creation.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
