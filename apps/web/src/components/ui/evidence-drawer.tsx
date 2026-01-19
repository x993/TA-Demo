"use client";

import { useEffect } from "react";
import { X, ExternalLink, FileText, Newspaper, Scale, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SourceType } from "@/types";

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

interface EvidenceDrawerProps {
  open: boolean;
  onClose: () => void;
  evidence: EvidenceSource[];
}

const sourceTypeConfig: Record<
  SourceType,
  { icon: React.ElementType; label: string; colorClass: string }
> = {
  sec_filing: {
    icon: FileText,
    label: "SEC Filing",
    colorClass: "text-primary bg-primary/10",
  },
  news: {
    icon: Newspaper,
    label: "News",
    colorClass: "text-muted-foreground bg-muted",
  },
  press_release: {
    icon: FileText,
    label: "Press Release",
    colorClass: "text-muted-foreground bg-muted",
  },
  court_filing: {
    icon: Scale,
    label: "Court Filing",
    colorClass: "text-warning bg-warning/10",
  },
  credit_report: {
    icon: CreditCard,
    label: "Credit Report",
    colorClass: "text-muted-foreground bg-muted",
  },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function EvidenceDrawer({ open, onClose, evidence }: EvidenceDrawerProps) {
  // Close on escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-background border-l border-border shadow-2xl z-50 overflow-hidden flex flex-col animate-slide-up-fade">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Source Documents</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Evidence List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {evidence.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">No source documents available</p>
            </div>
          ) : (
            evidence.map((source) => {
              const config = sourceTypeConfig[source.sourceType];
              const Icon = config.icon;

              return (
                <div
                  key={source.id}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  {/* Source Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className={cn("p-2 rounded-lg", config.colorClass)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground">{source.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {source.publisher} · {formatDate(source.date)}
                        {source.pageReference && ` · ${source.pageReference}`}
                      </p>
                    </div>
                  </div>

                  {/* Excerpt */}
                  {source.excerpt && (
                    <div className="mb-3 p-3 rounded-lg bg-muted/50 border-l-2 border-primary/30">
                      <p className="text-sm text-foreground/90 italic leading-relaxed">
                        "{source.excerpt}"
                      </p>
                    </div>
                  )}

                  {/* View Link */}
                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      View Document
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground text-center">
            {evidence.length} source{evidence.length !== 1 ? "s" : ""} · All sources verified
          </p>
        </div>
      </div>
    </>
  );
}
