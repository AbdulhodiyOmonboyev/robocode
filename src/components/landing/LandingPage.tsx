"use client";

import { useState } from "react";
import { LangProvider } from "./LangContext";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { Stats } from "./Stats";
import { WhatAwaits } from "./WhatAwaits";
import { WhyUs } from "./WhyUs";
import { Courses } from "./Courses";
import { Pricing } from "./Pricing";
import { Testimonials } from "./Testimonials";
import { StartupStudio } from "./StartupStudio";
import { Team } from "./Team";
import { FAQ } from "./FAQ";
import { LeadForm } from "./LeadForm";
import { Contact } from "./Contact";
import { Footer } from "./Footer";
import { StickyCTA } from "./StickyCTA";

export function LandingPage({ centerName, logo }: { centerName: string; logo: string }) {
  const [selectedCourse, setSelectedCourse] = useState("");

  const scrollToForm = (courseName?: string) => {
    if (courseName) setSelectedCourse(courseName);
    document.getElementById("ariza")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <LangProvider>
      <div className="min-h-screen bg-[#08060F]">
        <Header centerName={centerName} logo={logo} />
        <main>
          <Hero />
          <Stats />
          <WhatAwaits />
          <WhyUs />
          <Courses onSelect={scrollToForm} />
          <Pricing onSelect={scrollToForm} />
          <Testimonials />
          <StartupStudio onSelect={() => scrollToForm()} />
          <Team />
          <FAQ />
          <LeadForm selectedCourse={selectedCourse} />
          <Contact />
        </main>
        <Footer centerName={centerName} logo={logo} />
        <StickyCTA />
      </div>
    </LangProvider>
  );
}
