import { searchHistory, savedKeywords, type InsertSearchHistory, type InsertSavedKeyword, type SearchHistory, type SavedKeyword } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Search History
  createSearchHistory(entry: InsertSearchHistory): Promise<SearchHistory>;
  getSearchHistory(): Promise<SearchHistory[]>;

  // Saved Keywords
  createSavedKeyword(entry: InsertSavedKeyword): Promise<SavedKeyword>;
  getSavedKeywords(): Promise<SavedKeyword[]>;
  deleteSavedKeyword(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Search History
  async createSearchHistory(entry: InsertSearchHistory): Promise<SearchHistory> {
    const [result] = await db.insert(searchHistory).values(entry).returning();
    return result;
  }

  async getSearchHistory(): Promise<SearchHistory[]> {
    return await db.select().from(searchHistory).orderBy(desc(searchHistory.createdAt));
  }

  // Saved Keywords
  async createSavedKeyword(entry: InsertSavedKeyword): Promise<SavedKeyword> {
    const [result] = await db.insert(savedKeywords).values(entry).returning();
    return result;
  }

  async getSavedKeywords(): Promise<SavedKeyword[]> {
    return await db.select().from(savedKeywords).orderBy(desc(savedKeywords.createdAt));
  }

  async deleteSavedKeyword(id: number): Promise<void> {
    await db.delete(savedKeywords).where(eq(savedKeywords.id, id));
  }
}

export const storage = new DatabaseStorage();
