import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import SetPlanner from "@/pages/SetPlanner";
import OrchestraReference from "@/pages/OrchestraReference";
import { useEffect } from "react";
import { Music, Library, BookOpen } from "lucide-react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/planner/:id" component={SetPlanner} />
      <Route path="/orchestras" component={OrchestraReference} />
      <Route component={NotFound} />
    </Switch>
  );
}

function NavBar() {
  const [location] = useLocation();
  const isPlanner = location.startsWith("/planner");

  if (isPlanner) return null;

  return (
    <header className="border-b border-border/30 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-14">
        <Link href="/" className="flex items-center gap-2.5 group" data-testid="link-home">
          <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: "#c9a84c" }}>
            <Music className="w-4 h-4 text-white" />
          </div>
          <span className="font-serif text-lg font-bold tracking-tight">
            Tango<span style={{ color: "#c9a84c" }}>Flow</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link href="/">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                location === "/"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid="link-my-sets"
            >
              <Library className="w-4 h-4" />
              My Sets
            </span>
          </Link>
          <Link href="/orchestras">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                location === "/orchestras"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid="link-orchestras"
            >
              <BookOpen className="w-4 h-4" />
              Orchestras
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex flex-col h-screen">
          <NavBar />
          <main className="flex-1 overflow-hidden">
            <Router />
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
