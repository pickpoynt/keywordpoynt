import { motion } from "framer-motion";
import { Plus, Check, Search, Copy } from "lucide-react";
import { useSaveKeyword, useSavedKeywords } from "@/hooks/use-keywords";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface SuggestionGroup {
  letter: string;
  query: string;
  suggestions: string[];
}

interface KeywordGridProps {
  originalQuery: string;
  results: SuggestionGroup[];
}

export function KeywordGrid({ originalQuery, results }: KeywordGridProps) {
  const { mutate: save, isPending } = useSaveKeyword();
  const { data: savedKeywords } = useSavedKeywords();
  const { toast } = useToast();

  // Helper to check if already saved
  const isSaved = (keyword: string) => {
    return savedKeywords?.some(k => k.keyword === keyword);
  };

  const handleSave = (keyword: string, sourceQuery: string) => {
    if (isSaved(keyword)) return;
    save({ keyword, sourceQuery });
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `"${text}" copied to clipboard`,
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  // Helper to highlight the dynamic part
  const HighlightedKeyword = ({ text, letter }: { text: string, letter: string }) => {
    // This is a simple heuristic: if the suggestion contains the letter pattern, highlight it
    // A more robust way would be returned from backend, but for now we visualy differentiate
    return (
      <span className="font-mono text-sm group-hover:text-primary transition-colors break-words">
        {text}
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
      {results.map((group, index) => (
        <motion.div
          key={group.letter}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="flex flex-col h-full"
        >
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow duration-300">
            {/* Header */}
            <div className="bg-muted/30 px-4 py-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold font-mono text-lg border border-primary/20">
                  {group.letter}
                </div>
                <div className="text-xs text-muted-foreground font-medium truncate max-w-[150px]">
                  {group.query}
                </div>
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-background border text-muted-foreground">
                {group.suggestions.length}
              </span>
            </div>

            {/* List */}
            <div className="p-2 flex-1 min-h-[200px]">
              {group.suggestions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground/50 text-sm py-8">
                  <Search className="w-8 h-8 mb-2 opacity-20" />
                  No suggestions found
                </div>
              ) : (
                <ul className="space-y-1">
                  {group.suggestions.map((suggestion) => {
                    const saved = isSaved(suggestion);
                    return (
                      <li
                        key={suggestion}
                        className="group flex items-start gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <HighlightedKeyword text={suggestion} letter={group.letter} />
                        </div>

                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => handleCopy(suggestion)}
                            className="p-1.5 rounded-md transition-all duration-200 bg-blue-100 text-blue-700 hover:bg-blue-200 hover:shadow-md"
                            aria-label="Copy keyword"
                            title="Copy to clipboard"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleSave(suggestion, group.query)}
                            disabled={saved || isPending}
                            className={cn(
                              "p-1.5 rounded-md transition-all duration-200",
                              saved
                                ? "bg-green-100 text-green-700 cursor-default"
                                : "bg-primary text-primary-foreground shadow-sm hover:shadow-md hover:bg-primary/90"
                            )}
                            aria-label={saved ? "Saved" : "Save keyword"}
                            title={saved ? "Already saved" : "Save keyword"}
                          >
                            {saved ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
