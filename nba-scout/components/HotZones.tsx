import type { ZoneEfficiency, ZoneId } from "./types";

interface HotZonesProps {
  // If omitted, falls back to the original static palette.
  zoneEfficiency?: ZoneEfficiency;
}

// Maps a 0–1 efficiency value to a color on a cold -> hot scale.
// Swap this out for whatever palette you like — this is just a starting point.
function efficiencyToColor(value: number | undefined, fallback: string): string {
  if (value === undefined) return fallback;
  const clamped = Math.max(0, Math.min(1, value));

  // blue (cold/inefficient) -> red (hot/efficient)
  const cold = { r: 59, g: 130, b: 246 }; // #3b82f6
  const hot = { r: 239, g: 68, b: 68 }; // #ef4444

  const r = Math.round(cold.r + (hot.r - cold.r) * clamped);
  const g = Math.round(cold.g + (hot.g - cold.g) * clamped);
  const b = Math.round(cold.b + (hot.b - cold.b) * clamped);

  return `rgb(${r}, ${g}, ${b})`;
}

export default function HotZones({ zoneEfficiency }: HotZonesProps) {
  const W = 600, H = 470
  const baselineY = 450
  const basketX = 300, basketY = 430  // moved closer to baseline

  const paintLeft = 210, paintRight = 390  // wider paint
  const paintTop = 210, paintBottom = baselineY

  const ftRadius = 75  // more circular (was stretching because paint width forced it)
  const ftLineY = paintTop

  const cornerX_L = 60, cornerX_R = 540
  const cornerBreakY = 310
  const tpRadius = 240

  // FT circle endpoints: 85% of paint width, centered
  const ftSpan = (paintRight - paintLeft) * 0.85 / 2  // half-span
  const ftLeft = basketX - ftSpan
  const ftRight = basketX + ftSpan

  // Original static colors, used as fallback when no data is loaded yet.
  const fallbackColors: Record<ZoneId, string> = {
    aboveBreak3: "#3b82f6",
    leftCorner3: "#22c55e",
    rightCorner3: "#22c55e",
    midrange: "#f97316",
    paintNonRA: "#a855f7",
    restrictedArea: "#ef4444",
  };

  const colors: Record<ZoneId, string> = {
    aboveBreak3: efficiencyToColor(zoneEfficiency?.aboveBreak3, fallbackColors.aboveBreak3),
    leftCorner3: efficiencyToColor(zoneEfficiency?.leftCorner3, fallbackColors.leftCorner3),
    rightCorner3: efficiencyToColor(zoneEfficiency?.rightCorner3, fallbackColors.rightCorner3),
    midrange: efficiencyToColor(zoneEfficiency?.midrange, fallbackColors.midrange),
    paintNonRA: efficiencyToColor(zoneEfficiency?.paintNonRA, fallbackColors.paintNonRA),
    restrictedArea: efficiencyToColor(zoneEfficiency?.restrictedArea, fallbackColors.restrictedArea),
  };

  return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
          <rect x="0" y="0" width={W} height={H} fill="#1a1a1a"/>

          {/* Above the break 3 */}
          <path
              d={`
                  M 20 20
                  L 580 20
                  L 580 ${cornerBreakY}
                  L ${cornerX_R} ${cornerBreakY}
                  A ${tpRadius} ${tpRadius} 0 0 0 ${cornerX_L} ${cornerBreakY}
                  L 20 ${cornerBreakY}
                  Z
              `}
              fill={colors.aboveBreak3}
          />

          {/* Left corner 3 */}
          <path
              d={`M 20 ${cornerBreakY} L ${cornerX_L} ${cornerBreakY} L ${cornerX_L} ${baselineY} L 20 ${baselineY} Z`}
              fill={colors.leftCorner3}
          />

          {/* Right corner 3 */}
          <path
              d={`M 580 ${cornerBreakY} L ${cornerX_R} ${cornerBreakY} L ${cornerX_R} ${baselineY} L 580 ${baselineY} Z`}
              fill={colors.rightCorner3}
          />

          {/* Midrange */}
          <path
              fillRule="evenodd"
              d={`
                  M ${cornerX_L} ${cornerBreakY}
                  A ${tpRadius} ${tpRadius} 0 0 1 ${cornerX_R} ${cornerBreakY}
                  L ${cornerX_R} ${baselineY}
                  L ${cornerX_L} ${baselineY}
                  Z
                  M ${paintLeft} ${paintTop}
                  L ${paintRight} ${paintTop}
                  L ${paintRight} ${baselineY}
                  L ${paintLeft} ${baselineY}
                  Z
              `}
              fill={colors.midrange}
          />

          {/* Paint non-RA */}
          <path
              fillRule="evenodd"
              d={`
                  M ${paintLeft} ${paintTop}
                  L ${paintRight} ${paintTop}
                  L ${paintRight} ${baselineY}
                  L ${paintLeft} ${baselineY}
                  Z
                  M ${basketX - 40} ${baselineY}
                  A 40 40 0 0 1 ${basketX + 40} ${baselineY}
                  Z
              `}
              fill={colors.paintNonRA}
          />

          {/* Restricted area */}
          <path
              d={`M ${basketX - 40} ${baselineY} A 40 40 0 0 1 ${basketX + 40} ${baselineY} Z`}
              fill={colors.restrictedArea}
          />

          {/* Court lines */}
          <rect x="20" y="20" width="560" height={H - 20} fill="none" stroke="#fff" strokeWidth="2"/>

          <line x1={cornerX_L} y1={cornerBreakY} x2={cornerX_L} y2={baselineY} stroke="#fff" strokeWidth="2"/>
          <line x1={cornerX_R} y1={cornerBreakY} x2={cornerX_R} y2={baselineY} stroke="#fff" strokeWidth="2"/>
          <path
              d={`M ${cornerX_L} ${cornerBreakY} A ${tpRadius} ${tpRadius} 0 0 1 ${cornerX_R} ${cornerBreakY}`}
              fill="none" stroke="#fff" strokeWidth="2"
          />

          <rect x={paintLeft} y={paintTop} width={paintRight - paintLeft} height={paintBottom - paintTop}
              fill="none" stroke="#fff" strokeWidth="2"/>

          {/* FT circle — 85% width, circular */}
          <path
              d={`M ${ftLeft} ${ftLineY} A ${ftRadius} ${ftRadius} 0 0 1 ${ftRight} ${ftLineY}`}
              fill="none" stroke="#fff" strokeWidth="2"
          />
          <path
              d={`M ${ftLeft} ${ftLineY} A ${ftRadius} ${ftRadius} 0 0 0 ${ftRight} ${ftLineY}`}
              fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="6 4"
          />

          <path
              d={`M ${basketX - 40} ${baselineY} A 40 40 0 0 1 ${basketX + 40} ${baselineY}`}
              fill="none" stroke="#fff" strokeWidth="2"
          />

          {/* Basket */}
          <circle cx={basketX} cy={basketY} r="10" fill="none" stroke="#ff6b35" strokeWidth="2.5"/>

          {/* Backboard */}
          <line x1={basketX - 30} y1={baselineY} x2={basketX + 30} y2={baselineY} stroke="#fff" strokeWidth="3"/>
      </svg>
  )
}