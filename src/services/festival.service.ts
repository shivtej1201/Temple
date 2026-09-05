import { prisma } from "@/lib/db/prisma";

export class FestivalService {
  /**
   * Fetch all upcoming festival occurrences for a given year and optionally month.
   */
  static async getUpcomingFestivals(year: number, month?: number, limit: number = 20) {
    // If month is provided, we filter by that specific month
    let startDate = new Date(year, month ? month - 1 : 0, 1);
    let endDate = month ? new Date(year, month, 0) : new Date(year, 11, 31);
    
    // In a real scenario, we'd query the DB:
    /*
    return await prisma.festivalOccurrence.findMany({
      where: {
        status: 'PUBLISHED',
        startDate: {
          gte: startDate,
          lte: endDate,
        }
      },
      include: {
        festival: {
          include: { deity: true }
        },
        region: true
      },
      orderBy: { startDate: 'asc' },
      take: limit
    });
    */

    // Returning mock data for UI scaffolding
    return [
      {
        id: "occ-1",
        startDate: new Date(year, 8, 7), // Sept 7
        endDate: new Date(year, 8, 17),
        festival: { name: "Ganesh Chaturthi", slug: "ganesh-chaturthi", imageUrl: null, deity: { name: "Ganesha" } },
        region: { name: "Maharashtra" },
        tithi: "Shukla Chaturthi",
        status: "PUBLISHED"
      },
      {
        id: "occ-2",
        startDate: new Date(year, 9, 12), // Oct 12
        endDate: new Date(year, 9, 21),
        festival: { name: "Navaratri", slug: "navaratri", imageUrl: null, deity: { name: "Durga" } },
        region: { name: "All India" },
        tithi: "Pratipada to Navami",
        status: "PUBLISHED"
      },
      {
        id: "occ-3",
        startDate: new Date(year, 9, 31), // Oct 31
        endDate: new Date(year, 9, 31),
        festival: { name: "Diwali", slug: "diwali", imageUrl: null, deity: { name: "Lakshmi" } },
        region: { name: "All India" },
        tithi: "Amavasya",
        status: "PUBLISHED"
      },
    ];
  }

  /**
   * Fetch temples strongly associated with a specific festival
   */
  static async getTemplesForFestival(festivalId: string) {
    /*
    return await prisma.festivalTemple.findMany({
      where: { festivalId },
      include: { temple: { include: { region: true } } },
      orderBy: { importance: 'desc' }
    });
    */
    return [];
  }
}
