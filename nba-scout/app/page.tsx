"use client";
import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import HotZones from "@/components/HotZones";
import PlayerCard from "@/components/PlayerCard";
import StatTable from "@/components/StatTable";
import ScoutingSummary from "@/components/ScoutingSummary";
import type { PlayerHeadline, StatRow, ZoneEfficiency, ZoneId, ScoutingSummary as ScoutingSummaryType} from "@/components/types";

function SectionHeader({ title }: { title: string }) {
  return (
    <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 mb-2">
      {title}
    </h3>
  );
}

export default function Home() {

  const [player, setPlayer] = useState<PlayerHeadline | null> (null)
  const [statRows, setStatRows] = useState<StatRow[]>([])
  const [zoneEfficiency, setZoneEfficiency] = useState<ZoneEfficiency | undefined> (undefined)
  const [scouting, setScouting] = useState<ScoutingSummaryType | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const SPREAD = 0.06;

  const LEAGUE_AVG: Record<ZoneId, number> = {
    aboveBreak3: 0.355,
    leftCorner3: 0.385,
    rightCorner3: 0.385,
    midrange: 0.40,
    paintNonRA: 0.42,
    restrictedArea: 0.63,
  };

  function zoneScore(fgm: number, fga: number, leagueAvg: number): number {
    if (fga == 0){
      return 0; 
    } 
    const fgPct = fgm / fga;
    const diff = (fgPct - leagueAvg) / SPREAD;
    return Math.max(-1, Math.min(1, diff));
  }

  function mapZoneEfficiency(statsJson: any): ZoneEfficiency {
    const zones = statsJson.zones
    return {
      aboveBreak3: zoneScore(zones["Above the Break 3 FGM"], zones["Above the Break 3 FGA"], LEAGUE_AVG.aboveBreak3),
      leftCorner3: zoneScore(zones["Left Corner 3 FGM"], zones["Left Corner 3 FGA"], LEAGUE_AVG.leftCorner3),
      rightCorner3: zoneScore(zones["Right Corner 3 FGM"], zones["Right Corner 3 FGA"], LEAGUE_AVG.rightCorner3),
      midrange: zoneScore(zones["Mid-Range FGM"], zones["Mid-Range FGA"], LEAGUE_AVG.midrange),
      paintNonRA: zoneScore(zones["In The Paint (Non-RA) FGM"], zones["In The Paint (Non-RA) FGA"], LEAGUE_AVG.paintNonRA),
      restrictedArea: zoneScore(zones["Restricted Area FGM"], zones["Restricted Area FGA"], LEAGUE_AVG.restrictedArea),
    };
  }

  function mapPlayerHeadline(statsJson: any): PlayerHeadline {
    const info = statsJson.player_info;
    const career = statsJson.career_stats;

    return {
      playerId: info.playerId,
      name: info.name,
      team: info.team,
      teamAbbreviation: info.teamAbbreviation,
      jerseyNumber: info.jerseyNumber,
      position: info.position,
      headshotUrl: `https://cdn.nba.com/headshots/nba/latest/1040x760/${info.playerId}.png`,
      careerPpg: parseFloat(career["Points Per Game"]),
      careerApg: parseFloat(career["Assists Per Game"]),
      careerRpg: parseFloat(career["Rebounds Per Game"]),
    };
  }

  function mapScoutingSummary(report: any): ScoutingSummaryType{
    const info = report.report;

    return{
      summary: info
    };
  }

  function mapStatRows(statsJson: any): StatRow[] {
    const seasonStats = statsJson.season_stats;

    return seasonStats.map((yearObj: any) => {
      const seasonLabel = Object.keys(yearObj)[0];
      const s = yearObj[seasonLabel];

      return {
        season: seasonLabel,
        age: s["Age"],
        team: s["Team"],
        gp: parseInt(s["Games Played"]),
        gs: parseInt(s["Games Started"]),
        fg: parseFloat(s["Field Goals"]),
        fga: parseFloat(s["Field Goal Attempts"]),
        fgPct: parseFloat(s["Field Goal Percentage"]),
        threeM: parseFloat(s["3 Pointers"]),
        threeA: parseFloat(s["3 Point Attempts"]),
        threePct: parseFloat(s["3 Point Percentage"]),
        ft: parseFloat(s["Free Throws"]),
        fta: parseFloat(s["Free Throw Attempts"]),
        ftPct: parseFloat(s["Free Throw Percentage"]),
        rpg: parseFloat(s["Rebounds Per Game"]),
        apg: parseFloat(s["Assists Per Game"]),
        spg: parseFloat(s["Steals Per Game"]),
        bpg: parseFloat(s["Blocks Per Game"]),
        tpg: parseFloat(s["Turnovers Per Game"]),
        ppg: parseFloat(s["Points Per Game"]),
      };
    });
  }

  async function getPlayerStats(playerName: string) {
    const response = await fetch(
      `http://localhost:5001/api/player-stats?player=${encodeURIComponent(playerName)}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Request failed");
    }

    const data = await response.json();
    return data;
  }

  async function getLLMSummary(playerName: string){
    const response = await fetch(
      `http://localhost:5001/api/player-report?player=${encodeURIComponent(playerName)}`
    )

    if(!response.ok){
      const errorData = await response.json();
      throw new Error(errorData.error || "Request failed");
    }

    const data = await response.json();
    return data
  }

  async function handleSearch(playerName: string) {
    setIsLoading(true);
    try {
      const [data, report] = await Promise.all([
        getPlayerStats(playerName),
        getLLMSummary(playerName),
      ]);
      setStatRows(mapStatRows(data))
      setPlayer(mapPlayerHeadline(data));
      setScouting(mapScoutingSummary(report));
      setZoneEfficiency(mapZoneEfficiency(data))
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-950 font-sans min-h-screen">
      <main className="flex flex-1 w-full max-w-7xl flex-col gap-8 py-16 px-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            🏀 NBA Scout
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            AI-powered scouting reports and shot analysis for any NBA player
          </p>
        </div>

        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-1">
            <PlayerCard player={player} isLoading={isLoading} />
          </div>

          <div className="md:col-span-1">
            <SectionHeader title="Shot Zones" />
            <HotZones zoneEfficiency={zoneEfficiency} />
          </div>
        </div>

        <div>
          <SectionHeader title="Last 5 Seasons' Stats" />
          <StatTable rows={statRows} isLoading={isLoading} />
        </div>

        <ScoutingSummary summary={scouting} isLoading={isLoading} />
      </main>
    </div>
  );
}