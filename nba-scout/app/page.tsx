"use client";
import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import HotZones from "@/components/HotZones";
import PlayerCard from "@/components/PlayerCard";
import StatTable from "@/components/StatTable";
import ScoutingSummary from "@/components/ScoutingSummary";
import type { PlayerHeadline, StatRow, ZoneEfficiency, ScoutingSummary as ScoutingSummaryType } from "@/components/types";

export default function Home() {

  const [player, setPlayer] = useState<PlayerHeadline | null> (null)
  const [statRows, setStatRows] = useState<StatRow[]>([])
  const [zoneEfficiency, setZoneEfficiency] = useState<ZoneEfficiency | undefined> (undefined)
  const [scouting, setScouting] = useState<ScoutingSummaryType | null>(null)
  let isLoading = false;


  /*
  const player: PlayerHeadline | null = null;
  const statRows: StatRow[] = [];
  const zoneEfficiency: ZoneEfficiency | undefined = undefined;
  const scouting: ScoutingSummaryType | null = null;
  const isLoading = false;
  */
  function handleSearch(playerName: string) {
    isLoading = true;
    console.log(playerName);
    // your hook's fetch/search trigger goes here
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-950 font-sans min-h-screen">
      <main className="flex flex-1 w-full max-w-5xl flex-col gap-6 py-16 px-6">
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-6">
            <PlayerCard player={player} isLoading={isLoading} />
            <HotZones zoneEfficiency={zoneEfficiency} />
          </div>

          <div className="flex flex-col gap-6">
            <StatTable rows={statRows} isLoading={isLoading} />
            <ScoutingSummary summary={scouting} isLoading={isLoading} />
          </div>
        </div>
      </main>
    </div>
  );
}