import { z } from 'zod';
import { insertSearchHistorySchema, insertSavedKeywordSchema, searchHistory, savedKeywords } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  keywords: {
    search: {
      method: 'POST' as const,
      path: '/api/keywords/search' as const,
      input: z.object({
        query: z.string().min(1, "Query is required").refine(s => s.includes('*'), "Query must contain an asterisk (*) wildcard"),
        country: z.string().length(2).optional().default('US'),
      }),
      responses: {
        200: z.object({
          originalQuery: z.string(),
          results: z.array(z.object({
            letter: z.string(),
            query: z.string(),
            suggestions: z.array(z.string())
          }))
        }),
        400: errorSchemas.validation,
      },
    },
  },
  saved: {
    list: {
      method: 'GET' as const,
      path: '/api/keywords/saved' as const,
      responses: {
        200: z.array(z.custom<typeof savedKeywords.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/keywords/saved' as const,
      input: insertSavedKeywordSchema,
      responses: {
        201: z.custom<typeof savedKeywords.$inferSelect>(),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/keywords/saved/:id' as const,
      responses: {
        204: z.void(),
      },
    },
  },
  history: {
    list: {
      method: 'GET' as const,
      path: '/api/history' as const,
      responses: {
        200: z.array(z.custom<typeof searchHistory.$inferSelect>()),
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
