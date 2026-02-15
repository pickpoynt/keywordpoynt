import { Link, useLocation } from "wouter";
import { Search, Bookmark, History, Menu, X, Command } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Keyword Search", icon: Search },
    { href: "/saved", label: "Saved Keywords", icon: Bookmark },
    { href: "/history", label: "Search History", icon: History },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-card z-20 sticky top-0">
        <div className="flex items-center gap-2 font-display font-bold text-xl text-primary">
          <Command className="w-6 h-6" />
          <span>Keyword<span className="text-foreground">Pro</span></span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-muted rounded-md"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:sticky md:top-0 h-[calc(100vh-65px)] md:h-screen w-64 bg-card border-r z-40 transition-transform duration-300 ease-in-out md:translate-x-0",
        isSidebarOpen ? "translate-x-0 top-[65px]" : "-translate-x-full"
      )}>
        <div className="p-6 hidden md:flex items-center gap-2 font-display font-bold text-2xl text-primary mb-6">
          <Command className="w-8 h-8" />
          <span>Keyword<span className="text-foreground">Pro</span></span>
        </div>

        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setIsSidebarOpen(false)}>
                <div className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 cursor-pointer",
                  isActive 
                    ? "bg-primary/10 text-primary shadow-sm" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}>
                  <item.icon className={cn("w-5 h-5", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-0 w-full px-6">
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 border border-primary/10">
            <h4 className="font-semibold text-sm mb-1 text-primary-foreground bg-primary px-2 py-0.5 rounded-md inline-block w-fit">Pro Tip</h4>
            <p className="text-xs text-muted-foreground mt-2">
              Use <code className="bg-background px-1 py-0.5 rounded border text-primary font-bold">*</code> as a wildcard in your queries to find hidden opportunities.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
