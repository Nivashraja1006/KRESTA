import React from 'react';
import { MarketingNavbar } from '../../components/marketing/MarketingNavbar';
import { MarketingFooter } from '../../components/marketing/MarketingFooter';

// Luxury Fine Dining Restaurant Sections
import { HeroSection } from '../../components/marketing/HeroSection';
import { SignatureDishesSection } from '../../components/marketing/SignatureDishesSection';
import { CulinaryStorySection } from '../../components/marketing/CulinaryStorySection';
import { DiningAtmosphereSection } from '../../components/marketing/DiningAtmosphereSection';
import { LocationsHoursSection } from '../../components/marketing/LocationsHoursSection';
import { CustomerCTASection } from '../../components/marketing/CustomerCTASection';
import { GuestAccoladesSection } from '../../components/marketing/GuestAccoladesSection';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#05070d] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 overflow-x-hidden">
      {/* 1. Clean, Wide Transparent / Sticky Restaurant Navbar */}
      <MarketingNavbar />

      <main className="flex-1">
        {/* 2. Full-Screen Cinematic Hero with Indian Food / Biryani Background & Centered Headline */}
        <HeroSection />

        {/* 3. Six-Dish Automatic Left-to-Right Looping Carousel (2-3s interval, no visible controls) */}
        <SignatureDishesSection />

        {/* 4. Restaurant Story & Culinary Heritage (#story) */}
        <CulinaryStorySection />

        {/* 5. Dining Room Atmosphere & Chef Counter (#atmosphere) */}
        <DiningAtmosphereSection />

        {/* 6. Locations & Operating Hours (#locations) */}
        <LocationsHoursSection />

        {/* 7. Full-Width Visually Rich Table Reservation Section ("A Remarkable Feast Awaits Your Table") */}
        <CustomerCTASection />

        {/* 8. Customer Reviews Immediately Before Footer (Automatic 2-3s transition, no visible controls) */}
        <GuestAccoladesSection />
      </main>

      {/* 9. Spacious Full-Width Restaurant Footer */}
      <MarketingFooter />
    </div>
  );
};

export default LandingPage;
