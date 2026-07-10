import type { NextAuthConfig } from "next-auth";

const PUBLIC_PATHS = ["/login", "/api/auth"];

export const authConfig: NextAuthConfig = {
  trustHost: true,
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
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
        token.fullName = user.fullName;
        token.avatarUrl = user.avatarUrl ?? null;
        token.username = user.username;
        token.canManageLeads = user.canManageLeads;
        token.canManageCourses = user.canManageCourses;
        token.canManageUsers = user.canManageUsers;
        token.canViewReports = user.canViewReports;
        token.canExportData = user.canExportData;
      }
      // Client called useSession().update(partial) — e.g. after saving name/avatar on the profile page
      if (trigger === "update" && session) {
        if (typeof session.fullName === "string") token.fullName = session.fullName;
        if ("avatarUrl" in session) token.avatarUrl = session.avatarUrl;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.fullName = token.fullName;
        session.user.avatarUrl = token.avatarUrl ?? null;
        session.user.username = token.username;
        session.user.canManageLeads = token.canManageLeads;
        session.user.canManageCourses = token.canManageCourses;
        session.user.canManageUsers = token.canManageUsers;
        session.user.canViewReports = token.canViewReports;
        session.user.canExportData = token.canExportData;
      }
      return session;
    },
  },
  providers: [],
};
