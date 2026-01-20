"use client";

import { useState } from "react";
import {
  Database,
  Upload,
  Globe,
  Link2,
  Key,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type SourceType = "api" | "upload" | "database";

interface AddSourceModalProps {
  open: boolean;
  onClose: () => void;
  initialType?: SourceType | null;
}

const sourceTypeConfig = {
  api: {
    icon: Globe,
    title: "Connect API",
    description: "Connect to an external API data source",
    fields: [
      { name: "name", label: "Source Name", type: "text", placeholder: "e.g., Company CRM" },
      { name: "url", label: "API Endpoint", type: "text", placeholder: "https://api.example.com/v1" },
      { name: "authType", label: "Authentication", type: "select", options: ["API Key", "OAuth 2.0", "Basic Auth", "None"] },
      { name: "apiKey", label: "API Key", type: "password", placeholder: "Enter your API key" },
    ],
  },
  upload: {
    icon: Upload,
    title: "Upload Dataset",
    description: "Upload a CSV, Excel, or JSON file",
    fields: [
      { name: "name", label: "Dataset Name", type: "text", placeholder: "e.g., Q4 Lease Data" },
      { name: "file", label: "File", type: "file", accept: ".csv,.xlsx,.json" },
      { name: "schedule", label: "Auto-refresh", type: "select", options: ["Manual only", "Daily", "Weekly", "Monthly"] },
    ],
  },
  database: {
    icon: Database,
    title: "Connect Database",
    description: "Connect to a database for live data",
    fields: [
      { name: "name", label: "Connection Name", type: "text", placeholder: "e.g., Lease Database" },
      { name: "type", label: "Database Type", type: "select", options: ["PostgreSQL", "MySQL", "SQL Server", "MongoDB"] },
      { name: "host", label: "Host", type: "text", placeholder: "localhost" },
      { name: "port", label: "Port", type: "text", placeholder: "5432" },
      { name: "database", label: "Database Name", type: "text", placeholder: "leases" },
      { name: "username", label: "Username", type: "text", placeholder: "Enter username" },
      { name: "password", label: "Password", type: "password", placeholder: "Enter password" },
    ],
  },
};

export function AddSourceModal({ open, onClose, initialType }: AddSourceModalProps) {
  const [sourceType, setSourceType] = useState<SourceType>(initialType || "api");
  const [formData, setFormData] = useState<Record<string, string>>({});

  const config = sourceTypeConfig[sourceType];
  const Icon = config.icon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save the data source
    console.log("Source added:", { type: sourceType, ...formData });
    setFormData({});
    onClose();
  };

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Data Source</DialogTitle>
          <DialogDescription>
            Connect a new data source to enhance your portfolio monitoring
          </DialogDescription>
        </DialogHeader>

        {/* Source Type Tabs */}
        <div className="flex gap-2 p-1 bg-muted/50 rounded-lg mt-4">
          {(Object.keys(sourceTypeConfig) as SourceType[]).map((type) => {
            const TypeIcon = sourceTypeConfig[type].icon;
            return (
              <button
                key={type}
                onClick={() => setSourceType(type)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors",
                  sourceType === type
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <TypeIcon className="h-4 w-4" />
                {sourceTypeConfig[type].title.split(" ")[1]}
              </button>
            );
          })}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground">
                {config.title}
              </h4>
              <p className="text-xs text-muted-foreground">
                {config.description}
              </p>
            </div>
          </div>

          {config.fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {field.label}
              </label>
              {field.type === "select" ? (
                <select
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Select {field.label.toLowerCase()}</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : field.type === "file" ? (
                <div className="relative">
                  <input
                    type="file"
                    accept={field.accept}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleChange(field.name, file.name);
                    }}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-muted file:text-muted-foreground hover:file:bg-muted/80"
                  />
                </div>
              ) : (
                <div className="relative">
                  {field.type === "password" && (
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  )}
                  {field.name === "url" && (
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  )}
                  <input
                    type={field.type}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    className={cn(
                      "w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50",
                      (field.type === "password" || field.name === "url") && "pl-10"
                    )}
                  />
                </div>
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 rounded-lg text-sm font-medium border border-border hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Connect
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
