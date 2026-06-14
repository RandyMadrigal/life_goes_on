export const motivationalTemplate = (name: string, message: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="background:#0f0f13;color:#f5f5f7;font-family:Georgia,serif;margin:0;padding:0;">
  <div style="max-width:560px;margin:0 auto;padding:48px 24px;">
    <p style="font-size:12px;letter-spacing:0.3em;text-transform:uppercase;color:#8a8a9a;margin:0 0 32px;">
      命 — Inochi · A message for you
    </p>
    <h1 style="font-size:28px;font-weight:400;margin:0 0 24px;">Hey, ${name}.</h1>
    <div style="font-size:17px;line-height:1.9;color:#c8c8d4;white-space:pre-line;margin:0 0 40px;">
      ${message}
    </div>
    <p style="font-size:13px;color:#8a8a9a;margin:0 0 40px;">— Life Goes On</p>
    <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#555562;margin:0;">
      命 · Even slowly · You are still here
    </p>
  </div>
</body>
</html>
`;
