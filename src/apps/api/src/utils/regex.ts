/** Escapes regex special characters so user input is safe to use inside a $regex filter. */
export const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
