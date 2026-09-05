import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';
import { prisma } from '../src/lib/db/prisma';

// Define the expected CSV row structure
interface TempleCSVRow {
  name: string;
  slug: string;
  description: string;
  address: string;
  latitude: string;
  longitude: string;
  city: string;
  state: string;
  templeType: string;
  isVerified: string;
}

const BATCH_SIZE = 50;

async function importTemples(filePath: string) {
  const resolvedPath = path.resolve(process.cwd(), filePath);
  
  if (!fs.existsSync(resolvedPath)) {
    console.error(`❌ File not found at: ${resolvedPath}`);
    process.exit(1);
  }

  console.log(`🚀 Starting import from ${resolvedPath}...`);

  const results: TempleCSVRow[] = [];

  // Read CSV
  fs.createReadStream(resolvedPath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      console.log(`✅ Parsed ${results.length} rows from CSV. Starting database insertion...`);
      
      let successCount = 0;
      let errorCount = 0;

      // Process in batches
      for (let i = 0; i < results.length; i += BATCH_SIZE) {
        const batch = results.slice(i, i + BATCH_SIZE);
        
        try {
          // Process batch sequentially to easily handle Region upserts
          for (const row of batch) {
            
            // 1. Validate required fields
            if (!row.name || !row.slug || !row.city || !row.state) {
              console.warn(`⚠️ Skipping row due to missing required fields (name, slug, city, state): ${row.name}`);
              errorCount++;
              continue;
            }

            // 2. Ensure State and City Regions exist
            // Create a simple URL-friendly slug
            const stateSlug = row.state.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const citySlug = row.city.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');

            let stateRegion = await prisma.region.findUnique({
              where: { slug: stateSlug }
            });

            if (!stateRegion) {
              stateRegion = await prisma.region.create({
                data: {
                  name: row.state.trim(),
                  slug: stateSlug,
                  type: 'STATE'
                }
              });
            }

            let cityRegion = await prisma.region.findUnique({
              where: { slug: citySlug }
            });

            if (!cityRegion) {
              cityRegion = await prisma.region.create({
                data: {
                  name: row.city.trim(),
                  slug: citySlug,
                  type: 'CITY',
                  parentId: stateRegion.id
                }
              });
            }

            // 3. Insert or Update Temple
            await prisma.temple.upsert({
              where: { slug: row.slug.trim() },
              update: {
                name: row.name.trim(),
                description: row.description?.trim(),
                latitude: parseFloat(row.latitude) || null,
                longitude: parseFloat(row.longitude) || null,
                templeType: row.templeType?.trim() || 'General',
                isVerified: row.isVerified?.toLowerCase() === 'true',
                stateId: stateRegion.id,
                cityId: cityRegion.id,
              },
              create: {
                name: row.name.trim(),
                slug: row.slug.trim(),
                description: row.description?.trim(),
                latitude: parseFloat(row.latitude) || null,
                longitude: parseFloat(row.longitude) || null,
                templeType: row.templeType?.trim() || 'General',
                isVerified: row.isVerified?.toLowerCase() === 'true',
                stateId: stateRegion.id,
                cityId: cityRegion.id,
              }
            });
            successCount++;
          }
          console.log(`⏳ Processed batch ${i / BATCH_SIZE + 1} (${Math.min(i + BATCH_SIZE, results.length)}/${results.length})`);
        } catch (error) {
          console.error(`❌ Error processing batch starting at row ${i}:`, error);
        }
      }

      console.log(`\n🎉 Import Complete!`);
      console.log(`✅ Successfully imported: ${successCount}`);
      console.log(`❌ Failed/Skipped: ${errorCount}`);
      
      await prisma.$disconnect();
    });
}

// Get the file path from command line arguments
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("❌ Please provide a CSV file path.");
  console.log("Usage: npx tsx scripts/import-temples.ts <path-to-csv>");
  process.exit(1);
}

importTemples(args[0]);
