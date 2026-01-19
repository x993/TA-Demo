import { BookOpen, Clock, FileText, Zap, Users, Settings, ArrowRight, Bell } from "lucide-react";
import Link from "next/link";

const docCategories = [
  {
    icon: Zap,
    title: "Getting Started",
    description: "Quick start guides and onboarding tutorials",
  },
  {
    icon: Users,
    title: "Tenant Monitoring",
    description: "How to add, manage, and monitor tenants",
  },
  {
    icon: Bell,
    title: "Alerts & Notifications",
    description: "Configure and customize alert preferences",
  },
  {
    icon: FileText,
    title: "Reports & Analytics",
    description: "Understanding your portfolio insights",
  },
  {
    icon: Settings,
    title: "Account Management",
    description: "Team settings, billing, and preferences",
  },
  {
    icon: BookOpen,
    title: "API Reference",
    description: "Technical documentation for developers",
  },
];

export default function DocsPage() {
  return (
    <div className="container px-4 py-12 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <BookOpen className="h-4 w-4" />
          Documentation
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
          Credit Oversight Docs
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Learn how to get the most out of your tenant credit monitoring platform.
        </p>
      </header>

      {/* Coming Soon Notice */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-8 text-center mb-12">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
          <Clock className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Documentation Coming Soon
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          We're building comprehensive documentation to help you succeed. In the meantime,
          our support team is here to answer any questions.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          Contact Support
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Doc Categories Preview */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-foreground mb-6">What We're Working On</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {docCategories.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.title} className="rounded-lg border border-border bg-card p-4 opacity-70">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center mb-3">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{category.title}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Links */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Quick Resources</h3>
        <div className="space-y-3">
          <Link
            href="/help"
            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
          >
            <span className="text-sm text-muted-foreground group-hover:text-foreground">Visit our Help Center</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
          </Link>
          <Link
            href="/api-access"
            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
          >
            <span className="text-sm text-muted-foreground group-hover:text-foreground">API Access Information</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
          </Link>
          <Link
            href="/contact"
            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
          >
            <span className="text-sm text-muted-foreground group-hover:text-foreground">Get personalized help</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
          </Link>
        </div>
      </section>
    </div>
  );
}
