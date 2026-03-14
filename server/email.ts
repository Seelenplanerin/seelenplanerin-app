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
      <h2 style="margin:0 0 16px;font-size:20px;color:#5C3317;">Willkommen bei „Geben & Nehmen“, ${params.toName}! \ud83e\udd1d</h2>
      <p style="margin:0 0 16px;font-size:15px;color:#8B5E3C;line-height:24px;">
        Wie wunderschön, dass du dich entschieden hast, Teil unseres Empfehlungsprogramms zu werden! Du bist jetzt offiziell Botschafterin der Seelenplanerin – und verdienst <strong>20% Provision</strong> auf jeden Verkauf über deinen persönlichen Link (nur auf den Produktpreis, nicht auf Versandkosten).
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF3E7;border-radius:16px;border:1px solid #E8D5B0;margin:0 0 20px;">
        <tr>
          <td style="padding:20px;text-align:center;">
            <p style="margin:0 0 8px;font-size:13px;color:#A08070;font-weight:600;">Dein persönlicher Empfehlungscode</p>
            <p style="margin:0 0 16px;font-size:28px;color:#C9A96E;font-weight:700;letter-spacing:3px;">${params.affiliateCode}</p>
            <p style="margin:0 0 8px;font-size:13px;color:#A08070;">Der Käufer gibt diesen Code bei der Bestellung auf Tentary im Gutscheinfeld ein.</p>
            <p style="margin:0;font-size:12px;color:#A08070;">Dein Link: <a href=\"${params.affiliateLink}\" style=\"color:#C4826A;\">${params.affiliateLink}</a></p>
          </td>
        </tr>
      </table>

      <p style="margin:0 0 12px;font-size:15px;color:#5C3317;font-weight:700;">So funktioniert’s – in 3 Schritten:</p>

      <ol style="margin:0 0 20px;padding-left:20px;font-size:14px;color:#8B5E3C;line-height:26px;">
        <li><strong>Teile deinen Code</strong> – per WhatsApp, Instagram, Facebook oder persönlich</li>
        <li><strong>Der Käufer gibt deinen Code bei der Bestellung ein</strong> – egal ob Armband, Kerze, Aura Reading, Soul Talk oder Seelenimpuls</li>
        <li><strong>Du erhältst 20% Provision</strong> – sobald die Zahlung positiv eingegangen ist</li>
      </ol>

      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9EDE8;border-radius:16px;border:1px solid #EDD9D0;margin:0 0 20px;">
        <tr>
          <td style="padding:16px;">
            <p style="margin:0 0 8px;font-size:14px;color:#5C3317;font-weight:700;">Beispiele – was du verdienen kannst:</p>
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
        <strong>Wichtig:</strong> Bitte hinterlege deine <strong>PayPal-E-Mail</strong> in der App unter „Geben & Nehmen“ → „Deine Zahlungsdaten“, damit wir dir deine Provision auszahlen können. Es gibt <strong>keinen Mindestbetrag</strong> – jeder Cent wird ausgezahlt!
      </p>

      <p style="margin:0;font-size:14px;color:#A08070;font-style:italic;text-align:center;">
        „Teile, was dir am Herzen liegt – und die Fülle kommt zu dir zurück.“ \ud83c\udf19✨
      </p>`;

    await transporter.sendMail({
      from: `"${config.fromName}" <${config.user}>`,
      to: params.toEmail,
      subject: `\ud83e\udd1d Willkommen bei „Geben & Nehmen“ – Dein Empfehlungslink ist da, ${params.toName}!`,
      html: emailTemplate(content),
    });

    return { success: true };
  } catch (err: any) {
    console.error("[Email] Affiliate-Willkommen Fehler:", err);
    return { success: false, error: err.message || "Unbekannter Fehler" };
  }
}

export async function sendAffiliateSaleNotification(params: {
  toEmail: string;
  toName: string;
  product: string;
  amount: string;
  commission: string;
  affiliateCode: string;
  customerName: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const config = getSmtpConfig();
    const transporter = createTransporter();

    const content = `
      <h2 style="margin:0 0 16px;font-size:20px;color:#5C3317;">Neuer Verkauf über deinen Link! 🎉</h2>
      <p style="margin:0 0 16px;font-size:15px;color:#8B5E3C;line-height:24px;">
        Hallo ${params.toName}, großartige Neuigkeiten! Es wurde gerade ein Verkauf über deinen Empfehlungslink getätigt.
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0FFF0;border-radius:16px;border:1px solid #C8E6C9;margin:0 0 20px;">
        <tr>
          <td style="padding:20px;">
            <table width="100%" style="font-size:14px;color:#5C3317;">
              <tr><td style="padding:6px 0;font-weight:600;">Produkt:</td><td style="text-align:right;">${params.product}</td></tr>
              <tr><td style="padding:6px 0;font-weight:600;">Verkaufsbetrag:</td><td style="text-align:right;">${params.amount} €</td></tr>
              <tr><td style="padding:6px 0;font-weight:600;">Käufer:</td><td style="text-align:right;">${params.customerName}</td></tr>
              <tr style="border-top:1px solid #C8E6C9;"><td style="padding:10px 0 6px;font-weight:700;font-size:16px;color:#4CAF50;">Deine Provision (20%):</td><td style="text-align:right;font-weight:700;font-size:16px;color:#4CAF50;">${params.commission} €</td></tr>
            </table>
          </td>
        </tr>
      </table>

      <p style="margin:0 0 12px;font-size:14px;color:#8B5E3C;line-height:22px;">
        Die Provision wird dir ausgezahlt, sobald die Zahlung positiv eingegangen ist. Du kannst deinen aktuellen Stand jederzeit in der App unter <strong>„Geben & Nehmen“</strong> einsehen.
      </p>

      <p style="margin:0 0 12px;font-size:14px;color:#8B5E3C;line-height:22px;">
        <strong>Dein Affiliate-Code:</strong> ${params.affiliateCode}
      </p>

      <p style="margin:0;font-size:14px;color:#A08070;font-style:italic;text-align:center;">
        Weiter so – du baust dir etwas Wunderschönes auf! 🌙✨
      </p>`;

    await transporter.sendMail({
      from: `"${config.fromName}" <${config.user}>`,
      to: params.toEmail,
      subject: `🎉 Neuer Verkauf! Du hast ${params.commission} € Provision verdient, ${params.toName}!`,
      html: emailTemplate(content),
    });

    return { success: true };
  } catch (err: any) {
    console.error("[Email] Affiliate-Sale-Benachrichtigung Fehler:", err);
    return { success: false, error: err.message || "Unbekannter Fehler" };
  }
}

export async function sendAcademyWaitlistEmail(email: string) {
  try {
    const config = getSmtpConfig();
    const transporter = createTransporter();
    const content = `
      <div style="text-align:center;margin-bottom:20px;">
        <span style="font-size:48px;">🎓</span>
      </div>
      <h1 style="color:#C9A96E;text-align:center;font-size:24px;">Seelen Academy – Du bist dabei!</h1>
      <p style="text-align:center;color:#666;font-size:16px;line-height:1.6;">
        Liebe Seele,<br><br>
        vielen Dank, dass du dich für die <strong>Seelen Academy</strong> interessierst!
        Du bist jetzt auf der Warteliste und wirst als Erste erfahren, wenn die Ausbildungen starten.
      </p>
      <div style="background:#FDF8F4;border-radius:12px;padding:20px;margin:20px 0;">
        <h3 style="color:#3D2314;margin-bottom:12px;">Geplante Ausbildungen:</h3>
        <p style="color:#666;margin:8px 0;">👁️ <strong>Aura Reading Ausbildung</strong> – Coming Soon</p>
        <p style="color:#666;margin:8px 0;">🌀 <strong>Theta Healing Ausbildung</strong> – Coming Soon</p>
      </div>
      <p style="text-align:center;color:#666;font-size:14px;line-height:1.6;">
        Ich freue mich riesig, dass du diesen Weg mit mir gehen möchtest.
        Sobald es Neuigkeiten gibt, melde ich mich bei dir!<br><br>
        Von Herzen,<br>
        <strong>Lara – Die Seelenplanerin</strong> ✨
      </p>
    `;
    await transporter.sendMail({
      from: `"${config.fromName}" <${config.user}>`,
      to: email,
      subject: "🎓 Seelen Academy – Du bist auf der Warteliste!",
      html: emailTemplate(content),
    });
    return { success: true };
  } catch (err: any) {
    console.error("[Email] Academy-Warteliste Fehler:", err);
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

export async function sendAffiliateAdminNotification(params: {
  affiliateName: string;
  affiliateEmail: string;
  affiliateCode: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const config = getSmtpConfig();
    const transporter = createTransporter();

    const content = `
      <h2 style="margin:0 0 16px;font-size:20px;color:#5C3317;">Neue Affiliate-Anmeldung! 🤝</h2>
      <p style="margin:0 0 16px;font-size:15px;color:#8B5E3C;line-height:24px;">
        Es hat sich eine neue Person für das Empfehlungsprogramm „Geben & Nehmen" angemeldet.
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF3E7;border-radius:16px;border:1px solid #E8D5B0;margin:0 0 20px;">
        <tr>
          <td style="padding:20px;">
            <table width="100%" style="font-size:14px;color:#5C3317;">
              <tr><td style="padding:6px 0;font-weight:600;">Name:</td><td style="text-align:right;">${params.affiliateName}</td></tr>
              <tr><td style="padding:6px 0;font-weight:600;">E-Mail:</td><td style="text-align:right;">${params.affiliateEmail}</td></tr>
              <tr><td style="padding:6px 0;font-weight:600;">Zugewiesener Code:</td><td style="text-align:right;font-weight:700;font-size:18px;color:#C9A96E;letter-spacing:2px;">${params.affiliateCode}</td></tr>
            </table>
          </td>
        </tr>
      </table>

      <div style="background-color:#FFF3E0;border-radius:12px;padding:16px;border:1px solid #FFE0B2;margin:0 0 16px;">
        <p style="margin:0;font-size:14px;color:#E65100;font-weight:700;">⚠️ Nächster Schritt:</p>
        <p style="margin:8px 0 0;font-size:14px;color:#8B5E3C;line-height:22px;">
          Bitte lege den Gutscheincode <strong style="color:#C9A96E;">${params.affiliateCode}</strong> auf Tentary an, damit Käufer ihn bei der Bestellung eingeben können.
        </p>
      </div>`;

    await transporter.sendMail({
      from: `"${config.fromName}" <${config.user}>`,
      to: config.user, // An Admin (= SMTP-User)
      subject: `🤝 Neue Affiliate-Anmeldung: ${params.affiliateName} (Code: ${params.affiliateCode})`,
      html: emailTemplate(content),
    });

    return { success: true };
  } catch (err: any) {
    console.error("[Email] Affiliate-Admin-Benachrichtigung Fehler:", err);
    return { success: false, error: err.message || "Unbekannter Fehler" };
  }
}

export async function sendAffiliatePayoutEmail(params: {
  toEmail: string;
  toName: string;
  amount: string;
  method: string;
  reference?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const config = getSmtpConfig();
    const transporter = createTransporter();

    const content = `
      <h2 style="margin:0 0 16px;font-size:20px;color:#5C3317;">Deine Provision wurde ausgezahlt! 💸</h2>
      <p style="margin:0 0 16px;font-size:15px;color:#8B5E3C;line-height:24px;">
        Hallo ${params.toName}, wir haben dir soeben deine Provision überwiesen!
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#E8F5E9;border-radius:16px;border:1px solid #C8E6C9;margin:0 0 20px;">
        <tr>
          <td style="padding:20px;">
            <table width="100%" style="font-size:14px;color:#5C3317;">
              <tr><td style="padding:6px 0;font-weight:600;">Betrag:</td><td style="text-align:right;font-weight:700;font-size:18px;color:#4CAF50;">${params.amount} €</td></tr>
              <tr><td style="padding:6px 0;font-weight:600;">Methode:</td><td style="text-align:right;">PayPal</td></tr>
              ${params.reference ? `<tr><td style="padding:6px 0;font-weight:600;">Referenz:</td><td style="text-align:right;">${params.reference}</td></tr>` : ""}
            </table>
          </td>
        </tr>
      </table>

      <p style="margin:0 0 12px;font-size:14px;color:#8B5E3C;line-height:22px;">
        Bitte prüfe dein PayPal-Konto – der Betrag sollte in Kürze dort eingehen. Falls du Fragen hast, melde dich gerne bei uns.
      </p>

      <p style="margin:0;font-size:14px;color:#A08070;font-style:italic;text-align:center;">
        Danke, dass du Die Seelenplanerin weiterempfiehlst! 🌸✨
      </p>`;

    await transporter.sendMail({
      from: `"${config.fromName}" <${config.user}>`,
      to: params.toEmail,
      subject: `💸 Auszahlung: ${params.amount} € wurden an dich überwiesen, ${params.toName}!`,
      html: emailTemplate(content),
    });

    return { success: true };
  } catch (err: any) {
    console.error("[Email] Affiliate-Auszahlungs-E-Mail Fehler:", err);
    return { success: false, error: err.message || "Unbekannter Fehler" };
  }
}
