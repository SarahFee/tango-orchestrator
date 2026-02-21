import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMilongaSetSchema, insertTandaSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/sets", async (_req, res) => {
    try {
      const sets = await storage.getAllSets();
      res.json(sets);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch sets" });
    }
  });

  app.get("/api/sets/:id", async (req, res) => {
    try {
      const set = await storage.getSet(req.params.id);
      if (!set) return res.status(404).json({ message: "Set not found" });
      res.json(set);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch set" });
    }
  });

  app.post("/api/sets", async (req, res) => {
    try {
      const parsed = insertMilongaSetSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid data", errors: parsed.error.issues });
      }
      const set = await storage.createSet(parsed.data);
      res.status(201).json(set);
    } catch (err) {
      res.status(500).json({ message: "Failed to create set" });
    }
  });

  app.patch("/api/sets/:id", async (req, res) => {
    try {
      const set = await storage.updateSet(req.params.id, req.body);
      if (!set) return res.status(404).json({ message: "Set not found" });
      res.json(set);
    } catch (err) {
      res.status(500).json({ message: "Failed to update set" });
    }
  });

  app.delete("/api/sets/:id", async (req, res) => {
    try {
      await storage.deleteSet(req.params.id);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: "Failed to delete set" });
    }
  });

  app.get("/api/sets/:id/tandas", async (req, res) => {
    try {
      const tandas = await storage.getTandasForSet(req.params.id);
      res.json(tandas);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch tandas" });
    }
  });

  app.post("/api/sets/:id/tandas", async (req, res) => {
    try {
      const data = { ...req.body, setId: req.params.id };
      const parsed = insertTandaSchema.safeParse(data);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid data", errors: parsed.error.issues });
      }
      const tanda = await storage.createTanda(parsed.data);
      res.status(201).json(tanda);
    } catch (err) {
      console.error("Create tanda error:", err);
      res.status(500).json({ message: "Failed to create tanda" });
    }
  });

  app.patch("/api/tandas/:id", async (req, res) => {
    try {
      const tanda = await storage.updateTanda(req.params.id, req.body);
      if (!tanda) return res.status(404).json({ message: "Tanda not found" });
      res.json(tanda);
    } catch (err) {
      res.status(500).json({ message: "Failed to update tanda" });
    }
  });

  app.delete("/api/tandas/:id", async (req, res) => {
    try {
      await storage.deleteTanda(req.params.id);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: "Failed to delete tanda" });
    }
  });

  return httpServer;
}
