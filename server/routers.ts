import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { sendWelcomeEmail, sendPasswordResetEmail, verifySmtpConnection } from "./email";

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
});

export type AppRouter = typeof appRouter;
