'use client';

import { useUIStore } from '@/stores/ui-store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle, Clock } from 'lucide-react';

const runStages = [
  { id: 'sources', label: 'Source collection', status: 'complete', count: 847 },
  { id: 'extraction', label: 'Fact extraction', status: 'complete', count: 312 },
  { id: 'adjudication', label: 'Adjudication', status: 'complete', count: 30 },
  { id: 'validation', label: 'Validation', status: 'complete', count: 28 },
  { id: 'synthesis', label: 'Portfolio synthesis', status: 'complete', count: 1 },
];

export function RunDetailsModal() {
  const { runDetailsModalOpen, closeRunDetailsModal } = useUIStore();

  return (
    <Dialog open={runDetailsModalOpen} onOpenChange={(open) => !open && closeRunDetailsModal()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Review Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Completed time */}
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Completed Jan 17, 2026 at 6:02 AM CT</span>
          </div>

          {/* Stages */}
          <div className="space-y-3">
            {runStages.map(stage => (
              <div
                key={stage.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-positive" />
                  <span className="text-sm">{stage.label}</span>
                </div>
                <span className="text-sm text-muted-foreground tabular-nums">
                  {stage.count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Note */}
          <p className="text-xs text-muted-foreground text-center">
            Reviews run automatically on a configurable schedule.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
