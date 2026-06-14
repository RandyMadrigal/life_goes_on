export const resetPasswordTemplate = (name: string, resetUrl: string): string => `
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
    <h1 style="font-size:28px;font-weight:400;margin:0 0 24px;">Password Reset</h1>
    <p style="font-size:16px;line-height:1.8;color:#c8c8d4;margin:0 0 16px;">
      Hey ${name}, we received a request to reset your password.
    </p>
    <p style="font-size:16px;line-height:1.8;color:#c8c8d4;margin:0 0 32px;">
      Click the button below. This link expires in <strong>10 minutes</strong>.
    </p>
    <a href="${resetUrl}"
       style="display:inline-block;background:#c0392b;color:#fff;text-decoration:none;
              padding:14px 32px;border-radius:999px;font-size:14px;letter-spacing:0.05em;">
      Reset my password
    </a>
    <p style="margin-top:32px;font-size:13px;color:#8a8a9a;line-height:1.6;">
      If you didn't request this, you can safely ignore this email.
      Your password won't change until you use the link above.
    </p>
  </div>
</body>
</html>
`;
