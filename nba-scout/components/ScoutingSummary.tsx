import type { ScoutingSummary as ScoutingSummaryType } from "./types";

interface ScoutingSummaryProps {
  summary: ScoutingSummaryType | null;
  isLoading?: boolean;
}

export default function ScoutingSummary({ summary, isLoading }: ScoutingSummaryProps) {
  if (isLoading) {
    return (
      <div className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-5">
        <div className="h-5 w-48 animate-pulse rounded bg-zinc-800 mb-3" />
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-zinc-800/60" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-800/60" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-800/60" />
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="w-full rounded-lg border border-dashed border-zinc-800 bg-zinc-900/50 p-5 text-center text-sm text-zinc-500">
        Scouting summary will appear here
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 mb-2">
        Scouting Summary
      </h3>
      <p className="text-sm leading-relaxed text-zinc-200 mb-4">{summary.summary}</p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-emerald-500 mb-1">
            Strengths
          </h4>
          <ul className="space-y-1">
            {summary.strengths.map((s, i) => (
              <li key={i} className="text-sm text-zinc-300">
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-red-500 mb-1">
            Weaknesses
          </h4>
          <ul className="space-y-1">
            {summary.weaknesses.map((w, i) => (
              <li key={i} className="text-sm text-zinc-300">
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}