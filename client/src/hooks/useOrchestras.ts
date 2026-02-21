import { useSyncExternalStore, useEffect } from "react";
import {
  subscribe,
  getCache,
  fetchOrchestras,
  getOrchestras,
  SUGGEST_ORCHESTRA_URL,
} from "@/lib/orchestraService";

export function useOrchestras() {
  const cache = useSyncExternalStore(subscribe, () => getCache());

  useEffect(() => {
    fetchOrchestras();
  }, []);

  return {
    orchestras: cache.orchestras,
    loading: cache.loading,
    lastSynced: cache.lastSynced,
    source: cache.source,
    error: cache.error,
    refresh: fetchOrchestras,
    suggestUrl: SUGGEST_ORCHESTRA_URL,
  };
}

export { getOrchestras };
