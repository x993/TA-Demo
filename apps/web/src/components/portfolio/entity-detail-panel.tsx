"use client";

import { useState } from "react";
import {
  X,
  Building,
  Users,
  AlertTriangle,
  Pencil,
  MessageSquare,
  Share2,
  Clock,
  FileText,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatRelativeTime, mockNotes } from "@/lib/mock-data";
import type { PortfolioEntity, EntityNote } from "@/types";

interface EntityDetailPanelProps {
  entity: PortfolioEntity | null;
  onClose: () => void;
  onAddNote: () => void;
  onShare: () => void;
  onEdit: () => void;
}

function getEntityIcon(type: string) {
  switch (type) {
    case "property":
      return Building;
    case "tenant":
      return Users;
    case "alert":
      return AlertTriangle;
    default:
      return FileText;
  }
}

export function EntityDetailPanel({
  entity,
  onClose,
  onAddNote,
  onShare,
  onEdit,
}: EntityDetailPanelProps) {
  if (!entity) {
    return (
      <aside className="w-80 border-l border-border/50 bg-muted/10 flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
          <FileText className="h-7 w-7 text-muted-foreground/50" />
        </div>
        <h3 className="text-sm font-medium text-foreground mb-1">
          No entity selected
        </h3>
        <p className="text-xs text-muted-foreground max-w-[180px]">
          Select an entity from the list to view details and take actions
        </p>
      </aside>
    );
  }

  const Icon = getEntityIcon(entity.type);
  const notes = mockNotes.filter(
    (n) => n.entityId === entity.id || n.entityId === entity.id.replace("event-", "tenant-")
  );

  return (
    <aside className="w-80 border-l border-border/50 bg-muted/10 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div
            className={cn(
              "p-2.5 rounded-lg",
              entity.type === "alert" ? "bg-amber-500/10" : "bg-muted"
            )}
          >
            <Icon
              className={cn(
                "h-5 w-5",
                entity.type === "alert" ? "text-amber-500" : "text-muted-foreground"
              )}
            />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <h2 className="font-semibold text-foreground mb-1">{entity.name}</h2>
        <p className="text-sm text-muted-foreground mb-3">{entity.subtitle}</p>

        <div className="flex items-center gap-2">
          <StatusBadge status={entity.status} size="sm" />
          {entity.lastActivity && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatRelativeTime(entity.lastActivity)}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Details Section */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Details
          </h3>
          <div className="space-y-3">
            {Object.entries(entity.metadata).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/50" />

        {/* Notes Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Notes
            </h3>
            <button
              onClick={onAddNote}
              className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
            >
              <Plus className="h-3 w-3" />
              Add
            </button>
          </div>

          {notes.length === 0 ? (
            <div className="py-4 px-3 rounded-lg border border-dashed border-border/50 text-center">
              <MessageSquare className="h-5 w-5 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">No notes yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="p-3 rounded-lg bg-muted/30 border border-border/30"
                >
                  <p className="text-sm text-foreground mb-2 leading-relaxed">
                    {note.content}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{note.createdBy}</span>
                    <span>{formatRelativeTime(note.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-border/50" />

        {/* Activity Section */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
              <div>
                <p className="text-sm text-foreground">Status updated</p>
                <p className="text-xs text-muted-foreground">
                  {entity.lastActivity
                    ? formatRelativeTime(entity.lastActivity)
                    : "Recently"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-muted-foreground/30 mt-1.5 shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Entity created</p>
                <p className="text-xs text-muted-foreground">Jan 1, 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="p-4 border-t border-border/50 space-y-2">
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={onShare}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium border border-border hover:bg-muted transition-colors"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
        <button
          onClick={onAddNote}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <MessageSquare className="h-4 w-4" />
          Add Note
        </button>
      </div>
    </aside>
  );
}
