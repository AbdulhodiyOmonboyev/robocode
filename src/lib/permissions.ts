import { Role } from "@/generated/prisma/client";
import type { Session } from "next-auth";

type UserSession = Session["user"] & {
  role: Role;
  canManageLeads: boolean;
  canManageCourses: boolean;
  canManageUsers: boolean;
  canViewReports: boolean;
  canExportData: boolean;
};

export function isSuperAdmin(user: UserSession) {
  return user.role === "SUPER_ADMIN";
}

export function isAdmin(user: UserSession) {
  return user.role === "SUPER_ADMIN" || user.role === "ADMIN";
}

export function isManager(user: UserSession) {
  return ["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(user.role);
}

export function canManageLeads(user: UserSession) {
  return user.canManageLeads || isAdmin(user);
}

export function canManageCourses(user: UserSession) {
  return user.canManageCourses || isAdmin(user);
}

export function canManageUsers(user: UserSession) {
  return user.canManageUsers || isSuperAdmin(user);
}

export function canViewReports(user: UserSession) {
  return user.canViewReports || isManager(user);
}

export function canExportData(user: UserSession) {
  return user.canExportData || isAdmin(user);
}

export function canDeleteLead(user: UserSession) {
  return isAdmin(user);
}

export function canAssignLead(user: UserSession) {
  return isManager(user);
}

export function canViewAllLeads(user: UserSession) {
  return isManager(user);
}

export function canViewSystemSettings(user: UserSession) {
  return isSuperAdmin(user);
}

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  MANAGER: "Menejjer",
  OPERATOR: "Operator",
};

export const ROLE_COLORS: Record<Role, string> = {
  SUPER_ADMIN: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  ADMIN: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  MANAGER: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  OPERATOR: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
};
