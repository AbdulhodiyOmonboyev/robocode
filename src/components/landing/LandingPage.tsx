"use client";

import { Header } from "./Header";
import { Hero } from "./Hero";
import { Stats } from "./Stats";
import { WhatAwaits } from "./WhatAwaits";
import { Courses } from "./Courses";
import { Team } from "./Team";
import { LeadForm } from "./LeadForm";
import { Footer } from "./Footer";

export function LandingPage({ centerName, logo }: { centerName: string; logo: string }) {
  const scrollToForm = () => {
    document.getElementById("ariza")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[#08060F]">
      <Header centerName={centerName} logo={logo} />
      <main>
        <Hero />
        <Stats />
        <WhatAwaits />
        <Courses onSelect={scrollToForm} />
        <Team />
        <LeadForm />
      </main>
      <Footer centerName={centerName} logo={logo} />
    </div>
  );
}
