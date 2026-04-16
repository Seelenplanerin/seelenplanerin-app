import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { sendWelcomeEmail, sendPasswordResetEmail, sendBroadcastEmail, sendAffiliateWelcomeEmail, sendAffiliateSaleNotification, sendAffiliateAdminNotification, sendAffiliatePayoutEmail, sendAcademyWaitlistEmail, verifySmtpConnection } from "./email";
import { storagePut } from "./storage";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  email: router({
    verifySmtp: publicProcedure.query(async () => {
      return verifySmtpConnection();
    }),

    sendWelcome: publicProcedure
      .input(z.object({
        toEmail: z.string().email(),
        toName: z.string().min(1),
        tempPassword: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        return sendWelcomeEmail(input);
      }),

    sendPasswordReset: publicProcedure
      .input(z.object({
        toEmail: z.string().email(),
        toName: z.string().min(1),
        tempPassword: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        return sendPasswordResetEmail(input);
      }),

    sendBroadcast: publicProcedure
      .input(z.object({
        subject: z.string().min(1),
        message: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        // Nur Community-Mitglieder mit E-Mail-Einwilligung laden (DSGVO-konform)
        const usersWithConsent = await db.getCommunityUsersWithEmailConsent();
        const recipients = usersWithConsent.map((u: any) => ({ email: u.email, name: u.name }));
        if (recipients.length === 0) {
          return { success: false, sent: 0, failed: 0, errors: ["Keine Mitglieder mit E-Mail-Einwilligung vorhanden."] };
        }
        return sendBroadcastEmail({ recipients, subject: input.subject, message: input.message });
      }),
  }),

  meditations: router({
    // Alle aktiven Meditationen laden (für Community-Screen)
    list: publicProcedure.query(async () => {
      return db.getActiveMeditations();
    }),

    // Alle Meditationen laden (für Admin)
    listAll: publicProcedure.query(async () => {
      return db.getAllMeditations();
    }),

    // Neue Meditation erstellen
    create: publicProcedure
      .input(z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        emoji: z.string().optional(),
        audioUrl: z.string().min(1),
        isPremium: z.number().default(1),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createMeditation({
          title: input.title,
          description: input.description || null,
          emoji: input.emoji || "🧘\u200d\u2640\ufe0f",
          audioUrl: input.audioUrl,
          isPremium: input.isPremium,
        });
        return { success: true, id };
      }),

    // Meditation löschen
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteMeditation(input.id);
        return { success: true };
      }),

    // Meditation aktualisieren
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        emoji: z.string().optional(),
        isPremium: z.number().optional(),
        isActive: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateMeditation(id, data);
        return { success: true };
      }),
  }),

  communityUsers: router({
    // Login: Nutzer per E-Mail finden
    login: publicProcedure
      .input(z.object({ email: z.string().email(), password: z.string().min(1) }))
      .mutation(async ({ input }) => {
        const user = await db.getCommunityUserByEmail(input.email);
        if (!user) return { success: false as const, error: "not_found" };
        if (user.password !== input.password) return { success: false as const, error: "wrong_password" };
        return { success: true as const, user: { email: user.email, name: user.name, mustChangePassword: user.mustChangePassword === 1 } };
      }),

    // Alle Nutzer laden (für Admin)
    list: publicProcedure.query(async () => {
      return db.getAllCommunityUsers();
    }),

    // Neuen Nutzer erstellen (Admin oder Registrierung)
    create: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(1),
        name: z.string().min(1),
        mustChangePassword: z.number().default(0),
      }))
      .mutation(async ({ input }) => {
        const existing = await db.getCommunityUserByEmail(input.email);
        if (existing) return { success: false as const, error: "exists" };
        const id = await db.createCommunityUser(input);
        return { success: true as const, id };
      }),

    // Nutzer aktualisieren (Passwort ändern etc.)
    update: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().optional(),
        name: z.string().optional(),
        mustChangePassword: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { email, ...data } = input;
        const updateData: Record<string, any> = {};
        if (data.password !== undefined) updateData.password = data.password;
        if (data.name !== undefined) updateData.name = data.name;
        if (data.mustChangePassword !== undefined) updateData.mustChangePassword = data.mustChangePassword;
        await db.updateCommunityUser(email, updateData);
        return { success: true };
      }),

    // Nutzer löschen
    delete: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        await db.deleteCommunityUser(input.email);
        return { success: true };
      }),

    // E-Mail-Einwilligung setzen/lesen
    updateEmailConsent: publicProcedure
      .input(z.object({
        email: z.string().email(),
        consent: z.boolean(),
      }))
      .mutation(async ({ input }) => {
        await db.updateCommunityUserEmailConsent(input.email, input.consent);
        return { success: true };
      }),

    getEmailConsent: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .query(async ({ input }) => {
        const user = await db.getCommunityUserByEmail(input.email);
        if (!user) return { consent: false, consentDate: null };
        return {
          consent: (user as any).emailConsent === 1,
          consentDate: (user as any).emailConsentDate || null,
        };
      }),
  }),

  // ── Affiliate-System ──
  affiliate: router({
    // Affiliate-Code für einen Nutzer erstellen oder abrufen
    // Login mit E-Mail + Passwort
    login: publicProcedure
      .input(z.object({ email: z.string().email(), password: z.string().min(1) }))
      .mutation(async ({ input }) => {
        const affiliate = await db.getAffiliateByEmail(input.email);
        if (!affiliate) return { success: false as const, error: "not_found" };
        if (!affiliate.password || affiliate.password !== input.password) {
          return { success: false as const, error: "wrong_password" };
        }
        return { success: true as const, affiliate };
      }),

    getOrCreate: publicProcedure
      .input(z.object({ email: z.string().email(), name: z.string().min(1), password: z.string().min(4).optional() }))
      .mutation(async ({ input }) => {
        let affiliate = await db.getAffiliateByEmail(input.email);
        if (affiliate) {
          // E-Mail existiert bereits - Nutzer soll sich einloggen
          return { success: false as const, error: "already_registered" };
        }
        // Code wird automatisch generiert (Admin vergibt den Code)
        let code = await db.generateAffiliateCode();
        let attempts = 0;
        while (await db.getAffiliateByCode(code) && attempts < 10) {
          code = await db.generateAffiliateCode();
          attempts++;
        }
        const id = await db.createAffiliate({ email: input.email, name: input.name, code });
        // Passwort speichern
        if (input.password) {
          await db.updateAffiliate(code, { password: input.password });
        }
        affiliate = await db.getAffiliateByEmail(input.email);
        // Willkommens-E-Mail an Affiliate senden
        const affiliateLink = `https://seelenplanerin-app.onrender.com/ref/${code}`;
        sendAffiliateWelcomeEmail({
          toEmail: input.email,
          toName: input.name,
          affiliateCode: code,
          affiliateLink,
        }).catch(err => console.error("[Affiliate] Willkommens-E-Mail Fehler:", err));
        // Admin-Benachrichtigung: Neuer Affiliate angemeldet
        sendAffiliateAdminNotification({
          affiliateName: input.name,
          affiliateEmail: input.email,
          affiliateCode: code,
        }).catch(err => console.error("[Affiliate] Admin-Benachrichtigung Fehler:", err));
        // Push-Nachricht an alle registrierten Geräte (Admin bekommt Push)
        (async () => {
          try {
            const tokens = await db.getAllActivePushTokens();
            if (tokens.length > 0) {
              const pushMessages = tokens.map((t: any) => ({
                to: t.token,
                sound: "default" as const,
                title: "Neue Affiliate-Anmeldung!",
                body: `${input.name} hat sich als Affiliate registriert. Code: ${code} – Bitte bei Tentary anlegen!`,
                data: { type: "affiliate_new", code, name: input.name, email: input.email },
              }));
              for (let i = 0; i < pushMessages.length; i += 100) {
                const chunk = pushMessages.slice(i, i + 100);
                await fetch("https://exp.host/--/api/v2/push/send", {
                  method: "POST",
                  headers: { "Accept": "application/json", "Content-Type": "application/json" },
                  body: JSON.stringify(chunk),
                });
              }
              console.log(`[Affiliate] Push-Nachricht an ${tokens.length} Geräte gesendet für neuen Affiliate: ${code}`);
            }
          } catch (pushErr) {
            console.error("[Affiliate] Push-Benachrichtigung Fehler:", pushErr);
          }
        })();
        return { success: true as const, affiliate };
      }),

    // Affiliate-Daten per Code abrufen
    getByCode: publicProcedure
      .input(z.object({ code: z.string().min(1) }))
      .query(async ({ input }) => {
        const affiliate = await db.getAffiliateByCode(input.code);
        return affiliate || null;
      }),

    // Affiliate-Daten per E-Mail abrufen
    getByEmail: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .query(async ({ input }) => {
        const affiliate = await db.getAffiliateByEmail(input.email);
        return affiliate || null;
      }),

    // Alle Affiliates laden (Admin)
    list: publicProcedure.query(async () => {
      return db.getAllAffiliates();
    }),

    // Klick tracken
    trackClick: publicProcedure
      .input(z.object({ code: z.string().min(1), ipHash: z.string().optional(), userAgent: z.string().optional() }))
      .mutation(async ({ input }) => {
        const affiliate = await db.getAffiliateByCode(input.code);
        if (!affiliate) return { success: false as const, error: "code_not_found" };
        await db.recordAffiliateClick(input.code, input.ipHash, input.userAgent);
        return { success: true as const };
      }),

    // Verkäufe eines Affiliates abrufen
    getSales: publicProcedure
      .input(z.object({ code: z.string().min(1) }))
      .query(async ({ input }) => {
        return db.getAffiliateSales(input.code);
      }),

    // Alle Verkäufe (Admin)
    listAllSales: publicProcedure.query(async () => {
      return db.getAllAffiliateSales();
    }),

    // Verkauf eintragen (Admin)
    createSale: publicProcedure
      .input(z.object({
        affiliateCode: z.string().min(1),
        productName: z.string().min(1),
        saleAmount: z.number().min(1), // in Cent
        customerEmail: z.string().optional(),
        customerName: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const affiliate = await db.getAffiliateByCode(input.affiliateCode);
        if (!affiliate) return { success: false as const, error: "code_not_found" };
        const commissionAmount = Math.round(input.saleAmount * 0.20);
        const id = await db.createAffiliateSale({
          affiliateCode: input.affiliateCode,
          productName: input.productName,
          saleAmount: input.saleAmount,
          commissionAmount,
          customerEmail: input.customerEmail,
          customerName: input.customerName,
          notes: input.notes,
        });
        // E-Mail-Benachrichtigung an Affiliate senden (async, nicht blockierend)
        sendAffiliateSaleNotification({
          toEmail: affiliate.email,
          toName: affiliate.name,
          product: input.productName,
          amount: (input.saleAmount / 100).toFixed(2).replace(".", ","),
          commission: (commissionAmount / 100).toFixed(2).replace(".", ","),
          affiliateCode: input.affiliateCode,
          customerName: input.customerName || "Unbekannt",
        }).catch(err => console.error("[Affiliate] Verkaufs-E-Mail Fehler:", err));
        return { success: true as const, id, commissionAmount };
      }),

    // Verkaufsstatus ändern (Admin)
    updateSaleStatus: publicProcedure
      .input(z.object({ id: z.number(), status: z.string().min(1) }))
      .mutation(async ({ input }) => {
        await db.updateAffiliateSaleStatus(input.id, input.status);
        return { success: true };
      }),

    // Auszahlung erstellen (Admin)
    createPayout: publicProcedure
      .input(z.object({
        affiliateCode: z.string().min(1),
        amount: z.number().min(1), // in Cent
        method: z.string().default("paypal"),
        reference: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createAffiliatePayout(input);
        // Auszahlungs-E-Mail an Affiliate senden
        const affiliate = await db.getAffiliateByCode(input.affiliateCode);
        if (affiliate) {
          sendAffiliatePayoutEmail({
            toEmail: affiliate.email,
            toName: affiliate.name,
            amount: (input.amount / 100).toFixed(2).replace(".", ","),
            method: input.method,
            reference: input.reference,
          }).catch(err => console.error("[Affiliate] Auszahlungs-E-Mail Fehler:", err));
        }
        return { success: true as const, id };
      }),

    // Auszahlungen eines Affiliates
    getPayouts: publicProcedure
      .input(z.object({ code: z.string().min(1) }))
      .query(async ({ input }) => {
        return db.getAffiliatePayouts(input.code);
      }),

    // Alle Auszahlungen (Admin)
    listAllPayouts: publicProcedure.query(async () => {
      return db.getAllAffiliatePayouts();
    }),

    // Affiliate aktivieren/deaktivieren (Admin)
    toggleActive: publicProcedure
      .input(z.object({ code: z.string().min(1), isActive: z.number() }))
      .mutation(async ({ input }) => {
        await db.updateAffiliate(input.code, { isActive: input.isActive });
        return { success: true };
      }),

    // Passwort vergessen: neues temporäres Passwort per E-Mail senden
    resetPassword: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        const affiliate = await db.getAffiliateByEmail(input.email);
        if (!affiliate) return { success: false as const, error: "not_found" };
        // Generiere ein neues temporäres Passwort (6 Zeichen)
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        let tempPw = "";
        for (let i = 0; i < 6; i++) tempPw += chars[Math.floor(Math.random() * chars.length)];
        // Passwort in DB speichern
        await db.updateAffiliate(affiliate.code, { password: tempPw });
        // E-Mail mit neuem Passwort senden
        try {
          const { sendPasswordResetEmail: sendReset } = await import("./email");
          await sendReset({
            toEmail: affiliate.email,
            toName: affiliate.name,
            tempPassword: tempPw,
          });
        } catch (emailErr) {
          console.error("[Affiliate] Reset-E-Mail Fehler:", emailErr);
          return { success: false as const, error: "email_failed" };
        }
        return { success: true as const };
      }),

    // Passwort ändern (eingeloggt, mit altem Passwort bestätigen)
    changePassword: publicProcedure
      .input(z.object({
        code: z.string().min(1),
        oldPassword: z.string().min(1),
        newPassword: z.string().min(4),
      }))
      .mutation(async ({ input }) => {
        const affiliate = await db.getAffiliateByCode(input.code);
        if (!affiliate) return { success: false as const, error: "not_found" };
        if (!affiliate.password || affiliate.password !== input.oldPassword) {
          return { success: false as const, error: "wrong_password" };
        }
        if (input.newPassword.length < 4) {
          return { success: false as const, error: "too_short" };
        }
        await db.updateAffiliate(input.code, { password: input.newPassword });
        return { success: true as const };
      }),

    // Affiliate-Zahlungsdaten aktualisieren
    updatePaymentInfo: publicProcedure
      .input(z.object({
        code: z.string().min(1),
        paypalEmail: z.string().optional(),
        iban: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const updateData: Record<string, any> = {};
        if (input.paypalEmail !== undefined) updateData.paypalEmail = input.paypalEmail;
        if (input.iban !== undefined) updateData.iban = input.iban;
        await db.updateAffiliate(input.code, updateData);
        return { success: true };
      }),
  }),

  // ── Push-Benachrichtigungen ──
  push: router({
    // Token registrieren (wird beim App-Start aufgerufen)
    registerToken: publicProcedure
      .input(z.object({
        token: z.string().min(1),
        platform: z.string().optional(),
        communityEmail: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          await db.registerPushToken(input);
          return { success: true };
        } catch (e: any) {
          return { success: false, error: e.message };
        }
      }),

    // Anzahl registrierter Geräte
    tokenCount: publicProcedure.query(async () => {
      return db.getPushTokenCount();
    }),

    // Push-Nachricht an alle senden (Admin)
    sendToAll: publicProcedure
      .input(z.object({
        title: z.string().min(1),
        body: z.string().min(1),
        data: z.string().optional(), // JSON-String
      }))
      .mutation(async ({ input }) => {
        const tokens = await db.getAllActivePushTokens();
        if (tokens.length === 0) {
          return { success: false, sent: 0, failed: 0, error: "Keine registrierten Geräte vorhanden." };
        }

        // Nachricht in Historie speichern
        const messageId = await db.createPushMessage({
          title: input.title,
          body: input.body,
          data: input.data || null,
          sentTo: tokens.length,
        });

        // Expo Push API aufrufen
        const messages = tokens.map((t: any) => ({
          to: t.token,
          sound: "default" as const,
          title: input.title,
          body: input.body,
          data: input.data ? JSON.parse(input.data) : undefined,
        }));

        // In Chunks von 100 senden (Expo-Limit)
        let sentSuccess = 0;
        let sentFailed = 0;
        const invalidTokens: string[] = [];

        for (let i = 0; i < messages.length; i += 100) {
          const chunk = messages.slice(i, i + 100);
          try {
            const response = await fetch("https://exp.host/--/api/v2/push/send", {
              method: "POST",
              headers: {
                "Accept": "application/json",
                "Accept-encoding": "gzip, deflate",
                "Content-Type": "application/json",
              },
              body: JSON.stringify(chunk),
            });
            const result = await response.json();
            if (result.data) {
              for (const ticket of result.data) {
                if (ticket.status === "ok") {
                  sentSuccess++;
                } else {
                  sentFailed++;
                  // Token deaktivieren wenn ungültig
                  if (ticket.details?.error === "DeviceNotRegistered") {
                    const idx = result.data.indexOf(ticket);
                    if (chunk[idx]) invalidTokens.push(chunk[idx].to);
                  }
                }
              }
            }
          } catch (e) {
            sentFailed += chunk.length;
          }
        }

        // Ungültige Tokens deaktivieren
        for (const token of invalidTokens) {
          await db.deactivatePushToken(token);
        }

        // Historie aktualisieren
        await db.updatePushMessage(messageId, { sentSuccess, sentFailed });

        return { success: true, sent: sentSuccess, failed: sentFailed, total: tokens.length };
      }),

    // Nachrichten-Historie (Admin)
    history: publicProcedure.query(async () => {
      return db.getPushMessageHistory();
    }),
  }),

  academy: router({
    joinWaitlist: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        try {
          const email = input.email.trim().toLowerCase();
          await db.addAcademyWaitlist(email);
          // Send confirmation email
          try {
            await sendAcademyWaitlistEmail(email);
          } catch (e) { console.error("Academy email failed:", e); }
          return { success: true };
        } catch (e: any) {
          if (e.message?.includes("duplicate") || e.code === "23505") {
            return { success: true, message: "Bereits eingetragen" };
          }
          throw e;
        }
      }),
    listWaitlist: publicProcedure.query(async () => {
      return db.getAcademyWaitlist();
    }),
  }),
  storage: router({
    uploadAudio: publicProcedure
      .input(z.object({
        fileName: z.string().min(1),
        base64Data: z.string().min(1),
        contentType: z.string().default("audio/mpeg"),
      }))
      .mutation(async ({ input }) => {
        try {
          const buffer = Buffer.from(input.base64Data, "base64");
          const randomSuffix = Math.random().toString(36).slice(2, 8);
          const safeFileName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
          const fileKey = `audio/${safeFileName}-${randomSuffix}.mp3`;
          const result = await storagePut(fileKey, buffer, input.contentType);
          return { success: true as const, url: result.url, key: result.key };
        } catch (err: any) {
          return { success: false as const, error: err.message || "Upload fehlgeschlagen" };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
