import { HelpCircle, Clock, MessageSquare, Mail, Phone, ArrowRight, Search, BookOpen, FileText } from "lucide-react";
import Link from "next/link";

const popularTopics = [
  "How do I add a new tenant?",
  "What triggers a credit alert?",
  "How do I export my portfolio data?",
  "What's the difference between status levels?",
  "How do I invite team members?",
  "How often is tenant data updated?",
];

export default function HelpPage() {
  return (
    <div className="container px-4 py-12 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <HelpCircle className="h-4 w-4" />
          Support
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
          Help Center
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Find answers, get support, and learn how to make the most of Credit Oversight.
        </p>
      </header>

      {/* Search - Coming Soon */}
      <div className="mb-12">
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search help articles..."
            disabled
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-muted/50 text-muted-foreground text-sm cursor-not-allowed"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">Coming Soon</span>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-8 text-center mb-12">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
          <Clock className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Knowledge Base Coming Soon
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          We're building a comprehensive help center with tutorials, FAQs, and guides.
          In the meantime, reach out directly for support.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="mailto:support@acmeanalytics.com"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <Mail className="h-4 w-4" />
            Email Support
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            Contact Form
          </Link>
        </div>
      </div>

      {/* Popular Topics Preview */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-foreground mb-6">Popular Questions</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {popularTopics.map((topic) => (
            <div
              key={topic}
              className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card opacity-70"
            >
              <HelpCircle className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm text-muted-foreground">{topic}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-4">
          Answers coming soon. Contact support for immediate help.
        </p>
      </section>

      {/* Contact Options */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-foreground mb-6">Get Support Now</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-card p-5 text-center">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Email</h3>
            <p className="text-xs text-muted-foreground mb-3">Response within 4 hours</p>
            <a
              href="mailto:support@acmeanalytics.com"
              className="text-sm text-primary font-medium hover:underline"
            >
              support@acmeanalytics.com
            </a>
          </div>
          <div className="rounded-lg border border-border bg-card p-5 text-center">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mx-auto mb-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Phone</h3>
            <p className="text-xs text-muted-foreground mb-3">Mon-Fri, 9am-6pm PT</p>
            <a
              href="tel:+18005551234"
              className="text-sm text-primary font-medium hover:underline"
            >
              +1 (800) 555-1234
            </a>
          </div>
          <div className="rounded-lg border border-border bg-card p-5 text-center">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Live Chat</h3>
            <p className="text-xs text-muted-foreground mb-3">Coming soon</p>
            <span className="text-sm text-muted-foreground">
              Enterprise only
            </span>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Related Resources</h3>
        <div className="space-y-3">
          <Link
            href="/docs"
            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground group-hover:text-foreground">Documentation</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
          </Link>
          <Link
            href="/status"
            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground group-hover:text-foreground">System Status</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
          </Link>
          <Link
            href="/security"
            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground group-hover:text-foreground">Security Information</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
          </Link>
        </div>
      </section>
    </div>
  );
}
