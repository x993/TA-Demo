"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

const benefits = [
  "14-day free trial",
  "No credit card required",
  "Cancel anytime",
];

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Start monitoring your portfolio today
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join hundreds of CRE professionals who trust Credit Oversight to protect their portfolios from tenant credit risk.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-base font-medium hover:bg-primary/90 transition-colors"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground text-base font-medium hover:bg-muted transition-colors"
            >
              Contact Sales
            </Link>
          </div>

          {/* Benefits */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-positive" />
                {benefit}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
