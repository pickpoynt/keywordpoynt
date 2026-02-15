import { storage } from "./storage";

export async function seedDatabase() {
  const existingKeywords = await storage.getSavedKeywords();
  if (existingKeywords.length === 0) {
    console.log("Seeding database...");
    await storage.createSavedKeyword({
      keyword: "plumber near me",
      sourceQuery: "plumber *"
    });
    await storage.createSavedKeyword({
      keyword: "plumber salary",
      sourceQuery: "plumber *"
    });
    console.log("Database seeded!");
  }
}
