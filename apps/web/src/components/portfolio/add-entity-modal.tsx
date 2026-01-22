"use client";

import { useState } from "react";
import {
  Building,
  Users,
  AlertTriangle,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { EntityType } from "@/types";

interface AddEntityModalProps {
  open: boolean;
  onClose: () => void;
  entityType: EntityType | null;
}

const entityTypeConfig = {
  property: {
    icon: Building,
    title: "Add Property",
    description: "Add a new property to your portfolio",
    fields: [
      { name: "name", label: "Property Name", type: "text", placeholder: "e.g., Park Plaza Shopping Center" },
      { name: "city", label: "City", type: "text", placeholder: "e.g., Dallas" },
      { name: "state", label: "State", type: "text", placeholder: "e.g., TX" },
      { name: "assetClass", label: "Asset Class", type: "select", options: ["Retail", "Office", "Industrial", "Medical", "Multifamily"] },
      { name: "sqft", label: "Square Footage", type: "text", placeholder: "e.g., 125,000" },
    ],
  },
  tenant: {
    icon: Users,
    title: "Add Tenant",
    description: "Add a new tenant to monitor",
    fields: [
      { name: "name", label: "Company Name", type: "text", placeholder: "e.g., Acme Corporation" },
      { name: "ticker", label: "Ticker Symbol", type: "text", placeholder: "e.g., ACME (optional)" },
      { name: "industry", label: "Industry", type: "select", options: ["Retail", "Technology", "Healthcare", "Manufacturing", "Finance", "Other"] },
      { name: "entityType", label: "Entity Type", type: "select", options: ["Public", "Private"] },
      { name: "annualRent", label: "Annual Rent", type: "text", placeholder: "e.g., $2,400,000" },
    ],
  },
  alert: {
    icon: AlertTriangle,
    title: "Add Alert",
    description: "Create a custom alert or notification",
    fields: [
      { name: "name", label: "Alert Title", type: "text", placeholder: "e.g., Quarterly Review - Tenant X" },
      { name: "description", label: "Description", type: "textarea", placeholder: "Describe the alert..." },
      { name: "severity", label: "Severity", type: "select", options: ["High", "Medium", "Low", "Informational"] },
      { name: "dueDate", label: "Due Date", type: "date", placeholder: "" },
    ],
  },
};

export function AddEntityModal({ open, onClose, entityType }: AddEntityModalProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});

  if (!entityType) return null;

  const config = entityTypeConfig[entityType];
  const Icon = config.icon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save the entity
    console.log("Form submitted:", formData);
    setFormData({});
    onClose();
  };

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div
              className={cn(
                "p-2 rounded-lg",
                entityType === "alert" ? "bg-amber-500/10" : "bg-muted"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5",
                  entityType === "alert" ? "text-amber-500" : "text-muted-foreground"
                )}
              />
            </div>
            <div>
              <DialogTitle>{config.title}</DialogTitle>
              <DialogDescription>{config.description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
              ) : field.type === "textarea" ? (
                <textarea
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              ) : (
                <input
                  type={field.type}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
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
              Add {entityType === "property" ? "Property" : entityType === "tenant" ? "Tenant" : "Alert"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
