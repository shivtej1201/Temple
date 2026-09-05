import { PrismaClient } from '@prisma/client';
import { PanchangEngine, TithiDefinition } from '../src/lib/calendar/panchang';

const prisma = new PrismaClient();

const FESTIVAL_DEFINITIONS: Record<string, TithiDefinition> = {
  'mahashivratri': { month: 'Phalguna', paksha: 'Krishna', day: 14 },
  'ganesh-chaturthi': { month: 'Bhadrapada', paksha: 'Shukla', day: 4 },
  'diwali': { month: 'Kartika', paksha: 'Krishna', day: 15 },
  'navaratri': { month: 'Ashvina', paksha: 'Shukla', day: 1 },
};

async function main() {
  console.log("Starting Festival Occurrence Generation Engine...");
  
  const years = [2026, 2027, 2028];
  
  for (const year of years) {
    console.log(`\n--- Calculating for Year: ${year} ---`);
    
    // Fetch all major festivals from DB
    const festivals = await prisma.festival.findMany({
      where: { isMajor: true }
    });
    
    for (const festival of festivals) {
      const def = FESTIVAL_DEFINITIONS[festival.slug];
      if (!def) {
        console.warn(`No Tithi definition found for festival: ${festival.slug}, skipping.`);
        continue;
      }
      
      // Calculate Gregorian Date using our Panchang Engine
      // Using standard Indian center coordinates
      const calculatedDate = await PanchangEngine.calculateFestivalDate(year, def);
      
      console.log(`Calculated ${festival.name} for ${year}: ${calculatedDate.startDate.toDateString()} (${calculatedDate.tithi})`);
      
      // Upsert the occurrence into the database
      /*
      await prisma.festivalOccurrence.create({
        data: {
          festivalId: festival.id,
          year: year,
          startDate: calculatedDate.startDate,
          endDate: calculatedDate.endDate,
          calendarSystem: 'HINDU_LUNAR',
          tithi: calculatedDate.tithi,
          status: 'PUBLISHED'
        }
      });
      */
    }
  }
  
  console.log("\nFestival occurrence generation complete.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
