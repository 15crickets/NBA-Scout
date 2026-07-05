import type { StatRow } from "./types";

interface StatTableProps {
  rows: StatRow[];
  isLoading?: boolean;
}

const COLUMNS: { key: keyof StatRow; label: string; format?: (v: any) => string }[] = [
  { key: "season", label: "Season" },
  { key: "age", label: "Age" },
  { key: "team", label: "Team" },
  { key: "gp", label: "GP" },
  { key: "gs", label: "GS" },
  { key: "fg", label: "FG", format: (v) => v.toFixed(1) },
  { key: "fga", label: "FGA", format: (v) => v.toFixed(1) },
  { key: "fgPct", label: "FG%", format: (v) => `${(v * 100).toFixed(1)}%` },
  { key: "threeM", label: "3PM", format: (v) => v.toFixed(1) },
  { key: "threeA", label: "3PA", format: (v) => v.toFixed(1) },
  { key: "threePct", label: "3P%", format: (v) => `${(v * 100).toFixed(1)}%` },
  { key: "ft", label: "FT", format: (v) => v.toFixed(1) },
  { key: "fta", label: "FTA", format: (v) => v.toFixed(1) },
  { key: "ftPct", label: "FT%", format: (v) => `${(v * 100).toFixed(1)}%` },
  { key: "rpg", label: "RPG", format: (v) => v.toFixed(1) },
  { key: "apg", label: "APG", format: (v) => v.toFixed(1) },
  { key: "spg", label: "SPG", format: (v) => v.toFixed(1) },
  { key: "bpg", label: "BPG", format: (v) => v.toFixed(1) },
  { key: "tpg", label: "TOV", format: (v) => v.toFixed(1) },
  { key: "ppg", label: "PPG", format: (v) => v.toFixed(1) },
];

export default function StatTable({ rows, isLoading }: StatTableProps) {
  if (isLoading) {
    return (
      <div className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-5">
        <div className="h-5 w-40 animate-pulse rounded bg-zinc-800 mb-4" />
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-6 w-full animate-pulse rounded bg-zinc-800/60" />
          ))}
        </div>
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="w-full rounded-lg border border-dashed border-zinc-800 bg-zinc-900/50 p-5 text-center text-sm text-zinc-500">
        No stats to display yet
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800 text-zinc-500">
            {COLUMNS.map((col) => (
              <th key={col.key} className="px-3 py-2 text-left font-medium whitespace-nowrap">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={`${row.season}-${i}`}
              className="border-b border-zinc-800/50 last:border-0 text-zinc-200"
            >
              {COLUMNS.map((col) => {
                const raw = row[col.key];
                const display =
                  col.format && typeof raw === "number" ? col.format(raw) : raw;
                return (
                  <td key={col.key} className="px-3 py-2 whitespace-nowrap">
                    {display}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}