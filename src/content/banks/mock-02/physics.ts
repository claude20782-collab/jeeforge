import type { SeedQuestion } from '@/content/types'

// ============================================================================
// MOCK 02 — PHYSICS (Q1–Q25: 20 MCQ Section A + 5 numerical Section B)
// Difficulty target: Hard JEE Main (mock 2 of 40, ramp phase). All calculations
// verified by hand; every question has a complete step-by-step solution.
// ============================================================================

export const PHYSICS_MOCK02: SeedQuestion[] = [
  // ---------------- SECTION A (MCQ) Q1–Q20 ----------------
  {
    subject: 'PHYSICS', section: 'A',
    text: `The coefficient of viscosity $\\eta$ relates the viscous force to the velocity gradient through $F = \\eta A \\dfrac{dv}{dx}$. The dimensional formula of $\\eta$ is:`,
    options: ['[MLT⁻²]', '[ML⁻¹T⁻¹]', '[ML²T⁻¹]', '[ML⁻²T⁻¹]'],
    correctAnswer: 'B',
    solutionText: `Solving for $\\eta$:
$$\\eta = \\frac{F}{A\\,(dv/dx)} \\implies [\\eta] = \\frac{[F]}{[L^2][T^{-1}]}$$

**Substituting dimensions:**
$$[\\eta] = \\frac{MLT^{-2}}{L^2 \\cdot T^{-1}} = ML^{-1}T^{-1}$$

This is the same as $\\text{kg m}^{-1}\\text{s}^{-1}$ (poise in CGS).

**Why the others are wrong:** (A) $[MLT^{-2}]$ is force — forgetting the area and velocity-gradient terms; (C) $[ML^2T^{-1}]$ is angular momentum / Planck's constant $h$; (D) $[ML^{-2}T^{-1}]$ has the length exponent off by one.`,
    formulaConcept: '$[\\eta] = [F]/([A][T^{-1}]) = ML^{-1}T^{-1}$ — check any formula dimensionally before substituting numbers.',
    difficulty: 'MODERATE', chapterSlug: 'units-and-measurements', topicSlug: 'dimensional-analysis',
    sourceType: 'ORIGINAL', sourceNote: 'Direct dimensional-analysis question on viscosity.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `Rain is falling vertically with a speed of $5\\ \\text{m/s}$. A man walks on a horizontal road with a speed of $5\\sqrt{3}\\ \\text{m/s}$. To keep himself dry, he should hold his umbrella at an angle with the vertical equal to:`,
    options: ['30°', '45°', '60°', '90°'],
    correctAnswer: 'C',
    solutionText: `In the man's frame the rain has a horizontal component $5\\sqrt{3}$ m/s (opposite to his motion) and a vertical component $5$ m/s downward. The umbrella must point **against the relative velocity** of the rain.

**Angle from the vertical:**
$$\\tan\\theta = \\frac{v_{\\text{horizontal}}}{v_{\\text{vertical}}} = \\frac{5\\sqrt{3}}{5} = \\sqrt{3} \\implies \\theta = 60^\\circ$$

The umbrella tilts $60^\\circ$ from the vertical, towards the direction in which the man is walking.

**Why the others are wrong:** (A) $30^\\circ$ is the angle from the *horizontal* — the complement, the classic slip; (B) $45^\\circ$ would need equal components; (D) $90^\\circ$ (horizontal umbrella) would need the rain to fall horizontally.`,
    formulaConcept: 'Relative velocity: $\\vec v_{r,m} = \\vec v_r - \\vec v_m$; $\\tan\\theta = v_m / v_{rain}$ for vertically falling rain.',
    difficulty: 'MODERATE', chapterSlug: 'kinematics', topicSlug: 'relative-motion',
    sourceType: 'ORIGINAL', sourceNote: 'Rain–man umbrella problem with a 3-4-5 twist.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A uniform ladder of mass $10\\ \\text{kg}$ and length $L$ rests against a smooth vertical wall at an angle $60^\\circ$ with the rough horizontal floor, as shown. The minimum coefficient of friction between the ladder and the floor for equilibrium is: $(g = 10\\ \\text{m/s}^2)$`,
    options: ['0.29', '0.38', '0.50', '0.58'],
    correctAnswer: 'A',
    solutionText: `The wall is **smooth**, so it exerts only a normal reaction $N_w$ (horizontal). The floor exerts $N_f$ (up) and friction $f$ (horizontal, towards the wall, preventing the base from sliding out).

**Force balance (horizontal):** $f = N_w$
**Force balance (vertical):** $N_f = mg = 100$ N

**Torque balance about the base** (unknown floor forces drop out). With the centre of mass at $L/2$:
$$N_w \\,(L\\sin 60^\\circ) = mg\\,\\tfrac{L}{2}\\cos 60^\\circ \\implies N_w = \\frac{mg}{2}\\cot 60^\\circ = \\frac{100}{2} \\times 0.577 = 28.9\\ \\text{N}$$

**Minimum friction:**
$$\\mu_{\\min} = \\frac{f_{\\max}}{N_f} = \\frac{N_w}{N_f} = \\frac{28.9}{100} \\approx 0.29$$

(General result: $\\mu_{\\min} = \\tfrac{1}{2}\\cot\\theta$.)

**Why the others are wrong:** (B) $0.38$ comes from taking the torque arm ratio inverted ($\\tan$ instead of $\\cot$); (C) $0.50$ is the value for a $45^\\circ$ ladder; (D) $0.58 = \\cot 60^\\circ$ itself — forgetting the factor $\\tfrac12$ from the centre of mass.`,
    formulaConcept: 'Ladder equilibrium: torque about the base gives $N_w = \\tfrac{mg}{2}\\cot\\theta$, and $\\mu_{\\min} = N_w/N_f = \\tfrac{1}{2}\\cot\\theta$.',
    difficulty: 'HARD', chapterSlug: 'laws-of-motion', topicSlug: 'friction',
    sourceType: 'ORIGINAL', sourceNote: 'Smooth-wall ladder; classic torque + friction threshold.',
    diagram: {
      kind: 'fbd',
      bodies: [
        { type: 'ground', x: 20, y: 238, w: 270 },
        { type: 'wall', x: 190, y: 45, h: 195 },
        { type: 'string', x: 95, y: 238, w: 95, h: -164 },
      ],
      forces: [
        { from: [190, 88], to: [148, 88], label: 'N_w', color: 'var(--chart-2)' },
        { from: [142, 156], to: [142, 196], label: 'mg', color: 'var(--chart-3)' },
        { from: [95, 238], to: [95, 200], label: 'N_f', color: 'var(--chart-2)' },
        { from: [95, 230], to: [132, 230], label: 'f', color: 'var(--chart-3)' },
      ],
      dims: [{ from: [95, 250], to: [190, 250], label: 'ladder at 60° to floor' }],
    },
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A ball of mass $m$ moving with speed $u$ collides head-on and elastically with a stationary ball of mass $3m$. The fraction of the initial kinetic energy transferred to the heavier ball is:`,
    options: ['25%', '56%', '100%', '75%'],
    correctAnswer: 'D',
    solutionText: `For an elastic head-on collision with target at rest, the speed of mass $M$ (initially at rest) after impact is
$$V = \\frac{2m}{m+M}\\,u$$

**Fraction of kinetic energy transferred:**
$$\\frac{KE_{\\text{target}}}{KE_{\\text{initial}}} = \\frac{\\tfrac12 M V^2}{\\tfrac12 m u^2} = \\frac{M}{m}\\left(\\frac{2m}{m+M}\\right)^2 = \\frac{4mM}{(m+M)^2}$$

**With $M = 3m$:**
$$\\frac{4 \\cdot m \\cdot 3m}{(4m)^2} = \\frac{12}{16} = \\frac{3}{4} = 75\\%$$

**Why the others are wrong:** (A) 25% would be $\\left(\\tfrac{2 \\cdot 1}{4}\\right)^2 = 25\\%$ — forgetting the factor $M/m = 3$; (B) 56% corresponds to $M = 2m$ ($\\tfrac{8}{9}$ is 89%, $\\tfrac{4 \\cdot 2}{9} = 89\\%$ — the listed 56% is a pure distractor); (C) 100% transfer happens only for equal masses.`,
    formulaConcept: 'Elastic collision energy transfer: $\\dfrac{4mM}{(m+M)^2}$ of the incident energy goes to the struck mass.',
    difficulty: 'HARD', chapterSlug: 'work-energy-power', topicSlug: 'collisions',
    sourceType: 'ORIGINAL', sourceNote: 'Energy-transfer fraction in elastic collisions.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A uniform rod of mass $2m$ and length $L$ rotates freely in a horizontal plane about a vertical axis through its centre. A putty ball of mass $m$ moving perpendicular to the rod with speed $v$ strikes the rod at one end and sticks to it. The angular velocity of the system immediately after the impact is:`,
    options: ['6v / 5L', '3v / L', '2v / L', '12v / 5L'],
    correctAnswer: 'A',
    solutionText: `No external torque acts about the pivot during the brief impact, so **angular momentum about the axis is conserved** (linear momentum is not — the hinge exerts impulse).

**Before:** the putty at distance $L/2$ from the axis has
$$L_i = m v \\frac{L}{2}$$

**After:** the system (rod + putty at the end) rotates with $\\omega$:
$$I = I_{\\text{rod}} + m\\left(\\frac{L}{2}\\right)^2 = \\frac{2m L^2}{12} + \\frac{mL^2}{4} = \\frac{mL^2}{6} + \\frac{mL^2}{4} = \\frac{5mL^2}{12}$$

**Conserving angular momentum:**
$$m v \\frac{L}{2} = \\frac{5mL^2}{12}\\,\\omega \\implies \\omega = \\frac{6v}{5L}$$

**Why the others are wrong:** (B) $3v/L$ ignores the putty's own added inertia $mL^2/4$; (C) $2v/L$ uses only the putty's inertia $mL^2/4$ (ignores the rod); (D) $12v/5L$ doubles the angular momentum of the putty.`,
    formulaConcept: 'Inelastic rotation: $m v r = (I_{rod} + mr^2)\\omega$; for a centre-pivoted rod $I = ML^2/12$.',
    difficulty: 'HARD', chapterSlug: 'rotational-motion', topicSlug: 'angular-momentum',
    sourceType: 'ORIGINAL', sourceNote: 'Putty-on-rod angular momentum conservation.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `The escape speed from the surface of the Earth is $11.2\\ \\text{km/s}$. The speed of a satellite in a circular orbit of radius $4R$ ($R$ = radius of Earth) is:`,
    options: ['3.96 km/s', '5.6 km/s', '7.9 km/s', '2.8 km/s'],
    correctAnswer: 'A',
    solutionText: `Escape speed from the surface:
$$v_e = \\sqrt{\\frac{2GM}{R}}$$
Orbital speed at radius $r$:
$$v_o = \\sqrt{\\frac{GM}{r}}$$

**Dividing:**
$$\\frac{v_o}{v_e} = \\sqrt{\\frac{R}{2r}} \\implies v_o = v_e\\sqrt{\\frac{R}{2r}}$$

**With $r = 4R$:**
$$v_o = 11.2 \\times \\sqrt{\\frac{1}{8}} = \\frac{11.2}{2\\sqrt{2}} = 3.96\\ \\text{km/s}$$

**Why the others are wrong:** (B) $5.6 = v_e/2$ would correspond to $r = 2R$; (C) $7.9$ km/s is the low-orbit speed at $r \\approx R$ (the famous first cosmic speed); (D) $2.8 = v_e/4$ would correspond to $r = 8R$.`,
    formulaConcept: '$v_o = v_e\\sqrt{R/(2r)}$ — orbital speed falls as $1/\\sqrt{r}$; escape speed is $\\sqrt{2}$ times the surface-orbit speed.',
    difficulty: 'MODERATE', chapterSlug: 'gravitation', topicSlug: 'satellites-and-escape-velocity',
    sourceType: 'ORIGINAL', sourceNote: 'Orbit–escape speed ratio without needing $GM$.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A cubical block of relative density $0.9$ floats at the interface of water and an oil of relative density $0.8$ poured above it, with its faces horizontal. The fraction of the cube's volume that lies in water is:`,
    options: ['90%', '80%', '10%', '50%'],
    correctAnswer: 'D',
    solutionText: `Let $x$ be the depth immersed in water; the remaining height $(a - x)$ is in oil. Balancing the weight of the cube against the two buoyant forces (face area $A$):

$$\\rho_c \\, a A g = \\rho_o (a - x) A g + \\rho_w x A g$$

Dividing by $A g$ and putting $\\rho_c = 0.9$, $\\rho_o = 0.8$, $\\rho_w = 1.0$ (in g/cm³):
$$0.9a = 0.8a - 0.8x + x = 0.8a + 0.2x$$
$$0.1a = 0.2x \\implies x = \\frac{a}{2}$$

**Half the cube is in water** (and half in oil).

**Why the others are wrong:** (A) 90% assumes the whole counter-pressure acts like water; (B) 80% equals the oil density value (a guess); (C) 10% is the water-fraction you would get if the densities were swapped in the algebra ($x = (\\rho_c - \\rho_o)/(\\rho_w - \\rho_o)$ mis-evaluated).`,
    formulaConcept: 'Interface flotation: $x/a = (\\rho_c - \\rho_o)/(\\rho_w - \\rho_o)$ for a cube spanning two liquids.',
    difficulty: 'HARD', chapterSlug: 'properties-of-solids-and-fluids', topicSlug: 'fluid-statics',
    sourceType: 'ORIGINAL', sourceNote: 'Two-liquid interface flotation.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `One mole of an ideal monatomic gas is taken around the cycle $A \\to B \\to C \\to D \\to A$ shown in the $P$–$V$ diagram ($P_0 = 100\\ \\text{kPa}$, $V_0 = 1\\ \\text{L}$). The net work done **by** the gas in the cycle is:`,
    options: ['0 J', '100 J', '200 J', '−100 J'],
    correctAnswer: 'B',
    solutionText: `Work in a cycle = (net signed area enclosed). Each leg:

**$A \\to B$** (isobaric at $2P_0 = 200$ kPa, volume $V_0 \\to 2V_0$):
$$W_{AB} = P\\,\\Delta V = 2P_0 \\times V_0 = 200\\ \\text{J}$$

**$B \\to C$** (isochoric, $2V_0$): $W = 0$.

**$C \\to D$** (isobaric at $P_0 = 100$ kPa, volume $2V_0 \\to V_0$):
$$W_{CD} = P\\,\\Delta V = 100\\ \\text{kPa} \\times (-1\\ \\text{L}) = -100\\ \\text{J}$$

**$D \\to A$** (isochoric, $V_0$): $W = 0$.

**Net work:**
$$W_{cycle} = 200 + 0 - 100 + 0 = +100\\ \\text{J}$$

The cycle runs clockwise on the $P$–$V$ plane, so the gas does positive work — consistent with the enclosed area $(1\\ \\text{L})(100\\ \\text{kPa}) = 100\\ \\text{J}$.

**Why the others are wrong:** (A) zero is the net *change* of internal energy over a cycle (not the work); (C) 200 J counts only the expansion leg; (D) −100 J would be the counter-clockwise loop.`,
    formulaConcept: 'Cyclic work = enclosed area in the $P$–$V$ plane; isochoric legs contribute nothing.',
    difficulty: 'HARD', chapterSlug: 'thermodynamics', topicSlug: 'thermodynamic-processes',
    sourceType: 'ORIGINAL', sourceNote: 'Rectangle PV-cycle work computation.',
    diagram: {
      kind: 'graph',
      title: 'PV cycle',
      xAxis: { label: 'V', min: 0, max: 3, ticks: [1, 2] },
      yAxis: { label: 'P', min: 0, max: 250, ticks: [100, 200] },
      curves: [
        { type: 'line', color: 'var(--gold)', points: [[1, 200], [2, 200], [2, 100], [1, 100], [1, 200]] },
      ],
      shadedRegions: [{ points: [[1, 100], [2, 100], [2, 200], [1, 200]], color: 'var(--gold)' }],
      markers: [
        { x: 1, y: 200, label: 'A' }, { x: 2, y: 200, label: 'B' },
        { x: 2, y: 100, label: 'C' }, { x: 1, y: 100, label: 'D' },
      ],
    },
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `Two moles of helium (monatomic) are mixed with one mole of oxygen (diatomic, rigid rotor) at the same temperature. The ratio of specific heats $\\gamma = C_p/C_v$ of the mixture is:`,
    options: ['3/2', '17/11', '7/5', '5/3'],
    correctAnswer: 'B',
    solutionText: `Molar heat capacities of the mixture are mole-weighted averages:
$$C_v = \\frac{n_1 C_{v1} + n_2 C_{v2}}{n_1 + n_2} = \\frac{2 \\times \\tfrac32 R + 1 \\times \\tfrac52 R}{3} = \\frac{3R + 2.5R}{3} = \\frac{5.5R}{3} = \\frac{11R}{6}$$

**Then:**
$$\\gamma = \\frac{C_v + R}{C_v} = \\frac{\\tfrac{11R}{6} + R}{\\tfrac{11R}{6}} = \\frac{17/6}{11/6} = \\frac{17}{11} \\approx 1.55$$

**Why the others are wrong:** (A) $3/2$ is the value for an *equal-mole* mono + diatomic mix — here helium dominates 2:1; (C) $7/5$ is pure diatomic $\\gamma$; (D) $5/3$ is pure monatomic $\\gamma$.`,
    formulaConcept: 'Gas mixtures: $C_{v,\\text{mix}} = \\sum n_i C_{vi} / \\sum n_i$, then $\\gamma = (C_v+R)/C_v$.',
    difficulty: 'VERY_HARD', chapterSlug: 'kinetic-theory', topicSlug: 'specific-heat-of-gases',
    sourceType: 'ORIGINAL', sourceNote: 'Mixture γ — mole-weighted heat capacities.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `The velocity–time graph of a particle executing SHM along a straight line is shown (the motion repeats every $2\\ \\text{s}$, and the maximum speed is $8\\ \\text{cm/s}$). The magnitude of the maximum acceleration of the particle is:`,
    options: ['2π cm/s²', '4π cm/s²', '8π cm/s²', '16π cm/s²'],
    correctAnswer: 'C',
    solutionText: `From the graph: period $T = 2$ s, so
$$\\omega = \\frac{2\\pi}{T} = \\pi\\ \\text{rad/s}$$

**Maximum speed in SHM:** $v_{\\max} = A\\omega = 8$ cm/s, which gives the amplitude:
$$A = \\frac{v_{\\max}}{\\omega} = \\frac{8}{\\pi}\\ \\text{cm}$$

**Maximum acceleration:**
$$a_{\\max} = \\omega^2 A = \\omega \\times (\\omega A) = \\omega \\times v_{\\max} = \\pi \\times 8 = 8\\pi\\ \\text{cm/s}^2$$

(Notice you never need the actual value of $A$.)

**Why the others are wrong:** (A) $2\\pi$ uses $T = 4$ s (half period misread); (B) $4\\pi$ uses $\\omega = \\pi/2$; (D) $16\\pi$ doubles the product (uses $2\\omega v_{\\max}$).`,
    formulaConcept: 'In SHM, $v_{\\max} = A\\omega$ and $a_{\\max} = A\\omega^2$, so $a_{\\max} = \\omega v_{\\max}$ — read $T$ and $v_{\\max}$ off the $v$–$t$ graph.',
    difficulty: 'HARD', chapterSlug: 'oscillations', topicSlug: 'shm-kinematics',
    sourceType: 'ORIGINAL', sourceNote: 'Graph-based SHM kinematics; avoid computing A.',
    diagram: {
      kind: 'graph',
      title: 'v–t of the SHM particle',
      xAxis: { label: 't (s)', min: 0, max: 2, ticks: [0, 0.5, 1, 1.5, 2] },
      yAxis: { label: 'v (cm/s)', min: -10, max: 10, ticks: [-8, 0, 8] },
      curves: [
        {
          type: 'curve', color: 'var(--gold)',
          points: [[0, 8], [0.25, 5.66], [0.5, 0], [0.75, -5.66], [1, -8], [1.25, -5.66], [1.5, 0], [1.75, 5.66], [2, 8]],
        },
      ],
      markers: [
        { x: 0, y: 8, label: '8 cm/s' },
        { x: 1, y: -8, label: '−8' },
      ],
    },
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A closed organ pipe of length $0.35\\ \\text{m}$ resonates with a source at $250\\ \\text{Hz}$ and with the next higher resonance at $750\\ \\text{Hz}$. The speed of sound in air is:`,
    options: ['175 m/s', '245 m/s', '350 m/s', '700 m/s'],
    correctAnswer: 'C',
    solutionText: `A pipe closed at one end supports only **odd harmonics**: $f_1, 3f_1, 5f_1, \\dots$

Two successive resonances therefore differ by $2f_1$:
$$3f_1 - f_1 = 750 - 250 = 500\\ \\text{Hz} \\implies f_1 = 250\\ \\text{Hz}$$

So $250$ Hz *is* the fundamental (and $750 = 3f_1$ the third harmonic ✓).

**Fundamental of a closed pipe** (quarter wavelength in the pipe):
$$f_1 = \\frac{v}{4L} \\implies v = 4 f_1 L = 4 \\times 250 \\times 0.35 = 350\\ \\text{m/s}$$

**Why the others are wrong:** (A) $175 = v/2$ uses $v = 2f_1L$ (open-pipe half); (B) 245 m/s uses $f_1 = 175$ Hz from mis-subtracting; (D) $700 = 2 \\times 350$ treats the given 250 Hz as the third harmonic instead of the fundamental.`,
    formulaConcept: 'Closed pipe: only odd harmonics $f_n = (2n-1)v/4L$; successive resonances differ by $2f_1$.',
    difficulty: 'MODERATE', chapterSlug: 'waves', topicSlug: 'standing-waves',
    sourceType: 'ORIGINAL', sourceNote: 'Closed-pipe successive resonance identification.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `In the network shown, $C_1 = 2\\ \\mu\\text{F}$ and $C_2 = 4\\ \\mu\\text{F}$ are in series, and that combination is in parallel with $C_3 = 6\\ \\mu\\text{F}$ across a $10\\ \\text{V}$ battery. The charge stored on $C_3$ is:`,
    options: ['20 μC', '60 μC', '40 μC', '100 μC'],
    correctAnswer: 'B',
    solutionText: `$C_3$ is connected **directly across the battery**, so the full $10$ V appears across it:
$$Q_3 = C_3 V = 6\\ \\mu\\text{F} \\times 10\\ \\text{V} = 60\\ \\mu\\text{C}$$

The series branch only matters for the *other* questions you could ask — for contrast:
$$C_{series} = \\frac{C_1 C_2}{C_1 + C_2} = \\frac{8}{6} = 1.33\\ \\mu\\text{F}, \\qquad Q_{branch} = 13.3\\ \\mu\\text{C}$$
but $Q_3$ is unaffected by it (parallel branches are independent).

**Why the others are wrong:** (A) 20 μC is $C_3 \\times$ the series-branch fraction $10/3$ V — wrongly assuming the series branch divides voltage with $C_3$; (C) 40 μC uses $Q = C_{eq}V$ with $C_{eq} = 4$ μF; (D) 100 μC treats $C_1 \\parallel C_2$ then adds $C_3$.`,
    formulaConcept: 'Parallel elements share the same voltage: $Q = CV$ per element; series combinations only affect their own branch.',
    difficulty: 'HARD', chapterSlug: 'electrostatics', topicSlug: 'capacitors',
    sourceType: 'ORIGINAL', sourceNote: 'Capacitor network — branch independence.',
    diagram: {
      kind: 'circuit',
      components: [
        { type: 'wire', x1: 60, y1: 60, x2: 320, y2: 60 },
        { type: 'wire', x1: 60, y1: 220, x2: 320, y2: 220 },
        { type: 'wire', x1: 60, y1: 60, x2: 60, y2: 120 },
        { type: 'wire', x1: 60, y1: 160, x2: 60, y2: 220 },
        { type: 'battery', x1: 60, y1: 120, x2: 60, y2: 160, label: 'V', value: '10 V' },
        { type: 'wire', x1: 150, y1: 60, x2: 150, y2: 85 },
        { type: 'capacitor', x1: 150, y1: 85, x2: 150, y2: 110, label: 'C₁', value: '2 μF' },
        { type: 'wire', x1: 150, y1: 110, x2: 150, y2: 140 },
        { type: 'capacitor', x1: 150, y1: 140, x2: 150, y2: 165, label: 'C₂', value: '4 μF' },
        { type: 'wire', x1: 150, y1: 165, x2: 150, y2: 220 },
        { type: 'wire', x1: 250, y1: 60, x2: 250, y2: 95 },
        { type: 'capacitor', x1: 250, y1: 95, x2: 250, y2: 140, label: 'C₃', value: '6 μF' },
        { type: 'wire', x1: 250, y1: 140, x2: 250, y2: 220 },
        { type: 'junction', x: 150, y: 60 },
        { type: 'junction', x: 150, y: 220 },
        { type: 'junction', x: 250, y: 60 },
        { type: 'junction', x: 250, y: 220 },
      ],
    },
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `In a potentiometer experiment, a standard cell of emf $2.00\\ \\text{V}$ is balanced at $250\\ \\text{cm}$ of the wire. When the standard cell is replaced by an unknown cell, the balance point shifts to $375\\ \\text{cm}$ (same driving current through the wire). The emf of the unknown cell is:`,
    options: ['1.33 V', '2.5 V', '4.5 V', '3 V'],
    correctAnswer: 'D',
    solutionText: `A potentiometer compares emfs through the potential drop per unit length, which is the same in both measurements:
$$\\frac{E_{unknown}}{E_{standard}} = \\frac{l_{unknown}}{l_{standard}}$$

**Substituting:**
$$E_{unknown} = 2.00 \\times \\frac{375}{250} = 2.00 \\times 1.5 = 3.00\\ \\text{V}$$

The potentiometer draws no current from the cell at balance, so it measures the true emf (no internal-resistance drop) — that is exactly why it beats a voltmeter.

**Why the others are wrong:** (A) 1.33 V inverts the ratio ($l_{std}/l_{unk}$); (B) 2.5 V adds 0.5 V instead of scaling; (C) 4.5 V uses $375/250 \\times 3$.`,
    formulaConcept: 'Potentiometer: $E_1/E_2 = l_1/l_2$ at constant wire current (null method, zero current drawn).',
    difficulty: 'MODERATE', chapterSlug: 'current-electricity', topicSlug: 'instruments',
    sourceType: 'ORIGINAL', sourceNote: 'Potentiometer emf comparison.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A proton and an alpha particle are accelerated from rest through the same potential difference and then enter a uniform magnetic field, both moving perpendicular to the field. The ratio of the radius of the alpha particle's circular path to that of the proton is:`,
    options: ['1', '2', '2√2', '√2'],
    correctAnswer: 'D',
    solutionText: `After acceleration through potential $V$:
$$qV = \\tfrac12 m v^2 \\implies v = \\sqrt{\\frac{2qV}{m}}$$

**Radius in the field** ($r = mv/qB$):
$$r = \\frac{m}{qB}\\sqrt{\\frac{2qV}{m}} = \\frac{1}{B}\\sqrt{\\frac{2mV}{q}} \\implies r \\propto \\sqrt{\\frac{m}{q}}$$

**For the alpha particle** ($m_\\alpha = 4m_p$, $q_\\alpha = 2q_p$):
$$\\frac{r_\\alpha}{r_p} = \\sqrt{\\frac{4m_p / 2q_p}{m_p / q_p}} = \\sqrt{2}$$

**Why the others are wrong:** (A) 1 would need equal $m/q$; (B) 2 is the ratio of $m_\\alpha/q_\\alpha$'s *masses* — forgetting the square root; (C) $2\\sqrt2$ uses $m_\\alpha/q_\\alpha = 4m_p/q_p$ (forgetting the charge doubles).`,
    formulaConcept: 'Accelerated-then-bent: $r = \\sqrt{2mV/q}/B \\propto \\sqrt{m/q}$ at equal accelerating potential.',
    difficulty: 'VERY_HARD', chapterSlug: 'magnetic-effects-of-current', topicSlug: 'force-on-moving-charges',
    sourceType: 'ORIGINAL', sourceNote: 'Cyclotron-radius ratio after equal acceleration.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A conducting rod of length $2\\ \\text{m}$ slides at a constant speed of $5\\ \\text{m/s}$ on frictionless rails perpendicular to a uniform magnetic field $B = 0.2\\ \\text{T}$, closing a circuit of total resistance $5\\ \\\\Omega$. The rate at which mechanical work must be done on the rod is:`,
    options: ['0.32 W', '2 W', '4 W', '0.8 W'],
    correctAnswer: 'D',
    solutionText: `**Motional emf:**
$$\\varepsilon = BLv = 0.2 \\times 2 \\times 5 = 2\\ \\text{V}$$

**Current:** $I = \\varepsilon/R = 2/5 = 0.4$ A

**Opposing magnetic force on the rod:**
$$F = BIL = 0.2 \\times 0.4 \\times 2 = 0.16\\ \\text{N}$$

To keep $v$ constant, the external agent pulls with $0.16$ N at $5$ m/s:
$$P_{ext} = Fv = 0.16 \\times 5 = 0.8\\ \\text{W}$$

**Cross-check** (energy conservation): $P_{heat} = I^2R = 0.16 \\times 5 = 0.8$ W ✓ — all the mechanical work dissipates as heat.

**Why the others are wrong:** (A) 0.32 W uses $I^2 R$ with $R = 2\\ \\Omega$ (the rod length treated as resistance); (B) 2 W is the raw emf value ($\\varepsilon \\times 1$ A); (C) 4 W is $\\varepsilon^2/R$ with $R = 1\\ \\Omega$.`,
    formulaConcept: 'Motional emf $\\varepsilon = BLv$; steady sliding needs $P_{ext} = (B^2L^2v^2)/R = I^2R$.',
    difficulty: 'HARD', chapterSlug: 'emi', topicSlug: 'motional-emf',
    sourceType: 'ORIGINAL', sourceNote: 'Rail–rod power balance via energy conservation.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `In a series $LCR$ circuit at resonance, three voltmeters read $V_R = 120\\ \\text{V}$ across the resistor, $V_L = 80\\ \\text{V}$ across the inductor and $V_C = 80\\ \\text{V}$ across the capacitor. The rms voltage of the source is:`,
    options: ['80 V', '144 V', '120 V', '280 V'],
    correctAnswer: 'C',
    solutionText: `In a series circuit the phasor voltages add, not the magnitudes:
$$V_s = \\sqrt{V_R^2 + (V_L - V_C)^2}$$

**At resonance** $V_L = V_C$ exactly (that is the resonance condition — net reactive voltage zero):
$$V_s = \\sqrt{120^2 + (80 - 80)^2} = \\sqrt{120^2} = 120\\ \\text{V}$$

The full source voltage appears across the resistance at resonance; the 80 V readings sit on $L$ and $C$ with opposite phases.

**Why the others are wrong:** (A) 80 V picks one reactive reading; (B) 144 V is $\\sqrt{120^2 + 80^2}$ — forgetting that $V_L$ and $V_C$ *subtract*; (D) 280 V naively sums all three magnitudes — the classic mistake this question tests.`,
    formulaConcept: 'Series LCR phasor addition: $V_s^2 = V_R^2 + (V_L - V_C)^2$; at resonance $V_s = V_R$.',
    difficulty: 'HARD', chapterSlug: 'alternating-current', topicSlug: 'resonance',
    sourceType: 'ORIGINAL', sourceNote: 'Resonance phasor bookkeeping trap.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `In a hydrogen atom, an electron makes a transition from the $n = 3$ level to the ground state (energy levels shown, to scale). The wavelength of the emitted photon is closest to: (use $hc \\approx 1240\\ \\text{eV·nm}$)`,
    options: ['103 nm', '122 nm', '486 nm', '656 nm'],
    correctAnswer: 'A',
    solutionText: `The energy radiated equals the level gap:
$$\\Delta E = E_3 - E_1 = -1.51 - (-13.6) = 12.09\\ \\text{eV}$$

**Photon wavelength:**
$$\\lambda = \\frac{hc}{\\Delta E} = \\frac{1240}{12.09} \\approx 102.6\\ \\text{nm} \\approx 103\\ \\text{nm}$$

This is the third line of the **Lyman series** (ultraviolet).

**Why the others are wrong:** (B) 122 nm is the $n=2 \\to 1$ Lyman-α line ($10.2$ eV); (C) 486 nm is Balmer $4\\to2$; (D) 656 nm is Balmer $3\\to2$ (H-α, visible red) — the favourite confusion of Lyman with Balmer.`,
    formulaConcept: 'Bohr levels $E_n = -13.6/n^2$ eV; photon $\\lambda = 1240/\\Delta E$(eV) nm.',
    difficulty: 'HARD', chapterSlug: 'atoms', topicSlug: 'bohr-model',
    sourceType: 'ORIGINAL', sourceNote: 'Bohr transition with scale energy-level diagram.',
    diagram: {
      kind: 'graph',
      title: 'Hydrogen energy levels (eV)',
      xAxis: { label: '', min: 0, max: 10, ticks: [] },
      yAxis: { label: 'E (eV)', min: -16, max: 2, ticks: [-13.6, -3.4, -1.51, -0.85, 0] },
      curves: [
        { type: 'line', color: 'var(--chart-4)', points: [[1, -0.85], [9, -0.85]] },
        { type: 'line', color: 'var(--chart-3)', points: [[1, -1.51], [9, -1.51]] },
        { type: 'line', color: 'var(--chart-2)', points: [[1, -3.4], [9, -3.4]] },
        { type: 'line', color: 'var(--gold)', points: [[1, -13.6], [9, -13.6]] },
        { type: 'line', color: 'var(--gold)', points: [[2, -13.6], [2, -1.51]] },
      ],
      markers: [
        { x: 2, y: -0.85, label: 'n = 4' },
        { x: 2, y: -1.51, label: 'n = 3' },
        { x: 2, y: -3.4, label: 'n = 2' },
        { x: 2, y: -13.6, label: 'n = 1' },
      ],
    },
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A ray passes through an equilateral glass prism ($\\mu = \\sqrt{3}$) placed in air, suffering minimum deviation. The angle of incidence at the first face is:`,
    options: ['30°', '45°', '60°', '90°'],
    correctAnswer: 'C',
    solutionText: `At **minimum deviation** the ray passes symmetrically: angle of emergence $e = i$ and the refracted ray inside makes equal angles $r = r' = A/2$ with the two faces.

**Snell's law at the first face** with $r = A/2 = 30^\\circ$:
$$\\mu = \\frac{\\sin i}{\\sin r} \\implies \\sin i = \\sqrt{3} \\times \\sin 30^\\circ = \\frac{\\sqrt{3}}{2} \\implies i = 60^\\circ$$

**Check via deviation:** $\\delta_m = 2i - A = 120 - 60 = 60^\\circ$ ✓ (consistent with $\\mu = \\sqrt3$ for a 60° prism).

**Why the others are wrong:** (A) 30° is the *refracted* angle $r$ inside the glass; (B) 45° has no role here; (D) 90° would give grazing incidence.`,
    formulaConcept: 'Minimum deviation symmetry: $r = A/2$, $\\delta_m = 2i - A$, $\\mu = \\sin i/\\sin(A/2)$.',
    difficulty: 'HARD', chapterSlug: 'ray-optics', topicSlug: 'prisms-tir',
    sourceType: 'ORIGINAL', sourceNote: 'Equilateral prism at minimum deviation.',
    diagram: {
      kind: 'ray',
      axis: false,
      elements: [
        { type: 'prism', x: 210, height: 130, width: 90, label: 'A = 60°, μ = √3' },
      ],
      rays: [
        { from: [40, 92], to: [172, 150], label: 'i = 60°' },
        { from: [172, 150], to: [248, 162], label: '' },
        { from: [248, 162], to: [420, 118], label: 'e' },
        { from: [130, 118], to: [214, 190], dashed: true, label: 'N₁', color: 'var(--chart-3)' },
      ],
    },
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `In Young's double-slit experiment with sodium light ($\\lambda = 600\\ \\text{nm}$), the fringe width on a screen is $0.60\\ \\text{mm}$ in air. The whole apparatus is now immersed in water ($n = 4/3$), with everything else unchanged. The new fringe width is:`,
    options: ['0.45 mm', '0.60 mm', '0.80 mm', '0.90 mm'],
    correctAnswer: 'A',
    solutionText: `Fringe width:
$$\\beta = \\frac{\\lambda D}{d}$$

**Inside water the wavelength shortens:**
$$\\lambda_w = \\frac{\\lambda_{air}}{n} = \\frac{600}{4/3} = 450\\ \\text{nm}$$

($D$ and $d$ are unchanged — both the slits and the screen shift together into the medium.)

**New fringe width:**
$$\\beta_w = \\frac{\\beta_{air}}{n} = \\frac{0.60}{4/3} = 0.45\\ \\text{mm}$$

**Why the others are wrong:** (B) unchanged would be true only if wavelength were medium-independent; (C) 0.80 mm multiplies by $4/3$ (inverted fraction); (D) 0.90 mm doubles the change.`,
    formulaConcept: 'Immersion scales $\\lambda \\to \\lambda/n$, so fringes shrink by $n$: $\\beta_w = \\beta/n$.',
    difficulty: 'MODERATE', chapterSlug: 'wave-optics', topicSlug: 'interference',
    sourceType: 'ORIGINAL', sourceNote: 'YDSE under water — wavelength-in-medium effect.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `The Boolean expression $Y = (A + B)\\,(A' + B')$ simplifies to: ($+$ denotes OR, juxtaposition denotes AND, $X'$ denotes NOT)`,
    options: ['XNOR', 'XOR', 'OR', 'NAND'],
    correctAnswer: 'B',
    solutionText: `Expanding the product of sums:
$$Y = (A + B)(A' + B') = AA' + AB' + A'B + BB'$$

Since $XX' = 0$:
$$Y = AB' + A'B$$

This is **exactly the XOR** (exclusive-OR) function — output 1 precisely when the inputs differ.

**Truth-table check:**
| A | B | Y |
|---|---|----|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

**Why the others are wrong:** (A) XNOR is $AB + A'B'$ — the complement of the result; (C) OR is simply $A + B$; (D) NAND is $(AB)'$.`,
    formulaConcept: `Product-of-sums expansion + absorption: $(A+B)(A'+B') = A \\oplus B$ (XOR).`,
    difficulty: 'HARD', chapterSlug: 'semiconductors', topicSlug: 'logic-gates',
    sourceType: 'ORIGINAL', sourceNote: 'Boolean simplification to XOR.',
  },
  // ---------------- SECTION B (numerical) Q21–Q25 ----------------
  {
    subject: 'PHYSICS', section: 'B',
    text: `A train moving at $20\\ \\text{m/s}$ sounds a whistle of frequency $600\\ \\text{Hz}$ while approaching a stationary listener standing by the track. Taking the speed of sound in air as $340\\ \\text{m/s}$, the frequency heard by the listener (in Hz) is:`,
    correctAnswer: '637.5',
    solutionText: `For a **source** approaching a **stationary observer**:
$$f' = f\\,\\frac{v}{v - v_s}$$

**Substituting:**
$$f' = 600 \\times \\frac{340}{340 - 20} = 600 \\times \\frac{340}{320} = 600 \\times 1.0625 = 637.5\\ \\text{Hz}$$

The wavelength ahead of the moving source is compressed ($\\lambda' = (v - v_s)/f$), stacking more cycles per second onto the listener's ear.

**Sanity checks:** the shift $+37.5$ Hz is about $+6\\%$, matching $v_s/(v - v_s) = 20/320 = 6.25\\%$. If the train were receding you would get $600 \\times 340/360 = 566.7$ Hz — the symmetric drop.`,
    formulaConcept: "Doppler (moving source): $f' = f\\,v/(v - v_s)$ — denominator shrinks while approaching.",
    difficulty: 'MODERATE', chapterSlug: 'waves', topicSlug: 'doppler-effect',
    sourceType: 'ORIGINAL', sourceNote: 'Approaching-train Doppler with clean numbers.',
    diagram: {
      kind: 'wave',
      title: 'wavefronts: stretched behind, compressed ahead of the source',
      waves: [
        { type: 'sine', amplitude: 40, cycles: 4.5, label: 'behind source (longer λ)' },
        { type: 'sine', amplitude: 40, cycles: 8, phase: 1, label: 'ahead of source (shorter λ)' },
      ],
      xAxis: { label: 'x' },
      yAxis: { label: 'y' },
    },
  },
  {
    subject: 'PHYSICS', section: 'B',
    text: `A battery of emf $10\\ \\text{V}$ and internal resistance $3\\ \\Omega$ is connected across an external resistor $R$. The terminal voltage of the battery is measured to be $8\\ \\text{V}$. The value of $R$ (in $\\Omega$) is:`,
    correctAnswer: '12',
    solutionText: `During discharge the terminal voltage is
$$V = \\varepsilon - Ir$$

**Current from the voltage drop across the internal resistance:**
$$I = \\frac{\\varepsilon - V}{r} = \\frac{10 - 8}{3} = \\frac{2}{3}\\ \\text{A}$$

**External resistance** (V is the voltage across R):
$$R = \\frac{V}{I} = \\frac{8}{2/3} = 12\\ \\Omega$$

**Check with the full circuit equation:** $I = \\varepsilon/(R + r) = 10/15 = 2/3$ A ✓, giving $V = IR = 8$ V ✓.`,
    formulaConcept: 'Terminal voltage $V = \\varepsilon - Ir$; combine with $V = IR$ to pin down $R$.',
    difficulty: 'HARD', chapterSlug: 'current-electricity', topicSlug: 'cells-and-emf',
    sourceType: 'ORIGINAL', sourceNote: 'Terminal-voltage back-solve.',
  },
  {
    subject: 'PHYSICS', section: 'B',
    text: `An electron is accelerated from rest through a potential difference of $100\\ \\text{V}$. Taking the de Broglie wavelength of an electron accelerated through potential $V$ volts as $\\lambda = \\dfrac{12.27}{\\sqrt{V}}\\ \\text{Å}$, the wavelength of this electron (in Å, round off to two decimals) is:`,
    correctAnswer: '1.23',
    solutionText: `**Direct substitution:**
$$\\lambda = \\frac{12.27}{\\sqrt{100}} = \\frac{12.27}{10} = 1.227\\ \\text{Å} \\approx 1.23\\ \\text{Å}$$

**Where the formula comes from:** $eV = \\tfrac12 m v^2$ gives $v = \\sqrt{2eV/m}$, so
$$\\lambda = \\frac{h}{mv} = \\frac{h}{\\sqrt{2meV}} = \\frac{12.27}{\\sqrt{V}}\\ \\text{Å}$$

with $h = 6.63\\times10^{-34}$ J·s, $m = 9.11\\times10^{-31}$ kg, $e = 1.6\\times10^{-19}$ C.

**Check the scale:** 100 eV electrons are slow (non-relativistic, $v \\approx 5.9 \\times 10^6$ m/s), so the formula is safely valid.`,
    formulaConcept: 'Electron wave nature: $\\lambda(\\text{Å}) = 12.27/\\sqrt{V(\\text{volts})}$ for non-relativistic acceleration.',
    difficulty: 'MODERATE', chapterSlug: 'dual-nature', topicSlug: 'de-broglie-waves',
    sourceType: 'ORIGINAL', sourceNote: 'Standard de Broglie computation.',
  },
  {
    subject: 'PHYSICS', section: 'B',
    text: `The activity of a radioactive sample falls to one-eighth of its initial value in $24\\ \\text{days}$. The percentage of the sample remaining after $40\\ \\text{days}$ from the start (round off to three decimals) is:`,
    correctAnswer: '3.125',
    solutionText: `**Step 1 — half-life from the given decay.**
$$\\frac{1}{8} = \\left(\\frac{1}{2}\\right)^3 \\implies 24\\ \\text{days} = 3\\ T_{1/2} \\implies T_{1/2} = 8\\ \\text{days}$$

**Step 2 — 40 days later.**
$$\\frac{40}{8} = 5 \\text{ half-lives} \\implies \\text{fraction left} = \\left(\\frac{1}{2}\\right)^5 = \\frac{1}{32}$$

**Step 3 — as a percentage:**
$$\\frac{1}{32} \\times 100 = 3.125\\%$$

So only **3.125%** of the original nuclei remain — activity, being proportional to the number of undecayed nuclei, has dropped by the same factor.`,
    formulaConcept: 'Each half-life halves the amount: $N = N_0\\,(1/2)^{t/T_{1/2}}$; fractions like 1/8 flag whole half-lives.',
    difficulty: 'HARD', chapterSlug: 'nuclei', topicSlug: 'radioactivity',
    sourceType: 'ORIGINAL', sourceNote: 'Half-life chain in percentage terms.',
  },
  {
    subject: 'PHYSICS', section: 'B',
    text: `Two thin lenses are kept in contact: a converging lens of focal length $20\\ \\text{cm}$ and a diverging lens of focal length $50\\ \\text{cm}$. The power of the combination (in dioptre) is:`,
    correctAnswer: '3',
    solutionText: `For thin lenses in contact, powers add (with signs):
$$P = P_1 + P_2 = \\frac{1}{f_1} + \\frac{1}{f_2}$$

**Convert to metres** (dioptre = m⁻¹):
$$P = \\frac{1}{+0.20} + \\frac{1}{-0.50} = 5 - 2 = +3\\ \\text{D}$$

**Equivalent focal length:** $f = 1/P = 33.3$ cm (converging — the positive lens dominates).

**Signs matter:** the diverging lens *subtracts* power. A common slip is to write $+2$ for the diverging lens (using $|f|$), which would give the wrong $+7$ D.`,
    formulaConcept: 'Lenses in contact: $P = \\sum 1/f_i$ with sign convention (converging positive).',
    difficulty: 'MODERATE', chapterSlug: 'ray-optics', topicSlug: 'refraction-lenses',
    sourceType: 'ORIGINAL', sourceNote: 'Contact-lens power with sign trap.',
  },
]
