import { prisma } from './src/lib/db/prisma';

async function main() {
  const pilg = await prisma.pilgrimage.findUnique({ where: { slug: 'ashtavinayak' }});
  if (!pilg) {
    console.log("Pilgrimage not found, skipping.");
    return;
  }

  // Define the 8 temples of Ashtavinayak
  const ashtavinayakTemples = [
    { name: "Moreshwar", address: "Morgaon", lat: 18.277, lng: 74.316, sequence: 1 },
    { name: "Siddhivinayak", address: "Siddhatek", lat: 18.535, lng: 74.774, sequence: 2 },
    { name: "Ballaleshwar", address: "Pali", lat: 18.537, lng: 73.220, sequence: 3 },
    { name: "Varadvinayak", address: "Mahad", lat: 18.790, lng: 73.308, sequence: 4 },
    { name: "Chintamani", address: "Theur", lat: 18.527, lng: 74.049, sequence: 5 },
    { name: "Girijatmaj", address: "Lenyadri", lat: 19.239, lng: 73.882, sequence: 6 },
    { name: "Vighneshwar", address: "Ozar", lat: 19.184, lng: 73.957, sequence: 7 },
    { name: "Mahaganapati", address: "Ranjangaon", lat: 18.756, lng: 74.243, sequence: 8 }
  ];

  for (const t of ashtavinayakTemples) {
    const slug = `ashta-${t.name.toLowerCase()}`;
    
    const temple = await prisma.temple.upsert({
      where: { slug },
      update: {},
      create: {
        name: t.name,
        slug,
        description: `The ${t.sequence}th temple of Ashtavinayak.`,
        latitude: t.lat,
        longitude: t.lng,
        isVerified: true
      }
    });

    await prisma.pilgrimageTemple.upsert({
      where: {
        pilgrimageId_templeId: {
          pilgrimageId: pilg.id,
          templeId: temple.id
        }
      },
      update: {},
      create: {
        pilgrimageId: pilg.id,
        templeId: temple.id,
        sequence: t.sequence,
        dayNumber: Math.ceil(t.sequence / 3) // roughly 3 per day
      }
    });
  }
  
  console.log("Seeded Ashtavinayak temples!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
