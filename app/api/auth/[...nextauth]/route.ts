import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.admin.findUnique({
          where: { email: credentials?.email },
        });

        if (!user) {
          throw new Error("Email tidak terdaftar");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials!.password,
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
      },
    }),
  ],
  pages: {
    signIn: "/auth/login", // Custom halaman login
  },
  session: {
    strategy: "jwt", // Menggunakan JWT untuk session
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Menyertakan 'id' pada token JWT
        token.email = user.email; // Menyertakan 'email' jika perlu
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string, // Pastikan 'id' ada di session
          email: token.email as string, // Pastikan 'email' ada di session
          name: session.user?.name || "",
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Gunakan secret untuk signing token
});

// Ekspor handler untuk menangani request GET dan POST
export { handler as GET, handler as POST };
