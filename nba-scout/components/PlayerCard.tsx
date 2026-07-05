import Image from "next/image";
import type { PlayerHeadline } from "./types";

interface PlayerCardProps {
  player: PlayerHeadline | null;
  isLoading?: boolean;
}

export default function PlayerCard({ player, isLoading }: PlayerCardProps) {
  if (isLoading) {
    return (
      <div className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-5 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="h-24 w-24 rounded-full bg-zinc-800" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-32 rounded bg-zinc-800" />
            <div className="h-4 w-20 rounded bg-zinc-800" />
          </div>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="w-full rounded-lg border border-dashed border-zinc-800 bg-zinc-900/50 p-5 text-center text-sm text-zinc-500">
        Search for a player to see their card
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-5">
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