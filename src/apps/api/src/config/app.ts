import express, { type Application, type Request, type Response } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
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
  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok", env: env.NODE_ENV });
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
