import { useState, useMemo, useCallback } from "react";
import { useParams, useLocation } from "wouter";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { MilongaSet, Tanda, TandaType } from "@shared/schema";
import { getStyleLabel } from "@/lib/orchestraData";
import { getOrchestra } from "@/lib/orchestraService";
import { generateWarnings } from "@/lib/warnings";
import { storage } from "@/lib/storage";
import { EnergyCurve } from "@/components/EnergyCurve";
import { TandaCard } from "@/components/TandaCard";
import { TimelineSlot } from "@/components/TimelineSlot";
import { WarningsBar } from "@/components/WarningsBar";
import { SetStats } from "@/components/SetStats";
import { CreateTandaDialog } from "@/components/CreateTandaDialog";
import { TypeBadge } from "@/components/TypeBadge";
import { EnergyBar } from "@/components/EnergyBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import {
  ArrowLeft,
  Plus,
  Minus,
  Search,
  FileText,
  FileJson,
  Download,
  Upload,
} from "lucide-react";

const DEFAULT_SLOTS = 14;

export default function SetPlanner() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();
  const setId = params.id;

  const [set, setSet] = useState<MilongaSet | undefined>(() => storage.getSet(setId));
  const [allTandas, setAllTandas] = useState<Tanda[]>(() => storage.getTandasForSet(setId));
  const [slotCount, setSlotCount] = useState(DEFAULT_SLOTS);
  const [showPattern, setShowPattern] = useState(true);
  const [librarySearch, setLibrarySearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const refreshTandas = useCallback(() => {
    setAllTandas(storage.getTandasForSet(setId));
  }, [setId]);

  const refreshSet = useCallback(() => {
    setSet(storage.getSet(setId));
  }, [setId]);

  const libraryTandas = useMemo(
    () => allTandas.filter((t) => t.position === null || t.position === undefined),
    [allTandas]
  );

  const timelineTandas = useMemo(() => {
    const slots: (Tanda | null)[] = Array(slotCount).fill(null);
    allTandas
      .filter((t) => t.position !== null && t.position !== undefined)
      .forEach((t) => {
        if (t.position! < slotCount) {
          slots[t.position!] = t;
        }
      });
    return slots;
  }, [allTandas, slotCount]);

  const filteredLibrary = useMemo(() => {
    return libraryTandas.filter((t) => {
      const orchestra = getOrchestra(t.orchestraId);
      const matchSearch =
        !librarySearch ||
        orchestra?.name.toLowerCase().includes(librarySearch.toLowerCase()) ||
        t.singer?.toLowerCase().includes(librarySearch.toLowerCase());
      const matchType = typeFilter === "all" || t.type === typeFilter;
      return matchSearch && matchType;
    });
  }, [libraryTandas, librarySearch, typeFilter]);

  const warnings = useMemo(() => generateWarnings(timelineTandas), [timelineTandas]);
  const warningSlots = useMemo(
    () => warnings.flatMap((w) => w.slots || []),
    [warnings]
  );

  const cumulativeMinutes = useMemo(() => {
    const mins: number[] = [];
    let total = 0;
    for (let i = 0; i < slotCount; i++) {
      mins.push(total);
      const t = timelineTandas[i];
      if (t) {
        total += t.trackCount * 3 + 1;
      } else {
        total += 13;
      }
    }
    return mins;
  }, [timelineTandas, slotCount]);

  const handleUpdateSet = useCallback(
    (updates: Partial<MilongaSet>) => {
      storage.updateSet(setId, updates);
      refreshSet();
    },
    [setId, refreshSet]
  );

  const handleCreateTanda = useCallback(
    (data: any) => {
      storage.createTanda({ ...data, setId, position: null });
      refreshTandas();
    },
    [setId, refreshTandas]
  );

  const handleRemoveFromTimeline = useCallback(
    (index: number) => {
      const tanda = timelineTandas[index];
      if (tanda) {
        storage.updateTanda(tanda.id, { position: null });
        refreshTandas();
      }
    },
    [timelineTandas, refreshTandas]
  );

  const handleDeleteTanda = useCallback(
    (tandaId: string) => {
      storage.deleteTanda(tandaId);
      refreshTandas();
    },
    [refreshTandas]
  );

  const handleDragStart = (event: any) => {
    setActiveDragId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    setActiveDragId(null);
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeData?.type === "library-tanda" && overData?.type === "slot") {
      const slotIndex = overData.index;
      if (!timelineTandas[slotIndex]) {
        storage.updateTanda(activeData.tanda.id, { position: slotIndex });
        refreshTandas();
      }
    }

    if (activeData?.type === "timeline-tanda" && overData?.type === "slot") {
      const fromIndex = activeData.index;
      const toIndex = overData.index;
      if (fromIndex !== toIndex) {
        const fromTanda = timelineTandas[fromIndex];
        const toTanda = timelineTandas[toIndex];
        if (fromTanda) {
          if (toTanda) {
            storage.updateTanda(fromTanda.id, { position: toIndex });
            storage.updateTanda(toTanda.id, { position: fromIndex });
          } else {
            storage.updateTanda(fromTanda.id, { position: toIndex });
          }
          refreshTandas();
        }
      }
    }
  };

  const handleExportText = () => {
    if (!set) return;
    let text = `${set.name}\n`;
    if (set.venue) text += `${t("export_venue")}: ${set.venue}\n`;
    text += `${t("export_date")}: ${set.date} | ${t("export_start")}: ${set.startTime}\n\n`;

    timelineTandas.forEach((td, i) => {
      if (i > 0) text += "--- CORTINA ---\n";
      if (td) {
        const isMixed = td.tandaMode === "mixed";
        let orchName: string;
        if (isMixed && td.orchestraIds && td.orchestraIds.length > 0) {
          orchName = td.orchestraIds.map((id) => getOrchestra(id)?.name || id).join(" / ");
        } else {
          orchName = getOrchestra(td.orchestraId)?.name || td.orchestraId;
        }
        text += `${i + 1}. [${td.type.toUpperCase()}${isMixed ? " MIX" : ""}] ${orchName}`;
        if (td.singer) text += ` (${td.singer})`;
        text += ` | ${t("energy")}: ${td.energy.toFixed(1)} | ${td.trackCount} ${t("tracks").toLowerCase()}\n`;
      } else {
        text += `${i + 1}. [${t("export_empty_slot")}]\n`;
      }
    });

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${set.name.replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    if (!set) return;
    const data = storage.exportSet(setId);
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${set.name.replace(/\s+/g, "_")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSet = () => {
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
            const imported = storage.importSet(data);
            toast({ title: t("set_imported"), description: `"${imported.name}" ${t("set_imported_desc")}` });
            navigate(`/planner/${imported.id}`);
          } else {
            throw new Error("Invalid format");
          }
        } catch {
          toast({ title: t("import_failed"), description: t("invalid_set_file"), variant: "destructive" });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const activeTanda = useMemo(() => {
    if (!activeDragId) return null;
    const id = activeDragId.toString().replace("library-", "").replace("timeline-", "");
    return allTandas.find((t) => t.id === id) || null;
  }, [activeDragId, allTandas]);

  if (!set) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">{t("set_not_found")}</p>
          <Button variant="secondary" onClick={() => navigate("/")}>
            {t("go_home")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full" data-testid="set-planner">
        <div className="w-64 flex-shrink-0 border-r border-border/30 flex flex-col bg-card/30">
          <div className="p-3 border-b border-border/30">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-serif text-sm font-semibold">{t("tanda_library")}</h2>
              <CreateTandaDialog onCreateTanda={handleCreateTanda} />
            </div>
            <div className="relative mb-2">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder={t("search")}
                value={librarySearch}
                onChange={(e) => setLibrarySearch(e.target.value)}
                className="pl-8 h-8 text-xs"
                data-testid="input-library-search"
              />
            </div>
            <div className="flex gap-1.5 mb-2">
              {(["all", "tango", "vals", "milonga"] as const).map((tp) => (
                <button
                  key={tp}
                  onClick={() => setTypeFilter(tp)}
                  className={`text-[10px] px-1.5 py-0.5 rounded capitalize font-medium transition-all ${
                    typeFilter === tp
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid={`button-filter-type-${tp}`}
                >
                  {tp === "all" ? t("all") : tp}
                </button>
              ))}
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1.5">
              {filteredLibrary.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xs text-muted-foreground/60 italic">
                    {libraryTandas.length === 0
                      ? t("create_first_tanda")
                      : t("no_tandas_match")}
                  </p>
                </div>
              ) : (
                filteredLibrary.map((t) => (
                  <DraggableLibraryTanda key={t.id} tanda={t} onDelete={() => handleDeleteTanda(t.id)} />
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex items-center gap-3 p-3 border-b border-border/30">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")} data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="font-serif text-lg font-semibold truncate flex-1">{set.name}</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <Switch
                  checked={showPattern}
                  onCheckedChange={setShowPattern}
                  id="pattern-toggle"
                  data-testid="switch-pattern"
                />
                <Label htmlFor="pattern-toggle" className="text-xs cursor-pointer">
                  TTVTTM
                </Label>
              </div>
              <div className="flex items-center border border-border/30 rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setSlotCount((c) => Math.max(4, c - 1))}
                  data-testid="button-remove-slot"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="text-xs tabular-nums px-1.5 min-w-[2rem] text-center">{slotCount}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setSlotCount((c) => Math.min(30, c + 1))}
                  data-testid="button-add-slot"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
              <Button variant="ghost" size="icon" onClick={handleImportSet} title={t("import_set")} data-testid="button-import-set">
                <Upload className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleExportText} title={t("export_text")} data-testid="button-export-text">
                <FileText className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleExportJSON} title={t("export_json")} data-testid="button-export-json">
                <FileJson className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="h-32 border-b border-border/30 px-4 py-2 flex-shrink-0">
            <EnergyCurve tandas={timelineTandas} className="h-full" />
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-0">
              <SortableContext
                items={timelineTandas.map((t, i) =>
                  t ? `timeline-${t.id}` : `empty-${i}`
                )}
                strategy={verticalListSortingStrategy}
              >
                {timelineTandas.map((tanda, i) => (
                  <TimelineSlot
                    key={i}
                    index={i}
                    tanda={tanda}
                    showPattern={showPattern}
                    startTime={set.startTime}
                    cumulativeMinutes={cumulativeMinutes[i]}
                    onRemove={tanda ? () => handleRemoveFromTimeline(i) : undefined}
                    highlightSlots={warningSlots}
                  />
                ))}
              </SortableContext>
            </div>
          </ScrollArea>

          {warnings.length > 0 && (
            <div className="border-t border-border/30 p-3 flex-shrink-0">
              <WarningsBar warnings={warnings} />
            </div>
          )}
        </div>

        <div className="w-64 flex-shrink-0 border-l border-border/30 bg-card/30">
          <ScrollArea className="h-full">
            <SetStats
              set={set}
              tandas={timelineTandas}
              onUpdateSet={handleUpdateSet}
            />
          </ScrollArea>
        </div>
      </div>

      <DragOverlay>
        {activeTanda && <TandaCard tanda={activeTanda} isDragging compact />}
      </DragOverlay>
    </DndContext>
  );
}

function DraggableLibraryTanda({ tanda, onDelete }: { tanda: Tanda; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `library-${tanda.id}`,
    data: { type: "library-tanda", tanda },
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <TandaCard
        tanda={tanda}
        isDragging={isDragging}
        showGrip
        showRemove
        onRemove={onDelete}
        compact
      />
    </div>
  );
}
