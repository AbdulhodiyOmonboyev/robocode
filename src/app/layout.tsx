import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Robocode CRM",
  description: "Robocode CRM - lidlar boshqaruv tizimi",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#5E2CA5",
};

const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var dark = stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-gray-50 dark:bg-gray-950`}>
        <SessionProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </SessionProvider>
      </body>
    </html>
  );
}
