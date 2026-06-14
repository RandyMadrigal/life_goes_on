export const welcomeTemplate = (name: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="background:#0f0f13;color:#f5f5f7;font-family:Georgia,serif;margin:0;padding:0;">
  <div style="max-width:560px;margin:0 auto;padding:48px 24px;">
    <p style="font-size:12px;letter-spacing:0.3em;text-transform:uppercase;color:#8a8a9a;margin:0 0 32px;">
      命 — Inochi · Life Goes On
    </p>
    <h1 style="font-size:32px;font-weight:400;line-height:1.2;margin:0 0 24px;">
      Hey, ${name}.
    </h1>
    <p style="font-size:16px;line-height:1.8;color:#c8c8d4;margin:0 0 16px;">
      You took a step. That already matters.
    </p>
    <p style="font-size:16px;line-height:1.8;color:#c8c8d4;margin:0 0 16px;">
      Life Goes On is a quiet companion — not a fix, not a solution.
      Just a gentle reminder, delivered each day, that you are still moving forward.
    </p>
    <p style="font-size:16px;line-height:1.8;color:#c8c8d4;margin:0 0 40px;">
      Even slowly. Even quietly.
      <span style="color:#c0392b;">Even on hard days.</span>
    </p>
    <p style="font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#8a8a9a;margin:0;">
      命 · Your journey continues
    </p>
  </div>
</body>
</html>
`;
