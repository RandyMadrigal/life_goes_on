import bcrypt from "bcryptjs";
import { env } from "../config/env";

// A syntactically valid bcrypt hash that matches no real password. Compare
// against this when a lookup misses (e.g. unknown email) so bcrypt still
// runs and the response time doesn't leak whether the account exists.
const DUMMY_HASH = "$2b$12$1dL5EUBimmngb79kE6dweOdSOG8SRmWArz5ZegwLGpa4qBAHo6k62";

/** Hashes a plain-text password with bcrypt, using the configured cost factor. */
export const hashPassword = (plain: string): Promise<string> =>
  bcrypt.hash(plain, env.BCRYPT_ROUNDS);

/**
 * Compares a plain-text password against a stored hash. Pass `undefined`/`null`
 * for `hash` when the account wasn't found — it still runs bcrypt against a
 * dummy hash instead of short-circuiting, for timing-safety.
 */
export const comparePassword = (plain: string, hash?: string | null): Promise<boolean> =>
  bcrypt.compare(plain, hash ?? DUMMY_HASH);
