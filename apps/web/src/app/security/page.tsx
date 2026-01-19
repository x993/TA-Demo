import { Shield, Lock, Server, Eye, FileCheck, Users } from "lucide-react";

const securityFeatures = [
  {
    icon: Lock,
    title: "Encryption",
    description: "All data encrypted in transit (TLS 1.3) and at rest (AES-256). API keys are hashed and never stored in plain text.",
  },
  {
    icon: Server,
    title: "Infrastructure",
    description: "Hosted on SOC 2 Type II certified cloud infrastructure with geo-redundant backups and 99.9% uptime SLA.",
  },
  {
    icon: Eye,
    title: "Access Controls",
    description: "Role-based access control, audit logging, and mandatory multi-factor authentication for all employees.",
  },
  {
    icon: FileCheck,
    title: "Compliance",
    description: "Regular third-party security audits and penetration testing. Working toward SOC 2 Type II certification.",
  },
  {
    icon: Users,
    title: "Team Security",
    description: "Background checks for all employees with data access. Security awareness training conducted quarterly.",
  },
  {
    icon: Shield,
    title: "Incident Response",
    description: "24/7 monitoring with documented incident response procedures. Customers notified within 72 hours of any breach.",
  },
];

export default function SecurityPage() {
  return (
    <div className="container px-4 py-12 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Shield className="h-4 w-4" />
          Security
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
          Your Data Security is Our Priority
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We implement industry-leading security practices to protect your portfolio data
          and ensure the integrity of our monitoring platform.
        </p>
      </header>

      {/* Security Features Grid */}
      <section className="mb-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="rounded-xl border border-border bg-card p-5">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Data Protection */}
      <section className="rounded-xl border border-border bg-card p-6 mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Data Protection Practices</h2>
        <div className="space-y-4 text-sm text-muted-foreground">
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
            <p>
              <strong className="text-foreground">Data Minimization:</strong> We only collect and
              retain data necessary to provide our services. Portfolio data is segregated by customer.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
            <p>
              <strong className="text-foreground">Secure Development:</strong> All code undergoes
              security review. We follow OWASP guidelines and use automated vulnerability scanning.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
            <p>
              <strong className="text-foreground">Vendor Management:</strong> Third-party vendors
              are vetted for security practices. We maintain a limited number of sub-processors.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
            <p>
              <strong className="text-foreground">Business Continuity:</strong> Disaster recovery
              procedures tested annually with RTO of 4 hours and RPO of 1 hour.
            </p>
          </div>
        </div>
      </section>

      {/* Compliance Status */}
      <section className="rounded-xl border border-border bg-card p-6 mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Compliance & Certifications</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border border-border bg-muted/30">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-foreground">SOC 2 Type II</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-warning/20 text-warning">In Progress</span>
            </div>
            <p className="text-xs text-muted-foreground">Expected completion Q2 2026</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-muted/30">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-foreground">GDPR</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-positive/20 text-positive">Compliant</span>
            </div>
            <p className="text-xs text-muted-foreground">EU data processing agreements available</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-muted/30">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-foreground">CCPA</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-positive/20 text-positive">Compliant</span>
            </div>
            <p className="text-xs text-muted-foreground">California privacy rights supported</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-muted/30">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-foreground">Penetration Testing</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-positive/20 text-positive">Annual</span>
            </div>
            <p className="text-xs text-muted-foreground">Last completed December 2025</p>
          </div>
        </div>
      </section>

      {/* Report Vulnerability */}
      <section className="rounded-xl border border-primary/30 bg-primary/5 p-6">
        <h2 className="text-lg font-semibold text-foreground mb-3">Responsible Disclosure</h2>
        <p className="text-sm text-muted-foreground mb-4">
          We take security vulnerabilities seriously. If you discover a potential security issue,
          please report it responsibly. We appreciate your help in keeping Credit Oversight secure.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="mailto:security@acmeanalytics.com"
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Report a Vulnerability
          </a>
          <a
            href="/contact"
            className="inline-flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Contact Security Team
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-foreground mb-6">Security FAQ</h2>
        <div className="space-y-4">
          {[
            {
              q: "Where is my data stored?",
              a: "All customer data is stored in secure, SOC 2 certified data centers in the United States with geo-redundant backups.",
            },
            {
              q: "Who has access to my data?",
              a: "Access is strictly limited to authorized personnel who need it for support or operations. All access is logged and audited.",
            },
            {
              q: "Can I get a copy of your security documentation?",
              a: "Yes, we provide security questionnaires and documentation to customers under NDA. Contact us to request access.",
            },
            {
              q: "Do you support SSO?",
              a: "Yes, SAML 2.0 SSO is available on Enterprise plans. We support Okta, Azure AD, and other major identity providers.",
            },
          ].map((faq) => (
            <div key={faq.q} className="rounded-lg border border-border bg-card p-4">
              <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
              <p className="text-sm text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
