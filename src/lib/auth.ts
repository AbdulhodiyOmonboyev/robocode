import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authConfig } from "./auth.config";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { username, password } = parsed.data;

        const user = await db.user.findUnique({
          where: { username },
          select: {
            id: true, fullName: true, username: true, email: true,
            passwordHash: true, role: true, isActive: true,
            canManageLeads: true, canManageCourses: true,
            canManageUsers: true, canViewReports: true, canExportData: true,
          },
        });

        if (!user || !user.isActive) return null;

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) return null;

        await db.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          name: user.fullName,
          email: user.email,
          role: user.role,
          username: user.username,
          fullName: user.fullName,
          canManageLeads: user.canManageLeads,
          canManageCourses: user.canManageCourses,
          canManageUsers: user.canManageUsers,
          canViewReports: user.canViewReports,
          canExportData: user.canExportData,
        };
      },
    }),
  ],
});
