import { db } from './client';
import { users, waterLogs } from './schemas';

async function seed() {
  console.log('Seeding database...');

  const userId = 'Ub62bd73807513af5725304895812ad64';

  await db.insert(users).values({
    id: userId,
  }).onConflictDoNothing();

  await db.insert(waterLogs).values([
    { userId, amount: 300 },
    { userId, amount: 500 },
  ]);

  console.log('Seeding complete!');
}

seed()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(() => process.exit());