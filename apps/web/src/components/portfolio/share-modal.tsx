"use client";

import { useState } from "react";
import {
  Share2,
  Copy,
  Check,
  Mail,
  Link2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { PortfolioEntity } from "@/types";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  entity: PortfolioEntity | null;
}

export function ShareModal({ open, onClose, entity }: ShareModalProps) {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState<"view" | "edit">("view");
  const [copied, setCopied] = useState(false);

  if (!entity) return null;

  const shareLink = `https://app.creditoversight.com/shared/${entity.type}/${entity.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the share invitation
    console.log("Sharing with:", { email, permission, entityId: entity.id });
    setEmail("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Share2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Share {entity.name}</DialogTitle>
              <DialogDescription>
                Invite colleagues to view or collaborate on this {entity.type}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleShare} className="space-y-4 mt-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@company.com"
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Permission Select */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Permission level
            </label>
            <select
              value={permission}
              onChange={(e) => setPermission(e.target.value as "view" | "edit")}
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="view">Can view</option>
              <option value="edit">Can edit</option>
            </select>
          </div>

          {/* Send Invite Button */}
          <button
            type="submit"
            disabled={!email}
            className="w-full py-2 px-4 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send Invitation
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or share via link
            </span>
          </div>
        </div>

        {/* Copy Link Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Share link
          </label>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted/30">
              <Link2 className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm text-muted-foreground truncate">
                {shareLink}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Anyone with this link can view this {entity.type}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
