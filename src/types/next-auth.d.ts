import type { Role } from "@/generated/prisma";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    role: Role;
    username: string;
    fullName: string;
    avatarUrl?: string | null;
    canManageLeads: boolean;
    canManageCourses: boolean;
    canManageUsers: boolean;
    canViewReports: boolean;
    canExportData: boolean;
  }

  interface Session {
    user: User & {
      id: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    username: string;
    fullName: string;
    avatarUrl?: string | null;
    canManageLeads: boolean;
    canManageCourses: boolean;
    canManageUsers: boolean;
    canViewReports: boolean;
    canExportData: boolean;
  }
}
