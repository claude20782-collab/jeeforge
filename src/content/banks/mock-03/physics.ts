import type { SeedQuestion } from '@/content/types'

// ============================================================================
// MOCK 03 — PHYSICS (Q1–Q25: 20 MCQ Section A + 5 numerical Section B)
// Difficulty target: Hard JEE Main (mock 3 of 40, ramp phase). All calculations
// hand-verified; every question has a complete step-by-step solution.
// ============================================================================

export const PHYSICS_MOCK03: SeedQuestion[] = [
  // ---------------- SECTION A (MCQ) Q1–Q20 ----------------
  {
    subject: 'PHYSICS', section: 'A',
    text: `In an experiment to determine resistance, the potential difference across a resistor is measured as $(100 \\pm 2)\\ \\text{V}$ and the current through it as $(10 \\pm 0.2)\\ \\text{A}$. The percentage error in the computed resistance is:`,
    options: ['2%', '6%', '4%', '8%'],
    correctAnswer: 'C',
    solutionText: `Resistance: $R = V/I$. For a **quotient**, relative errors add:
$$\\frac{\\Delta R}{R} = \\frac{\\Delta V}{V} + \\frac{\\Delta I}{I}$$

**Substituting:**
$$\\frac{\\Delta R}{R} = \\frac{2}{100} + \\frac{0.2}{10} = 0.02 + 0.02 = 0.04 = 4\\%$$

(The nominal value $R = 10\\ \\Omega$ with $\\Delta R = 0.4\\ \\Omega$.)

**Why the others are wrong:** (A) 2% counts only one of the two terms; (B) 6% wrongly adds absolute errors relative to nothing ($2+0.2$ style); (D) 8% doubles the current error or subtracts instead of adding.`,
    formulaConcept: 'Error propagation for $R = V/I$: relative errors add — $\\Delta R/R = \\Delta V/V + \\Delta I/I$.',
    difficulty: 'MODERATE', chapterSlug: 'units-and-measurements', topicSlug: 'measurement-errors',
    sourceType: 'ORIGINAL', sourceNote: 'Quotient error-propagation standard.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `Two projectiles are launched from level ground with the same speed $20\\ \\text{m/s}$ at $30^\\circ$ and $60^\\circ$ to the horizontal. Both have the same range. The ratio of their maximum heights ($H_{30} : H_{60}$) is: $(g = 10\\ \\text{m/s}^2)$`,
    options: ['1 : 3', '3 : 1', '1 : 9', '1 : √3'],
    correctAnswer: 'A',
    solutionText: `**Complementary angles** ($30^\\circ + 60^\\circ = 90^\\circ$) give equal range:
$$R = \\frac{u^2 \\sin 2\\theta}{g}$$
and indeed $\\sin 60^\\circ = \\sin 120^\\circ$ — both ranges equal $\\dfrac{400 \\times 0.866}{10} = 34.6$ m.

**Maximum height:**
$$H = \\frac{u^2\\sin^2\\theta}{2g}$$

So the height ratio is purely set by the sine-squared ratio:
$$\\frac{H_{30}}{H_{60}} = \\frac{\\sin^2 30^\\circ}{\\sin^2 60^\\circ} = \\frac{(1/2)^2}{(\\sqrt3/2)^2} = \\frac{1/4}{3/4} = \\frac{1}{3}$$

(Numerically $H_{30} = 5$ m and $H_{60} = 15$ m — see the trajectory sketch.)

**Why the others are wrong:** (B) inverts the ratio (imagine the 60° shot goes lower!); (C) uses $\\tan$ instead of $\\sin$ ($\\tan^2 30^\\circ = 1/3 \\ne 1/9$ — actually $\\tan 60/\\tan 30 = 3$ squared = 9, a double error); (D) forgets the square.`,
    formulaConcept: 'Complementary angles share range; height ratio $= \\tan^2\\theta_{\\text{smaller}}$ — here $1/3$.',
    difficulty: 'HARD', chapterSlug: 'kinematics', topicSlug: 'projectile-motion',
    sourceType: 'ORIGINAL', sourceNote: 'Complementary-angle trajectories with to-scale sketch.',
    diagram: {
      kind: 'graph',
      title: 'complementary launches, u = 20 m/s (to scale)',
      xAxis: { label: 'x (m)', min: 0, max: 40, ticks: [0, 5, 10, 15, 20, 25, 30, 35, 40] },
      yAxis: { label: 'y (m)', min: 0, max: 17, ticks: [0, 5, 10, 15] },
      showGrid: true,
      square: false,
      curves: [
        {
          type: 'curve', color: 'var(--gold)', label: 'θ = 30°',
          points: [[0, 0], [2, 1.09], [4, 2.04], [6, 2.86], [8, 3.55], [10, 4.11], [12, 4.53], [14, 4.82], [16, 4.97], [17.32, 5], [18, 4.99], [20, 4.88], [22, 4.64], [24, 4.26], [26, 3.74], [28, 3.1], [30, 2.32], [32, 1.41], [34, 0.36], [34.64, 0]],
        },
        {
          type: 'curve', color: 'var(--chart-2)', label: 'θ = 60°',
          points: [[0, 0], [2, 3.26], [4, 6.13], [6, 8.59], [8, 10.66], [10, 12.32], [12, 13.59], [14, 14.45], [16, 14.91], [17.32, 15], [18, 14.98], [20, 14.64], [22, 13.91], [24, 12.77], [26, 11.23], [28, 9.3], [30, 6.96], [32, 4.23], [34, 1.09], [34.64, 0]],
        },
      ],
      markers: [
        { x: 17.32, y: 5, label: 'H₃₀ = 5 m', color: 'var(--gold)' },
        { x: 17.32, y: 15, label: 'H₆₀ = 15 m', color: 'var(--chart-2)' },
        { x: 34.64, y: 0, label: 'common R ≈ 34.6 m', color: 'var(--chart-3)' },
      ],
    },
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A conical pendulum has a string of length $1\\ \\text{m}$ making $60^\\circ$ with the vertical. The time period of the bob's revolution is: $(g = 10\\ \\text{m/s}^2)$`,
    options: ['2.0 s', '1.4 s', '1.0 s', '2.8 s'],
    correctAnswer: 'B',
    solutionText: `Resolve the tension: the vertical component balances weight, the horizontal component supplies centripetal force.

The **effective pendulum length** is the vertical depth $l\\cos\\theta$ (the bob moves in a circle whose centre lies on the vertical axis, and the restoring geometry is that of a simple pendulum of length $l \\cos\\theta$):
$$T = 2\\pi\\sqrt{\\frac{l\\cos\\theta}{g}}$$

**Substituting** $l = 1$ m, $\\theta = 60^\\circ$ ($\\cos 60^\\circ = 0.5$):
$$T = 2\\pi\\sqrt{\\frac{0.5}{10}} = 2\\pi\\sqrt{0.05} = 2\\pi \\times 0.2236 \\approx 1.4\\ \\text{s}$$

(For reference: $T\\cos 60^\\circ = mg$ and $T\\sin 60^\\circ = m\\omega^2(l\\sin 60^\\circ)$ lead to the same $\\omega = \\sqrt{g/(l\\cos\\theta)}$.)

**Why the others are wrong:** (A) 2.0 s uses $l\\cos\\theta = 1$ (ignores the $60^\\circ$); (C) 1.0 s uses $\\sin 60^\\circ$ instead of cos; (D) 2.8 s uses the full length doubled.`,
    formulaConcept: 'Conical pendulum: $T = 2\\pi\\sqrt{l\\cos\\theta/g}$ — only the vertical projection of the string acts like a pendulum arm.',
    difficulty: 'HARD', chapterSlug: 'laws-of-motion', topicSlug: 'circular-dynamics',
    sourceType: 'ORIGINAL', sourceNote: 'Conical pendulum period from geometry.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A $2\\ \\text{kg}$ block is released from rest from a height of $1.0\\ \\text{m}$ above the top of a vertical spring of stiffness $2000\\ \\text{N/m}$. The maximum compression of the spring is: $(g = 10\\ \\text{m/s}^2)$`,
    options: ['0.30 m', '0.15 m', '0.10 m', '0.20 m'],
    correctAnswer: 'B',
    solutionText: `At maximum compression the block is momentarily at rest. **Energy conservation** between release point and lowest point (gravitational PE lost = spring PE gained). The block falls a total distance $(h + x)$ where $h = 1.0$ m:
$$mg(h + x) = \\tfrac12 kx^2$$

**Substituting** $m = 2$, $g = 10$, $k = 2000$:
$$20(1 + x) = 1000x^2 \\implies 1000x^2 - 20x - 20 = 0$$

Divide by 1000 and solve the quadratic:
$$x = \\frac{0.02 + \\sqrt{0.0004 + 0.08}}{2} = \\frac{0.02 + 0.2836}{2} \\approx 0.15\\ \\text{m}$$

**Why the others are wrong:** (A) 0.30 m forgets the extra fall $x$ while compressing (uses $mgh = \\tfrac12kx^2$ alone — that gives $x = 0.141$ m, close to but distinct from the true 0.152 m; option A is pure mis-scaling); (C) 0.10 m drops the $mgx$ term AND mis-solves; (D) 0.20 m doubles the correct root.`,
    formulaConcept: 'Block–spring drop: $mg(h+x) = \\tfrac12kx^2$ — the extra fall during compression matters.',
    difficulty: 'HARD', chapterSlug: 'work-energy-power', topicSlug: 'conservative-forces-pe',
    sourceType: 'ORIGINAL', sourceNote: 'Falling-block-on-spring energy balance.',
    diagram: {
      kind: 'fbd',
      bodies: [
        { type: 'ground', x: 40, y: 290, w: 230 },
        { type: 'spring', x: 150, y: 290, x2: 150, y2: 240 },
        { type: 'block', x: 132, y: 214, w: 36, h: 26, label: 'm' },
        { type: 'string', x: 150, y: 66, w: 0, h: 134 },
        { type: 'string', x: 96, y: 200, w: 108 },
      ],
      forces: [
        { from: [118, 227], to: [118, 183], label: 'F = kx', color: 'var(--chart-2)' },
        { from: [182, 227], to: [182, 254], label: 'mg', color: 'var(--chart-3)' },
      ],
      dims: [
        { from: [212, 66], to: [212, 200], label: 'h = 1.0 m' },
        { from: [212, 200], to: [212, 240], label: 'x = 0.15 m' },
        { from: [84, 200], to: [84, 290], label: 'natural length' },
      ],
    },
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `The moment of inertia of a uniform square lamina of mass $M$ and side $a$ about an axis **along one of its diagonals** (in the plane of the lamina) is:`,
    options: ['Ma²/6', 'Ma²/3', 'Ma²/24', 'Ma²/12'],
    correctAnswer: 'D',
    solutionText: `**Step 1 — axis perpendicular to the lamina through its centre:** for a square plate,
$$I_z = \\frac{Ma^2}{6}$$

**Step 2 — perpendicular-axis theorem** (lamina only): $I_z = I_x + I_y$ for two perpendicular in-plane axes through the same point. By the square's 4-fold symmetry, the moment of inertia is the same about **both diagonals** (any in-plane axis through the centre at 45° to the sides works identically):
$$I_z = I_{d_1} + I_{d_2} = 2I_d \\implies I_d = \\frac{Ma^2}{12}$$

**Cross-check by integration:** about an in-plane central axis parallel to a side, $I = Ma^2/12$; rotating axes by 45° to a diagonal mixes $x$- and $y$-integrals but the symmetry argument above already fixes $I_d = Ma^2/12$ ✓.

**Why the others are wrong:** (A) $Ma^2/6$ is $I_z$ (perpendicular axis) — the classic mix-up; (B) $Ma^2/3$ is about a side (parallel-axis from $Ma^2/12$); (C) $Ma^2/24$ halves $I_z$ twice.`,
    formulaConcept: 'Perpendicular-axis theorem on symmetric laminae: diagonals split $I_z$ equally → $I_d = Ma^2/12$.',
    difficulty: 'VERY_HARD', chapterSlug: 'rotational-motion', topicSlug: 'moment-of-inertia',
    sourceType: 'ORIGINAL', sourceNote: 'Diagonal-axis inertia via symmetry + perpendicular-axis theorem.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A planet orbits a star in a circular orbit of radius $r$ with period $T$. Another planet orbits the same star at radius $4r$. Its period is:`,
    options: ['2T', '4T', '8T', '16T'],
    correctAnswer: 'C',
    solutionText: `**Kepler's third law** (for circular orbits around the same central mass):
$$T^2 \\propto r^3$$

**Scale the orbit:**
$$\\frac{T_2}{T_1} = \\left(\\frac{r_2}{r_1}\\right)^{3/2} = \\left(\\frac{4r}{r}\\right)^{3/2} = 4^{3/2} = (\\sqrt{4})^3 = 2^3 = 8$$

So $T_2 = 8T$.

(Physical reading: at $4r$ the orbital speed is halved and the circumference is quadrupled — the period must rise by $2 \\times 4 = 8$.)

**Why the others are wrong:** (A) 2T uses $T \\propto r$; (B) 4T uses $T \\propto r^2$... actually $r^2$ scaling is Kepler's *area law* confusion; (D) 16T uses $T \\propto r^2$ directly ($4^2$).`,
    formulaConcept: 'Kepler III: $T^2 \\propto r^3$ — radius $\\times4$ ⇒ period $\\times 4^{3/2} = 8$.',
    difficulty: 'MODERATE', chapterSlug: 'gravitation', topicSlug: 'keplers-laws',
    sourceType: 'ORIGINAL', sourceNote: 'Kepler scaling without arithmetic mess.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A spherical raindrop of radius $r$ falls through air with terminal velocity $v$. A drop of the same liquid with radius $2r$ (same drag regime) has terminal velocity:`,
    options: ['2 : 1', '4 : 1', '8 : 1', '16 : 1'],
    correctAnswer: 'B',
    solutionText: `At terminal velocity, viscous drag (Stokes) balances weight minus buoyancy:
$$6\\pi\\eta r v_t = \\tfrac43 \\pi r^3 (\\rho - \\sigma) g$$

**Solve for $v_t$:**
$$v_t = \\frac{2r^2(\\rho-\\sigma)g}{9\\eta} \\implies v_t \\propto r^2$$

**For radius $2r$:**
$$v_{t}' = (2r)^2 \\times \\text{const} = 4v_t$$

The $r^3$ weight wins over the $r$ of Stokes drag — bigger drops fall much faster (why drizzle floats but downpours sting).

**Why the others are wrong:** (A) 2:1 assumes $v \\propto r$; (C) 8:1 assumes $v \\propto r^3$ (volume); (D) 16:1 assumes $r^4$.`,
    formulaConcept: 'Stokes terminal speed $v_t \\propto r^2(\\rho - \\sigma)$ — weight ($r^3$) vs drag ($r$) leaves $r^2$.',
    difficulty: 'HARD', chapterSlug: 'properties-of-solids-and-fluids', topicSlug: 'viscosity',
    sourceType: 'ORIGINAL', sourceNote: 'Terminal-velocity scaling argument.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `One mole of an ideal gas expands **isothermally and reversibly** at $300\\ \\text{K}$ from volume $V$ to $2V$. The work done **by** the gas is closest to: $(R = 8.314\\ \\text{J mol}^{-1}\\text{K}^{-1}, \\ln 2 = 0.693)$`,
    options: ['1729 J', '3458 J', '1000 J', '869 J'],
    correctAnswer: 'A',
    solutionText: `For a reversible isothermal process:
$$W = nRT\\ln\\frac{V_2}{V_1}$$

**Substituting** $n = 1$, $T = 300$ K, $V_2/V_1 = 2$:
$$W = 1 \\times 8.314 \\times 300 \\times 0.693 = 2494.2 \\times 0.693 \\approx 1729\\ \\text{J}$$

(Isothermal means $\\Delta U = 0$, so this is also the heat absorbed — the first law with zero internal-energy change.)

**Why the others are wrong:** (B) 3458 J uses $\\ln 4$ (volume quadrupled); (C) 1000 J rounds $RT$ crudely; (D) 869 J halves the answer (using $\\ln\\sqrt2$).`,
    formulaConcept: 'Reversible isothermal work: $W = nRT\\ln(V_2/V_1)$ — equals $Q$ since $\\Delta U = 0$.',
    difficulty: 'HARD', chapterSlug: 'thermodynamics', topicSlug: 'thermodynamic-processes',
    sourceType: 'ORIGINAL', sourceNote: 'Isothermal work with clean log.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `The rms speed of oxygen molecules in a container is $v$ at $27^\\circ\\text{C}$. If the temperature is raised to $927^\\circ\\text{C}$, the rms speed becomes:`,
    options: ['4v', '√2 v', '2v', 'v/2'],
    correctAnswer: 'C',
    solutionText: `rms speed:
$$v_{rms} = \\sqrt{\\frac{3RT}{M}} \\implies v_{rms} \\propto \\sqrt{T}$$

**Convert to kelvin** (the trap!): $27^\\circ\\text{C} = 300$ K and $927^\\circ\\text{C} = 1200$ K.

**Ratio:**
$$\\frac{v_2}{v_1} = \\sqrt{\\frac{1200}{300}} = \\sqrt{4} = 2 \\implies v_2 = 2v$$

**Why the others are wrong:** (A) 4v uses the kelvin ratio directly without the square root; (B) √2 v corresponds to a temperature factor of 2 (i.e. 600 K); (D) v/2 inverts the direction of change — or uses Celsius ratio $1200/300$ computed on the wrong scale.`,
    formulaConcept: '$v_{rms} \\propto \\sqrt{T}$ in **kelvin** — Celsius differences mislead by design here.',
    difficulty: 'HARD', chapterSlug: 'kinetic-theory', topicSlug: 'ktg-basics',
    sourceType: 'ORIGINAL', sourceNote: 'Kelvin-conversion rms scaling.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A simple pendulum has period $T$ in a stationary lift. When the lift accelerates **upward** with acceleration $g$, the new period is:`,
    options: ['2T', 'T√2', 'T/2', 'T/√2'],
    correctAnswer: 'D',
    solutionText: `In an accelerating lift, the pendulum responds to the **effective gravity** — the vector sum of $g$ and the pseudo-force $(-a)$:
$$g_{eff} = g + a$$

**Time period:**
$$T' = 2\\pi\\sqrt{\\frac{l}{g+a}} = 2\\pi\\sqrt{\\frac{l}{2g}} = \\frac{T}{\\sqrt{2}}$$

(since $T = 2\\pi\\sqrt{l/g}$). The pendulum swings faster in an upward-accelerating lift, exactly as if gravity had doubled.

**Why the others are wrong:** (A) 2T would require $g_{eff} = g/4$ (downward acceleration $3g/4$-ish); (B) $T\\sqrt2$ corresponds to $g_{eff} = g/2$ (lift accelerating *down* at $g/2$); (C) $T/2$ needs $g_{eff} = 4g$.`,
    formulaConcept: `Lift problems: replace $g$ by $g_{eff} = g \\pm a$; period $T' = 2\\pi\\sqrt{l/g_{eff}}$.`,
    difficulty: 'MODERATE', chapterSlug: 'oscillations', topicSlug: 'pendulums',
    sourceType: 'ORIGINAL', sourceNote: 'Accelerating-lift pendulum with pseudo-force diagram.',
    diagram: {
      kind: 'fbd',
      bodies: [
        { type: 'wall', x: 60, y: 30, h: 200 },
        { type: 'wall', x: 280, y: 30, h: 200 },
        { type: 'rod', x: 60, y: 30, w: 220 },
        { type: 'ground', x: 60, y: 230, w: 220 },
        { type: 'pulley', x: 170, y: 38, r: 7 },
        { type: 'string', x: 170, y: 45, w: 31, h: 85 },
        { type: 'string', x: 170, y: 45, w: 0, h: 130 },
        { type: 'sphere', x: 201, y: 130, r: 16, label: 'm' },
      ],
      forces: [
        { from: [201, 130], to: [184, 83], label: 'T', color: 'var(--chart-2)' },
        { from: [201, 130], to: [201, 175], label: 'mg', color: 'var(--chart-3)' },
        { from: [170, 130], to: [170, 175], label: 'ma (pseudo)', color: 'var(--chart-3)', dashed: true },
        { from: [246, 130], to: [246, 220], label: 'g_eff = 2g', color: 'var(--chart-4)' },
        { from: [322, 40], to: [322, 108], label: 'lift: a = g ↑', color: 'var(--gold)' },
      ],
      dims: [
        { from: [140, 48], to: [171, 133], label: 'ℓ' },
      ],
    },
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A transverse wave travelling along $+x$ is described by $y = 0.04\\sin\\big(2\\pi(2t - 0.01x)\\big)$ (SI units). The speed of the wave is:`,
    options: ['100 m/s', '200 m/s', '400 m/s', '50 m/s'],
    correctAnswer: 'B',
    solutionText: `Rewrite in standard form $y = A\\sin(\\omega t - kx)$:
$$\\omega = 2\\pi \\times 2 = 4\\pi\\ \\text{rad/s}, \\qquad k = 2\\pi \\times 0.01 = 0.02\\pi\\ \\text{rad/m}$$

**Wave speed:**
$$v = \\frac{\\omega}{k} = \\frac{4\\pi}{0.02\\pi} = 200\\ \\text{m/s}$$

(Also: wavelength $\\lambda = 2\\pi/k = 100$ m, frequency $f = 2$ Hz, and $v = f\\lambda = 200$ m/s ✓.)

**Why the others are wrong:** (A) 100 m/s is the wavelength (frequency forgotten in $v = f\\lambda$); (C) 400 m/s doubles $\\omega$; (D) 50 m/s quarters it (swapped $k$ and $\\omega$ roles: $k/\\omega$).`,
    formulaConcept: 'Read $\\omega$ and $k$ from the phase, then $v = \\omega/k$ — or use $v = f\\lambda$ as a check.',
    difficulty: 'MODERATE', chapterSlug: 'waves', topicSlug: 'wave-motion',
    sourceType: 'ORIGINAL', sourceNote: 'Standard-form wave reading with waveform sketch.',
    diagram: {
      kind: 'wave',
      title: 'y = 0.04 sin 2π(2t − 0.01x) — λ = 100 m, f = 2 Hz',
      waves: [
        { type: 'sine', amplitude: 3, cycles: 2, phase: Math.PI, label: 't = 0', color: 'var(--gold)' },
        { type: 'sine', amplitude: 3, cycles: 2, phase: Math.PI / 2, dashed: true, label: 't = T/4 (shifts +x)', color: 'var(--chart-2)' },
      ],
      xAxis: { label: 'x (m): 0 → 200' },
      yAxis: { label: 'y (m)' },
    },
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A point charge $q$ is placed at one **corner** of a cube. The electric flux through the whole cube is:`,
    options: ['q/ε₀', 'q/2ε₀', 'q/4ε₀', 'q/8ε₀'],
    correctAnswer: 'D',
    solutionText: `Imagine **eight identical cubes** stacked so that the shared corner becomes the centre of a $2\\times2\\times2$ block. The charge sits at the very centre of that composite cube.

**By Gauss's law**, the total flux out of the composite cube is $q/\\varepsilon_0$, and by symmetry it divides **equally** among the 8 smaller cubes:
$$\\Phi_{cube} = \\frac{1}{8}\\frac{q}{\\varepsilon_0} = \\frac{q}{8\\varepsilon_0}$$

(The solid angle subtended by one cube at its corner is $1/8$ of the full sphere — same argument.)

**Why the others are wrong:** (A) $q/\\varepsilon_0$ is the flux when the charge is at the **centre** of the cube; (B) $q/2\\varepsilon_0$ corresponds to charge on a face (4-cube argument); (C) $q/4\\varepsilon_0$ corresponds to charge on an edge (2-cube argument).`,
    formulaConcept: 'Charge at cube corner → $1/8$ solid angle → flux $q/8\\varepsilon_0$; on face $q/2\\varepsilon_0$; on edge $q/4\\varepsilon_0$.',
    difficulty: 'VERY_HARD', chapterSlug: 'electrostatics', topicSlug: 'gauss-law',
    sourceType: 'ORIGINAL', sourceNote: 'Solid-angle Gauss-law classic.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A copper wire carries a steady current $I$ with drift speed $v_d$. If the same current is passed through a wire of the same material but double the radius, the drift speed becomes:`,
    options: ['v_d/4', 'v_d/2', 'v_d/8', '2v_d'],
    correctAnswer: 'A',
    solutionText: `Current and drift speed are linked by
$$I = n e A v_d$$
For the same material $n$ is unchanged, and $I$ is held fixed:
$$v_d = \\frac{I}{neA} \\implies v_d \\propto \\frac{1}{A} \\propto \\frac{1}{r^2}$$

**Double the radius → area ×4:**
$$v_d' = \\frac{v_d}{4}$$

(Electron density $n \\approx 8.5\\times10^{28}\\ \\text{m}^{-3}$ for copper — same for both wires.)

**Why the others are wrong:** (B) $v_d/2$ assumes $v \\propto 1/r$; (C) $v_d/8$ assumes $1/r^3$; (D) $2v_d$ has the ratio inverted.`,
    formulaConcept: '$I = neAv_d$: fixed current + fatter wire → slower drift ($v_d \\propto 1/r^2$).',
    difficulty: 'HARD', chapterSlug: 'current-electricity', topicSlug: 'ohms-law-resistance',
    sourceType: 'ORIGINAL', sourceNote: 'Drift-velocity scaling at fixed current.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A wire bent as a circular arc of radius $R$ subtending $120^\\circ$ at the centre carries a current $I$. The magnetic field at the centre of the arc is:`,
    options: ['μ₀I/2πR', 'μ₀I/6R', 'μ₀I/4R', 'μ₀I/3R'],
    correctAnswer: 'B',
    solutionText: `The Biot–Savart field at the centre of a circular arc subtending angle $\\theta$ (in radians):
$$B = \\frac{\\mu_0 I}{4\\pi R}\\,\\theta$$

**For $\\theta = 120^\\circ = \\dfrac{2\\pi}{3}$ rad:**
$$B = \\frac{\\mu_0 I}{4\\pi R} \\times \\frac{2\\pi}{3} = \\frac{\\mu_0 I}{6R}$$

**Consistency checks:** a full circle ($\\theta = 2\\pi$) gives $\\mu_0I/2R$ ✓ (standard loop formula); a semicircle gives $\\mu_0 I/4R$; a quarter gives $\\mu_0I/8R$. The arc field scales linearly with arc angle.

**Why the others are wrong:** (A) $\\mu_0I/2\\pi R$ is the straight-wire formula misapplied at distance $R$; (C) $\\mu_0I/4R$ is the semicircle value; (D) $\\mu_0I/3R$ corresponds to $240^\\circ$ or $\\theta = 4\\pi/3$.`,
    formulaConcept: 'Arc field: $B = \\dfrac{\\mu_0 I}{4\\pi R}\\theta$ — linear in arc angle, full circle $\\mu_0I/2R$.',
    difficulty: 'HARD', chapterSlug: 'magnetic-effects-of-current', topicSlug: 'biot-savart-law',
    sourceType: 'ORIGINAL', sourceNote: 'Arc-angle Biot–Savart with sector diagram.',
    diagram: {
      kind: 'geometry',
      xRange: [-3, 3],
      yRange: [-3, 3],
      elements: [
        { type: 'circle', cx: 0, cy: 0, r: 2, color: 'var(--chart-3)', dashed: true, label: 'guide circle, radius R' },
        { type: 'segment', from: [1, -1.732], to: [1.338, -1.486], color: 'var(--gold)' },
        { type: 'segment', from: [1.338, -1.486], to: [1.618, -1.176], color: 'var(--gold)' },
        { type: 'segment', from: [1.618, -1.176], to: [1.827, -0.813], color: 'var(--gold)' },
        { type: 'segment', from: [1.827, -0.813], to: [1.956, -0.416], color: 'var(--gold)' },
        { type: 'segment', from: [1.956, -0.416], to: [2, 0], color: 'var(--gold)' },
        { type: 'segment', from: [2, 0], to: [1.956, 0.416], color: 'var(--gold)' },
        { type: 'segment', from: [1.956, 0.416], to: [1.827, 0.813], color: 'var(--gold)' },
        { type: 'segment', from: [1.827, 0.813], to: [1.618, 1.176], color: 'var(--gold)' },
        { type: 'segment', from: [1.618, 1.176], to: [1.338, 1.486], color: 'var(--gold)' },
        { type: 'segment', from: [1.338, 1.486], to: [1, 1.732], color: 'var(--gold)' },
        { type: 'point', x: 0, y: 0, label: 'C', labelPos: 'W' },
        { type: 'point', x: 1, y: 1.732, label: 'P₁', labelPos: 'NE' },
        { type: 'point', x: 1, y: -1.732, label: 'P₂', labelPos: 'SE' },
        { type: 'segment', from: [0, 0], to: [1, -1.732], label: 'R', color: 'var(--gold)' },
        { type: 'segment', from: [0, 0], to: [1, 1.732], label: 'R', color: 'var(--gold)' },
        { type: 'angleArc', at: [0, 0], fromDeg: 60, toDeg: -60, r: 0.6, label: 'θ = 120°' },
        { type: 'vector', from: [1.416, -1.424], to: [1.648, -1.148], color: 'var(--chart-2)' },
        { type: 'vector', from: [1.94, -0.18], to: [1.94, 0.18], label: 'I', color: 'var(--chart-2)' },
        { type: 'vector', from: [1.648, 1.148], to: [1.416, 1.424], color: 'var(--chart-2)' },
        { type: 'label', x: -1.7, y: 1.45, text: 'B ⊙ = μ₀I/6R (out of page)', color: 'var(--chart-2)' },
      ],
      square: true,
      showGrid: false,
      title: 'current arc subtending 120° at centre C',
    },
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `For a short bar magnet, the ratio of the magnetic field on its **axis** at distance $d$ to the field on its **equatorial line** at the same distance is:`,
    options: ['1 : 2', '1 : 4', '2 : 1', '4 : 1'],
    correctAnswer: 'C',
    solutionText: `Standard short-magnet fields at distance $d$:
$$B_{axial} = \\frac{\\mu_0}{4\\pi}\\frac{2M}{d^3}, \\qquad B_{equatorial} = \\frac{\\mu_0}{4\\pi}\\frac{M}{d^3}$$

**Ratio:**
$$\\frac{B_{axial}}{B_{equatorial}} = \\frac{2M}{M} = 2$$

The axial field is twice the equatorial field and points in the same direction as the moment, while the equatorial field is opposite to it.

**Why the others are wrong:** (A) 1:2 inverts the ratio; (B) 1:4 compares squares; (D) 4:1 double-counts the factor of 2 (as if axial had $4M$).`,
    formulaConcept: 'Short magnet: $B_{axis} = 2 \\times B_{equator}$ at equal distance — the $2M/d^3$ vs $M/d^3$ rule.',
    difficulty: 'MODERATE', chapterSlug: 'magnetism-and-matter', topicSlug: 'bar-magnet',
    sourceType: 'ORIGINAL', sourceNote: 'Axial vs equatorial dipole fields.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `In an AC generator with a coil rotating in a uniform magnetic field, the induced emf is **maximum** when the plane of the coil is:`,
    options: [
      'perpendicular to the magnetic field (flux maximum)',
      'parallel to the magnetic field (flux zero)',
      'at 45° to the magnetic field',
      'at any angle — the emf is constant',
    ],
    correctAnswer: 'B',
    solutionText: `Flux through the coil: $\\phi = NBA\\cos\\omega t$ (angle between the coil's **normal** and $\\vec B$).

**Faraday's law:**
$$e = -N\\frac{d\\phi}{dt} = NBA\\omega\\sin\\omega t$$

The emf peaks when $\\sin\\omega t = 1$, i.e. when $\\cos\\omega t = 0$ — the **normal is perpendicular to $\\vec B$**, which means the **plane of the coil is parallel to $\\vec B$** (flux momentarily zero but changing fastest).

The generator converts mechanical work most effectively exactly when there is no flux to push through — emf depends on the *rate of change*, not the flux itself.

**Why the others are wrong:** (A) at maximum flux ($\\cos = 1$) the *rate* of change is zero — emf momentarily vanishes; (C) 45° gives $e = NBA\\omega/\\sqrt2$; (D) only a commutator/DC output would be constant.`,
    formulaConcept: 'Generator emf $e = NBA\\omega\\sin\\omega t$ — maximum when flux is zero (plane ∥ $\\vec B$).',
    difficulty: 'HARD', chapterSlug: 'emi', topicSlug: 'ac-generator',
    sourceType: 'ORIGINAL', sourceNote: 'Flux vs emf phase relationship.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `An ideal transformer steps $220\\ \\text{V}$ down to $11\\ \\text{V}$. If the primary draws $0.5\\ \\text{A}$, the secondary current (to the load) is:`,
    options: ['0.25 A', '2.5 A', '10 A', '50 A'],
    correctAnswer: 'C',
    solutionText: `Ideal transformer: power in = power out.
$$V_p I_p = V_s I_s$$

**Solve:**
$$I_s = \\frac{V_p I_p}{V_s} = \\frac{220 \\times 0.5}{11} = \\frac{110}{11} = 10\\ \\text{A}$$

Voltage steps down $20\\times$; current steps **up** $20\\times$ ($0.5 \\to 10$ A) — conservation of energy in copper.

**Why the others are wrong:** (A) 0.25 A halves the current (steps it the wrong way); (B) 2.5 A uses a factor of 5; (D) 50 A multiplies instead of using the product relation.`,
    formulaConcept: 'Ideal transformer: $V_pI_p = V_sI_s$ — current ratio is inverse of voltage ratio.',
    difficulty: 'MODERATE', chapterSlug: 'alternating-current', topicSlug: 'transformer',
    sourceType: 'ORIGINAL', sourceNote: 'Step-down transformer current balance.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `For a plane electromagnetic wave in vacuum, the ratio of the amplitude of the electric field to the amplitude of the magnetic field $E_0/B_0$ equals:`,
    options: ['c', 'c²', '1/c', 'c/2'],
    correctAnswer: 'A',
    solutionText: `For a plane EM wave the fields satisfy (from Maxwell's equations applied to the wave):
$$\\frac{E_0}{B_0} = c = 3\\times10^{8}\\ \\text{m/s}$$

Dimension check: $[E] = $ N/C and $[B] = $ N·s/(C·m), so $E/B$ has units m/s — a speed, and there is only one special speed in vacuum: $c$.

(Physically, the wave's electric and magnetic parts carry equal energy — the fields themselves are not equal in magnitude; $B_0$ is $E_0/c$.)

**Why the others are wrong:** (B) $c^2$ appears in $1/\\sqrt{\\mu_0\\varepsilon_0}$ manipulations only as a square of the ratio; (C) $1/c$ inverts; (D) $c/2$ has no origin.`,
    formulaConcept: 'EM wave: $E_0 = cB_0$ — the field amplitudes are locked to the speed of light.',
    difficulty: 'MODERATE', chapterSlug: 'em-waves', topicSlug: 'em-wave-properties',
    sourceType: 'ORIGINAL', sourceNote: 'Field-amplitude ratio with dimension check.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A person with a near point of $25\\ \\text{cm}$ uses a converging lens of focal length $5\\ \\text{cm}$ as a simple microscope, with the final image at the near point. The magnifying power is:`,
    options: ['5', '6', '30', '1.2'],
    correctAnswer: 'B',
    solutionText: `Simple microscope (magnifier) with image at the near point:
$$M = 1 + \\frac{D}{f}$$

**Substituting** $D = 25$ cm, $f = 5$ cm:
$$M = 1 + \\frac{25}{5} = 1 + 5 = 6$$

(The lens forms a virtual, magnified image at 25 cm; the angular size compared to viewing the object at 25 cm unaided is 6×.)

For contrast, with the image at infinity (relaxed eye) $M$ would be $D/f = 5$.

**Why the others are wrong:** (A) 5 is the relaxed-eye value; (C) 30 multiplies instead of adds; (D) 1.2 inverts the ratio ($f/D$-style).`,
    formulaConcept: 'Magnifier: $M = 1 + D/f$ (image at near point) vs $M = D/f$ (image at infinity).',
    difficulty: 'MODERATE', chapterSlug: 'ray-optics', topicSlug: 'optical-instruments',
    sourceType: 'ORIGINAL', sourceNote: 'Simple microscope power with both conventions noted.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `In a single-slit diffraction experiment, the slit width is $2\\lambda$ (twice the wavelength). The angular width of the central maximum is:`,
    options: ['30°', '90°', '45°', '60°'],
    correctAnswer: 'D',
    solutionText: `Minima of the single-slit pattern satisfy
$$a\\sin\\theta = m\\lambda$$

**First minimum** with $a = 2\\lambda$:
$$\\sin\\theta = \\frac{\\lambda}{2\\lambda} = \\frac{1}{2} \\implies \\theta = 30^\\circ$$

The **central maximum** extends from $-30^\\circ$ to $+30^\\circ$ on either side of the forward direction:
$$\\text{angular width} = 2\\theta = 60^\\circ$$

(The central maximum is wide because the slit is narrow — barely two wavelengths.)

**Why the others are wrong:** (A) 30° is the half-angle (one side only); (B) 90° would need $\\sin\\theta = 1$, i.e. $a = \\lambda$; (C) 45° corresponds to $\\sin\\theta = 1/\\sqrt2$, i.e. $a = \\sqrt2\\lambda$.`,
    formulaConcept: 'Single slit: minima at $a\\sin\\theta = m\\lambda$; central width $= 2\\sin^{-1}(\\lambda/a)$.',
    difficulty: 'HARD', chapterSlug: 'wave-optics', topicSlug: 'diffraction',
    sourceType: 'ORIGINAL', sourceNote: 'Slit-width-ratio diffraction geometry with intensity sketch.',
    diagram: {
      kind: 'graph',
      title: 'single-slit diffraction: a = 2λ',
      xAxis: { label: 'angle θ (°)', min: -90, max: 90, ticks: [-90, -60, -30, 0, 30, 60, 90] },
      yAxis: { label: 'I / I₀', min: -0.04, max: 1.1, ticks: [0, 0.25, 0.5, 0.75, 1] },
      showGrid: true,
      square: false,
      curves: [
        {
          type: 'curve', color: 'var(--gold)', label: 'I(θ) = [sin β / β]²',
          points: [[-90, 0], [-85, 0], [-80, 0], [-75, 0.001], [-70, 0.004], [-65, 0.01], [-60, 0.019], [-55, 0.031], [-50, 0.043], [-45, 0.047], [-40, 0.037], [-35, 0.015], [-30, 0], [-25, 0.031], [-20, 0.152], [-15, 0.377], [-10, 0.661], [-5, 0.904], [0, 1], [5, 0.904], [10, 0.661], [15, 0.377], [20, 0.152], [25, 0.031], [30, 0], [35, 0.015], [40, 0.037], [45, 0.047], [50, 0.043], [55, 0.031], [60, 0.019], [65, 0.01], [70, 0.004], [75, 0.001], [80, 0], [85, 0], [90, 0]],
        },
      ],
      markers: [
        { x: -30, y: 0, label: 'first minimum: a sinθ = λ', color: 'var(--chart-3)' },
        { x: 30, y: 0, label: 'first minimum: a sinθ = λ', color: 'var(--chart-3)' },
        { x: 0, y: 1, label: 'I₀', color: 'var(--gold)' },
      ],
      shadedRegions: [
        {
          points: [[-30, 0], [-30, 0.001], [-26, 0.033], [-20, 0.152], [-15, 0.377], [-10, 0.661], [-5, 0.904], [0, 1], [5, 0.904], [10, 0.661], [15, 0.377], [20, 0.152], [26, 0.033], [30, 0.001], [30, 0]],
          color: 'var(--gold)', label: 'central max: width 60°',
        },
      ],
    },
  },
  // ---------------- SECTION B (numerical) Q21–Q25 ----------------
  {
    subject: 'PHYSICS', section: 'B',
    text: `Light of photon energy $3.5\\ \\text{eV}$ falls on a metal of work function $2.5\\ \\text{eV}$. The stopping potential (in volts) for the photoelectrons is:`,
    correctAnswer: '1',
    solutionText: `**Einstein's photoelectric equation:**
$$K_{max} = h\\nu - W_0 = 3.5 - 2.5 = 1.0\\ \\text{eV}$$

**Stopping potential** — the reverse potential that just reduces $K_{max}$ to zero:
$$eV_s = K_{max} \\implies V_s = \\frac{1.0\\ \\text{eV}}{e} = 1\\ \\text{V}$$

The graph of $K_{max}$ vs frequency would be a line of slope $h$ crossing zero at $\\nu_0 = W_0/h$; our operating point sits 1 eV above the intercept.

**Sanity check:** photon energy exceeds the work function by exactly 1 eV, and $1\\ \\text{eV}$ of electron energy always corresponds to a $1\\ \\text{V}$ stopping potential — the nicest conversion in physics.`,
    formulaConcept: 'Stopping potential: $eV_s = h\\nu - W_0$; 1 eV of KE ↔ 1 V of stopping potential.',
    difficulty: 'MODERATE', chapterSlug: 'dual-nature', topicSlug: 'photoelectric-effect',
    sourceType: 'ORIGINAL', sourceNote: 'Einstein relation with KE-vs-frequency graph.',
    diagram: {
      kind: 'graph',
      title: 'Einstein photoelectric: K_max = hν − W₀ (W₀ = 2.5 eV)',
      xAxis: { label: 'ν (×10¹⁵ Hz)', min: 0, max: 1.3, ticks: [0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2] },
      yAxis: { label: 'K_max (eV)', min: -3, max: 3, ticks: [-2, -1, 0, 1, 2, 3] },
      showGrid: true,
      square: false,
      curves: [
        { type: 'line', color: 'var(--gold)', label: 'K_max = hν − W₀', points: [[0.604, 0], [0.7, 0.395], [0.8, 0.809], [0.846, 1.0], [0.9, 1.222], [1.0, 1.636], [1.1, 2.05], [1.2, 2.463], [1.25, 2.67]] },
        { type: 'line', color: 'var(--chart-5)', dashed: true, label: 'extrapolation', points: [[0.04, -2.335], [0.2, -1.673], [0.4, -0.846], [0.604, 0]] },
      ],
      markers: [
        { x: 0.604, y: 0, label: 'ν₀ = W₀/h ≈ 0.60', color: 'var(--chart-3)' },
        { x: 0.846, y: 1.0, label: '3.5 eV photon → K = 1.0 eV', color: 'var(--chart-2)' },
        { x: 0.04, y: -2.5, label: '−W₀', color: 'var(--chart-5)' },
      ],
    },
  },
  {
    subject: 'PHYSICS', section: 'B',
    text: `The wavelength (in nm) of the photon emitted when an electron in a hydrogen atom falls from the $n = 4$ level to the $n = 2$ level is: (use $hc \\approx 1240\\ \\text{eV·nm}$, $E_n = -13.6/n^2$ eV)`,
    correctAnswer: '486',
    solutionText: `**Energy gap:**
$$\\Delta E = E_4 - E_2 = -\\frac{13.6}{16} - \\left(-\\frac{13.6}{4}\\right) = 13.6\\left(\\frac{1}{4} - \\frac{1}{16}\\right) = 13.6 \\times \\frac{3}{16} = 2.55\\ \\text{eV}$$

**Photon wavelength:**
$$\\lambda = \\frac{hc}{\\Delta E} = \\frac{1240}{2.55} = 486.3\\ \\text{nm}$$

This is the second line of the **Balmer series** (H-β) — the blue-green line of the visible hydrogen spectrum.

**Check the family:** Lyman lines (to $n=1$) lie in UV; Balmer $3\\to2$ = 656 nm (red), $4\\to2$ = 486 nm (cyan) ✓.`,
    formulaConcept: 'Balmer: $\\Delta E = 13.6(1/4 - 1/n^2)$ eV; $\\lambda = 1240/\\Delta E$ nm.',
    difficulty: 'HARD', chapterSlug: 'atoms', topicSlug: 'atomic-spectra',
    sourceType: 'ORIGINAL', sourceNote: 'H-β Balmer line computation.',
  },
  {
    subject: 'PHYSICS', section: 'B',
    text: `The mass of a $^{4}_{2}\\text{He}$ nucleus is $4.0026\\ \\text{u}$, the proton is $1.0078\\ \\text{u}$ and the neutron $1.0087\\ \\text{u}$. The binding energy per nucleon of the helium nucleus (in MeV, round off to two decimals) is: $(1\\ \\text{u} = 931.5\\ \\text{MeV}/c^2)$`,
    correctAnswer: '7.08',
    solutionText: `**Mass defect** — 2 protons + 2 neutrons vs the nucleus:
$$\\Delta m = 2(1.0078) + 2(1.0087) - 4.0026$$
$$= 2.0156 + 2.0174 - 4.0026 = 0.0304\\ \\text{u}$$

**Total binding energy:**
$$BE = \\Delta m \\times 931.5 = 0.0304 \\times 931.5 = 28.32\\ \\text{MeV}$$

**Per nucleon** (4 nucleons):
$$\\frac{BE}{A} = \\frac{28.32}{4} = 7.08\\ \\text{MeV/nucleon}$$

He-4 sits at the sharp early peak of the binding-energy curve — which is why alpha particles are so exceptionally stable.`,
    formulaConcept: '$BE = \\Delta m \\times 931.5$ MeV with $\\Delta m = Zm_p + Nm_n - M_{nucleus}$; per nucleon for He-4 ≈ 7.08 MeV.',
    difficulty: 'HARD', chapterSlug: 'nuclei', topicSlug: 'binding-energy',
    sourceType: 'ORIGINAL', sourceNote: 'Mass-defect computation from raw masses.',
  },
  {
    subject: 'PHYSICS', section: 'B',
    text: `A silicon diode (forward drop $0.7\\ \\text{V}$) is connected in series with a $1\\ \\text{k}\\Omega$ resistor and an ideal $5\\ \\text{V}$ battery, the diode being forward biased. The current in the circuit (in mA, round off to one decimal) is:`,
    correctAnswer: '4.3',
    solutionText: `With the diode forward biased and conducting, it holds approximately $0.7$ V across itself (the standard silicon diode model).

**Voltage available for the resistor:**
$$V_R = 5 - 0.7 = 4.3\\ \\text{V}$$

**Ohm's law:**
$$I = \\frac{V_R}{R} = \\frac{4.3\\ \\text{V}}{1000\\ \\Omega} = 4.3\\times10^{-3}\\ \\text{A} = 4.3\\ \\text{mA}$$

The diode and resistor share the battery's 5 V in a fixed split: 0.7 V for the junction, the rest across $R$.

**Sanity check:** the current is comfortably in the mA range expected for a small-signal diode circuit.`,
    formulaConcept: 'Piecewise diode model: conducting silicon diode ≈ 0.7 V drop; remainder of the supply appears across the series resistor.',
    difficulty: 'MODERATE', chapterSlug: 'semiconductors', topicSlug: 'diode-circuits',
    sourceType: 'ORIGINAL', sourceNote: 'Diode-series-resistor circuit with diagram.',
    diagram: {
      kind: 'circuit',
      components: [
        { type: 'wire', x1: 60, y1: 60, x2: 110, y2: 60 },
        { type: 'resistor', x1: 110, y1: 60, x2: 180, y2: 60, label: 'R', value: '1 kΩ' },
        { type: 'wire', x1: 180, y1: 60, x2: 280, y2: 60 },
        { type: 'wire', x1: 280, y1: 60, x2: 280, y2: 105 },
        { type: 'diode', x1: 280, y1: 105, x2: 280, y2: 155, label: 'D (Si)', value: '0.7 V' },
        { type: 'wire', x1: 280, y1: 155, x2: 280, y2: 200 },
        { type: 'wire', x1: 280, y1: 200, x2: 200, y2: 200 },
        { type: 'ammeter', x1: 200, y1: 200, x2: 140, y2: 200, label: 'I', value: '4.3 mA' },
        { type: 'wire', x1: 140, y1: 200, x2: 60, y2: 200 },
        { type: 'wire', x1: 60, y1: 200, x2: 60, y2: 160 },
        { type: 'battery', x1: 60, y1: 100, x2: 60, y2: 160, label: 'ε', value: '5 V' },
        { type: 'wire', x1: 60, y1: 100, x2: 60, y2: 60 },
        { type: 'junction', x: 60, y: 60 },
        { type: 'junction', x: 280, y: 60 },
        { type: 'junction', x: 280, y: 200 },
        { type: 'junction', x: 60, y: 200 },
        { type: 'arrow', x1: 200, y1: 38, x2: 250, y2: 38, label: 'I', color: 'var(--chart-3)' },
        { type: 'arrow', x1: 250, y1: 222, x2: 200, y2: 222, label: 'I', color: 'var(--chart-3)' },
      ],
    },
  },
  {
    subject: 'PHYSICS', section: 'B',
    text: `A steel wire of length $2\\ \\text{m}$ and cross-sectional area $1\\ \\text{mm}^2$ is fixed at one end and a $1\\ \\text{kg}$ load is hung from the other. The elongation of the wire (in mm, round off to one decimal) is: $(Y_{steel} = 2\\times10^{11}\\ \\text{Pa}, g = 10\\ \\text{m/s}^2)$`,
    correctAnswer: '0.1',
    solutionText: `**Young's modulus definition:**
$$Y = \\frac{F/A}{\\Delta L / L} \\implies \\Delta L = \\frac{F L}{A Y}$$

**Substituting** $F = mg = 1 \\times 10 = 10$ N, $L = 2$ m, $A = 10^{-6}\\ \\text{m}^2$:
$$\\Delta L = \\frac{10 \\times 2}{10^{-6} \\times 2\\times10^{11}} = \\frac{20}{2\\times10^{5}} = 10^{-4}\\ \\text{m} = 0.1\\ \\text{mm}$$

Steel really is stiff: a kilogram stretches a metre-scale wire by only a tenth of a millimetre — which is precisely why steel is the material of cables and reinforcement.

**Unit discipline:** convert the area to SI **before** substituting; the mm²-to-m² factor of $10^{-6}$ is where most marks are lost.`,
    formulaConcept: 'Hooke for a wire: $\\Delta L = FL/(AY)$ — convert every quantity to SI first.',
    difficulty: 'MODERATE', chapterSlug: 'properties-of-solids-and-fluids', topicSlug: 'elasticity',
    sourceType: 'ORIGINAL', sourceNote: 'Wire-elongation numeric with unit trap.',
  },
]
