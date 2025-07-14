/* eslint-disable @typescript-eslint/no-explicit-any */
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { generateRandomUsername } from "@/lib/username-generator"

export const authOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await db.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/sign-in",
    signUp: "/sign-up",
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id
      }
      return session
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl + "/dashboard"
    },
  },
  events: {
    async createUser({ user }: { user: any }) {
      // Generate username for new users if they don't have one
      if (!user.username) {
        let username = generateRandomUsername();
        let isUnique = false;
        let attempts = 0;
        
        while (!isUnique && attempts < 10) {
          const existingUser = await db.user.findUnique({
            where: { username },
          });
          
          if (!existingUser) {
            isUnique = true;
          } else {
            username = generateRandomUsername();
            attempts++;
          }
        }

        if (isUnique) {
          await db.user.update({
            where: { id: user.id },
            data: { username },
          });
        }
      }
    },
  },
}