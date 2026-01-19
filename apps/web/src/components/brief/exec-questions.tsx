"use client";

interface ExecQuestionsProps {
  questions: string[];
}

export function ExecQuestions({ questions }: ExecQuestionsProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">
        Questions to Raise
      </h2>
      <ul className="space-y-3">
        {questions.map((question, idx) => (
          <li key={idx} className="flex items-start gap-3 text-sm">
            <span className="text-primary mt-0.5">?</span>
            <span className="text-foreground">{question}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
