import { Briefcase, MapPin, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CareersPage() {
  return (
    <div className="container px-4 py-12 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Briefcase className="h-4 w-4" />
          We're Hiring
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
          Join Our Team
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Help us build the future of commercial real estate risk intelligence.
          We're looking for passionate people to join our growing team.
        </p>
      </header>

      {/* Coming Soon Notice */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-8 text-center mb-12">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
          <Clock className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Job Board Coming Soon
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          We're working on our careers page. In the meantime, send your resume directly
          to our team and we'll be in touch.
        </p>
        <a
          href="mailto:careers@acmeanalytics.com"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          Email Your Resume
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>

      {/* Why Join Us */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-foreground mb-6">Why Join Credit Oversight?</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              title: "Impactful Work",
              description: "Help CRE professionals protect billions in real estate assets",
            },
            {
              title: "Competitive Compensation",
              description: "Salary, equity, and comprehensive benefits package",
            },
            {
              title: "Remote-First",
              description: "Work from anywhere with flexible hours",
            },
            {
              title: "Growth Opportunity",
              description: "Join an early-stage company with room to grow",
            },
          ].map((perk) => (
            <div key={perk.title} className="rounded-lg border border-border bg-card p-4">
              <h3 className="font-semibold text-foreground mb-1">{perk.title}</h3>
              <p className="text-sm text-muted-foreground">{perk.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Teams We're Building */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-foreground mb-6">Teams We're Building</h2>
        <div className="space-y-3">
          {[
            { team: "Engineering", roles: "Full-stack, Data, ML/AI" },
            { team: "Product", roles: "Product Manager, Designer" },
            { team: "Go-to-Market", roles: "Sales, Marketing, Customer Success" },
            { team: "Operations", roles: "Finance, People Ops" },
          ].map((dept) => (
            <div key={dept.team} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
              <span className="font-medium text-foreground">{dept.team}</span>
              <span className="text-sm text-muted-foreground">{dept.roles}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Location */}
      <section className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <MapPin className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">Our Locations</h3>
            <p className="text-sm text-muted-foreground">
              Headquartered in San Francisco with team members across the US. We're a remote-first
              company with optional co-working in SF, NYC, and Austin.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Don't see a role that fits? We're always looking for talented people.
        </p>
        <Link
          href="/contact"
          className="text-primary font-medium hover:underline"
        >
          Get in touch
        </Link>
      </div>
    </div>
  );
}
