import type { SeedQuestion } from '@/content/types'

// ============================================================================
// MOCK 01 — PHYSICS (Q1–Q25: 20 MCQ Section A + 5 numerical Section B)
// Difficulty target: Hard JEE Main. All questions verified; solutions complete.
// ============================================================================

export const PHYSICS_MOCK01: SeedQuestion[] = [
  // ---------------- SECTION A (MCQ) Q1–Q20 ----------------
  {
    subject: 'PHYSICS', section: 'A',
    text: `A particle moves along the $x$-axis. Its velocity–time graph is shown in the figure. The total distance travelled by the particle in the time interval $t = 0$ to $t = 18\\ \\text{s}$ is:`,
    options: ['72 m', '40 m', '104 m', '136 m'],
    correctAnswer: 'C',
    solutionText: `The distance travelled equals the **sum of the areas of all regions between the $v$–$t$ graph and the time axis, taking every area as positive** (displacement would use signed areas).

**Reading the graph (piecewise-linear):**
- $0 \\to 4$ s: $v$ rises from $0$ to $8$ m/s → area $= \\tfrac{1}{2}(4)(8) = 16$ m
- $4 \\to 10$ s: $v = 8$ m/s constant → area $= 8 \\times 6 = 48$ m
- $10 \\to 12$ s: $v$ falls from $8$ to $0$ → area $= \\tfrac{1}{2}(2)(8) = 8$ m
- $12 \\to 14$ s: $v$ goes from $0$ to $-8$ m/s → area $= \\tfrac{1}{2}(2)(8) = 8$ m
- $14 \\to 16$ s: $v = -8$ m/s constant → area $= 8 \\times 2 = 16$ m
- $16 \\to 18$ s: $v$ returns from $-8$ to $0$ → area $= \\tfrac{1}{2}(2)(8) = 8$ m

**Total distance:**
$$d = 16 + 48 + 8 + 8 + 16 + 8 = 104\\ \\text{m}$$

(Note: the displacement would be $72 - 32 = 40$ m, since the last three regions lie below the time axis — a common trap.)`,
    formulaConcept: 'Distance from a $v$–$t$ graph = sum of absolute areas of all regions; displacement = signed area.',
    difficulty: 'HARD', chapterSlug: 'kinematics', topicSlug: 'motion-in-a-straight-line',
    sourceType: 'ORIGINAL', sourceNote: 'Graph-reading trap: distance vs displacement.',
    diagram: {
      kind: 'graph',
      title: 'Velocity–time graph',
      showGrid: true,
      xAxis: { label: 't (s)', min: 0, max: 19, ticks: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18] },
      yAxis: { label: 'v (m/s)', min: -10, max: 10, ticks: [-10, -8, -5, 0, 5, 8, 10] },
      curves: [
        { type: 'line', color: 'var(--gold)', label: 'v(t)', points: [[0, 0], [1, 2], [2, 4], [3, 6], [4, 8], [5, 8], [6, 8], [7, 8], [8, 8], [9, 8], [10, 8], [11, 4], [12, 0], [13, -4], [14, -8], [15, -8], [16, -8], [17, -4], [18, 0]] },
      ],
      markers: [
        { x: 4, y: 8, label: '(4, 8)' }, { x: 10, y: 8, label: '(10, 8)' },
        { x: 12, y: 0, label: '(12, 0)' }, { x: 14, y: -8, label: '(14, −8)' },
        { x: 16, y: -8, label: '(16, −8)' }, { x: 18, y: 0, label: '(18, 0)' },
      ],
      shadedRegions: [
        { points: [[0, 0], [4, 8], [4, 0]], color: 'var(--gold)', label: '+16' },
        { points: [[4, 0], [4, 8], [10, 8], [10, 0]], color: 'var(--gold)', label: '+48' },
        { points: [[10, 0], [10, 8], [12, 0]], color: 'var(--gold)', label: '+8' },
        { points: [[12, 0], [14, -8], [14, 0]], color: 'var(--chart-3)', label: '−8' },
        { points: [[14, 0], [14, -8], [16, -8], [16, 0]], color: 'var(--chart-3)', label: '−16' },
        { points: [[16, 0], [16, -8], [18, 0]], color: 'var(--chart-3)', label: '−8' },
      ],
    },
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A block $A$ of mass $2\\ \\text{kg}$ lies on a rough $37^\\circ$ incline with coefficient of kinetic friction $\\mu = 0.25$. It is connected by a light inextensible string, over a frictionless pulley, to a hanging block $B$ of mass $3\\ \\text{kg}$ as shown. Taking $g = 10\\ \\text{m/s}^2$, the acceleration of the system is:`,
    options: ['3.2 m/s², with B descending', '2.0 m/s², with A sliding down the incline', '4.0 m/s², with B descending', '2.8 m/s², with B descending'],
    correctAnswer: 'D',
    solutionText: `First check the direction of motion. The weight of $B$ pulls with $3g = 30$ N; the forces resisting motion up the incline are the component of $A$'s weight down the incline plus friction:
$$mg\\sin 37^\\circ = 2 \\times 10 \\times 0.6 = 12\\ \\text{N}, \\qquad f = \\mu mg\\cos 37^\\circ = 0.25 \\times 2 \\times 10 \\times 0.8 = 4\\ \\text{N}$$
Since $30 > 12 + 4$, block $B$ descends and $A$ moves **up** the incline (friction then acts down the incline, opposing $A$'s motion up).

**Equations of motion:**
- Block $B$ (down positive): $30 - T = 3a$
- Block $A$ (up-the-incline positive): $T - 12 - 4 = 2a$

**Adding the two equations** (tension cancels):
$$30 - 16 = 5a \\implies a = \\frac{14}{5} = 2.8\\ \\text{m/s}^2$$

So the system accelerates at $2.8\\ \\text{m/s}^2$ with $B$ descending. (Check: $T = 3(10-2.8) = 21.6$ N, and $T - 16 = 5.6 = 2(2.8)$ ✓)

**Why the others are wrong:** (A) forgets friction ($30-12 = 18 = 5a = 3.6$); (B) assumes $A$ slides down; (C) assumes a frictionless plane *and* the wrong direction bookkeeping.`,
    formulaConcept: "Newton's second law for connected bodies: $a = \\dfrac{m_B g - m_A g(\\sin\\theta + \\mu\\cos\\theta)}{m_A + m_B}$",
    difficulty: 'HARD', chapterSlug: 'laws-of-motion', topicSlug: 'newtons-laws',
    sourceType: 'ORIGINAL', sourceNote: 'Standard incline–pulley system with friction.',
    diagram: {
      kind: 'fbd',
      bodies: [
        { type: 'ground', x: 20, y: 232, w: 260 },
        { type: 'incline', x: 55, y: 152, w: 155, h: 80, angle: 37, label: '37°, μ = 0.25' },
        { type: 'block', x: 72, y: 132, w: 34, h: 22, label: 'A (2 kg)' },
        { type: 'pulley', x: 218, y: 112, r: 13 },
        { type: 'block', x: 246, y: 176, w: 26, h: 22, label: 'B (3 kg)' },
      ],
      forces: [
        { from: [89, 143], to: [134, 143], label: 'T', color: 'var(--chart-2)' },
        { from: [89, 154], to: [126, 172], label: 'mg sinθ = 12 N', color: 'var(--chart-3)' },
        { from: [89, 148], to: [66, 122], label: 'N', color: 'var(--chart-5)' },
        { from: [104, 150], to: [84, 168], label: 'f = 4 N', color: 'var(--chart-4)' },
        { from: [233, 125], to: [261, 152], label: 'T', color: 'var(--chart-2)' },
        { from: [259, 198], to: [259, 230], label: '3g = 30 N', color: 'var(--chart-3)' },
        { from: [26, 196], to: [70, 168], label: 'motion of A', color: 'var(--gold)', dashed: true },
        { from: [292, 170], to: [292, 206], label: 'motion of B', color: 'var(--gold)', dashed: true },
      ],
    },
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A rigid body rolls without slipping down a rough inclined plane of inclination $30^\\circ$. Its centre of mass has acceleration $g/3$. The body may be a:`,
    options: ['solid cylinder', 'ring', 'solid sphere', 'hollow sphere'],
    correctAnswer: 'A',
    solutionText: `For a body rolling without slipping down an incline, the acceleration of the centre of mass is
$$a = \\frac{g\\sin\\theta}{1 + I/mR^2}$$

With $\\theta = 30^\\circ$ and $a = g/3$:
$$\\frac{g \\cdot \\tfrac{1}{2}}{1 + I/mR^2} = \\frac{g}{3} \\implies \\frac{1}{2\\left(1 + I/mR^2\\right)} = \\frac{1}{3} \\implies 1 + \\frac{I}{mR^2} = \\frac{3}{2} \\implies \\frac{I}{mR^2} = \\frac{1}{2}$$

**Check each candidate:**
- Ring: $I/mR^2 = 1$ ✗
- Solid sphere: $2/5$ ✗
- Hollow sphere: $2/3$ ✗
- **Solid cylinder: $I = \\tfrac{1}{2}mR^2 \\implies I/mR^2 = \\tfrac{1}{2}$ ✓**

Hence the body is a solid cylinder.`,
    formulaConcept: 'Rolling without slipping: $a = \\dfrac{g\\sin\\theta}{1 + I/mR^2}$ (from $mg\\sin\\theta - f = ma$ and $fR = I\\alpha$ with $a = R\\alpha$).',
    difficulty: 'MODERATE', chapterSlug: 'rotational-motion', topicSlug: 'rolling-motion',
    sourceType: 'ORIGINAL', sourceNote: 'Reverse-engineered rolling-body identification.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `Two planets have the same mean density but their radii are in the ratio $2:1$. The ratio of their escape velocities from the surfaces is:`,
    options: ['1 : 2', '2 : 1', '4 : 1', '$\\sqrt{2}$ : 1'],
    correctAnswer: 'B',
    solutionText: `Escape velocity from the surface of a planet is
$$v_e = \\sqrt{\\frac{2GM}{R}}$$

Write the mass in terms of density: $M = \\tfrac{4}{3}\\pi R^3 \\rho$. Then
$$v_e = \\sqrt{\\frac{2G \\cdot \\tfrac{4}{3}\\pi R^3 \\rho}{R}} = R\\sqrt{\\frac{8\\pi G\\rho}{3}}$$

**For equal densities, $v_e \\propto R$.** Hence
$$\\frac{v_{e,1}}{v_{e,2}} = \\frac{R_1}{R_2} = \\frac{2}{1}$$

The escape velocity from the larger planet is twice that from the smaller one. (If instead the *masses* were equal, the ratio would have been $1:\\sqrt{2}$ — that is the $\\sqrt{2}:1$ distractor.)`,
    formulaConcept: '$v_e = \\sqrt{2GM/R} = R\\sqrt{8\\pi G\\rho/3}$ — for fixed density, $v_e \\propto R$.',
    difficulty: 'MODERATE', chapterSlug: 'gravitation', topicSlug: 'satellites-and-escape-velocity',
    sourceType: 'ORIGINAL', sourceNote: 'Density-based escape-velocity comparison.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A block of mass $2\\ \\text{kg}$ is released from rest at the top of a smooth incline of height $1.25\\ \\text{m}$. At the bottom, it slides onto a rough horizontal surface ($\\mu = 0.1$) and compresses a spring of stiffness $1000\\ \\text{N/m}$. The maximum compression of the spring is (take $g = 10\\ \\text{m/s}^2$):`,
    options: ['0.16 m', '0.25 m', '0.31 m', '0.22 m'],
    correctAnswer: 'D',
    solutionText: `Use the **work–energy theorem** between the release point and the point of maximum compression (where the block is momentarily at rest).

**Energy released by gravity:**
$$U = mgh = 2 \\times 10 \\times 1.25 = 25\\ \\text{J}$$

**Energy absorbed:**
- Friction on the horizontal part (over compression $x$): $W_f = \\mu m g \\, x = 0.1 \\times 2 \\times 10 \\times x = 2x$
- Spring potential energy: $\\tfrac{1}{2}kx^2 = 500x^2$

**Energy balance:**
$$25 = 2x + 500x^2 \\implies 500x^2 + 2x - 25 = 0$$

Solving the quadratic (positive root):
$$x = \\frac{-2 + \\sqrt{4 + 4 \\cdot 500 \\cdot 25}}{1000} = \\frac{-2 + \\sqrt{50004}}{1000} = \\frac{-2 + 223.6}{1000} \\approx 0.2216\\ \\text{m} \\approx 0.22\\ \\text{m}$$

The maximum compression is about **0.22 m**. (0.25 m would result if friction were forgotten; 0.16 m follows from using the incline *length* instead of the height; 0.31 m from doubling the height.)`,
    formulaConcept: 'Work–energy theorem: $mgh = \\mu mgx + \\tfrac{1}{2}kx^2$ at maximum compression.',
    difficulty: 'HARD', chapterSlug: 'work-energy-power', topicSlug: 'work-energy-theorem',
    sourceType: 'ORIGINAL', sourceNote: 'Multi-stage energy bookkeeping with friction + spring.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A block of mass $m$ is attached to two springs (one on either side) each of stiffness $k$, and oscillates on a frictionless surface. If one spring is replaced by another of stiffness $4k$, the new period of oscillation, compared with the original period $T_0$, becomes:`,
    options: ['$T_0\\sqrt{2/5}$', '$T_0/\\sqrt{5}$', '$T_0\\sqrt{5}$', '$T_0\\sqrt{5/2}$'],
    correctAnswer: 'A',
    solutionText: `When a block is connected to springs on **both sides**, a displacement $x$ stretches one spring and compresses the other by the same amount; both restoring forces act in the same direction, so the springs behave like a **parallel combination**:
$$k_{\\text{eff}} = k_1 + k_2$$

**Original system:** $k_{\\text{eff}} = k + k = 2k$
$$T_0 = 2\\pi\\sqrt{\\frac{m}{2k}}$$

**New system:** $k_{\\text{eff}} = k + 4k = 5k$
$$T = 2\\pi\\sqrt{\\frac{m}{5k}}$$

**Ratio:**
$$\\frac{T}{T_0} = \\sqrt{\\frac{2k}{5k}} = \\sqrt{\\frac{2}{5}} \\implies T = T_0\\sqrt{\\tfrac{2}{5}}$$

($T_0/\\sqrt{5}$ would be obtained by wrongly treating the original system as having $k_{\\text{eff}} = k$ — the springs are on either side, not in series.)`,
    formulaConcept: 'Springs on either side of the block → parallel combination: $k_{\\text{eff}} = k_1 + k_2$; $T = 2\\pi\\sqrt{m/k_{\\text{eff}}}$.',
    difficulty: 'MODERATE', chapterSlug: 'oscillations', topicSlug: 'shm-kinematics',
    sourceType: 'ORIGINAL', sourceNote: 'Effective-stiffness trap (parallel vs series).',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A pipe closed at one end resonates at frequencies $250\\ \\text{Hz}$ and $350\\ \\text{Hz}$, with **no** resonance frequency in between. The fundamental frequency of the pipe is:`,
    options: ['100 Hz', '150 Hz', '50 Hz', '25 Hz'],
    correctAnswer: 'C',
    solutionText: `A pipe closed at one end supports only **odd harmonics**: $f_n = (2n+1)f_1$, i.e. $f_1, 3f_1, 5f_1, 7f_1, \\dots$

Since $250$ Hz and $350$ Hz are *consecutive* resonances with nothing between them, they must be consecutive odd harmonics. Their difference is
$$f_{n+1} - f_n = 2f_1 = 350 - 250 = 100\\ \\text{Hz} \\implies f_1 = 50\\ \\text{Hz}$$

**Consistency check:** $250 = 5 \\times 50$ (5th harmonic) and $350 = 7 \\times 50$ (7th harmonic) — consecutive odd harmonics with no resonance in between ✓.

(If the pipe were open at both ends, consecutive resonances would differ by $f_1 = 100$ Hz; but then $250$ Hz would not belong to the series $100, 200, 300, \\dots$ — so the pipe must be closed at one end.)`,
    formulaConcept: 'Closed pipe resonances: $f = (2n+1)f_1$ — consecutive resonances differ by $2f_1$.',
    difficulty: 'HARD', chapterSlug: 'waves', topicSlug: 'standing-waves',
    sourceType: 'ORIGINAL', sourceNote: 'Resonance-gap identification for a closed pipe.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A dipole of dipole moment $p = q\\cdot 2a$ lies along the $x$-axis with $+q$ at $x = +a$ and $-q$ at $x = -a$. $P$ is a point on the axis at distance $r \\gg a$ from the centre, and $Q$ is on the perpendicular bisector at the same distance $r$, as shown. The ratio of the magnitudes of the electric field at $P$ and at $Q$ is:`,
    options: ['1 : 2', '2 : 1', '$\\sqrt{2}$ : 1', '1 : 1'],
    correctAnswer: 'B',
    solutionText: `For a short dipole ($r \\gg a$):

**Field on the axial line (point $P$):**
$$E_{\\text{axial}} = \\frac{1}{4\\pi\\varepsilon_0}\\frac{2p}{r^3}$$

**Field on the equatorial line (point $Q$):**
$$E_{\\text{equatorial}} = \\frac{1}{4\\pi\\varepsilon_0}\\frac{p}{r^3}$$

Both fields fall as $1/r^3$, but at the same distance the axial field is exactly **twice** the equatorial field (the equatorial field also points opposite to $\\vec{p}$):
$$\\frac{E_P}{E_Q} = \\frac{2p/r^3}{p/r^3} = \\frac{2}{1}$$

This 2:1 ratio is independent of $p$ and $r$ (as long as $r \\gg a$).`,
    formulaConcept: 'Dipole fields: $E_{\\text{axial}} = 2kp/r^3$ (along $\\vec p$), $E_{\\text{equatorial}} = kp/r^3$ (opposite to $\\vec p$), with $k = 1/4\\pi\\varepsilon_0$.',
    difficulty: 'MODERATE', chapterSlug: 'electrostatics', topicSlug: 'electric-field',
    sourceType: 'ORIGINAL', sourceNote: 'Dipole field-ratio with field-line diagram.',
    diagram: {
      kind: 'field',
      bounds: { xMin: -4, xMax: 4, yMin: -3, yMax: 3 },
      charges: [
        { x: 0.8, y: 0, q: 1, label: '+q' },
        { x: -0.8, y: 0, q: -1, label: '−q' },
      ],
      vectors: [
        { x: 3.2, y: 0, label: 'P (axial point, dist. r)' },
        { x: 0, y: 2.4, label: 'Q (equatorial, dist. r)' },
        { x: 2.2, y: 0, label: 'E ∝ 2kp/r³' },
        { x: 0, y: 1.6, label: 'E ∝ kp/r³' },
      ],
      showLines: true,
    },
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A $6\\ \\mu\\text{F}$ capacitor charged to $100\\ \\text{V}$ and a $3\\ \\mu\\text{F}$ capacitor charged to $50\\ \\text{V}$ are connected in parallel by joining plates of like polarity, as shown. The final common potential difference is:`,
    options: ['75 V', '50 V', '100 V', '83.3 V'],
    correctAnswer: 'D',
    solutionText: `When capacitors are connected in parallel with like polarities joined, charge redistributes until both have the same potential. **Total charge is conserved** (and the connection is ideal):

**Initial charges:**
$$Q_1 = C_1V_1 = 6\\ \\mu\\text{F} \\times 100\\ \\text{V} = 600\\ \\mu\\text{C}, \\qquad Q_2 = C_2V_2 = 3 \\times 50 = 150\\ \\mu\\text{C}$$

**Common potential:**
$$V = \\frac{Q_1 + Q_2}{C_1 + C_2} = \\frac{600 + 150}{6 + 3} = \\frac{750}{9} \\approx 83.3\\ \\text{V}$$

So the common potential is $\\approx 83.3$ V.

(75 V is the *unweighted* average $\\frac{100+50}{2}$ — wrong because charge, not potential, is conserved, and the weights are the capacitances. Some energy $\\Delta U = \\tfrac{C_1C_2}{2(C_1+C_2)}(V_1-V_2)^2 = 1.67\\ \\text{mJ}$ is dissipated during redistribution.)`,
    formulaConcept: 'Parallel connection of charged capacitors: $V = \\dfrac{\\sum Q_i}{\\sum C_i}$ (charge conservation).',
    difficulty: 'HARD', chapterSlug: 'electrostatics', topicSlug: 'capacitors',
    sourceType: 'ORIGINAL', sourceNote: 'Charge-sharing with energy-loss distractor.',
    diagram: {
      kind: 'circuit',
      components: [
        { type: 'wire', x1: 70, y1: 100, x2: 70, y2: 170 },
        { type: 'capacitor', x1: 70, y1: 100, x2: 70, y2: 170, label: 'C₁', value: '6 μF' },
        { type: 'wire', x1: 70, y1: 100, x2: 70, y2: 40 },
        { type: 'wire', x1: 70, y1: 40, x2: 280, y2: 40 },
        { type: 'wire', x1: 70, y1: 170, x2: 280, y2: 170 },
        { type: 'wire', x1: 280, y1: 40, x2: 280, y2: 80 },
        { type: 'capacitor', x1: 280, y1: 100, x2: 280, y2: 170, label: 'C₂', value: '3 μF' },
        { type: 'wire', x1: 280, y1: 100, x2: 280, y2: 80 },
        { type: 'switch', x1: 150, y1: 40, x2: 200, y2: 40, label: 'S (open)', closed: false },
        { type: 'junction', x: 70, y: 40 },
        { type: 'junction', x: 70, y: 170 },
        { type: 'junction', x: 280, y: 40 },
        { type: 'junction', x: 280, y: 170 },
        { type: 'arrow', x1: 208, y1: 40, x2: 250, y2: 40, label: 'charge flows on closing S', color: 'var(--chart-2)' },
        { type: 'arrow', x1: 258, y1: 170, x2: 216, y2: 170, label: '', color: 'var(--chart-2)' },
        { type: 'label', x: 175, y: 130, text: 'C₁: 100 V · Q₁ = 600 μC' },
        { type: 'label', x: 175, y: 152, text: 'C₂: 50 V · Q₂ = 150 μC' },
        { type: 'label', x: 175, y: 196, text: 'like polarities joined → V = ΣQ/ΣC' },
      ],
    },
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `In the Wheatstone bridge circuit shown, the four arms have resistances $3\\ \\Omega$, $4\\ \\Omega$, $6\\ \\Omega$ and $8\\ \\Omega$ as marked, and a $10\\ \\text{V}$ battery drives the bridge. The current through the galvanometer (resistance $10\\ \\Omega$) connected across $B$ and $D$ is:`,
    options: ['0.1 A', '0.05 A', 'zero, because the bridge is balanced', '0.2 A'],
    correctAnswer: 'C',
    solutionText: `**Check the balance condition.** A Wheatstone bridge carries no current through the galvanometer when
$$\\frac{P}{Q} = \\frac{R}{S} \\quad \\Longleftrightarrow \\quad P\\cdot S = Q\\cdot R$$

From the figure, the arms are $P = 3\\ \\Omega$, $Q = 4\\ \\Omega$ (upper branch) and $R = 6\\ \\Omega$, $S = 8\\ \\Omega$ (lower branch):
$$P \\cdot S = 3 \\times 8 = 24, \\qquad Q \\cdot R = 4 \\times 6 = 24$$

Since $P\\cdot S = Q\\cdot R$, the bridge is **balanced**. Points $B$ and $D$ are at exactly the same potential ($V_B = V_D$), so no current flows through the galvanometer — whatever its resistance and whatever the battery EMF:
$$I_g = 0$$

*Verification:* each branch sees $10$ V. $V_B = 10\\times\\tfrac{4}{3+4}$ and $V_D = 10\\times\\tfrac{8}{6+8} = 10\\times\\tfrac{4}{7}$ — indeed equal. The galvanometer resistance and the battery voltage are red herrings.`,
    formulaConcept: 'Wheatstone balance: $\\dfrac{P}{Q} = \\dfrac{R}{S}$ → $V_B = V_D$ → $I_g = 0$ (independent of EMF and galvanometer resistance).',
    difficulty: 'HARD', chapterSlug: 'current-electricity', topicSlug: 'instruments',
    sourceType: 'ORIGINAL', sourceNote: 'Balance-recognition question with red-herring data.',
    diagram: {
      kind: 'circuit',
      components: [
        { type: 'wire', x1: 160, y1: 250, x2: 160, y2: 215 },
        { type: 'wire', x1: 160, y1: 95, x2: 160, y2: 60 },
        { type: 'wire', x1: 60, y1: 60, x2: 260, y2: 60 },
        { type: 'wire', x1: 60, y1: 60, x2: 60, y2: 150 },
        { type: 'wire', x1: 260, y1: 60, x2: 260, y2: 150 },
        { type: 'resistor', x1: 60, y1: 60, x2: 160, y2: 60, label: 'P', value: '3 Ω' },
        { type: 'resistor', x1: 160, y1: 60, x2: 260, y2: 60, label: 'Q', value: '4 Ω' },
        { type: 'resistor', x1: 60, y1: 60, x2: 60, y2: 150, label: 'R', value: '6 Ω' },
        { type: 'resistor', x1: 260, y1: 60, x2: 260, y2: 150, label: 'S', value: '8 Ω' },
        { type: 'wire', x1: 60, y1: 150, x2: 120, y2: 150 },
        { type: 'ammeter', x1: 120, y1: 150, x2: 200, y2: 150, label: 'G', value: '10 Ω' },
        { type: 'wire', x1: 200, y1: 150, x2: 260, y2: 150 },
        { type: 'wire', x1: 60, y1: 150, x2: 60, y2: 250 },
        { type: 'wire', x1: 260, y1: 150, x2: 260, y2: 250 },
        { type: 'wire', x1: 60, y1: 250, x2: 160, y2: 250 },
        { type: 'wire', x1: 160, y1: 250, x2: 260, y2: 250 },
        { type: 'battery', x1: 160, y1: 215, x2: 160, y2: 250, label: 'E', value: '10 V' },
        { type: 'junction', x: 160, y: 60 },
        { type: 'junction', x: 160, y: 250 },
        { type: 'junction', x: 60, y: 150 },
        { type: 'junction', x: 260, y: 150 },
        { type: 'label', x: 44, y: 175, text: 'B' },
        { type: 'label', x: 266, y: 175, text: 'D' },
        { type: 'label', x: 150, y: 50, text: 'A' },
        { type: 'label', x: 150, y: 266, text: 'C' },
        { type: 'arrow', x1: 100, y1: 60, x2: 140, y2: 60, label: 'I₁', color: 'var(--chart-2)' },
        { type: 'arrow', x1: 60, y1: 100, x2: 60, y2: 140, label: 'I₂', color: 'var(--chart-2)' },
        { type: 'label', x: 160, y: 288, text: 'P·S = Q·R = 24 ⇒ balanced ⇒ V_B = V_D ⇒ I_G = 0' },
      ],
    },
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `An infinite straight wire carries a current $I_1 = 10\\ \\text{A}$. A rectangular loop of dimensions $20\\ \\text{cm} \\times 10\\ \\text{cm}$ carrying a current $I_2 = 2\\ \\text{A}$ (its nearer long side running parallel to the wire, in the same direction) is placed with that side at a distance of $5\\ \\text{cm}$ from the wire. The magnitude of the net magnetic force on the loop is:`,
    options: ['$1.07 \\times 10^{-5}$ N, attractive', '$1.07 \\times 10^{-5}$ N, repulsive', '$2.1 \\times 10^{-5}$ N, attractive', '$3.2 \\times 10^{-6}$ N, attractive'],
    correctAnswer: 'A',
    solutionText: `The field of the wire weakens with distance, so the two long sides of the loop feel **different** forces; the short sides' contributions cancel by symmetry.

**Force between parallel currents** (per unit length) at separation $d$:
$$\\frac{F}{L} = \\frac{\\mu_0}{4\\pi}\\frac{2I_1I_2}{d} = 2\\times10^{-7}\\frac{I_1I_2}{d}$$

**Near side** ($d_1 = 0.05$ m, currents parallel → attracted towards the wire):
$$F_1 = 2\\times10^{-7}\\times\\frac{10 \\times 2}{0.05}\\times 0.20 = 2\\times10^{-7}\\times 400 \\times 0.20 = 1.6\\times10^{-5}\\ \\text{N}$$

**Far side** ($d_2 = 0.15$ m, currents antiparallel → repelled from the wire):
$$F_2 = 2\\times10^{-7}\\times\\frac{20}{0.15}\\times 0.20 = 5.33\\times10^{-6}\\ \\text{N}$$

**Net force** (attraction wins because the near side sits in a stronger field):
$$F = F_1 - F_2 = 1.6\\times10^{-5} - 0.53\\times10^{-5} \\approx 1.07\\times10^{-5}\\ \\text{N, towards the wire}$$

The loop is pulled *towards* the wire. (Forgetting the far side entirely gives the $2.1\\times10^{-5}$ distractor.)`,
    formulaConcept: 'Force between parallel currents: $F/L = \\frac{\\mu_0}{4\\pi}\\frac{2I_1I_2}{d}$; net force on a loop near a wire $= \\frac{\\mu_0 I_1I_2 L}{2\\pi}\\left(\\frac{1}{d_1}-\\frac{1}{d_2}\\right)$, always towards the wire.',
    difficulty: 'HARD', chapterSlug: 'magnetic-effects-of-current', topicSlug: 'force-on-moving-charges',
    sourceType: 'ORIGINAL', sourceNote: 'Classic wire–loop force with unequal sides.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `The magnetic flux through each turn of a 50-turn coil varies with time as $\\phi = (6t^2 - 4t + 1)$ weber. The magnitude of the induced EMF at $t = 2\\ \\text{s}$ is:`,
    options: ['20 V', '400 V', '16 V', '4 V'],
    correctAnswer: 'B',
    solutionText: `By Faraday's law, the induced EMF in an $N$-turn coil is
$$|\\varepsilon| = N\\left|\\frac{d\\phi}{dt}\\right|$$

**Differentiate the flux (per turn):**
$$\\frac{d\\phi}{dt} = \\frac{d}{dt}(6t^2 - 4t + 1) = 12t - 4$$

**At $t = 2$ s:**
$$\\frac{d\\phi}{dt} = 12(2) - 4 = 20\\ \\text{Wb/s per turn}$$

**Including all 50 turns:**
$$|\\varepsilon| = 50 \\times 20 = 400\\ \\text{V}$$

(20 V is the answer if the number of turns is missed — a classic oversight; 16 V uses $t=1$; 4 V is just the constant term.)`,
    formulaConcept: "Faraday's law: $|\\varepsilon| = N\\,|d\\phi/dt|$ — the turn count multiplies the per-turn EMF.",
    difficulty: 'MODERATE', chapterSlug: 'emi', topicSlug: 'faradays-law',
    sourceType: 'ORIGINAL', sourceNote: 'Flux-polynomial differentiation with turn-count trap.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `In the series LCR circuit shown, $R = 40\\ \\Omega$, $X_L = 100\\ \\Omega$ and $X_C = 70\\ \\Omega$. The power factor of the circuit, and the nature of the circuit, are:`,
    options: ['0.8, leading', '0.6, lagging', '0.6, leading', '0.8, lagging'],
    correctAnswer: 'D',
    solutionText: `**Net reactance:**
$$X = X_L - X_C = 100 - 70 = 30\\ \\Omega$$

**Impedance:**
$$Z = \\sqrt{R^2 + X^2} = \\sqrt{40^2 + 30^2} = \\sqrt{1600 + 900} = 50\\ \\Omega$$

**Power factor:**
$$\\cos\\phi = \\frac{R}{Z} = \\frac{40}{50} = 0.8$$

**Nature:** since $X_L > X_C$, the circuit is net **inductive** — the current **lags** the source voltage.

So the power factor is $0.8$ lagging. (A *leading* power factor would require $X_C > X_L$; $0.6$ results from mixing up $R$ and $X$ in the formula.)`,
    formulaConcept: 'Series LCR: $Z = \\sqrt{R^2 + (X_L - X_C)^2}$, $\\cos\\phi = R/Z$; $X_L > X_C \\Rightarrow$ lagging (inductive) behaviour.',
    difficulty: 'HARD', chapterSlug: 'alternating-current', topicSlug: 'lcr-circuits',
    sourceType: 'ORIGINAL', sourceNote: 'Power-factor + phase-nature combination.',
    diagram: {
      kind: 'circuit',
      components: [
        { type: 'wire', x1: 90, y1: 210, x2: 90, y2: 180 },
        { type: 'wire', x1: 90, y1: 90, x2: 90, y2: 40 },
        { type: 'wire', x1: 90, y1: 40, x2: 400, y2: 40 },
        { type: 'wire', x1: 400, y1: 40, x2: 400, y2: 210 },
        { type: 'wire', x1: 90, y1: 210, x2: 400, y2: 210 },
        { type: 'resistor', x1: 130, y1: 40, x2: 210, y2: 40, label: 'R', value: '40 Ω' },
        { type: 'inductor', x1: 250, y1: 40, x2: 330, y2: 40, label: 'X_L', value: '100 Ω' },
        { type: 'capacitor', x1: 400, y1: 100, x2: 400, y2: 160, label: 'X_C', value: '70 Ω' },
        { type: 'acsource', x1: 90, y1: 90, x2: 90, y2: 180, label: 'ac source' },
        { type: 'junction', x: 90, y: 40 },
        { type: 'junction', x: 400, y: 40 },
        { type: 'junction', x: 90, y: 210 },
        { type: 'junction', x: 400, y: 210 },
        { type: 'arrow', x1: 340, y1: 210, x2: 290, y2: 210, label: 'I (lags V)', color: 'var(--chart-2)' },
        { type: 'label', x: 245, y: 240, text: 'X_L > X_C ⇒ net inductive ⇒ current lags voltage' },
      ],
    },
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A convex lens of focal length $20\\ \\text{cm}$ is kept in contact with a concave lens of focal length $30\\ \\text{cm}$. The combination behaves as:`,
    options: ['a converging lens of focal length 60 cm', 'a diverging lens of focal length 60 cm', 'a converging lens of focal length 12 cm', 'a diverging lens of focal length 12 cm'],
    correctAnswer: 'A',
    solutionText: `For thin lenses in contact, the powers **add algebraically** (sign convention: converging $f > 0$, diverging $f < 0$):
$$\\frac{1}{F} = \\frac{1}{f_1} + \\frac{1}{f_2} = \\frac{1}{+20} + \\frac{1}{-30}$$

Compute:
$$\\frac{1}{F} = \\frac{3 - 2}{60} = \\frac{1}{60} \\implies F = +60\\ \\text{cm}$$

The equivalent focal length is **positive** — the combination is net **converging** — because the convex lens has the smaller focal length and hence the larger power ($+5$ D versus $-3.33$ D), and it equals $60$ cm.

(12 cm would be $\\frac{20\\times30}{20+30}$ — the formula for two *convex* lenses, ignoring the sign.)`,
    formulaConcept: 'Lenses in contact: $1/F = 1/f_1 + 1/f_2$ (with signs); powers in dioptres add.',
    difficulty: 'MODERATE', chapterSlug: 'ray-optics', topicSlug: 'refraction-lenses',
    sourceType: 'ORIGINAL', sourceNote: 'Lens-combination sign bookkeeping.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `Two coherent sources, each of intensity $I_0$, produce waves that arrive at a point with a phase difference of $\\pi/3$ (the second wave leads by $60^\\circ$, as shown). The resultant intensity at that point is:`,
    options: ['$2I_0$', '$4I_0$', '$3I_0$', '$I_0/2$'],
    correctAnswer: 'C',
    solutionText: `For two coherent waves of equal amplitude (equal intensity $I_0 \\propto a^2$) with phase difference $\\phi$, the resultant amplitude is
$$A_R = 2a\\cos\\frac{\\phi}{2}$$

so the resultant intensity is
$$I_R = 4I_0\\cos^2\\frac{\\phi}{2}$$

**With $\\phi = \\pi/3$:**
$$I_R = 4I_0\\cos^2\\left(\\frac{\\pi}{6}\\right) = 4I_0\\left(\\frac{\\sqrt{3}}{2}\\right)^2 = 4I_0\\times\\frac{3}{4} = 3I_0$$

The resultant intensity is $3I_0$. ($4I_0$ occurs only at $\\phi = 0$ — fully constructive; $I_0/2$ would correspond to $\\phi = 2\\pi/3$.)`,
    formulaConcept: 'Interference of equal intensities: $I_R = 4I_0\\cos^2(\\phi/2)$.',
    difficulty: 'HARD', chapterSlug: 'wave-optics', topicSlug: 'interference',
    sourceType: 'ORIGINAL', sourceNote: 'Phase-difference intensity from wave diagram.',
    diagram: {
      kind: 'wave',
      title: 'Two coherent waves, phase difference π/3 (60°)',
      waves: [
        { type: 'sine', amplitude: 1, cycles: 2, label: 'Wave 1', color: 'var(--gold)' },
        { type: 'sine', amplitude: 1, cycles: 2, phase: Math.PI / 3, label: 'Wave 2 (leads 60°)', color: 'var(--chart-2)', dashed: true },
        { type: 'sine', amplitude: 1.73, cycles: 2, phase: Math.PI / 6, label: 'Resultant: A_R = 2a cos 30° = √3 a', color: 'var(--chart-3)' },
      ],
      xAxis: { label: 'distance →' },
      yAxis: { label: 'displacement' },
    },
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `The stopping potential $V_s$ versus frequency $f$ of incident light on a metal surface is plotted from photoelectric data, as shown. The straight line passes through $f_0 = 5\\times10^{14}\\ \\text{Hz}$ on the frequency axis and through the point $(10^{15}\\ \\text{Hz},\\ 2\\ \\text{V})$. The work function of the metal is:`,
    options: ['1.03 eV', '2.07 eV', '4.14 eV', '3.10 eV'],
    correctAnswer: 'B',
    solutionText: `Einstein's photoelectric equation gives
$$eV_s = hf - \\phi \\quad\\Longleftrightarrow\\quad V_s = \\frac{h}{e}f - \\frac{\\phi}{e}$$

So the $V_s$–$f$ line has **slope $h/e$** and its **frequency-axis intercept** is the threshold frequency $f_0$ (where $V_s = 0$):
$$\\phi = hf_0$$

**Compute the work function:**
$$\\phi = 6.63\\times10^{-34} \\times 5\\times10^{14} = 3.315\\times10^{-19}\\ \\text{J}$$

Convert to eV:
$$\\phi = \\frac{3.315\\times10^{-19}}{1.602\\times10^{-19}} \\approx 2.07\\ \\text{eV}$$

*Consistency check from the slope:* between $f_0 = 5\\times10^{14}$ Hz and $10^{15}$ Hz, $V_s$ rises by 2 V, so $h/e \\approx 2/(5\\times10^{14}) = 4\\times10^{-15}$ V·s, i.e. $h \\approx 6.4\\times10^{-34}$ J·s ✓ consistent.

(4.14 eV is $hf$ at $10^{15}$ Hz — that's the photon energy there, not the work function.)`,
    formulaConcept: '$eV_s = hf - \\phi$: x-intercept $f_0 = \\phi/h$, slope $= h/e$.',
    difficulty: 'HARD', chapterSlug: 'dual-nature', topicSlug: 'photoelectric-effect',
    sourceType: 'ORIGINAL', sourceNote: 'Graph-based work-function extraction.',
    diagram: {
      kind: 'graph',
      title: 'Photoelectric: stopping potential vs frequency',
      showGrid: true,
      xAxis: { label: 'f (×10¹⁴ Hz)', min: 0, max: 12, ticks: [0, 2, 4, 5, 6, 8, 10, 12] },
      yAxis: { label: 'Vₛ (V)', min: 0, max: 4, ticks: [0, 1, 2, 3, 4] },
      curves: [
        { type: 'line', color: 'var(--gold)', label: 'Vₛ = (h/e)f − φ/e', points: [[5, 0], [6, 0.4], [7, 0.8], [8, 1.2], [9, 1.6], [10, 2], [11, 2.4], [11.6, 2.64]] },
      ],
      markers: [
        { x: 5, y: 0, label: 'f₀ = 5×10¹⁴ Hz (threshold)', color: 'var(--chart-3)' },
        { x: 10, y: 2, label: '(10, 2)' },
      ],
      shadedRegions: [
        { points: [[5, 0], [10, 0], [10, 2]], color: 'var(--chart-5)', label: 'slope = h/e' },
      ],
    },
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A Zener diode with breakdown voltage $V_Z = 5\\ \\text{V}$ is connected to regulate the voltage across a $1\\ \\text{k}\\Omega$ load. The supply is $10\\ \\text{V}$ in series with a $500\\ \\Omega$ resistor. In the regulating condition, the current through the Zener diode is:`,
    options: ['5 mA', '10 mA', '15 mA', '0 mA'],
    correctAnswer: 'A',
    solutionText: `In the regulating condition the Zener holds the load voltage at $V_Z = 5$ V.

**Current through the series resistor** (carries the total supply current):
$$I = \\frac{V_{\\text{supply}} - V_Z}{R_s} = \\frac{10 - 5}{500} = 10\\ \\text{mA}$$

**Load current:**
$$I_L = \\frac{V_Z}{R_L} = \\frac{5}{1000} = 5\\ \\text{mA}$$

**Zener current** (KCL: the series current splits between the load and the Zener):
$$I_Z = I - I_L = 10 - 5 = 5\\ \\text{mA}$$

The Zener dissipates $V_ZI_Z = 25$ mW. As long as $I_Z > 0$ (i.e. load current below 10 mA), the output stays regulated at 5 V. (0 mA would mean regulation is lost — the load alone draws the full 10 mA.)`,
    formulaConcept: 'Zener regulator: $I_Z = \\dfrac{V_s - V_Z}{R_s} - \\dfrac{V_Z}{R_L}$ (KCL at the Zener–load node).',
    difficulty: 'MODERATE', chapterSlug: 'semiconductors', topicSlug: 'diode-circuits',
    sourceType: 'ORIGINAL', sourceNote: 'Zener regulator KCL computation.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `In a hydrogen atom, an electron makes a transition from the level $n = 4$ to the level $n = 2$. The wavelength of the emitted photon is closest to:`,
    options: ['656 nm', '121 nm', '1875 nm', '486 nm'],
    correctAnswer: 'D',
    solutionText: `For the hydrogen atom,
$$\\frac{1}{\\lambda} = R\\left(\\frac{1}{n_1^2} - \\frac{1}{n_2^2}\\right), \\qquad R = 1.097\\times10^{7}\\ \\text{m}^{-1}$$

**For $n_2 = 4 \\to n_1 = 2$ (Balmer series):**
$$\\frac{1}{\\lambda} = 1.097\\times10^{7}\\left(\\frac{1}{4} - \\frac{1}{16}\\right) = 1.097\\times10^{7} \\times \\frac{4-1}{16} = 1.097\\times10^{7}\\times\\frac{3}{16}$$
$$\\frac{1}{\\lambda} = 2.057\\times10^{6}\\ \\text{m}^{-1} \\implies \\lambda = \\frac{1}{2.057\\times10^{6}} \\approx 4.86\\times10^{-7}\\ \\text{m} = 486\\ \\text{nm}$$

This is the $H_\\beta$ line of the Balmer series (blue-green).

**Why the others are wrong:** 656 nm is $3\\to2$ ($H_\\alpha$); 121 nm is $2\\to1$ (Lyman $\\alpha$, UV); 1875 nm is $4\\to3$ (Paschen line, IR).`,
    formulaConcept: 'Rydberg formula: $1/\\lambda = R(1/n_1^2 - 1/n_2^2)$; Balmer lines end at $n_1 = 2$.',
    difficulty: 'MODERATE', chapterSlug: 'atoms', topicSlug: 'bohr-model',
    sourceType: 'ORIGINAL', sourceNote: 'Balmer Hβ identification among named spectral lines.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `If force ($F$), velocity ($v$) and time ($T$) are chosen as the fundamental quantities, the dimensions of energy are:`,
    options: ['$[F\\,v\\,T^{-1}]$', '$[F\\,v\\,T]$', '$[F\\,v^{2}\\,T]$', '$[F\\,v^{-1}\\,T]$'],
    correctAnswer: 'B',
    solutionText: `We need energy expressed in the new base $\{F, v, T\}$.

**Dimensions of the base choices:**
$$[F] = MLT^{-2}, \\qquad [v] = LT^{-1}, \\qquad [T] = T$$

**Target:** $[\\text{energy}] = ML^2T^{-2}$.

**Try $[F\\,v\\,T]$:**
$$MLT^{-2} \\times LT^{-1} \\times T = ML^2T^{-2}\\ \\checkmark$$

Exact match. The physical reason: energy $=$ force $\\times$ displacement, and displacement has dimensions $v\\cdot T$:
$$E \\sim F\\,(vT) \\implies [E] = [F\\,v\\,T]$$

(The other options give $ML^2T^{-4}$, $ML^3T^{-4}$ and $MT^{-1}$ respectively.)`,
    formulaConcept: 'Dimensional analysis with a redefined base: $E = F\\cdot s$ and $[s] = [vT]$.',
    difficulty: 'MODERATE', chapterSlug: 'units-and-measurements', topicSlug: 'dimensional-analysis',
    sourceType: 'ORIGINAL', sourceNote: 'Redefinition of base quantities question.',
  },
  {
    subject: 'PHYSICS', section: 'A',
    text: `A spherical metal ball of radius $r$ and density $\\rho$ falls through a liquid of density $\\sigma$ ($\\sigma < \\rho$) and attains a terminal velocity $v$. Another ball of the same material but radius $2r$ falling in the same liquid attains a terminal velocity of:`,
    options: ['$2v$', '$8v$', '$4v$', '$v/4$'],
    correctAnswer: 'C',
    solutionText: `At **terminal velocity** the net force is zero — weight $=$ buoyancy $+$ viscous drag (Stokes):
$$\\frac{4}{3}\\pi r^3\\rho g = \\frac{4}{3}\\pi r^3\\sigma g + 6\\pi\\eta r v_t$$

Solving:
$$v_t = \\frac{2r^2(\\rho - \\sigma)g}{9\\eta}$$

**For balls of the same material in the same liquid**, $\\rho$, $\\sigma$, $\\eta$, $g$ are all fixed, so
$$v_t \\propto r^2$$

Doubling the radius:
$$v_t' = (2)^2 v = 4v$$

($8v$ would come from wrongly scaling with $r^3$ — that is how the *weight* scales, not the terminal velocity; $2v$ uses $r^1$.)`,
    formulaConcept: "Stokes terminal velocity: $v_t = \\dfrac{2r^2(\\rho-\\sigma)g}{9\\eta} \\propto r^2$ for fixed materials.",
    difficulty: 'MODERATE', chapterSlug: 'properties-of-solids-and-fluids', topicSlug: 'viscosity',
    sourceType: 'ORIGINAL', sourceNote: 'Terminal-velocity scaling with radius.',
  },
  // ---------------- SECTION B (numerical) Q21–Q25 ----------------
  {
    subject: 'PHYSICS', section: 'B',
    text: `A radioactive nuclide has a half-life of $10$ days. What percentage of the initial sample decays in $30$ days? (Round off to one decimal place.)`,
    correctAnswer: '87.5',
    solutionText: `The number of undecayed nuclei after time $t$ is
$$N = N_0\\left(\\frac{1}{2}\\right)^{t/T_{1/2}}$$

Here $t = 30$ days and $T_{1/2} = 10$ days — i.e. **three half-lives**:
$$N = N_0\\left(\\frac{1}{2}\\right)^3 = \\frac{N_0}{8}$$

**Fraction remaining** $= 1/8 = 0.125$, so the **fraction decayed** is
$$1 - \\frac{1}{8} = \\frac{7}{8} = 0.875$$

**Percentage decayed** $= 87.5\\%$.

*Shortcut:* after $n$ half-lives, remaining $= 100/2^n\\ \\%$ and decayed $= 100(1 - 2^{-n})\\%$.`,
    formulaConcept: '$N/N_0 = (1/2)^{t/T_{1/2}}$; percentage decayed $= 100\\left(1 - 2^{-t/T_{1/2}}\\right)$.',
    difficulty: 'EASY', chapterSlug: 'nuclei', topicSlug: 'radioactivity',
    sourceType: 'ORIGINAL', sourceNote: 'Half-life counting question.',
  },
  {
    subject: 'PHYSICS', section: 'B',
    text: `One mole of an ideal monatomic gas at $300\\ \\text{K}$ expands adiabatically and reversibly until its temperature falls to $200\\ \\text{K}$. The work done **by** the gas is closest to: (in J; $R = 8.314\\ \\text{J mol}^{-1}\\text{K}^{-1}$; round off to one decimal place)`,
    correctAnswer: '1247.1',
    solutionText: `For an adiabatic process, $Q = 0$, so the first law of thermodynamics gives
$$\\Delta U = -W_{\\text{by gas}} \\implies W_{\\text{by gas}} = -\\Delta U$$

For an ideal monatomic gas,
$$\\Delta U = n C_V \\Delta T = n\\left(\\frac{3}{2}R\\right)(T_f - T_i)$$

**Substituting** $n = 1$, $T_i = 300$ K, $T_f = 200$ K:
$$\\Delta U = 1 \\times \\frac{3}{2}(8.314)(200 - 300) = 12.471 \\times (-100) = -1247.1\\ \\text{J}$$

**Hence**
$$W_{\\text{by gas}} = -\\Delta U = +1247.1\\ \\text{J}$$

The gas does $\\approx 1247.1$ J of work on the surroundings, drawing this energy from its internal store (hence the temperature drop). Note that the work depends only on the end temperatures here — no need for the full $PV^\\gamma$ integration.`,
    formulaConcept: 'Adiabatic (reversible): $W_{\\text{by}} = -\\Delta U = -nC_V\\Delta T$; monatomic $C_V = \\tfrac{3}{2}R$.',
    difficulty: 'HARD', chapterSlug: 'thermodynamics', topicSlug: 'thermodynamic-processes',
    sourceType: 'ORIGINAL', sourceNote: 'Adiabatic work from internal-energy change.',
  },
  {
    subject: 'PHYSICS', section: 'B',
    text: `A ball is thrown vertically upward with a speed of $20\\ \\text{m/s}$ from the top of a tower of height $25\\ \\text{m}$. Taking $g = 10\\ \\text{m/s}^2$, the speed of the ball just before it strikes the ground at the base of the tower is: (in m/s)`,
    correctAnswer: '30',
    solutionText: `Take upward positive, origin at the ground. Then $y_0 = +25$ m, $u = +20$ m/s, and at impact $y = 0$, so the displacement is $s = -25$ m with $a = -g = -10\\ \\text{m/s}^2$.

Using $v^2 = u^2 + 2as$:
$$v^2 = 20^2 + 2(-10)(-25) = 400 + 500 = 900 \\implies |v| = 30\\ \\text{m/s}$$

**Energy check:** $\\tfrac{1}{2}mv^2 = \\tfrac{1}{2}mu^2 + mgh$ with $h = 25$ m below the launch point:
$$v^2 = u^2 + 2gh = 400 + 2(10)(25) = 900\\ \\checkmark$$

The ball strikes the ground with speed $30$ m/s (directed downward). The speed exceeds the launch speed because the ball lands $25$ m *below* its starting point.`,
    formulaConcept: '$v^2 = u^2 + 2as$, or energy conservation: $v^2 = u^2 + 2gh$ when landing a vertical distance $h$ below the launch point.',
    difficulty: 'EASY', chapterSlug: 'kinematics', topicSlug: 'motion-in-a-straight-line',
    sourceType: 'ORIGINAL', sourceNote: 'Tower projectile via kinematics/energy.',
  },
  {
    subject: 'PHYSICS', section: 'B',
    text: `Three point charges of $10\\ \\mu\\text{C}$ each are placed at the three corners of an equilateral triangle of side $2\\ \\text{m}$. The electrostatic potential energy of the system is: (in J; $k = 9\\times10^{9}\\ \\text{N m}^2\\text{C}^{-2}$; round off to two decimal places)`,
    correctAnswer: '1.35',
    solutionText: `The energy of a system of point charges is the sum over all **unordered pairs**:
$$U = \\sum_{i<j} \\frac{k q_i q_j}{r_{ij}}$$

An equilateral triangle has three identical pairs, each with $q_i = q_j = 10\\ \\mu\\text{C} = 10^{-5}$ C at separation $r = 2$ m:
$$U_{\\text{pair}} = \\frac{(9\\times10^{9})(10^{-5})(10^{-5})}{2} = \\frac{9\\times10^{-1}}{2} = 0.45\\ \\text{J}$$

**Total:**
$$U = 3 \\times 0.45 = 1.35\\ \\text{J}$$

*(Count only unordered pairs — multiplying by 6 ordered pairs would double-count; multiplying by 3 only once more would miss the pair structure.)*`,
    formulaConcept: 'System PE of point charges: $U = k\\sum_{i<j} q_iq_j/r_{ij}$; equilateral triangle → 3 equal pairs.',
    difficulty: 'MODERATE', chapterSlug: 'electrostatics', topicSlug: 'electric-potential',
    sourceType: 'ORIGINAL', sourceNote: 'Pairwise energy summation.',
  },
  {
    subject: 'PHYSICS', section: 'B',
    text: `A uniform disc of mass $2\\ \\text{kg}$ and radius $0.5\\ \\text{m}$ rotates about its central symmetry axis with an angular velocity of $120\\ \\text{rad/s}$. The magnitude of its angular momentum about that axis is: (in $\\text{kg m}^2\\,\\text{s}^{-1}$)`,
    correctAnswer: '30',
    solutionText: `The moment of inertia of a uniform disc about its central axis:
$$I = \\frac{1}{2}MR^2 = \\frac{1}{2}(2)(0.5)^2 = 0.25\\ \\text{kg m}^2$$

**Angular momentum about the same axis:**
$$L = I\\omega = 0.25 \\times 120 = 30\\ \\text{kg m}^2\\text{/s}$$

The rotation axis must coincide with the axis used for $I$ — here both are the symmetry axis, so $L = I\\omega$ applies directly. (Using $I = MR^2$ would give $60$ — that is for a ring, not a disc.)`,
    formulaConcept: '$L = I\\omega$ about the fixed symmetry axis; disc: $I = \\tfrac{1}{2}MR^2$.',
    difficulty: 'MODERATE', chapterSlug: 'rotational-motion', topicSlug: 'angular-momentum',
    sourceType: 'ORIGINAL', sourceNote: 'Direct angular-momentum computation.',
  },
]
