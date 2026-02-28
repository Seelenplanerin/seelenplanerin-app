import nodemailer from "nodemailer";

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const fromName = process.env.SMTP_FROM_NAME || "Die Seelenplanerin";

  if (!host || !user || !pass) {
    throw new Error("SMTP-Konfiguration fehlt. Bitte SMTP_HOST, SMTP_USER und SMTP_PASS setzen.");
  }

  return { host, port, user, pass, fromName };
}

function createTransporter() {
  const config = getSmtpConfig();
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
}

function emailTemplate(content: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#FDF8F4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FDF8F4;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:520px;background-color:#FFFFFF;border-radius:24px;border:1px solid #EDD9D0;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color:#F9EDE8;padding:32px 32px 24px;text-align:center;">
              <div style="font-size:40px;margin-bottom:12px;">🌸</div>
              <h1 style="margin:0;font-size:24px;color:#5C3317;font-weight:700;">Die Seelenplanerin</h1>
              <p style="margin:6px 0 0;font-size:14px;color:#A08070;">Dein spiritueller Begleiter</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px;border-top:1px solid #EDD9D0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#A08070;line-height:20px;">
                Mit Liebe gesendet von der Seelenplanerin ✨<br>
                <a href="https://www.instagram.com/die.seelenplanerin" style="color:#C4826A;text-decoration:none;">@die.seelenplanerin</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendWelcomeEmail(params: {
  toEmail: string;
  toName: string;
  tempPassword: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const config = getSmtpConfig();
    const transporter = createTransporter();

    const content = `
      <h2 style="margin:0 0 16px;font-size:20px;color:#5C3317;">Willkommen, ${params.toName}! 🌙</h2>
      <p style="margin:0 0 16px;font-size:15px;color:#8B5E3C;line-height:24px;">
        Schön, dass du Teil unserer Community wirst. Hier sind deine Zugangsdaten für die Seelenplanerin-App:
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF3E7;border-radius:16px;border:1px solid #E8D5B0;margin:0 0 20px;">
        <tr>
          <td style="padding:20px;">
            <p style="margin:0 0 8px;font-size:13px;color:#A08070;font-weight:600;">E-Mail-Adresse</p>
            <p style="margin:0 0 16px;font-size:16px;color:#5C3317;font-weight:700;">${params.toEmail}</p>
            <p style="margin:0 0 8px;font-size:13px;color:#A08070;font-weight:600;">Temporäres Passwort</p>
            <p style="margin:0;font-size:20px;color:#C4826A;font-weight:700;letter-spacing:2px;">${params.tempPassword}</p>
          </td>
        </tr>
      </table>
      <p style="margin:0 0 16px;font-size:14px;color:#8B5E3C;line-height:22px;">
        <strong>So geht's weiter:</strong>
      </p>
      <ol style="margin:0 0 20px;padding-left:20px;font-size:14px;color:#8B5E3C;line-height:24px;">
        <li>Öffne die Seelenplanerin-App</li>
        <li>Gehe zum Tab <strong>Community</strong></li>
        <li>Melde dich mit deiner E-Mail und dem temporären Passwort an</li>
        <li>Du wirst aufgefordert, ein eigenes Passwort zu wählen</li>
      </ol>
      <p style="margin:0;font-size:14px;color:#A08070;font-style:italic;text-align:center;">
        "Dieser Raum gehört uns – ein sicherer Ort für alle Frauen, die ihren spirituellen Weg gehen." ✨
      </p>`;

    await transporter.sendMail({
      from: `"${config.fromName}" <${config.user}>`,
      to: params.toEmail,
      subject: `🌸 Willkommen in der Seelenplanerin-Community, ${params.toName}!`,
      html: emailTemplate(content),
    });

    return { success: true };
  } catch (err: any) {
    console.error("[Email] Fehler beim Senden:", err);
    return { success: false, error: err.message || "Unbekannter Fehler" };
  }
}

export async function sendPasswordResetEmail(params: {
  toEmail: string;
  toName: string;
  tempPassword: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const config = getSmtpConfig();
    const transporter = createTransporter();

    const content = `
      <h2 style="margin:0 0 16px;font-size:20px;color:#5C3317;">Neues Passwort, ${params.toName} 🔑</h2>
      <p style="margin:0 0 16px;font-size:15px;color:#8B5E3C;line-height:24px;">
        Dein Passwort für die Seelenplanerin-Community wurde zurückgesetzt. Hier ist dein neues temporäres Passwort:
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9EDE8;border-radius:16px;border:1px solid #EDD9D0;margin:0 0 20px;">
        <tr>
          <td style="padding:20px;text-align:center;">
            <p style="margin:0 0 8px;font-size:13px;color:#A08070;font-weight:600;">Dein neues temporäres Passwort</p>
            <p style="margin:0;font-size:24px;color:#C4826A;font-weight:700;letter-spacing:3px;">${params.tempPassword}</p>
          </td>
        </tr>
      </table>
      <p style="margin:0 0 16px;font-size:14px;color:#8B5E3C;line-height:22px;">
        Melde dich mit diesem Passwort in der App an. Du wirst dann aufgefordert, ein neues persönliches Passwort zu wählen.
      </p>
      <p style="margin:0;font-size:13px;color:#A08070;text-align:center;">
        Falls du kein neues Passwort angefordert hast, kannst du diese E-Mail ignorieren.
      </p>`;

    await transporter.sendMail({
      from: `"${config.fromName}" <${config.user}>`,
      to: params.toEmail,
      subject: `🔑 Neues Passwort für die Seelenplanerin-Community`,
      html: emailTemplate(content),
    });

    return { success: true };
  } catch (err: any) {
    console.error("[Email] Fehler beim Senden:", err);
    return { success: false, error: err.message || "Unbekannter Fehler" };
  }
}

export async function sendBroadcastEmail(params: {
  recipients: { email: string; name: string }[];
  subject: string;
  message: string;
}): Promise<{ success: boolean; sent: number; failed: number; errors: string[] }> {
  try {
    const config = getSmtpConfig();
    const transporter = createTransporter();
    let sent = 0;
    let failed = 0;
    const errors: string[] = [];

    // Sanitize message for HTML
    const safeMessage = params.message
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');

    for (const recipient of params.recipients) {
      try {
        const content = `
          <h2 style="margin:0 0 16px;font-size:20px;color:#5C3317;">Nachricht von der Seelenplanerin \u{1F338}</h2>
          <p style="margin:0 0 16px;font-size:15px;color:#C4826A;">Hallo ${recipient.name},</p>
          <div style="margin:0 0 20px;font-size:15px;color:#8B5E3C;line-height:26px;">${safeMessage}</div>
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF3E7;border-radius:16px;border:1px solid #E8D5B0;margin:0 0 20px;">
            <tr>
              <td style="padding:16px;text-align:center;">
                <p style="margin:0;font-size:14px;color:#8B5E3C;">
                  \u00d6ffne die <strong>Seelenplanerin-App</strong> f\u00fcr mehr Inhalte \u2728
                </p>
              </td>
            </tr>
          </table>
          <p style="margin:0;font-size:13px;color:#A08070;text-align:center;font-style:italic;">
            "Vertraue deinem Weg \u2013 die Sterne begleiten dich." \u{1F319}
          </p>`;

        await transporter.sendMail({
          from: `"${config.fromName}" <${config.user}>`,
          to: recipient.email,
          subject: params.subject,
          html: emailTemplate(content),
        });
        sent++;
      } catch (err: any) {
        failed++;
        errors.push(`${recipient.email}: ${err.message}`);
      }
    }

    return { success: failed === 0, sent, failed, errors };
  } catch (err: any) {
    console.error("[Email] Broadcast-Fehler:", err);
    return { success: false, sent: 0, failed: params.recipients.length, errors: [err.message] };
  }
}

export async function sendAffiliateWelcomeEmail(params: {
  toEmail: string;
  toName: string;
  affiliateCode: string;
  affiliateLink: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const config = getSmtpConfig();
    const transporter = createTransporter();

    const content = `
      <h2 style="margin:0 0 16px;font-size:20px;color:#5C3317;">Willkommen bei \u201eGeben & Nehmen\u201c, ${params.toName}! \ud83e\udd1d</h2>
      <p style="margin:0 0 16px;font-size:15px;color:#8B5E3C;line-height:24px;">
        Wie wundersch\u00f6n, dass du dich entschieden hast, Teil unseres Empfehlungsprogramms zu werden! Du bist jetzt offiziell Botschafterin der Seelenplanerin \u2013 und verdienst <strong>20% Provision</strong> auf jeden Verkauf über deinen persönlichen Link (nur auf den Produktpreis, nicht auf Versandkosten).
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF3E7;border-radius:16px;border:1px solid #E8D5B0;margin:0 0 20px;">
        <tr>
          <td style="padding:20px;text-align:center;">
            <p style="margin:0 0 8px;font-size:13px;color:#A08070;font-weight:600;">Dein pers\u00f6nlicher Empfehlungslink</p>
            <p style="margin:0 0 12px;font-size:16px;color:#C4826A;font-weight:700;word-break:break-all;">${params.affiliateLink}</p>
            <p style="margin:0 0 8px;font-size:13px;color:#A08070;font-weight:600;">Dein Affiliate-Code</p>
            <p style="margin:0;font-size:22px;color:#C9A96E;font-weight:700;letter-spacing:2px;">${params.affiliateCode}</p>
          </td>
        </tr>
      </table>

      <p style="margin:0 0 12px;font-size:15px;color:#5C3317;font-weight:700;">So funktioniert\u2019s \u2013 in 3 Schritten:</p>

      <ol style="margin:0 0 20px;padding-left:20px;font-size:14px;color:#8B5E3C;line-height:26px;">
        <li><strong>Teile deinen Link</strong> \u2013 per WhatsApp, Instagram, Facebook oder pers\u00f6nlich</li>
        <li><strong>Jemand kauft \u00fcber deinen Link</strong> \u2013 egal ob Armband, Kerze, Aura Reading, Soul Talk oder Seelenimpuls</li>
        <li><strong>Du erhältst 20% Provision</strong> – sobald die Zahlung positiv eingegangen ist</li>
      </ol>

      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9EDE8;border-radius:16px;border:1px solid #EDD9D0;margin:0 0 20px;">
        <tr>
          <td style="padding:16px;">
            <p style="margin:0 0 8px;font-size:14px;color:#5C3317;font-weight:700;">Beispiele \u2013 was du verdienen kannst:</p>
            <table width="100%" style="font-size:13px;color:#8B5E3C;">
              <tr><td style="padding:4px 0;">Seelenimpuls (17 €/Monat)</td><td style="text-align:right;font-weight:700;color:#4CAF50;">3,40 €</td></tr>
              <tr><td style="padding:4px 0;">Schutzarmband Mariposa (24 €)</td><td style="text-align:right;font-weight:700;color:#4CAF50;">4,80 €</td></tr>
              <tr><td style="padding:4px 0;">Runen-Charm einzeln (24 €)</td><td style="text-align:right;font-weight:700;color:#4CAF50;">4,80 €</td></tr>
              <tr><td style="padding:4px 0;">Meditationskerze (17 €)</td><td style="text-align:right;font-weight:700;color:#4CAF50;">3,40 €</td></tr>
              <tr><td style="padding:4px 0;">Aura Reading (77 €)</td><td style="text-align:right;font-weight:700;color:#4CAF50;">15,40 €</td></tr>
              <tr><td style="padding:4px 0;">Runen-Armband (94 €)</td><td style="text-align:right;font-weight:700;color:#4CAF50;">18,80 €</td></tr>
              <tr><td style="padding:4px 0;">Deep Talk (ab 111 €)</td><td style="text-align:right;font-weight:700;color:#4CAF50;">ab 22,20 €</td></tr>
            </table>
          </td>
        </tr>
      </table>

      <p style="margin:0 0 12px;font-size:14px;color:#8B5E3C;line-height:22px;">
        <strong>Wichtig:</strong> Bitte hinterlege deine <strong>PayPal-E-Mail</strong> in der App unter \u201eGeben & Nehmen\u201c \u2192 \u201eDeine Zahlungsdaten\u201c, damit wir dir deine Provision auszahlen k\u00f6nnen. Es gibt <strong>keinen Mindestbetrag</strong> \u2013 jeder Cent wird ausgezahlt!
      </p>

      <p style="margin:0;font-size:14px;color:#A08070;font-style:italic;text-align:center;">
        \u201eTeile, was dir am Herzen liegt \u2013 und die F\u00fclle kommt zu dir zur\u00fcck.\u201c \ud83c\udf19\u2728
      </p>`;

    await transporter.sendMail({
      from: `"${config.fromName}" <${config.user}>`,
      to: params.toEmail,
      subject: `\ud83e\udd1d Willkommen bei \u201eGeben & Nehmen\u201c \u2013 Dein Empfehlungslink ist da, ${params.toName}!`,
      html: emailTemplate(content),
    });

    return { success: true };
  } catch (err: any) {
    console.error("[Email] Affiliate-Willkommen Fehler:", err);
    return { success: false, error: err.message || "Unbekannter Fehler" };
  }
}

export async function verifySmtpConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    return { success: true };
  } catch (err: any) {
    console.error("[Email] SMTP-Verbindung fehlgeschlagen:", err);
    return { success: false, error: err.message || "Verbindung fehlgeschlagen" };
  }
}
