import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { sendWelcomeEmail, sendPasswordResetEmail, sendBroadcastEmail, sendAffiliateWelcomeEmail, verifySmtpConnection } from "./email";
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
        // Alle Community-Mitglieder laden
        const users = await db.getAllCommunityUsers();
        const recipients = users.map((u: any) => ({ email: u.email, name: u.name }));
        if (recipients.length === 0) {
          return { success: false, sent: 0, failed: 0, errors: ["Keine Mitglieder vorhanden."] };
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
  }),

  // ── Affiliate-System ──
  affiliate: router({
    // Affiliate-Code für einen Nutzer erstellen oder abrufen
    getOrCreate: publicProcedure
      .input(z.object({ email: z.string().email(), name: z.string().min(1) }))
      .mutation(async ({ input }) => {
        let affiliate = await db.getAffiliateByEmail(input.email);
        if (affiliate) return { success: true as const, affiliate };
        // Neuen Code generieren (einzigartig)
        let code = await db.generateAffiliateCode();
        let attempts = 0;
        while (await db.getAffiliateByCode(code) && attempts < 10) {
          code = await db.generateAffiliateCode();
          attempts++;
        }
        const id = await db.createAffiliate({ email: input.email, name: input.name, code });
        affiliate = await db.getAffiliateByEmail(input.email);
        // Willkommens-E-Mail senden (async, nicht blockierend)
        const affiliateLink = `https://seelenplanerin-app.onrender.com/ref/${code}`;
        sendAffiliateWelcomeEmail({
          toEmail: input.email,
          toName: input.name,
          affiliateCode: code,
          affiliateLink,
        }).catch(err => console.error("[Affiliate] Willkommens-E-Mail Fehler:", err));
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
        const commissionAmount = Math.round(input.saleAmount * 0.15);
        const id = await db.createAffiliateSale({
          affiliateCode: input.affiliateCode,
          productName: input.productName,
          saleAmount: input.saleAmount,
          commissionAmount,
          customerEmail: input.customerEmail,
          customerName: input.customerName,
          notes: input.notes,
        });
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
