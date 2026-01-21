"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check, Circle, Loader2, XCircle, AlertTriangle, ArrowUp, ArrowDown } from "lucide-react";

interface ScanStep {
  id: string;
  label: string;
  status: "pending" | "in_progress" | "complete" | "error";
  details?: string;
  count?: number;
}

interface LiveUpdate {
  id: string;
  timestamp: string;
  type: "info" | "finding" | "score_change" | "alert";
  message: string;
  tenantId?: string;
}

interface ScanProgressTabProps {
  isScanning: boolean;
  onCancelScan: () => void;
}

const initialSteps: ScanStep[] = [
  { id: "connect", label: "Connecting to data sources", status: "pending" },
  { id: "sec", label: "Fetching SEC filings", status: "pending", count: 0 },
  { id: "news", label: "Scanning news sources", status: "pending", count: 0 },
  { id: "courts", label: "Checking court records", status: "pending" },
  { id: "ai", label: "AI analysis of findings", status: "pending" },
  { id: "scores", label: "Updating tenant risk scores", status: "pending" },
  { id: "alerts", label: "Generating alerts", status: "pending" },
];

const mockUpdates: LiveUpdate[] = [
  { id: "1", timestamp: "12:34:01", type: "info", message: "Connected to D&B API" },
  { id: "2", timestamp: "12:34:03", type: "finding", message: "Found Q3 filing for Apex Retail - analyzing...", tenantId: "apex" },
  { id: "3", timestamp: "12:34:05", type: "info", message: 'News: "Northstar announces restructuring plan"' },
  { id: "4", timestamp: "12:34:08", type: "score_change", message: "Updating risk score for APEX: stable → watch", tenantId: "apex" },
  { id: "5", timestamp: "12:34:10", type: "alert", message: "New alert: Significant event detected for Northstar Holdings" },
  { id: "6", timestamp: "12:34:12", type: "finding", message: "Court filing found: Metro Grocers vs. Supplier Inc." },
  { id: "7", timestamp: "12:34:15", type: "info", message: "Processing Moody's credit updates..." },
  { id: "8", timestamp: "12:34:18", type: "score_change", message: "Risk score confirmed stable for TechCorp Solutions" },
];

export function ScanProgressTab({ isScanning, onCancelScan }: ScanProgressTabProps) {
  const [steps, setSteps] = useState<ScanStep[]>(initialSteps);
  const [progress, setProgress] = useState(0);
  const [updates, setUpdates] = useState<LiveUpdate[]>([]);
  const [estimatedTime, setEstimatedTime] = useState("2m 30s");

  // Simulate scan progress
  useEffect(() => {
    if (!isScanning) {
      setSteps(initialSteps);
      setProgress(0);
      setUpdates([]);
      setEstimatedTime("2m 30s");
      return;
    }

    // Progress simulation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 300);

    // Update estimated time
    const timeInterval = setInterval(() => {
      setEstimatedTime((prev) => {
        const match = prev.match(/(\d+)m (\d+)s/);
        if (!match) return prev;
        let mins = parseInt(match[1]);
        let secs = parseInt(match[2]);
        if (secs > 0) secs -= 5;
        else if (mins > 0) {
          mins -= 1;
          secs = 55;
        }
        if (mins <= 0 && secs <= 0) return "0m 0s";
        return `${mins}m ${secs}s`;
      });
    }, 5000);

    // Step simulation
    const stepTimings = [500, 2000, 4000, 6000, 8000, 10000, 12000];
    stepTimings.forEach((timing, index) => {
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((step, i) => {
            if (i < index) return { ...step, status: "complete" };
            if (i === index) return { ...step, status: "in_progress" };
            return step;
          })
        );
      }, timing);
    });

    // Live updates simulation
    mockUpdates.forEach((update, index) => {
      setTimeout(() => {
        setUpdates((prev) => [...prev, update]);
      }, (index + 1) * 1800);
    });

    return () => {
      clearInterval(progressInterval);
      clearInterval(timeInterval);
    };
  }, [isScanning]);

  const getStepIcon = (status: ScanStep["status"]) => {
    switch (status) {
      case "complete":
        return <Check className="h-4 w-4 text-positive" />;
      case "in_progress":
        return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
      case "error":
        return <XCircle className="h-4 w-4 text-negative" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground/50" />;
    }
  };

  const getUpdateIcon = (type: LiveUpdate["type"]) => {
    switch (type) {
      case "finding":
        return <Circle className="h-3 w-3 text-blue-400 fill-blue-400" />;
      case "score_change":
        return <ArrowUp className="h-3 w-3 text-amber-400" />;
      case "alert":
        return <AlertTriangle className="h-3 w-3 text-negative" />;
      default:
        return <Circle className="h-3 w-3 text-muted-foreground" />;
    }
  };

  if (!isScanning && updates.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
            <Loader2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No scan in progress
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Click "Run Scan Now" to start monitoring your tenant portfolio for the latest credit updates and risk signals.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Progress Header */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Current Scan Progress
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Scanning all enabled data sources
                </p>
              </div>
              {isScanning && (
                <button
                  onClick={onCancelScan}
                  className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel Scan
                </button>
              )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{progress}%</span>
                <span className="text-muted-foreground">Est: {estimatedTime}</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h4 className="text-sm font-medium text-foreground mb-4">
              Scan Steps
            </h4>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center gap-3 py-2 px-3 rounded-lg transition-colors",
                    step.status === "in_progress" && "bg-primary/5"
                  )}
                >
                  {getStepIcon(step.status)}
                  <span
                    className={cn(
                      "text-sm",
                      step.status === "complete" && "text-muted-foreground",
                      step.status === "in_progress" && "text-foreground font-medium",
                      step.status === "pending" && "text-muted-foreground/70"
                    )}
                  >
                    {step.label}
                    {step.count !== undefined && step.count > 0 && (
                      <span className="ml-1 text-muted-foreground">
                        ({step.count} documents)
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Updates */}
          {updates.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h4 className="text-sm font-medium text-foreground mb-4">
                Live Updates
              </h4>
              <div className="space-y-2 max-h-64 overflow-auto">
                {updates.map((update) => (
                  <div
                    key={update.id}
                    className="flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="mt-1">{getUpdateIcon(update.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{update.message}</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {update.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
