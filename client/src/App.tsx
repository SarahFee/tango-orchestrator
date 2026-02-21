import { Switch, Route, Link, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import SetPlanner from "@/pages/SetPlanner";
import OrchestraReference from "@/pages/OrchestraReference";
import { useEffect } from "react";
import { Music, Library, BookOpen } from "lucide-react";
import { storage } from "@/lib/storage";
import { fetchOrchestras } from "@/lib/orchestraService";
import { LanguageProvider, useLanguage } from "@/hooks/useLanguage";
import type { Language } from "@/lib/translations";

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

const LANGUAGES: Language[] = ["en", "fr", "es"];

function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center rounded-md border border-border/30 overflow-hidden" data-testid="language-toggle">
      {LANGUAGES.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-2 py-1 text-[11px] font-semibold uppercase transition-colors ${
            lang === l
              ? "bg-primary/20 text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          data-testid={`button-lang-${l}`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

function NavBar() {
  const [location] = useLocation();
  const { t } = useLanguage();
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

        <div className="flex items-center gap-3">
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
                {t("my_sets_nav")}
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
                {t("orchestras_nav")}
              </span>
            </Link>
          </nav>
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
    storage.seedIfEmpty();
    fetchOrchestras();
  }, []);

  return (
    <LanguageProvider>
      <TooltipProvider>
        <div className="flex flex-col h-screen">
          <NavBar />
          <main className="flex-1 overflow-hidden">
            <Router />
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </LanguageProvider>
  );
}

export default App;
