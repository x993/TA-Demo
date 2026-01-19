import { Code2, Terminal, Webhook, Clock, ArrowRight, FileJson, Zap } from "lucide-react";
import Link from "next/link";

export default function ApiAccessPage() {
  return (
    <div className="container px-4 py-12 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Code2 className="h-4 w-4" />
          Developer Tools
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
          API Access
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Integrate tenant credit monitoring directly into your systems with our
          comprehensive REST API.
        </p>
      </header>

      {/* Coming Soon Notice */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-8 text-center mb-12">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
          <Clock className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Public API Coming Soon
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Our API is currently in private beta. Contact us to request early access
          or to discuss your integration needs.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          Request API Access
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* API Features Preview */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-foreground mb-6">What You'll Be Able to Do</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              icon: FileJson,
              title: "Tenant Data",
              description: "Query tenant credit status, scores, and monitoring coverage",
            },
            {
              icon: Webhook,
              title: "Webhooks",
              description: "Receive real-time alerts via webhook when events occur",
            },
            {
              icon: Terminal,
              title: "Event History",
              description: "Access full event history and evidence documents",
            },
            {
              icon: Zap,
              title: "Bulk Operations",
              description: "Add, update, or remove tenants programmatically",
            },
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="rounded-lg border border-border bg-card p-4">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center mb-3">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Code Preview */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-foreground mb-6">API Preview</h2>
        <div className="rounded-xl border border-border bg-[#1e1e1e] overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-[#252526]">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ml-2 text-xs text-muted-foreground">Example Request</span>
          </div>
          <pre className="p-4 text-sm overflow-x-auto">
            <code className="text-muted-foreground">
{`curl -X GET "https://api.creditoversight.com/v1/tenants" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"

# Response
{
  "data": [
    {
      "id": "ten_abc123",
      "name": "Acme Retail Inc.",
      "status": "watch",
      "credit_score": 620,
      "last_event": "2026-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "total": 47,
    "page": 1
  }
}`}
            </code>
          </pre>
        </div>
      </section>

      {/* Rate Limits */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-foreground mb-6">Rate Limits by Plan</h2>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-foreground">Plan</th>
                <th className="px-4 py-3 text-left font-medium text-foreground">Requests/Month</th>
                <th className="px-4 py-3 text-left font-medium text-foreground">Rate Limit</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="px-4 py-3 text-muted-foreground">Starter</td>
                <td className="px-4 py-3 text-muted-foreground">Not included</td>
                <td className="px-4 py-3 text-muted-foreground">—</td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 text-muted-foreground">Professional</td>
                <td className="px-4 py-3 text-muted-foreground">1,000</td>
                <td className="px-4 py-3 text-muted-foreground">10 req/min</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-muted-foreground">Enterprise</td>
                <td className="px-4 py-3 text-muted-foreground">Unlimited</td>
                <td className="px-4 py-3 text-muted-foreground">Custom</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-xl border border-border bg-muted/30 p-6 text-center">
        <h3 className="font-semibold text-foreground mb-2">Need Custom Integration?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Our team can help design a solution that fits your existing tech stack.
        </p>
        <Link
          href="/contact"
          className="text-primary font-medium hover:underline"
        >
          Talk to our engineering team
        </Link>
      </section>
    </div>
  );
}
