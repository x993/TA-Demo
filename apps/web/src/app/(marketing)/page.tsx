import {
  MarketingHero,
  ProblemSection,
  ApproachSection,
  // CapabilitiesSection,
  PersonasSection,
  TrustSection,
  CTASection,
} from "@/components/marketing";

export default function MarketingLandingPage() {
  return (
    <>
      <MarketingHero />
      <ProblemSection />
      <ApproachSection />
      {/* <CapabilitiesSection /> */}
      <PersonasSection />
      <TrustSection />
      <CTASection />
    </>
  );
}
