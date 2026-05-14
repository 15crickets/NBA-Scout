export default function HotZones() {
    return (
        <svg
            viewBox="0 0 600 470"
            className="w-full h-full"
        >
            {/* Court background */}
            <rect x="0" y="0" width="600" height="470" fill="#1a1a1a"/>
            
            {/* Court outline */}
            <rect 
                x="20" 
                y="20" 
                width="560" 
                height="430" 
                fill="none" 
                stroke="#fff" 
                strokeWidth="3"
            />
            
            {/* Baseline */}
            <line 
                x1="20" 
                y1="450" 
                x2="580" 
                y2="450" 
                stroke="#fff" 
                strokeWidth="3"
            />
            
            {/* Three-point arc */}
            <path 
                d="M 60 450 Q 60 430, 70 410 A 245 245 0 0 1 530 410 Q 540 430, 540 450" 
                stroke="#fff" 
                strokeWidth="3" 
                fill="none"
            />
            
            {/* Above the Break 3 - BLUE (outside 3pt line, above corners) */}
            <path 
                id="above-break-3"
                d="M 70 410
                   A 245 245 0 0 1 530 410
                   L 530 20
                   L 70 20
                   Z" 
                fill="#3b82f6" 
                stroke="#fff" 
                strokeWidth="2"
                data-zone="above-break-3"
            />
            
            {/* Left Corner 3 - GREEN */}
            <path 
                id="left-corner-3"
                d="M 20 450 L 60 450 Q 60 430, 70 410 L 70 240 L 20 240 Z" 
                fill="#22c55e" 
                stroke="#fff" 
                strokeWidth="2"
                data-zone="left-corner-3"
            />
            
            {/* Right Corner 3 - GREEN */}
            <path 
                id="right-corner-3"
                d="M 580 450 L 540 450 Q 540 430, 530 410 L 530 240 L 580 240 Z" 
                fill="#22c55e" 
                stroke="#fff" 
                strokeWidth="2"
                data-zone="right-corner-3"
            />
            
            {/* Midrange - ORANGE (extended oval inside 3pt, outside paint) */}
            <path 
                id="midrange"
                d="M 70 410
                   A 245 245 0 0 1 530 410
                   L 530 240
                   A 230 190 0 0 0 70 240
                   Z
                   M 210 252
                   A 90 90 0 0 1 390 252
                   L 390 450
                   L 210 450
                   L 210 252
                   Z" 
                fill="#f97316" 
                stroke="#fff" 
                strokeWidth="2"
                data-zone="midrange"
            />
            
            {/* Paint outline */}
            <rect 
                x="210" 
                y="252" 
                width="180" 
                height="198" 
                fill="none" 
                stroke="#fff" 
                strokeWidth="3"
            />
            
            {/* Free throw circle top arc */}
            <path 
                d="M 210 252 A 90 90 0 0 1 390 252" 
                stroke="#fff" 
                strokeWidth="3" 
                fill="none"
            />
            
            {/* Free throw circle bottom arc (dashed) */}
            <path 
                d="M 210 252 A 90 90 0 0 0 390 252" 
                stroke="#fff" 
                strokeWidth="3" 
                strokeDasharray="5,5"
                fill="none"
            />
            
            {/* Paint Non-Restricted Area - PURPLE */}
            <path 
                id="paint-non-restricted"
                d="M 210 252 
                   L 210 450
                   L 390 450
                   L 390 252
                   A 90 90 0 0 0 210 252
                   M 260 438
                   A 40 40 0 0 0 340 438
                   L 340 450
                   L 260 450
                   Z" 
                fill="#a855f7" 
                stroke="#fff" 
                strokeWidth="2"
                data-zone="paint-non-restricted"
            />
            
            {/* Restricted Area semicircle - RED */}
            <path 
                id="restricted-area"
                d="M 260 438 
                   A 40 40 0 0 0 340 438
                   L 340 450
                   L 260 450
                   Z" 
                fill="#ef4444" 
                stroke="#fff" 
                strokeWidth="3"
                data-zone="restricted-area"
            />
            
            {/* Basket */}
            <circle 
                cx="300" 
                cy="438" 
                r="9" 
                fill="none" 
                stroke="#ff6b35" 
                strokeWidth="3"
            />
            
            {/* Backboard */}
            <line 
                x1="270" 
                y1="450" 
                x2="330" 
                y2="450" 
                stroke="#fff" 
                strokeWidth="4"
            />
        </svg>
    )
}