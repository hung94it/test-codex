import NextAuth from "next-auth";
import type { Session } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "./db";

export const authOptions = {
  adapter: PrismaAdapter(db),
  session: { strategy: "database" as const },
  providers: [
    EmailProvider({
      from: process.env.EMAIL_FROM,
      server: process.env.EMAIL_SERVER
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  pages: {
    signIn: "/auth/sign-in"
  },
  callbacks: {
    session({ session, user }: { session: Session; user: { id: string } }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    }
  }
};

export const { auth, handlers: authHandlers, signIn, signOut } = NextAuth(authOptions);
