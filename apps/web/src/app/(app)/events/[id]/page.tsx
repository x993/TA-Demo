"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, FileText, ExternalLink, Building } from "lucide-react";
import { StatusBadge, EventTypeBadge } from "@/components/ui/status-badge";
import { EvidenceDrawer } from "@/components/ui/evidence-drawer";
import type { EventType, SourceType } from "@/types";

interface MemoDetail {
  fact: string;
  citation: string;
}

interface EventMemo {
  whatWasDisclosed: string | null;
  keyDetails: MemoDetail[];
  context: string[];
  whyItMatters: string | null;
  recommendedActions: string[];
  whatToWatch: string[];
}

interface EventDetail {
  id: string;
  tenantId: string;
  tenantName: string;
  eventType: EventType;
  eventDate: string;
  headline: string;
  summary: string;
  memo: EventMemo | null;
  evidenceCount: number;
  properties: { id: string; name: string }[];
}

interface EvidenceSource {
  id: string;
  eventId: string;
  sourceType: SourceType;
  title: string;
  publisher: string;
  date: string;
  url: string | null;
  excerpt: string | null;
  pageReference: string | null;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function EventMemoPage() {
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [evidence, setEvidence] = useState<EvidenceSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEvidence, setShowEvidence] = useState(false);

  useEffect(() => {
    async function loadEvent() {
      setLoading(true);
      try {
        const [eventRes, evidenceRes] = await Promise.all([
          fetch(`/api/v1/events/${eventId}`),
          fetch(`/api/v1/events/${eventId}/evidence`),
        ]);

        if (!eventRes.ok) throw new Error("Failed to load event");

        const eventData = await eventRes.json();
        const evidenceData = evidenceRes.ok ? await evidenceRes.json() : [];

        setEvent(eventData);
        setEvidence(evidenceData);
      } catch (error) {
        console.error("Failed to load event:", error);
      } finally {
        setLoading(false);
      }
    }
    if (eventId) {
      loadEvent();
    }
  }, [eventId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-24 mb-6"></div>
          <div className="h-32 bg-muted rounded-xl mb-4"></div>
          <div className="h-48 bg-muted rounded-xl mb-4"></div>
          <div className="h-32 bg-muted rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <p className="text-muted-foreground">Event not found</p>
        <Link href="/dashboard" className="text-primary hover:underline mt-2 inline-block">
          ← Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Back Link */}
      <Link
        href={`/tenants/${event.tenantId}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {event.tenantName}
      </Link>

      {/* Event Header Card */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-3">
          <EventTypeBadge type={event.eventType} />
          <span className="text-sm text-muted-foreground">{formatDate(event.eventDate)}</span>
        </div>

        <Link
          href={`/tenants/${event.tenantId}`}
          className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
        >
          {event.tenantName}
        </Link>

        <h1 className="text-sm text-muted-foreground mt-2 leading-relaxed">
          {event.headline}
        </h1>

        {/* Property badges */}
        {event.properties.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {event.properties.map((property) => (
              <Link
                key={property.id}
                href={`/properties/${property.id}`}
                className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-muted/80 text-muted-foreground border border-border/50 hover:bg-muted hover:text-foreground transition-all"
              >
                <Building className="h-3 w-3" />
                {property.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* What Was Disclosed */}
      {event.memo?.whatWasDisclosed && (
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            What Was Disclosed
          </h2>
          <p className="text-sm text-foreground leading-relaxed">
            {event.memo.whatWasDisclosed}
          </p>
        </section>
      )}

      {/* Key Details */}
      {event.memo?.keyDetails && event.memo.keyDetails.length > 0 && (
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Key Details
          </h2>
          <ul className="space-y-3">
            {event.memo.keyDetails.map((detail, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm">
                <span className="text-primary mt-0.5 text-lg leading-none">•</span>
                <div className="flex-1">
                  <span className="text-foreground">{detail.fact}</span>
                  {detail.citation && (
                    <span className="text-xs text-muted-foreground ml-2">
                      ({detail.citation})
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Context */}
      {event.memo?.context && event.memo.context.length > 0 && (
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Context
          </h2>
          <ul className="space-y-2">
            {event.memo.context.map((ctx, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="mt-0.5 opacity-50">•</span>
                <span>{ctx}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Why It Matters */}
      {event.memo?.whyItMatters && (
        <section className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
          <h2 className="text-xs font-semibold text-amber-400 uppercase tracking-wide mb-3">
            Why It Matters
          </h2>
          <p className="text-sm text-foreground leading-relaxed">
            {event.memo.whyItMatters}
          </p>
        </section>
      )}

      {/* Recommended Actions */}
      {event.memo?.recommendedActions && event.memo.recommendedActions.length > 0 && (
        <section className="rounded-xl border border-primary/30 bg-primary/5 p-5">
          <h2 className="text-xs font-semibold text-primary uppercase tracking-wide mb-3">
            Recommended Actions
          </h2>
          <ul className="space-y-2">
            {event.memo.recommendedActions.map((action, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm">
                <span className="text-primary mt-0.5 font-bold">{idx + 1}.</span>
                <span className="text-foreground">{action}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* What to Watch */}
      {event.memo?.whatToWatch && event.memo.whatToWatch.length > 0 && (
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            What to Watch
          </h2>
          <ul className="space-y-2">
            {event.memo.whatToWatch.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="mt-0.5">👁</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* View Evidence Button */}
      {event.evidenceCount > 0 && (
        <button
          onClick={() => setShowEvidence(true)}
          className="w-full py-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors text-sm font-medium text-foreground flex items-center justify-center gap-2"
        >
          <FileText className="h-4 w-4" />
          View Source Documents ({event.evidenceCount})
        </button>
      )}

      {/* Evidence Drawer */}
      <EvidenceDrawer
        open={showEvidence}
        onClose={() => setShowEvidence(false)}
        evidence={evidence}
      />
    </div>
  );
}
