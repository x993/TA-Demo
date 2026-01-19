interface WeeklyHeadlineProps {
  headline: string;
  updatedAt: string;
}

export function WeeklyHeadline({ headline, updatedAt }: WeeklyHeadlineProps) {
  const formattedDate = new Date(updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });

  return (
    <div className="glass-card rounded-xl p-6 transition-all duration-300">
      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-medium">
        This Week
      </p>
      <p className="text-lg font-medium text-foreground leading-relaxed">
        {headline}
      </p>
      <p className="text-xs text-muted-foreground mt-4">
        Updated {formattedDate}
      </p>
    </div>
  );
}
