import { useState, useCallback, useEffect } from "react";
import { useLocation } from "wouter";
import type { MilongaSet, Tanda } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Calendar, MapPin, Music, ChevronRight, Clock, Upload, Download } from "lucide-react";
import { storage } from "@/lib/storage";
import { EnergyBar } from "@/components/EnergyBar";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [sets, setSets] = useState<MilongaSet[]>(() => storage.getAllSets());
  const [, setTick] = useState(0);

  const refresh = useCallback(() => {
    setSets(storage.getAllSets());
    setTick((t) => t + 1);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleNewSet = () => {
    const today = new Date().toISOString().split("T")[0];
    const newSet = storage.createSet({
      name: "New Milonga Set",
      date: today,
      startTime: "21:00",
      venue: null,
    });
    refresh();
    navigate(`/planner/${newSet.id}`);
  };

  const handleDeleteSet = (e: React.MouseEvent, setId: string) => {
    e.stopPropagation();
    storage.deleteSet(setId);
    refresh();
  };

  const handleExportAll = () => {
    const data = storage.exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tangoflow_backup_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Backup exported", description: "Your complete library has been saved." });
  };

  const handleImportAll = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          if (data.set && data.tandas) {
            storage.importSet(data);
            toast({ title: "Set imported", description: `"${data.set.name}" has been added to your library.` });
          } else if (data.sets && data.tandas) {
            storage.importAllData(data);
            toast({ title: "Backup restored", description: `${data.sets.length} sets have been restored.` });
          } else {
            throw new Error("Unrecognized format");
          }
          refresh();
        } catch {
          toast({ title: "Import failed", description: "The file doesn't appear to be a valid TangoFlow backup.", variant: "destructive" });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="min-h-full p-6 md:p-8 max-w-5xl mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight" data-testid="text-page-title">
            My Sets
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Plan your milonga evenings with precision and soul
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleImportAll} title="Import backup" data-testid="button-import">
            <Upload className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleExportAll} title="Export backup" data-testid="button-export-all">
            <Download className="w-4 h-4" />
          </Button>
          <Button onClick={handleNewSet} data-testid="button-new-set">
            <Plus className="w-4 h-4 mr-1.5" />
            New Set
          </Button>
        </div>
      </div>

      {sets.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sets.map((set) => (
            <SetCard
              key={set.id}
              set={set}
              onClick={() => navigate(`/planner/${set.id}`)}
              onDelete={(e) => handleDeleteSet(e, set.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Music className="w-7 h-7 text-primary" />
          </div>
          <h2 className="font-serif text-xl font-semibold mb-2">No sets yet</h2>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto text-sm">
            Create your first milonga set to start planning the perfect tango evening.
          </p>
          <Button onClick={handleNewSet} data-testid="button-create-first-set">
            <Plus className="w-4 h-4 mr-1.5" />
            Create Your First Set
          </Button>
        </div>
      )}
    </div>
  );
}

function SetCard({ set, onClick, onDelete }: { set: MilongaSet; onClick: () => void; onDelete: (e: React.MouseEvent) => void }) {
  const tandas = storage.getTandasForSet(set.id);
  const filledTandas = tandas.filter((t) => t.position !== null);
  const avgEnergy =
    filledTandas.length > 0
      ? filledTandas.reduce((sum, t) => sum + t.energy, 0) / filledTandas.length
      : 0;
  const uniqueOrchestras = new Set(filledTandas.map((t) => t.orchestraId)).size;

  return (
    <Card
      className="group cursor-pointer p-4 transition-all hover-elevate"
      onClick={onClick}
      data-testid={`card-set-${set.id}`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-serif font-semibold text-base truncate pr-2">{set.name}</h3>
        <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
      </div>

      <div className="space-y-1.5 text-xs text-muted-foreground mb-3">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3 h-3" />
          <span>{set.date}</span>
        </div>
        {set.venue && (
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3" />
            <span>{set.venue}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          <span>Starts {set.startTime}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs border-t border-border/30 pt-3">
        <div>
          <span className="text-muted-foreground">Tandas: </span>
          <span className="font-medium tabular-nums">{filledTandas.length}</span>
        </div>
        {filledTandas.length > 0 && (
          <>
            <div>
              <span className="text-muted-foreground">Orchestras: </span>
              <span className="font-medium tabular-nums">{uniqueOrchestras}</span>
            </div>
            <div className="flex-1">
              <EnergyBar energy={avgEnergy} size="sm" />
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
