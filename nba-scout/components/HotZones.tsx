export default function HotZones() {
    return (
        <svg
            viewBox="0 0 500 470"
            className="w-full h-full bg-orange-100"
        >
            {/* COURT OUTLINE */}
            <rect
                x="10"
                y="10"
                width="480"
                height="450"
                fill="none"
                stroke="black"
                strokeWidth="2"
            />

            {/* BASKET (top center) */}
            <circle
                cx="250"
                cy="40"
                r="7"
                fill="orange"
                stroke="black"
            />

            {/* PAINT (key) */}
            <rect
                x="170"
                y="40"
                width="160"
                height="120"
                fill="rgba(0,0,255,0.15)"
                stroke="blue"
                strokeWidth="1"
            />

            {/* FREE THROW LINE */}
            <line
                x1="170"
                y1="160"
                x2="330"
                y2="160"
                stroke="black"
                strokeWidth="2"
            />

            {/* TOP OF KEY ZONE (arc area simplified as polygon) */}
            <polygon
                points="
                    170,160
                    330,160
                    370,260
                    130,260
                "
                fill="rgba(255,0,0,0.12)"
                stroke="red"
                strokeWidth="1"
            />

            {/* LEFT CORNER 3 */}
            <polygon
                points="
                    10,260
                    130,260
                    130,400
                    10,400
                "
                fill="rgba(0,255,0,0.12)"
                stroke="green"
                strokeWidth="1"
            />

            {/* RIGHT CORNER 3 */}
            <polygon
                points="
                    370,260
                    490,260
                    490,400
                    370,400
                "
                fill="rgba(0,255,0,0.12)"
                stroke="green"
                strokeWidth="1"
            />

            {/* LEFT WING / MIDRANGE */}
            <polygon
                points="
                    130,260
                    170,160
                    170,400
                    130,400
                "
                fill="rgba(255,165,0,0.12)"
                stroke="orange"
                strokeWidth="1"
            />

            {/* RIGHT WING / MIDRANGE */}
            <polygon
                points="
                    330,160
                    370,260
                    370,400
                    330,400
                "
                fill="rgba(255,165,0,0.12)"
                stroke="orange"
                strokeWidth="1"
            />

            {/* CENTER STRAIGHT ZONE */}
            <polygon
                points="
                    170,160
                    330,160
                    370,260
                    330,400
                    170,400
                    130,260
                "
                fill="rgba(128,0,128,0.08)"
                stroke="purple"
                strokeWidth="1"
            />
        </svg>
    )
}