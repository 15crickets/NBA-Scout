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

// types.ts
export interface StatRow {
  season: string;
  age: string;
  team: string;
  gp: number;
  gs: number;
  fg: number;
  fga: number;
  fgPct: number;
  threeM: number;
  threeA: number;
  threePct: number;
  ft: number;
  fta: number;
  ftPct: number;
  rpg: number;
  apg: number;
  spg: number;
  bpg: number;
  tpg: number; // turnovers per game
  ppg: number;
}

// types.ts
export interface ScoutingSummary {
  summary: string; // the generated/written scouting text
}