import { useState, useCallback, useEffect } from "react";
import { useLocation } from "wouter";
import type { MilongaSet, Tanda } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Calendar, MapPin, Music, ChevronRight, Clock, Upload, Download } from "lucide-react";
import { storage } from "@/lib/storage";
import { EnergyBar } from "@/components/EnergyBar";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

export default function Home() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();
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
      name: t("new_milonga_set"),
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
    toast({ title: t("backup_exported"), description: t("backup_exported_desc") });
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
            toast({ title: t("set_imported"), description: `"${data.set.name}" ${t("set_imported_desc")}` });
          } else if (data.sets && data.tandas) {
            storage.importAllData(data);
            toast({ title: t("backup_restored"), description: `${data.sets.length} ${t("backup_restored_desc")}` });
          } else {
            throw new Error("Unrecognized format");
          }
          refresh();
        } catch {
          toast({ title: t("import_failed"), description: t("import_failed_desc"), variant: "destructive" });
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
            {t("my_sets")}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {t("my_sets_subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleImportAll} title={t("import_backup")} data-testid="button-import">
            <Upload className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleExportAll} title={t("export_backup")} data-testid="button-export-all">
            <Download className="w-4 h-4" />
          </Button>
          <Button onClick={handleNewSet} data-testid="button-new-set">
            <Plus className="w-4 h-4 mr-1.5" />
            {t("new_set")}
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
          <h2 className="font-serif text-xl font-semibold mb-2">{t("no_sets_yet")}</h2>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto text-sm">
            {t("no_sets_description")}
          </p>
          <Button onClick={handleNewSet} data-testid="button-create-first-set">
            <Plus className="w-4 h-4 mr-1.5" />
            {t("create_first_set")}
          </Button>
        </div>
      )}
    </div>
  );
}

function EnergySparkline({ tandas }: { tandas: Tanda[] }) {
  const sorted = tandas
    .filter((t) => t.position !== null)
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

  if (sorted.length < 2) return null;

  const w = 120;
  const h = 28;
  const pad = 2;
  const chartW = w - pad * 2;
  const chartH = h - pad * 2;
  const maxIdx = sorted.length - 1;

  const points = sorted.map((t, i) => ({
    x: pad + (i / maxIdx) * chartW,
    y: pad + chartH - ((t.energy - 1) / 9) * chartH,
  }));

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx1 = prev.x + (curr.x - prev.x) * 0.4;
    const cpx2 = prev.x + (curr.x - prev.x) * 0.6;
    d += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`;
  }

  const fillD = d + ` L ${points[points.length - 1].x} ${h - pad} L ${points[0].x} ${h - pad} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-7" preserveAspectRatio="xMidYMid meet" data-testid="sparkline">
      <defs>
        <linearGradient id={`spark-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#c9a84c" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path d={fillD} fill="url(#spark-fill)" />
      <path d={d} fill="none" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SetCard({ set, onClick, onDelete }: { set: MilongaSet; onClick: () => void; onDelete: (e: React.MouseEvent) => void }) {
  const { t } = useLanguage();
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
          <span>{t("starts")} {set.startTime}</span>
        </div>
      </div>

      {filledTandas.length >= 2 && (
        <div className="mb-3">
          <EnergySparkline tandas={tandas} />
        </div>
      )}

      <div className="flex items-center gap-4 text-xs border-t border-border/30 pt-3">
        <div>
          <span className="text-muted-foreground">{t("tandas")}: </span>
          <span className="font-medium tabular-nums">{filledTandas.length}</span>
        </div>
        {filledTandas.length > 0 && (
          <>
            <div>
              <span className="text-muted-foreground">{t("orchestras")}: </span>
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
