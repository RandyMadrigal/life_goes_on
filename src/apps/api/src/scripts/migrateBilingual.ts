import "dotenv/config";
import mongoose, { Types } from "mongoose";
import { env } from "../config/env";
import { QuoteModel } from "../models/quote.model";
import { MoodModel } from "../models/mood.model";
import moodLabelTranslations from "./data/moodTranslations.json";
import quoteTextTranslations from "./data/quoteTranslations.json";

// ── Helpers ──────────────────────────────────────────────────────────────────

// Mirrors the toLabelName logic in controllers/adminMood.controller.ts — trim,
// split on whitespace, capitalize each word, join with no spaces.
const toLabelName = (label: string): string =>
  label
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");

const pickRandom = <T>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

async function main() {
  await mongoose.connect(env.MONGODB_URI);
  console.log("Connected to MongoDB.");

  // ── Step 1: Backfill language: "en" on existing docs that don't have it ────
  const moodBackfill = await MoodModel.updateMany(
    { language: { $exists: false } },
    { $set: { language: "en" } },
  );
  const quoteBackfill = await QuoteModel.updateMany(
    { language: { $exists: false } },
    { $set: { language: "en" } },
  );
  console.log(
    `Backfilled language="en" on ${moodBackfill.modifiedCount} moods and ${quoteBackfill.modifiedCount} quotes.`,
  );

  // ── Step 2: Moods first — translate and pair ────────────────────────────────
  const englishMoods = await MoodModel.find({
    language: "en",
    pairId: { $exists: false },
  });
  const alreadyPairedMoodCount = await MoodModel.countDocuments({
    language: "en",
    pairId: { $exists: true },
  });

  const englishToSpanishMoodName = new Map<string, string>();
  // Include moods that were already paired in an earlier run so quote mapping
  // (step 3) still works correctly on a re-run.
  const alreadyPairedMoods = await MoodModel.find({
    language: "en",
    pairId: { $exists: true },
  });
  for (const mood of alreadyPairedMoods) {
    const spanishPair = await MoodModel.findById(mood.pairId);
    if (spanishPair) {
      englishToSpanishMoodName.set(mood.name, spanishPair.name);
    }
  }

  const moodExamples: { en: string; es: string }[] = [];

  for (const mood of englishMoods) {
    const spanishLabel = (moodLabelTranslations as Record<string, string>)[mood.name];
    if (!spanishLabel) {
      throw new Error(
        `No Spanish translation found for mood "${mood.name}" (label "${mood.label}"). Aborting.`,
      );
    }
    const spanishName = toLabelName(spanishLabel);
    const pairId = new Types.ObjectId();

    await MoodModel.create({
      _id: pairId,
      name: spanishName,
      label: spanishLabel,
      order: mood.order,
      language: "es",
      pairId: mood._id,
    });

    mood.pairId = pairId;
    await mood.save();

    englishToSpanishMoodName.set(mood.name, spanishName);
    moodExamples.push({
      en: `${mood.name} (${mood.label})`,
      es: `${spanishName} (${spanishLabel})`,
    });
  }

  console.log(
    `Moods: translated ${englishMoods.length}, skipped ${alreadyPairedMoodCount} (already had pairId).`,
  );

  // ── Step 3: Quotes — translate and pair, remapping moods to Spanish names ──
  const englishQuotes = await QuoteModel.find({
    language: "en",
    pairId: { $exists: false },
  });
  const alreadyPairedQuoteCount = await QuoteModel.countDocuments({
    language: "en",
    pairId: { $exists: true },
  });

  const quoteExamples: { en: string; es: string }[] = [];
  const translations = quoteTextTranslations as Record<string, string>;

  for (const quote of englishQuotes) {
    const id = quote._id.toString();
    const spanishText = translations[id];
    if (!spanishText) {
      throw new Error(
        `No Spanish translation found for quote id "${id}" (text: "${quote.text}"). Aborting.`,
      );
    }

    const spanishMoods = quote.moods.map((englishMoodName) => {
      const spanishMoodName = englishToSpanishMoodName.get(englishMoodName);
      if (!spanishMoodName) {
        throw new Error(
          `No Spanish mood mapping found for mood "${englishMoodName}" referenced by quote id "${id}". Aborting.`,
        );
      }
      return spanishMoodName;
    });

    const pairId = new Types.ObjectId();

    await QuoteModel.create({
      _id: pairId,
      text: spanishText,
      moods: spanishMoods,
      language: "es",
      pairId: quote._id,
    });

    quote.pairId = pairId;
    await quote.save();

    quoteExamples.push({ en: quote.text, es: spanishText });
  }

  console.log(
    `Quotes: translated ${englishQuotes.length}, skipped ${alreadyPairedQuoteCount} (already had pairId).`,
  );

  // ── Step 4: Spot-check samples ───────────────────────────────────────────────
  if (moodExamples.length > 0) {
    console.log("\n── Sample mood translations (en -> es) ──");
    for (const ex of pickRandom(moodExamples, Math.min(5, moodExamples.length))) {
      console.log(`  ${ex.en}  ->  ${ex.es}`);
    }
  }

  if (quoteExamples.length > 0) {
    console.log("\n── Sample quote translations (en -> es) ──");
    for (const ex of pickRandom(quoteExamples, Math.min(5, quoteExamples.length))) {
      console.log(`  "${ex.en}"\n  -> "${ex.es}"\n`);
    }
  }

  const finalQuoteCount = await QuoteModel.countDocuments();
  const finalMoodCount = await MoodModel.countDocuments();
  console.log(`\nFinal counts — Quotes: ${finalQuoteCount}, Moods: ${finalMoodCount}`);

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
