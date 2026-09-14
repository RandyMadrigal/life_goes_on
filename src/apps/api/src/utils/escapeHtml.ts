const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/**
 * Escapes text for safe interpolation into raw HTML template literals
 * (emails, the unsubscribe confirmation page). Any value that originated
 * from user input — a subscriber's name, in particular — must go through
 * this before being placed inside HTML; these templates aren't JSX, so
 * nothing escapes it automatically.
 */
export const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
