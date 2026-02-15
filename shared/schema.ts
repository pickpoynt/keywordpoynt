import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const searchHistory = pgTable("search_history", {
  id: serial("id").primaryKey(),
  query: text("query").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const savedKeywords = pgTable("saved_keywords", {
  id: serial("id").primaryKey(),
  keyword: text("keyword").notNull(),
  sourceQuery: text("source_query"),
  createdAt: timestamp("created_at").defaultNow(),
});

// === SCHEMAS ===
export const insertSearchHistorySchema = createInsertSchema(searchHistory).omit({ id: true, createdAt: true });
export const insertSavedKeywordSchema = createInsertSchema(savedKeywords).omit({ id: true, createdAt: true });

// === EXPLICIT API TYPES ===
export type SearchHistory = typeof searchHistory.$inferSelect;
export type SavedKeyword = typeof savedKeywords.$inferSelect;

export type InsertSearchHistory = z.infer<typeof insertSearchHistorySchema>;
export type InsertSavedKeyword = z.infer<typeof insertSavedKeywordSchema>;

// Request/Response types
export type KeywordResult = {
  letter: string;
  query: string;
  suggestions: string[];
};

export type SearchResponse = {
  originalQuery: string;
  results: KeywordResult[];
};
