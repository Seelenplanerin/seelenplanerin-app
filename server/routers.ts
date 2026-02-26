import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { sendWelcomeEmail, sendPasswordResetEmail, verifySmtpConnection } from "./email";
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
