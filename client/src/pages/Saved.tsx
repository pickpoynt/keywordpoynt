import { AppLayout } from "@/components/layout/AppLayout";
import { useSavedKeywords, useDeleteSavedKeyword } from "@/hooks/use-keywords";
import { Trash2, Copy, BookmarkCheck, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function Saved() {
  const { data: keywords, isLoading } = useSavedKeywords();
  const { mutate: deleteKeyword } = useDeleteSavedKeyword();
  const { toast } = useToast();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Keyword copied to clipboard",
    });
  };

  const handleCopyAll = () => {
    if (!keywords?.length) return;
    const allText = keywords.map(k => k.keyword).join("\n");
    navigator.clipboard.writeText(allText);
    toast({
      title: "Copied All",
      description: `${keywords.length} keywords copied to clipboard`,
    });
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
              <BookmarkCheck className="w-8 h-8 text-primary" />
              Saved Keywords
            </h1>
            <p className="text-muted-foreground mt-2">
              Your collection of opportunities found from searches.
            </p>
          </div>
          
          {keywords && keywords.length > 0 && (
            <button
              onClick={handleCopyAll}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-card border hover:bg-muted transition-colors text-sm font-medium shadow-sm"
            >
              <Copy className="w-4 h-4" />
              Copy All CSV
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4">
             {[1, 2, 3].map(i => (
               <div key={i} className="h-20 bg-muted/50 rounded-xl animate-pulse" />
             ))}
          </div>
        ) : !keywords?.length ? (
          <div className="text-center py-24 bg-muted/30 rounded-2xl border border-dashed">
             <div className="bg-background w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border shadow-sm">
               <BookmarkCheck className="w-8 h-8 text-muted-foreground/50" />
             </div>
             <h3 className="text-lg font-semibold text-foreground">No saved keywords yet</h3>
             <p className="text-muted-foreground max-w-sm mx-auto mt-2">
               Start a search and click the + icon next to any suggestion to save it here.
             </p>
          </div>
        ) : (
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/30 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <div className="col-span-6 md:col-span-5">Keyword</div>
              <div className="col-span-4 md:col-span-4 hidden md:block">Source Query</div>
              <div className="col-span-4 md:col-span-2 hidden md:block text-right">Saved At</div>
              <div className="col-span-6 md:col-span-1 text-right">Actions</div>
            </div>
            
            <ul className="divide-y divide-border">
              <AnimatePresence>
                {keywords.map((item) => (
                  <motion.li
                    key={item.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="group grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/30 transition-colors"
                  >
                    <div className="col-span-6 md:col-span-5 font-mono text-sm font-medium truncate" title={item.keyword}>
                      {item.keyword}
                    </div>
                    
                    <div className="col-span-4 md:col-span-4 hidden md:block text-sm text-muted-foreground truncate" title={item.sourceQuery || ""}>
                      {item.sourceQuery || <span className="text-muted-foreground/30 italic">Unknown</span>}
                    </div>
                    
                    <div className="col-span-4 md:col-span-2 hidden md:block text-right text-xs text-muted-foreground">
                      {item.createdAt ? format(new Date(item.createdAt), 'MMM d, yyyy') : '-'}
                    </div>
                    
                    <div className="col-span-6 md:col-span-1 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleCopy(item.keyword)}
                        className="p-2 rounded-md hover:bg-background hover:text-primary transition-colors border border-transparent hover:border-border"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => item.id && deleteKeyword(item.id)}
                        className="p-2 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors border border-transparent hover:border-red-100"
                        title="Delete keyword"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
