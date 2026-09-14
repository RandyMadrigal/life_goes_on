import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z
    .string()
    .default("3001")
    .transform((v) => parseInt(v, 10)),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  JWT_ACCESS_SECRET: z.string().min(32, "JWT_ACCESS_SECRET must be at least 32 chars"),
  JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 chars"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  COOKIE_SECRET: z.string().min(32, "COOKIE_SECRET must be at least 32 chars"),
  SMTP_HOST: z.string().default("smtp.gmail.com"),
  SMTP_PORT: z
    .string()
    .default("465")
    .transform((v) => parseInt(v, 10)),
  SMTP_SECURE: z
    .string()
    .default("true")
    .transform((v) => v === "true"),
  SMTP_USER: z.string().default(""),
  SMTP_PASS: z.string().default(""),
  FROM_EMAIL: z.string().email().default("noreply@lifegoeson.app"),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
  API_BASE_URL: z.string().url().default("http://localhost:3001"),
  BCRYPT_ROUNDS: z
    .string()
    .default("12")
    .transform((v) => parseInt(v, 10)),
  // Shared secret for the external cron trigger (cron-job.org) — see
  // middlewares/cronAuth.middleware.ts and routes/jobs.routes.ts.
  CRON_SECRET: z.string().min(32, "CRON_SECRET must be at least 32 chars"),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD_HASH: z
    .string()
    .regex(
      /^\$2[aby]\$\d{2}\$/,
      "ADMIN_PASSWORD_HASH must be a bcrypt hash (generate with `npx bcrypt-cli` or the hash script)",
    ),
});

export type Env = z.infer<typeof envSchema>;

const parseEnv = (): Env => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error(
      "❌  Invalid environment variables:\n",
      result.error.errors.map((e) => `  ${e.path.join(".")}: ${e.message}`).join("\n"),
    );
    process.exit(1);
  }
  return result.data;
};

export const env = parseEnv();
