import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { seedDatabase } from "./seed";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Seed data
  await seedDatabase();

  // === Keyword Search Logic ===
  app.post(api.keywords.search.path, async (req, res) => {
    try {
      const { query, country } = api.keywords.search.input.parse(req.body);

      // Save to history
      await storage.createSearchHistory({ query });

      const results: { letter: string; query: string; suggestions: string[] }[] = [];
      const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

      // We'll fetch in batches to be polite and fast
      // Google Autocomplete URL: http://suggestqueries.google.com/complete/search?client=firefox&q=...

      const fetchSuggestions = async (letter: string) => {
        const subQuery = query.replace('*', letter);
        // Using a more reliable Google Autocomplete endpoint with country code
        const url = `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(subQuery)}&gl=${country || 'US'}`;

        try {
          const response = await fetch(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
          });
          if (!response.ok) return null;

          const data = await response.json();
          // Format for client=chrome is [query, [suggestions], [descriptions], ...]
          const suggestions = data[1] || [];

          return {
            letter,
            query: subQuery,
            suggestions: suggestions.slice(0, 10) // Limit to top 10 per letter
          };
        } catch (error) {
          console.error(`Failed to fetch for letter ${letter}:`, error);
          return null;
        }
      };

      // Execute all requests
      // Note: For a production app, we might want to rate limit or use a proxy pool.
      // For this tool, we'll try to do them all. If it fails, we handle it gracefully.
      const promises = alphabet.map(letter => fetchSuggestions(letter));
      const responses = await Promise.all(promises);

      // Filter out failed requests and empty results
      responses.forEach(r => {
        if (r && r.suggestions.length > 0) {
          results.push(r);
        }
      });

      res.json({
        originalQuery: query,
        results
      });

    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error('Search error:', err);
      res.status(500).json({ message: "Failed to fetch suggestions" });
    }
  });

  // === Saved Keywords ===
  app.get(api.saved.list.path, async (req, res) => {
    const keywords = await storage.getSavedKeywords();
    res.json(keywords);
  });

  app.post(api.saved.create.path, async (req, res) => {
    try {
      const entry = api.saved.create.input.parse(req.body);
      const result = await storage.createSavedKeyword(entry);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.delete(api.saved.delete.path, async (req, res) => {
    await storage.deleteSavedKeyword(Number(req.params.id));
    res.status(204).send();
  });

  // === History ===
  app.get(api.history.list.path, async (req, res) => {
    const history = await storage.getSearchHistory();
    res.json(history);
  });

  return httpServer;
}
