export const resetPasswordTemplate = (resetUrl: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="background:#0f0f13;color:#f5f5f7;font-family:Georgia,serif;margin:0;padding:0;">
  <div style="max-width:560px;margin:0 auto;padding:48px 24px;">
    <p style="font-size:12px;letter-spacing:0.3em;text-transform:uppercase;color:#8a8a9a;margin:0 0 32px;">
      命 — Life Goes On · Admin
    </p>
    <h1 style="font-size:26px;font-weight:400;margin:0 0 24px;">Reset your password</h1>
    <p style="font-size:16px;line-height:1.7;color:#c8c8d4;margin:0 0 32px;">
      We received a request to reset the admin password. This link expires in
      1 hour and can only be used once.
    </p>
    <a
      href="${resetUrl}"
      style="display:inline-block;background:#b91c2e;color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-size:15px;margin:0 0 32px;"
    >
      Reset password
    </a>
    <p style="font-size:13px;color:#8a8a9a;margin:0 0 8px;">
      If you didn't request this, you can safely ignore this email — your
      password won't change.
    </p>
    <p style="font-size:11px;color:#555562;word-break:break-all;margin:0;">
      ${resetUrl}
    </p>
  </div>
</body>
</html>
`;
