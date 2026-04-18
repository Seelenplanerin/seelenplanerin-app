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
                  Öffne die <strong>Seelenplanerin-App</strong> für mehr Inhalte ✨
                </p>
              </td>
            </tr>
          </table>
          <p style="margin:0;font-size:13px;color:#A08070;text-align:center;font-style:italic;">
            "Vertraue deinem Weg – die Sterne begleiten dich." \u{1F319}
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


// ── Seelenjournal Benachrichtigungen ──

export async function sendSeelenjournalMessageNotification(params: {
  toEmail: string;
  toName: string;
  messagePreview: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const config = getSmtpConfig();
    const transporter = createTransporter();

    const content = `
      <h2 style="margin:0 0 16px;font-size:20px;color:#5C3317;">
        Neue Nachricht für dich, ${params.toName} 💌
      </h2>
      <p style="margin:0 0 20px;font-size:15px;color:#5C3317;line-height:1.6;">
        Du hast eine neue persönliche Nachricht von der Seelenplanerin erhalten:
      </p>
      <div style="background-color:#F9EDE8;border-radius:16px;padding:20px;margin:0 0 24px;">
        <p style="margin:0;font-size:15px;color:#5C3317;line-height:1.6;font-style:italic;">
          „${params.messagePreview.length > 200 ? params.messagePreview.substring(0, 200) + "..." : params.messagePreview}"
        </p>
      </div>
      <p style="margin:0 0 20px;font-size:14px;color:#A08070;">
        Öffne dein Seelenjournal, um die vollständige Nachricht zu lesen und zu antworten.
      </p>
      <div style="text-align:center;margin:24px 0;">
        <a href="https://seelenplanerin-app.onrender.com/seelenjournal-login" 
           style="display:inline-block;background-color:#C4897B;color:#FFFFFF;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:600;font-size:15px;">
          Zum Seelenjournal →
        </a>
      </div>
    `;

    await transporter.sendMail({
      from: `"${config.fromName}" <${config.user}>`,
      to: params.toEmail,
      subject: `💌 Neue Nachricht von der Seelenplanerin, ${params.toName}!`,
      html: emailTemplate(content),
    });

    return { success: true };
  } catch (err: any) {
    console.error("[Email] Seelenjournal-Nachricht Fehler:", err);
    return { success: false, error: err.message || "Unbekannter Fehler" };
  }
}

export async function sendSeelenjournalEntryNotification(params: {
  toEmail: string;
  toName: string;
  entryTitle: string;
  entryCategory?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const config = getSmtpConfig();
    const transporter = createTransporter();

    const categoryBadge = params.entryCategory
      ? `<span style="display:inline-block;background-color:#E8F0E8;color:#5C6B5C;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;margin-bottom:12px;">${params.entryCategory}</span><br>`
      : "";

    const content = `
      <h2 style="margin:0 0 16px;font-size:20px;color:#5C3317;">
        Neuer Eintrag in deinem Seelenjournal ✨
      </h2>
      <p style="margin:0 0 20px;font-size:15px;color:#5C3317;line-height:1.6;">
        Liebe ${params.toName}, es gibt etwas Neues für dich in deinem persönlichen Seelenjournal:
      </p>
      <div style="background-color:#F9EDE8;border-radius:16px;padding:20px;margin:0 0 24px;text-align:center;">
        ${categoryBadge}
        <p style="margin:0;font-size:18px;color:#5C3317;font-weight:700;">
          ${params.entryTitle}
        </p>
      </div>
      <p style="margin:0 0 20px;font-size:14px;color:#A08070;">
        Logge dich in dein Seelenjournal ein, um den vollständigen Eintrag zu lesen.
      </p>
      <div style="text-align:center;margin:24px 0;">
        <a href="https://seelenplanerin-app.onrender.com/seelenjournal-login" 
           style="display:inline-block;background-color:#C4897B;color:#FFFFFF;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:600;font-size:15px;">
          Zum Seelenjournal →
        </a>
      </div>
    `;

    await transporter.sendMail({
      from: `"${config.fromName}" <${config.user}>`,
      to: params.toEmail,
      subject: `✨ Neuer Eintrag: ${params.entryTitle} – Dein Seelenjournal`,
      html: emailTemplate(content),
    });

    return { success: true };
  } catch (err: any) {
    console.error("[Email] Seelenjournal-Eintrag Fehler:", err);
    return { success: false, error: err.message || "Unbekannter Fehler" };
  }
}


// ── Academy Warteliste ──

export async function sendAcademyWaitlistEmail(params: {
  toEmail: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const config = getSmtpConfig();
    const transporter = createTransporter();

    const content = `
      <h2 style="margin:0 0 16px;font-size:20px;color:#5C3317;">
        Du bist auf der Warteliste! 🎓
      </h2>
      <p style="margin:0 0 16px;color:#5C3317;line-height:1.7;">
        Vielen Dank für dein Interesse an der <strong>Seelen Academy</strong>!
        Du wirst benachrichtigt, sobald die Anmeldung startet.
      </p>
      <p style="margin:0;color:#A08070;font-size:13px;">
        Alles Liebe, Die Seelenplanerin ✨
      </p>
    `;

    await transporter.sendMail({
      from: `"Die Seelenplanerin" <${config.user}>`,
      to: params.toEmail,
      subject: "🎓 Du bist auf der Warteliste – Seelen Academy",
      html: emailTemplate(content),
    });

    return { success: true };
  } catch (err: any) {
    console.error("[Email] Academy-Warteliste Fehler:", err);
    return { success: false, error: err.message || "Unbekannter Fehler" };
  }
}

// ── Academy Warteliste – Benachrichtigung an Lara ──

export async function sendAcademyNotificationToOwner(params: {
  subscriberEmail: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const config = getSmtpConfig();
    const transporter = createTransporter();
    const ownerEmail = "hallo@seelenplanerin.de";
    const now = new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" });

    const content = `
      <h2 style="margin:0 0 16px;font-size:20px;color:#5C3317;">
        Neue Anmeldung für die Seelen Academy! 🎓
      </h2>
      <p style="margin:0 0 16px;color:#5C3317;line-height:1.7;">
        Jemand hat sich auf die <strong>Warteliste der Seelen Academy</strong> eingetragen:
      </p>
      <table style="margin:0 0 16px;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 16px;background:#F5EDE8;color:#5C3317;font-weight:bold;border-radius:8px 0 0 0;">E-Mail</td>
          <td style="padding:8px 16px;background:#FDF8F4;color:#5C3317;border-radius:0 8px 0 0;">${params.subscriberEmail}</td>
        </tr>
        <tr>
          <td style="padding:8px 16px;background:#F5EDE8;color:#5C3317;font-weight:bold;border-radius:0 0 0 8px;">Datum</td>
          <td style="padding:8px 16px;background:#FDF8F4;color:#5C3317;border-radius:0 0 8px 0;">${now}</td>
        </tr>
      </table>
      <p style="margin:0;color:#A08070;font-size:13px;">
        Diese Nachricht wurde automatisch von deiner Seelenplanerin App gesendet.
      </p>
    `;

    await transporter.sendMail({
      from: `"Die Seelenplanerin App" <${config.user}>`,
      to: ownerEmail,
      subject: `🎓 Neue Academy-Anmeldung: ${params.subscriberEmail}`,
      html: emailTemplate(content),
    });

    console.log(`[Email] Academy-Benachrichtigung an ${ownerEmail} gesendet für ${params.subscriberEmail}`);
    return { success: true };
  } catch (err: any) {
    console.error("[Email] Academy-Benachrichtigung Fehler:", err);
    return { success: false, error: err.message || "Unbekannter Fehler" };
  }
}

// ── SMTP Verbindungstest ──

export async function verifySmtpConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "SMTP-Verbindung fehlgeschlagen" };
  }
}
