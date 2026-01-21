import {
  MarketingHero,
  StatsSection,
  DataSourcesSection,
  FeaturesSection,
  IntegrationsSection,
  CTASection,
} from "@/components/marketing";

export default function MarketingLandingPage() {
  return (
    <>
      <MarketingHero />
      <StatsSection />
      <DataSourcesSection />
      <FeaturesSection />
      <IntegrationsSection />
      <CTASection />
    </>
  );
}
