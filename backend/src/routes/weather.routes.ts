import express, { Request, Response } from "express";
import { getWeather, WeatherServiceError } from "../services/weather.service";
import { PrismaClient } from "@prisma/client";
import { Parser } from "json2csv";

const prisma = new PrismaClient();
const router = express.Router();

// GET current weather
router.get("/", async (req: Request, res: Response) => {
  try {
    const city = req.query.city as string;
    if (!city || city.trim() === "") {
      return res.status(400).json({ error: "city query parameter is required" });
    }
    const data = await getWeather(city.trim());
    res.json(data);
  } catch (err: any) {
    console.error("Weather fetch error:", err.message);
    if (err instanceof WeatherServiceError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    res.status(502).json({ error: "Weather service is temporarily unavailable. Please try again." });
  }
});

// READ — full history
router.get("/history", async (_req: Request, res: Response) => {
  try {
    const data = await prisma.weatherSearch.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to load history" });
  }
});

// EXPORT CSV
router.get("/export/csv", async (_req: Request, res: Response) => {
  try {
    const data = await prisma.weatherSearch.findMany({ orderBy: { createdAt: "desc" } });
    if (data.length === 0) {
      return res.status(404).json({ error: "No records to export" });
    }
    const parser = new Parser({
      fields: ["id", "city", "latitude", "longitude", "temperature", "humidity", "description", "createdAt"],
    });
    const csv = parser.parse(data);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=weather_history.csv");
    res.send(csv);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to export CSV" });
  }
});

// EXPORT JSON
router.get("/export/json", async (_req: Request, res: Response) => {
  try {
    const data = await prisma.weatherSearch.findMany({ orderBy: { createdAt: "desc" } });
    res.setHeader("Content-Disposition", "attachment; filename=weather_history.json");
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to export JSON" });
  }
});

// READ — single record
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const record = await prisma.weatherSearch.findUnique({ where: { id } });
    if (!record) return res.status(404).json({ error: "Record not found" });
    res.json(record);
  } catch {
    res.status(500).json({ error: "Failed to fetch record" });
  }
});

// UPDATE
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const { city, temperature, humidity, description } = req.body;

    if (city === undefined && temperature === undefined && humidity === undefined && description === undefined) {
      return res.status(400).json({ error: "Provide at least one field: city, temperature, humidity, description" });
    }
    if (temperature !== undefined && (isNaN(Number(temperature)) || Number(temperature) < -100 || Number(temperature) > 100)) {
      return res.status(400).json({ error: "temperature must be a number between -100 and 100" });
    }
    if (humidity !== undefined && (isNaN(Number(humidity)) || Number(humidity) < 0 || Number(humidity) > 100)) {
      return res.status(400).json({ error: "humidity must be a number between 0 and 100" });
    }

    const existing = await prisma.weatherSearch.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Record not found" });

    const updated = await prisma.weatherSearch.update({
      where: { id },
      data: {
        ...(city        !== undefined && { city:        String(city).trim() }),
        ...(temperature !== undefined && { temperature: Number(temperature) }),
        ...(humidity    !== undefined && { humidity:    Number(humidity) }),
        ...(description !== undefined && { description: String(description).trim() }),
      },
    });
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Failed to update record" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const existing = await prisma.weatherSearch.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Record not found" });
    await prisma.weatherSearch.delete({ where: { id } });
    res.json({ message: "Record deleted successfully", id });
  } catch {
    res.status(500).json({ error: "Failed to delete record" });
  }
});

export default router;
