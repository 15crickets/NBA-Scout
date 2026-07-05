// Shared types — this is the "contract" your hooks need to fulfill.
// Every component below expects data shaped like this.

export type ZoneId =
  | "restrictedArea"
  | "paintNonRA"
  | "midrange"
  | "leftCorner3"
  | "rightCorner3"
  | "aboveBreak3";

// 0 to 1, where you decide what 1 means (e.g. league-average FG% for that zone,
// or just raw FG% — your call). HotZones will map this to a color.
export type ZoneEfficiency = Record<ZoneId, number>;

export interface PlayerHeadline {
  playerId: string;
  name: string;
  team: string;
  teamAbbreviation: string;
  jerseyNumber: string;
  position: string;
  headshotUrl: string; // NBA CDN headshot URL
  careerPpg: number;
  careerApg: number;
  careerRpg: number;
}

export interface StatRow {
  season: string; // e.g. "2023-24"
  team: string;
  gp: number; // games played
  ppg: number;
  apg: number;
  rpg: number;
  fgPct: number;
  threePct: number;
  ftPct: number;
}

export interface ScoutingSummary {
  playerId: string;
  summary: string; // the generated/written scouting text
  strengths: string[];
  weaknesses: string[];
  generatedAt: string; // ISO date, useful for cache invalidation later
}