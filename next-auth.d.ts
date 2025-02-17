// types/next-auth.d.ts
/* eslint-disable @typescript-eslint/no-unused-vars */

import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";

// Menambahkan deklarasi untuk session dan JWT
declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Menambahkan properti 'id' pada session.user
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface JWT {
    id: string; // Menambahkan properti 'id' pada JWT token
    email?: string; // Menambahkan properti 'email' pada JWT token (optional)
  }
}
