import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { orchestras, calculateEnergy, getAllSingers, getStyleLabel } from "@/lib/orchestraData";
import { Plus } from "lucide-react";
import { TypeBadge } from "./TypeBadge";
import { EnergyBar } from "./EnergyBar";
import type { TandaType } from "@shared/schema";

interface CreateTandaDialogProps {
  onCreateTanda: (tanda: {
    orchestraId: string;
    singer: string | null;
    type: TandaType;
    trackCount: number;
    energy: number;
    style: string;
    era: string;
  }) => void;
  trigger?: React.ReactNode;
}

export function CreateTandaDialog({ onCreateTanda, trigger }: CreateTandaDialogProps) {
  const [open, setOpen] = useState(false);
  const [orchestraId, setOrchestraId] = useState("");
  const [singer, setSinger] = useState("");
  const [type, setType] = useState<TandaType>("tango");
  const [trackCount, setTrackCount] = useState(4);
  const [energyOverride, setEnergyOverride] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const selectedOrchestra = useMemo(() => orchestras.find((o) => o.id === orchestraId), [orchestraId]);
  const singers = useMemo(() => (orchestraId ? getAllSingers(orchestraId) : []), [orchestraId]);
  const calculatedEnergy = useMemo(
    () => (orchestraId ? calculateEnergy(orchestraId, type) : 5),
    [orchestraId, type]
  );
  const finalEnergy = energyOverride !== null ? energyOverride : calculatedEnergy;

  const filteredOrchestras = useMemo(() => {
    if (!search) return orchestras;
    const s = search.toLowerCase();
    return orchestras.filter(
      (o) => o.name.toLowerCase().includes(s) || o.nickname?.toLowerCase().includes(s)
    );
  }, [search]);

  const handleSubmit = () => {
    if (!orchestraId) return;
    const profile = selectedOrchestra?.profiles[0];
    onCreateTanda({
      orchestraId,
      singer: singer || null,
      type,
      trackCount,
      energy: Math.max(1, Math.min(10, finalEnergy)),
      style: profile?.style || "",
      era: profile?.era || "",
    });
    setOpen(false);
    setOrchestraId("");
    setSinger("");
    setType("tango");
    setTrackCount(4);
    setEnergyOverride(null);
    setSearch("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" data-testid="button-create-tanda">
            <Plus className="w-4 h-4 mr-1" />
            Create Tanda
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" data-testid="dialog-create-tanda">
        <DialogHeader>
          <DialogTitle className="font-serif">Create New Tanda</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">Orchestra</Label>
            <Input
              placeholder="Search orchestras..."
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">Type</Label>
                  <div className="flex gap-1.5">
                    {(["tango", "vals", "milonga"] as TandaType[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          setType(t);
                          setEnergyOverride(null);
                        }}
                        className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${
                          type === t ? "ring-1 ring-ring" : "opacity-60"
                        }`}
                        data-testid={`button-type-${t}`}
                      >
                        <TypeBadge type={t} size="sm" />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">Tracks</Label>
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

              {singers.length > 0 && (
                <div>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">Singer (optional)</Label>
                  <Select value={singer} onValueChange={setSinger}>
                    <SelectTrigger data-testid="select-singer">
                      <SelectValue placeholder="Instrumental" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instrumental">Instrumental</SelectItem>
                      {singers.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Label className="text-xs text-muted-foreground">Energy</Label>
                  <span className="text-xs text-muted-foreground">
                    Base: {calculatedEnergy.toFixed(1)}
                    {energyOverride !== null && ` | Override: ${energyOverride.toFixed(1)}`}
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

              <div className="text-xs text-muted-foreground p-2 rounded-md bg-accent/50">
                <p className="font-medium mb-0.5">{getStyleLabel(selectedOrchestra.profiles[0].style)}</p>
                <p className="italic">{selectedOrchestra.profiles[0].dj_notes}</p>
              </div>
            </>
          )}

          <Button
            onClick={handleSubmit}
            disabled={!orchestraId}
            className="w-full"
            data-testid="button-submit-tanda"
          >
            Add Tanda
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
