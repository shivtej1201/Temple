import { prisma } from './src/lib/db/prisma';

async function main() {
  console.log("Seeding festivals...");

  // 1. Create or Find Deities
  const shiva = await prisma.deity.upsert({
    where: { slug: 'shiva' },
    update: {},
    create: {
      name: 'Shiva',
      slug: 'shiva',
      description: 'The Destroyer, part of the Hindu Trinity.'
    }
  });

  const ganesha = await prisma.deity.upsert({
    where: { slug: 'ganesha' },
    update: {},
    create: {
      name: 'Ganesha',
      slug: 'ganesha',
      description: 'The Lord of Beginnings and Remover of Obstacles.'
    }
  });

  // 2. Create or Find Regions
  const maharashtra = await prisma.region.upsert({
    where: { slug: 'maharashtra' },
    update: {},
    create: { name: 'Maharashtra', slug: 'maharashtra', type: 'STATE' }
  });

  const up = await prisma.region.upsert({
    where: { slug: 'uttar-pradesh' },
    update: {},
    create: { name: 'Uttar Pradesh', slug: 'uttar-pradesh', type: 'STATE' }
  });

  // 3. Create Festivals
  const mahashivratri = await prisma.festival.upsert({
    where: { slug: 'mahashivratri' },
    update: {},
    create: {
      name: 'Maha Shivaratri',
      slug: 'mahashivratri',
      description: 'The Great Night of Shiva.',
      deityId: shiva.id,
      festivalType: 'NATIONAL',
      isMajor: true,
      defaultDurationDays: 1
    }
  });

  const ganeshChaturthi = await prisma.festival.upsert({
    where: { slug: 'ganesh-chaturthi' },
    update: {},
    create: {
      name: 'Ganesh Chaturthi',
      slug: 'ganesh-chaturthi',
      description: 'Celebrates the arrival of Lord Ganesha to earth.',
      deityId: ganesha.id,
      festivalType: 'REGIONAL',
      isMajor: true,
      defaultDurationDays: 10
    }
  });

  // 4. Create Occurrences for 2026
  await prisma.festivalOccurrence.deleteMany({
    where: { year: 2026 }
  });

  await prisma.festivalOccurrence.createMany({
    data: [
      {
        id: 'occ-1',
        festivalId: mahashivratri.id,
        year: 2026,
        startDate: new Date('2026-02-15T00:00:00Z'), // Placeholder date
        tithi: 'Chaturdashi',
        status: 'PUBLISHED'
      },
      {
        id: 'occ-2',
        festivalId: ganeshChaturthi.id,
        year: 2026,
        startDate: new Date('2026-09-14T00:00:00Z'), // Placeholder date
        regionId: maharashtra.id,
        tithi: 'Chaturthi',
        status: 'PUBLISHED'
      }
    ]
  });

  // 5. Link Festivals to specific Temples if possible
  // Find Kashi Vishwanath and Siddhivinayak if they exist
  const kashi = await prisma.temple.findFirst({ where: { slug: { contains: 'kashi' } } });
  if (kashi) {
    await prisma.festivalTemple.upsert({
      where: {
        festivalId_templeId: {
          festivalId: mahashivratri.id,
          templeId: kashi.id
        }
      },
      update: {},
      create: {
        festivalId: mahashivratri.id,
        templeId: kashi.id,
        importance: 1,
        description: 'One of the most important celebrations at the Jyotirlinga.'
      }
    });
  }

  const siddhi = await prisma.temple.findFirst({ where: { name: { contains: 'Siddhivinayak' } } });
  if (siddhi) {
    await prisma.festivalTemple.upsert({
      where: {
        festivalId_templeId: {
          festivalId: ganeshChaturthi.id,
          templeId: siddhi.id
        }
      },
      update: {},
      create: {
        festivalId: ganeshChaturthi.id,
        templeId: siddhi.id,
        importance: 1,
        description: 'The major annual 10-day celebration in Mumbai/Siddhatek.'
      }
    });
  }

  console.log("Festivals seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
