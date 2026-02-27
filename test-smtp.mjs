// SMTP-Test für IONOS
import nodemailer from 'nodemailer';

const host = process.env.SMTP_HOST || 'smtp.ionos.de';
const port = parseInt(process.env.SMTP_PORT || '587');
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.SMTP_FROM || user;

if (!user || !pass) {
  console.error('❌ SMTP_USER oder SMTP_PASS nicht gesetzt!');
  process.exit(1);
}

console.log(`🔍 Teste SMTP-Verbindung zu ${host}:${port} mit ${user}...`);

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: false,
  auth: { user, pass },
  tls: { rejectUnauthorized: false }
});

try {
  await transporter.verify();
  console.log('✅ SMTP-Verbindung erfolgreich!');
  process.exit(0);
} catch (err) {
  console.error('❌ SMTP-Fehler:', err.message);
  process.exit(1);
}
