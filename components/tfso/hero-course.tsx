const points: [number, number][] = [
  [92, 438],
  [205, 330],
  [338, 392],
  [300, 228],
  [452, 146],
  [584, 246],
  [524, 398],
  [648, 456],
]

const labelOffsets: [number, number][] = [
  [-38, -22],
  [8, 50],
  [-46, -14],
  [-10, -34],
  [34, -18],
  [-48, 10],
]

const CONTROL_R = 22
const DRAW_SECONDS = 14 * 0.7

const segmentLengths = points
  .slice(1)
  .map((p, i) => Math.hypot(p[0] - points[i][0], p[1] - points[i][1]))
const totalLength = segmentLengths.reduce((a, b) => a + b, 0)
const cumulative = points.map((_, i) => segmentLengths.slice(0, i).reduce((a, b) => a + b, 0))

const routePath = `M ${points.map((p) => p.join(' ')).join(' L ')}`

const start = points[0]
const startAngle = Math.atan2(points[1][1] - start[1], points[1][0] - start[0])
const triangle = [0, 1, 2]
  .map((k) => {
    const a = startAngle + (k * 2 * Math.PI) / 3
    return `${(start[0] + Math.cos(a) * 26).toFixed(1)},${(start[1] + Math.sin(a) * 26).toFixed(1)}`
  })
  .join(' ')

const finish = points[points.length - 1]
const controls = points.slice(1, -1)

export function HeroCourse() {
  return (
    <svg
      viewBox="0 0 720 520"
      role="img"
      aria-labelledby="course-title"
      className="h-full w-full overflow-visible"
    >
      <title id="course-title">Дистанция: старт, шесть контрольных пунктов и финиш</title>
      <defs>
        <mask id="course-gaps" maskUnits="userSpaceOnUse">
          <rect width="720" height="520" fill="white" />
          <circle cx={start[0]} cy={start[1]} r="30" fill="black" />
          {controls.map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={CONTROL_R + 4} fill="black" />
          ))}
          <circle cx={finish[0]} cy={finish[1]} r="32" fill="black" />
        </mask>
      </defs>

      <g fill="none" stroke="var(--course)" strokeLinecap="round" strokeLinejoin="round">
        <path d={routePath} strokeWidth="4" strokeOpacity="0.16" mask="url(#course-gaps)" />
        <path
          d={routePath}
          pathLength={100}
          strokeWidth="4"
          className="course-line"
          mask="url(#course-gaps)"
        />

        <polygon points={triangle} strokeWidth="4.5" />

        {controls.map(([x, y], i) => (
          <g key={`${x}-${y}`}>
            <circle
              cx={x}
              cy={y}
              r={CONTROL_R}
              strokeWidth="2.5"
              className="control-pulse"
              style={{ animationDelay: `${((cumulative[i + 1] / totalLength) * DRAW_SECONDS).toFixed(2)}s` }}
            />
            <circle cx={x} cy={y} r={CONTROL_R} strokeWidth="4.5" />
          </g>
        ))}

        <circle cx={finish[0]} cy={finish[1]} r="27" strokeWidth="4.5" />
        <circle cx={finish[0]} cy={finish[1]} r="18" strokeWidth="4.5" />
        <circle
          cx={finish[0]}
          cy={finish[1]}
          r="27"
          strokeWidth="2.5"
          className="control-pulse"
          style={{ animationDelay: `${DRAW_SECONDS.toFixed(2)}s` }}
        />
      </g>

      <g fill="var(--course)" fontFamily="var(--font-mono-face)" fontWeight="700" fontSize="26" aria-hidden="true">
        {controls.map(([x, y], i) => (
          <text
            key={`label-${x}`}
            x={x + labelOffsets[i][0]}
            y={y + labelOffsets[i][1]}
            textAnchor="middle"
            paintOrder="stroke"
            stroke="var(--paper)"
            strokeWidth="5"
            strokeLinejoin="round"
          >
            {i + 1}
          </text>
        ))}
      </g>
    </svg>
  )
}
