import { createHash } from "crypto";

/**
 * Deterministic SHA-256 hash for opaque lookup tokens (password-reset,
 * refresh, unsubscribe). Not for passwords — bcrypt is non-deterministic
 * (random salt per call), so it can't support an exact-match DB lookup.
 */
export const hashToken = (token: string): string =>
  createHash("sha256").update(token).digest("hex");
