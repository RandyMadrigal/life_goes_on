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
  SENDGRID_API_KEY: z.string().default(""),
  FROM_EMAIL: z.string().email().default("noreply@lifegoeson.app"),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
  BCRYPT_ROUNDS: z
    .string()
    .default("12")
    .transform((v) => parseInt(v, 10)),
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
