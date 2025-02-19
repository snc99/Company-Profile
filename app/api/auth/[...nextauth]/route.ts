import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Setup Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Setup Rate Limiter (misal: 5 request per 1 menit)
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"), // 5 percobaan per 60 detik
  analytics: true,
});

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password wajib diisi");
        }

        // Ambil IP untuk rate limit
        const ip =
          req.headers?.["x-forwarded-for"]?.toString().split(",")[0] ??
          "unknown";

        // Cek rate limit
        const { success } = await ratelimit.limit(`login:${ip}`);
        if (!success) {
          throw new Error("Terlalu banyak percobaan. Coba lagi nanti.");
        }

        try {
          const user = await prisma.admin.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            throw new Error("Email tidak terdaftar");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Password salah");
          }

          return {
            id: user.id,
            name: user.nama,
            email: user.email,
          };
        } finally {
          await prisma.$disconnect();
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          name: session.user?.name || "",
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
