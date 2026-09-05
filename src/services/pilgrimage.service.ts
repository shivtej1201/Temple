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
      return dbPilgrimages.map(p => ({
        ...p,
        templeCount: p.temples.length
      }));
    } catch (error) {
      console.error("Error fetching pilgrimages:", error);
      return [];
    }
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
          ...pilg,
          sequence: pilg.temples
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching pilgrimage details:", error);
      return null;
    }
  }
}
