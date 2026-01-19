import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "border-border text-foreground",
        // Status variants
        critical: "border-negative/20 bg-negative/10 text-negative",
        watch: "border-warning/20 bg-warning/10 text-warning",
        stable: "border-border bg-muted text-muted-foreground",
        improving: "border-positive/20 bg-positive/10 text-positive",
        // Event type variants
        sec_filing: "border-primary/20 bg-primary/10 text-primary",
        news: "border-border bg-muted text-muted-foreground",
        press_release: "border-border bg-muted text-muted-foreground",
        court_filing: "border-warning/20 bg-warning/10 text-warning",
        credit_report: "border-border bg-muted text-muted-foreground",
      },
      size: {
        default: "px-2 py-0.5 text-xs",
        sm: "px-1.5 py-0.5 text-2xs",
        lg: "px-2.5 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
