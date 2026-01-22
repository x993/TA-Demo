"use client";

import Link from "next/link";
import { ArrowRight, MessageSquare, Play } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative py-16 overflow-hidden">
      {/* Dark background with subtle pattern */}
      <div className="absolute inset-0 bg-[#0f1419]">
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary) / 0.5) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
        {/* Gradient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="container relative px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            See if Credit Oversight fits your workflow
          </h2>

          {/* Subheadline - low pressure */}
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            We'll walk you through the product with your actual use case in
            mind. No pressure, no long sales cycle.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              Schedule a Conversation
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted/50 transition-colors"
            >
              <Play className="h-4 w-4" />
              Explore on Your Own
            </Link>
          </div>

          {/* Low-pressure reassurances */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <span>30-minute intro call</span>
            <span className="hidden sm:inline text-border">•</span>
            <span>No commitment required</span>
            <span className="hidden sm:inline text-border">•</span>
            <span>We'll answer your questions</span>
          </div>
        </div>
      </div>
    </section>
  );
}
