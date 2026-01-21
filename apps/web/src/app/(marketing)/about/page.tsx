import { Shield, Target, Users, TrendingUp, Award, Building } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Trust & Transparency",
    description: "We believe in open communication and building lasting relationships with our clients through honest, reliable service.",
  },
  {
    icon: Target,
    title: "Precision",
    description: "Every alert we send is vetted for accuracy. We'd rather miss a false positive than waste your time.",
  },
  {
    icon: Users,
    title: "Client Success",
    description: "Your success is our success. We're not just a vendor—we're a partner in protecting your portfolio.",
  },
];

const stats = [
  { value: "500+", label: "Properties Monitored" },
  { value: "12,000+", label: "Tenants Tracked" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "< 15min", label: "Alert Delivery" },
];

const team = [
  {
    name: "Sarah Chen",
    role: "CEO & Co-Founder",
    bio: "Former VP of Risk at Blackstone with 15 years in commercial real estate finance.",
  },
  {
    name: "Marcus Johnson",
    role: "CTO & Co-Founder",
    bio: "Previously led data engineering at Bloomberg, specializing in financial data pipelines.",
  },
  {
    name: "Emily Rodriguez",
    role: "VP of Product",
    bio: "10 years building fintech products at Capital One and Stripe.",
  },
  {
    name: "David Park",
    role: "VP of Customer Success",
    bio: "Former asset manager at CBRE with deep understanding of client needs.",
  },
];

export default function AboutPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="container px-4 py-16 max-w-4xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
          Protecting Portfolios Through Intelligence
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Credit Oversight was founded on a simple belief: commercial real estate professionals
          deserve better tools to monitor tenant credit risk. We're building the future of
          portfolio protection.
        </p>
      </section>

      {/* Story Section */}
      <section className="border-y border-border bg-muted/20">
        <div className="container px-4 py-12 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  In 2023, our founders Sarah and Marcus watched a major retail tenant's
                  bankruptcy blindside several of their former colleagues. The warning signs
                  were there—SEC filings, court documents, credit downgrades—but scattered
                  across dozens of sources.
                </p>
                <p>
                  They realized that while institutional investors had teams dedicated to
                  monitoring this data, most commercial real estate professionals were left
                  manually checking filings or relying on outdated reports.
                </p>
                <p>
                  Credit Oversight was born to level that playing field. We aggregate, analyze,
                  and alert—so you can focus on what matters: managing your properties and
                  relationships.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-lg border border-border bg-card p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container px-4 py-12 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-foreground text-center mb-8">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <div key={value.title} className="rounded-lg border border-border bg-card p-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Team Section */}
      <section className="border-t border-border bg-muted/20">
        <div className="container px-4 py-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">Leadership Team</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {team.map((member) => (
              <div key={member.name} className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <span className="text-lg font-semibold text-muted-foreground">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{member.name}</h3>
                    <p className="text-sm text-primary mb-2">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Backed By Section */}
      <section className="container px-4 py-12 max-w-4xl mx-auto text-center">
        <h2 className="text-lg font-semibold text-muted-foreground mb-6">Backed By</h2>
        <div className="flex items-center justify-center gap-8 flex-wrap">
          {["Sequoia Capital", "a]6z", "First Round"].map((investor) => (
            <div
              key={investor}
              className="px-6 py-3 rounded-lg border border-border bg-card text-muted-foreground font-medium"
            >
              {investor}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-muted/30">
        <div className="container px-4 py-12 max-w-4xl mx-auto text-center">
          <Building className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Join the Future of Portfolio Protection
          </h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            See why leading commercial real estate professionals trust Credit Oversight
            to monitor their tenant credit risk.
          </p>
          <a
            href="/pricing"
            className="inline-flex bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            View Pricing
          </a>
        </div>
      </section>
    </div>
  );
}
