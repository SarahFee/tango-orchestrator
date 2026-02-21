import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import type { MilongaSet, Tanda } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Calendar, MapPin, Music, ChevronRight, Clock } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { getOrchestra } from "@/lib/orchestraData";
import { EnergyBar } from "@/components/EnergyBar";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [, navigate] = useLocation();

  const { data: sets, isLoading } = useQuery<MilongaSet[]>({
    queryKey: ["/api/sets"],
  });

  const handleNewSet = async () => {
    const today = new Date().toISOString().split("T")[0];
    const res = await apiRequest("POST", "/api/sets", {
      name: "New Milonga Set",
      date: today,
      startTime: "21:00",
    });
    const newSet = await res.json();
    queryClient.invalidateQueries({ queryKey: ["/api/sets"] });
    navigate(`/planner/${newSet.id}`);
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
        <Button onClick={handleNewSet} data-testid="button-new-set">
          <Plus className="w-4 h-4 mr-1.5" />
          New Set
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-5 w-3/4 mb-3" />
              <Skeleton className="h-3 w-1/2 mb-2" />
              <Skeleton className="h-3 w-1/3 mb-4" />
              <Skeleton className="h-8 w-full" />
            </Card>
          ))}
        </div>
      ) : sets && sets.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sets.map((set) => (
            <SetCard key={set.id} set={set} onClick={() => navigate(`/planner/${set.id}`)} />
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

function SetCard({ set, onClick }: { set: MilongaSet; onClick: () => void }) {
  const { data: tandas } = useQuery<Tanda[]>({
    queryKey: ["/api/sets", set.id, "tandas"],
  });

  const filledTandas = tandas?.filter((t) => t.position !== null) || [];
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
