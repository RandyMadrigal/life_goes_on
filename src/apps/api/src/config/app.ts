import express, { type Application, type Request, type Response } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import mongoose from "mongoose";
import { corsOptions } from "./cors";
import { env } from "./env";
import { globalLimiter } from "../middlewares/rateLimiter.middleware";
import { errorMiddleware } from "../middlewares/error.middleware";
import routes from "../routes";

const createApp = (): Application => {
  const app = express();

  // ── Security headers ──────────────────────────────────────────────────────
  app.use(helmet());
  app.use(cors(corsOptions));
  app.set("trust proxy", 1);

  // ── Body parsing (size-limited to prevent payload attacks) ────────────────
  app.use(express.json({ limit: "10kb" }));
  app.use(express.urlencoded({ extended: true, limit: "10kb" }));

  // ── Cookies ───────────────────────────────────────────────────────────────
  app.use(cookieParser(env.COOKIE_SECRET));

  // ── NoSQL injection sanitization ──────────────────────────────────────────
  app.use(mongoSanitize());

  // ── Global rate limiter ───────────────────────────────────────────────────
  app.use(globalLimiter);

  // ── Routes ────────────────────────────────────────────────────────────────
  app.use("/api/v1", routes);

  // ── Health check ──────────────────────────────────────────────────────────
  // Quick self-check for Railway's restart-on-failure and manual sanity checks
  // — not a replacement for Railway's own infra-level CPU/memory/network
  // metrics (its dashboard already shows those with no code needed here).
  app.get("/health", (_req: Request, res: Response) => {
    const mongoConnected = mongoose.connection.readyState === 1;
    const mem = process.memoryUsage();
    const toMb = (bytes: number): number => Math.round((bytes / 1024 / 1024) * 10) / 10;

    res.status(mongoConnected ? 200 : 503).json({
      status: mongoConnected ? "ok" : "degraded",
      env: env.NODE_ENV,
      uptimeSeconds: Math.round(process.uptime()),
      memory: {
        rssMb: toMb(mem.rss),
        heapUsedMb: toMb(mem.heapUsed),
        heapTotalMb: toMb(mem.heapTotal),
      },
      mongo: mongoConnected ? "connected" : "disconnected",
    });
  });

  // ── 404 ───────────────────────────────────────────────────────────────────
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ success: false, message: "Route not found" });
  });

  // ── Centralized error handler ──────────────────────────────────────────────
  app.use(errorMiddleware);

  return app;
};

export default createApp;
