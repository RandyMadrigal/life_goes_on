// Colors match the site's dark theme — see motivational.template.ts for the
// OKLCH → hex mapping (src/apps/web/src/styles.css .dark block).
export const resetPasswordTemplate = (resetUrl: string): string => `
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
        命 — Life Goes On · Admin
      </p>

      <h1 style="font-size:24px;font-weight:400;margin:0 0 20px;color:#f2f6f8;text-align:center;">Reset your password</h1>

      <p style="font-size:15px;line-height:1.7;color:#d7dade;margin:0 0 32px;text-align:center;">
        We received a request to reset the admin password. This link expires in
        1 hour and can only be used once.
      </p>

      <div style="text-align:center;margin:0 0 32px;">
        <a
          href="${resetUrl}"
          style="display:inline-block;background-color:#ef4b67;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:999px;font-size:15px;font-family:system-ui,sans-serif;"
        >
          Reset password
        </a>
      </div>

      <div style="height:1px;background:rgba(255,255,255,0.1);margin:0 0 24px;"></div>

      <p style="font-size:13px;color:#9ea6ab;margin:0;text-align:center;">
        If you didn't request this, you can safely ignore this email — your
        password won't change.
      </p>
    </div>
  </div>
</body>
</html>
`;
