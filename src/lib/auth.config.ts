import type { NextAuthConfig } from "next-auth";

const PUBLIC_PATHS = ["/login", "/api/auth"];

export const authConfig: NextAuthConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isPublic = PUBLIC_PATHS.some((p) => nextUrl.pathname.startsWith(p));

      if (!isPublic && !isLoggedIn) return false;
      if (isLoggedIn && nextUrl.pathname === "/login") {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.fullName = (user as any).fullName;
        token.username = (user as any).username;
        token.canManageLeads = (user as any).canManageLeads;
        token.canManageCourses = (user as any).canManageCourses;
        token.canManageUsers = (user as any).canManageUsers;
        token.canViewReports = (user as any).canViewReports;
        token.canExportData = (user as any).canExportData;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
        (session.user as any).fullName = token.fullName;
        (session.user as any).username = token.username;
        (session.user as any).canManageLeads = token.canManageLeads;
        (session.user as any).canManageCourses = token.canManageCourses;
        (session.user as any).canManageUsers = token.canManageUsers;
        (session.user as any).canViewReports = token.canViewReports;
        (session.user as any).canExportData = token.canExportData;
      }
      return session;
    },
  },
  providers: [],
};
