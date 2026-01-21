import { Check, Zap, Building2, Briefcase } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    name: "Starter",
    description: "For small portfolios getting started with tenant monitoring",
    price: 299,
    icon: Zap,
    features: [
      "Up to 25 tenants monitored",
      "Weekly credit alerts",
      "Basic SEC filing tracking",
      "Email notifications",
      "Standard support",
      "30-day event history",
    ],
    cta: "Start Free Trial",
    highlight: false,
  },
  {
    name: "Professional",
    description: "For growing portfolios needing comprehensive coverage",
    price: 799,
    icon: Building2,
    features: [
      "Up to 100 tenants monitored",
      "Real-time credit alerts",
      "Full SEC & court filing tracking",
      "News & press release monitoring",
      "Priority email & chat support",
      "90-day event history",
      "Custom alert thresholds",
      "API access (1,000 calls/month)",
    ],
    cta: "Start Free Trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    description: "For large portfolios with advanced compliance needs",
    price: null,
    icon: Briefcase,
    features: [
      "Unlimited tenants monitored",
      "Real-time alerts with webhooks",
      "Complete disclosure coverage",
      "Dedicated account manager",
      "Custom integrations",
      "Unlimited event history",
      "SLA guarantees",
      "Unlimited API access",
      "SSO & advanced security",
      "Custom reporting",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="container px-4 py-12 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that fits your portfolio. All plans include a 14-day free trial
          with no credit card required.
        </p>
      </header>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {tiers.map((tier) => {
          const Icon = tier.icon;
          return (
            <div
              key={tier.name}
              className={`relative rounded-xl border p-6 flex flex-col ${
                tier.highlight
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-border bg-card"
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                  tier.highlight ? "bg-primary/20" : "bg-muted"
                }`}>
                  <Icon className={`h-5 w-5 ${tier.highlight ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <h2 className="text-xl font-bold text-foreground">{tier.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">{tier.description}</p>
              </div>

              <div className="mb-6">
                {tier.price !== null ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">${tier.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                ) : (
                  <div className="text-4xl font-bold text-foreground">Custom</div>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className={`h-4 w-4 mt-0.5 shrink-0 ${
                      tier.highlight ? "text-primary" : "text-muted-foreground"
                    }`} />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={tier.price === null ? "/contact" : "#"}
                className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium text-center transition-colors ${
                  tier.highlight
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-foreground text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {[
            {
              q: "What happens after my free trial ends?",
              a: "Your account will automatically convert to a paid subscription. You can cancel anytime during the trial with no charges.",
            },
            {
              q: "Can I change plans later?",
              a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle.",
            },
            {
              q: "What counts as a monitored tenant?",
              a: "Any tenant entity you add to your portfolio for credit monitoring counts toward your limit. Subsidiary tracking is included.",
            },
            {
              q: "Do you offer annual billing?",
              a: "Yes, annual billing saves you 20% compared to monthly. Contact our sales team for annual plan options.",
            },
            {
              q: "What integrations are available?",
              a: "We integrate with major property management systems including Yardi, MRI, and AppFolio. Enterprise plans include custom integrations.",
            },
          ].map((faq) => (
            <div key={faq.q} className="rounded-lg border border-border bg-card p-4">
              <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
              <p className="text-sm text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-16 text-center rounded-xl border border-border bg-muted/30 p-8">
        <h2 className="text-2xl font-bold text-foreground mb-3">
          Ready to protect your portfolio?
        </h2>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
          Join hundreds of commercial real estate professionals using Credit Oversight
          to stay ahead of tenant credit risks.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="#"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Start Free Trial
          </Link>
          <Link
            href="/contact"
            className="text-muted-foreground hover:text-foreground px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Talk to Sales
          </Link>
        </div>
      </section>
    </div>
  );
}
