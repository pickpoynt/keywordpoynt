import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { type InsertSavedKeyword } from "@shared/schema";

// Search Keywords
export function useSearchKeywords() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ query, country }: { query: string; country?: string }) => {
      const res = await fetch(api.keywords.search.path, {
        method: api.keywords.search.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, country }),
        credentials: "include",
      });

      if (!res.ok) {
        let errorMessage = "Failed to fetch suggestions";
        try {
          const error = await res.json();
          errorMessage = error.error || error.message || errorMessage;
        } catch {
          // Ignore JSON parse error, use default message
        }
        throw new Error(errorMessage);
      }

      // We need to parse this manually because the response schema 
      // is complex and we want to return the data directly
      return await res.json() as {
        originalQuery: string;
        results: Array<{
          letter: string;
          query: string;
          suggestions: string[];
        }>;
      };
    },
    onError: (error) => {
      toast({
        title: "Search failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}

// Saved Keywords Hooks
export function useSavedKeywords() {
  return useQuery({
    queryKey: [api.saved.list.path],
    queryFn: async () => {
      const res = await fetch(api.saved.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch saved keywords");
      return await res.json() as InsertSavedKeyword[];
    },
  });
}

export function useSaveKeyword() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertSavedKeyword) => {
      const res = await fetch(api.saved.create.path, {
        method: api.saved.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to save keyword");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.saved.list.path] });
      toast({
        title: "Keyword Saved",
        description: "Added to your saved collection",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not save keyword",
        variant: "destructive",
      });
    }
  });
}

export function useDeleteSavedKeyword() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.saved.delete.path, { id });
      const res = await fetch(url, {
        method: api.saved.delete.method,
        credentials: "include"
      });

      if (!res.ok) throw new Error("Failed to delete keyword");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.saved.list.path] });
      toast({
        title: "Deleted",
        description: "Keyword removed from collection",
      });
    },
  });
}

// Search History Hooks
export function useSearchHistory() {
  return useQuery({
    queryKey: [api.history.list.path],
    queryFn: async () => {
      const res = await fetch(api.history.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch history");
      return await res.json() as Array<{ id: number, query: string, createdAt: string }>;
    },
  });
}
