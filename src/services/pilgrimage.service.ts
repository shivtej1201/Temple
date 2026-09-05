import { prisma } from "@/lib/db/prisma";

export class PilgrimageService {
  /**
   * Fetch all official pilgrimages (master routes)
   */
  static async getPilgrimages() {
    try {
      const dbPilgrimages = await prisma.pilgrimage.findMany({
        where: { isOfficial: true },
        include: { region: true, deity: true, temples: true }
      });
      if (dbPilgrimages.length > 0) {
        return dbPilgrimages.map(p => ({
          ...p,
          templeCount: p.temples.length
        }));
      }
    } catch (e) {}
    
    // Return mock data for UI scaffolding since DB is not seeded
    return [
      {
        id: "pilg-1",
        name: "Ashtavinayak Yatra",
        slug: "ashtavinayak",
        description: "The sacred pilgrimage of eight Ganesha temples in Maharashtra in a specific sequence.",
        durationDays: 3,
        difficulty: "EASY",
        isOfficial: true,
        region: { name: "Maharashtra" },
        deity: { name: "Ganesha" },
        templeCount: 8,
      },
      {
        id: "pilg-2",
        name: "Jyotirlinga Darshan",
        slug: "jyotirlinga",
        description: "A pan-India journey to the twelve most sacred shrines of Lord Shiva.",
        durationDays: 14,
        difficulty: "MODERATE",
        isOfficial: true,
        region: { name: "All India" },
        deity: { name: "Shiva" },
        templeCount: 12,
      }
    ];
  }

  /**
   * Fetch a specific pilgrimage with its ordered sequence of temples
   */
  static async getPilgrimageDetails(slug: string) {
    try {
      const pilg = await prisma.pilgrimage.findUnique({
        where: { slug },
        include: {
          temples: {
            orderBy: { sequence: 'asc' },
            include: { temple: true }
          }
        }
      });
      if (pilg && pilg.temples.length > 0) {
        return {
          name: pilg.name,
          description: pilg.description,
          durationDays: pilg.durationDays,
          sequence: pilg.temples
        };
      }
    } catch (e) {}

    if (slug === 'ashtavinayak') {
      return {
        name: "Ashtavinayak Yatra",
        description: "The sacred pilgrimage of eight Ganesha temples in Maharashtra. According to tradition, the pilgrimage must be completed in a specific sequence.",
        durationDays: 3,
        sequence: [
          { dayNumber: 1, sequence: 1, temple: { name: "Moreshwar", address: "Morgaon" }, notes: "Start here" },
          { dayNumber: 1, sequence: 2, temple: { name: "Siddhivinayak", address: "Siddhatek" }, notes: "" },
          { dayNumber: 2, sequence: 3, temple: { name: "Ballaleshwar", address: "Pali" }, notes: "" }
        ]
      }
    }
    return null;
  }
}
