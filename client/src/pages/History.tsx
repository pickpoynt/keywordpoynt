import { AppLayout } from "@/components/layout/AppLayout";
import { useSearchHistory } from "@/hooks/use-keywords";
import { History as HistoryIcon, Search, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";

export default function History() {
  const { data: history, isLoading } = useSearchHistory();

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <HistoryIcon className="w-8 h-8 text-primary" />
            Search History
          </h1>
          <p className="text-muted-foreground mt-2">
             A timeline of your recent research sessions.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
             {[1, 2, 3].map(i => (
               <div key={i} className="h-16 bg-muted/50 rounded-xl animate-pulse" />
             ))}
          </div>
        ) : !history?.length ? (
          <div className="text-center py-24 bg-muted/30 rounded-2xl border border-dashed">
             <div className="bg-background w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border shadow-sm">
               <HistoryIcon className="w-8 h-8 text-muted-foreground/50" />
             </div>
             <h3 className="text-lg font-semibold text-foreground">No history yet</h3>
             <p className="text-muted-foreground max-w-sm mx-auto mt-2">
               Your search queries will appear here automatically.
             </p>
          </div>
        ) : (
          <div className="relative border-l-2 border-muted pl-8 space-y-8 ml-4">
             {history.map((item, idx) => (
               <div key={item.id} className="relative group">
                 {/* Timeline dot */}
                 <div className="absolute -left-[41px] top-1 h-5 w-5 rounded-full border-4 border-background bg-muted group-hover:bg-primary transition-colors" />
                 
                 <div className="bg-card rounded-xl border p-5 shadow-sm hover:shadow-md transition-shadow">
                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                     <div>
                       <div className="text-sm text-muted-foreground mb-1">
                         {item.createdAt ? format(new Date(item.createdAt), 'MMM d, yyyy • h:mm a') : 'Unknown Date'}
                       </div>
                       <div className="font-mono text-lg font-medium text-foreground">
                         {item.query}
                       </div>
                     </div>
                     
                     {/* 
                         Ideally this would pre-fill the search box, but wouter doesn't support passing state easily 
                         without URL params. For now, it's just a visual list.
                         A robust app would make these clickable to re-run search.
                     */}
                     {/* <button className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                        Re-run Search <ArrowRight className="w-4 h-4" />
                     </button> */}
                   </div>
                 </div>
               </div>
             ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
