import { useState, useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { getStyleLabel, sameEraBracket, sameStyleCategory } from "@/lib/orchestraData";
import { getOrchestras, calculateEnergy, getOrchestraProfile, calculateEnergyFromProfile } from "@/lib/orchestraService";
import { Plus, X, AlertTriangle } from "lucide-react";
import { TypeBadge } from "./TypeBadge";
import { EnergyBar } from "./EnergyBar";
import type { TandaType, TandaMode, OrchestraProfile } from "@shared/schema";
import { useLanguage } from "@/hooks/useLanguage";

interface CreateTandaDialogProps {
  onCreateTanda: (tanda: {
    orchestraId: string;
    orchestraIds?: string[];
    tandaMode?: TandaMode;
    singer: string | null;
    type: TandaType;
    trackCount: number;
    energy: number;
    style: string;
    era: string;
  }) => void;
  trigger?: React.ReactNode;
}

interface MixedOrchestraEntry {
  orchestraId: string;
  style: string;
  energy: number;
  era: string;
}

function getMixedValidationErrors(entries: MixedOrchestraEntry[], t: (key: string) => string): string[] {
  const errors: string[] = [];
  if (entries.length < 2) {
    errors.push(t("mixed_validation_min"));
    return errors;
  }
  const baseStyle = entries[0].style;
  if (!entries.every((e) => sameStyleCategory(e.style, baseStyle))) {
    errors.push(t("mixed_validation_style"));
  }
  const energies = entries.map((e) => e.energy);
  const minE = Math.min(...energies);
  const maxE = Math.max(...energies);
  if (maxE - minE > 1) {
    errors.push(t("mixed_validation_energy"));
  }
  const baseEra = entries[0].era;
  if (!entries.every((e) => sameEraBracket(e.era, baseEra))) {
    errors.push(t("mixed_validation_era"));
  }
  return errors;
}

const TYPE_MAP: Record<string, TandaType> = { T: "tango", V: "vals", M: "milonga" };

export function CreateTandaDialog({ onCreateTanda, trigger }: CreateTandaDialogProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [tandaMode, setTandaMode] = useState<TandaMode>("standard");
  const [orchestraId, setOrchestraId] = useState("");
  const [selectedSinger, setSelectedSinger] = useState("");
  const [type, setType] = useState<TandaType>("tango");
  const [trackCount, setTrackCount] = useState(4);
  const [energyOverride, setEnergyOverride] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [mixedEntries, setMixedEntries] = useState<MixedOrchestraEntry[]>([]);

  const orchestras = getOrchestras();
  const selectedOrchestra = useMemo(() => orchestras.find((o) => o.id === orchestraId), [orchestras, orchestraId]);

  const selectedProfile = useMemo(() => {
    if (!selectedOrchestra) return undefined;
    if (selectedSinger) {
      return selectedOrchestra.profiles.find((p) => p.singer === selectedSinger);
    }
    return selectedOrchestra.profiles[0];
  }, [selectedOrchestra, selectedSinger]);

  const availableTypes = useMemo((): TandaType[] => {
    if (!selectedProfile) return ["tango", "vals", "milonga"];
    return selectedProfile.types
      .map((t) => TYPE_MAP[t])
      .filter(Boolean);
  }, [selectedProfile]);

  useEffect(() => {
    if (selectedProfile && !availableTypes.includes(type)) {
      setType(availableTypes[0] || "tango");
      setEnergyOverride(null);
    }
  }, [selectedProfile, availableTypes, type]);

  useEffect(() => {
    if (selectedOrchestra && selectedOrchestra.profiles.length === 1) {
      setSelectedSinger(selectedOrchestra.profiles[0].singer);
    }
  }, [selectedOrchestra]);

  const calculatedEnergy = useMemo(() => {
    if (!selectedProfile) return 5;
    return calculateEnergyFromProfile(selectedProfile.energy, type);
  }, [selectedProfile, type]);

  const finalEnergy = energyOverride !== null ? energyOverride : calculatedEnergy;

  const mixedAvgEnergy = useMemo(() => {
    if (mixedEntries.length === 0) return 5;
    return mixedEntries.reduce((sum, e) => sum + e.energy, 0) / mixedEntries.length;
  }, [mixedEntries]);
  const mixedFinalEnergy = energyOverride !== null ? energyOverride : mixedAvgEnergy;

  const mixedErrors = useMemo(() => getMixedValidationErrors(mixedEntries, t), [mixedEntries, t]);

  const filteredOrchestras = useMemo(() => {
    const base = search
      ? orchestras.filter(
          (o) => o.name.toLowerCase().includes(search.toLowerCase()) || o.nickname?.toLowerCase().includes(search.toLowerCase())
        )
      : orchestras;
    if (tandaMode === "mixed") {
      const selectedIds = new Set(mixedEntries.map((e) => e.orchestraId));
      return base.filter((o) => !selectedIds.has(o.id));
    }
    return base;
  }, [orchestras, search, tandaMode, mixedEntries]);

  const resetForm = () => {
    setOrchestraId("");
    setSelectedSinger("");
    setType("tango");
    setTrackCount(4);
    setEnergyOverride(null);
    setSearch("");
    setMixedEntries([]);
    setTandaMode("standard");
  };

  const handleAddMixedOrchestra = (oId: string) => {
    const profile = getOrchestraProfile(oId);
    if (!profile) return;
    const energy = calculateEnergy(oId, type);
    setMixedEntries((prev) => [
      ...prev,
      { orchestraId: oId, style: profile.style, energy, era: profile.era },
    ]);
    setSearch("");
  };

  const handleRemoveMixedOrchestra = (oId: string) => {
    setMixedEntries((prev) => prev.filter((e) => e.orchestraId !== oId));
  };

  const handleSubmit = () => {
    if (tandaMode === "standard") {
      if (!orchestraId || !selectedProfile) return;
      onCreateTanda({
        orchestraId,
        tandaMode: "standard",
        singer: selectedSinger || null,
        type,
        trackCount,
        energy: Math.max(1, Math.min(10, finalEnergy)),
        style: selectedProfile.style,
        era: selectedProfile.era,
      });
    } else {
      if (mixedEntries.length < 2 || mixedErrors.length > 0) return;
      const primaryId = mixedEntries[0].orchestraId;
      const allIds = mixedEntries.map((e) => e.orchestraId);
      onCreateTanda({
        orchestraId: primaryId,
        orchestraIds: allIds,
        tandaMode: "mixed",
        singer: null,
        type,
        trackCount,
        energy: Math.max(1, Math.min(10, mixedFinalEnergy)),
        style: mixedEntries[0].style,
        era: mixedEntries[0].era,
      });
    }
    setOpen(false);
    resetForm();
  };

  const canSubmit = tandaMode === "standard"
    ? !!orchestraId && !!selectedProfile
    : mixedEntries.length >= 2 && mixedErrors.length === 0;

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" data-testid="button-create-tanda">
            <Plus className="w-4 h-4 mr-1" />
            {t("create_tanda")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto" data-testid="dialog-create-tanda">
        <DialogHeader>
          <DialogTitle className="font-serif">{t("create_new_tanda")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">{t("tanda_mode")}</Label>
            <div className="flex gap-1.5">
              {(["standard", "mixed"] as TandaMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setTandaMode(mode);
                    setOrchestraId("");
                    setSelectedSinger("");
                    setEnergyOverride(null);
                    setMixedEntries([]);
                  }}
                  className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all border ${
                    tandaMode === mode
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/50 text-muted-foreground"
                  }`}
                  data-testid={`button-mode-${mode}`}
                >
                  {t(`tanda_mode_${mode}`)}
                </button>
              ))}
            </div>
          </div>

          {tandaMode === "standard" ? (
            <>
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">{t("orchestra")}</Label>
                <Input
                  placeholder={t("search_orchestras")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="mb-2"
                  data-testid="input-orchestra-search"
                />
                <div className="max-h-36 overflow-y-auto space-y-1 rounded-md border border-border/50 p-1">
                  {filteredOrchestras.map((o) => (
                    <button
                      key={o.id}
                      onClick={() => {
                        setOrchestraId(o.id);
                        setSelectedSinger("");
                        setSearch("");
                        setEnergyOverride(null);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
                        orchestraId === o.id
                          ? "bg-primary/20 text-primary"
                          : "hover:bg-accent"
                      }`}
                      data-testid={`button-select-orchestra-${o.id}`}
                    >
                      <span className="font-medium">{o.name}</span>
                      {o.nickname && (
                        <span className="text-xs text-muted-foreground ml-1">({o.nickname})</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {selectedOrchestra && (
                <>
                  {selectedOrchestra.profiles.length > 1 && (
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">{t("singer_optional")}</Label>
                      <Select
                        value={selectedSinger}
                        onValueChange={(v) => {
                          setSelectedSinger(v);
                          setEnergyOverride(null);
                        }}
                      >
                        <SelectTrigger data-testid="select-singer">
                          <SelectValue placeholder={t("select_singer_config")} />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedOrchestra.profiles.map((p) => (
                            <SelectItem key={p.singer} value={p.singer}>
                              {p.singer} · {p.era}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">{t("type")}</Label>
                      <div className="flex gap-1.5">
                        {(["tango", "vals", "milonga"] as TandaType[]).map((tp) => {
                          const isAvailable = availableTypes.includes(tp);
                          return (
                            <button
                              key={tp}
                              onClick={() => {
                                if (!isAvailable) return;
                                setType(tp);
                                setEnergyOverride(null);
                              }}
                              disabled={!isAvailable}
                              className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${
                                !isAvailable
                                  ? "opacity-20 cursor-not-allowed"
                                  : type === tp
                                    ? "ring-1 ring-ring"
                                    : "opacity-60"
                              }`}
                              data-testid={`button-type-${tp}`}
                            >
                              <TypeBadge type={tp} size="sm" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">{t("tracks")}</Label>
                      <div className="flex gap-1.5">
                        {[3, 4].map((n) => (
                          <button
                            key={n}
                            onClick={() => setTrackCount(n)}
                            className={`flex-1 py-1.5 rounded-md text-sm font-medium border transition-all ${
                              trackCount === n
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border/50"
                            }`}
                            data-testid={`button-tracks-${n}`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <Label className="text-xs text-muted-foreground">{t("energy")}</Label>
                      <span className="text-xs text-muted-foreground">
                        {t("base")}: {calculatedEnergy.toFixed(1)}
                        {energyOverride !== null && ` | ${t("override")}: ${energyOverride.toFixed(1)}`}
                      </span>
                    </div>
                    <EnergyBar energy={finalEnergy} size="md" />
                    <Slider
                      value={[energyOverride !== null ? energyOverride : calculatedEnergy]}
                      onValueChange={([v]) => setEnergyOverride(v)}
                      min={1}
                      max={10}
                      step={0.5}
                      className="mt-2"
                      data-testid="slider-energy"
                    />
                  </div>

                  {selectedProfile && (
                    <div className="text-xs text-muted-foreground p-2 rounded-md bg-accent/50">
                      <p className="font-medium mb-0.5">{getStyleLabel(selectedProfile.style)}</p>
                      <p className="italic">{selectedProfile.dj_notes}</p>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">{t("type")}</Label>
                  <div className="flex gap-1.5">
                    {(["tango", "vals", "milonga"] as TandaType[]).map((tp) => (
                      <button
                        key={tp}
                        onClick={() => {
                          setType(tp);
                          setEnergyOverride(null);
                          setMixedEntries((prev) =>
                            prev.map((e) => ({
                              ...e,
                              energy: calculateEnergy(e.orchestraId, tp),
                            }))
                          );
                        }}
                        className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${
                          type === tp ? "ring-1 ring-ring" : "opacity-60"
                        }`}
                        data-testid={`button-type-${tp}`}
                      >
                        <TypeBadge type={tp} size="sm" />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">{t("tracks")}</Label>
                  <div className="flex gap-1.5">
                    {[3, 4].map((n) => (
                      <button
                        key={n}
                        onClick={() => setTrackCount(n)}
                        className={`flex-1 py-1.5 rounded-md text-sm font-medium border transition-all ${
                          trackCount === n
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border/50"
                        }`}
                        data-testid={`button-tracks-${n}`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">{t("mixed_orchestras")}</Label>

                {mixedEntries.length > 0 && (
                  <div className="space-y-1 mb-2">
                    {mixedEntries.map((entry) => {
                      const orch = orchestras.find((o) => o.id === entry.orchestraId);
                      return (
                        <div
                          key={entry.orchestraId}
                          className="flex items-center justify-between px-2 py-1.5 rounded-md border border-border/50 bg-accent/30 text-sm"
                          data-testid={`mixed-entry-${entry.orchestraId}`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-medium truncate">{orch?.name || entry.orchestraId}</span>
                            <span className="text-[10px] text-muted-foreground/70 flex-shrink-0">
                              {getStyleLabel(entry.style)} · {entry.era}
                            </span>
                          </div>
                          <button
                            onClick={() => handleRemoveMixedOrchestra(entry.orchestraId)}
                            className="text-muted-foreground/50 hover:text-destructive flex-shrink-0 ml-2"
                            data-testid={`button-remove-mixed-${entry.orchestraId}`}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {mixedErrors.length > 0 && mixedEntries.length >= 2 && (
                  <div className="space-y-1 mb-2">
                    {mixedErrors.map((err, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-yellow-400">
                        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        <span>{err}</span>
                      </div>
                    ))}
                  </div>
                )}

                <Input
                  placeholder={t("search_orchestras")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="mb-2"
                  data-testid="input-mixed-orchestra-search"
                />
                <div className="max-h-28 overflow-y-auto space-y-1 rounded-md border border-border/50 p-1">
                  {filteredOrchestras.map((o) => (
                    <button
                      key={o.id}
                      onClick={() => handleAddMixedOrchestra(o.id)}
                      className="w-full text-left px-2 py-1.5 rounded text-sm transition-colors hover:bg-accent"
                      data-testid={`button-add-mixed-${o.id}`}
                    >
                      <span className="font-medium">{o.name}</span>
                      {o.nickname && (
                        <span className="text-xs text-muted-foreground ml-1">({o.nickname})</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {mixedEntries.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Label className="text-xs text-muted-foreground">{t("energy")}</Label>
                    <span className="text-xs text-muted-foreground">
                      {t("base")}: {mixedAvgEnergy.toFixed(1)}
                      {energyOverride !== null && ` | ${t("override")}: ${energyOverride.toFixed(1)}`}
                    </span>
                  </div>
                  <EnergyBar energy={mixedFinalEnergy} size="md" />
                  <Slider
                    value={[energyOverride !== null ? energyOverride : mixedAvgEnergy]}
                    onValueChange={([v]) => setEnergyOverride(v)}
                    min={1}
                    max={10}
                    step={0.5}
                    className="mt-2"
                    data-testid="slider-mixed-energy"
                  />
                </div>
              )}
            </>
          )}

          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full"
            data-testid="button-submit-tanda"
          >
            {t("add_tanda")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
