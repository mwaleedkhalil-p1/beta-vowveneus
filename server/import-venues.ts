import fs from 'fs';
import path from 'path';
import { Venue } from '@shared/schema';

export async function importVenues() {
  try {
    // Clear existing venues
    await Venue.deleteMany({});
    console.log('Cleared existing venues');

    const filePath = path.resolve(process.cwd(), 'attached_assets/halls.txt');
    const data = await fs.promises.readFile(filePath, 'utf8');
    const lines = data.split('\n').filter(Boolean);

    const venues = [];
    for (const line of lines) {
      try {
        const parts = line.split('\t').map(part => part.trim());
        if (parts.length < 6) {
          console.log('Skipping: insufficient parts:', line);
          continue;
        }

        const name = parts[0];
        const capacity = parseInt(parts[1], 10);
        const parking = parseInt(parts[2], 10);
        const phone = parts[3];
        const address = parts[4];
        const price = parseInt(parts[5], 10);
        const email = parts[6] || undefined;

        if (!name || !capacity || isNaN(price)) {
          console.log('Skipping: invalid data:', line);
          continue;
        }

        venues.push({
          name,
          capacity,
          additionalMetric: parking,
          phone,
          address,
          price,
          email,
        });

        console.log('Successfully parsed venue:', name);

      } catch (error) {
        console.error('Error parsing line:', line);
        if (error instanceof Error) {
          console.error('Error details:', error.message);
        }
      }
    }

    if (venues.length > 0) {
      const result = await Venue.insertMany(venues);
      console.log(`Successfully imported ${venues.length} venues from halls.txt`);
    } else {
      console.log('No valid venues found to import');
    }

  } catch (error) {
    console.error('Error importing venues:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
  }
}
