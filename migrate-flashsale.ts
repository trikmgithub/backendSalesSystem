/**
 * A script to migrate existing items from boolean flashSale to percentage-based flashSale
 * 
 * Run with: 
 * npx ts-node migrate-flashsale.ts
 */

import { MongoClient } from 'mongodb';
import { config } from 'dotenv';

// Load environment variables
config();

async function migrateFlashSale() {
  const uri = process.env.MONGO_URL;
  
  if (!uri) {
    console.error('MONGO_URL environment variable is not defined');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db();
    const itemsCollection = database.collection('items');

    // Update items with flashSale: true to have a percentage value of 10%
    const updateTrueResult = await itemsCollection.updateMany(
      { flashSale: true },
      { $set: { flashSale: 10 } } // Set default discount to 10%
    );

    console.log(`Updated ${updateTrueResult.modifiedCount} items with flashSale: true to 10%`);

    // Update items with flashSale: false to have a percentage value of 0%
    const updateFalseResult = await itemsCollection.updateMany(
      { flashSale: false },
      { $set: { flashSale: 0 } }
    );

    console.log(`Updated ${updateFalseResult.modifiedCount} items with flashSale: false to 0%`);

    // Update any items without a flashSale field to have a value of 0%
    const updateMissingResult = await itemsCollection.updateMany(
      { flashSale: { $exists: false } },
      { $set: { flashSale: 0 } }
    );

    console.log(`Updated ${updateMissingResult.modifiedCount} items without flashSale to 0%`);

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

migrateFlashSale().catch(console.error);