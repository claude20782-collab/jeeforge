'use client'
/**
 * QuestionDiagram — renders typed DiagramSpec (src/lib/types.ts) as crisp inline SVG.
 * Deterministic, theme-aware (CSS vars), responsive (viewBox), zero network loads.
 * Used by CBT interface, solutions view, and admin question editor.
 *
 * v2 REMASTER — much richer output per kind:
 *  - plot panels, minor/major grids, zero-through-origin axes, arrowed axes
 *  - halo text labels (paint-order stroke) readable over any element
 *  - curve legends, crosshair markers, hatched shaded regions, glow underlays
 *  - IEC-grade circuit symbols with value chips, +/- battery marks
 *  - lens/mirror focal markers (F, 2F), mid-ray direction arrows, denser hatching
 *  - 3D-bevel blocks, spoked pulleys/wheels, filled angle wedges, right-angle squares
 *  - amplitude/wavelength guides on waves, directioned field lines, glowing charges
 *  - gradient bars with value chips + legends, gradient glassware with meniscus,
 *    graduations on burettes/thermometers, element-colored atoms (CPK-inspired)
 */
import type {
  DiagramSpec, GraphDiagram, CircuitDiagram, RayDiagram, FbdDiagram, WaveDiagram,
  FieldDiagram, GeometryDiagram, BarsDiagram, TableDiagram, MoleculeDiagram,
  OrganicDiagram, ApparatusDiagram, V3dDiagram,
} from '@/lib/types'
import React from 'react'
import { cn } from '@/lib/utils'

const FG = 'var(--foreground)'
const MUT = 'var(--muted-foreground)'
const BRD = 'var(--border)'
const GOLD = 'var(--gold)'
const EMER = 'var(--chart-2)'
const CORAL = 'var(--chart-3)'
const VIOLET = 'var(--chart-4)'
const TEAL = 'var(--chart-5)'
const CARD = 'var(--card)'
const PALETTE = [GOLD, EMER, CORAL, VIOLET, TEAL]

class DiagramErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() { return { hasError: true } }
  render() { return this.state.hasError ? this.props.fallback : this.props.children }
}

export function QuestionDiagram({ spec, className, compact }: { spec: DiagramSpec; className?: string; compact?: boolean }) {
  const fallback = <div className="my-2 rounded border border-destructive/40 bg-destructive/10 p-2 text-xs text-destructive">Diagram unavailable</div>
  return (
    <DiagramErrorBoundary fallback={fallback}>
      <figure className={cn('my-3 flex justify-center', className)}>
        <div className={cn(
          'inline-block rounded-lg border bg-card/60 px-2 py-2 sm:px-3',
          compact ? 'max-w-[340px]' : 'max-w-full'
        )}>
          {render(spec)}
        </div>
      </figure>
    </DiagramErrorBoundary>
  )
}

function render(spec: DiagramSpec) {
  switch (spec.kind) {
    case 'graph': return <Graph D={spec} />
    case 'circuit': return <Circuit D={spec} />
    case 'ray': return <Ray D={spec} />
    case 'fbd': return <Fbd D={spec} />
    case 'wave': return <Wave D={spec} />
    case 'field': return <Field D={spec} />
    case 'geometry': return <Geometry D={spec} />
    case 'bars': return <Bars D={spec} />
    case 'table': return <Table D={spec} />
    case 'molecule': return <Molecule D={spec} />
    case 'organic': return <Organic D={spec} />
    case 'apparatus': return <Apparatus D={spec} />
    case 'v3d': return <V3d D={spec} />
  }
}

// ---------- shared helpers ----------
const PAD = 30

/** Halo text: readable over any element via paint-order stroke on card color. */
function HText({ x, y, text, fill = FG, fontSize = 11, anchor = 'start', italic, weight = 600, opacity = 1, rotate, cx, cy }: {
  x: number; y: number; text: string; fill?: string; fontSize?: number
  anchor?: 'start' | 'middle' | 'end'; italic?: boolean; weight?: number; opacity?: number
  rotate?: number; cx?: number; cy?: number
}) {
  const t = (
    <text x={x} y={y} textAnchor={anchor} fontSize={fontSize} fontWeight={weight}
      fontStyle={italic ? 'italic' : undefined} fill={fill} opacity={opacity}
      stroke={CARD} strokeWidth={3} paintOrder="stroke" strokeLinejoin="round">{text}</text>
  )
  if (rotate !== undefined) {
    return <g transform={`rotate(${rotate} ${cx ?? x} ${cy ?? y})`}>{t}</g>
  }
  return t
}

/** Rounded label chip with colored text — for legends / key annotations. */
function Chip({ x, y, text, color = FG, fontSize = 10, anchor = 'middle' }: {
  x: number; y: number; text: string; color?: string; fontSize?: number
  anchor?: 'start' | 'middle' | 'end'
}) {
  const w = text.length * fontSize * 0.62 + 12
  const rx = anchor === 'start' ? x : anchor === 'end' ? x - w : x - w / 2
  return (
    <g>
      <rect x={rx} y={y - fontSize - 2} width={w} height={fontSize + 9} rx={5} fill={CARD} opacity={0.94} stroke={BRD} strokeWidth={0.8} />
      <text x={x} y={y + 1} textAnchor={anchor} fontSize={fontSize} fontWeight={600} fill={color}>{text}</text>
    </g>
  )
}

/** Legend dot + chip row (top of plot when multiple labelled series). */
function LegendRow({ x, y, entries }: { x: number; y: number; entries: Array<{ label: string; color: string; dashed?: boolean }> }) {
  const offsets: number[] = []
  let acc = 0
  for (const e of entries) { offsets.push(acc); acc += e.label.length * 9.5 + 22 + 10 }
  return (
    <g>
      {entries.map((e, i) => (
        <g key={i}>
          <line x1={x + offsets[i]} y1={y} x2={x + offsets[i] + 13} y2={y} stroke={e.color} strokeWidth={2.4} strokeDasharray={e.dashed ? '4 3' : undefined} />
          <HText x={x + offsets[i] + 17} y={y + 3.5} text={e.label} fontSize={9.5} weight={600} fill={e.color} />
        </g>
      ))}
    </g>
  )
}

function arrowDefs(id: string) {
  return (
    <defs>
      <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="context-stroke" />
      </marker>
    </defs>
  )
}

/** Diagonal hatch pattern defs entry. */
function hatchPattern(id: string, color: string) {
  return (
    <pattern id={id} width={7} height={7} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1={0} y1={0} x2={0} y2={7} stroke={color} strokeWidth={1.1} opacity={0.3} />
    </pattern>
  )
}

/** Small direction arrow at fraction t along a line. */
function midArrow(x1: number, y1: number, x2: number, y2: number, t = 0.5, size = 5) {
  const mx = x1 + (x2 - x1) * t, my = y1 + (y2 - y1) * t
  const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI
  return <path d={`M ${-size} ${-size * 0.62} L ${size} 0 L ${-size} ${size * 0.62} z`} transform={`translate(${mx} ${my}) rotate(${ang})`} fill="context-stroke" />
}

// ================= GRAPH =================
function Graph({ D }: { D: GraphDiagram }) {
  const W = 460, H = 340
  const { xAxis, yAxis } = D
  const xSpan = xAxis.max - xAxis.min || 1
  const ySpan = yAxis.max - yAxis.min || 1
  const square = D.square !== false
  const iw = square ? Math.min(W - 2 * PAD, (H - 2 * PAD - 14) * (xSpan / ySpan)) : W - 2 * PAD
  const ih = square ? iw * (ySpan / xSpan) : H - 2 * PAD - 14
  const x0 = PAD + ((W - 2 * PAD) - iw) / 2, y0 = H - PAD - ((H - 2 * PAD - 14) - ih) / 2
  const X = (v: number) => x0 + ((v - xAxis.min) / xSpan) * iw
  const Y = (v: number) => y0 - ((v - yAxis.min) / ySpan) * ih
  // zero-through-origin axes when 0 in range, else frame edges
  const axY = yAxis.min < 0 && yAxis.max > 0 ? Y(0) : y0
  const axX = xAxis.min < 0 && xAxis.max > 0 ? X(0) : x0
  const xt = xAxis.ticks ?? niceTicks(xAxis.min, xAxis.max)
  const yt = yAxis.ticks ?? niceTicks(yAxis.min, yAxis.max)
  const legend = D.curves.filter(c => c.label)
  const colors = PALETTE
  // minor grid fractions (per major cell / 5)
  const minorXs: number[] = [], minorYs: number[] = []
  if (D.showGrid) {
    for (let i = 0; i < xt.length - 1; i++) for (let k = 1; k < 5; k++) minorXs.push(xt[i] + (xt[i + 1] - xt[i]) * k / 5)
    for (let i = 0; i < yt.length - 1; i++) for (let k = 1; k < 5; k++) minorYs.push(yt[i] + (yt[i + 1] - yt[i]) * k / 5)
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full max-w-[470px]" role="img" aria-label={D.title ?? 'graph'}>
      {arrowDefs('gph')}
      {/* plot panel */}
      <rect x={x0} y={y0 - ih} width={iw} height={ih} rx={2} fill="var(--secondary)" fillOpacity={0.22} />
      {/* minor grid */}
      {D.showGrid && <g opacity={0.45}>
        {minorXs.map((v, i) => <line key={`mx${i}`} x1={X(v)} y1={y0 - ih} x2={X(v)} y2={y0} stroke={BRD} strokeWidth={0.45} />)}
        {minorYs.map((v, i) => <line key={`my${i}`} x1={x0} y1={Y(v)} x2={x0 + iw} y2={Y(v)} stroke={BRD} strokeWidth={0.45} />)}
      </g>}
      {/* major grid */}
      {D.showGrid && <g opacity={0.75}>
        {xt.map((v, i) => <line key={`gx${i}`} x1={X(v)} y1={y0 - ih} x2={X(v)} y2={y0} stroke={BRD} strokeWidth={0.65} />)}
        {yt.map((v, i) => <line key={`gy${i}`} x1={x0} y1={Y(v)} x2={x0 + iw} y2={Y(v)} stroke={BRD} strokeWidth={0.65} />)}
      </g>}
      {/* frame */}
      <rect x={x0} y={y0 - ih} width={iw} height={ih} fill="none" stroke={BRD} strokeWidth={1} rx={2} />
      {/* axes with arrows */}
      <g stroke={FG} strokeWidth={1.5}>
        <line x1={axX} y1={axY} x2={axX + iw + 2} y2={axY} />
        <line x1={axX} y1={axY} x2={axX} y2={y0 - ih - 2} />
      </g>
      <path d={`M ${axX + iw + 12} ${axY} l -8 -3.4 l 0 6.8 z`} fill={FG} />
      <path d={`M ${axX} ${y0 - ih - 12} l -3.4 8 l 6.8 0 z`} fill={FG} />
      {/* ticks */}
      {xt.map((v, i) => v >= xAxis.min && v <= xAxis.max && (
        <g key={`tx${i}`}>
          <line x1={X(v)} y1={axY - 3.5} x2={X(v)} y2={axY + 3.5} stroke={FG} strokeWidth={1} />
          <HText x={X(v)} y={axY + 15} text={fmtTick(v)} fontSize={9.5} anchor="middle" weight={400} fill={MUT} />
        </g>
      ))}
      {yt.map((v, i) => v >= yAxis.min && v <= yAxis.max && (
        <g key={`ty${i}`}>
          <line x1={axX - 3.5} y1={Y(v)} x2={axX + 3.5} y2={Y(v)} stroke={FG} strokeWidth={1} />
          <HText x={axX - 7} y={Y(v) + 3.2} text={fmtTick(v)} fontSize={9.5} anchor="end" weight={400} fill={MUT} />
        </g>
      ))}
      {xAxis.label && <HText x={x0 + iw / 2} y={y0 + 30} text={xAxis.label} fontSize={11.5} anchor="middle" weight={600} />}
      {yAxis.label && <HText x={x0 - 16} y={y0 - ih - 12} text={yAxis.label} fontSize={11.5} weight={600} />}
      {D.title && (
        <g>
          <rect x={W / 2 - D.title.length * 3.4 - 6} y={2} width={D.title.length * 6.8 + 12} height={16} rx={4} fill={GOLD} opacity={0.12} />
          <text x={W / 2} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={FG}>{D.title}</text>
        </g>
      )}
      {/* legend */}
      {legend.length > 1 && <LegendRow x={x0 + 6} y={y0 - ih + 12} entries={legend.map(c => ({ label: c.label!, color: c.color ?? colors[D.curves.indexOf(c) % colors.length], dashed: c.dashed }))} />}
      {/* shaded regions with hatch */}
      {D.shadedRegions?.map((r, i) => {
        const col = r.color ?? GOLD
        const pts = r.points.map(([px, py]) => `${X(px)},${Y(py)}`).join(' ')
        const cx = r.points.reduce((s, p) => s + X(p[0]), 0) / r.points.length
        const cy = r.points.reduce((s, p) => s + Y(p[1]), 0) / r.points.length
        return (
          <g key={i}>
            <defs>{hatchPattern(`srh${i}`, col)}</defs>
            <polygon points={pts} fill={col} opacity={0.12} />
            <polygon points={pts} fill={`url(#srh${i})`} />
            {r.label && <Chip x={cx} y={cy + 2} text={r.label} color={col} />}
          </g>
        )
      })}
      {/* curves */}
      {D.curves.map((c, ci) => {
        const col = c.color ?? colors[ci % colors.length]
        if (c.type === 'points') {
          return <g key={ci}>{c.points.map(([px, py], i) => (
            <circle key={i} cx={X(px)} cy={Y(py)} r={4.2} fill={CARD} stroke={col} strokeWidth={2} />
          ))}</g>
        }
        const d = c.type === 'curve'
          ? catmullRom(c.points.map(([px, py]) => [X(px), Y(py)]))
          : c.points.map(([px, py], i) => `${i === 0 ? 'M' : 'L'} ${X(px)} ${Y(py)}`).join(' ')
        const last = c.points[c.points.length - 1]
        return (
          <g key={ci} style={{ color: col }}>
            <path d={d} fill="none" stroke={col} strokeWidth={5.5} opacity={0.14} strokeLinecap="round" />
            <path d={d} fill="none" stroke={col} strokeWidth={2.3} strokeDasharray={c.dashed ? '6 4' : undefined} strokeLinecap="round" />
            {c.type === 'line' && c.points.length > 1 && c.points.map(([px, py], i) => (
              <circle key={`p${i}`} cx={X(px)} cy={Y(py)} r={2.6} fill={col} stroke={CARD} strokeWidth={1} />
            ))}
            {c.label && <HText x={X(last[0]) + (X(xAxis.max) - X(last[0]) > 60 ? 8 : -8)} y={Y(last[1]) - 6} text={c.label} fontSize={10.5} anchor={X(xAxis.max) - X(last[0]) > 60 ? 'start' : 'end'} fill={col} />}
          </g>
        )
      })}
      {/* markers with crosshair */}
      {D.markers?.map((m, i) => (
        <g key={i}>
          <line x1={X(m.x)} y1={axY} x2={X(m.x)} y2={Y(m.y)} stroke={m.color ?? MUT} strokeWidth={1} strokeDasharray="3 3" opacity={0.85} />
          <line x1={axX} y1={Y(m.y)} x2={X(m.x)} y2={Y(m.y)} stroke={m.color ?? MUT} strokeWidth={1} strokeDasharray="3 3" opacity={0.85} />
          <circle cx={X(m.x)} cy={Y(m.y)} r={7} fill={m.color ?? GOLD} opacity={0.22} />
          <circle cx={X(m.x)} cy={Y(m.y)} r={3.8} fill={m.color ?? GOLD} stroke={CARD} strokeWidth={1.4} />
          {m.label && <HText x={X(m.x) + 9} y={Y(m.y) - 7} text={m.label} fontSize={10.5} fill={m.color ?? FG} />}
        </g>
      ))}
    </svg>
  )
}
function niceTicks(min: number, max: number, n = 5): number[] {
  const out: number[] = []
  for (let i = 0; i <= n; i++) out.push(min + ((max - min) * i) / n)
  return out
}
function fmtTick(v: number): string {
  if (Math.abs(v) < 1e-9) return '0'
  if (Math.abs(v) >= 1000 || Math.abs(v) < 0.01) return v.toExponential(0).replace('e+', 'e')
  return String(Math.round(v * 100) / 100)
}
function catmullRom(pts: Array<[number, number]>): string {
  if (pts.length < 3) return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ')
  let d = `M ${pts[0][0]} ${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)]
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${p2[0]} ${p2[1]}`
  }
  return d
}

// ================= CIRCUIT =================
function Circuit({ D }: { D: CircuitDiagram }) {
  const xs = D.components.flatMap(c => 'x1' in c ? [c.x1, c.x2] : [c.x])
  const ys = D.components.flatMap(c => 'y1' in c ? [c.y1, c.y2] : [c.y])
  const minX = Math.min(...xs) - 74, maxX = Math.max(...xs) + 74
  const minY = Math.min(...ys) - 58, maxY = Math.max(...ys) + 58
  const W = maxX - minX, H = maxY - minY
  const gridDots: Array<[number, number]> = []
  for (let gx = Math.ceil(minX / 24) * 24; gx < maxX; gx += 24)
    for (let gy = Math.ceil(minY / 24) * 24; gy < maxY; gy += 24) gridDots.push([gx, gy])
  return (
    <svg viewBox={`${minX} ${minY} ${W} ${H}`} className="h-auto w-full max-w-[540px]" role="img" aria-label="circuit diagram" style={{ maxHeight: 340 }}>
      {arrowDefs('ckt')}
      <rect x={minX + 10} y={minY + 10} width={W - 20} height={H - 20} rx={10} fill="var(--secondary)" fillOpacity={0.25} />
      {gridDots.map(([gx, gy], i) => <circle key={i} cx={gx} cy={gy} r={0.8} fill={BRD} opacity={0.7} />)}
      {D.components.map((c, i) => <CircuitElem key={i} c={c} />)}
    </svg>
  )
}
function CircuitElem({ c }: { c: CircuitDiagram['components'][number] }) {
  const stroke = FG
  switch (c.type) {
    case 'wire': return <line x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2} stroke={stroke} strokeWidth={2} strokeLinecap="round" />
    case 'junction': return <g>
      <circle cx={c.x} cy={c.y} r={6} fill={stroke} opacity={0.18} />
      <circle cx={c.x} cy={c.y} r={3.4} fill={stroke} />
    </g>
    case 'resistor': {
      const pts = zigzag(c.x1, c.y1, c.x2, c.y2, 7)
      return <g>
        <polyline points={pts.map(p => p.join(',')).join(' ')} fill="none" stroke={stroke} strokeWidth={1.9} strokeLinejoin="round" />
        {(c.label || c.value) && <Chip x={(c.x1 + c.x2) / 2} y={(c.y1 + c.y2) / 2 - 17} text={[c.label, c.value].filter(Boolean).join(' = ')} color={GOLD} />}
      </g>
    }
    case 'inductor': {
      const pts = coil(c.x1, c.y1, c.x2, c.y2, 4)
      return <g>
        <polyline points={pts.map(p => p.join(',')).join(' ')} fill="none" stroke={stroke} strokeWidth={1.9} strokeLinejoin="round" />
        {(c.label || c.value) && <Chip x={(c.x1 + c.x2) / 2} y={(c.y1 + c.y2) / 2 - 17} text={[c.label, c.value].filter(Boolean).join(' = ')} color={GOLD} />}
      </g>
    }
    case 'capacitor': return <g>
      {capPlates(c.x1, c.y1, c.x2, c.y2)}
      {(c.label || c.value) && <Chip x={(c.x1 + c.x2) / 2} y={(c.y1 + c.y2) / 2 - 19} text={[c.label, c.value].filter(Boolean).join(' = ')} color={GOLD} />}
    </g>
    case 'bulb': {
      const mx = (c.x1 + c.x2) / 2, my = (c.y1 + c.y2) / 2
      return <g>
        <line x1={c.x1} y1={c.y1} x2={mx - 11} y2={my} stroke={stroke} strokeWidth={2} />
        <line x1={mx + 11} y1={my} x2={c.x2} y2={c.y2} stroke={stroke} strokeWidth={2} />
        <circle cx={mx} cy={my} r={11} fill={CARD} stroke={stroke} strokeWidth={1.7} />
        <circle cx={mx} cy={my} r={14.5} fill={GOLD} opacity={0.12} />
        <path d={`M ${mx - 5} ${my - 5} L ${mx + 5} ${my + 5} M ${mx + 5} ${my - 5} L ${mx - 5} ${my + 5}`} stroke={stroke} strokeWidth={1.5} />
        {(c.label || c.value) && <Chip x={mx} y={my - 20} text={[c.label, c.value].filter(Boolean).join(' = ')} color={GOLD} />}
      </g>
    }
    case 'battery': case 'cell': {
      const dx = c.x2 - c.x1, dy = c.y2 - c.y1
      const len = Math.hypot(dx, dy) || 1
      const px = -dy / len, py = dx / len
      const g = 4.5, pl = 11
      const ax = c.x1 + dx * 0.42, ay = c.y1 + dy * 0.42
      const bx = c.x2 - dx * 0.42, by = c.y2 - dy * 0.42
      return <g stroke={stroke}>
        <line x1={c.x1} y1={c.y1} x2={c.x1 + dx * 0.4} y2={c.y1 + dy * 0.4} strokeWidth={2} />
        <line x1={c.x2 - dx * 0.4} y1={c.y2 - dy * 0.4} x2={c.x2} y2={c.y2} strokeWidth={2} />
        <line x1={ax - px * pl} y1={ay - py * pl} x2={ax + px * pl} y2={ay + py * pl} strokeWidth={3} />
        <line x1={bx - px * pl * 0.55} y1={by - py * pl * 0.55} x2={bx + px * pl * 0.55} y2={by + py * pl * 0.55} strokeWidth={1.5} />
        <g stroke="none">
          <HText x={ax + px * (pl + 9)} y={ay + py * (pl + 9) + 3.5} text="+" fontSize={11} anchor="middle" fill={CORAL} />
          <HText x={bx + px * (pl + 8)} y={by + py * (pl + 8) + 3.5} text="−" fontSize={11} anchor="middle" fill={TEAL} />
        </g>
        {(c.label || c.value) && <g stroke="none"><Chip x={(c.x1 + c.x2) / 2 + px * 34} y={(c.y1 + c.y2) / 2 + py * 34} text={[c.label, c.value].filter(Boolean).join(' = ')} color={GOLD} /></g>}
      </g>
    }
    case 'acsource': {
      const mx = (c.x1 + c.x2) / 2, my = (c.y1 + c.y2) / 2
      const r = 14
      return <g>
        <line x1={c.x1} y1={c.y1} x2={mx - r} y2={my} stroke={stroke} strokeWidth={2} />
        <line x1={mx + r} y1={my} x2={c.x2} y2={c.y2} stroke={stroke} strokeWidth={2} />
        <circle cx={mx} cy={my} r={r} fill={CARD} stroke={stroke} strokeWidth={1.7} />
        <path d={sinePath(mx, my, r - 5)} fill="none" stroke={stroke} strokeWidth={1.6} />
        {(c.label || c.value) && <Chip x={mx} y={my - r - 12} text={[c.label, c.value].filter(Boolean).join(' = ')} color={GOLD} />}
      </g>
    }
    case 'switch': {
      const mx = (c.x1 + c.x2) / 2, my = (c.y1 + c.y2) / 2
      const closed = c.closed !== false
      return <g>
        {closed && <line x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2} stroke={stroke} strokeWidth={2} />}
        {!closed && <>
          <circle cx={c.x1} cy={c.y1} r={2.8} fill={stroke} />
          <circle cx={c.x2} cy={c.y2} r={2.8} fill={stroke} />
          <line x1={c.x1} y1={c.y1} x2={mx} y2={my - (Math.abs(c.x2 - c.x1) + Math.abs(c.y2 - c.y1)) * 0.14} stroke={stroke} strokeWidth={1.9} strokeLinecap="round" />
        </>}
        {c.label && <Chip x={mx} y={my - 17} text={c.label} color={GOLD} />}
      </g>
    }
    case 'ammeter': case 'voltmeter': {
      const mx = (c.x1 + c.x2) / 2, my = (c.y1 + c.y2) / 2
      const r = 13
      const isA = c.type === 'ammeter'
      const col = isA ? CORAL : VIOLET
      return <g>
        <line x1={c.x1} y1={c.y1} x2={mx - r} y2={my} stroke={stroke} strokeWidth={2} />
        <line x1={mx + r} y1={my} x2={c.x2} y2={c.y2} stroke={stroke} strokeWidth={2} />
        <circle cx={mx} cy={my} r={r + 3.5} fill={col} opacity={0.14} />
        <circle cx={mx} cy={my} r={r} fill={CARD} stroke={stroke} strokeWidth={1.7} />
        <text x={mx} y={my + 4.5} textAnchor="middle" fontSize={12.5} fontWeight={700} fill={stroke}>{isA ? 'A' : 'V'}</text>
        {(c.label || c.value) && <Chip x={mx} y={my - r - 11} text={[c.label, c.value].filter(Boolean).join(' ')} color={col} />}
      </g>
    }
  }
}
function zigzag(x1: number, y1: number, x2: number, y2: number, n: number): Array<[number, number]> {
  const dx = x2 - x1, dy = y2 - y1
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len, uy = dy / len
  const px = -uy, py = ux
  const lead = Math.min(14, len * 0.2)
  const pts: Array<[number, number]> = [[x1, y1], [x1 + ux * lead, y1 + uy * lead]]
  const seg = (len - 2 * lead) / n
  const amp = Math.min(9, seg * 0.55)
  for (let i = 0; i < n; i++) {
    const t0 = lead + i * seg
    pts.push([x1 + ux * (t0 + seg / 2) + px * amp, y1 + uy * (t0 + seg / 2) + py * amp])
    pts.push([x1 + ux * (t0 + seg), y1 + uy * (t0 + seg)])
  }
  pts.push([x2, y2])
  return pts
}
function coil(x1: number, y1: number, x2: number, y2: number, n: number): Array<[number, number]> {
  const dx = x2 - x1, dy = y2 - y1
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len, uy = dy / len
  const px = -uy, py = ux
  const lead = Math.min(12, len * 0.2)
  const seg = (len - 2 * lead) / n
  const pts: Array<[number, number]> = [[x1, y1], [x1 + ux * lead, y1 + uy * lead]]
  for (let i = 0; i < n; i++) {
    const t = lead + i * seg
    const amp = Math.min(8, seg * 0.4)
    for (let k = 0; k <= 8; k++) {
      const tt = t + (seg * k) / 8
      pts.push([x1 + ux * tt + px * amp * Math.sin((k / 8) * Math.PI), y1 + uy * tt + py * amp * Math.sin((k / 8) * Math.PI)])
    }
  }
  pts.push([x2, y2])
  return pts
}
function capPlates(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2
  const dx = x2 - x1, dy = y2 - y1
  const len = Math.hypot(dx, dy) || 1
  const px = -dy / len, py = dx / len
  const h = 11, g = 3.5
  return <g stroke={FG} strokeWidth={2}>
    <line x1={x1} y1={y1} x2={mx - px * g} y2={my - py * g} />
    <line x1={mx + px * g} y1={my + py * g} x2={x2} y2={y2} />
    <line x1={mx - px * g - px * h} y1={my - py * g - py * h} x2={mx - px * g + px * h} y2={my - py * g + py * h} strokeWidth={3} />
    <line x1={mx + px * g - px * h * 0.7} y1={my + py * g - py * h * 0.7} x2={mx + px * g + px * h * 0.7} y2={my + py * g + py * h * 0.7} strokeWidth={2.4} />
  </g>
}
function sinePath(cx: number, cy: number, r: number): string {
  let d = `M ${cx - r} ${cy}`
  for (let i = 0; i <= 20; i++) {
    const t = i / 20
    d += ` L ${cx - r + 2 * r * t} ${cy - Math.sin(t * 2 * Math.PI) * r * 0.5}`
  }
  return d
}

// ================= RAY (optics) =================
function Ray({ D }: { D: RayDiagram }) {
  const xs: number[] = []
  D.elements.forEach(e => { xs.push(e.x - 40, e.x + 40) })
  D.rays.forEach(r => { xs.push(r.from[0], r.to[0]) })
  const minX = Math.min(0, ...xs) - 16, maxX = Math.max(400, ...xs) + 16
  const W = maxX - minX, H = 310, cy = H / 2
  const X = (v: number) => v - minX
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full max-w-[540px]" role="img" aria-label="ray diagram" style={{ maxHeight: 330 }}>
      {arrowDefs('rayar')}
      {/* optical axis */}
      {D.axis !== false && <g>
        <line x1={8} y1={cy} x2={W - 8} y2={cy} stroke={MUT} strokeWidth={1.1} strokeDasharray="7 5" />
        <path d={`M ${W - 4} ${cy} l -7 -3.2 l 0 6.4 z`} fill={MUT} />
        {D.axisLabel && <>
          <HText x={14} y={cy + 16} text={D.axisLabel[0]} fontSize={10.5} fill={MUT} weight={400} />
          <HText x={W - 14} y={cy + 16} text={D.axisLabel[1]} fontSize={10.5} fill={MUT} weight={400} anchor="end" />
        </>}
      </g>}
      {D.elements.map((e, i) => {
        const h = e.height ?? 60
        switch (e.type) {
          case 'lens-convex': return <g key={i}>
            <path d={`M ${X(e.x)} ${cy - h} Q ${X(e.x) + 15} ${cy} ${X(e.x)} ${cy + h} Q ${X(e.x) - 15} ${cy} ${X(e.x)} ${cy - h} Z`} fill={FG} fillOpacity={0.07} stroke={FG} strokeWidth={1.7} />
            <path d={`M ${X(e.x) - 5} ${cy - h + 12} l 5 -8 l 5 8 M ${X(e.x) - 5} ${cy + h - 12} l 5 8 l 5 -8`} stroke={FG} strokeWidth={1.4} fill="none" />
            {e.focal !== undefined && <>
              {[X(e.x) - e.focal, X(e.x) + e.focal].map((fx, j) => fx > 4 && fx < W - 8 && (
                <g key={`f${j}`}>
                  <circle cx={fx} cy={cy} r={3} fill={GOLD} stroke={CARD} strokeWidth={1.2} />
                  <HText x={fx} y={cy + 18} text="F" fontSize={10.5} anchor="middle" fill={GOLD} italic />
                </g>
              ))}
            </>}
            {e.label && <HText x={X(e.x)} y={cy - h - 9} text={e.label} fontSize={11} anchor="middle" />}
          </g>
          case 'lens-concave': return <g key={i}>
            <path d={`M ${X(e.x) - 10} ${cy - h} Q ${X(e.x)} ${cy} ${X(e.x) - 10} ${cy + h} M ${X(e.x) + 10} ${cy - h} Q ${X(e.x)} ${cy} ${X(e.x) + 10} ${cy + h}`} fill="none" stroke={FG} strokeWidth={1.7} />
            <line x1={X(e.x) - 10} y1={cy - h} x2={X(e.x) + 10} y2={cy - h} stroke={FG} strokeWidth={1} strokeDasharray="3 3" />
            <line x1={X(e.x) - 10} y1={cy + h} x2={X(e.x) + 10} y2={cy + h} stroke={FG} strokeWidth={1} strokeDasharray="3 3" />
            {/* concave fins point inward */}
            <path d={`M ${X(e.x) - 10 - 5} ${cy - h + 12} l 5 -8 l 5 8 M ${X(e.x) + 10 + 5} ${cy + h - 12} l -5 8 l -5 -8`} stroke={FG} strokeWidth={1.4} fill="none" />
            {e.label && <HText x={X(e.x)} y={cy - h - 9} text={e.label} fontSize={11} anchor="middle" />}
          </g>
          case 'mirror-concave': return <g key={i}>
            <path d={`M ${X(e.x)} ${cy - h} Q ${X(e.x) - h * 0.45} ${cy} ${X(e.x)} ${cy + h}`} fill="none" stroke={FG} strokeWidth={2.2} />
            {hatch(X(e.x), cy, h, -1)}
            {e.focal !== undefined && X(e.x) - e.focal > 6 && <>
              <circle cx={X(e.x) - e.focal} cy={cy} r={3} fill={GOLD} stroke={CARD} strokeWidth={1.2} />
              <HText x={X(e.x) - e.focal} y={cy + 18} text="F" fontSize={10.5} anchor="middle" fill={GOLD} italic />
              <circle cx={X(e.x) - 2 * e.focal} cy={cy} r={2.6} fill={GOLD} opacity={0.75} stroke={CARD} strokeWidth={1.1} />
              <HText x={X(e.x) - 2 * e.focal} y={cy + 18} text="C" fontSize={10.5} anchor="middle" fill={GOLD} italic />
            </>}
            {e.label && <HText x={X(e.x)} y={cy - h - 9} text={e.label} fontSize={11} anchor="middle" />}
          </g>
          case 'mirror-convex': return <g key={i}>
            <path d={`M ${X(e.x)} ${cy - h} Q ${X(e.x) + h * 0.45} ${cy} ${X(e.x)} ${cy + h}`} fill="none" stroke={FG} strokeWidth={2.2} />
            {hatch(X(e.x), cy, h, 1)}
            {e.label && <HText x={X(e.x)} y={cy - h - 9} text={e.label} fontSize={11} anchor="middle" />}
          </g>
          case 'mirror-plane': return <g key={i}>
            <line x1={X(e.x)} y1={cy - h} x2={X(e.x)} y2={cy + h} stroke={FG} strokeWidth={2.8} />
            {hatch(X(e.x), cy, h, 1)}
            {e.label && <HText x={X(e.x)} y={cy - h - 9} text={e.label} fontSize={11} anchor="middle" />}
          </g>
          case 'prism': {
            const w = e.width ?? 50
            return <g key={i}>
              <polygon points={`${X(e.x)},${cy - h * 0.75} ${X(e.x) - w / 2},${cy + h * 0.45} ${X(e.x) + w / 2},${cy + h * 0.45}`} fill={FG} fillOpacity={0.07} stroke={FG} strokeWidth={1.7} strokeLinejoin="round" />
              <HText x={X(e.x) - 3} y={cy - h * 0.75 - 8} text="A" fontSize={10.5} anchor="middle" fill={MUT} italic />
              {e.label && <HText x={X(e.x)} y={cy + h * 0.45 + 19} text={e.label} fontSize={11} anchor="middle" />}
            </g>
          }
          case 'object': return <g key={i}>
            <line x1={X(e.x)} y1={cy} x2={X(e.x)} y2={cy - h} stroke={CORAL} strokeWidth={3} strokeLinecap="round" style={{ stroke: CORAL }} />
            <path d={`M ${X(e.x)} ${cy - h - 9} l -5.5 10 l 11 0 z`} fill={CORAL} />
            <ellipse cx={X(e.x)} cy={cy + 1.5} rx={7} ry={2.4} fill={CORAL} opacity={0.3} />
            {e.label && <HText x={X(e.x) + 10} y={cy - h + 2} text={e.label} fontSize={11.5} fill={CORAL} />}
          </g>
          case 'screen': case 'barrier': return <g key={i}>
            <line x1={X(e.x)} y1={cy - h} x2={X(e.x)} y2={cy + h} stroke={FG} strokeWidth={3.4} strokeLinecap="round" />
            {Array.from({ length: 11 }).map((_, j) => (
              <line key={j} x1={X(e.x)} y1={cy - h + j * (2 * h / 10)} x2={X(e.x) - 9} y2={cy - h + 6 + j * (2 * h / 10)} stroke={MUT} strokeWidth={1} />
            ))}
            {e.label && <HText x={X(e.x)} y={cy + h + 17} text={e.label} fontSize={11} anchor="middle" />}
          </g>
        }
      })}
      {D.rays.map((r, i) => {
        const col = r.color ?? GOLD
        return <g key={i} style={{ stroke: col }}>
          <line x1={X(r.from[0])} y1={cy - r.from[1]} x2={X(r.to[0])} y2={cy - r.to[1]}
            stroke={col} strokeWidth={1.9} strokeDasharray={r.dashed ? '6 4' : undefined}
            markerEnd="url(#rayar)" strokeLinecap="round" />
          {!r.dashed && midArrow(X(r.from[0]), cy - r.from[1], X(r.to[0]), cy - r.to[1], 0.55, 4.4)}
          {r.label && <HText x={(X(r.from[0]) + X(r.to[0])) / 2 + 5} y={(cy - r.from[1] + cy - r.to[1]) / 2 - 7} text={r.label} fontSize={10.5} fill={col} />}
        </g>
      })}
    </svg>
  )
}
function hatch(x: number, cy: number, h: number, side = 1) {
  return <g>{Array.from({ length: 9 }).map((_, j) => {
    const y = cy - h + 7 + j * ((2 * h - 14) / 8)
    return <line key={j} x1={x} y1={y} x2={x - 8 * side} y2={y + 6 * side} stroke={MUT} strokeWidth={1} opacity={0.8} />
  })}</g>
}

// ================= FBD =================
function Fbd({ D }: { D: FbdDiagram }) {
  const xs: number[] = [], ys: number[] = []
  D.bodies.forEach(b => { xs.push(b.x, b.x + (b.w ?? 60)); ys.push(b.y, b.y + (b.h ?? 60)) })
  D.forces.forEach(f => { xs.push(f.from[0], f.to[0]); ys.push(f.from[1], f.to[1]) })
  D.dims?.forEach(d => { xs.push(d.from[0], d.to[0]); ys.push(d.from[1], d.to[1]) })
  const minX = Math.min(...xs) - 72, maxX = Math.max(...xs) + 72, minY = Math.min(...ys) - 62, maxY = Math.max(...ys) + 62
  return (
    <svg viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`} className="h-auto w-full max-w-[540px]" role="img" aria-label="free body diagram" style={{ maxHeight: 340 }}>
      {arrowDefs('fbda')}
      {D.bodies.map((b, i) => <FbdBody key={i} b={b} />)}
      {D.forces.map((f, i) => {
        const col = f.color ?? GOLD
        return <g key={i} style={{ stroke: col }}>
          <line x1={f.from[0]} y1={f.from[1]} x2={f.to[0]} y2={f.to[1]} stroke={col} strokeWidth={2.6}
            strokeDasharray={f.dashed ? '6 4' : undefined} markerEnd="url(#fbda)" strokeLinecap="round" />
          {f.label && <HText x={(f.from[0] + f.to[0]) / 2 + 7} y={(f.from[1] + f.to[1]) / 2 - 7} text={f.label} fontSize={12.5} italic fill={col} />}
        </g>
      })}
      {D.dims?.map((d, i) => (
        <g key={i}>
          <line x1={d.from[0]} y1={d.from[1]} x2={d.to[0]} y2={d.to[1]} stroke={MUT} strokeWidth={1.2}
            strokeDasharray="4 3" markerStart="url(#fbda)" markerEnd="url(#fbda)" />
          <HText x={(d.from[0] + d.to[0]) / 2} y={(d.from[1] + d.to[1]) / 2 - 7} text={d.label ?? ''} fontSize={11} anchor="middle" fill={MUT} />
        </g>
      ))}
    </svg>
  )
}
function FbdBody({ b }: { b: FbdDiagram['bodies'][number] }) {
  const stroke = FG
  switch (b.type) {
    case 'block': {
      const w = b.w ?? 60, h = b.h ?? 40
      return <g>
        <polygon points={`${b.x + 9},${b.y - 7} ${b.x + w + 9},${b.y - 7} ${b.x + w},${b.y} ${b.x},${b.y}`} fill={FG} opacity={0.22} />
        <polygon points={`${b.x + w},${b.y} ${b.x + w + 9},${b.y - 7} ${b.x + w + 9},${b.y + h - 7} ${b.x + w},${b.y + h}`} fill={FG} opacity={0.12} />
        <rect x={b.x} y={b.y} width={w} height={h} fill="var(--secondary)" stroke={stroke} strokeWidth={1.9} rx={2.5} />
        {b.label && <text x={b.x + w / 2} y={b.y + h / 2 + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill={stroke}>{b.label}</text>}
      </g>
    }
    case 'incline': {
      const w = b.w ?? 140, h = b.h ?? 80
      return <g>
        <polygon points={`${b.x},${b.y + h} ${b.x + w},${b.y + h} ${b.x},${b.y}`} fill="var(--secondary)" stroke={stroke} strokeWidth={1.9} strokeLinejoin="round" />
        <polygon points={`${b.x},${b.y + h} ${b.x + w * 0.45},${b.y + h} ${b.x},${b.y + h * 0.55}`} fill={FG} opacity={0.1} />
        <AngleArc x={b.x + 2} y={b.y + h - 2} r={27} fromDeg={-90} toDeg={-90 + (b.angle ?? 30)} label={`${b.angle ?? 30}°`} filled />
        <line x1={b.x - 6} y1={b.y + h} x2={b.x + w + 14} y2={b.y + h} stroke={MUT} strokeWidth={1} strokeDasharray="2 3" />
        {b.label && <HText x={b.x + w / 2} y={b.y + h - 9} text={b.label} fontSize={12} anchor="middle" />}
      </g>
    }
    case 'rod': return <g>
      <line x1={b.x} y1={b.y} x2={b.x + (b.w ?? 90)} y2={b.y} stroke={stroke} strokeWidth={4} strokeLinecap="round" />
      <line x1={b.x} y1={b.y} x2={b.x + (b.w ?? 90)} y2={b.y} stroke="var(--secondary)" strokeWidth={1.4} />
    </g>
    case 'pulley': return <g>
      <circle cx={b.x} cy={b.y} r={(b.r ?? 16) + 3.5} fill={FG} opacity={0.15} />
      <circle cx={b.x} cy={b.y} r={b.r ?? 16} fill={CARD} stroke={stroke} strokeWidth={2} />
      <circle cx={b.x} cy={b.y} r={(b.r ?? 16) - 5} fill="none" stroke={stroke} strokeWidth={1.1} opacity={0.55} />
      {[0, 90, 180, 270].map(a => (
        <line key={a} x1={b.x} y1={b.y} x2={b.x + ((b.r ?? 16) - 5) * Math.cos(a * Math.PI / 180)} y2={b.y + ((b.r ?? 16) - 5) * Math.sin(a * Math.PI / 180)} stroke={stroke} strokeWidth={0.9} opacity={0.6} />
      ))}
      <circle cx={b.x} cy={b.y} r={2.8} fill={stroke} />
    </g>
    case 'string': return <line x1={b.x} y1={b.y} x2={b.x + (b.w ?? 100)} y2={b.y + (b.h ?? 0)} stroke={MUT} strokeWidth={1.5} strokeDasharray="7 3" />
    case 'ground': return <g>
      <line x1={b.x} y1={b.y} x2={b.x + (b.w ?? 220)} y2={b.y} stroke={stroke} strokeWidth={2.4} strokeLinecap="round" />
      {Array.from({ length: 16 }).map((_, j) => (
        <line key={j} x1={b.x + j * ((b.w ?? 220) / 15)} y1={b.y} x2={b.x + j * ((b.w ?? 220) / 15) - 10} y2={b.y + 10} stroke={stroke} strokeWidth={1} />
      ))}
    </g>
    case 'wall': return <g>
      <line x1={b.x} y1={b.y} x2={b.x} y2={b.y + (b.h ?? 160)} stroke={stroke} strokeWidth={2.4} strokeLinecap="round" />
      {Array.from({ length: 13 }).map((_, j) => (
        <line key={j} x1={b.x} y1={b.y + j * ((b.h ?? 160) / 12)} x2={b.x + 10} y2={b.y + 10 + j * ((b.h ?? 160) / 12)} stroke={stroke} strokeWidth={1} />
      ))}
    </g>
    case 'sphere': return <g>
      <circle cx={b.x} cy={b.y} r={(b.r ?? 24) + 4} fill={FG} opacity={0.12} />
      <circle cx={b.x} cy={b.y} r={b.r ?? 24} fill="var(--secondary)" stroke={stroke} strokeWidth={1.9} />
      <circle cx={b.x - (b.r ?? 24) * 0.35} cy={b.y - (b.r ?? 24) * 0.38} r={(b.r ?? 24) * 0.22} fill={FG} opacity={0.18} />
      {b.label && <text x={b.x} y={b.y + 4.5} textAnchor="middle" fontSize={12.5} fontWeight={700} fill={stroke}>{b.label}</text>}
    </g>
    case 'cart': {
      const w = b.w ?? 70, h = b.h ?? 34
      return <g>
        <rect x={b.x} y={b.y} width={w} height={h} fill="var(--secondary)" stroke={stroke} strokeWidth={1.9} rx={4} />
        <rect x={b.x} y={b.y} width={w} height={h * 0.3} rx={4} fill={FG} opacity={0.12} />
        {[b.x + 14, b.x + w - 14].map((wx, j) => (
          <g key={j}>
            <circle cx={wx} cy={b.y + h + 8} r={7.5} fill={CARD} stroke={stroke} strokeWidth={1.6} />
            <circle cx={wx} cy={b.y + h + 8} r={2} fill={stroke} />
            <line x1={wx - 5.5} y1={b.y + h + 8} x2={wx + 5.5} y2={b.y + h + 8} stroke={stroke} strokeWidth={0.8} opacity={0.6} />
            <line x1={wx} y1={b.y + h + 2.5} x2={wx} y2={b.y + h + 13.5} stroke={stroke} strokeWidth={0.8} opacity={0.6} />
          </g>
        ))}
        {b.label && <text x={b.x + w / 2} y={b.y + h / 2 + 5} textAnchor="middle" fontSize={12} fontWeight={700} fill={stroke}>{b.label}</text>}
      </g>
    }
  }
}
function AngleArc({ x, y, r, fromDeg, toDeg, label, filled }: { x: number; y: number; r: number; fromDeg: number; toDeg: number; label?: string; filled?: boolean }) {
  const a0 = (fromDeg * Math.PI) / 180, a1 = (toDeg * Math.PI) / 180
  const x0 = x + r * Math.cos(a0), y0 = y + r * Math.sin(a0)
  const x1 = x + r * Math.cos(a1), y1 = y + r * Math.sin(a1)
  const large = Math.abs(toDeg - fromDeg) > 180 ? 1 : 0
  const mid = (a0 + a1) / 2
  const diff = Math.abs(toDeg - fromDeg)
  const isRight = Math.abs(diff - 90) < 2
  return <g>
    {filled && <path d={`M ${x} ${y} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`} fill={GOLD} opacity={0.13} />}
    {isRight ? (
      <polygon points={`${x + 2 * Math.cos(a0)},${y + 2 * Math.sin(a0)} ${x + 12 * Math.cos(a0)},${y + 12 * Math.sin(a0)} ${x + 12 * Math.cos(a1)},${y + 12 * Math.sin(a1)}`} fill="none" stroke={MUT} strokeWidth={1.2} />
    ) : (
      <path d={`M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`} fill="none" stroke={MUT} strokeWidth={1.2} />
    )}
    {label && <HText x={x + (r + 15) * Math.cos(mid)} y={y + (r + 15) * Math.sin(mid)} text={label} fontSize={11.5} anchor="middle" fill={MUT} />}
  </g>
}

// ================= WAVE =================
function Wave({ D }: { D: WaveDiagram }) {
  const W = 460, H = 230
  const x0 = 38, xEnd = W - 18
  const maxAmp = Math.max(...D.waves.map(w => w.amplitude), 1)
  const mid = (H - 20) / 2 + 10
  const yScale = (H / 2 - 48) / maxAmp
  const colors = [GOLD, EMER, CORAL, VIOLET]
  const wavePaths = D.waves.map(w => {
    let d = ''
    const phase = w.phase ?? 0
    for (let px = 0; px <= xEnd - x0 - 8; px += 1.5) {
      const t = px / (xEnd - x0 - 8)
      const y = mid - w.amplitude * Math.sin(2 * Math.PI * w.cycles * t + phase) * yScale
      d += `${px === 0 ? 'M' : 'L'} ${x0 + 8 + px} ${y} `
    }
    return d
  })
  // wavelength guide from first wave's first two crests
  const w0 = D.waves[0]
  const cyclePx = (xEnd - x0 - 16) / (w0?.cycles || 1)
  const ph0 = w0?.phase ?? 0
  const crestA = x0 + 8 + (Math.PI / 2 - ph0) / (2 * Math.PI) * cyclePx
  const crestB = crestA + cyclePx
  const crestY = mid - (w0?.amplitude ?? 1) * yScale
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full max-w-[480px]" role="img" aria-label={D.title ?? 'waveform'}>
      {arrowDefs('wva')}
      {D.title && (
        <g>
          <rect x={W / 2 - D.title.length * 3.4 - 6} y={2} width={D.title.length * 6.8 + 12} height={16} rx={4} fill={GOLD} opacity={0.12} />
          <text x={W / 2} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={FG}>{D.title}</text>
        </g>
      )}
      {/* grid */}
      <g opacity={0.5}>
        {[-1, -0.5, 0.5, 1].map((f, i) => (
          <line key={i} x1={x0} y1={mid - f * maxAmp * yScale} x2={xEnd} y2={mid - f * maxAmp * yScale} stroke={BRD} strokeWidth={0.6} strokeDasharray={f === 0 ? undefined : '2 4'} />
        ))}
      </g>
      <line x1={x0} y1={mid} x2={xEnd} y2={mid} stroke={FG} strokeWidth={1.3} />
      <line x1={x0} y1={28} x2={x0} y2={H - 12} stroke={FG} strokeWidth={1.3} />
      <path d={`M ${xEnd + 6} ${mid} l -7 -3.2 l 0 6.4 z`} fill={FG} />
      <path d={`M ${x0} ${24} l -3.2 7 l 6.4 0 z`} fill={FG} />
      {D.xAxis?.label && <HText x={xEnd} y={mid + 17} text={D.xAxis.label} fontSize={11} fill={MUT} anchor="end" weight={400} />}
      {D.yAxis?.label && <HText x={x0 - 8} y={26} text={D.yAxis.label} fontSize={11} fill={MUT} weight={400} />}
      {/* amplitude guide */}
      {w0 && <>
        <line x1={x0} y1={crestY} x2={crestA} y2={crestY} stroke={MUT} strokeWidth={1} strokeDasharray="4 3" />
        <line x1={crestA - 1} y1={crestY} x2={crestA - 1} y2={mid} stroke={MUT} strokeWidth={1} strokeDasharray="4 3" />
        <HText x={x0 + 4} y={crestY - 5} text="A" fontSize={11.5} italic fill={MUT} />
      </>}
      {/* wavelength guide */}
      {w0 && crestB < xEnd && <>
        <line x1={crestA} y1={crestY - 14} x2={crestB} y2={crestY - 14} stroke={GOLD} strokeWidth={1.3} markerStart="url(#wva)" markerEnd="url(#wva)" />
        <HText x={(crestA + crestB) / 2} y={crestY - 20} text="λ" fontSize={12} anchor="middle" italic fill={GOLD} />
        <line x1={crestA} y1={crestY - 12} x2={crestA} y2={crestY - 3} stroke={GOLD} strokeWidth={1} opacity={0.6} />
        <line x1={crestB} y1={crestY - 12} x2={crestB} y2={crestY - 3} stroke={GOLD} strokeWidth={1} opacity={0.6} />
      </>}
      {/* waves */}
      {D.waves.map((w, i) => {
        const col = w.color ?? colors[i % colors.length]
        return <g key={i}>
          <path d={wavePaths[i]} fill="none" stroke={col} strokeWidth={5} opacity={0.13} strokeLinecap="round" />
          <path d={wavePaths[i]} fill="none" stroke={col} strokeWidth={2.2} strokeDasharray={w.dashed ? '6 4' : undefined} strokeLinecap="round" />
          {w.label && <HText x={xEnd - 8} y={mid - w.amplitude * yScale * Math.sin(2 * Math.PI * w.cycles + (w.phase ?? 0)) - 8} text={w.label} fontSize={10.5} anchor="end" fill={col} />}
        </g>
      })}
      {/* crest/trough ticks for first wave */}
      {w0 && !w0.dashed && Array.from({ length: w0.cycles }).map((_, i) => {
        const cx = x0 + 8 + ((Math.PI / 2 - ph0) / (2 * Math.PI) + i) * cyclePx
        return cx < xEnd - 4 && <circle key={i} cx={cx} cy={crestY} r={2.2} fill={colors[0]} />
      })}
    </svg>
  )
}

// ================= FIELD =================
function Field({ D }: { D: FieldDiagram }) {
  const b = D.bounds ?? { xMin: -4, xMax: 4, yMin: -3, yMax: 3 }
  const W = 450, H = 340
  const X = (v: number) => ((v - b.xMin) / (b.xMax - b.xMin)) * (W - 2 * PAD) + PAD
  const Y = (v: number) => H - PAD - ((v - b.yMin) / (b.yMax - b.yMin)) * (H - 2 * PAD)
  const lines: Array<{ d: string; midIdx: number }> = []
  if (D.showLines !== false) {
    for (const c of D.charges) {
      const n = Math.min(12, 3 + Math.abs(c.q) * 3)
      for (let i = 0; i < n; i++) {
        const a = (i / n) * 2 * Math.PI
        const dir = c.q > 0 ? 1 : -1
        const r0 = 0.15
        let x = c.x + dir * r0 * Math.cos(a), y = c.y + dir * r0 * Math.sin(a)
        const pts: string[] = [`M ${X(x)} ${Y(y)}`]
        for (let step = 0; step < 3000; step++) {
          const [ex, ey] = Efield(x, y, D.charges)
          const m = Math.hypot(ex, ey) || 1
          const h = 0.025
          x += dir * (ex / m) * h; y += dir * (ey / m) * h
          if (x < b.xMin || x > b.xMax || y < b.yMin || y > b.yMax) break
          if (D.charges.some(ch => ch !== c && Math.hypot(ch.x - x, ch.y - y) < 0.1)) break
          if (Math.hypot(c.x - x, c.y - y) < 0.12 && step > 10) break
          pts.push(`L ${X(x)} ${Y(y)}`)
        }
        if (pts.length > 6) {
          const d = pts.join(' ')
          lines.push({ d, midIdx: Math.floor(pts.length * 0.45) })
        }
      }
    }
  }
  const toXY = (path: string, idx: number): [number, number, number, number] => {
    const segs = path.split(' ').filter(s => s !== 'M' && s !== 'L')
    const i = Math.min(idx, segs.length - 2)
    const [x1, y1] = segs[i]?.split(',').map(Number) ?? [0, 0]
    const [x2, y2] = segs[i + 1]?.split(',').map(Number) ?? [0, 0]
    return [x1, y1, x2, y2]
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full max-w-[470px]" role="img" aria-label="electric field diagram">
      {arrowDefs('flda')}
      <rect x={PAD - 8} y={PAD - 8} width={W - 2 * PAD + 16} height={H - 2 * PAD + 16} rx={8} fill="var(--secondary)" fillOpacity={0.2} />
      <rect x={PAD} y={PAD} width={W - 2 * PAD} height={H - 2 * PAD} fill="none" stroke={BRD} strokeWidth={1} rx={4} />
      {/* faint unit grid */}
      <g opacity={0.5}>
        {Array.from({ length: Math.floor(b.xMax - b.xMin) }).map((_, i) => {
          const gx = Math.ceil(b.xMin) + i
          return <line key={`gx${i}`} x1={X(gx)} y1={PAD} x2={X(gx)} y2={H - PAD} stroke={BRD} strokeWidth={0.5} />
        })}
        {Array.from({ length: Math.floor(b.yMax - b.yMin) }).map((_, i) => {
          const gy = Math.ceil(b.yMin) + i
          return <line key={`gy${i}`} x1={PAD} y1={Y(gy)} x2={W - PAD} y2={Y(gy)} stroke={BRD} strokeWidth={0.5} />
        })}
      </g>
      {lines.map((l, i) => {
        const [ax1, ay1, ax2, ay2] = toXY(l.d, l.midIdx)
        return (
          <g key={i} stroke={MUT} fill={MUT}>
            <path d={l.d} fill="none" stroke={MUT} strokeWidth={1.15} opacity={0.8} />
            <path d={`M ${(ax1 + ax2) / 2} ${(ay1 + ay2) / 2} l -3.4 -1.4 a 3.7 3.7 0 0 1 6.8 0 z`} fill={MUT} transform={`rotate(${(Math.atan2(ay2 - ay1, ax2 - ax1) * 180) / Math.PI + 90} ${(ax1 + ax2) / 2} ${(ay1 + ay2) / 2})`} />
          </g>
        )
      })}
      {D.vectors?.map((v, i) => (
        <g key={i} style={{ stroke: GOLD }}>
          <line x1={X(v.x)} y1={Y(v.y)} x2={X(v.x) + 27} y2={Y(v.y) - 27} stroke={GOLD} strokeWidth={2.3} markerEnd="url(#flda)" strokeLinecap="round" />
          {v.label && <HText x={X(v.x) + 31} y={Y(v.y) - 31} text={v.label} fontSize={11.5} fill={GOLD} italic />}
        </g>
      ))}
      {D.charges.map((c, i) => {
        const r = 11 + Math.min(5, Math.abs(c.q) * 2)
        const col = c.q > 0 ? CORAL : TEAL
        return <g key={i}>
          <circle cx={X(c.x)} cy={Y(c.y)} r={r + 7} fill={col} opacity={0.16} />
          <circle cx={X(c.x)} cy={Y(c.y)} r={r + 3} fill={col} opacity={0.2} />
          <circle cx={X(c.x)} cy={Y(c.y)} r={r} fill={col} stroke={FG} strokeWidth={1.6} />
          <text x={X(c.x)} y={Y(c.y) + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill={c.q > 0 ? '#fff' : '#08131a'}>
            {c.q > 0 ? '+' : '−'}{Math.abs(c.q) > 1 ? Math.abs(c.q) : ''}
          </text>
          {c.label && <Chip x={X(c.x)} y={Y(c.y) + r + 18} text={c.label} color={col} />}
        </g>
      })}
    </svg>
  )
}
function Efield(x: number, y: number, charges: Array<{ x: number; y: number; q: number }>): [number, number] {
  let ex = 0, ey = 0
  for (const c of charges) {
    const dx = x - c.x, dy = y - c.y
    const r2 = dx * dx + dy * dy
    const r = Math.sqrt(r2) || 0.05
    const f = c.q / (r2 * r)
    ex += f * dx; ey += f * dy
  }
  return [ex, ey]
}

// ================= GEOMETRY =================
function Geometry({ D }: { D: GeometryDiagram }) {
  const [x0, x1] = D.xRange, [y0, y1] = D.yRange
  const W = 470, H = 390
  const square = D.square !== false
  const xSpan = x1 - x0 || 1, ySpan = y1 - y0 || 1
  const iw = square ? Math.min(W - 2 * PAD, (H - 2 * PAD - 16) * (xSpan / ySpan)) : W - 2 * PAD
  const ih = square ? iw * (ySpan / xSpan) : H - 2 * PAD - 16
  const ox = PAD + ((W - 2 * PAD) - iw) / 2, oy = H - PAD - ((H - 2 * PAD - 16) - ih) / 2
  const X = (v: number) => ox + ((v - x0) / xSpan) * iw
  const Y = (v: number) => oy - ((v - y0) / ySpan) * ih
  const colors = PALETTE
  const xt = niceTicks(x0, x1, 8), yt = niceTicks(y0, y1, 6)
  const axY = y0 < 0 && y1 > 0 ? Y(0) : oy
  const axX = x0 < 0 && x1 > 0 ? X(0) : ox
  const clip = (a: [number, number], b: [number, number]): Array<[number, number]> => {
    const dx = b[0] - a[0], dy = b[1] - a[1]
    const L = ((Math.abs(xSpan) + Math.abs(ySpan)) * 4) / (Math.hypot(dx, dy) || 1)
    return [[a[0] - dx * L, a[1] - dy * L], [a[0] + dx * L, a[1] + dy * L]]
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full max-w-[500px]" role="img" aria-label={D.title ?? 'geometry diagram'}>
      {arrowDefs('geoa')}
      <rect x={ox} y={oy - ih} width={iw} height={ih} rx={2} fill="var(--secondary)" fillOpacity={0.18} />
      {D.showGrid && <>
        <g opacity={0.4}>
          {xt.slice(0, -1).map((v, i) => [0.25, 0.5, 0.75].map((f, k) => (
            <line key={`mx${i}${k}`} x1={X(v + (xt[i + 1] - v) * f)} y1={oy - ih} x2={X(v + (xt[i + 1] - v) * f)} y2={oy} stroke={BRD} strokeWidth={0.4} />
          )))}
          {yt.slice(0, -1).map((v, i) => [0.25, 0.5, 0.75].map((f, k) => (
            <line key={`my${i}${k}`} x1={ox} y1={Y(v + (yt[i + 1] - v) * f)} x2={ox + iw} y2={Y(v + (yt[i + 1] - v) * f)} stroke={BRD} strokeWidth={0.4} />
          )))}
        </g>
        <g opacity={0.75}>
          {xt.map((v, i) => <line key={`gx${i}`} x1={X(v)} y1={oy - ih} x2={X(v)} y2={oy} stroke={BRD} strokeWidth={0.6} />)}
          {yt.map((v, i) => <line key={`gy${i}`} x1={ox} y1={Y(v)} x2={ox + iw} y2={Y(v)} stroke={BRD} strokeWidth={0.6} />)}
        </g>
      </>}
      <rect x={ox} y={oy - ih} width={iw} height={ih} fill="none" stroke={BRD} strokeWidth={1} rx={2} />
      <line x1={axX} y1={axY} x2={axX + iw} y2={axY} stroke={MUT} strokeWidth={1.2} />
      <line x1={axX} y1={axY} x2={axX} y2={ay_top(oy, ih)} stroke={MUT} strokeWidth={1.2} />
      {xt.map((v, i) => v !== 0 && Math.abs(X(v) - axX) > 2 && (
        <HText key={`tx${i}`} x={X(v)} y={oy + 13} text={fmtTick(v)} fontSize={9} anchor="middle" weight={400} fill={MUT} />
      ))}
      {yt.map((v, i) => v !== 0 && Math.abs(Y(v) - axY) > 2 && (
        <HText key={`ty${i}`} x={axX - 6} y={Y(v) + 3} text={fmtTick(v)} fontSize={9} anchor="end" weight={400} fill={MUT} />
      ))}
      {D.title && (
        <g>
          <rect x={W / 2 - D.title.length * 3.4 - 6} y={2} width={D.title.length * 6.8 + 12} height={16} rx={4} fill={GOLD} opacity={0.12} />
          <text x={W / 2} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={FG}>{D.title}</text>
        </g>
      )}
      {D.elements.map((e, i) => {
        const col = 'color' in e && e.color ? e.color : colors[i % colors.length]
        const dash = 'dashed' in e && e.dashed ? '6 4' : undefined
        switch (e.type) {
          case 'point': return <g key={i}>
            <circle cx={X(e.x)} cy={Y(e.y)} r={5.5} fill={CARD} opacity={0.9} />
            <circle cx={X(e.x)} cy={Y(e.y)} r={3.2} fill={col} />
            {e.label && <HText x={X(e.x) + LP(e.labelPos).dx} y={Y(e.y) + LP(e.labelPos).dy} text={e.label} fontSize={11.5} anchor={LP(e.labelPos).anchor as 'start' | 'middle' | 'end'} fill={FG} />}
          </g>
          case 'line': {
            const [p0, p1] = clip(e.from, e.to)
            return <line key={i} x1={X(p0[0])} y1={Y(p0[1])} x2={X(p1[0])} y2={Y(p1[1])} stroke={col} strokeWidth={1.7} strokeDasharray={dash} />
          }
          case 'segment': {
            const sx = (X(e.from[0]) + X(e.to[0])) / 2, sy = (Y(e.from[1]) + Y(e.to[1])) / 2
            const ang = (Math.atan2(Y(e.to[1]) - Y(e.from[1]), X(e.to[0]) - X(e.from[0])) * 180) / Math.PI
            const flip = ang > 90 || ang < -90
            return <g key={i}>
              <line x1={X(e.from[0])} y1={Y(e.from[1])} x2={X(e.to[0])} y2={Y(e.to[1])} stroke={col} strokeWidth={1.9} strokeDasharray={dash} strokeLinecap="round" />
              {e.label && <HText x={sx} y={sy - 6} text={e.label} fontSize={11} anchor="middle" fill={col} rotate={flip ? ang + 180 : ang} cx={sx} cy={sy - 6} />}
            </g>
          }
          case 'circle': return <g key={i}>
            <circle cx={X(e.cx)} cy={Y(e.cy)} r={(e.r / xSpan) * iw} fill={e.fill ?? 'none'} fillOpacity={0.12} stroke={col} strokeWidth={1.8} strokeDasharray={dash} />
            <circle cx={X(e.cx)} cy={Y(e.cy)} r={1.6} fill={col} />
            {e.label && <HText x={X(e.cx)} y={Y(e.cy) - (e.r / xSpan) * iw - 7} text={e.label} fontSize={11} anchor="middle" fill={col} />}
          </g>
          case 'ellipse': return <g key={i} transform={e.rotate ? `rotate(${-e.rotate} ${X(e.cx)} ${Y(e.cy)})` : undefined}>
            <ellipse cx={X(e.cx)} cy={Y(e.cy)} rx={(e.a / xSpan) * iw} ry={(e.b / ySpan) * ih} fill="none" stroke={col} strokeWidth={1.8} strokeDasharray={dash} />
            <circle cx={X(e.cx)} cy={Y(e.cy)} r={1.6} fill={col} />
            {e.label && <HText x={X(e.cx)} y={Y(e.cy)} text={e.label} fontSize={11} anchor="middle" fill={col} />}
          </g>
          case 'parabola': {
            let d = ''
            const [px0, px1] = e.xRange
            for (let k = 0; k <= 44; k++) {
              const x = px0 + ((px1 - px0) * k) / 44
              const y = e.a * (x - e.vertex[0]) ** 2 + e.vertex[1]
              d += `${k === 0 ? 'M' : 'L'} ${X(x)} ${Y(y)} `
            }
            return <g key={i}>
              <path d={d} fill="none" stroke={col} strokeWidth={4.5} opacity={0.14} strokeLinecap="round" />
              <path d={d} fill="none" stroke={col} strokeWidth={2} strokeDasharray={dash} strokeLinecap="round" />
              <circle cx={X(e.vertex[0])} cy={Y(e.vertex[1])} r={2.4} fill={col} stroke={CARD} strokeWidth={1} />
              {e.label && <HText x={X(e.vertex[0]) + 8} y={Y(e.vertex[1]) - 7} text={e.label} fontSize={11} fill={col} />}
            </g>
          }
          case 'hyperbola': {
            const paths: string[] = []
            const branches = e.branch === 'TB' ? [[1, 0], [-1, 0]] : [[0, 1], [0, -1]]
            for (const [sx, sy] of branches) {
              let d = ''
              for (let k = 0; k <= 30; k++) {
                const t = (k / 30) * 2.2
                const x = e.cx + (sy !== 0 ? e.b * Math.sinh(t) : sx * e.a * Math.cosh(t))
                const y = e.cy + (sy !== 0 ? sy * e.a * Math.cosh(t) : e.b * Math.sinh(t))
                d += `${k === 0 ? 'M' : 'L'} ${X(x)} ${Y(y)} `
              }
              paths.push(d)
            }
            return <g key={i}>{paths.map((d, j) => <path key={j} d={d} fill="none" stroke={col} strokeWidth={2} strokeDasharray={dash} strokeLinecap="round" />)}</g>
          }
          case 'vector': return <g key={i} style={{ stroke: col }}>
            <line x1={X(e.from[0])} y1={Y(e.from[1])} x2={X(e.to[0])} y2={Y(e.to[1])} stroke={col} strokeWidth={2.3} markerEnd="url(#geoa)" strokeLinecap="round" />
            {e.label && <HText x={(X(e.from[0]) + X(e.to[0])) / 2 + 7} y={(Y(e.from[1]) + Y(e.to[1])) / 2 - 7} text={e.label} fontSize={11.5} italic fill={col} />}
          </g>
          case 'label': return <HText key={i} x={X(e.x)} y={Y(e.y)} text={e.text} fontSize={11.5} anchor="middle" fill={e.color ?? FG} />
          case 'angleArc': return <AngleArc key={i} x={X(e.at[0])} y={Y(e.at[1])} r={e.r ?? 24} fromDeg={-e.fromDeg} toDeg={-e.toDeg} label={e.label} filled />
          case 'polygon': {
            const pts = e.points.map(p => `${X(p[0])},${Y(p[1])}`).join(' ')
            return <g key={i}>
              <defs>{hatchPattern(`polyh${i}`, col)}</defs>
              <polygon points={pts} fill={e.fill ?? col} fillOpacity={0.1} stroke={col} strokeWidth={1.8} strokeLinejoin="round" />
              {e.fill === undefined && <polygon points={pts} fill={`url(#polyh${i})`} />}
              {e.label && <HText x={e.points.reduce((s, p) => s + X(p[0]), 0) / e.points.length} y={e.points.reduce((s, p) => s + Y(p[1]), 0) / e.points.length + 3} text={e.label} fontSize={11} anchor="middle" fill={col} />}
            </g>
          }
        }
      })}
    </svg>
  )
}
function ay_top(oy: number, ih: number) { return oy - ih }
function LP(pos?: string): { dx: number; dy: number; anchor: string } {
  switch (pos) {
    case 'N': return { dx: 0, dy: -9, anchor: 'middle' }
    case 'S': return { dx: 0, dy: 17, anchor: 'middle' }
    case 'E': return { dx: 9, dy: 4, anchor: 'start' }
    case 'W': return { dx: -9, dy: 4, anchor: 'end' }
    case 'NE': return { dx: 8, dy: -8, anchor: 'start' }
    case 'NW': return { dx: -8, dy: -8, anchor: 'end' }
    case 'SE': return { dx: 8, dy: 16, anchor: 'start' }
    case 'SW': return { dx: -8, dy: 16, anchor: 'end' }
    default: return { dx: 8, dy: -8, anchor: 'start' }
  }
}

// ================= BARS =================
function Bars({ D }: { D: BarsDiagram }) {
  const rows = D.categories.length
  const W = 470, H = 310
  const maxV = Math.max(...D.series.flatMap(s => s.values), 1)
  const minV = D.yAxis.min ?? 0
  const colors = PALETTE
  const top = D.title ? 40 : 28, bottom = 48, left = 50, right = 22
  const ih = H - top - bottom, iw = W - left - right
  const Y = (v: number) => top + ih - ((v - minV) / (maxV - minV)) * ih
  const legend = D.series.filter(s => s.name)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full max-w-[490px]" role="img" aria-label={D.title ?? 'bar chart'}>
      {D.title && (
        <g>
          <rect x={W / 2 - D.title.length * 3.4 - 6} y={3} width={D.title.length * 6.8 + 12} height={16} rx={4} fill={GOLD} opacity={0.12} />
          <text x={W / 2} y={15} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={FG}>{D.title}</text>
        </g>
      )}
      {legend.length > 1 && <LegendRow x={left + 4} y={top - 10} entries={legend.map(s => ({ label: s.name!, color: s.color ?? colors[D.series.indexOf(s) % colors.length] }))} />}
      <rect x={left} y={top} width={iw} height={ih} rx={2} fill="var(--secondary)" fillOpacity={0.2} />
      {niceTicks(minV, maxV, 4).map((v, i) => (
        <g key={i}>
          <line x1={left} y1={Y(v)} x2={W - right} y2={Y(v)} stroke={BRD} strokeWidth={0.7} />
          <HText x={left - 7} y={Y(v) + 3.5} text={fmtTick(v)} fontSize={9.5} anchor="end" weight={400} fill={MUT} />
        </g>
      ))}
      <line x1={left} y1={Y(minV)} x2={W - right} y2={Y(minV)} stroke={FG} strokeWidth={1.5} />
      {D.yAxis.label && <HText x={13} y={top + ih / 2} text={D.yAxis.label} fontSize={11} fill={MUT} rotate={-90} cx={13} cy={top + ih / 2} anchor="middle" />}
      {D.categories.map((cat, ci) => {
        const bw = iw / rows
        const x = left + ci * bw + bw * 0.18
        const w = (bw * 0.64) / (D.stacked ? 1 : D.series.length)
        let stackedY = 0
        return <g key={ci}>
          {D.series.map((s, si) => {
            const v = s.values[ci] ?? 0
            const col = s.color ?? colors[si % colors.length]
            if (D.stacked) {
              const y0 = Y(stackedY + v), hgt = Y(stackedY) - Y(stackedY + v)
              stackedY += v
              return <rect key={si} x={x} y={y0} width={w} height={Math.max(0, hgt) - 1} fill={col} rx={2} stroke={CARD} strokeWidth={0.6} />
            }
            return <g key={si}>
              <rect x={x + si * w} y={Y(v) + 1.5} width={w - 2} height={Math.max(0, Y(minV) - Y(v) - 1.5)} fill={col} opacity={0.55} rx={2.5} />
              <rect x={x + si * w} y={Y(v) + 1.5} width={(w - 2) / 2} height={Math.max(0, Y(minV) - Y(v) - 1.5)} fill={col} rx={2.5} />
              <HText x={x + si * w + (w - 2) / 2} y={Y(v) - 4} text={fmtTick(v)} fontSize={9.5} anchor="middle" fill={col} />
            </g>
          })}
          {D.stacked && stackedY > 0 && <HText x={x + w / 2} y={Y(stackedY) - 5} text={fmtTick(stackedY)} fontSize={10} anchor="middle" fill={FG} />}
          <HText x={left + ci * bw + bw / 2} y={H - bottom + 17} text={cat} fontSize={10} anchor="middle" weight={400} fill={MUT} />
          <line x1={left + ci * bw + bw / 2} y1={Y(minV)} x2={left + ci * bw + bw / 2} y2={Y(minV) + 4} stroke={FG} strokeWidth={1} />
        </g>
      })}
    </svg>
  )
}

// ================= TABLE =================
function Table({ D }: { D: TableDiagram }) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-full rounded-lg border border-border shadow-sm">
        <table className="w-full min-w-[300px] max-w-[520px] border-collapse text-[13px]">
          {D.caption && (
            <caption className="border-b border-border bg-muted/40 px-3 py-1.5 text-center text-xs font-semibold tracking-wide text-muted-foreground">{D.caption}</caption>
          )}
          <thead>
            <tr>{D.headers.map((h, i) => (
              <th key={i} className="border-b border-border bg-primary/10 px-2.5 py-2 text-left text-[11px] font-bold uppercase tracking-wider text-foreground/80">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {D.rows.map((r, ri) => (
              <tr key={ri} className={ri % 2 === 1 ? 'bg-muted/25' : undefined}>
                {r.map((c, ci) => {
                  const hl = D.highlightCells?.some(([hr, hc]) => hr === ri && hc === ci)
                  return (
                    <td key={ci} className={cn('border-b border-border/60 px-2.5 py-1.5',
                      hl && 'bg-primary/20 font-bold shadow-[inset_3px_0_0_0_var(--gold)]')}>{c}</td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ================= MOLECULE =================
const ELEM_COLORS: Record<string, string> = {
  O: CORAL, N: VIOLET, S: TEAL, F: TEAL, Cl: EMER, Br: CORAL, I: VIOLET, P: VIOLET, H: MUT, C: FG, Na: CORAL, K: VIOLET,
}
function elemColor(sym: string): string { return ELEM_COLORS[sym] ?? FG }

function Molecule({ D }: { D: MoleculeDiagram }) {
  const xs = D.atoms.map(a => a.x), ys = D.atoms.map(a => a.y)
  const minX = Math.min(...xs) - 58, maxX = Math.max(...xs) + 58, minY = Math.min(...ys) - 58, maxY = Math.max(...ys) + 58
  return (
    <svg viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`} className="h-auto w-full" style={{ maxHeight: 310, maxWidth: 390 }} role="img" aria-label={D.caption ?? 'molecular structure'}>
      {D.bonds.map((b, i) => {
        const a1 = D.atoms[b.a], a2 = D.atoms[b.b]
        if (!a1 || !a2) return null
        const order = b.order ?? 1
        const dx = a2.x - a1.x, dy = a2.y - a1.y
        const len = Math.hypot(dx, dy) || 1
        const px = -dy / len, py = dx / len
        const g1 = a1.sym === 'H' ? 9 : 13, g2 = a2.sym === 'H' ? 9 : 13
        const sx = a1.x + (dx / len) * g1, sy = a1.y + (dy / len) * g1
        const ex = a2.x - (dx / len) * g2, ey = a2.y - (dy / len) * g2
        if (b.type === 'wedge') {
          return <polygon key={i} points={`${sx},${sy} ${ex + px * 6.5},${ey + py * 6.5} ${ex - px * 6.5},${ey - py * 6.5}`} fill={FG} opacity={0.92} />
        }
        if (b.type === 'hash') {
          return <g key={i}>{Array.from({ length: 7 }).map((_, j) => {
            const t = (j + 0.5) / 7
            const w = 1.5 + t * 7
            const bx = sx + (dx / len) * t * (len - g1 - g2)
            const by = sy + (dy / len) * t * (len - g1 - g2)
            return <line key={j} x1={bx + px * w} y1={by + py * w} x2={bx - px * w} y2={by - py * w} stroke={FG} strokeWidth={1.4} />
          })}</g>
        }
        const offs = order === 3 ? [-4.2, 0, 4.2] : order === 2 ? [-2.8, 2.8] : [0]
        return <g key={i}>{offs.map((o, j) => (
          <line key={j} x1={sx + px * o} y1={sy + py * o} x2={ex + px * o} y2={ey + py * o}
            stroke={FG} strokeWidth={1.8} strokeDasharray={b.type === 'dashed' ? '4 3' : undefined} />
        ))}</g>
      })}
      {D.lonePairs?.map((lp, i) => {
        const a = D.atoms[lp.atom]
        if (!a) return null
        const angles = lp.angles ?? defaultLonePairAngles(lp.count)
        return <g key={i}>{Array.from({ length: lp.count }).map((_, j) => {
          const ang = (angles[j] ?? 0) * Math.PI / 180
          return <g key={j}>
            <ellipse cx={a.x + Math.cos(ang) * 22} cy={a.y + Math.sin(ang) * 22} rx={6} ry={4.2}
              transform={`rotate(${(angles[j] ?? 0) + 90} ${a.x + Math.cos(ang) * 22} ${a.y + Math.sin(ang) * 22})`}
              fill="none" stroke={MUT} strokeWidth={1} opacity={0.85} />
            <circle cx={a.x + Math.cos(ang) * 22 - 2.2 * Math.cos(ang + Math.PI / 2)} cy={a.y + Math.sin(ang) * 22 - 2.2 * Math.sin(ang + Math.PI / 2)} r={1.7} fill={MUT} />
            <circle cx={a.x + Math.cos(ang) * 22 + 2.2 * Math.cos(ang + Math.PI / 2)} cy={a.y + Math.sin(ang) * 22 + 2.2 * Math.sin(ang + Math.PI / 2)} r={1.7} fill={MUT} />
          </g>
        })}</g>
      })}
      {D.atoms.map((a, i) => {
        const r = a.sym === 'H' ? 8.5 : 11.5
        const col = elemColor(a.sym)
        return <g key={i}>
          <circle cx={a.x} cy={a.y} r={r} fill={CARD} stroke={col} strokeWidth={1.7} />
          <circle cx={a.x - r * 0.32} cy={a.y - r * 0.35} r={r * 0.24} fill={col} opacity={0.16} />
          <text x={a.x} y={a.y + 4} textAnchor="middle" fontSize={a.sym.length > 1 ? 10 : 11.5} fontWeight={700} fill={col}>{a.sym}</text>
          {a.charge && <HText x={a.x + r + 2} y={a.y - r + 3} text={a.charge} fontSize={10} anchor="middle" fill={CORAL} />}
          {a.label && <HText x={a.x} y={a.y + r + 14} text={a.label} fontSize={10} anchor="middle" fill={MUT} weight={400} />}
        </g>
      })}
      {D.caption && <HText x={(minX + maxX) / 2} y={maxY - 10} text={D.caption} fontSize={11} anchor="middle" fill={MUT} weight={400} />}
    </svg>
  )
}
function defaultLonePairAngles(count: number): number[] {
  if (count === 1) return [90]
  if (count === 2) return [45, 135]
  if (count === 3) return [30, 90, 150]
  return [20, 70, 110, 160]
}

// ================= ORGANIC =================
function Organic({ D }: { D: OrganicDiagram }) {
  const xs: number[] = [], ys: number[] = []
  D.parts.forEach(p => {
    if (p.type === 'ring') { const R = 42; xs.push(p.x - R, p.x + R); ys.push(p.y - R, p.y + R) }
    if (p.type === 'chain') { xs.push(p.x - 10, p.x + p.atoms.length * 26 + 10); ys.push(p.y - 34, p.y + 34) }
    if (p.type === 'arrow') { xs.push(p.x1, p.x2); ys.push(p.y1, p.y2) }
    if (p.type === 'text' || p.type === 'plus') { xs.push(p.x - 60, p.x + 60); ys.push(p.y - 12, p.y + 12) }
    if (p.type === 'bracket') { xs.push(p.x - 12, p.x + 12); ys.push(p.y - 10, p.y + (p.h ?? 36) + 16) }
  })
  const minX = Math.min(...xs) - 26, maxX = Math.max(...xs) + 26, minY = Math.min(...ys) - 24, maxY = Math.max(...ys) + 24
  return (
    <svg viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`} className="h-auto w-full max-w-[560px]" role="img" aria-label={D.caption ?? 'organic chemistry scheme'} style={{ maxHeight: 360 }}>
      {arrowDefs('orga')}
      {D.parts.map((p, i) => <OrganicPartView key={i} p={p} />)}
      {D.caption && <HText x={(minX + maxX) / 2} y={maxY - 8} text={D.caption} fontSize={11} anchor="middle" fill={MUT} weight={400} />}
    </svg>
  )
}
function ringPoints(cx: number, cy: number, n: number, R = 34): Array<[number, number]> {
  const pts: Array<[number, number]> = []
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n
    pts.push([cx + R * Math.cos(a), cy + R * Math.sin(a)])
  }
  return pts
}
function OrganicPartView({ p }: { p: OrganicPart }) {
  switch (p.type) {
    case 'ring': {
      const n = p.ringSize ?? 6
      const R = 34
      const pts = ringPoints(p.x, p.y, n, R)
      const hetero = new Map((p.hetero ?? []).map(([idx, sym]) => [idx, sym]))
      const aromatic = p.aromatic ?? (n === 6)
      return <g>
        {pts.map((pt, i) => {
          const nb = pts[(i + 1) % n]
          const isDouble = !aromatic && i % 2 === 0
          const mx = (pt[0] + nb[0]) / 2, my = (pt[1] + nb[1]) / 2
          const icx = p.x + (mx - p.x) * 0.78, icy = p.y + (my - p.y) * 0.78
          const dx = nb[0] - pt[0], dy = nb[1] - pt[1]
          return <g key={i}>
            <line x1={pt[0]} y1={pt[1]} x2={nb[0]} y2={nb[1]} stroke={FG} strokeWidth={1.9} />
            {isDouble && <line x1={icx - dx * 0.34} y1={icy - dy * 0.34} x2={icx + dx * 0.34} y2={icy + dy * 0.34} stroke={FG} strokeWidth={1.6} />}
          </g>
        })}
        {aromatic && n === 6 && <circle cx={p.x} cy={p.y} r={R * 0.55} fill="none" stroke={FG} strokeWidth={1.4} strokeDasharray="4 3" />}
        {pts.map((pt, i) => {
          const sym = hetero.get(i)
          return sym ? (
            <g key={`h${i}`}>
              <circle cx={pt[0]} cy={pt[1]} r={10.5} fill={CARD} stroke={elemColor(sym)} strokeWidth={1.5} />
              <text x={pt[0]} y={pt[1] + 3.5} textAnchor="middle" fontSize={11} fontWeight={700} fill={elemColor(sym)}>{sym}</text>
            </g>
          ) : null
        })}
        {p.label && <HText x={p.x} y={p.y + R + 18} text={p.label} fontSize={11} anchor="middle" fill={MUT} weight={400} />}
        {(p.substituents ?? []).map((s, i) => {
          const v = pts[s.position % n]
          const dirx = v[0] - p.x, diry = v[1] - p.y
          const m = Math.hypot(dirx, diry) || 1
          const ex = v[0] + (dirx / m) * 32, ey = v[1] + (diry / m) * 32
          return <g key={`s${i}`}>
            {s.bond === 'hash' ? (
              <g>{Array.from({ length: 5 }).map((_, j) => {
                const t = (j + 0.5) / 5
                const w = 1.2 + t * 4.5
                const bx = v[0] + (ex - v[0]) * t, by = v[1] + (ey - v[1]) * t
                const px = -diry / m, py = dirx / m
                return <line key={j} x1={bx + px * w} y1={by + py * w} x2={bx - px * w} y2={by - py * w} stroke={FG} strokeWidth={1.3} />
              })}</g>
            ) : (
              <line x1={v[0]} y1={v[1]} x2={ex} y2={ey} stroke={FG} strokeWidth={1.7} />
            )}
            {s.bond === 'wedge' && <polygon points={`${v[0]},${v[1]} ${ex + 4.5 * (-diry / m)},${ey + 4.5 * (dirx / m)} ${ex - 4.5 * (-diry / m)},${ey - 4.5 * (dirx / m)}`} fill={FG} opacity={0.92} />}
            <HText x={ex + (dirx / m) * 14} y={ey + (diry / m) * 14 + 4} text={s.label} fontSize={11.5} anchor="middle" fill={FG} />
          </g>
        })}
      </g>
    }
    case 'chain': {
      const step = 26
      let x = p.x, y = p.y
      const pts: Array<[number, number]> = [[x, y]]
      p.atoms.forEach((_, i) => {
        x += step
        y += i % 2 === 0 ? -18 : 18
        pts.push([x, y])
      })
      return <g>
        {pts.slice(0, -1).map((pt, i) => (
          <line key={i} x1={pt[0]} y1={pt[1]} x2={pts[i + 1][0]} y2={pts[i + 1][1]} stroke={FG} strokeWidth={1.9} />
        ))}
        {p.atoms.map((a, i) => a.sym !== 'C' ? (
          <g key={i}>
            <circle cx={pts[i][0]} cy={pts[i][1]} r={10.5} fill={CARD} stroke={elemColor(a.sym)} strokeWidth={1.5} />
            <text x={pts[i][0]} y={pts[i][1] + 3.5} textAnchor="middle" fontSize={11} fontWeight={700} fill={elemColor(a.sym)}>{a.sym}</text>
          </g>
        ) : null)}
        {p.label && <HText x={(pts[0][0] + pts[pts.length - 1][0]) / 2} y={Math.max(...pts.map(q => q[1])) + 24} text={p.label} fontSize={11} anchor="middle" fill={MUT} weight={400} />}
      </g>
    }
    case 'arrow': return <g>
      <line x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2} stroke={FG} strokeWidth={2} markerEnd="url(#orga)" strokeLinecap="round" />
      {p.label && <HText x={(p.x1 + p.x2) / 2} y={(p.y1 + p.y2) / 2 + (p.labelAbove ? -9 : 15)} text={p.label} fontSize={11.5} anchor="middle" fill={MUT} weight={500} />}
    </g>
    case 'text': return <HText x={p.x} y={p.y + 4} text={p.text} fontSize={12} anchor="middle" weight={p.bold ? 700 : 500} />
    case 'plus': return <text x={p.x} y={p.y + 6} textAnchor="middle" fontSize={17} fontWeight={700} fill={FG}>+</text>
    case 'bracket': return <g>
      <path d={`M ${p.x} ${p.y} l -7 7 l 0 ${Math.max(8, (p.h ?? 36) - 14)} l 7 7`} fill="none" stroke={FG} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
      {p.label && <Chip x={p.x - 2} y={p.y + (p.h ?? 36) + 18} text={p.label} color={MUT} />}
    </g>
  }
}

// ================= APPARATUS =================
function Apparatus({ D }: { D: ApparatusDiagram }) {
  const xs: number[] = [], ys: number[] = []
  D.parts.forEach(p => {
    if (p.type === 'arrow') { xs.push(p.x1, p.x2); ys.push(p.y1, p.y2) }
    else if ('x' in p) {
      const w = p.type === 'label' ? 0 : (p.w ?? 50), h = p.type === 'label' ? 0 : (p.h ?? 90)
      xs.push(p.x - w / 2 - 12, p.x + w / 2 + 12); ys.push(p.y - h / 2 - 12, p.y + h / 2 + 12)
    }
  })
  const minX = Math.min(...xs) - 26, maxX = Math.max(...xs) + 26, minY = Math.min(...ys) - 24, maxY = Math.max(...ys) + 24
  return (
    <svg viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`} className="h-auto w-full max-w-[540px]" role="img" aria-label={D.caption ?? 'laboratory apparatus'} style={{ maxHeight: 390 }}>
      {arrowDefs('appa')}
      {D.parts.map((p, i) => <ApparatusPartView key={i} p={p} />)}
      {D.caption && <HText x={(minX + maxX) / 2} y={maxY - 8} text={D.caption} fontSize={11} anchor="middle" fill={MUT} weight={400} />}
    </svg>
  )
}
function Liquid({ x, y, w, h, fill }: { x: number; y: number; w: number; h: number; fill?: number }) {
  if (!fill) return null
  const fy = y + h * (1 - fill)
  return (
    <g>
      <rect x={x + 2} y={fy} width={w - 4} height={h * fill - 2} fill={TEAL} opacity={0.32} rx={1} />
      <line x1={x + 2} y1={fy} x2={x + w - 2} y2={fy} stroke={TEAL} strokeWidth={1.6} opacity={0.75} />
      <circle cx={x + w * 0.3} cy={y + h - 6} r={1.5} fill={TEAL} opacity={0.55} />
      <circle cx={x + w * 0.62} cy={y + h - 4} r={1.9} fill={TEAL} opacity={0.45} />
      <circle cx={x + w * 0.78} cy={y + h - 7} r={1.2} fill={TEAL} opacity={0.5} />
    </g>
  )
}
function ApparatusPartView({ p }: { p: ApparatusPart }) {
  const S: React.SVGProps<SVGPathElement> = { stroke: FG, fill: 'none', strokeWidth: 1.7, strokeLinejoin: 'round' as const }
  switch (p.type) {
    case 'flask': {
      const w = p.w ?? 54, h = p.h ?? 80, x = p.x - w / 2, y = p.y - h / 2
      const neckW = 16
      return <g>
        {p.fill ? <path d={`M ${x + w * 0.18} ${y + h * (1 - p.fill * 0.38)} L ${x + 2 + w * 0.24} ${y + h - 2} L ${x + w - 2 - w * 0.24} ${y + h - 2} L ${x + w * 0.82} ${y + h * (1 - p.fill * 0.38)} Z`} fill={TEAL} opacity={0.3} /> : null}
        {p.fill ? <line x1={x + w * 0.18} y1={y + h * (1 - p.fill * 0.38)} x2={x + w * 0.82} y2={y + h * (1 - p.fill * 0.38)} stroke={TEAL} strokeWidth={1.5} opacity={0.75} /> : null}
        <path d={`M ${x + w / 2 - neckW / 2} ${y} L ${x + w / 2 - neckW / 2} ${y + h * 0.3} L ${x + 2} ${y + h} L ${x + w - 2} ${y + h} L ${x + w / 2 + neckW / 2} ${y + h * 0.3} L ${x + w / 2 + neckW / 2} ${y}`} {...S} />
        <line x1={x + w / 2 - neckW / 2 + 2} y1={y + 1} x2={x + w / 2 - neckW / 2 + 2} y2={y + h * 0.3} stroke={FG} strokeWidth={0.7} opacity={0.4} />
        <line x1={x + 4} y1={y + h - 2} x2={x + 5} y2={y + h * 0.9} stroke={FG} strokeWidth={0.7} opacity={0.35} />
        <line x1={x + w - 4} y1={y + h - 2} x2={x + w - 5} y2={y + h * 0.9} stroke={FG} strokeWidth={0.7} opacity={0.35} />
        {p.label && <HText x={p.x} y={y - 9} text={p.label} fontSize={11} anchor="middle" />}
      </g>
    }
    case 'beaker': {
      const w = p.w ?? 60, h = p.h ?? 70, x = p.x - w / 2, y = p.y - h / 2
      return <g>
        <Liquid x={x} y={y} w={w} h={h} fill={p.fill} />
        <path d={`M ${x} ${y} L ${x} ${y + h} L ${x + w} ${y + h} L ${x + w} ${y}`} {...S} />
        <path d={`M ${x - 7} ${y - 5} L ${x + 9} ${y - 5}`} {...S} />
        <line x1={x + 2.5} y1={y + 4} x2={x + 2.5} y2={y + h - 3} stroke={FG} strokeWidth={0.7} opacity={0.35} />
        {[0.25, 0.45, 0.65, 0.85].map((f, j) => (
          <line key={j} x1={x + w - 2} y1={y + h * f} x2={x + w - 9} y2={y + h * f} stroke={FG} strokeWidth={0.8} opacity={0.5} />
        ))}
        {p.label && <HText x={p.x} y={y - 13} text={p.label} fontSize={11} anchor="middle" />}
      </g>
    }
    case 'testtube': {
      const w = p.w ?? 22, h = p.h ?? 76, x = p.x - w / 2, y = p.y - h / 2
      return <g>
        {p.fill ? <path d={`M ${x + 1.5} ${y + h * (1 - p.fill)} L ${x + 1.5} ${y + h - w / 2} A ${w / 2 - 1.5} ${w / 2 - 1.5} 0 0 0 ${x + w - 1.5} ${y + h - w / 2} L ${x + w - 1.5} ${y + h * (1 - p.fill)} Z`} fill={TEAL} opacity={0.32} /> : null}
        {p.fill ? <line x1={x + 1.5} y1={y + h * (1 - p.fill)} x2={x + w - 1.5} y2={y + h * (1 - p.fill)} stroke={TEAL} strokeWidth={1.4} opacity={0.75} /> : null}
        <path d={`M ${x} ${y} L ${x} ${y + h - w / 2} A ${w / 2} ${w / 2} 0 0 0 ${x + w} ${y + h - w / 2} L ${x + w} ${y}`} {...S} />
        <line x1={x + 2} y1={y + 5} x2={x + 2} y2={y + h - w / 2 - 2} stroke={FG} strokeWidth={0.6} opacity={0.4} />
        {p.label && <HText x={p.x} y={y - 9} text={p.label} fontSize={11} anchor="middle" />}
      </g>
    }
    case 'burette': {
      const h = p.h ?? 120, x = p.x, y = p.y - h / 2
      return <g>
        {p.fill ? <rect x={x - 7} y={y + 5} width={14} height={h * 0.5 * p.fill} fill={TEAL} opacity={0.32} /> : null}
        <path d={`M ${x - 9} ${y} L ${x - 9} ${y + h * 0.72} L ${x - 2.5} ${y + h * 0.8} L ${x} ${y + h} L ${x + 2.5} ${y + h * 0.8} L ${x + 9} ${y + h * 0.72} L ${x + 9} ${y}`} {...S} />
        <rect x={x - 6} y={y + h * 0.55} width={12} height={10} rx={2} fill={CARD} stroke={FG} strokeWidth={1.4} />
        <circle cx={x} cy={y + h * 0.55 + 5} r={1.6} fill={FG} />
        {[0.12, 0.22, 0.32, 0.42].map((f, j) => (
          <line key={j} x1={x - 9} y1={y + h * f} x2={x - 4} y2={y + h * f} stroke={FG} strokeWidth={0.8} opacity={0.6} />
        ))}
        {[0.17, 0.27, 0.37, 0.47].map((f, j) => (
          <line key={`m${j}`} x1={x - 9} y1={y + h * f} x2={x - 6.5} y2={y + h * f} stroke={FG} strokeWidth={0.7} opacity={0.45} />
        ))}
        <line x1={x + 4.5} y1={y + 2} x2={x + 4.5} y2={y + h * 0.7} stroke={FG} strokeWidth={0.6} opacity={0.35} />
        {p.label && <HText x={x + 16} y={y + 14} text={p.label} fontSize={11} />}
      </g>
    }
    case 'pipette': {
      const h = p.h ?? 90, x = p.x, y = p.y - h / 2
      return <g>
        <path d={`M ${x - 8} ${y} L ${x - 8} ${y + h * 0.2} L ${x - 2} ${y + h * 0.4} L ${x - 2} ${y + h - 12} L ${x} ${y + h} L ${x + 2} ${y + h - 12} L ${x + 2} ${y + h * 0.4} L ${x + 8} ${y + h * 0.2} L ${x + 8} ${y}`} {...S} />
        <line x1={x - 0.6} y1={y + h * 0.42} x2={x - 0.6} y2={y + h - 13} stroke={FG} strokeWidth={0.6} opacity={0.4} />
        <ellipse cx={x} cy={y + h * 0.06} rx={5} ry={1.6} fill={TEAL} opacity={0.3} />
        {p.label && <HText x={x + 14} y={y + 14} text={p.label} fontSize={11} />}
      </g>
    }
    case 'burner': {
      const y = p.y, x = p.x
      return <g>
        <path d={`M ${x - 17} ${y + 28} L ${x + 17} ${y + 28} L ${x + 11} ${y + 19} L ${x - 11} ${y + 19} Z`} {...S} />
        <rect x={x - 4.5} y={y - 12} width={9} height={31} {...S} />
        <rect x={x - 7} y={y + 4} width={14} height={5} rx={2} fill={CARD} stroke={FG} strokeWidth={1.3} />
        <path d={`M ${x - 10} ${y - 12} C ${x - 11} ${y - 24} ${x - 4} ${y - 26} ${x - 3} ${y - 38} C ${x - 1} ${y - 30} ${x + 1} ${y - 30} ${x + 3} ${y - 38} C ${x + 4} ${y - 26} ${x + 11} ${y - 24} ${x + 10} ${y - 12}`} stroke={CORAL} fill="none" strokeWidth={1.5} opacity={0.85} />
        <path d={`M ${x - 4} ${y - 12} C ${x - 4.5} ${y - 20} ${x - 1} ${y - 22} ${x + 1} ${y - 28} C ${x + 2} ${y - 22} ${x + 4.5} ${y - 20} ${x + 4} ${y - 12}`} stroke={GOLD} fill="none" strokeWidth={1.3} opacity={0.9} />
        {p.label && <HText x={x} y={y + 44} text={p.label} fontSize={11} anchor="middle" />}
      </g>
    }
    case 'thermometer': {
      const h = p.h ?? 84, x = p.x, y = p.y - h / 2
      return <g>
        <rect x={x - 5} y={y} width={10} height={h - 10} rx={5} {...S} />
        <circle cx={x} cy={y + h - 10} r={7.5} fill={CORAL} stroke={FG} strokeWidth={1.3} />
        <circle cx={x - 2} cy={y + h - 12} r={2} fill={FG} opacity={0.25} />
        <rect x={x - 1.5} y={y + 8} width={3} height={h - 24} fill={CORAL} rx={1.5} />
        {[0.15, 0.3, 0.45, 0.6, 0.75].map((f, j) => (
          <line key={j} x1={x + 5} y1={y + (h - 10) * f} x2={x + 9} y2={y + (h - 10) * f} stroke={FG} strokeWidth={0.9} opacity={0.6} />
        ))}
        {p.label && <HText x={x + 13} y={y + 16} text={p.label} fontSize={11} />}
      </g>
    }
    case 'tube': {
      const x1 = p.x - (p.w ?? 90) / 2, y1 = p.y, x2 = p.x + (p.w ?? 90) / 2
      return <g>
        <path d={`M ${x1} ${y1} L ${x2} ${y1} M ${x1} ${y1 + 8} L ${x2} ${y1 + 8}`} {...S} />
        <line x1={x1} y1={y1 + 2} x2={x2} y2={y1 + 2} stroke={FG} strokeWidth={0.6} opacity={0.35} />
        {p.label && <HText x={p.x} y={y1 - 9} text={p.label} fontSize={11} anchor="middle" />}
      </g>
    }
    case 'condenser': {
      const w = p.w ?? 90, x = p.x - w / 2, y = p.y
      return <g>
        <rect x={x} y={y - 9} width={w} height={18} rx={3.5} {...S} />
        <rect x={x + w * 0.2} y={y - 15} width={13} height={30} rx={2.5} {...S} />
        <rect x={x + w * 0.68} y={y - 15} width={13} height={30} rx={2.5} {...S} />
        <line x1={x + 6} y1={y} x2={x + w - 6} y2={y} stroke={FG} strokeWidth={1.2} opacity={0.6} />
        <path d={`M ${x + w * 0.265} ${y - 20} l 0 -8`} stroke={TEAL} strokeWidth={1.4} markerEnd="url(#appa)" style={{ stroke: TEAL }} />
        <path d={`M ${x + w * 0.745} ${y + 20} l 0 8`} stroke={TEAL} strokeWidth={1.4} markerEnd="url(#appa)" style={{ stroke: TEAL }} />
        {p.label && <HText x={p.x} y={y - 27} text={p.label} fontSize={11} anchor="middle" />}
      </g>
    }
    case 'funnel': case 'filter': {
      const w = p.w ?? 44, h = p.h ?? 46, x = p.x, y = p.y - h / 2
      return <g>
        <path d={`M ${x - w / 2} ${y} L ${x + w / 2} ${y} L ${x + 3} ${y + h * 0.62} L ${x - 3} ${y + h * 0.62} Z`} {...S} />
        <line x1={x} y1={y + h * 0.62} x2={x} y2={y + h} {...S} />
        {p.type === 'filter' && <path d={`M ${x - w * 0.34} ${y + h * 0.18} L ${x} ${y + h * 0.55} L ${x + w * 0.34} ${y + h * 0.18}`} stroke={GOLD} fill="none" strokeWidth={1.2} opacity={0.8} />}
        <line x1={x - w / 2 - 2} y1={y} x2={x + w / 2 + 2} y2={y} stroke={FG} strokeWidth={2.4} strokeLinecap="round" />
        {p.label && <HText x={x + w / 2 + 10} y={y + 10} text={p.label} fontSize={11} />}
      </g>
    }
    case 'arrow': return <g>
      <line x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2} stroke={p.color ?? GOLD} strokeWidth={2.1} strokeDasharray={p.dashed ? '5 4' : undefined} markerEnd="url(#appa)" strokeLinecap="round" style={{ stroke: p.color ?? GOLD }} />
      {p.label && <HText x={(p.x1 + p.x2) / 2 + 6} y={(p.y1 + p.y2) / 2 - 6} text={p.label} fontSize={11} fill={FG} />}
    </g>
    case 'label': return <HText x={p.x} y={p.y + 4} text={p.text} fontSize={11.5} anchor="middle" weight={p.bold ? 700 : 500} />
    case 'wire': return <line x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2} stroke={MUT} strokeWidth={1.4} strokeDasharray="4 3" />
  }
}

// ================= V3D =================
function V3d({ D }: { D: V3dDiagram }) {
  const L = D.axesLength ?? 3
  const W = 430, H = 350
  const cx = W * 0.46, cy = H * 0.62
  const s = Math.min(W, H) / (2.4 * L)
  const A = Math.PI / 7
  const P = (x: number, y: number, z: number): [number, number] => [
    cx + (x * Math.cos(A) - y * Math.cos(A * 1.8)) * s,
    cy - (z - y * Math.sin(A) * 0.9) * s,
  ]
  const gridEls: React.ReactNode[] = []
  if (D.showGrid !== false) {
    for (let i = -L; i <= L; i += 1) {
      if (i === 0) continue
      const [x1, y1] = P(i, -L, 0), [x2, y2] = P(i, L, 0)
      gridEls.push(<line key={`gx${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={BRD} strokeWidth={0.5} />)
      const [x3, y3] = P(-L, i, 0), [x4, y4] = P(L, i, 0)
      gridEls.push(<line key={`gy${i}`} x1={x3} y1={y3} x2={x4} y2={y4} stroke={BRD} strokeWidth={0.5} />)
    }
  }
  const axes = [
    { label: 'x', to: [L, 0, 0] as [number, number, number] },
    { label: 'y', to: [0, L, 0] as [number, number, number] },
    { label: 'z', to: [0, 0, L] as [number, number, number] },
  ]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full max-w-[460px]" role="img" aria-label="3D geometry diagram">
      {arrowDefs('v3da')}
      {gridEls}
      {axes.map((a, i) => {
        const [x1, y1] = P(0, 0, 0), [x2, y2] = P(...a.to)
        return <g key={i} style={{ stroke: MUT }}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={MUT} strokeWidth={1.5} markerEnd="url(#v3da)" strokeLinecap="round" />
          <HText x={x2 + 10} y={y2 + 5} text={a.label} fontSize={12.5} anchor="middle" italic fill={MUT} />
        </g>
      })}
      {D.planes?.map((pl, i) => {
        const pts = pl.points.map(p => P(...p))
        const cxp = pts.reduce((sm, q) => sm + q[0], 0) / pts.length
        const cyp = pts.reduce((sm, q) => sm + q[1], 0) / pts.length
        return <g key={i}>
          <polygon points={pts.map(p => p.join(',')).join(' ')} fill={pl.color ?? VIOLET} opacity={pl.opacity ?? 0.15} />
          <polygon points={pts.map(p => p.join(',')).join(' ')} fill="none" stroke={pl.color ?? VIOLET} strokeWidth={1.5} strokeDasharray="6 4" />
          {pts.map((pt, j) => <circle key={j} cx={pt[0]} cy={pt[1]} r={2.2} fill={pl.color ?? VIOLET} />)}
          {pl.label && <Chip x={cxp} y={cyp - 6} text={pl.label} color={pl.color ?? VIOLET} />}
        </g>
      })}
      {D.lines?.map((l, i) => {
        const [x1, y1] = P(...l.from), [x2, y2] = P(...l.to)
        return <g key={i}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={l.color ?? GOLD} strokeWidth={2} strokeDasharray={l.dashed ? '5 4' : undefined} strokeLinecap="round" />
          {l.label && <HText x={(x1 + x2) / 2 + 6} y={(y1 + y2) / 2 - 7} text={l.label} fontSize={11.5} fill={l.color ?? GOLD} />}
        </g>
      })}
      {D.vectors?.map((v, i) => {
        const f = v.from ?? [0, 0, 0]
        const [x1, y1] = P(...f), [x2, y2] = P(...v.to)
        const [dx1, dy1] = P(v.to[0], v.to[1], 0)
        return <g key={i} style={{ stroke: v.color ?? CORAL }}>
          <line x1={x2} y1={y2} x2={dx1} y2={dy1} stroke={v.color ?? CORAL} strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={v.color ?? CORAL} strokeWidth={2.5} markerEnd="url(#v3da)" strokeLinecap="round" />
          {v.label && <HText x={(x1 + x2) / 2 + 8} y={(y1 + y2) / 2 - 8} text={v.label} fontSize={12} italic fill={v.color ?? CORAL} />}
        </g>
      })}
      {D.points?.map((p, i) => {
        const [px, py] = P(p.x, p.y, p.z)
        const [gx, gy] = P(p.x, p.y, 0)
        return <g key={i}>
          {p.z !== 0 && <line x1={px} y1={py} x2={gx} y2={gy} stroke={p.color ?? EMER} strokeWidth={0.9} strokeDasharray="3 3" opacity={0.5} />}
          <circle cx={px} cy={py} r={6} fill={p.color ?? EMER} opacity={0.2} />
          <circle cx={px} cy={py} r={3.8} fill={p.color ?? EMER} stroke={CARD} strokeWidth={1.3} />
          {p.label && <HText x={px + 8} y={py - 7} text={p.label} fontSize={11.5} fill={p.color ?? EMER} />}
        </g>
      })}
    </svg>
  )
}
