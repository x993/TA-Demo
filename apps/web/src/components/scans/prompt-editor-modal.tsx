"use client";

import { useState } from "react";
import { Pencil, RotateCcw, Sparkles, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface PromptEditorModalProps {
  open: boolean;
  onClose: () => void;
  initialPrompt?: string;
  onSave: (prompt: string) => void;
}

const promptTemplates = [
  {
    id: "default",
    name: "Default Analysis",
    prompt:
      "Analyze tenant disclosures for material risks including financial distress, litigation, leadership changes, and regulatory issues. Prioritize items that may impact lease obligations or tenant viability.",
  },
  {
    id: "retail-focus",
    name: "Retail Focus",
    prompt:
      "Monitor retail tenant health with emphasis on store closure announcements, same-store sales trends, e-commerce competition impacts, and foot traffic indicators. Flag any bankruptcy risk signals.",
  },
  {
    id: "conservative",
    name: "Conservative Risk",
    prompt:
      "Apply strict risk criteria: flag any going concern language, debt covenant breaches, credit downgrades, or leadership departures. Minimize false negatives even at cost of more alerts.",
  },
  {
    id: "growth-focus",
    name: "Growth Opportunities",
    prompt:
      "In addition to risk monitoring, identify positive signals: expansion plans, new contracts, credit upgrades, and successful refinancings that may indicate strengthening tenant relationships.",
  },
];

export function PromptEditorModal({
  open,
  onClose,
  initialPrompt = promptTemplates[0].prompt,
  onSave,
}: PromptEditorModalProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleTemplateSelect = (templateId: string) => {
    const template = promptTemplates.find((t) => t.id === templateId);
    if (template) {
      setPrompt(template.prompt);
      setSelectedTemplate(templateId);
    }
  };

  const handleReset = () => {
    setPrompt(promptTemplates[0].prompt);
    setSelectedTemplate("default");
  };

  const handleSave = () => {
    onSave(prompt);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Pencil className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Custom Analysis Prompts</DialogTitle>
              <DialogDescription>
                Customize how the AI analyzes your tenant data and what to
                prioritize
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Templates */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Quick Templates
            </label>
            <div className="flex flex-wrap gap-2">
              {promptTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    selectedTemplate === template.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>

          {/* Editor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-foreground">
                Analysis Instructions
              </label>
              <button
                onClick={handleReset}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Reset to Default
              </button>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                setSelectedTemplate(null);
              }}
              rows={8}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none font-mono"
              placeholder="Enter your custom analysis instructions..."
            />
            <p className="text-xs text-muted-foreground mt-1.5">
              These instructions guide how the AI interprets tenant disclosures
              and what types of events to prioritize.
            </p>
          </div>

          {/* AI Enhancement Suggestion */}
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">
                  AI Tip
                </h4>
                <p className="text-xs text-muted-foreground">
                  Be specific about thresholds and priorities. For example,
                  instead of &quot;flag revenue declines&quot;, try &quot;flag
                  revenue declines &gt;10% YoY or any mention of going concern
                  language&quot;.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 rounded-lg text-sm font-medium border border-border hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Save className="h-4 w-4" />
              Save Prompt
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
