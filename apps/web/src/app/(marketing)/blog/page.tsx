import { BookOpen, Bell, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function BlogPage() {
  return (
    <div className="container px-4 py-12 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <BookOpen className="h-4 w-4" />
          Insights
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
          The Credit Oversight Blog
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Industry insights, product updates, and best practices for commercial
          real estate credit risk management.
        </p>
      </header>

      {/* Coming Soon Notice */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-8 text-center mb-12">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
          <Clock className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Blog Coming Soon
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          We're preparing content on CRE credit risk, tenant monitoring strategies, and
          industry trends. Subscribe to be notified when we launch.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full sm:flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
            <Bell className="h-4 w-4" />
            Notify Me
          </button>
        </div>
      </div>

      {/* Topics Preview */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-foreground mb-6">Topics We'll Cover</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              title: "CRE Credit Risk",
              description: "Understanding tenant creditworthiness and portfolio risk exposure",
            },
            {
              title: "Regulatory Updates",
              description: "SEC filing changes and compliance requirements affecting CRE",
            },
            {
              title: "Market Analysis",
              description: "Trends in commercial real estate sectors and tenant industries",
            },
            {
              title: "Product Deep Dives",
              description: "Tips and tutorials for getting the most from Credit Oversight",
            },
            {
              title: "Case Studies",
              description: "How our customers use monitoring to protect their portfolios",
            },
            {
              title: "Industry News",
              description: "Notable bankruptcies, credit events, and market movements",
            },
          ].map((topic) => (
            <div key={topic.title} className="rounded-lg border border-border bg-card p-4">
              <h3 className="font-semibold text-foreground mb-1">{topic.title}</h3>
              <p className="text-sm text-muted-foreground">{topic.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* In the Meantime */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">In the Meantime</h3>
        <div className="space-y-3">
          <Link
            href="/about"
            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
          >
            <span className="text-sm text-muted-foreground group-hover:text-foreground">Learn about our company and mission</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
          </Link>
          <Link
            href="/pricing"
            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
          >
            <span className="text-sm text-muted-foreground group-hover:text-foreground">Explore our pricing plans</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
          </Link>
          <Link
            href="/contact"
            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
          >
            <span className="text-sm text-muted-foreground group-hover:text-foreground">Get in touch with our team</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
          </Link>
        </div>
      </section>
    </div>
  );
}
