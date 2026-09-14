// Colors match the site's dark theme (src/apps/web/src/styles.css .dark block),
// converted from OKLCH to hex since email clients don't support oklch().
//   --background      oklch(0.13 0.012 240) → #04080b
//   card surface       oklch(0.20 0.01  240) → #12171a  (lightened from --card
//                                                         for visible contrast
//                                                         against the background —
//                                                         --card itself is only
//                                                         a shade away from black)
//   --foreground       oklch(0.97 0.005 240) → #f2f6f8
//   --muted-foreground oklch(0.6  0.01  240) → #7b8186
//   --crimson          oklch(0.65 0.2   15)  → #ef4b67
import { escapeHtml } from "../../utils/escapeHtml";

export const motivationalTemplate = (
  name: string,
  message: string,
  unsubscribeUrl: string,
): string => {
  const safeName = escapeHtml(name);
  const safeMessage = escapeHtml(message);
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="dark" />
</head>
<body style="background:#04080b;color:#f2f6f8;font-family:Georgia,'Times New Roman',serif;margin:0;padding:0;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
    <div style="background:#12171a;border:1px solid rgba(239,75,103,0.25);border-left:4px solid #ef4b67;border-radius:14px;padding:44px 36px;">

      <p style="text-align:center;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#7b8186;margin:0 0 32px;">
        命 — Inochi · A message for you
      </p>

      <h1 style="font-size:26px;font-weight:400;margin:0 0 24px;color:#f2f6f8;">Hey, ${safeName}.</h1>

      <div style="font-size:17px;line-height:1.9;color:#d7dade;white-space:pre-line;margin:0 0 36px;">
        ${safeMessage}
      </div>

      <p style="font-size:13px;color:#9ea6ab;margin:0 0 32px;">— Life Goes On</p>

      <div style="height:1px;background:rgba(255,255,255,0.1);margin:0 0 28px;"></div>

      <p style="text-align:center;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#7b8186;margin:0 0 28px;">
        命 · Even slowly · You are still here
      </p>

      <p style="text-align:center;font-size:11px;color:#7b8186;margin:0;">
        <a href="${unsubscribeUrl}" style="color:#ef4b67;text-decoration:underline;">Unsubscribe</a> from these daily messages.
      </p>
    </div>
  </div>
</body>
</html>
`;
};
