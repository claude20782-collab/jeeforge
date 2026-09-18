'use client'
/**
 * QuestionDiagram — renders typed DiagramSpec (src/lib/types.ts) as crisp inline SVG.
 * Deterministic, theme-aware (CSS vars), responsive (viewBox), zero network loads.
 * Used by CBT interface, solutions view, and admin question editor.
 */
import type {
  DiagramSpec, GraphDiagram, CircuitDiagram, RayDiagram, FbdDiagram, WaveDiagram,
  FieldDiagram, GeometryDiagram, BarsDiagram, TableDiagram, MoleculeDiagram,
  OrganicDiagram, ApparatusDiagram, V3dDiagram,
} from '@/lib/types'
import { cn } from '@/lib/utils'

const FG = 'var(--foreground)'
const MUT = 'var(--muted-foreground)'
const BRD = 'var(--border)'
const GOLD = 'var(--gold)'
const EMER = 'var(--chart-2)'
const CORAL = 'var(--chart-3)'
const VIOLET = 'var(--chart-4)'
const TEAL = 'var(--chart-5)'

export function QuestionDiagram({ spec, className, compact }: { spec: DiagramSpec; className?: string; compact?: boolean }) {
  try {
    return (
      <figure className={cn('my-3 flex justify-center', className)}>
        <div className={cn(
          'inline-block rounded-lg border bg-card/60 px-2 py-2 sm:px-3',
          compact ? 'max-w-[340px]' : 'max-w-full'
        )}>
          {render(spec)}
        </div>
      </figure>
    )
  } catch {
    return <div className="my-2 rounded border border-destructive/40 bg-destructive/10 p-2 text-xs text-destructive">Diagram unavailable</div>
  }
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
const PAD = 26
function arrowDefs(id: string) {
  return (
    <defs>
      <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="context-stroke" />
      </marker>
    </defs>
  )
}

// ================= GRAPH =================
function Graph({ D }: { D: GraphDiagram }) {
  const W = 420, H = 320
  const { xAxis, yAxis } = D
  const xSpan = xAxis.max - xAxis.min || 1
  const ySpan = yAxis.max - yAxis.min || 1
  const square = D.square !== false
  const iw = square ? Math.min(W - 2 * PAD, (H - 2 * PAD) * (xSpan / ySpan)) : W - 2 * PAD
  const ih = square ? iw * (ySpan / xSpan) : H - 2 * PAD
  const x0 = PAD + ((W - 2 * PAD) - iw) / 2, y0 = H - PAD - ((H - 2 * PAD) - ih) / 2
  const X = (v: number) => x0 + ((v - xAxis.min) / xSpan) * iw
  const Y = (v: number) => y0 - ((v - yAxis.min) / ySpan) * ih
  const ticks = (a: Axis, F: (n: number) => number, horiz: boolean) => {
    const t = a.ticks ?? niceTicks(a.min, a.max)
    return t.map((v, i) => horiz ? (
      <g key={i}>
        <line x1={F(v)} y1={y0} x2={F(v)} y2={y0 + 4} stroke={MUT} strokeWidth={1} />
        <text x={F(v)} y={y0 + 15} textAnchor="middle" fontSize={10} fill={MUT}>{fmtTick(v)}</text>
      </g>
    ) : (
      <g key={i}>
        <line x1={x0 - 4} y1={Y(v)} x2={x0} y2={Y(v)} stroke={MUT} strokeWidth={1} />
        <text x={x0 - 7} y={Y(v) + 3.5} textAnchor="end" fontSize={10} fill={MUT}>{fmtTick(v)}</text>
      </g>
    ))
  }
  const colors = [GOLD, EMER, CORAL, VIOLET, TEAL]
  type Axis = { label?: string; min: number; max: number; ticks?: number[] }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full max-w-[460px]" role="img" aria-label={D.title ?? 'graph'}>
      {D.showGrid && <GridBox x0={x0} y0={y0} iw={iw} ih={ih} X={X} Y={Y} xt={niceTicks(xAxis.min, xAxis.max)} yt={niceTicks(yAxis.min, yAxis.max)} />}
      <line x1={x0} y1={y0} x2={x0 + iw} y2={y0} stroke={FG} strokeWidth={1.4} />
      <line x1={x0} y1={y0} x2={x0} y2={y0 - ih} stroke={FG} strokeWidth={1.4} />
      <path d={`M ${x0 + iw} ${y0} l -7 -3.2 l 0 6.4 z`} fill={FG} />
      <path d={`M ${x0} ${y0 - ih} l -3.2 7 l 6.4 0 z`} fill={FG} />
      {ticks(xAxis, X, true)}{ticks(yAxis, Y, false)}
      {xAxis.label && <text x={x0 + iw / 2} y={y0 + 30} textAnchor="middle" fontSize={11} fill={FG}>{xAxis.label}</text>}
      {yAxis.label && <text x={x0 - 14} y={y0 - ih - 10} fontSize={11} fill={FG}>{yAxis.label}</text>}
      {D.title && <text x={W / 2} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill={FG}>{D.title}</text>}
      {D.shadedRegions?.map((r, i) => (
        <polygon key={i} points={r.points.map(([px, py]) => `${X(px)},${Y(py)}`).join(' ')} fill={r.color ?? GOLD} opacity={0.14} />
      ))}
      {D.curves.map((c, ci) => {
        const col = c.color ?? colors[ci % colors.length]
        if (c.type === 'points') {
          return <g key={ci}>{c.points.map(([px, py], i) => <circle key={i} cx={X(px)} cy={Y(py)} r={3} fill={col} />)}</g>
        }
        const d = c.type === 'curve'
          ? catmullRom(c.points.map(([px, py]) => [X(px), Y(py)]))
          : c.points.map(([px, py], i) => `${i === 0 ? 'M' : 'L'} ${X(px)} ${Y(py)}`).join(' ')
        return <path key={ci} d={d} fill="none" stroke={col} strokeWidth={2} strokeDasharray={c.dashed ? '5 4' : undefined} />
      })}
      {D.markers?.map((m, i) => (
        <g key={i}>
          <line x1={X(m.x)} y1={y0} x2={X(m.x)} y2={Y(m.y)} stroke={m.color ?? MUT} strokeWidth={1} strokeDasharray="3 3" />
          <circle cx={X(m.x)} cy={Y(m.y)} r={3.4} fill={m.color ?? GOLD} />
          {m.label && <text x={X(m.x) + 6} y={Y(m.y) - 6} fontSize={10} fill={m.color ?? FG}>{m.label}</text>}
        </g>
      ))}
    </svg>
  )
}
function GridBox({ x0, y0, iw, ih, X, Y, xt, yt }: { x0: number; y0: number; iw: number; ih: number; X: (n: number) => number; Y: (n: number) => number; xt: number[]; yt: number[] }) {
  return (
    <g opacity={0.5}>
      {xt.map((v, i) => <line key={i} x1={X(v)} y1={y0} x2={X(v)} y2={y0 - ih} stroke={BRD} strokeWidth={0.6} />)}
      {yt.map((v, i) => <line key={i} x1={x0} y1={Y(v)} x2={x0 + iw} y2={Y(v)} stroke={BRD} strokeWidth={0.6} />)}
    </g>
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
  const minX = Math.min(...xs) - 70, maxX = Math.max(...xs) + 70
  const minY = Math.min(...ys) - 55, maxY = Math.max(...ys) + 55
  const W = maxX - minX, H = maxY - minY
  return (
    <svg viewBox={`${minX} ${minY} ${W} ${H}`} className="h-auto w-full max-w-[540px]" role="img" aria-label="circuit diagram" style={{ maxHeight: 340 }}>
      {arrowDefs('ckt')}
      {D.components.map((c, i) => <CircuitElem key={i} c={c} />)}
    </svg>
  )
}
function CircuitElem({ c }: { c: CircuitDiagram['components'][number] }) {
  const stroke = FG
  switch (c.type) {
    case 'wire': return <line x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2} stroke={stroke} strokeWidth={1.8} />
    case 'junction': return <circle cx={c.x} cy={c.y} r={3.5} fill={stroke} />
    case 'resistor': {
      const pts = zigzag(c.x1, c.y1, c.x2, c.y2, 6)
      return <g><polyline points={pts.map(p => p.join(',')).join(' ')} fill="none" stroke={stroke} strokeWidth={1.8} />
        {(c.label || c.value) && midLabel(c.x1, c.y1, c.x2, c.y2, [c.label, c.value].filter(Boolean).join(' = '))}</g>
    }
    case 'inductor': {
      const pts = coil(c.x1, c.y1, c.x2, c.y2, 4)
      return <g><polyline points={pts.map(p => p.join(',')).join(' ')} fill="none" stroke={stroke} strokeWidth={1.8} />
        {(c.label || c.value) && midLabel(c.x1, c.y1, c.x2, c.y2, [c.label, c.value].filter(Boolean).join(' = '))}</g>
    }
    case 'capacitor': return <g>{capPlates(c.x1, c.y1, c.x2, c.y2)}
      {(c.label || c.value) && midLabel(c.x1, c.y1, c.x2, c.y2, [c.label, c.value].filter(Boolean).join(' = '), -16)}</g>
    case 'bulb': {
      const mx = (c.x1 + c.x2) / 2, my = (c.y1 + c.y2) / 2
      return <g>
        <line x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2} stroke={stroke} strokeWidth={1.8} />
        <circle cx={mx} cy={my} r={11} fill="var(--card)" stroke={stroke} strokeWidth={1.6} />
        <path d={`M ${mx - 5} ${my - 5} L ${mx + 5} ${my + 5} M ${mx + 5} ${my - 5} L ${mx - 5} ${my + 5}`} stroke={stroke} strokeWidth={1.4} />
        {(c.label || c.value) && <text x={mx + 14} y={my - 8} fontSize={12} fill={FG}>{[c.label, c.value].filter(Boolean).join(' = ')}</text>}
      </g>
    }
    case 'battery': case 'cell': {
      const dx = c.x2 - c.x1, dy = c.y2 - c.y1
      const len = Math.hypot(dx, dy) || 1
      const px = -dy / len, py = dx / len
      const g = 4.5, pl = 11
      return <g stroke={stroke}>
        <line x1={c.x1} y1={c.y1} x2={c.x1 + dx * 0.4} y2={c.y1 + dy * 0.4} strokeWidth={1.8} />
        <line x1={c.x2 - dx * 0.4} y1={c.y2 - dy * 0.4} x2={c.x2} y2={c.y2} strokeWidth={1.8} />
        <line x1={c.x1 + dx * 0.42 - px * pl} y1={c.y1 + dy * 0.42 - py * pl} x2={c.x1 + dx * 0.42 + px * pl} y2={c.y1 + dy * 0.42 + py * pl} strokeWidth={2.6} />
        <line x1={c.x2 - dx * 0.42 - px * pl * 0.55} y1={c.y2 - dy * 0.42 - py * pl * 0.55} x2={c.x2 - dx * 0.42 + px * pl * 0.55} y2={c.y2 - dy * 0.42 + py * pl * 0.55} strokeWidth={1.3} />
        {(c.label || c.value) && <text x={(c.x1 + c.x2) / 2 + px * 24} y={(c.y1 + c.y2) / 2 + py * 24 + 4} textAnchor="middle" fontSize={12} fill={FG} stroke="none">{[c.label, c.value].filter(Boolean).join(' = ')}</text>}
      </g>
    }
    case 'acsource': {
      const mx = (c.x1 + c.x2) / 2, my = (c.y1 + c.y2) / 2
      const r = 14
      return <g>
        <line x1={c.x1} y1={c.y1} x2={mx - r} y2={my} stroke={stroke} strokeWidth={1.8} />
        <line x1={mx + r} y1={my} x2={c.x2} y2={c.y2} stroke={stroke} strokeWidth={1.8} />
        <circle cx={mx} cy={my} r={r} fill="var(--card)" stroke={stroke} strokeWidth={1.6} />
        <path d={sinePath(mx, my, r - 5)} fill="none" stroke={stroke} strokeWidth={1.5} />
        {(c.label || c.value) && <text x={mx} y={my - r - 8} textAnchor="middle" fontSize={12} fill={FG}>{[c.label, c.value].filter(Boolean).join(' = ')}</text>}
      </g>
    }
    case 'switch': {
      const mx = (c.x1 + c.x2) / 2, my = (c.y1 + c.y2) / 2
      const closed = c.closed !== false
      return <g>
        {closed && <line x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2} stroke={stroke} strokeWidth={1.8} />}
        {!closed && <>
          <circle cx={c.x1} cy={c.y1} r={2.4} fill={stroke} />
          <circle cx={c.x2} cy={c.y2} r={2.4} fill={stroke} />
          <line x1={c.x1} y1={c.y1} x2={mx} y2={my - (Math.abs(c.x2 - c.x1) + Math.abs(c.y2 - c.y1)) * 0.12} stroke={stroke} strokeWidth={1.8} />
        </>}
        {c.label && <text x={mx} y={my - 14} textAnchor="middle" fontSize={11} fill={FG}>{c.label}</text>}
      </g>
    }
    case 'ammeter': case 'voltmeter': {
      const mx = (c.x1 + c.x2) / 2, my = (c.y1 + c.y2) / 2
      const r = 13
      return <g>
        <line x1={c.x1} y1={c.y1} x2={mx - r} y2={my} stroke={stroke} strokeWidth={1.8} />
        <line x1={mx + r} y1={my} x2={c.x2} y2={c.y2} stroke={stroke} strokeWidth={1.8} />
        <circle cx={mx} cy={my} r={r} fill="var(--card)" stroke={stroke} strokeWidth={1.6} />
        <text x={mx} y={my + 4.5} textAnchor="middle" fontSize={12} fontWeight={600} fill={stroke}>{c.type === 'ammeter' ? 'A' : 'V'}</text>
        {(c.label || c.value) && <text x={mx} y={my - r - 7} textAnchor="middle" fontSize={11} fill={FG}>{[c.label, c.value].filter(Boolean).join(' ')}</text>}
      </g>
    }
  }
}
function midLabel(x1: number, y1: number, x2: number, y2: number, text: string, dyOff = -14) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2
  return <text x={mx} y={my + dyOff} textAnchor="middle" fontSize={12} fill={FG}>{text}</text>
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
  return <g stroke={FG} strokeWidth={1.8}>
    <line x1={x1} y1={y1} x2={mx - px * g} y2={my - py * g} />
    <line x1={mx + px * g} y1={my + py * g} x2={x2} y2={y2} />
    <line x1={mx - px * g - px * h} y1={my - py * g - py * h} x2={mx - px * g + px * h} y2={my - py * g + py * h} strokeWidth={2.4} />
    <line x1={mx + px * g - px * h} y1={my + py * g - py * h} x2={mx + px * g + px * h} y2={my + py * g + py * h} strokeWidth={2.4} />
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
  const W = maxX - minX, H = 300, cy = H / 2
  const X = (v: number) => v - minX
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full max-w-[540px]" role="img" aria-label="ray diagram" style={{ maxHeight: 320 }}>
      {arrowDefs('rayar')}
      {D.axis !== false && <g>
        <line x1={0} y1={cy} x2={W} y2={cy} stroke={MUT} strokeWidth={1} strokeDasharray="6 4" />
        {D.axisLabel && <>
          <text x={12} y={cy + 14} fontSize={11} fill={MUT}>{D.axisLabel[0]}</text>
          <text x={W - 12} y={cy + 14} textAnchor="end" fontSize={11} fill={MUT}>{D.axisLabel[1]}</text>
        </>}
      </g>}
      {D.elements.map((e, i) => {
        const h = e.height ?? 60
        switch (e.type) {
          case 'lens-convex': return <g key={i}>
            <path d={`M ${X(e.x)} ${cy - h} Q ${X(e.x) + 14} ${cy} ${X(e.x)} ${cy + h} Q ${X(e.x) - 14} ${cy} ${X(e.x)} ${cy - h} Z`} fill="var(--card)" stroke={FG} strokeWidth={1.6} />
            <path d={`M ${X(e.x) - 5} ${cy - h + 12} l 5 -8 l 5 8 M ${X(e.x) - 5} ${cy + h - 12} l 5 8 l 5 -8`} stroke={FG} strokeWidth={1.3} fill="none" />
            {e.label && <text x={X(e.x)} y={cy - h - 8} textAnchor="middle" fontSize={11} fill={FG}>{e.label}</text>}
          </g>
          case 'lens-concave': return <g key={i}>
            <path d={`M ${X(e.x) - 10} ${cy - h} Q ${X(e.x)} ${cy} ${X(e.x) - 10} ${cy + h} M ${X(e.x) + 10} ${cy - h} Q ${X(e.x)} ${cy} ${X(e.x) + 10} ${cy + h}`} fill="none" stroke={FG} strokeWidth={1.6} />
            {e.label && <text x={X(e.x)} y={cy - h - 8} textAnchor="middle" fontSize={11} fill={FG}>{e.label}</text>}
          </g>
          case 'mirror-concave': return <g key={i}>
            <path d={`M ${X(e.x)} ${cy - h} Q ${X(e.x) - h * 0.45} ${cy} ${X(e.x)} ${cy + h}`} fill="none" stroke={FG} strokeWidth={2} />
            {hatch(X(e.x), cy, h)}
            {e.label && <text x={X(e.x)} y={cy - h - 8} textAnchor="middle" fontSize={11} fill={FG}>{e.label}</text>}
          </g>
          case 'mirror-convex': return <g key={i}>
            <path d={`M ${X(e.x)} ${cy - h} Q ${X(e.x) + h * 0.45} ${cy} ${X(e.x)} ${cy + h}`} fill="none" stroke={FG} strokeWidth={2} />
            {hatch(X(e.x), cy, h)}
            {e.label && <text x={X(e.x)} y={cy - h - 8} textAnchor="middle" fontSize={11} fill={FG}>{e.label}</text>}
          </g>
          case 'mirror-plane': return <g key={i}>
            <line x1={X(e.x)} y1={cy - h} x2={X(e.x)} y2={cy + h} stroke={FG} strokeWidth={2.4} />
            {hatch(X(e.x), cy, h)}
            {e.label && <text x={X(e.x)} y={cy - h - 8} textAnchor="middle" fontSize={11} fill={FG}>{e.label}</text>}
          </g>
          case 'prism': {
            const w = e.width ?? 50
            return <g key={i}>
              <polygon points={`${X(e.x)},${cy - h * 0.75} ${X(e.x) - w / 2},${cy + h * 0.45} ${X(e.x) + w / 2},${cy + h * 0.45}`} fill="var(--card)" stroke={FG} strokeWidth={1.6} />
              {e.label && <text x={X(e.x)} y={cy + h * 0.45 + 18} textAnchor="middle" fontSize={11} fill={FG}>{e.label}</text>}
            </g>
          }
          case 'object': return <g key={i}>
            <line x1={X(e.x)} y1={cy} x2={X(e.x)} y2={cy - h} stroke={CORAL} strokeWidth={2.4} style={{ stroke: CORAL }} />
            <path d={`M ${X(e.x)} ${cy - h} l -4.5 8 l 9 0 z`} fill={CORAL} />
            {e.label && <text x={X(e.x) + 8} y={cy - h + 4} fontSize={11} fill={CORAL}>{e.label}</text>}
          </g>
          case 'screen': case 'barrier': return <g key={i}>
            <line x1={X(e.x)} y1={cy - h} x2={X(e.x)} y2={cy + h} stroke={FG} strokeWidth={3} />
            {Array.from({ length: 9 }).map((_, j) => (
              <line key={j} x1={X(e.x)} y1={cy - h + j * (2 * h / 8)} x2={X(e.x) - 8} y2={cy - h + 6 + j * (2 * h / 8)} stroke={MUT} strokeWidth={1} />
            ))}
            {e.label && <text x={X(e.x)} y={cy + h + 16} textAnchor="middle" fontSize={11} fill={FG}>{e.label}</text>}
          </g>
        }
      })}
      {D.rays.map((r, i) => {
        const col = r.color ?? GOLD
        return <line key={i} x1={X(r.from[0])} y1={cy - r.from[1]} x2={X(r.to[0])} y2={cy - r.to[1]}
          stroke={col} strokeWidth={1.6} strokeDasharray={r.dashed ? '6 4' : undefined}
          markerEnd="url(#rayar)" style={{ stroke: col }} />
      })}
    </svg>
  )
}
function hatch(x: number, cy: number, h: number) {
  return <g>{Array.from({ length: 8 }).map((_, j) => {
    const y = cy - h + 8 + j * ((2 * h - 16) / 7)
    return <line key={j} x1={x} y1={y} x2={x - 7} y2={y + 5} stroke={FG} strokeWidth={0.9} opacity={0.7} />
  })}</g>
}

// ================= FBD =================
function Fbd({ D }: { D: FbdDiagram }) {
  const xs: number[] = [], ys: number[] = []
  D.bodies.forEach(b => { xs.push(b.x, b.x + (b.w ?? 60)); ys.push(b.y, b.y + (b.h ?? 60)) })
  D.forces.forEach(f => { xs.push(f.from[0], f.to[0]); ys.push(f.from[1], f.to[1]) })
  const minX = Math.min(...xs) - 70, maxX = Math.max(...xs) + 70, minY = Math.min(...ys) - 60, maxY = Math.max(...ys) + 60
  return (
    <svg viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`} className="h-auto w-full max-w-[540px]" role="img" aria-label="free body diagram" style={{ maxHeight: 340 }}>
      {arrowDefs('fbda')}
      {D.bodies.map((b, i) => <FbdBody key={i} b={b} />)}
      {D.forces.map((f, i) => {
        const col = f.color ?? GOLD
        return <g key={i}>
          <line x1={f.from[0]} y1={f.from[1]} x2={f.to[0]} y2={f.to[1]} stroke={col} strokeWidth={2.2}
            strokeDasharray={f.dashed ? '6 4' : undefined} markerEnd="url(#fbda)" style={{ stroke: col }} />
          {f.label && <text x={(f.from[0] + f.to[0]) / 2 + 6} y={(f.from[1] + f.to[1]) / 2 - 6} fontSize={12} fontStyle="italic" fill={col}>{f.label}</text>}
        </g>
      })}
      {D.dims?.map((d, i) => (
        <g key={i}>
          <line x1={d.from[0]} y1={d.from[1]} x2={d.to[0]} y2={d.to[1]} stroke={MUT} strokeWidth={1.1} strokeDasharray="4 3" />
          <text x={(d.from[0] + d.to[0]) / 2} y={(d.from[1] + d.to[1]) / 2 - 6} textAnchor="middle" fontSize={11} fill={MUT}>{d.label}</text>
        </g>
      ))}
    </svg>
  )
}
function FbdBody({ b }: { b: FbdDiagram['bodies'][number] }) {
  const stroke = FG
  switch (b.type) {
    case 'block': return <g>
      <rect x={b.x} y={b.y} width={b.w ?? 60} height={b.h ?? 40} fill="var(--secondary)" stroke={stroke} strokeWidth={1.8} rx={3} />
      {b.label && <text x={b.x + (b.w ?? 60) / 2} y={b.y + (b.h ?? 40) / 2 + 5} textAnchor="middle" fontSize={13} fill={stroke}>{b.label}</text>}
    </g>
    case 'incline': {
      const w = b.w ?? 140, h = b.h ?? 80
      return <g>
        <polygon points={`${b.x},${b.y + h} ${b.x + w},${b.y + h} ${b.x},${b.y}`} fill="var(--secondary)" stroke={stroke} strokeWidth={1.8} />
        <AngleArc x={b.x + 2} y={b.y + h - 2} r={26} fromDeg={-90} toDeg={-90 + (b.angle ?? 30)} label={`${b.angle ?? 30}°`} />
        {b.label && <text x={b.x + w / 2} y={b.y + h - 8} textAnchor="middle" fontSize={12} fill={stroke}>{b.label}</text>}
      </g>
    }
    case 'rod': return <line x1={b.x} y1={b.y} x2={b.x + (b.w ?? 90)} y2={b.y} stroke={stroke} strokeWidth={3.4} />
    case 'pulley': return <g>
      <circle cx={b.x} cy={b.y} r={b.r ?? 16} fill="var(--card)" stroke={stroke} strokeWidth={2} />
      <circle cx={b.x} cy={b.y} r={2.5} fill={stroke} />
    </g>
    case 'string': return <line x1={b.x} y1={b.y} x2={b.x + (b.w ?? 100)} y2={b.y + (b.h ?? 0)} stroke={MUT} strokeWidth={1.4} />
    case 'ground': return <g>
      <line x1={b.x} y1={b.y} x2={b.x + (b.w ?? 220)} y2={b.y} stroke={stroke} strokeWidth={2.2} />
      {Array.from({ length: 12 }).map((_, j) => (
        <line key={j} x1={b.x + j * ((b.w ?? 220) / 11)} y1={b.y} x2={b.x + j * ((b.w ?? 220) / 11) - 9} y2={b.y + 9} stroke={stroke} strokeWidth={1} />
      ))}
    </g>
    case 'wall': return <g>
      <line x1={b.x} y1={b.y} x2={b.x} y2={b.y + (b.h ?? 160)} stroke={stroke} strokeWidth={2.2} />
      {Array.from({ length: 10 }).map((_, j) => (
        <line key={j} x1={b.x} y1={b.y + j * ((b.h ?? 160) / 9)} x2={b.x + 9} y2={b.y + 9 + j * ((b.h ?? 160) / 9)} stroke={stroke} strokeWidth={1} />
      ))}
    </g>
    case 'sphere': return <g>
      <circle cx={b.x} cy={b.y} r={b.r ?? 24} fill="var(--secondary)" stroke={stroke} strokeWidth={1.8} />
      {b.label && <text x={b.x} y={b.y + 4} textAnchor="middle" fontSize={12} fill={stroke}>{b.label}</text>}
    </g>
    case 'cart': return <g>
      <rect x={b.x} y={b.y} width={b.w ?? 70} height={b.h ?? 34} fill="var(--secondary)" stroke={stroke} strokeWidth={1.8} rx={4} />
      <circle cx={b.x + 14} cy={b.y + (b.h ?? 34) + 8} r={7} fill="var(--card)" stroke={stroke} strokeWidth={1.5} />
      <circle cx={b.x + (b.w ?? 70) - 14} cy={b.y + (b.h ?? 34) + 8} r={7} fill="var(--card)" stroke={stroke} strokeWidth={1.5} />
      {b.label && <text x={b.x + (b.w ?? 70) / 2} y={b.y + (b.h ?? 34) / 2 + 5} textAnchor="middle" fontSize={12} fill={stroke}>{b.label}</text>}
    </g>
  }
}
function AngleArc({ x, y, r, fromDeg, toDeg, label }: { x: number; y: number; r: number; fromDeg: number; toDeg: number; label?: string }) {
  const a0 = (fromDeg * Math.PI) / 180, a1 = (toDeg * Math.PI) / 180
  const x0 = x + r * Math.cos(a0), y0 = y + r * Math.sin(a0)
  const x1 = x + r * Math.cos(a1), y1 = y + r * Math.sin(a1)
  const large = Math.abs(toDeg - fromDeg) > 180 ? 1 : 0
  const mid = (a0 + a1) / 2
  return <g>
    <path d={`M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`} fill="none" stroke={MUT} strokeWidth={1.1} />
    {label && <text x={x + (r + 14) * Math.cos(mid)} y={y + (r + 14) * Math.sin(mid)} textAnchor="middle" fontSize={11} fill={MUT}>{label}</text>}
  </g>
}

// ================= WAVE =================
function Wave({ D }: { D: WaveDiagram }) {
  const W = 440, H = 200
  const maxAmp = Math.max(...D.waves.map(w => w.amplitude), 1)
  const mid = H / 2
  const yScale = (H / 2 - 36) / maxAmp
  const colors = [GOLD, EMER, CORAL, VIOLET]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full max-w-[460px]" role="img" aria-label={D.title ?? 'waveform'}>
      {D.title && <text x={W / 2} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill={FG}>{D.title}</text>}
      <line x1={30} y1={mid} x2={W - 14} y2={mid} stroke={MUT} strokeWidth={1} />
      <line x1={30} y1={24} x2={30} y2={H - 14} stroke={MUT} strokeWidth={1} />
      {D.xAxis?.label && <text x={W - 14} y={mid + 16} textAnchor="end" fontSize={11} fill={MUT}>{D.xAxis.label}</text>}
      {D.yAxis?.label && <text x={36} y={30} fontSize={11} fill={MUT}>{D.yAxis.label}</text>}
      {D.waves.map((w, i) => {
        let d = ''
        const phase = w.phase ?? 0
        for (let px = 0; px <= W - 60; px += 2) {
          const t = px / (W - 60)
          const y = mid - w.amplitude * Math.sin(2 * Math.PI * w.cycles * t + phase) * yScale
          d += `${px === 0 ? 'M' : 'L'} ${30 + px} ${y} `
        }
        return <path key={i} d={d} fill="none" stroke={w.color ?? colors[i % colors.length]} strokeWidth={2} strokeDasharray={w.dashed ? '6 4' : undefined} />
      })}
    </svg>
  )
}

// ================= FIELD =================
function Field({ D }: { D: FieldDiagram }) {
  const b = D.bounds ?? { xMin: -4, xMax: 4, yMin: -3, yMax: 3 }
  const W = 440, H = 330
  const X = (v: number) => ((v - b.xMin) / (b.xMax - b.xMin)) * (W - 2 * PAD) + PAD
  const Y = (v: number) => H - PAD - ((v - b.yMin) / (b.yMax - b.yMin)) * (H - 2 * PAD)
  const lines: string[] = []
  if (D.showLines !== false) {
    for (const c of D.charges) {
      const n = Math.min(10, 3 + Math.abs(c.q) * 3)
      for (let i = 0; i < n; i++) {
        const a = (i / n) * 2 * Math.PI
        const dir = c.q > 0 ? 1 : -1
        const r0 = 0.15
        let x = c.x + dir * r0 * Math.cos(a), y = c.y + dir * r0 * Math.sin(a)
        let d = `M ${X(x)} ${Y(y)}`
        for (let step = 0; step < 3000; step++) {
          const [ex, ey] = Efield(x, y, D.charges)
          const m = Math.hypot(ex, ey) || 1
          const h = 0.025
          x += dir * (ex / m) * h; y += dir * (ey / m) * h
          if (x < b.xMin || x > b.xMax || y < b.yMin || y > b.yMax) break
          if (D.charges.some(ch => ch !== c && Math.hypot(ch.x - x, ch.y - y) < 0.1)) break
          if (Math.hypot(c.x - x, c.y - y) < 0.12 && step > 10) break
          d += ` L ${X(x)} ${Y(y)}`
        }
        if (d.split(' L ').length > 6) lines.push(d)
      }
    }
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full max-w-[460px]" role="img" aria-label="electric field diagram">
      {arrowDefs('flda')}
      <rect x={PAD} y={PAD} width={W - 2 * PAD} height={H - 2 * PAD} fill="none" stroke={BRD} strokeWidth={1} rx={4} />
      {lines.map((d, i) => <path key={i} d={d} fill="none" stroke={MUT} strokeWidth={1} opacity={0.75} />)}
      {D.vectors?.map((v, i) => (
        <g key={i}>
          <line x1={X(v.x)} y1={Y(v.y)} x2={X(v.x) + 26} y2={Y(v.y) - 26} stroke={GOLD} strokeWidth={2} markerEnd="url(#flda)" style={{ stroke: GOLD }} />
          {v.label && <text x={X(v.x) + 30} y={Y(v.y) - 30} fontSize={11} fill={GOLD}>{v.label}</text>}
        </g>
      ))}
      {D.charges.map((c, i) => {
        const r = 11 + Math.min(5, Math.abs(c.q) * 2)
        const col = c.q > 0 ? CORAL : TEAL
        return <g key={i}>
          <circle cx={X(c.x)} cy={Y(c.y)} r={r} fill={col} stroke={FG} strokeWidth={1.4} />
          <text x={X(c.x)} y={Y(c.y) + 4.5} textAnchor="middle" fontSize={12} fontWeight={700} fill={c.q > 0 ? '#fff' : '#08131a'}>
            {c.q > 0 ? '+' : '−'}{Math.abs(c.q) > 1 ? Math.abs(c.q) : ''}
          </text>
          {c.label && <text x={X(c.x)} y={Y(c.y) + r + 14} textAnchor="middle" fontSize={11} fill={FG}>{c.label}</text>}
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
  const W = 460, H = 380
  const square = D.square !== false
  const xSpan = x1 - x0 || 1, ySpan = y1 - y0 || 1
  const iw = square ? Math.min(W - 2 * PAD, (H - 2 * PAD) * (xSpan / ySpan)) : W - 2 * PAD
  const ih = square ? iw * (ySpan / xSpan) : H - 2 * PAD
  const ox = PAD + ((W - 2 * PAD) - iw) / 2, oy = H - PAD - ((H - 2 * PAD) - ih) / 2
  const X = (v: number) => ox + ((v - x0) / xSpan) * iw
  const Y = (v: number) => oy - ((v - y0) / ySpan) * ih
  const colors = [GOLD, EMER, CORAL, VIOLET, TEAL]
  const clip = (a: [number, number], b: [number, number]): Array<[number, number]> => {
    const dx = b[0] - a[0], dy = b[1] - a[1]
    const L = ((Math.abs(xSpan) + Math.abs(ySpan)) * 4) / (Math.hypot(dx, dy) || 1)
    return [[a[0] - dx * L, a[1] - dy * L], [a[0] + dx * L, a[1] + dy * L]]
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full max-w-[500px]" role="img" aria-label={D.title ?? 'geometry diagram'}>
      {arrowDefs('geoa')}
      {D.showGrid && <GridBox x0={ox} y0={oy} iw={iw} ih={ih} X={X} Y={Y} xt={niceTicks(x0, x1, 8)} yt={niceTicks(y0, y1, 6)} />}
      <line x1={ox} y1={oy} x2={ox + iw} y2={oy} stroke={MUT} strokeWidth={1} />
      <line x1={ox} y1={oy} x2={ox} y2={oy - ih} stroke={MUT} strokeWidth={1} />
      {niceTicks(x0, x1, 8).map((v, i) => v !== 0 && (
        <text key={i} x={X(v)} y={oy + 13} textAnchor="middle" fontSize={9.5} fill={MUT}>{fmtTick(v)}</text>
      ))}
      {niceTicks(y0, y1, 6).map((v, i) => v !== 0 && (
        <text key={i} x={ox - 6} y={Y(v) + 3} textAnchor="end" fontSize={9.5} fill={MUT}>{fmtTick(v)}</text>
      ))}
      {D.title && <text x={W / 2} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill={FG}>{D.title}</text>}
      {D.elements.map((e, i) => {
        const col = 'color' in e && e.color ? e.color : colors[i % colors.length]
        const dash = 'dashed' in e && e.dashed ? '6 4' : undefined
        switch (e.type) {
          case 'point': return <g key={i}>
            <circle cx={X(e.x)} cy={Y(e.y)} r={3.4} fill={col} />
            {e.label && <text x={X(e.x) + LP(e.labelPos).dx} y={Y(e.y) + LP(e.labelPos).dy} textAnchor={LP(e.labelPos).anchor} fontSize={11} fill={FG} fontWeight={600}>{e.label}</text>}
          </g>
          case 'line': {
            const [p0, p1] = clip(e.from, e.to)
            return <line key={i} x1={X(p0[0])} y1={Y(p0[1])} x2={X(p1[0])} y2={Y(p1[1])} stroke={col} strokeWidth={1.6} strokeDasharray={dash} />
          }
          case 'segment': return <g key={i}>
            <line x1={X(e.from[0])} y1={Y(e.from[1])} x2={X(e.to[0])} y2={Y(e.to[1])} stroke={col} strokeWidth={1.8} strokeDasharray={dash} />
            {e.label && <text x={(X(e.from[0]) + X(e.to[0])) / 2 + 5} y={(Y(e.from[1]) + Y(e.to[1])) / 2 - 6} fontSize={11} fill={col}>{e.label}</text>}
          </g>
          case 'circle': return <g key={i}>
            <circle cx={X(e.cx)} cy={Y(e.cy)} r={(e.r / xSpan) * iw} fill={e.fill ?? 'none'} fillOpacity={0.12} stroke={col} strokeWidth={1.7} strokeDasharray={dash} />
            {e.label && <text x={X(e.cx)} y={Y(e.cy) - (e.r / xSpan) * iw - 6} textAnchor="middle" fontSize={11} fill={col}>{e.label}</text>}
          </g>
          case 'ellipse': return <g key={i} transform={e.rotate ? `rotate(${-e.rotate} ${X(e.cx)} ${Y(e.cy)})` : undefined}>
            <ellipse cx={X(e.cx)} cy={Y(e.cy)} rx={(e.a / xSpan) * iw} ry={(e.b / ySpan) * ih} fill="none" stroke={col} strokeWidth={1.7} strokeDasharray={dash} />
            {e.label && <text x={X(e.cx)} y={Y(e.cy)} textAnchor="middle" fontSize={11} fill={col}>{e.label}</text>}
          </g>
          case 'parabola': {
            let d = ''
            const [px0, px1] = e.xRange
            for (let k = 0; k <= 40; k++) {
              const x = px0 + ((px1 - px0) * k) / 40
              const y = e.a * (x - e.vertex[0]) ** 2 + e.vertex[1]
              d += `${k === 0 ? 'M' : 'L'} ${X(x)} ${Y(y)} `
            }
            return <path key={i} d={d} fill="none" stroke={col} strokeWidth={1.8} strokeDasharray={dash} />
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
            return <g key={i}>{paths.map((d, j) => <path key={j} d={d} fill="none" stroke={col} strokeWidth={1.8} strokeDasharray={dash} />)}</g>
          }
          case 'vector': return <g key={i}>
            <line x1={X(e.from[0])} y1={Y(e.from[1])} x2={X(e.to[0])} y2={Y(e.to[1])} stroke={col} strokeWidth={2} markerEnd="url(#geoa)" style={{ stroke: col }} />
            {e.label && <text x={(X(e.from[0]) + X(e.to[0])) / 2 + 6} y={(Y(e.from[1]) + Y(e.to[1])) / 2 - 6} fontSize={11} fontStyle="italic" fill={col}>{e.label}</text>}
          </g>
          case 'label': return <text key={i} x={X(e.x)} y={Y(e.y)} fontSize={11} fill={e.color ?? FG}>{e.text}</text>
          case 'angleArc': return <AngleArc key={i} x={X(e.at[0])} y={Y(e.at[1])} r={e.r ?? 24} fromDeg={-e.fromDeg} toDeg={-e.toDeg} label={e.label} />
          case 'polygon': return <polygon key={i} points={e.points.map(p => `${X(p[0])},${Y(p[1])}`).join(' ')} fill={e.fill ?? 'none'} fillOpacity={0.1} stroke={col} strokeWidth={1.7} />
        }
      })}
    </svg>
  )
}
function LP(pos?: string): { dx: number; dy: number; anchor: string } {
  switch (pos) {
    case 'N': return { dx: 0, dy: -8, anchor: 'middle' }
    case 'S': return { dx: 0, dy: 16, anchor: 'middle' }
    case 'E': return { dx: 8, dy: 4, anchor: 'start' }
    case 'W': return { dx: -8, dy: 4, anchor: 'end' }
    case 'NE': return { dx: 7, dy: -7, anchor: 'start' }
    case 'NW': return { dx: -7, dy: -7, anchor: 'end' }
    case 'SE': return { dx: 7, dy: 15, anchor: 'start' }
    case 'SW': return { dx: -7, dy: 15, anchor: 'end' }
    default: return { dx: 7, dy: -7, anchor: 'start' }
  }
}

// ================= BARS =================
function Bars({ D }: { D: BarsDiagram }) {
  const rows = D.categories.length
  const W = 460, H = 300
  const maxV = Math.max(...D.series.flatMap(s => s.values), 1)
  const minV = D.yAxis.min ?? 0
  const colors = [GOLD, EMER, CORAL, VIOLET, TEAL]
  const top = D.title ? 34 : 24, bottom = 46, left = 46, right = 20
  const ih = H - top - bottom, iw = W - left - right
  const Y = (v: number) => top + ih - ((v - minV) / (maxV - minV)) * ih
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full max-w-[480px]" role="img" aria-label={D.title ?? 'bar chart'}>
      {D.title && <text x={W / 2} y={18} textAnchor="middle" fontSize={11.5} fontWeight={600} fill={FG}>{D.title}</text>}
      {niceTicks(minV, maxV, 4).map((v, i) => (
        <g key={i}>
          <line x1={left} y1={Y(v)} x2={W - right} y2={Y(v)} stroke={BRD} strokeWidth={0.7} />
          <text x={left - 6} y={Y(v) + 3.5} textAnchor="end" fontSize={10} fill={MUT}>{fmtTick(v)}</text>
        </g>
      ))}
      {D.yAxis.label && <text x={12} y={top + ih / 2} fontSize={11} fill={MUT} transform={`rotate(-90 12 ${top + ih / 2})`} textAnchor="middle">{D.yAxis.label}</text>}
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
              return <rect key={si} x={x} y={y0} width={w} height={Math.max(0, hgt)} fill={col} rx={2} />
            }
            return <g key={si}>
              <rect x={x + si * w} y={Y(v)} width={w - 2} height={Math.max(0, Y(minV) - Y(v))} fill={col} rx={2} />
              <text x={x + si * w + (w - 2) / 2} y={Y(v) - 4} textAnchor="middle" fontSize={9.5} fill={col}>{fmtTick(v)}</text>
            </g>
          })}
          <text x={left + ci * bw + bw / 2} y={H - bottom + 16} textAnchor="middle" fontSize={10} fill={MUT}>{cat}</text>
        </g>
      })}
    </svg>
  )
}

// ================= TABLE =================
function Table({ D }: { D: TableDiagram }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[300px] max-w-[520px] border-collapse text-[13px]">
        {D.caption && <caption className="mb-1.5 text-center text-xs text-muted-foreground">{D.caption}</caption>}
        <thead>
          <tr>{D.headers.map((h, i) => (
            <th key={i} className="border border-border bg-muted/60 px-2.5 py-1.5 text-left font-semibold">{h}</th>
          ))}</tr>
        </thead>
        <tbody>
          {D.rows.map((r, ri) => (
            <tr key={ri}>
              {r.map((c, ci) => (
                <td key={ci} className={cn('border border-border px-2.5 py-1.5',
                  D.highlightCells?.some(([hr, hc]) => hr === ri && hc === ci) && 'bg-primary/15 font-semibold')}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ================= MOLECULE =================
function Molecule({ D }: { D: MoleculeDiagram }) {
  const xs = D.atoms.map(a => a.x), ys = D.atoms.map(a => a.y)
  const minX = Math.min(...xs) - 55, maxX = Math.max(...xs) + 55, minY = Math.min(...ys) - 55, maxY = Math.max(...ys) + 55
  return (
    <svg viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`} className="h-auto w-full" style={{ maxHeight: 300, maxWidth: 380 }} role="img" aria-label={D.caption ?? 'molecular structure'}>
      {D.bonds.map((b, i) => {
        const a1 = D.atoms[b.a], a2 = D.atoms[b.b]
        if (!a1 || !a2) return null
        const order = b.order ?? 1
        const dx = a2.x - a1.x, dy = a2.y - a1.y
        const len = Math.hypot(dx, dy) || 1
        const px = -dy / len, py = dx / len
        const gap = 13
        const sx = a1.x + (dx / len) * gap, sy = a1.y + (dy / len) * gap
        const ex = a2.x - (dx / len) * gap, ey = a2.y - (dy / len) * gap
        if (b.type === 'wedge') {
          return <polygon key={i} points={`${sx},${sy} ${ex + px * 6},${ey + py * 6} ${ex - px * 6},${ey - py * 6}`} fill={FG} />
        }
        if (b.type === 'hash') {
          return <g>{Array.from({ length: 5 }).map((_, j) => {
            const t = (j + 0.5) / 5
            const w = 2 + t * 7
            const bx = sx + (dx / len) * t * (len - 2 * gap)
            const by = sy + (dy / len) * t * (len - 2 * gap)
            return <line key={j} x1={bx + px * w} y1={by + py * w} x2={bx - px * w} y2={by - py * w} stroke={FG} strokeWidth={1.3} />
          })}</g>
        }
        const offs = order === 3 ? [-4, 0, 4] : order === 2 ? [-2.6, 2.6] : [0]
        return <g key={i}>{offs.map((o, j) => (
          <line key={j} x1={sx + px * o} y1={sy + py * o} x2={ex + px * o} y2={ey + py * o}
            stroke={FG} strokeWidth={1.7} strokeDasharray={b.type === 'dashed' ? '4 3' : undefined} />
        ))}</g>
      })}
      {D.lonePairs?.map((lp, i) => {
        const a = D.atoms[lp.atom]
        if (!a) return null
        const angles = lp.angles ?? defaultLonePairAngles(lp.count)
        return <g key={i}>{Array.from({ length: lp.count }).map((_, j) => {
          const ang = (angles[j] ?? 0) * Math.PI / 180
          return <g key={j}>
            <circle cx={a.x + Math.cos(ang) * 21} cy={a.y + Math.sin(ang) * 21} r={2} fill={MUT} />
            <circle cx={a.x + Math.cos(ang) * 21 + 5 * Math.cos(ang + Math.PI / 2)} cy={a.y + Math.sin(ang) * 21 + 5 * Math.sin(ang + Math.PI / 2)} r={2} fill={MUT} />
          </g>
        })}</g>
      })}
      {D.atoms.map((a, i) => <g key={i}>
        <circle cx={a.x} cy={a.y} r={11} fill="var(--card)" stroke={FG} strokeWidth={1.4} />
        <text x={a.x} y={a.y + 4} textAnchor="middle" fontSize={11.5} fontWeight={600} fill={FG}>{a.sym}</text>
        {a.charge && <text x={a.x + 11} y={a.y - 8} fontSize={10} fill={CORAL}>{a.charge}</text>}
        {a.label && <text x={a.x} y={a.y + 26} textAnchor="middle" fontSize={10} fill={MUT}>{a.label}</text>}
      </g>)}
      {D.caption && <text x={(minX + maxX) / 2} y={maxY - 10} textAnchor="middle" fontSize={11} fill={MUT}>{D.caption}</text>}
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
    if (p.type === 'bracket') { xs.push(p.x - 10, p.x + 10); ys.push(p.y - 10, p.y + (p.h ?? 36) + 16) }
  })
  const minX = Math.min(...xs) - 26, maxX = Math.max(...xs) + 26, minY = Math.min(...ys) - 24, maxY = Math.max(...ys) + 24
  return (
    <svg viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`} className="h-auto w-full max-w-[560px]" role="img" aria-label={D.caption ?? 'organic chemistry scheme'} style={{ maxHeight: 360 }}>
      {arrowDefs('orga')}
      {D.parts.map((p, i) => <OrganicPart key={i} p={p} />)}
      {D.caption && <text x={(minX + maxX) / 2} y={maxY - 8} textAnchor="middle" fontSize={11} fill={MUT}>{D.caption}</text>}
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
function OrganicPart({ p }: { p: OrganicPart }) {
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
          const icx = p.x + (mx - p.x) * 0.76, icy = p.y + (my - p.y) * 0.76
          const dx = nb[0] - pt[0], dy = nb[1] - pt[1]
          return <g key={i}>
            <line x1={pt[0]} y1={pt[1]} x2={nb[0]} y2={nb[1]} stroke={FG} strokeWidth={1.7} />
            {isDouble && <line x1={icx - dx * 0.34} y1={icy - dy * 0.34} x2={icx + dx * 0.34} y2={icy + dy * 0.34} stroke={FG} strokeWidth={1.5} />}
          </g>
        })}
        {aromatic && n === 6 && <circle cx={p.x} cy={p.y} r={R * 0.56} fill="none" stroke={FG} strokeWidth={1.4} />}
        {pts.map((pt, i) => {
          const sym = hetero.get(i)
          return sym ? (
            <g key={`h${i}`}>
              <circle cx={pt[0]} cy={pt[1]} r={10} fill="var(--card)" />
              <text x={pt[0]} y={pt[1] + 3.5} textAnchor="middle" fontSize={11} fontWeight={600} fill={FG}>{sym}</text>
            </g>
          ) : null
        })}
        {p.label && <text x={p.x} y={p.y + R + 18} textAnchor="middle" fontSize={11} fill={MUT}>{p.label}</text>}
        {(p.substituents ?? []).map((s, i) => {
          const v = pts[s.position % n]
          const dirx = v[0] - p.x, diry = v[1] - p.y
          const m = Math.hypot(dirx, diry) || 1
          const ex = v[0] + (dirx / m) * 32, ey = v[1] + (diry / m) * 32
          return <g key={`s${i}`}>
            <line x1={v[0]} y1={v[1]} x2={ex} y2={ey} stroke={FG} strokeWidth={1.6}
              strokeDasharray={s.bond === 'hash' ? '3 3' : undefined} />
            {s.bond === 'wedge' && <polygon points={`${v[0]},${v[1]} ${ex},${ey + 4.5} ${ex},${ey - 4.5}`} fill={FG} opacity={0.92} />}
            <text x={ex + (dirx / m) * 12} y={ey + (diry / m) * 12 + 4} textAnchor="middle" fontSize={11.5} fill={FG}>{s.label}</text>
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
          <line key={i} x1={pt[0]} y1={pt[1]} x2={pts[i + 1][0]} y2={pts[i + 1][1]} stroke={FG} strokeWidth={1.7} />
        ))}
        {p.atoms.map((a, i) => a.sym !== 'C' ? (
          <g key={i}>
            <circle cx={pts[i][0]} cy={pts[i][1]} r={10} fill="var(--card)" />
            <text x={pts[i][0]} y={pts[i][1] + 3.5} textAnchor="middle" fontSize={11} fontWeight={600} fill={FG}>{a.sym}</text>
          </g>
        ) : null)}
        {p.label && <text x={(pts[0][0] + pts[pts.length - 1][0]) / 2} y={Math.max(...pts.map(q => q[1])) + 24} textAnchor="middle" fontSize={11} fill={MUT}>{p.label}</text>}
      </g>
    }
    case 'arrow': return <g>
      <line x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2} stroke={FG} strokeWidth={1.7} markerEnd="url(#orga)" />
      {p.label && <text x={(p.x1 + p.x2) / 2} y={(p.y1 + p.y2) / 2 + (p.labelAbove ? -8 : 14)} textAnchor="middle" fontSize={11} fill={MUT}>{p.label}</text>}
    </g>
    case 'text': return <text x={p.x} y={p.y} textAnchor="middle" fontSize={12} fontWeight={p.bold ? 600 : 400} fill={FG}>{p.text}</text>
    case 'plus': return <text x={p.x} y={p.y + 5} textAnchor="middle" fontSize={16} fill={FG}>+</text>
    case 'bracket': return <g>
      <path d={`M ${p.x} ${p.y} l -6 6 l 0 ${Math.max(6, (p.h ?? 36) - 12)} l 6 6`} fill="none" stroke={FG} strokeWidth={1.4} />
      {p.label && <text x={p.x - 2} y={p.y + (p.h ?? 36) + 16} textAnchor="middle" fontSize={10} fill={MUT}>{p.label}</text>}
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
    <svg viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`} className="h-auto w-full max-w-[540px]" role="img" aria-label={D.caption ?? 'laboratory apparatus'} style={{ maxHeight: 380 }}>
      {arrowDefs('appa')}
      {D.parts.map((p, i) => <ApparatusPart key={i} p={p} />)}
      {D.caption && <text x={(minX + maxX) / 2} y={maxY - 8} textAnchor="middle" fontSize={11} fill={MUT}>{D.caption}</text>}
    </svg>
  )
}
function ApparatusPart({ p }: { p: ApparatusPart }) {
  const S: React.SVGProps<SVGPathElement> = { stroke: FG, fill: 'none', strokeWidth: 1.7 }
  switch (p.type) {
    case 'flask': {
      const w = p.w ?? 54, h = p.h ?? 80, x = p.x - w / 2, y = p.y - h / 2
      const neckW = 16
      return <g>
        <path d={`M ${x + w / 2 - neckW / 2} ${y} L ${x + w / 2 - neckW / 2} ${y + h * 0.3} L ${x + 2} ${y + h} L ${x + w - 2} ${y + h} L ${x + w / 2 + neckW / 2} ${y + h * 0.3} L ${x + w / 2 + neckW / 2} ${y}`} {...S} />
        {p.fill ? <path d={`M ${x + w * 0.16} ${y + h * (1 - p.fill * 0.42)} L ${x + w * 0.42} ${y + h * 0.55} L ${x + w * 0.58} ${y + h * 0.55} L ${x + w * 0.84} ${y + h * (1 - p.fill * 0.42)} Z`} fill={TEAL} opacity={0.3} /> : null}
        {p.label && <text x={p.x} y={y - 8} textAnchor="middle" fontSize={11} fill={FG}>{p.label}</text>}
      </g>
    }
    case 'beaker': {
      const w = p.w ?? 60, h = p.h ?? 70, x = p.x - w / 2, y = p.y - h / 2
      return <g>
        <path d={`M ${x} ${y} L ${x} ${y + h} L ${x + w} ${y + h} L ${x + w} ${y} M ${x - 6} ${y - 5} L ${x + 8} ${y - 5}`} {...S} />
        {p.fill ? <rect x={x + 2} y={y + h * (1 - p.fill)} width={w - 4} height={h * p.fill - 2} fill={TEAL} opacity={0.3} /> : null}
        {p.label && <text x={p.x} y={y - 12} textAnchor="middle" fontSize={11} fill={FG}>{p.label}</text>}
      </g>
    }
    case 'testtube': {
      const w = p.w ?? 22, h = p.h ?? 76, x = p.x - w / 2, y = p.y - h / 2
      return <g>
        <path d={`M ${x} ${y} L ${x} ${y + h - w / 2} A ${w / 2} ${w / 2} 0 0 0 ${x + w} ${y + h - w / 2} L ${x + w} ${y}`} {...S} />
        {p.fill ? <path d={`M ${x + 1.5} ${y + h * (1 - p.fill)} L ${x + 1.5} ${y + h - w / 2} A ${w / 2 - 1.5} ${w / 2 - 1.5} 0 0 0 ${x + w - 1.5} ${y + h - w / 2} L ${x + w - 1.5} ${y + h * (1 - p.fill)} Z`} fill={TEAL} opacity={0.3} /> : null}
        {p.label && <text x={p.x} y={y - 8} textAnchor="middle" fontSize={11} fill={FG}>{p.label}</text>}
      </g>
    }
    case 'burette': {
      const h = p.h ?? 120, x = p.x, y = p.y - h / 2
      return <g>
        <path d={`M ${x - 9} ${y} L ${x - 9} ${y + h * 0.72} L ${x - 2.5} ${y + h * 0.8} L ${x} ${y + h} L ${x + 2.5} ${y + h * 0.8} L ${x + 9} ${y + h * 0.72} L ${x + 9} ${y}`} {...S} />
        <rect x={x - 6} y={y + h * 0.55} width={12} height={9} fill="var(--card)" stroke={FG} strokeWidth={1.3} />
        {p.fill ? <rect x={x - 7.5} y={y + 4} width={15} height={h * 0.5 * p.fill} fill={TEAL} opacity={0.3} /> : null}
        {p.label && <text x={x + 16} y={y + 14} fontSize={11} fill={FG}>{p.label}</text>}
      </g>
    }
    case 'pipette': {
      const h = p.h ?? 90, x = p.x, y = p.y - h / 2
      return <g>
        <path d={`M ${x - 8} ${y} L ${x - 8} ${y + h * 0.2} L ${x - 2} ${y + h * 0.4} L ${x - 2} ${y + h - 12} L ${x} ${y + h} L ${x + 2} ${y + h - 12} L ${x + 2} ${y + h * 0.4} L ${x + 8} ${y + h * 0.2} L ${x + 8} ${y}`} {...S} />
        {p.label && <text x={x + 14} y={y + 14} fontSize={11} fill={FG}>{p.label}</text>}
      </g>
    }
    case 'burner': {
      const y = p.y, x = p.x
      return <g>
        <path d={`M ${x - 16} ${y + 26} L ${x + 16} ${y + 26} L ${x + 10} ${y + 18} L ${x - 10} ${y + 18} Z`} {...S} />
        <rect x={x - 4} y={y - 12} width={8} height={30} {...S} />
        <path d={`M ${x - 10} ${y - 12} L ${x - 2} ${y - 32} L ${x + 2} ${y - 32} L ${x + 10} ${y - 12}`} stroke={CORAL} fill="none" strokeWidth={1.4} />
        {p.label && <text x={x} y={y + 42} textAnchor="middle" fontSize={11} fill={FG}>{p.label}</text>}
      </g>
    }
    case 'thermometer': {
      const h = p.h ?? 84, x = p.x, y = p.y - h / 2
      return <g>
        <rect x={x - 5} y={y} width={10} height={h - 10} rx={5} {...S} />
        <circle cx={x} cy={y + h - 10} r={7} fill={CORAL} stroke={FG} strokeWidth={1.2} />
        <rect x={x - 1.5} y={y + 8} width={3} height={h - 24} fill={CORAL} />
        {p.label && <text x={x + 12} y={y + 16} fontSize={11} fill={FG}>{p.label}</text>}
      </g>
    }
    case 'tube': {
      const x1 = p.x - (p.w ?? 90) / 2, y1 = p.y, x2 = p.x + (p.w ?? 90) / 2
      return <g>
        <path d={`M ${x1} ${y1} L ${x2} ${y1} M ${x1} ${y1 + 8} L ${x2} ${y1 + 8}`} {...S} />
        {p.label && <text x={p.x} y={y1 - 8} textAnchor="middle" fontSize={11} fill={FG}>{p.label}</text>}
      </g>
    }
    case 'condenser': {
      const w = p.w ?? 90, x = p.x - w / 2, y = p.y
      return <g>
        <rect x={x} y={y - 8} width={w} height={16} rx={3} {...S} />
        <rect x={x + w * 0.2} y={y - 14} width={12} height={28} rx={2} {...S} />
        <rect x={x + w * 0.68} y={y - 14} width={12} height={28} rx={2} {...S} />
        {p.label && <text x={p.x} y={y - 22} textAnchor="middle" fontSize={11} fill={FG}>{p.label}</text>}
      </g>
    }
    case 'funnel': case 'filter': {
      const w = p.w ?? 44, h = p.h ?? 46, x = p.x, y = p.y - h / 2
      return <g>
        <path d={`M ${x - w / 2} ${y} L ${x + w / 2} ${y} L ${x + 3} ${y + h * 0.62} L ${x - 3} ${y + h * 0.62} Z`} {...S} />
        <line x1={x} y1={y + h * 0.62} x2={x} y2={y + h} {...S} />
        {p.label && <text x={x + w / 2 + 8} y={y + 10} fontSize={11} fill={FG}>{p.label}</text>}
      </g>
    }
    case 'arrow': return <g>
      <line x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2} stroke={p.color ?? GOLD} strokeWidth={2} strokeDasharray={p.dashed ? '5 4' : undefined} markerEnd="url(#appa)" style={{ stroke: p.color ?? GOLD }} />
      {p.label && <text x={(p.x1 + p.x2) / 2 + 6} y={(p.y1 + p.y2) / 2 - 6} fontSize={11} fill={FG}>{p.label}</text>}
    </g>
    case 'label': return <text x={p.x} y={p.y} textAnchor="middle" fontSize={11.5} fontWeight={p.bold ? 600 : 400} fill={FG}>{p.text}</text>
    case 'wire': return <line x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2} stroke={MUT} strokeWidth={1.4} strokeDasharray="4 3" />
  }
}

// ================= V3D =================
function V3d({ D }: { D: V3dDiagram }) {
  const L = D.axesLength ?? 3
  const W = 420, H = 340
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
        return <g key={i}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={MUT} strokeWidth={1.3} markerEnd="url(#v3da)" />
          <text x={x2 + 8} y={y2 + 4} fontSize={12} fontStyle="italic" fill={MUT}>{a.label}</text>
        </g>
      })}
      {D.planes?.map((pl, i) => {
        const pts = pl.points.map(p => P(...p))
        return <g key={i}>
          <polygon points={pts.map(p => p.join(',')).join(' ')} fill={pl.color ?? VIOLET} opacity={pl.opacity ?? 0.14} />
          <polygon points={pts.map(p => p.join(',')).join(' ')} fill="none" stroke={pl.color ?? VIOLET} strokeWidth={1.4} strokeDasharray="5 3" />
          {pl.label && <text x={pts[0][0]} y={pts[0][1] - 8} fontSize={11} fill={pl.color ?? VIOLET}>{pl.label}</text>}
        </g>
      })}
      {D.lines?.map((l, i) => {
        const [x1, y1] = P(...l.from), [x2, y2] = P(...l.to)
        return <g key={i}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={l.color ?? GOLD} strokeWidth={1.8} strokeDasharray={l.dashed ? '5 4' : undefined} />
          {l.label && <text x={(x1 + x2) / 2 + 5} y={(y1 + y2) / 2 - 6} fontSize={11} fill={l.color ?? GOLD}>{l.label}</text>}
        </g>
      })}
      {D.vectors?.map((v, i) => {
        const f = v.from ?? [0, 0, 0]
        const [x1, y1] = P(...f), [x2, y2] = P(...v.to)
        return <g key={i}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={v.color ?? CORAL} strokeWidth={2.2} markerEnd="url(#v3da)" style={{ stroke: v.color ?? CORAL }} />
          {v.label && <text x={(x1 + x2) / 2 + 7} y={(y1 + y2) / 2 - 7} fontSize={12} fontStyle="italic" fill={v.color ?? CORAL}>{v.label}</text>}
        </g>
      })}
      {D.points?.map((p, i) => {
        const [px, py] = P(p.x, p.y, p.z)
        return <g key={i}>
          <circle cx={px} cy={py} r={3.6} fill={p.color ?? EMER} />
          {p.label && <text x={px + 7} y={py - 6} fontSize={11.5} fontWeight={600} fill={p.color ?? EMER}>{p.label}</text>}
        </g>
      })}
    </svg>
  )
}
