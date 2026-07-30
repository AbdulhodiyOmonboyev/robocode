import type { NextAuthConfig } from "next-auth";

const PUBLIC_PATHS = ["/login", "/api/auth"];
// Exact-match only (unlike PUBLIC_PATHS above) — "/" as a prefix would match every route.
const PUBLIC_EXACT_PATHS = ["/"];
const TEACHER_PREFIX = "/teacher";

const isAdminRole = (role: string) => role === "SUPER_ADMIN" || role === "ADMIN";
// Teachers (Group.teacherId holders) land on their own panel; admins keep the regular dashboard
// even if they also happen to teach a group.
const landingPath = (user: { role: string; isTeacher: boolean }) =>
  user.isTeacher && !isAdminRole(user.role) ? "/teacher/dashboard" : "/dashboard";

// Avatarni faqat kichik URL bo'lsa sessiyaga qo'shamiz.
// base64 (data:) rasm cookie'ni shishirib "REQUEST_HEADER_TOO_LARGE" (494) beradi.
const safeAvatar = (v: unknown): string | null =>
  typeof v === "string" && !v.startsWith("data:") && v.length < 512 ? v : null;

export const authConfig: NextAuthConfig = {
  trustHost: true,
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isPublic =
        PUBLIC_PATHS.some((p) => nextUrl.pathname.startsWith(p)) || PUBLIC_EXACT_PATHS.includes(nextUrl.pathname);

      if (!isPublic && !isLoggedIn) return false;

      if (isLoggedIn) {
        const user = auth!.user;
        if (nextUrl.pathname === "/login") {
          return Response.redirect(new URL(landingPath(user), nextUrl));
        }
        if (nextUrl.pathname.startsWith(TEACHER_PREFIX) && !user.isTeacher && !isAdminRole(user.role)) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
        token.fullName = user.fullName;
        token.avatarUrl = safeAvatar(user.avatarUrl);
        token.username = user.username;
        token.canManageLeads = user.canManageLeads;
        token.canManageCourses = user.canManageCourses;
        token.canManageUsers = user.canManageUsers;
        token.canViewReports = user.canViewReports;
        token.canExportData = user.canExportData;
        token.isTeacher = user.isTeacher;
      }
      // Client called useSession().update(partial) — e.g. after saving name/avatar on the profile page
      if (trigger === "update" && session) {
        if (typeof session.fullName === "string") token.fullName = session.fullName;
        if ("avatarUrl" in session) token.avatarUrl = safeAvatar(session.avatarUrl);
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
        session.user.isTeacher = token.isTeacher;
      }
      return session;
    },
  },
  providers: [],
};
