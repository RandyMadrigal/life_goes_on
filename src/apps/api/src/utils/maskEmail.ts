/** Masks an email for logging — e.g. "randy@gmail.com" → "ra***@gmail.com". Never log the raw address. */
export const maskEmail = (email: string): string => {
  const [local, domain] = email.split("@");
  if (!domain) return "***";
  const visible = local.slice(0, 2);
  const masked = "*".repeat(Math.max(local.length - visible.length, 1));
  return `${visible}${masked}@${domain}`;
};
