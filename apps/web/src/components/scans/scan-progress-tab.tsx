"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  RotateCcw,
  ArrowRight,
  Circle,
  Loader2,
  FileText,
  Play,
} from "lucide-react";

interface ScanStep {
  id: string;
  label: string;
  description: string;
  status: "pending" | "active" | "complete" | "error";
}

interface LiveUpdate {
  id: string;
  timestamp: string;
  type: "info" | "finding" | "score_change" | "alert";
  message: string;
  tenant?: string;
}

interface ScanResults {
  tenantsScanned: number;
  findingsCount: number;
  alertsGenerated: number;
  scoreChanges: { upgrades: number; downgrades: number };
  duration: string;
}

interface ScanProgressTabProps {
  isScanning: boolean;
  onCancelScan: () => void;
  onViewResults?: () => void;
  onScanStart?: () => void;
  onScanComplete?: () => void;
}

const initialSteps: ScanStep[] = [
  { id: "connect", label: "Connecting", description: "Establishing connections to data sources", status: "pending" },
  { id: "scan", label: "Scanning", description: "Retrieving latest data from all sources", status: "pending" },
  { id: "analyze", label: "Analyzing", description: "Processing findings and detecting changes", status: "pending" },
  { id: "compile", label: "Compiling", description: "Generating reports and summaries", status: "pending" },
  { id: "scores", label: "Updating", description: "Calculating new risk scores", status: "pending" },
];

const mockUpdates: LiveUpdate[] = [
  { id: "1", timestamp: "12:34:01", type: "info", message: "Scan initiated", tenant: "System" },
  { id: "2", timestamp: "12:34:02", type: "info", message: "Connected to D&B API", tenant: "System" },
  { id: "3", timestamp: "12:34:03", type: "info", message: "Connected to Moody's Analytics", tenant: "System" },
  { id: "4", timestamp: "12:34:05", type: "finding", message: "New SEC 10-Q filing detected", tenant: "Apex Retail" },
  { id: "5", timestamp: "12:34:07", type: "info", message: "Restructuring announcement found", tenant: "Northstar Holdings" },
  { id: "6", timestamp: "12:34:09", type: "score_change", message: "Risk score decreased by 5 points", tenant: "Apex Retail" },
  { id: "7", timestamp: "12:34:11", type: "alert", message: "Bankruptcy filing detected", tenant: "Northstar Holdings" },
  { id: "8", timestamp: "12:34:13", type: "finding", message: "New litigation record found", tenant: "Metro Grocers" },
  { id: "9", timestamp: "12:34:15", type: "info", message: "Processing credit updates", tenant: "System" },
  { id: "10", timestamp: "12:34:17", type: "score_change", message: "Risk score stable", tenant: "TechCorp Solutions" },
  { id: "11", timestamp: "12:34:19", type: "info", message: "Compiling scan results", tenant: "System" },
  { id: "12", timestamp: "12:34:21", type: "info", message: "Generating alerts for flagged tenants", tenant: "System" },
];

export function ScanProgressTab({ isScanning, onCancelScan, onViewResults, onScanStart, onScanComplete }: ScanProgressTabProps) {
  const [steps, setSteps] = useState<ScanStep[]>(initialSteps);
  const [progress, setProgress] = useState(0);
  const [updates, setUpdates] = useState<LiveUpdate[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResults | null>(null);
  const [scanRunning, setScanRunning] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const intervalsRef = useRef<{ progress: NodeJS.Timeout | null; time: NodeJS.Timeout | null }>({
    progress: null,
    time: null,
  });

  // Auto-scroll live feed
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [updates]);

  // Reset to ready state
  const handleNewScan = () => {
    setScanComplete(false);
    setScanResults(null);
    setSteps(initialSteps);
    setProgress(0);
    setUpdates([]);
    setElapsedTime(0);
    setScanRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (intervalsRef.current.progress) clearInterval(intervalsRef.current.progress);
      if (intervalsRef.current.time) clearInterval(intervalsRef.current.time);
    };
  }, []);

  const startScan = () => {
    // Reset state
    setSteps(initialSteps);
    setProgress(0);
    setUpdates([]);
    setElapsedTime(0);
    setScanComplete(false);
    setScanResults(null);
    setScanRunning(true);
    onScanStart?.();

    // Progress simulation - 33 seconds total
    intervalsRef.current.progress = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (intervalsRef.current.progress) clearInterval(intervalsRef.current.progress);
          return 100;
        }
        return prev + 1;
      });
    }, 330);

    // Elapsed time
    intervalsRef.current.time = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    // Step simulation - spread across 33 seconds
    const stepTimings = [1000, 7000, 14000, 21000, 28000];
    stepTimings.forEach((timing, index) => {
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((step, i) => {
            if (i < index) return { ...step, status: "complete" };
            if (i === index) return { ...step, status: "active" };
            return step;
          })
        );
      }, timing);
    });

    // Complete all steps and show results
    setTimeout(() => {
      setSteps((prev) => prev.map((step) => ({ ...step, status: "complete" })));
      if (intervalsRef.current.progress) clearInterval(intervalsRef.current.progress);
      if (intervalsRef.current.time) clearInterval(intervalsRef.current.time);
      setProgress(100);

      // Set completion state
      setTimeout(() => {
        setScanComplete(true);
        setScanRunning(false);
        onScanComplete?.();
        setScanResults({
          tenantsScanned: 62,
          findingsCount: 5,
          alertsGenerated: 2,
          scoreChanges: { upgrades: 1, downgrades: 2 },
          duration: "0:33",
        });
      }, 500);
    }, 33000);

    // Live updates simulation - spread across 33 seconds
    mockUpdates.forEach((update, index) => {
      setTimeout(() => {
        setUpdates((prev) => [...prev, update]);
      }, (index + 1) * 2500);
    });
  };

  const getStepIcon = (status: ScanStep["status"]) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="h-5 w-5 text-positive" />;
      case "active":
        return <Loader2 className="h-5 w-5 text-primary animate-spin" />;
      case "error":
        return <AlertTriangle className="h-5 w-5 text-negative" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground/30" />;
    }
  };

  const getUpdateIcon = (type: LiveUpdate["type"]) => {
    switch (type) {
      case "finding":
        return <FileText className="h-4 w-4 text-blue-400" />;
      case "score_change":
        return <TrendingDown className="h-4 w-4 text-amber-400" />;
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-negative" />;
      default:
        return (
          <span className="relative flex h-4 w-4 items-center justify-center">
            <span className="absolute inline-flex h-2.5 w-2.5 rounded-full bg-primary/40 animate-pulse" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
        );
    }
  };

  // Show completion state
  if (scanComplete && scanResults) {
    return (
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6 pb-12">
          {/* Success Header */}
          <div className="rounded-xl border border-positive/30 bg-positive/5 p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-positive/20 flex items-center justify-center">
                <CheckCircle className="h-7 w-7 text-positive" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground">Scan Complete</h2>
                <p className="text-sm text-muted-foreground">
                  Completed in {scanResults.duration} · All data sources processed successfully
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleNewScan}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-border hover:bg-muted/50 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  New Scan
                </button>
                <button
                  onClick={onViewResults}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  View Results
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="grid grid-cols-4 gap-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="text-3xl font-bold text-foreground">{scanResults.tenantsScanned}</div>
              <div className="text-sm text-muted-foreground">Tenants Scanned</div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="text-3xl font-bold text-blue-400">{scanResults.findingsCount}</div>
              <div className="text-sm text-muted-foreground">New Findings</div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-negative">{scanResults.alertsGenerated}</span>
                <AlertTriangle className="h-5 w-5 text-negative" />
              </div>
              <div className="text-sm text-muted-foreground">Alerts Generated</div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-positive" />
                <span className="text-lg font-semibold text-positive">{scanResults.scoreChanges.upgrades}</span>
                <TrendingDown className="h-5 w-5 text-negative ml-2" />
                <span className="text-lg font-semibold text-negative">{scanResults.scoreChanges.downgrades}</span>
              </div>
              <div className="text-sm text-muted-foreground">Score Changes</div>
            </div>
          </div>

          {/* Scan Progress (completed) */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Scan Progress</h3>
            <div className="space-y-4">
              {initialSteps.map((step) => (
                <div key={step.id} className="flex items-start gap-4">
                  <div className="mt-0.5">
                    <CheckCircle className="h-5 w-5 text-positive" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-positive">
                      {step.label}
                    </div>
                    <div className="text-xs text-muted-foreground">{step.description}</div>
                  </div>
                  <span className="text-xs text-positive">Done</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scan Activity Log */}
          <div className="rounded-xl border border-border bg-card">
            <div className="px-4 py-3 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Scan Activity</h3>
            </div>
            <div className="p-4 h-[500px] overflow-auto space-y-2">
              {updates.map((update) => (
                <div key={update.id} className="flex items-start gap-3 text-sm">
                  {getUpdateIcon(update.type)}
                  <span className="text-muted-foreground shrink-0">{update.timestamp}</span>
                  <span className="text-foreground flex-1">{update.message}</span>
                  {update.tenant && update.tenant !== "System" && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {update.tenant}
                    </span>
                  )}
                </div>
              ))}
              <div className="flex items-start gap-3 text-sm text-positive">
                <CheckCircle className="h-4 w-4" />
                <span className="text-muted-foreground shrink-0">{new Date().toLocaleTimeString("en-US", { hour12: false }).slice(0, 8)}</span>
                <span>Scan completed successfully</span>
              </div>
            </div>
          </div>

          {/* Bottom spacer */}
          <div className="h-8" aria-hidden="true" />
        </div>
      </div>
    );
  }

  // Ready state (not scanning yet)
  if (!scanRunning) {
    return (
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6 pb-12">
          {/* Ready Header */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center">
                  <Play className="h-7 w-7 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Ready to Scan</h2>
                  <p className="text-sm text-muted-foreground">
                    62 tenants · 6 data sources configured
                  </p>
                </div>
              </div>
              <button
                onClick={startScan}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Play className="h-4 w-4" />
                Scan
              </button>
            </div>
          </div>

          {/* Steps (pending state) */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Scan Progress</h3>
            <div className="space-y-4">
              {steps.map((step) => (
                <div key={step.id} className="flex items-start gap-4">
                  <div className="mt-0.5">
                    <Circle className="h-5 w-5 text-muted-foreground/30" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-muted-foreground">
                      {step.label}
                    </div>
                    <div className="text-xs text-muted-foreground/70">{step.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed (empty state) */}
          <div className="rounded-xl border border-border bg-card">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Scan Activity</h3>
              <span className="text-xs text-muted-foreground">Waiting to start</span>
            </div>
            <div className="p-4 h-[500px] flex items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Activity will appear here once the scan starts
              </p>
            </div>
          </div>

          {/* Bottom spacer */}
          <div className="h-8" aria-hidden="true" />
        </div>
      </div>
    );
  }

  // Active scan progress view
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-3xl mx-auto space-y-6 pb-12">
        {/* Progress Header */}
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Scan in Progress</h2>
              <p className="text-sm text-muted-foreground">
                Scanning 62 tenants across 6 data sources
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground tabular-nums">{progress}%</div>
              <div className="text-sm text-muted-foreground">Elapsed: {formatTime(elapsedTime)}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Scan Progress</h3>
          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.id} className="flex items-start gap-4">
                <div className="mt-0.5">{getStepIcon(step.status)}</div>
                <div className="flex-1">
                  <div className={cn(
                    "text-sm font-medium",
                    step.status === "complete" && "text-positive",
                    step.status === "active" && "text-primary",
                    step.status === "pending" && "text-muted-foreground"
                  )}>
                    {step.label}
                    {step.status === "active" && <span className="ml-2 text-primary">...</span>}
                  </div>
                  <div className="text-xs text-muted-foreground">{step.description}</div>
                </div>
                {step.status === "complete" && (
                  <span className="text-xs text-positive">Done</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="rounded-xl border border-border bg-card">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Live Activity</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-positive animate-pulse" />
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
          </div>
          <div
            ref={feedRef}
            className="p-4 h-[500px] overflow-auto space-y-2"
          >
            {updates.length === 0 ? (
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                Waiting for activity...
              </div>
            ) : (
              updates.map((update) => (
                <div key={update.id} className="flex items-start gap-3 text-sm">
                  {getUpdateIcon(update.type)}
                  <span className="text-muted-foreground shrink-0">{update.timestamp}</span>
                  <span className="text-foreground flex-1">{update.message}</span>
                  {update.tenant && update.tenant !== "System" && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {update.tenant}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bottom spacer */}
        <div className="h-8" aria-hidden="true" />
      </div>
    </div>
  );
}
