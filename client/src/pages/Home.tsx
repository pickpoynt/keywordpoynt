import { AppLayout } from "@/components/layout/AppLayout";
import { useSearchKeywords } from "@/hooks/use-keywords";
import { useState } from "react";
import { Search, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { KeywordGrid } from "@/components/KeywordGrid";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Home() {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("US");
  const { mutate: search, data, isPending, error } = useSearchKeywords();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.includes("*")) return; // Should show validation error
    search({ query, country });
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    search({ query: example, country });
  };

  const hasWildcard = query.includes("*");

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
              Discover Untapped <span className="text-primary relative inline-block">
                Keywords
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Use the wildcard <code className="bg-muted px-2 py-0.5 rounded text-primary font-bold">*</code> to find Google Autocomplete suggestions for every letter of the alphabet.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>
            <form onSubmit={handleSearch} className="relative flex items-center bg-card rounded-xl shadow-xl border p-2">
              <div className="pl-4 pr-2 text-muted-foreground">
                <Search className="w-6 h-6" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. best * for gaming"
                className="flex-1 bg-transparent border-none text-lg md:text-xl py-3 px-2 focus:ring-0 focus:outline-none placeholder:text-muted-foreground/50 font-medium"
              />
              <button
                type="submit"
                disabled={!hasWildcard || isPending}
                className={cn(
                  "px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-200",
                  hasWildcard
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:translate-y-[-1px] hover:shadow-primary/30 active:translate-y-0"
                    : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                )}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Digging...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Explore</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Country Selector */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 flex items-center justify-center gap-2"
          >
            <label htmlFor="country" className="text-sm text-muted-foreground font-medium">
              Country:
            </label>
            <select
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-card border border-border text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none transition-all"
            >
              <option value="US">🇺🇸 United States</option>
              <option value="GB">🇬🇧 United Kingdom</option>
              <option value="CA">🇨🇦 Canada</option>
              <option value="AU">🇦🇺 Australia</option>
              <option value="DE">🇩🇪 Germany</option>
              <option value="FR">🇫🇷 France</option>
              <option value="ES">🇪🇸 Spain</option>
              <option value="IT">🇮🇹 Italy</option>
              <option value="IN">🇮🇳 India</option>
              <option value="BR">🇧🇷 Brazil</option>
              <option value="MX">🇲🇽 Mexico</option>
              <option value="JP">🇯🇵 Japan</option>
              <option value="KR">🇰🇷 South Korea</option>
              <option value="NL">🇳🇱 Netherlands</option>
              <option value="SE">🇸🇪 Sweden</option>
              <option value="NO">🇳🇴 Norway</option>
              <option value="DK">🇩🇰 Denmark</option>
              <option value="FI">🇫🇮 Finland</option>
              <option value="PL">🇵🇱 Poland</option>
              <option value="PT">🇵🇹 Portugal</option>
            </select>
          </motion.div>

          {/* Validation Message / Examples */}
          <div className="mt-4 h-6">
            {!hasWildcard && query.length > 0 ? (
              <p className="text-sm text-amber-500 font-medium animate-pulse flex items-center justify-center gap-2">
                ⚠️ Don't forget to include the asterisk (*)
              </p>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
                <span>Try:</span>
                {["plumber * new york", "best * app 2024", "how to * a cake"].map((ex) => (
                  <button
                    key={ex}
                    onClick={() => handleExampleClick(ex)}
                    className="px-2 py-0.5 rounded-md bg-muted/50 hover:bg-muted hover:text-primary transition-colors border border-transparent hover:border-border"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Results Area */}
        <AnimatePresence mode="wait">
          {isPending && !data && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 text-center"
            >
              <div className="inline-block relative">
                <div className="w-24 h-24 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl animate-pulse">Running</span>
                </div>
              </div>
              <p className="mt-6 text-muted-foreground">Scraping suggestions for 26+ variations...</p>
            </motion.div>
          )}

          {data && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold">Results for "<span className="text-primary">{data.originalQuery}</span>"</h2>
                  <p className="text-muted-foreground">
                    Found {data.results.reduce((acc, curr) => acc + curr.suggestions.length, 0)} keywords across {data.results.length} variations
                  </p>
                </div>

                <div className="hidden md:flex gap-2">
                  {/* Could add export button here */}
                </div>
              </div>

              <KeywordGrid originalQuery={data.originalQuery} results={data.results} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
