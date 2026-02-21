import { useState, useMemo } from "react";
import { getStyleLabel, styleCategories } from "@/lib/orchestraData";
import { STYLE_COLORS } from "@/lib/tangoColors";
import { EnergyBar } from "@/components/EnergyBar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, Music, Info, ChevronDown, ChevronUp, RefreshCw, ExternalLink, Loader2, Cloud, HardDrive } from "lucide-react";
import type { Orchestra } from "@shared/schema";
import { useOrchestras } from "@/hooks/useOrchestras";
import { SUGGEST_ORCHESTRA_URL } from "@/lib/orchestraService";
import { useLanguage } from "@/hooks/useLanguage";

export default function OrchestraReference() {
  const { orchestras, loading, lastSynced, source, error, refresh } = useOrchestras();
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [styleFilter, setStyleFilter] = useState("all");
  const [energyRange, setEnergyRange] = useState([1, 10]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return orchestras.filter((o) => {
      const matchesSearch =
        !search ||
        o.name.toLowerCase().includes(search.toLowerCase()) ||
        o.nickname?.toLowerCase().includes(search.toLowerCase());

      const matchesStyle =
        styleFilter === "all" || o.profiles.some((p) => p.style === styleFilter);

      const matchesEnergy = o.profiles.some(
        (p) => p.energy >= energyRange[0] && p.energy <= energyRange[1]
      );

      return matchesSearch && matchesStyle && matchesEnergy;
    });
  }, [orchestras, search, styleFilter, energyRange]);

  return (
    <div className="min-h-full p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight" data-testid="text-orchestra-title">
              {t("orchestra_reference")}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {t("orchestra_ref_count", { subtitle: t("orchestra_ref_subtitle"), count: orchestras.length })}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(SUGGEST_ORCHESTRA_URL, "_blank")}
              data-testid="button-suggest-orchestra"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
              {t("suggest_orchestra")}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={refresh}
              disabled={loading}
              data-testid="button-refresh-orchestras"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground" data-testid="sync-status">
          {source === "remote" ? (
            <Cloud className="w-3 h-3" />
          ) : (
            <HardDrive className="w-3 h-3" />
          )}
          {loading ? (
            <span>{t("syncing")}</span>
          ) : lastSynced ? (
            <span>{t("last_synced")}: {lastSynced.toLocaleTimeString()}</span>
          ) : error ? (
            <span>{t("using_builtin_sync_failed")}</span>
          ) : (
            <span>{t("using_builtin_data")}</span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t("search_orchestras_ref")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-orchestra-ref-search"
          />
        </div>
        <Select value={styleFilter} onValueChange={setStyleFilter}>
          <SelectTrigger className="w-44" data-testid="select-style-filter">
            <SelectValue placeholder={t("all_styles")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all_styles")}</SelectItem>
            {Object.keys(styleCategories).map((s) => (
              <SelectItem key={s} value={s}>
                {getStyleLabel(s)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 min-w-[180px]">
          <span className="text-xs text-muted-foreground whitespace-nowrap">{t("energy")} {energyRange[0]}-{energyRange[1]}</span>
          <Slider
            value={energyRange}
            onValueChange={setEnergyRange}
            min={1}
            max={10}
            step={1}
            className="flex-1"
            data-testid="slider-energy-filter"
          />
        </div>
      </div>

      <div className="text-xs text-muted-foreground mb-4">
        {t("orchestras_found", { count: filtered.length })}
      </div>

      <div className="space-y-3">
        {filtered.map((o) => (
          <OrchestraCard
            key={o.id}
            orchestra={o}
            isExpanded={expandedId === o.id}
            onToggle={() => setExpandedId(expandedId === o.id ? null : o.id)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Music className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">{t("no_orchestras_match")}</p>
        </div>
      )}
    </div>
  );
}

function OrchestraCard({
  orchestra,
  isExpanded,
  onToggle,
}: {
  orchestra: Orchestra;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const { t } = useLanguage();
  const mainProfile = orchestra.profiles[0];
  const styleColor = STYLE_COLORS[mainProfile.style] || "#888";

  return (
    <Card
      className="overflow-visible transition-all"
      data-testid={`card-orchestra-${orchestra.id}`}
    >
      <button
        onClick={onToggle}
        className="w-full text-left p-4 flex items-center gap-4"
        data-testid={`button-expand-${orchestra.id}`}
      >
        <div
          className="w-1 self-stretch rounded-full flex-shrink-0"
          style={{ backgroundColor: styleColor }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-serif font-semibold text-base">{orchestra.name}</h3>
            {orchestra.nickname && (
              <span className="text-xs text-muted-foreground italic">"{orchestra.nickname}"</span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            {orchestra.active_years && <span>{orchestra.active_years}</span>}
            <span
              className="px-1.5 py-0.5 rounded text-[10px] font-medium"
              style={{ backgroundColor: `${styleColor}20`, color: styleColor }}
            >
              {getStyleLabel(mainProfile.style)}
            </span>
            {orchestra.instrument && <span className="capitalize">{orchestra.instrument}</span>}
          </div>
        </div>
        <div className="w-24 flex-shrink-0">
          <EnergyBar energy={mainProfile.energy} size="sm" />
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-border/30 p-4 space-y-4">
          {orchestra.profiles.map((profile, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-serif font-medium text-sm">{profile.era_label || profile.era}</span>
                <span className="text-xs text-muted-foreground">({profile.era})</span>
                <Badge variant="secondary" className="text-[10px]">
                  {getStyleLabel(profile.style)}
                </Badge>
                {profile.confidence && (
                  <span className="text-[10px] text-muted-foreground/60">
                    {t("confidence")}: {profile.confidence}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground">{t("energy")}</span>
                  <EnergyBar energy={profile.energy} size="sm" />
                </div>
                <div>
                  <span className="text-muted-foreground">{t("danceability")}</span>
                  <p className="font-medium tabular-nums">{profile.danceability}/10</p>
                </div>
                <div>
                  <span className="text-muted-foreground">{t("complexity")}</span>
                  <p className="font-medium tabular-nums">{profile.complexity}/10</p>
                </div>
                <div>
                  <span className="text-muted-foreground">{t("mood")}</span>
                  <p className="font-medium capitalize">{profile.mood}</p>
                </div>
              </div>

              {profile.key_singers && profile.key_singers.length > 0 && (
                <div>
                  <span className="text-xs text-muted-foreground">{t("key_singers")}: </span>
                  <span className="text-xs font-medium">{profile.key_singers.join(", ")}</span>
                </div>
              )}

              {profile.tags && profile.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {profile.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-accent text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-start gap-1.5 text-xs p-2 rounded bg-accent/50 italic text-muted-foreground">
                <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <p>{profile.dj_notes}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
