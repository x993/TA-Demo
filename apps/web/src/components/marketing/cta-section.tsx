"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle, Shield } from "lucide-react";

const benefits = [
  "14-day free trial",
  "No credit card required",
  "Cancel anytime",
];

export function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Gradient background with blurred orbs */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-background">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="container relative px-4">
        {/* Floating card with backdrop blur */}
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl p-8 sm:p-12">
            {/* Urgency badge */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Shield className="h-4 w-4" />
                Start protecting your portfolio today
              </div>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-center">
              Start monitoring your portfolio today
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-center max-w-xl mx-auto">
              Join hundreds of CRE professionals who trust Credit Oversight to protect their portfolios from tenant credit risk.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground text-base font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border-2 border-border text-foreground text-base font-semibold hover:bg-muted hover:border-primary/30 transition-all"
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
      </div>
    </section>
  );
}
