import type { Metadata } from "next";
import { db } from "@/lib/db";
import { LandingPage } from "@/components/landing/LandingPage";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Robocode IT Academy — Andijondagi birinchi IT akademiya",
  description:
    "Robocode IT Academy — Andijonda dasturlash, robototexnika, front-end, back-end va grafik dizayn bo'yicha amaliy kurslar. +3000 bitiruvchi, real loyihalar, kuchli karyera.",
  keywords: [
    "robocode",
    "robocode academy",
    "IT academy Andijon",
    "dasturlash kurslari Andijon",
    "robototexnika",
    "front-end",
    "back-end",
    "grafik dizayn",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: "/",
    siteName: "Robocode IT Academy",
    title: "Robocode IT Academy — Andijondagi birinchi IT akademiya",
    description: "Dasturlash va robototexnika bo'yicha amaliy kurslar. Biz bilan doim birinchi bo'ling!",
    images: [{ url: "/api/branding/logo", width: 512, height: 512, alt: "Robocode IT Academy" }],
  },
  twitter: {
    card: "summary",
    title: "Robocode IT Academy — Andijondagi birinchi IT akademiya",
    description: "Dasturlash va robototexnika bo'yicha amaliy kurslar. Biz bilan doim birinchi bo'ling!",
    images: ["/api/branding/logo"],
  },
};

export default async function Home() {
  const [courses, settings] = await Promise.all([
    db.course.findMany({
      where: { isActive: true },
      select: { id: true, name: true, description: true, durationMonths: true, price: true, currency: true },
      orderBy: { name: "asc" },
    }),
    db.setting.findMany({ where: { key: { in: ["brand_logo", "center_name"] } } }),
  ]).catch(() => [[], []] as const);

  const settingsMap: Record<string, string> = {};
  settings.forEach((s) => (settingsMap[s.key] = s.value));
  const centerName = settingsMap["center_name"] || "Robocode IT Academy";
  const logo = settingsMap["brand_logo"] || "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: centerName,
    description: "Andijondagi IT akademiya — dasturlash va robototexnika bo'yicha amaliy kurslar.",
    url: BASE_URL,
    address: { "@type": "PostalAddress", addressLocality: "Andijon", addressCountry: "UZ" },
  };

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <LandingPage
        centerName={centerName}
        logo={logo}
        courses={courses.map((c) => ({ ...c, price: c.price.toString() }))}
      />
    </>
  );
}
