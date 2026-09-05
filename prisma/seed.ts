import { prisma } from '../src/lib/db/prisma'

async function main() {
  console.log('Starting database seeding...')

  // 1. Create Regions
  const maharashtra = await prisma.region.upsert({
    where: { slug: 'maharashtra' },
    update: {},
    create: {
      name: 'Maharashtra',
      slug: 'maharashtra',
      type: 'STATE',
      description: 'The land of the Ashtavinayak and multiple Jyotirlingas.',
    },
  })

  const up = await prisma.region.upsert({
    where: { slug: 'uttar-pradesh' },
    update: {},
    create: {
      name: 'Uttar Pradesh',
      slug: 'uttar-pradesh',
      type: 'STATE',
      description: 'The spiritual heartland of India.',
    },
  })

  // 2. Create Deities
  const shiva = await prisma.deity.upsert({
    where: { slug: 'shiva' },
    update: {},
    create: {
      name: 'Shiva',
      slug: 'shiva',
      description: 'The Auspicious One, the destroyer and transformer.',
    },
  })

  const ganesha = await prisma.deity.upsert({
    where: { slug: 'ganesha' },
    update: {},
    create: {
      name: 'Ganesha',
      slug: 'ganesha',
      description: 'The Lord of Beginnings and the Remover of Obstacles.',
    },
  })

  // 3. Create Temples
  const kashi = await prisma.temple.upsert({
    where: { slug: 'kashi-vishwanath' },
    update: {},
    create: {
      name: 'Kashi Vishwanath',
      slug: 'kashi-vishwanath',
      description: 'One of the most famous Hindu temples dedicated to Lord Shiva. It is located in Varanasi, Uttar Pradesh.',
      templeType: 'JYOTIRLINGA',
      isMajor: true,
      isVerified: true,
      regionId: up.id,
      primaryDeityId: shiva.id,
      latitude: 25.3109,
      longitude: 83.0107,
      googlePlaceId: 'ChIJX9v2p0-njzkRM2V8R8uN368', // Placeholder ID
    },
  })

  const trimbakeshwar = await prisma.temple.upsert({
    where: { slug: 'trimbakeshwar' },
    update: {},
    create: {
      name: 'Trimbakeshwar',
      slug: 'trimbakeshwar',
      description: 'An ancient Hindu temple in the town of Trimbak, in the Trimbakeshwar tehsil in the Nashik District of Maharashtra.',
      templeType: 'JYOTIRLINGA',
      isMajor: true,
      isVerified: true,
      regionId: maharashtra.id,
      primaryDeityId: shiva.id,
      latitude: 19.9324,
      longitude: 73.5303,
    },
  })

  const siddhivinayak = await prisma.temple.upsert({
    where: { slug: 'siddhivinayak-mumbai' },
    update: {},
    create: {
      name: 'Siddhivinayak Temple',
      slug: 'siddhivinayak-mumbai',
      description: 'A Hindu temple dedicated to Lord Shri Ganesha. It is located in Prabhadevi, Mumbai.',
      templeType: 'MAJOR_TEMPLE',
      isMajor: true,
      isVerified: true,
      regionId: maharashtra.id,
      primaryDeityId: ganesha.id,
      latitude: 19.0169,
      longitude: 72.8300,
    },
  })

  // 4. Create Pilgrimage
  const ashtavinayak = await prisma.pilgrimage.upsert({
    where: { slug: 'ashtavinayak' },
    update: {},
    create: {
      name: 'Ashtavinayak Yatra',
      slug: 'ashtavinayak',
      description: 'The sacred pilgrimage of eight Ganesha temples in Maharashtra.',
      durationDays: 3,
      difficulty: 'EASY',
      isOfficial: true,
      regionId: maharashtra.id,
      deityId: ganesha.id,
    },
  })

  // 5. Create Festival
  const mahashivratri = await prisma.festival.upsert({
    where: { slug: 'mahashivratri' },
    update: {},
    create: {
      name: 'Mahashivratri',
      slug: 'mahashivratri',
      description: 'A festival celebrated annually in honour of the god Shiva.',
      isMajor: true,
      deityId: shiva.id,
      festivalType: 'HINDU',
    },
  })

  console.log('Seeding completed successfully!')
  console.log({
    regions: [maharashtra.name, up.name],
    deities: [shiva.name, ganesha.name],
    temples: [kashi.name, trimbakeshwar.name, siddhivinayak.name],
    pilgrimages: [ashtavinayak.name],
    festivals: [mahashivratri.name]
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
