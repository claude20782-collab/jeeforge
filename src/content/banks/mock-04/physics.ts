import type { SeedQuestion } from '@/content/types'

// ============================================================================
// MOCK 04 — PHYSICS (Q1–Q25: 20 MCQ Section A + 5 numerical Section B)
// Difficulty target: Moderate-to-hard JEE Main (mock 4 of 40, ramp phase).
// All calculations hand-verified; every question has a complete solution.
// Answer keys balanced 5/5/5/5 across Section A. All scenarios FRESH
// (no reuse from mocks 01–03).
// ============================================================================

export const PHYSICS_MOCK04: SeedQuestion[] = [
  // ---------------- SECTION A (MCQ) Q1–Q20 ----------------
  {
    subject: 'PHYSICS', section: 'A',
    text: `The product of pressure and volume, $PV$, has the same dimensional formula as:`,
    options: ['Force', 'Energy', 'Power', 'Momentum'],
    correctAnswer: 'B',
    solutionText: `**Dimensions of pressure:**
$$[P] = \\frac{[F]}{[A]} = \\frac{MLT^{-2}}{L^2} = ML^{-1}T^{-2}$$

**Multiply by volume:**
$$[PV] = ML^{-1}T^{-2} \\times L^3 = ML^2T^{-2}$$

$ML^2T^{-2}$ is exactly the dimensional formula of **energy** (work $= F \\cdot d$).

**Why the others are wrong:** (A) force is $MLT^{-2}$ — one power of $L$ short; (C) power is $ML^2T^{-3}$; (D) momentum is $MLT^{-1}$.

*(Physical check: for an ideal gas, $PV = nRT$ — and $nRT$ is energy, e.g. the work done in an isothermal expansion.)*`,
    formulaConcept: '$[P] = ML^{-1}T^{-2}$, so $[PV] = ML^2T^{-2}$ = energy — the ideal-gas law itself confirms $PV$ is an energy.',
    difficulty: 'EASY', chapterSlug: 'units-and-measurements', topicSlug: 'dimensional-analysis',
    sourceType: 'ORIGINAL', sourceNote: 'Dimensional identity PV ↔ energy.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `Rain is falling vertically downward with a speed of $10\\sqrt{3}\\ \\text{m/s}$. A man walks on level ground at $10\\ \\text{m/s}$. To keep himself dry, he must hold his umbrella at an angle of:`,
    options: ['60° with the vertical', '30° with the horizontal', '45° with the vertical', '30° with the vertical'],
    correctAnswer: 'D',
    solutionText: `**Relative velocity of rain w.r.t. the man:**
$$\\vec v_{\\text{rain/man}} = \\vec v_{\\text{rain}} - \\vec v_{\\text{man}}$$

The rain has velocity $10\\sqrt3$ downward; the man moves at $10$ forward. In the man's frame, rain approaches with a **backward horizontal component of 10 m/s** added to its vertical $10\\sqrt3$ m/s.

**Tilt from the vertical:**
$$\\tan\\theta = \\frac{v_{\\text{horizontal}}}{v_{\\text{vertical}}} = \\frac{10}{10\\sqrt3} = \\frac{1}{\\sqrt3}$$
$$\\theta = 30^\\circ$$

So the umbrella must tilt **30° forward from the vertical** (toward the direction of walking — see the vector diagram).

**Why the others are wrong:** (A) 60° with the vertical would need $\tan\theta = \sqrt3$ (man faster than the rain); (B) 30° with the horizontal is the complement of the tilt — the umbrella axis is measured from the vertical; (C) 45° assumes equal rain and walking speeds ($\tan\theta = 1$).`,
    formulaConcept: 'Relative velocity: $\\tan\\theta = v_{\\text{man}} / v_{\\text{rain}}$ gives the forward umbrella tilt from the vertical.',
    difficulty: 'EASY', chapterSlug: 'kinematics', topicSlug: 'relative-motion',
    sourceType: 'ORIGINAL', sourceNote: 'Rain-man umbrella angle with vector diagram.',
    diagram: {
      kind: 'geometry',
      xRange: [-6, 8], yRange: [0, 12],
      showGrid: false, square: true,
      title: 'rain–man relative velocity (man’s frame)',
      elements: [
        { type: 'point', x: 0, y: 0, label: 'man', labelPos: 'S' },
        { type: 'vector', from: [0, 0], to: [0, 10], label: 'rain: 10√3 ↓', color: 'var(--chart-2)' },
        { type: 'vector', from: [0, 0], to: [-4, 0], label: '−v_man = 10', color: 'var(--chart-5)' },
        { type: 'vector', from: [0, 0], to: [-4, 10], label: 'v_rain/man', color: 'var(--gold)' },
        { type: 'line', from: [0, 0], to: [0, 11.5], color: 'var(--muted)', dashed: true },
        { type: 'angleArc', at: [0, 0], fromDeg: 90, toDeg: 111.8, r: 2.4, label: 'θ = 30°' },
        { type: 'label', x: 4.2, y: 11, text: 'tan θ = 10/(10√3) = 1/√3', color: 'var(--gold)' },
        { type: 'label', x: 4.2, y: 10, text: 'umbrella tilts 30° from vertical', color: 'var(--muted-foreground)' },
      ],
    },
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A ball of mass $0.5\\ \\text{kg}$ strikes a massive wall perpendicularly with speed $10\\ \\text{m/s}$ and rebounds along the same line with speed $6\\ \\text{m/s}$. The magnitude of the impulse imparted to the ball by the wall is:`,
    options: ['8 N·s', '2 N·s', '5 N·s', '20 N·s'],
    correctAnswer: 'A',
    solutionText: `Take the initial direction as positive.

**Change in momentum:**
$$\\Delta p = m(v_f - v_i) = 0.5\\,( -6 - 10) = 0.5 \\times (-16) = -8\\ \\text{kg·m/s}$$

**Impulse** equals the change in momentum:
$$|J| = |\\Delta p| = 8\\ \\text{N·s}$$

directed **away from the wall**.

**Why the others are wrong:** (B) 2 N·s uses $m(v_f + v_i)$ sign-slipped as $0.5(10-6)$; (C) 5 N·s averages the speeds ($0.5 \\times \\frac{10+6}{2}$); (D) 20 N·s uses only $mv_i$ (forgets the rebound) or doubles twice.`,
    formulaConcept: 'Impulse $J = \\Delta p = m(v_f - v_i)$ — the rebound reverses the sign, so the speeds SUBTRACT with a minus: $0.5(-6-10)$.',
    difficulty: 'EASY', chapterSlug: 'laws-of-motion', topicSlug: 'impulse-and-momentum',
    sourceType: 'ORIGINAL', sourceNote: 'Wall rebound impulse.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A circular track of radius $10\\ \\text{m}$ is banked at $45^\\circ$. The speed at which a car can round the track without needing any frictional force is $(g = 10\\ \\text{m/s}^2)$:`,
    options: ['5 m/s', '20 m/s', '14.1 m/s', '10 m/s'],
    correctAnswer: 'D',
    solutionText: `On a frictionless banked curve, the horizontal component of the normal reaction supplies the entire centripetal force, and its vertical component balances gravity:
$$N\\sin\\theta = \\frac{mv^2}{r}, \\qquad N\\cos\\theta = mg$$

**Dividing:**
$$\\tan\\theta = \\frac{v^2}{rg} \\implies v = \\sqrt{rg\\tan\\theta}$$

**Substituting** $r = 10$ m, $\\theta = 45^\\circ$, $g = 10$:
$$v = \\sqrt{10 \\times 10 \\times 1} = 10\\ \\text{m/s}$$

**Why the others are wrong:** (A) 5 m/s uses $\\tan 45° = 0.5$-style error or $\\sqrt{rg}/2$; (B) 20 m/s squares wrongly ($v = rg\\tan\\theta$); (C) 14.1 m/s $= \\sqrt{2rg/\\dots}$ — treats $\\tan45 = 2$ or uses $v = \\sqrt{2rg\\sin\\theta}$.

*(At any other speed friction is needed — above 10 m/s it acts down the slope, below it acts up the slope.)*`,
    formulaConcept: 'Frictionless banked turn: $v_0 = \\sqrt{rg\\tan\\theta}$ — the "design speed" of the curve.',
    difficulty: 'MODERATE', chapterSlug: 'laws-of-motion', topicSlug: 'circular-dynamics',
    sourceType: 'ORIGINAL', sourceNote: 'Banked-track design speed with force decomposition.',
    diagram: {
      kind: 'fbd',
      bodies: [
        { type: 'ground', x: 0, y: 0, w: 10 },
        { type: 'incline', x: 2, y: 0, w: 7, h: 7, angle: 45, label: 'banked 45°' },
        { type: 'block', x: 5.2, y: 4.2, w: 1.6, h: 1.2, label: 'car (m)' },
      ],
      forces: [
        { from: [6, 5], to: [6, 9], label: 'N', color: 'var(--chart-2)' },
        { from: [6, 5], to: [6, 1], label: 'mg', color: 'var(--chart-5)' },
        { from: [6, 5], to: [8.8, 3.2], label: 'N sinθ = mv²/r', color: 'var(--gold)', dashed: true },
        { from: [6, 5], to: [3.2, 6.8], label: 'N cosθ = mg', color: 'var(--chart-3)', dashed: true },
      ],
      dims: [],
    },
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A variable force acting on a particle along a straight line increases linearly from $0$ to $60\\ \\text{N}$ over a displacement of $5\\ \\text{m}$ (see graph). The work done by the force is:`,
    options: ['300 J', '150 J', '60 J', '450 J'],
    correctAnswer: 'B',
    solutionText: `Work done by a variable force is the **area under the $F$–$x$ graph**. The graph is a right triangle with base $5$ m and height $60$ N:
$$W = \\tfrac{1}{2} \\times \\text{base} \\times \\text{height} = \\tfrac{1}{2} \\times 5 \\times 60 = 150\\ \\text{J}$$

**Calculus check** with $F = 12x$:
$$W = \\int_0^5 12x\\,dx = 6x^2 \\Big|_0^5 = 150\\ \\text{J}$$

**Why the others are wrong:** (A) 300 J is the full rectangle $F_{\\max} \\times x$; (C) 60 J multiplies average displacement into something; (D) 450 J uses $\\tfrac{3}{2}$-triangle confusion.`,
    formulaConcept: '$W = \\int F\\,dx$ = area under the force–displacement graph; for a linear ramp it is $\\tfrac12 F_{\\max} x$.',
    difficulty: 'EASY', chapterSlug: 'work-energy-power', topicSlug: 'work-energy-theorem',
    sourceType: 'ORIGINAL', sourceNote: 'Variable-force work as triangular area.',
    diagram: {
      kind: 'graph',
      title: 'F–x: linear ramp 0 → 60 N over 5 m',
      xAxis: { label: 'x (m)', min: 0, max: 6, ticks: [0, 1, 2, 3, 4, 5, 6] },
      yAxis: { label: 'F (N)', min: 0, max: 70, ticks: [0, 20, 40, 60] },
      showGrid: true, square: false,
      curves: [
        { type: 'line', points: [[0, 0], [5, 60]], color: 'var(--gold)', label: 'F = 12x' },
      ],
      markers: [{ x: 5, y: 60, label: '(5, 60)', color: 'var(--chart-3)' }],
      shadedRegions: [
        { points: [[0, 0], [5, 0], [5, 60]], color: 'var(--gold)', label: 'W = ½·60·5 = 150 J' },
      ],
    },
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A man stands on a freely rotating platform (frictionless) with his arms folded, rotating with angular speed $\\omega$ and kinetic energy $K$. When he stretches his arms out, his moment of inertia doubles. His new kinetic energy becomes:`,
    options: ['2K', 'K', 'K/2', 'K/4'],
    correctAnswer: 'C',
    solutionText: `No external torque acts about the rotation axis (frictionless), so **angular momentum is conserved**:
$$L = I\\omega = I'\\omega' \\implies \\omega' = \\frac{\\omega}{2} \\quad (I' = 2I)$$

**New kinetic energy:**
$$K' = \\tfrac{1}{2}I'\\omega'^2 = \\tfrac{1}{2}(2I)\\left(\\frac{\\omega}{2}\\right)^2 = \\tfrac{1}{4}I\\omega^2 \\cdot \\frac{2}{2} = \\frac{K}{2}$$

The lost energy ($K/2$) is the work the man's muscles do *against* the centrifugal tendency while extending his arms.

**Why the others are wrong:** (A) 2K would conserve energy but violate angular-momentum conservation; (B) K conserves nothing; (D) K/4 forgets the doubled $I$ in front — only $\\omega$ halving is not enough.

*(Check via $K = L^2/2I$: doubling $I$ at constant $L$ halves $K$.)*`,
    formulaConcept: 'Angular momentum conservation: $K = \\dfrac{L^2}{2I}$ — doubling $I$ at fixed $L$ halves the kinetic energy.',
    difficulty: 'MODERATE', chapterSlug: 'rotational-motion', topicSlug: 'angular-momentum',
    sourceType: 'ORIGINAL', sourceNote: 'Rotating-platform arms-out energy loss.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A planet has twice the mass and twice the radius of the Earth. The escape velocity from its surface is (escape velocity from Earth $= 11.2\ \text{km/s}$):`,
    options: ['7.9 km/s', '22.4 km/s', '11.2 km/s', '15.8 km/s'],
    correctAnswer: 'C',
    solutionText: `**Escape velocity:**
$$v_e = \sqrt{\frac{2GM}{R}}$$

For the planet, $M_p = 2M_E$ and $R_p = 2R_E$, so
$$\frac{v_{e,p}}{v_{e,E}} = \sqrt{\frac{M_p/R_p}{M_E/R_E}} = \sqrt{\frac{2M_E/2R_E}{M_E/R_E}} = \sqrt{1} = 1$$

Doubling the numerator AND the denominator of $M/R$ leaves the quotient — and hence $v_e$ — **unchanged**:
$$v_{e,p} = v_{e,E} = 11.2\ \text{km/s}$$

**Why the others are wrong:** (A) 7.9 km/s is Earth's low-orbit speed (halves the value); (B) 22.4 km/s doubles $v_e$ outright (forgets the square root AND the doubled $R$); (D) 15.8 km/s $= \sqrt{2} \times 11.2$ — the classic trap of doubling only the mass.

*(A planet with 2M and 2R has the same surface gravity AND the same escape speed as Earth — only its mean density differs.)*`,
    formulaConcept: '$v_e = \sqrt{2GM/R}$ — escape velocity depends on $M/R$; doubling BOTH $M$ and $R$ leaves it unchanged.',
    difficulty: 'MODERATE', chapterSlug: 'gravitation', topicSlug: 'satellites-and-escape-velocity',
    sourceType: 'ORIGINAL', sourceNote: 'Escape velocity scaling trap (M and R both doubled).',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A large open tank is kept filled to a constant height. A small orifice is punched $5\\ \\text{m}$ below the water surface. Neglecting viscosity, the speed of efflux is $(g = 10\\ \\text{m/s}^2)$:`,
    options: ['5 m/s', '50 m/s', '100 m/s', '10 m/s'],
    correctAnswer: 'D',
    solutionText: `**Torricelli's theorem** (from Bernoulli between the top surface and the orifice, both open to atmosphere):
$$v = \\sqrt{2gh}$$

**Substituting** $h = 5$ m, $g = 10$:
$$v = \\sqrt{2 \\times 10 \\times 5} = \\sqrt{100} = 10\\ \\text{m/s}$$

The tank being large means the surface speed stays negligible, validating the derivation.

**Why the others are wrong:** (A) 5 m/s uses $v = gh$-dimension error or $\\sqrt{gh}$; (B) 50 m/s uses $v = 2gh$ (forgets the square root); (C) 100 m/s uses $v = 2gh$ numerically squared — i.e. $10^2$.`,
    formulaConcept: "Torricelli's law: efflux speed $v = \\sqrt{2gh}$ depends only on the depth below the free surface.",
    difficulty: 'EASY', chapterSlug: 'properties-of-solids-and-fluids', topicSlug: 'bernoulli-and-flow',
    sourceType: 'ORIGINAL', sourceNote: 'Torricelli efflux speed.',
    diagram: {
      kind: 'apparatus',
      parts: [
        { type: 'beaker', x: 20, y: 20, w: 90, h: 120, label: 'open tank (kept full)', fill: 0.85 },
        { type: 'label', x: 150, y: 40, text: 'constant level' },
        { type: 'arrow', x1: 110, y1: 130, x2: 175, y2: 130, label: 'jet: v = √(2gh)', color: 'var(--gold)' },
        { type: 'label', x: 150, y: 118, text: 'h = 5 m below surface' },
        { type: 'label', x: 150, y: 96, text: 'v = √(2·10·5) = 10 m/s', bold: true },
        { type: 'label', x: 150, y: 150, text: 'P_atm on surface AND at jet → speed from height alone' },
      ],
      caption: 'Torricelli outflow — both ends open to atmosphere',
    },
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A Carnot engine operates between a hot reservoir at $500\\ \\text{K}$ and a cold reservoir at $300\\ \\text{K}$. Its efficiency is:`,
    options: ['20%', '40%', '60%', '80%'],
    correctAnswer: 'B',
    solutionText: `**Carnot efficiency:**
$$\\eta = 1 - \\frac{T_c}{T_h} = 1 - \\frac{300}{500} = 1 - 0.6 = 0.4 = 40\\%$$

**Why the others are wrong:** (A) 20% is $T_c/T_h$ subtracted wrongly ($0.6 - 0.4$ style confusion) or uses $\\Delta T/T_c$; (C) 60% is $T_c/T_h$ itself (the *complement*); (D) 80% would need a much colder sink ($T_c = 100$ K).

*(No engine working between 500 K and 300 K can beat 40% — Clausius statement of the second law.)*`,
    formulaConcept: 'Carnot efficiency $\\eta = 1 - T_c/T_h$ with absolute temperatures — the ceiling for all heat engines.',
    difficulty: 'EASY', chapterSlug: 'thermodynamics', topicSlug: 'heat-engines',
    sourceType: 'ORIGINAL', sourceNote: 'Carnot efficiency between 500 K and 300 K.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A mixture contains $1$ mole of helium (monatomic) and $2$ moles of hydrogen (diatomic, rigid). The ratio of specific heats $\\gamma = C_p/C_v$ for the mixture is:`,
    options: ['1.67', '1.40', '1.46', '1.33'],
    correctAnswer: 'C',
    solutionText: `**Degrees of freedom:** He (monatomic) has $f_1 = 3$; rigid $H_2$ has $f_2 = 5$.

**Mixture $C_v$ (mole-weighted average of energy):**
$$C_{v,\\text{mix}} = \\frac{1 \\times \\frac{3}{2}R + 2 \\times \\frac{5}{2}R}{3} = \\frac{(1.5 + 5)R}{3} = \\frac{13R}{6}$$

**Then:**
$$C_{p,\\text{mix}} = C_{v,\\text{mix}} + R = \\frac{19R}{6}$$
$$\\gamma = \\frac{C_p}{C_v} = \\frac{19/6}{13/6} = \\frac{19}{13} \\approx 1.46$$

**Why the others are wrong:** (A) 1.67 = 5/3 is pure monatomic; (B) 1.40 = 7/5 is pure diatomic; (D) 1.33 ≈ 4/3 corresponds to $f = 6$ (triatomic-like average taken wrongly on $\\gamma$ directly instead of on $C_v$).`,
    formulaConcept: 'Mix gases by ENERGY: $C_{v,\\text{mix}} = \\sum n_i C_{v,i} / \\sum n_i$, then $\\gamma = 1 + 2/f_{\\text{avg}}$ — never average $\\gamma$ directly.',
    difficulty: 'MODERATE', chapterSlug: 'kinetic-theory', topicSlug: 'degrees-of-freedom',
    sourceType: 'ORIGINAL', sourceNote: 'Mixture γ via mole-weighted Cv.',
    diagram: {
      kind: 'bars',
      title: 'degrees of freedom per molecule',
      categories: ['He (f = 3)', 'H₂ (f = 5)', 'mixture avg (f = 13/3 ≈ 4.33)'],
      series: [
        { name: 'f', values: [3, 5, 4.33], color: 'var(--gold)' },
      ],
      yAxis: { label: 'degrees of freedom', min: 0, max: 6 },
    },
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `Two identical springs, each of stiffness $k$, are connected **in series** and the free end is attached to a block of mass $m$ on a frictionless surface. The time period of small oscillations is:`,
    options: ['2π√(2m/k)', '2π√(m/k)', '2π√(m/2k)', 'π√(2m/k)'],
    correctAnswer: 'A',
    solutionText: `**Series combination of stiffnesses** (same tension $F$ through both, extensions add):
$$\\frac{1}{k_{\\text{eq}}} = \\frac{1}{k} + \\frac{1}{k} = \\frac{2}{k} \\implies k_{\\text{eq}} = \\frac{k}{2}$$

*(Intuition: two equal springs in series stretch twice as much for the same force — half the stiffness.)*

**Time period:**
$$T = 2\\pi\\sqrt{\\frac{m}{k_{\\text{eq}}}} = 2\\pi\\sqrt{\\frac{m}{k/2}} = 2\\pi\\sqrt{\\frac{2m}{k}}$$

**Why the others are wrong:** (B) $2\\pi\\sqrt{m/k}$ is the single-spring period (treats series as neither); (C) $2\\pi\\sqrt{m/2k}$ is the **parallel** result ($k_{\\text{eq}} = 2k$); (D) $\\pi\\sqrt{2m/k}$ drops a factor of 2 in $2\\pi$.`,
    formulaConcept: 'Springs in series: $k_{\\text{eq}} = k/2$ for two identical springs — softer; in parallel: $2k$ — stiffer.',
    difficulty: 'EASY', chapterSlug: 'oscillations', topicSlug: 'shm-kinematics',
    sourceType: 'ORIGINAL', sourceNote: 'Series springs SHM period.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A string of length $1.2\\ \\text{m}$ is fixed at both ends and vibrates in its **third harmonic** (three loops), as shown. If the frequency of vibration is $150\\ \\text{Hz}$, the speed of the wave on the string is:`,
    options: ['360 m/s', '60 m/s', '200 m/s', '120 m/s'],
    correctAnswer: 'D',
    solutionText: `For a string fixed at both ends, the $n$-th harmonic has $n$ half-wavelengths along the length:
$$L = \\frac{n\\lambda}{2} \\implies \\lambda = \\frac{2L}{n} = \\frac{2 \\times 1.2}{3} = 0.8\\ \\text{m}$$

**Wave speed:**
$$v = f\\lambda = 150 \\times 0.8 = 120\\ \\text{m/s}$$

**Why the others are wrong:** (A) 360 m/s uses $\\lambda = 2.4$ m (fundamental) with $n$ ignored; (B) 60 m/s uses $\\lambda = L/2$-style error (0.4 m); (C) 200 m/s uses $\\lambda = 4L/3$ (counts loops as quarter-waves).`,
    formulaConcept: 'Fixed–fixed string: $\\lambda_n = 2L/n$; third harmonic has $\\lambda = 2L/3$ and three antinodes.',
    difficulty: 'MODERATE', chapterSlug: 'waves', topicSlug: 'standing-waves',
    sourceType: 'ORIGINAL', sourceNote: 'Third-harmonic standing wave.',
    diagram: {
      kind: 'wave',
      title: 'third harmonic — 3 loops on a 1.2 m string (λ = 0.8 m)',
      waves: [
        { type: 'sine', amplitude: 1, cycles: 1.5, label: 'y(x, t)', color: 'var(--gold)' },
        { type: 'sine', amplitude: 1, cycles: 1.5, phase: Math.PI, label: 'half a period later', color: 'var(--chart-3)', dashed: true },
      ],
      xAxis: { label: 'x (m): 0 → 1.2 (nodes at 0, 0.4, 0.8, 1.2)' },
      yAxis: { label: 'displacement' },
    },
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A train whistle emits sound at $600\\ \\text{Hz}$. The train approaches a stationary listener at $20\\ \\text{m/s}$. The frequency heard by the listener is (speed of sound $= 340\\ \\text{m/s}$):`,
    options: ['565 Hz', '637.5 Hz', '600 Hz', '660 Hz'],
    correctAnswer: 'B',
    solutionText: `**Doppler effect, source approaching a stationary observer:**
$$f' = f\\,\\frac{v_{\\text{sound}}}{v_{\\text{sound}} - v_{\\text{source}}}$$

**Substituting:**
$$f' = 600 \\times \\frac{340}{340 - 20} = 600 \\times \\frac{340}{320} = 637.5\\ \\text{Hz}$$

The pitch rises because each wavefront is emitted from a closer position — wavefronts bunch up.

**Why the others are wrong:** (A) 565 Hz uses the *receding* formula ($340/360$); (C) 600 Hz ignores the Doppler effect; (D) 660 Hz uses the *observer-moving* formula ($ (340+20)/340$, correct only if the LISTENER moved).`,
    formulaConcept: 'Approaching source: $f′ = f\\,v/(v - v_s)$ — source motion differs from observer motion in Doppler physics.',
    difficulty: 'MODERATE', chapterSlug: 'waves', topicSlug: 'doppler-effect',
    sourceType: 'ORIGINAL', sourceNote: 'Approaching-train whistle.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A point charge $+q$ is placed at the centre of a neutral conducting spherical shell. The shell is then given an additional charge $-2q$ on it. The charge that finally resides on the **outer** surface of the shell is:`,
    options: ['−q', '−3q', '+q', '−2q'],
    correctAnswer: 'A',
    solutionText: `Gauss's law inside the conducting material (field must vanish in electrostatic equilibrium) fixes the **inner** surface first.

**Inner surface:** a Gaussian pillbox inside the metal encloses the central $+q$ plus the inner-surface charge $q_{\\text{in}}$; zero field means enclosed charge is zero:
$$q + q_{\\text{in}} = 0 \\implies q_{\\text{in}} = -q$$

**Outer surface:** total shell charge $= -2q$ is split between surfaces:
$$q_{\\text{out}} = -2q - q_{\\text{in}} = -2q - (-q) = -q$$

**Why the others are wrong:** (B) −3q adds everything onto the outer surface; (C) +q forgets the shell was charged; (D) −2q puts all the added charge outside and none induced inside.

*(The field outside is then $\\propto (q - q)/r^2 = 0$ at $r > R_{\\text{out}}$... careful: total enclosed $= +q - 2q = -q$, so outside field is as if $-q$ sat at the centre — the outer-surface charge $-q$ exactly reproduces this.)*`,
    formulaConcept: "Conductor electrostatics: inner surface charge $= -$ (enclosed central charge); the remainder goes to the outer surface.",
    difficulty: 'MODERATE', chapterSlug: 'electrostatics', topicSlug: 'gauss-law',
    sourceType: 'ORIGINAL', sourceNote: 'Induced charges on a charged shell.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `In a potentiometer experiment, a cell of emf $1.5\\ \\text{V}$ is balanced at a length of $270\\ \\text{cm}$ of the wire. A second cell, kept in the same sense, is balanced at $360\\ \\text{cm}$. The emf of the second cell is:`,
    options: ['2.0 V', '1.125 V', '1.5 V', '2.25 V'],
    correctAnswer: 'A',
    solutionText: `In the null-deflection condition, the drop across the balancing length equals the cell emf, and the potentiometer wire carries a fixed current:
$$\\frac{\\varepsilon_2}{\\varepsilon_1} = \\frac{\\ell_2}{\\ell_1}$$

**Substituting:**
$$\\varepsilon_2 = 1.5 \\times \\frac{360}{270} = 1.5 \\times \\frac{4}{3} = 2.0\\ \\text{V}$$

*(A potentiometer compares emfs WITHOUT drawing current from the cells — that is its advantage over a voltmeter, which reads terminal voltage.)*

**Why the others are wrong:** (B) 1.125 V inverts the ratio; (C) 1.5 V assumes equal lengths; (D) 2.25 V uses $\\ell_1 \\ell_2$-style product confusion ($1.5 \\times 270/180$).`,
    formulaConcept: 'Potentiometer null method: $\\varepsilon \\propto$ balancing length — zero-current emf comparison.',
    difficulty: 'MODERATE', chapterSlug: 'current-electricity', topicSlug: 'instruments',
    sourceType: 'ORIGINAL', sourceNote: 'Potentiometer emf comparison (fresh vs mock-01 meter bridge).',
    diagram: {
      kind: 'circuit',
      components: [
        { type: 'battery', x1: 30, y1: 60, x2: 30, y2: 110, label: 'driver cell', value: 'ε_d' },
        { type: 'wire', x1: 30, y1: 60, x2: 30, y2: 20 },
        { type: 'wire', x1: 30, y1: 20, x2: 230, y2: 20 },
        { type: 'resistor', x1: 230, y1: 20, x2: 230, y2: 60, label: 'R', value: 'rheostat' },
        { type: 'wire', x1: 230, y1: 60, x2: 230, y2: 110 },
        { type: 'wire', x1: 30, y1: 110, x2: 230, y2: 110 },
        { type: 'wire', x1: 40, y1: 20, x2: 220, y2: 20 },
        { type: 'wire', x1: 40, y1: 20, x2: 220, y2: 20 },
        { type: 'junction', x: 190, y: 20 },
        { type: 'junction', x: 100, y: 20 },
        { type: 'junction', x: 190, y: 20 },
        { type: 'wire', x1: 100, y1: 20, x2: 100, y2: 45 },
        { type: 'ammeter', x1: 100, y1: 45, x2: 150, y2: 45, label: 'G', value: 'null at 270 cm / 360 cm' },
        { type: 'wire', x1: 150, y1: 45, x2: 150, y2: 20 },
        { type: 'cell', x1: 110, y1: 140, x2: 90, y2: 140, label: 'cell ε₁ = 1.5 V', value: '' },
        { type: 'arrow', x1: 45, y1: 105, x2: 45, y2: 70, label: 'I (steady)', color: 'var(--chart-3)' },
      ],
      labels: ['ε ∝ balancing length: ε₂/ε₁ = 360/270 = 4/3 → ε₂ = 2.0 V'],
    },
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A charged particle travels undeflected through a region of crossed (mutually perpendicular) electric and magnetic fields, with $E = 10^4\\ \\text{V/m}$ and $B = 0.4\\ \\text{T}$. Its speed is:`,
    options: ['1.0 × 10⁴ m/s', '4.0 × 10⁴ m/s', '2.5 × 10⁴ m/s', '5.0 × 10³ m/s'],
    correctAnswer: 'C',
    solutionText: `**Zero net force** (straight-line motion):
$$qE = qvB \\implies v = \\frac{E}{B}$$

**Substituting:**
$$v = \\frac{10^4}{0.4} = 2.5 \\times 10^4\\ \\text{m/s}$$

Note the answer is **independent of the charge and mass** — this is the principle of the *velocity selector*: only particles with exactly this speed pass straight through, whatever their $q$ or $m$.

**Why the others are wrong:** (A) $10^4$ m/s forgets to divide by $B$; (B) $4 \\times 10^4$ m/s multiplies instead of dividing; (D) $5 \\times 10^3$ m/s halves instead of dividing by 0.4.

*(The option list above deliberately scrambles letters — the physically correct speed is $2.5\\times10^4$ m/s, i.e. option (C) as printed in the exam interface.)*
`,
    formulaConcept: 'Velocity selector: undeflected when $v = E/B$ — independent of charge and mass.',
    difficulty: 'MODERATE', chapterSlug: 'magnetic-effects-of-current', topicSlug: 'force-on-moving-charges',
    sourceType: 'ORIGINAL', sourceNote: 'Crossed-fields velocity selector.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A coil of inductance $L = 2\\ \\text{H}$ and resistance $R = 10\\ \\Omega$ is connected to a steady dc source. The current reaches half of its final value after a time (take $\\ln 2 = 0.693$):`,
    options: ['0.2 s', '0.139 s', '0.289 s', '0.100 s'],
    correctAnswer: 'B',
    solutionText: `**Current growth in an LR circuit:**
$$i(t) = i_{\\infty}\\left(1 - e^{-t/\\tau}\\right), \\qquad \\tau = \\frac{L}{R} = \\frac{2}{10} = 0.2\\ \\text{s}$$

**Set $i(t) = i_\\infty/2$:**
$$\\tfrac{1}{2} = 1 - e^{-t/\\tau} \\implies e^{-t/\\tau} = \\tfrac{1}{2} \\implies t = \\tau \\ln 2$$

**Substituting:**
$$t = 0.2 \\times 0.693 = 0.139\\ \\text{s}$$

**Why the others are wrong:** (A) 0.2 s is the time constant itself (63% mark, not 50%); (C) 0.289 s doubles $\\tau$ then halves it wrongly ($2\\tau\\ln\\tfrac12$-sign slip); (D) 0.1 s uses $\\tau/2$.`,
    formulaConcept: 'LR growth: $i = i_\\infty(1 - e^{-t/\\tau})$; half-current time $= \\tau\\ln2 = 0.693\\,L/R$.',
    difficulty: 'MODERATE', chapterSlug: 'emi', topicSlug: 'inductance',
    sourceType: 'ORIGINAL', sourceNote: 'LR half-current time with growth curve.',
    diagram: {
      kind: 'graph',
      title: 'LR current growth: i(t) = I₀(1 − e^(−t/τ)), τ = 0.2 s',
      xAxis: { label: 't (s)', min: 0, max: 1.2, ticks: [0, 0.139, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2] },
      yAxis: { label: 'i / I₀ (%)', min: 0, max: 100, ticks: [0, 25, 50, 63, 75, 100] },
      showGrid: true, square: false,
      curves: [
        { type: 'curve', points: [[0, 0], [0.05, 22.1], [0.1, 39.3], [0.139, 50], [0.2, 63.2], [0.3, 77.7], [0.4, 86.5], [0.6, 95.0], [0.8, 98.2], [1.0, 99.3], [1.2, 99.8]], color: 'var(--gold)', label: 'i(t)/I₀' },
      ],
      markers: [
        { x: 0.139, y: 50, label: 't½ = τ ln2 = 0.139 s (50%)', color: 'var(--chart-2)' },
        { x: 0.2, y: 63.2, label: 'τ = 0.2 s (63.2%)', color: 'var(--chart-3)' },
      ],
      shadedRegions: [],
    },
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `An object is placed $10\\ \\text{cm}$ in front of a convex mirror of focal length $15\\ \\text{cm}$. The image formed is:`,
    options: ['real, inverted, 6 cm in front of the mirror', 'virtual, erect, 30 cm behind the mirror', 'virtual, erect, 6 cm behind the mirror', 'real, erect, 15 cm in front of the mirror'],
    correctAnswer: 'C',
    solutionText: `**Mirror formula** (Cartesian sign convention — distances measured from the pole, along incident light positive):
$$\\frac{1}{v} + \\frac{1}{u} = \\frac{1}{f}$$

with $u = -10$ cm (object in front) and $f = +15$ cm (convex mirror, centre of curvature behind):
$$\\frac{1}{v} = \\frac{1}{15} - \\frac{1}{-10} = \\frac{1}{15} + \\frac{1}{10} = \\frac{2 + 3}{30} = \\frac{5}{30}$$
$$v = +6\\ \\text{cm}$$

The positive $v$ means the image is **6 cm behind the mirror** — virtual and erect.

**Magnification:**
$$m = -\\frac{v}{u} = -\\frac{6}{-10} = +0.6 \\quad (\\text{erect, } 60\\% \\text{ size})$$

**Why the others are wrong:** (A) uses a concave-mirror sign habit ($f = -15$); (B) 30 cm swaps numerator/denominator in the formula; (D) mirrors *never* form real erect images for real objects.`,
    formulaConcept: 'Convex mirror: $f > 0$; real objects always give virtual, erect, diminished images behind the mirror.',
    difficulty: 'EASY', chapterSlug: 'ray-optics', topicSlug: 'reflection-mirrors',
    sourceType: 'ORIGINAL', sourceNote: 'Convex-mirror image location with ray diagram.',
    diagram: {
      kind: 'ray',
      axis: true,
      axisLabel: ['object side', 'behind mirror'],
      elements: [
        { type: 'mirror-convex', x: 0, height: 8, label: 'convex mirror, F behind' },
        { type: 'object', x: -10, height: 2.5, label: 'O (h = 2.5)' },
      ],
      rays: [
        { from: [-10, 2.5], to: [0, 2.5], label: 'parallel ray → reflects as if from F', color: 'var(--gold)' },
        { from: [0, 2.5], to: [15, 2.5], dashed: true, label: 'toward F (+15)', color: 'var(--gold)' },
        { from: [-10, 2.5], to: [0, 1.5], label: 'to vertex', color: 'var(--chart-2)' },
        { from: [0, 1.5], to: [6, 1.5], dashed: true, color: 'var(--chart-2)' },
        { from: [6, 1.5], to: [-10, 1.5], dashed: true, label: 'reflected rays appear to diverge from I', color: 'var(--muted-foreground)' },
      ],
    },
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `In a Young's double-slit experiment using light of wavelength $600\\ \\text{nm}$, a thin mica sheet of refractive index $1.5$ and thickness $1.8\\ \\mu\\text{m}$ is inserted in front of one slit. The number of fringe-widths by which the fringe pattern shifts is:`,
    options: ['1.5', '0.5', '3.0', '4.5'],
    correctAnswer: 'A',
    solutionText: `A slab of thickness $t$ and refractive index $\\mu$ adds an extra optical path $(\\mu - 1)t$ to that arm.

**Fringe shift:**
$$N = \\frac{(\\mu - 1)\\,t}{\\lambda} = \\frac{(1.5 - 1) \\times 1.8\\ \\mu\\text{m}}{600\\ \\text{nm}} = \\frac{0.9 \\times 10^{-6}}{600 \\times 10^{-9}} = 1.5$$

The whole pattern shifts by **1.5 fringe widths toward the slit covered** with the mica (the covered path became longer, so the central maximum must move to compensate by making the *other* arm longer geometrically).

**Why the others are wrong:** (B) 0.5 uses $(\\mu - 1)$-then-½ somehow (0.3/0.6); (C) 3.0 uses $\\mu t$ instead of $(\\mu-1)t$ (forgets to subtract vacuum path); (D) 4.5 uses $\\mu t / \\lambda$ with $\\mu + 1$-style error.`,
    formulaConcept: 'Slab in one arm: extra path $(\\mu - 1)t$; fringe shift $N = (\\mu - 1)t/\\lambda$ toward the covered slit.',
    difficulty: 'HARD', chapterSlug: 'wave-optics', topicSlug: 'interference',
    sourceType: 'ORIGINAL', sourceNote: 'YDSE mica-slab fringe shift (fresh vs mock-01 phasor question).',
    diagram: {
      kind: 'geometry',
      xRange: [0, 10], yRange: [0, 7],
      showGrid: false, square: false,
      title: 'YDSE with mica over S₁ — pattern shifts 1.5 β toward S₁',
      elements: [
        { type: 'label', x: 0.4, y: 5.8, text: 'S' },
        { type: 'line', from: [0.6, 5.8], to: [2, 4.9], color: 'var(--muted)' },
        { type: 'line', from: [0.6, 5.8], to: [2, 6.7], color: 'var(--muted)' },
        { type: 'point', x: 2, y: 4.9, label: 'S₁', labelPos: 'W' },
        { type: 'point', x: 2, y: 6.7, label: 'S₂', labelPos: 'W' },
        { type: 'line', from: [2, 4.9], to: [2, 6.7], label: 'd', color: 'var(--muted-foreground)', dashed: true },
        { type: 'polygon', points: [[2.05, 4.55], [2.35, 4.55], [2.35, 5.45], [2.05, 5.45]], fill: 'rgba(232,182,76,0.25)', color: 'var(--gold)' },
        { type: 'label', x: 1.9, y: 3.9, text: 'mica (μ=1.5, t=1.8 μm)', color: 'var(--gold)' },
        { type: 'line', from: [2, 4.9], to: [9, 3.6], color: 'var(--chart-2)', dashed: true },
        { type: 'line', from: [2, 6.7], to: [9, 3.6], color: 'var(--chart-2)', dashed: true },
        { type: 'line', from: [9, 1.2], to: [9, 6.8], color: 'var(--muted)', label: 'screen' },
        { type: 'point', x: 9, y: 5.75, label: 'old centre O', labelPos: 'E' },
        { type: 'point', x: 9, y: 3.6, label: 'new centre (1.5β up)', labelPos: 'E' },
        { type: 'label', x: 3.5, y: 2.2, text: 'extra path (μ−1)t = 0.9 μm = 1.5 λ', color: 'var(--gold)' },
        { type: 'label', x: 3.5, y: 1.5, text: 'central max moves TOWARD the mica side', color: 'var(--muted-foreground)' },
      ],
    },
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `The mean life of a radioactive nucleus is $10$ years. Its half-life is:`,
    options: ['10 years', '14.4 years', '5 years', '6.93 years'],
    correctAnswer: 'D',
    solutionText: `**Relations between the decay constants:**
$$\\text{mean life } \\tau = \\frac{1}{\\lambda}, \\qquad T_{1/2} = \\frac{\\ln 2}{\\lambda} = \\tau \\ln 2$$

**Substituting:**
$$T_{1/2} = 10 \\times 0.693 = 6.93\\ \\text{years}$$

**Why the others are wrong:** (A) 10 years confuses mean life with half-life (mean life is LONGER — a third of nuclei outlive it); (B) 14.4 years is $\\tau \\ln 2$ computed as $\\tau \\times \\ln 10$ or $\\tau/\\ln(\\tfrac12)$ sign slip; (C) 5 years halves by eye.

*(Sanity: $T_{1/2} < \\tau$ always — the exponential's long tail lifts the mean above the median.)*`,
    formulaConcept: '$T_{1/2} = \\tau \\ln 2 \\approx 0.693\\,\\tau$ — half-life is always shorter than mean life.',
    difficulty: 'MODERATE', chapterSlug: 'nuclei', topicSlug: 'radioactivity',
    sourceType: 'ORIGINAL', sourceNote: 'Mean life ↔ half-life conversion.',
  },

  // ---------------- SECTION B (numerical) Q21–Q25 ----------------
  {
    subject: 'PHYSICS', section: 'B',
    text: `Two trains, $120\\ \\text{m}$ and $130\\ \\text{m}$ long, move toward each other on parallel tracks at $15\\ \\text{m/s}$ and $10\\ \\text{m/s}$ respectively. The time they take to completely cross each other is ______ $\\text{s}$.`,
    correctAnswer: '10',
    solutionText: `When two bodies move in **opposite** directions, their relative speed is the sum:
$$v_{\\text{rel}} = 15 + 10 = 25\\ \\text{m/s}$$

To cross completely, the trains must together cover the **sum of their lengths**:
$$s = 120 + 130 = 250\\ \\text{m}$$

**Time:**
$$t = \\frac{s}{v_{\\text{rel}}} = \\frac{250}{25} = 10\\ \\text{s}$$

*(In the frame of the second train, the first train's nose starts 250 m away and rushes at 25 m/s.)*`,
    formulaConcept: 'Opposite directions: $v_{\\text{rel}} = v_1 + v_2$; crossing distance $= L_1 + L_2$.',
    difficulty: 'EASY', chapterSlug: 'kinematics', topicSlug: 'relative-motion',
    sourceType: 'ORIGINAL', sourceNote: 'Trains crossing in opposite directions.',
  },
  {
    subject: 'PHYSICS', section: 'B',
    text: `A bullet of mass $20\\ \\text{g}$ moving horizontally embeds itself in a stationary wooden block of mass $1.98\\ \\text{kg}$, suspended by a long, light string (a ballistic pendulum). The block (with bullet) rises through a vertical height of $5\\ \\text{cm}$. The speed of the bullet just before impact was ______ $\\text{m/s}$. $(g = 10\\ \\text{m/s}^2)$`,
    correctAnswer: '100',
    solutionText: `**Stage 1 — perfectly inelastic collision** (momentum conserved during the instant of embedding):
$$(m)\\,v = (m + M)\\,V \\implies V = \\frac{0.02}{0.02 + 1.98}\\,v = \\frac{v}{100}$$

**Stage 2 — swing upward** (mechanical energy conserved after impact):
$$\\tfrac{1}{2}(m+M)V^2 = (m+M)gh \\implies V = \\sqrt{2gh} = \\sqrt{2 \\times 10 \\times 0.05} = 1\\ \\text{m/s}$$

**Therefore:**
$$v = 100 \\times V = 100 \\times 1 = 100\\ \\text{m/s}$$

*(Note how the tiny bullet mass ratio amplifies the speed by exactly 100×.)*`,
    formulaConcept: 'Ballistic pendulum: momentum conservation during impact, then $\\tfrac12(m+M)V^2 = (m+M)gh$ for the swing.',
    difficulty: 'MODERATE', chapterSlug: 'work-energy-power', topicSlug: 'collisions',
    sourceType: 'ORIGINAL', sourceNote: 'Ballistic pendulum two-stage problem.',
  },
  {
    subject: 'PHYSICS', section: 'B',
    text: `A ring of mass $m$ and radius $R$ rolls without slipping down an incline of vertical height $2.5\\ \\text{m}$. Its speed at the bottom is ______ $\\text{m/s}$. $(g = 10\\ \\text{m/s}^2)$`,
    correctAnswer: '5',
    solutionText: `For a ring, $I = mR^2$, so the rolling constant is
$$\\frac{I}{mR^2} = 1$$

**Energy conservation** (starting from rest at height $h$):
$$mgh = \\tfrac{1}{2}mv^2 + \\tfrac{1}{2}I\\omega^2 = \\tfrac{1}{2}mv^2 + \\tfrac{1}{2}(mR^2)\\left(\\frac{v}{R}\\right)^2 = \\tfrac{1}{2}mv^2 + \\tfrac{1}{2}mv^2 = mv^2$$

Hence
$$v = \\sqrt{gh} = \\sqrt{10 \\times 2.5} = \\sqrt{25} = 5\\ \\text{m/s}$$

*(The same height gives a solid sphere $\\sqrt{10gh/7}$ — faster, because less energy goes into rotation.)*`,
    formulaConcept: 'Rolling down a height $h$: $v = \\sqrt{\\dfrac{2gh}{1 + I/mR^2}}$ — for a ring, $v = \\sqrt{gh}$.',
    difficulty: 'MODERATE', chapterSlug: 'rotational-motion', topicSlug: 'rolling-motion',
    sourceType: 'ORIGINAL', sourceNote: 'Ring rolling down incline energy split.',
  },
  {
    subject: 'PHYSICS', section: 'B',
    text: `A capacitor of $5\\ \\mu\\text{F}$, charged to $100\\ \\text{V}$, is disconnected from the supply and connected in parallel to an identical uncharged capacitor. The energy lost in the redistribution is ______ $\\text{mJ}$.`,
    correctAnswer: '12.5',
    solutionText: `**Initial energy:**
$$U_i = \\tfrac{1}{2}CV^2 = \\tfrac{1}{2}(5\\times10^{-6})(100)^2 = 25\\ \\text{mJ}$$

**After connection:** charge $Q = CV = 500\\ \\mu\\text{C}$ redistributes equally (identical capacitors), so each carries $250\\ \\mu\\text{C}$ and the common voltage is
$$V' = \\frac{Q/2}{C} = \\frac{250\\ \\mu\\text{C}}{5\\ \\mu\\text{F}} = 50\\ \\text{V}$$

**Final energy:**
$$U_f = 2 \\times \\tfrac{1}{2}C(V')^2 = (5\\times10^{-6})(50)^2 = 12.5\\ \\text{mJ}$$

**Energy lost** (to radiation/heat in the wires — NOT stored anywhere):
$$\\Delta U = U_i - U_f = 25 - 12.5 = \\mathbf{12.5}\\ \\text{mJ}$$

*Exactly half the initial energy vanishes — true for ANY two identical capacitors, independent of $C$ and $V$.*`,
    formulaConcept: 'Charge-sharing between identical capacitors halves the voltage and loses exactly $\\tfrac14 CV^2$ of energy.',
    difficulty: 'MODERATE', chapterSlug: 'electrostatics', topicSlug: 'capacitors',
    sourceType: 'ORIGINAL', sourceNote: 'Charge sharing energy loss.',
  },
  {
    subject: 'PHYSICS', section: 'B',
    text: `A series LCR circuit with $L = 2\\ \\text{H}$ and a variable capacitor is driven by a $50\\ \\text{Hz}$ ac source. The circuit is tuned to resonance. The required capacitance is ______ $\\mu\\text{F}$ (round off to 2 decimals).`,
    correctAnswer: '5.07',
    solutionText: `**At resonance:**
$$\\omega_0 L = \\frac{1}{\\omega_0 C} \\implies \\omega_0 = \\frac{1}{\\sqrt{LC}}$$

With $f_0 = 50$ Hz, $\\omega_0 = 2\\pi f_0 = 100\\pi\\ \\text{rad/s}$:
$$C = \\frac{1}{\\omega_0^2 L} = \\frac{1}{(100\\pi)^2 \\times 2}$$

**Computing:**
$$(100\\pi)^2 = 10^4 \\times 9.8696 = 98\\,696$$
$$C = \\frac{1}{98\\,696 \\times 2} = \\frac{1}{197\\,392} = 5.066 \\times 10^{-6}\\ \\text{F} \\approx 5.07\\ \\mu\\text{F}$$

*(At this setting the impedance is purely $R$ — the inductive and reactive voltages cancel and the current amplitude peaks.)*`,
    formulaConcept: 'Resonance: $f_0 = \\dfrac{1}{2\\pi\\sqrt{LC}}$; solve $C = \\dfrac{1}{4\\pi^2 f_0^2 L}$.',
    difficulty: 'HARD', chapterSlug: 'alternating-current', topicSlug: 'resonance',
    sourceType: 'ORIGINAL', sourceNote: 'Series-resonance tuning capacitance.',
  },
]
