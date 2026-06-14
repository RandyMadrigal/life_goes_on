import "dotenv/config";
import mongoose from "mongoose";
import { env } from "./config/env";
import { QuoteModel } from "./models/quote.model";
import { LetterModel } from "./models/letter.model";
import { quotes } from "./data/quotes";
import { letters } from "./data/letters";

async function seedQuotes(): Promise<void> {
  if (quotes.length === 0) return;

  const ops = quotes.map((q) => ({
    updateOne: {
      filter: { text: q.text },
      update: { $setOnInsert: { text: q.text, moods: q.moods } },
      upsert: true,
    },
  }));

  const result = await QuoteModel.bulkWrite(ops, { ordered: false });
  const inserted = result.upsertedCount;
  const skipped = quotes.length - inserted;
  console.log(`  quotes  → inserted: ${inserted}, skipped: ${skipped}`);
}

async function seedLetters(): Promise<void> {
  if (letters.length === 0) return;

  const ops = letters.map((l) => ({
    updateOne: {
      filter: { mood: l.mood, index: l.index },
      update: { $setOnInsert: { mood: l.mood, index: l.index, body: l.body } },
      upsert: true,
    },
  }));

  const result = await LetterModel.bulkWrite(ops, { ordered: false });
  const inserted = result.upsertedCount;
  const skipped = letters.length - inserted;
  console.log(`  letters → inserted: ${inserted}, skipped: ${skipped}`);
}

async function main(): Promise<void> {
  console.log("🌱  Seeding database...");

  await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  console.log("✅  Connected to MongoDB\n");

  await seedQuotes();
  await seedLetters();

  console.log("\n✅  Seed complete.");
  await mongoose.disconnect();
}

main().catch((err: unknown) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});
