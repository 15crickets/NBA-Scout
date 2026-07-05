import Image from "next/image";
import type { PlayerHeadline } from "./types";

interface PlayerCardProps {
  player: PlayerHeadline | null;
  isLoading?: boolean;
}

// Keep this in sync with HOT_ZONES_HEIGHT in page.tsx so the card and the
// court visually line up regardless of which state (loading/empty/loaded) is showing.
const CARD_MIN_HEIGHT = 300;

export default function PlayerCard({ player, isLoading }: PlayerCardProps) {
  if (isLoading) {
    return (
      <div
        className="flex w-full flex-col justify-center rounded-lg border border-zinc-800 bg-zinc-900 p-5 animate-pulse"
        style={{ minHeight: CARD_MIN_HEIGHT }}
      >
        <div className="flex items-center gap-4">
          <div className="h-24 w-24 rounded-full bg-zinc-800" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-32 rounded bg-zinc-800" />
            <div className="h-4 w-20 rounded bg-zinc-800" />
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="h-16 rounded-md bg-zinc-800/60" />
          <div className="h-16 rounded-md bg-zinc-800/60" />
          <div className="h-16 rounded-md bg-zinc-800/60" />
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div
        className="flex w-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-zinc-800 bg-zinc-900/50 p-5 text-center"
        style={{ minHeight: CARD_MIN_HEIGHT }}
      >
        <span className="text-5xl">🏀</span>
        <p className="text-sm text-zinc-500">Search for a player to see their card</p>
      </div>
    );
  }

  return (
    <div
      className="flex w-full flex-col justify-center rounded-lg border border-zinc-800 bg-zinc-900 p-5"
      style={{ minHeight: CARD_MIN_HEIGHT }}
    >
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-zinc-800">
          <Image
            src={player.headshotUrl}
            alt={player.name}
            fill
            sizes="96px"
            className="object-cover"
            // NBA headshots occasionally 404 for inactive/obscure players —
            // handle this in the parent or swap in a fallback img onError.
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white">{player.name}</h2>
          <p className="text-sm text-zinc-400">
            {player.teamAbbreviation} &middot; #{player.jerseyNumber} &middot;{" "}
            {player.position}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 text-center">
        <StatBlock label="PPG" value={player.careerPpg} />
        <StatBlock label="APG" value={player.careerApg} />
        <StatBlock label="RPG" value={player.careerRpg} />
      </div>
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-zinc-800/60 py-2">
      <div className="text-xl font-bold text-white">{value.toFixed(1)}</div>
      <div className="text-xs uppercase tracking-wide text-zinc-500">
        {label}
      </div>
    </div>
  );
}