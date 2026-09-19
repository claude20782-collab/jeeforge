import type { SeedQuestion } from '@/content/types'

// ============================================================================
// MOCK 03 — MATHEMATICS (Q51–Q75: 20 MCQ Section A + 5 numerical Section B)
// Difficulty target: Hard JEE Main. Every calculation hand-verified.
// ============================================================================

export const MATHEMATICS_MOCK03: SeedQuestion[] = [
  // ---------------- SECTION A (MCQ) Q51–Q70 ----------------
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The number of one-one functions from a set containing 3 elements to a set containing 5 elements is:`,
    options: ['60', '120', '240', '125'],
    correctAnswer: 'A',
    solutionText: `A one-one (injective) function must send the 3 domain elements to **3 distinct** elements of the 5-element codomain. Count in order:
- first element: 5 choices
- second element: 4 remaining choices (cannot repeat)
- third element: 3 remaining choices

$$n = 5 \\times 4 \\times 3 = {}^5P_3 = 60$$

(For contrast: total functions = $5^3 = 125$; onto functions would be fewer still.)

**Why the others are wrong:** (B) 120 = ⁵P₄ (four injective images); (C) 240 = 2×120; (D) 125 counts *all* functions, ignoring injectivity.`,
    formulaConcept: 'Injections $A \\to B$ = ${}^{|B|}P_{|A|}$ — distinct images chosen in order.',
    difficulty: 'MODERATE', chapterSlug: 'sets-relations-functions', topicSlug: 'functions',
    sourceType: 'ORIGINAL', sourceNote: 'Injection counting.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `If $z = x + iy$ satisfies $|z - 1| = |z + i|$, the locus of $z$ in the Argand plane is:`,
    options: ['x + y = 1', 'x − y = 0', 'x = −y + 2', 'x + y = 0'],
    correctAnswer: 'D',
    solutionText: `Interpret geometrically: $z$ is equidistant from the point $1 = (1, 0)$ and the point $-i = (0, -1)$. The locus of points equidistant from two fixed points is the **perpendicular bisector** of the segment joining them.

**Algebraic confirmation** — square both sides:
$$|z-1|^2 = |z+i|^2$$
$$(x-1)^2 + y^2 = x^2 + (y+1)^2$$
$$x^2 - 2x + 1 + y^2 = x^2 + y^2 + 2y + 1$$
$$-2x = 2y \\implies \\boxed{x + y = 0}$$

This line passes through the midpoint $\\left(\\tfrac12, -\\tfrac12\\right)$ perpendicular to the segment — exactly the bisector.

**Why the others are wrong:** (A) x + y = 1 misses the midpoint; (B) x − y = 0 is the bisector for points like $1$ and $i$; (C) is a generic parallel line.`,
    formulaConcept: '$|z - a| = |z - b|$ ⟹ perpendicular bisector of segment $ab$ in the Argand plane.',
    difficulty: 'MODERATE', chapterSlug: 'complex-numbers', topicSlug: 'argand-plane',
    sourceType: 'ORIGINAL', sourceNote: 'Locus via perpendicular-bisector geometry.',
    diagram: {
      kind: 'geometry',
      xRange: [-3, 4],
      yRange: [-3, 3],
      elements: [
        { type: 'point', x: 1, y: 0, label: 'A = 1', labelPos: 'NE' },
        { type: 'point', x: 0, y: -1, label: 'B = −i', labelPos: 'SE' },
        { type: 'segment', from: [1, 0], to: [0, -1], color: 'var(--chart-3)', dashed: true },
        { type: 'line', from: [-2.5, 2.5], to: [2.5, -2.5], color: 'var(--gold)' },
        { type: 'point', x: 0.5, y: -0.5, label: 'M (½, −½)', labelPos: 'W' },
        { type: 'point', x: 1, y: -1, label: 'z = 1 − i ✓', labelPos: 'SE' },
        { type: 'segment', from: [1, -1], to: [1, 0], label: 'd = 1', color: 'var(--chart-2)', dashed: true },
        { type: 'segment', from: [1, -1], to: [0, -1], label: 'd = 1', color: 'var(--chart-2)', dashed: true },
        { type: 'angleArc', at: [0.5, -0.5], fromDeg: -45, toDeg: -135, r: 0.4, label: '90°' },
        { type: 'label', x: 2.6, y: -2.15, text: 'locus: x + y = 0', color: 'var(--gold)' },
        { type: 'label', x: -1.9, y: 2.2, text: 'perpendicular bisector of AB', color: 'var(--gold)' },
      ],
      square: true,
      showGrid: true,
      title: '|z − 1| = |z + i|',
    },
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `If the equations $x^2 + bx + c = 0$ and $x^2 + cx + b = 0$ ($b \\neq c$) have exactly one common root, then:`,
    options: ['b + c = −1', 'b − c = 1', 'bc = 1', 'b + c = 0'],
    correctAnswer: 'A',
    solutionText: `Let $\\alpha$ be the common root. Substituting into both equations and **subtracting**:
$$\\alpha^2 + b\\alpha + c - (\\alpha^2 + c\\alpha + b) = 0$$
$$(b - c)\\alpha + (c - b) = 0 \\implies (b-c)(\\alpha - 1) = 0$$

Since $b \\neq c$:
$$\\alpha = 1$$

**Substitute $x = 1$ into either equation:**
$$1 + b + c = 0 \\implies \\boxed{b + c = -1}$$

So the common root is always $1$ whenever both equations share a root (and $b \\ne c$).

**Why the others are wrong:** (B)/(D) mis-manipulate the difference; (C) bc = 1 would make 1 a root of a *product* structure, not the given pair.`,
    formulaConcept: 'Common-root questions: subtract the two equations — the quadratic terms cancel and force the shared root out.',
    difficulty: 'HARD', chapterSlug: 'quadratic-equations', topicSlug: 'common-roots-conditions',
    sourceType: 'ORIGINAL', sourceNote: 'Subtract-the-equations trick.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `An infinite geometric series has first term $3$ and sum $4$. The common ratio is:`,
    options: ['1/2', '1/3', '1/4', '3/4'],
    correctAnswer: 'C',
    solutionText: `For an infinite GP with $|r| < 1$:
$$S_\\infty = \\frac{a}{1-r}$$

**Substituting** $S_\\infty = 4$, $a = 3$:
$$4 = \\frac{3}{1-r} \\implies 4(1-r) = 3 \\implies 1 - r = \\frac34 \\implies r = \\frac14$$

**Check:** $3 + 0.75 + 0.1875 + \\dots = \\dfrac{3}{1 - 0.25} = \\dfrac{3}{0.75} = 4$ ✓

**Why the others are wrong:** (A) 1/2 gives sum 6; (B) 1/3 gives 4.5; (D) 3/4 gives 12 — each fails the sum check instantly.`,
    formulaConcept: 'Infinite GP: $S_\\infty = a/(1-r)$ — invert it to recover $r$ from the sum.',
    difficulty: 'MODERATE', chapterSlug: 'sequences-and-series', topicSlug: 'geometric-progression',
    sourceType: 'ORIGINAL', sourceNote: 'Infinite-GP back-solve with check.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `Five distinct prizes are to be distributed among four students so that **each student gets at least one** prize. The number of ways is:`,
    options: ['1024', '120', '480', '240'],
    correctAnswer: 'D',
    solutionText: `Each prize can go to any of 4 students, but every student must receive at least one. Use **inclusion–exclusion** on the students left empty:

$$N = 4^5 - \\binom41 3^5 + \\binom42 2^5 - \\binom43 1^5$$

**Compute each term:**
- Total assignments: $4^5 = 1024$
- Fix one specific student empty: $3^5 = 243$; choose which student: $\\binom41 = 4$ → subtract $972$
- Two specific students empty: $2^5 = 32$; choose them: $\\binom42 = 6$ → add back $192$
- Three empty: $1^5 = 1$; choose: 4 → subtract 4

$$N = 1024 - 972 + 192 - 4 = 240$$

**Why the others are wrong:** (A) 1024 is all assignments (some students empty-handed); (B) 120 = 5! (bijective thinking — but 5 prizes cannot map one-to-one onto 4 students); (C) 480 doubles the answer.`,
    formulaConcept: 'Onto functions $n$ distinct objects → $r$ boxes: $\\sum (-1)^k\\binom{r}{k}(r-k)^n$.',
    difficulty: 'VERY_HARD', chapterSlug: 'permutations-combinations', topicSlug: 'distributions',
    sourceType: 'ORIGINAL', sourceNote: 'Inclusion-exclusion distribution of distinct objects.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The middle term in the binomial expansion of $(1 + x)^{10}$ is:`,
    options: ['210 x⁵', '252 x⁵', '120 x⁵', '126 x⁵'],
    correctAnswer: 'B',
    solutionText: `$(1+x)^{10}$ has $11$ terms ($T_1$ through $T_{11}$), so the single middle term is the **6th term**:
$$T_{k+1} = \\binom{10}{k}x^{k}, \\qquad k = 5$$

**Middle term:**
$$T_6 = \\binom{10}{5}x^5 = 252x^5$$

**Why the others are wrong:** (A) 210 = $\\binom{10}{4}$ (the 5th term — off by one position); (C) 120 = $\\binom{10}{3}$; (D) 126 = $\\binom{9}{4}$ (wrong row of Pascal's triangle).`,
    formulaConcept: 'Even index $2n$ → single middle term $T_{n+1} = \\binom{2n}{n}x^n$.',
    difficulty: 'MODERATE', chapterSlug: 'binomial-theorem', topicSlug: 'general-middle-terms',
    sourceType: 'ORIGINAL', sourceNote: 'Middle-term identification.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `If $A = \\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}$, then $A^{64}$ equals:`,
    options: ['−I', '0', 'I', 'None of these'],
    correctAnswer: 'C',
    solutionText: `Recognise $A$ as the **90° rotation matrix**. Squaring rotates by 180°:
$$A^2 = \\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}\\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix} = \\begin{pmatrix} -1 & 0 \\\\ 0 & -1 \\end{pmatrix} = -I$$

**Powers cycle with period 4:**
$$A^{64} = (A^2)^{32} = (-I)^{32} = I$$
(since any even power of $-I$ is $+I$; $32$ is even).

**Why the others are wrong:** (A) $-I = A^2$ itself; (B) $A$ is invertible ($\\det A = 1$), so no power can be the zero matrix; (D) — the cycle $I, A, -I, -A$ repeats, and $64 \\equiv 0 \\pmod 4$ lands exactly on $I$.`,
    formulaConcept: 'Rotation matrices satisfy $A^4 = I$ — powers cycle with period 4; reduce the exponent mod 4.',
    difficulty: 'HARD', chapterSlug: 'matrices-determinants', topicSlug: 'matrix-algebra',
    sourceType: 'ORIGINAL', sourceNote: 'Rotation-matrix power cycle.',
    diagram: {
      kind: 'table',
      headers: ['Power', 'Rotation by', 'Result', 'Note'],
      rows: [
        ['A⁰', '0°', 'I', 'identity'],
        ['A¹', '90°', 'A', ''],
        ['A²', '180°', '−I', 'half turn'],
        ['A³', '270°', '−A', ''],
        ['A⁴', '360°', 'I', 'cycle repeats — period 4'],
        ['A⁶⁴', '64 ≡ 0 (mod 4)', 'I', '(A⁴)¹⁶ = I'],
      ],
      caption: 'A = 90° rotation matrix: powers cycle with period 4 — reduce the exponent mod 4',
      highlightCells: [[5, 2], [4, 2]],
    },
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The function $f(x) = \\begin{cases} \\dfrac{1 - \\cos 4x}{x^2}, & x \\neq 0 \\\\ k, & x = 0 \\end{cases}$ is continuous at $x = 0$. The value of $k$ is:`,
    options: ['2', '4', '8', '16'],
    correctAnswer: 'C',
    solutionText: `Continuity at 0 requires $k = \\lim_{x \\to 0}\\dfrac{1-\\cos 4x}{x^2}$.

**Use the double-angle identity** $1 - \\cos 4x = 2\\sin^2 2x$:
$$\\lim_{x \\to 0}\\frac{2\\sin^2 2x}{x^2} = 2\\lim_{x\\to0}\\left(\\frac{\\sin 2x}{x}\\right)^{\\!2} = 2\\left(\\lim_{x\\to0}\\frac{2\\sin 2x}{2x}\\right)^{\\!2} = 2\\times 4 = 8$$

So $\\boxed{k = 8}$.

**Why the others are wrong:** (A) 2 forgets one factor of 2; (B) 4 takes only the inner squaring; (D) 16 squares the coefficient twice. Each is a plausible slip in this standard chain.`,
    formulaConcept: '$1 - \\cos\\theta = 2\\sin^2(\\theta/2)$ converts cos-limits to the $\\sin u/u$ standard form.',
    difficulty: 'HARD', chapterSlug: 'limits-continuity', topicSlug: 'continuity-differentiability',
    sourceType: 'ORIGINAL', sourceNote: 'Continuity parameter via standard limits with graph.',
    diagram: {
      kind: 'graph',
      title: 'y = (1 − cos 4x)/x² — hole at x = 0',
      xAxis: { label: 'x', min: -0.6, max: 0.6, ticks: [-0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6] },
      yAxis: { label: 'y', min: 4, max: 9, ticks: [4, 5, 6, 7, 8, 9] },
      showGrid: true,
      square: false,
      curves: [
        {
          type: 'curve', color: 'var(--gold)', label: 'f(x)',
          points: [[-0.6, 4.83], [-0.55, 5.25], [-0.5, 5.66], [-0.45, 6.06], [-0.4, 6.43], [-0.35, 6.78], [-0.3, 7.09], [-0.25, 7.35], [-0.2, 7.58], [-0.15, 7.76], [-0.1, 7.89], [-0.05, 7.97], [0.05, 7.97], [0.1, 7.89], [0.15, 7.76], [0.2, 7.58], [0.25, 7.35], [0.3, 7.09], [0.35, 6.78], [0.4, 6.43], [0.45, 6.06], [0.5, 5.66], [0.55, 5.25], [0.6, 4.83]],
        },
        { type: 'line', color: 'var(--chart-2)', dashed: true, label: 'y = 8', points: [[-0.6, 8], [0.6, 8]] },
      ],
      markers: [
        { x: 0, y: 8, label: 'k = 8 fills the hole', color: 'var(--chart-2)' },
      ],
    },
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The points on the curve $y = x^3 - 3x + 4$ at which the tangent is parallel to the $x$-axis are:`,
    options: ['(1, 2) and (−1, 6)', '(1, 6) and (−1, 2)', '(0, 4) and (2, 6)', '(1, 2) and (1, −2)'],
    correctAnswer: 'A',
    solutionText: `A horizontal tangent needs:
$$\\frac{dy}{dx} = 3x^2 - 3 = 0 \\implies x = \\pm 1$$

**Evaluate the curve at each:**
$$y(1) = 1 - 3 + 4 = 2, \\qquad y(-1) = -1 + 3 + 4 = 6$$

**Tangent points:** $(1, 2)$ and $(-1, 6)$ — the local minimum and maximum of the cubic respectively.

**Why the others are wrong:** (B) swaps the y-values; (C) picks convenient-looking points not on the horizontal-tangent list; (D) repeats the same x (impossible — the two stationary points differ in sign of $x$).`,
    formulaConcept: `Horizontal tangent ⟺ $f'(x) = 0$; always evaluate $f$ at the critical points to get the pair.`,
    difficulty: 'MODERATE', chapterSlug: 'application-of-derivatives', topicSlug: 'tangents-normals',
    sourceType: 'ORIGINAL', sourceNote: 'Stationary points of a cubic with sketch.',
    diagram: {
      kind: 'graph',
      title: 'y = x³ − 3x + 4',
      xAxis: { label: 'x', min: -2.5, max: 2.5, ticks: [-2, -1, 0, 1, 2] },
      yAxis: { label: 'y', min: -6, max: 13, ticks: [-4, -2, 0, 2, 4, 6, 8, 10, 12] },
      showGrid: true,
      square: false,
      curves: [
        {
          type: 'curve', color: 'var(--gold)', label: 'f(x)',
          points: [[-2.5, -4.13], [-2.25, -0.64], [-2, 2], [-1.75, 3.89], [-1.5, 5.13], [-1.25, 5.8], [-1, 6], [-0.75, 5.83], [-0.5, 5.38], [-0.25, 4.73], [0, 4], [0.25, 3.27], [0.5, 2.63], [0.75, 2.17], [1, 2], [1.25, 2.2], [1.5, 2.88], [1.75, 4.11], [2, 6], [2.25, 8.64], [2.5, 12.13]],
        },
        { type: 'line', color: 'var(--chart-5)', dashed: true, label: 'y = 6', points: [[-1.9, 6], [0.1, 6]] },
        { type: 'line', color: 'var(--chart-5)', dashed: true, label: 'y = 2', points: [[-0.2, 2], [1.8, 2]] },
      ],
      markers: [
        { x: 1, y: 2, label: 'local min (1, 2)' },
        { x: -1, y: 6, label: 'local max (−1, 6)' },
        { x: 0, y: 4, label: 'inflection (0, 4)', color: 'var(--chart-3)' },
      ],
    },
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `$\\displaystyle\\int \\frac{dx}{x^2 + 4}$ equals:`,
    options: ['tan⁻¹(x/2)', '(1/4) tan⁻¹(x/4)', '(1/2) tan⁻¹(2x)', '(1/2) tan⁻¹(x/2) + C'],
    correctAnswer: 'D',
    solutionText: `Standard form $\\displaystyle\\int\\frac{dx}{x^2 + a^2} = \\frac1a\\tan^{-1}\\frac{x}{a} + C$ with $a^2 = 4$, so $a = 2$:
$$\\int\\frac{dx}{x^2 + 4} = \\frac12\\tan^{-1}\\frac{x}{2} + C$$

**Verify by differentiating** the answer:
$$\\frac{d}{dx}\left[\\tfrac12\\tan^{-1}\\tfrac{x}{2}\right] = \\tfrac12 \\cdot \\frac{1/2}{1 + x^2/4} = \\frac{1}{4 + x^2} \checkmark$$

**Why the others are wrong:** (A) misses the outer $1/2$; (B) uses $a = 4$ (that would fit $x^2 + 16$); (C) inverts the argument — differentiating it gives $\\tfrac{1}{1+4x^2}$, not $\\tfrac{1}{x^2+4}$.`,
    formulaConcept: '$\\int dx/(x^2+a^2) = \\tfrac1a\\tan^{-1}(x/a) + C$ — the factor and the argument both carry $a$; confirm by differentiation.',
    difficulty: 'MODERATE', chapterSlug: 'integral-calculus', topicSlug: 'indefinite-integration',
    sourceType: 'ORIGINAL', sourceNote: 'Standard arctan form with differentiate-back check.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The order and degree of the differential equation $\\left(\\dfrac{d^2y}{dx^2}\\right)^3 + \\left(\\dfrac{dy}{dx}\\right)^5 + y = 7$ are respectively:`,
    options: ['3, 2', '2, 3', '2, 2', '3, 3'],
    correctAnswer: 'B',
    solutionText: `**Order** = highest derivative present = 2 (from $\\dfrac{d^2y}{dx^2}$).

**Degree** = power of the highest-order derivative (after clearing radicals/fractions in derivatives) = 3 (the second derivative is cubed).

$$\\text{order} = 2, \\quad \\text{degree} = 3$$

**Why the others are wrong:** (A) swaps them; (C) reads the *coefficient pattern* wrongly; (D) inflates both. The $\\left(\\dfrac{dy}{dx}\\right)^5$ is a decoy — degree cares only about the **highest-order** derivative's power.`,
    formulaConcept: 'Order = highest derivative; degree = its power — lower-order terms never matter.',
    difficulty: 'MODERATE', chapterSlug: 'differential-equations', topicSlug: 'order-degree',
    sourceType: 'ORIGINAL', sourceNote: 'Order-degree identification with decoy.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `A line with positive intercepts passes through $(2, 3)$ and makes equal intercepts on the axes. Its equation is:`,
    options: ['x + y = 5', 'x − y = 5', 'x + y = 1', '3x + 2y = 12'],
    correctAnswer: 'A',
    solutionText: `Equal intercepts $a = b$ means the intercept form collapses:
$$\\frac{x}{a} + \\frac{y}{a} = 1 \\implies x + y = a$$

**Impose the point** $(2, 3)$:
$$2 + 3 = a \\implies a = 5$$

$$\\boxed{x + y = 5}$$

Intercepts: $(5, 0)$ and $(0, 5)$ — equal and positive ✓.

**Why the others are wrong:** (B) has intercepts of opposite sign; (C) doesn't pass through (2, 3) ($2+3 \\neq 1$); (D) $3x + 2y = 12$ has unequal intercepts (4 and 6) — it passes through the point but violates the equal-intercept condition.`,
    formulaConcept: 'Equal intercepts ⟹ line of the family $x + y = a$; fit $a$ from the point.',
    difficulty: 'MODERATE', chapterSlug: 'straight-lines', topicSlug: 'line-forms',
    sourceType: 'ORIGINAL', sourceNote: 'Equal-intercept family with sketch.',
    diagram: {
      kind: 'geometry',
      xRange: [-1, 6],
      yRange: [-1, 6],
      elements: [
        { type: 'line', from: [5, 0], to: [0, 5], color: 'var(--gold)' },
        { type: 'polygon', points: [[0, 0], [5, 0], [0, 5]], color: 'var(--gold)', label: 'A = 25/2' },
        { type: 'point', x: 5, y: 0, label: '(5, 0)', labelPos: 'SE' },
        { type: 'point', x: 0, y: 5, label: '(0, 5)', labelPos: 'NW' },
        { type: 'point', x: 2, y: 3, label: '(2, 3)', labelPos: 'SE' },
        { type: 'segment', from: [0, 0], to: [5, 0], label: 'a = 5', color: 'var(--chart-3)' },
        { type: 'segment', from: [0, 0], to: [0, 5], label: 'a = 5', color: 'var(--chart-3)' },
        { type: 'segment', from: [2, 0], to: [2, 3], color: 'var(--chart-5)', dashed: true },
        { type: 'segment', from: [0, 3], to: [2, 3], color: 'var(--chart-5)', dashed: true },
        { type: 'point', x: 2, y: 0, label: 'x = 2', labelPos: 'S' },
        { type: 'point', x: 0, y: 3, label: 'y = 3', labelPos: 'W' },
        { type: 'angleArc', at: [0, 0], fromDeg: 90, toDeg: 0, r: 0.45, label: '90°' },
        { type: 'angleArc', at: [5, 0], fromDeg: -135, toDeg: -180, r: 0.55, label: '45°' },
        { type: 'label', x: 3.65, y: 1.75, text: 'x + y = 5', color: 'var(--gold)' },
      ],
      square: true,
      showGrid: true,
      title: 'equal intercepts through (2, 3)',
    },
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The radical axis of the circles $x^2 + y^2 = 4$ and $x^2 + y^2 - 6x + 8 = 0$ is:`,
    options: ['x = −2', 'y = 2', 'x = 2', 'x − y = 2'],
    correctAnswer: 'C',
    solutionText: `The radical axis comes from subtracting the two circle equations (the $x^2 + y^2$ terms cancel):

$$\\underbrace{(x^2 + y^2 - 4)}_{S_1 = 0} - \\underbrace{(x^2 + y^2 - 6x + 8)}_{S_2 = 0} = 0$$
$$6x - 12 = 0 \\implies \\boxed{x = 2}$$

**Geometric check:** the second circle has centre $(3, 0)$, radius $\\sqrt{9 - 8} = 1$; the first has centre $(0,0)$, radius $2$. The distance between centres is 3 = 2 + 1 — the circles touch **internally** at $(2, 0)$, and the radical axis of tangent circles is their common tangent line through the contact point: $x = 2$ ✓.

**Why the others are wrong:** (A) x = −2 mirrors it; (B) picks the vertical coordinate; (D) invents a slanted line.`,
    formulaConcept: 'Radical axis: $S_1 - S_2 = 0$; for touching circles it degenerates to the common tangent at the contact point.',
    difficulty: 'HARD', chapterSlug: 'circles', topicSlug: 'radical-axis',
    sourceType: 'ORIGINAL', sourceNote: 'Internally-tangent circles radical axis.',
    diagram: {
      kind: 'geometry',
      xRange: [-3, 5],
      yRange: [-3, 3],
      elements: [
        { type: 'circle', cx: 0, cy: 0, r: 2, label: 'C₁: x² + y² = 4', color: 'var(--chart-3)' },
        { type: 'circle', cx: 3, cy: 0, r: 1, label: 'C₂: (x−3)² + y² = 1', color: 'var(--chart-5)' },
        { type: 'point', x: 0, y: 0, label: 'O₁ (0, 0)', labelPos: 'SW' },
        { type: 'point', x: 3, y: 0, label: 'O₂ (3, 0)', labelPos: 'SE' },
        { type: 'point', x: 2, y: 0, label: 'T (2, 0)', labelPos: 'NE' },
        { type: 'segment', from: [0, 0], to: [2, 0], label: 'r₁ = 2', color: 'var(--gold)' },
        { type: 'segment', from: [3, 0], to: [2, 0], label: 'r₂ = 1', color: 'var(--gold)' },
        { type: 'segment', from: [0, -0.55], to: [3, -0.55], label: 'd = r₁ + r₂ = 3', color: 'var(--chart-2)', dashed: true },
        { type: 'segment', from: [0, 0], to: [0, -0.55], color: 'var(--chart-2)', dashed: true },
        { type: 'segment', from: [3, 0], to: [3, -0.55], color: 'var(--chart-2)', dashed: true },
        { type: 'line', from: [2, -2.6], to: [2, 2.6], color: 'var(--gold)' },
        { type: 'angleArc', at: [2, 0], fromDeg: 90, toDeg: 0, r: 0.35, label: '90°' },
        { type: 'label', x: 2.35, y: 2.25, text: 'radical axis: x = 2', color: 'var(--gold)' },
        { type: 'label', x: 0.6, y: 2.2, text: 'circles touch at T', color: 'var(--muted-foreground)' },
      ],
      square: true,
      showGrid: false,
      title: 'radical axis of tangent circles = common tangent at T',
    },
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The focus of the parabola $y^2 = 12x$ is:`,
    options: ['(0, 3)', '(−3, 0)', '(0, −3)', '(3, 0)'],
    correctAnswer: 'D',
    solutionText: `Compare with the standard right-opening parabola $y^2 = 4ax$:
$$4a = 12 \\implies a = 3$$

**Focus** of $y^2 = 4ax$ is $(a, 0)$:
$$(3, 0)$$

The directrix is $x = -3$, equally far on the other side.

**Why the others are wrong:** (A)/(C) put the focus on the y-axis (confusing with $x^2 = 4ay$-type parabolas); (B) takes the directrix position $(-3, 0)$.`,
    formulaConcept: '$y^2 = 4ax$: focus $(a, 0)$, directrix $x = -a$ — read $a$ directly from the coefficient.',
    difficulty: 'MODERATE', chapterSlug: 'conic-sections', topicSlug: 'parabola',
    sourceType: 'ORIGINAL', sourceNote: 'Parabola focus with plotted sketch.',
    diagram: {
      kind: 'graph',
      title: 'y² = 12x (4a = 12, a = 3)',
      xAxis: { label: 'x', min: -4, max: 4, ticks: [-4, -3, -2, -1, 0, 1, 2, 3, 4] },
      yAxis: { label: 'y', min: -6.5, max: 6.5, ticks: [-6, -4, -2, 0, 2, 4, 6] },
      showGrid: true,
      square: false,
      markers: [
        { x: 3, y: 0, label: 'F (3, 0)' },
        { x: 0, y: 0, label: 'V (0, 0)', color: 'var(--chart-3)' },
        { x: 0.75, y: 3, label: 'P (0.75, 3)', color: 'var(--chart-3)' },
      ],
      curves: [
        {
          type: 'curve', color: 'var(--gold)', label: 'y² = 4ax',
          points: [[3, -6], [2.297, -5.25], [1.688, -4.5], [1.172, -3.75], [0.75, -3], [0.422, -2.25], [0.188, -1.5], [0.047, -0.75], [0, 0], [0.047, 0.75], [0.188, 1.5], [0.422, 2.25], [0.75, 3], [1.172, 3.75], [1.688, 4.5], [2.297, 5.25], [3, 6]],
        },
        { type: 'line', color: 'var(--chart-2)', dashed: true, label: 'directrix x = −3', points: [[-3, -6], [-3, 6]] },
        { type: 'line', color: 'var(--chart-5)', dashed: true, label: 'latus rectum = 4a', points: [[3, -6], [3, 6]] },
      ],
      shadedRegions: [
        { points: [[0.75, 3], [3, 0], [3.6, 2.6]], color: 'var(--chart-3)', label: '|PF| = 3.75' },
        { points: [[0.75, 3], [-3, 3], [-3, 2.3], [0.75, 2.4]], color: 'var(--chart-2)', label: '|P − directrix| = 3.75' },
      ],
    },
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `If $|\\vec a| = 3$, $|\\vec b| = 4$ and $\\vec a \\cdot \\vec b = 6$, then $|\\vec a \\times \\vec b|$ equals:`,
    options: ['6√2', '12', '6√3', '3√6'],
    correctAnswer: 'C',
    solutionText: `First the angle:
$$\\cos\\theta = \\frac{\\vec a\\cdot\\vec b}{|\\vec a||\\vec b|} = \\frac{6}{12} = \\frac12 \\implies \\sin\\theta = \\frac{\\sqrt3}{2}$$

**Cross product magnitude:**
$$|\\vec a \\times \\vec b| = |\\vec a||\\vec b|\\sin\\theta = 12 \\times \\frac{\\sqrt3}{2} = 6\\sqrt3$$

**Alternative (identity route):** $|\\vec a\\times\\vec b|^2 = |\\vec a|^2|\\vec b|^2 - (\\vec a\\cdot\\vec b)^2 = 144 - 36 = 108 = (6\\sqrt3)^2$ ✓

**Why the others are wrong:** (A) 6√2 corresponds to $\\sin\\theta = \\tfrac{\\sqrt2}{2}$ ($45^\\circ$); (B) 12 uses $\\sin\\theta = 1$ ($90^\\circ$); (D) 3√6 comes from mis-subtracting $144 - 54$.`,
    formulaConcept: '$|\\vec a\\times\\vec b|^2 = |\\vec a|^2|\\vec b|^2 - (\\vec a\\cdot\\vec b)^2$ — no angle needed.',
    difficulty: 'HARD', chapterSlug: 'vector-algebra', topicSlug: 'cross-product',
    sourceType: 'ORIGINAL', sourceNote: 'Dot-to-cross identity.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The angle between two lines whose direction ratios are $(1, 1, 0)$ and $(0, 1, 1)$ is:`,
    options: ['30°', '45°', '90°', '60°'],
    correctAnswer: 'D',
    solutionText: `Direction vectors: $\\vec u = (1,1,0)$, $\\vec v = (0,1,1)$.

**Dot product:** $\\vec u\\cdot\\vec v = 0 + 1 + 0 = 1$.

**Magnitudes:** $|\\vec u| = \\sqrt2$, $|\\vec v| = \\sqrt2$.

**Cosine of the angle:**
$$\\cos\\theta = \\frac{1}{\\sqrt2\\cdot\\sqrt2} = \\frac{1}{2} \\implies \\theta = 60^\\circ$$

**Why the others are wrong:** (A)/(B) mis-simplify the denominator; (C) 90° would need a zero dot product (the vectors are not orthogonal — they share the middle 1).`,
    formulaConcept: 'Line angle from direction ratios: $\\cos\\theta = \\dfrac{\\sum a_ib_i}{\\sqrt{\\sum a_i^2}\\sqrt{\\sum b_i^2}}$.',
    difficulty: 'MODERATE', chapterSlug: 'three-dimensional-geometry', topicSlug: 'lines-in-3d',
    sourceType: 'ORIGINAL', sourceNote: 'Direction-ratio angle computation.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `A bag contains 3 red and 2 black balls. Two balls are drawn at random **without replacement**. The probability that both are red is:`,
    options: ['3/10', '9/25', '3/5', '6/25'],
    correctAnswer: 'A',
    solutionText: `Without replacement — the draws are dependent:
$$P(R_1 \\cap R_2) = P(R_1)\\,P(R_2 \\mid R_1) = \\frac{3}{5} \\times \\frac{2}{4} = \\frac{6}{20} = \\frac{3}{10}$$

(First draw: 3 red of 5. Given one red gone: 2 red of 4.)

**Combinatorial check:** $\\dfrac{\\binom32}{\\binom52} = \\dfrac{3}{10}$ ✓ — same answer, two roads.

**Why the others are wrong:** (B) 9/25 assumes independence ($\\tfrac35 \\times \\tfrac35$); (C) 3/5 is just the first-draw probability; (D) 6/25 = $\\tfrac25 \\times \\tfrac35$-style mixing.`,
    formulaConcept: 'Without replacement → multiply conditional probabilities (or count pairs: $\\binom{r}{2}/\\binom{n}{2}$).',
    difficulty: 'MODERATE', chapterSlug: 'probability', topicSlug: 'conditional-probability',
    sourceType: 'ORIGINAL', sourceNote: 'Dependent draws both-red.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The arithmetic mean of the first 20 even natural numbers is:`,
    options: ['21', '20', '22', '42'],
    correctAnswer: 'A',
    solutionText: `The first 20 even numbers are $2, 4, \\dots, 40$ — an AP with first term 2, last term 40, 20 terms.

**AP mean = average of first and last terms:**
$$\\bar x = \\frac{2 + 40}{2} = 21$$

(Or: sum $= \\frac{20}{2}(2 + 40) = 420$, mean $= 420/20 = 21$ ✓.)

Note the elegant general result: the mean of the first $n$ even numbers is $n + 1$ — always **odd**.

**Why the others are wrong:** (B) 20 is the count, not the mean; (C) 22 would be the mean of $2..42$; (D) 42 is the largest term doubled-ish.`,
    formulaConcept: 'AP mean = (first + last)/2; first $n$ evens average $n+1$.',
    difficulty: 'MODERATE', chapterSlug: 'statistics', topicSlug: 'central-tendency',
    sourceType: 'ORIGINAL', sourceNote: 'Even-number AP mean.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The number of solutions of $2\\sin^2\\theta - 3\\sin\\theta + 1 = 0$ in the interval $[0, 2\\pi)$ is:`,
    options: ['2', '4', '3', '1'],
    correctAnswer: 'C',
    solutionText: `Factor the quadratic in $\\sin\\theta$:
$$2\\sin^2\\theta - 3\\sin\\theta + 1 = (2\\sin\\theta - 1)(\\sin\\theta - 1) = 0$$

**Branch 1:** $\\sin\\theta = \\tfrac12 \\Rightarrow \\theta = \\tfrac{\\pi}{6}, \\tfrac{5\\pi}{6}$ — **two** solutions.

**Branch 2:** $\\sin\\theta = 1 \\Rightarrow \\theta = \\tfrac{\\pi}{2}$ — **one** solution.

**Total:** $2 + 1 = 3$ solutions in $[0, 2\\pi)$.

**Why the others are wrong:** (A) 2 counts only the $\\sin\\theta = \\tfrac12$ branch; (B) 4 double-counts $\\theta = \\pi/2$ (it is a single point, not two); (D) 1 keeps only the perfect-square branch.`,
    formulaConcept: 'Solve the quadratic in $\\sin\\theta$, then count unit-circle hits per root in the given interval.',
    difficulty: 'HARD', chapterSlug: 'trigonometry', topicSlug: 'trig-identities-equations',
    sourceType: 'ORIGINAL', sourceNote: 'Quadratic-in-sin solution count.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `In a right triangle with legs 6 and 8 (hypotenuse 10), the circumradius of the triangle is:`,
    options: ['4', '5', '10', '2.5'],
    correctAnswer: 'B',
    solutionText: `For any triangle, $R = \\dfrac{abc}{4\\Delta}$.

**Area:** $\\Delta = \\tfrac12 \\times 6 \\times 8 = 24$.

**Circumradius:**
$$R = \\frac{6 \\times 8 \\times 10}{4 \\times 24} = \\frac{480}{96} = 5$$

**Right-triangle shortcut:** the hypotenuse subtends a right angle at the vertex, so it *is* a diameter of the circumcircle (angle-in-semicircle):
$$R = \\frac{\\text{hypotenuse}}{2} = \\frac{10}{2} = 5 \\checkmark$$

**Why the others are wrong:** (A) 4 is the shorter leg; (C) 10 is the diameter, not the radius; (D) 2.5 is half the shorter leg.`,
    formulaConcept: 'Right triangle: circumcentre = midpoint of hypotenuse → $R = c/2$.',
    difficulty: 'MODERATE', chapterSlug: 'trigonometry', topicSlug: 'properties-of-triangles',
    sourceType: 'ORIGINAL', sourceNote: 'Right-triangle circumcircle with sketch.',
    diagram: {
      kind: 'geometry',
      xRange: [-6, 9],
      yRange: [-6, 7],
      elements: [
        { type: 'circle', cx: 4, cy: 3, r: 5, label: 'circumcircle, R = 5', color: 'var(--chart-2)' },
        { type: 'polygon', points: [[0, 0], [8, 0], [0, 6]], color: 'var(--gold)', label: 'Δ ABC' },
        { type: 'point', x: 0, y: 0, label: 'A (0, 0)', labelPos: 'SW' },
        { type: 'point', x: 8, y: 0, label: 'B (8, 0)', labelPos: 'SE' },
        { type: 'point', x: 0, y: 6, label: 'C (0, 6)', labelPos: 'NW' },
        { type: 'point', x: 4, y: 3, label: 'O', labelPos: 'N' },
        { type: 'label', x: 3.4, y: 3.55, text: 'O = midpoint of BC', color: 'var(--chart-2)' },
        { type: 'segment', from: [4, 3], to: [0, 0], label: 'R', color: 'var(--chart-2)', dashed: true },
        { type: 'segment', from: [4, 3], to: [8, 0], label: 'R = 5', color: 'var(--chart-2)', dashed: true },
        { type: 'segment', from: [4, 3], to: [0, 6], label: 'R', color: 'var(--chart-2)', dashed: true },
        { type: 'segment', from: [0, 0], to: [8, 0], label: 'AB = 8', color: 'var(--chart-3)' },
        { type: 'segment', from: [0, 0], to: [0, 6], label: 'AC = 6', color: 'var(--chart-3)' },
        { type: 'segment', from: [8, 0], to: [0, 6], label: 'BC = 10 = 2R', color: 'var(--gold)' },
        { type: 'angleArc', at: [0, 0], fromDeg: 90, toDeg: 0, r: 0.6, label: '90°' },
      ],
      square: true,
      showGrid: false,
      title: 'right triangle: hypotenuse BC = 10 is the diameter ⇒ R = 5',
    },
  },
  // ---------------- SECTION B (numerical) Q71–Q75 ----------------
  {
    subject: 'MATHEMATICS', section: 'B',
    text: `The roots of $x^2 - 5x + k = 0$ differ by 1. The value of $k$ is:`,
    correctAnswer: '6',
    solutionText: `Let the roots be $\\alpha, \\beta$ with $\\alpha + \\beta = 5$ and $\\alpha\\beta = k$.

**Difference condition:**
$$(\\alpha - \\beta)^2 = (\\alpha+\\beta)^2 - 4\\alpha\\beta$$
$$1 = 25 - 4k \\implies 4k = 24 \\implies k = 6$$

**Check:** $x^2 - 5x + 6 = (x-2)(x-3) = 0$ — roots 3 and 2, differing by exactly 1 ✓`,
    formulaConcept: 'Root differences via symmetric functions: $(\\alpha-\\beta)^2 = S^2 - 4P$.',
    difficulty: 'HARD', chapterSlug: 'quadratic-equations', topicSlug: 'roots-nature',
    sourceType: 'ORIGINAL', sourceNote: 'Root-separation condition.',
  },
  {
    subject: 'MATHEMATICS', section: 'B',
    text: `For an AP, the sum of $n$ terms is $S_n = 2n^2 + 3n$. The common difference of the AP is:`,
    correctAnswer: '4',
    solutionText: `**Extract the nth term** from the sum:
$$T_n = S_n - S_{n-1} = (2n^2 + 3n) - \\big(2(n-1)^2 + 3(n-1)\\big)$$
$$= 2n^2 + 3n - 2n^2 + 4n - 2 - 3n + 3 = 4n + 1$$

**Common difference:**
$$d = T_{n+1} - T_n = 4(n+1) + 1 - (4n+1) = 4$$

**Quick check:** $T_1 = 5 = S_1 = 2 + 3$ ✓; $T_2 = 9$, and $S_2 = 14 = 5 + 9$ ✓.`,
    formulaConcept: '$T_n = S_n - S_{n-1}$; a quadratic $S_n$ always yields a linear $T_n$ (an AP).',
    difficulty: 'MODERATE', chapterSlug: 'sequences-and-series', topicSlug: 'arithmetic-progression',
    sourceType: 'ORIGINAL', sourceNote: 'Sum-to-term extraction.',
  },
  {
    subject: 'MATHEMATICS', section: 'B',
    text: `The value of $\\displaystyle\\int_0^{\\pi} \\sin x\\ dx$ is:`,
    correctAnswer: '2',
    solutionText: `Direct antiderivative:
$$\\int_0^{\\pi}\\sin x\\,dx = [-\\cos x]_0^{\\pi} = -\\cos\\pi + \\cos 0 = -(-1) + 1 = 2$$

Geometrically: the sine arch from $0$ to $\\pi$ has area exactly **2** square units — the region above the axis fully counts (no cancellation happens within $[0, \\pi]$, unlike $[0, 2\\pi]$ where the answer would be 0).`,
    formulaConcept: 'Standard definite integral; areas of the sine arch = 2.',
    difficulty: 'MODERATE', chapterSlug: 'integral-calculus', topicSlug: 'definite-integration',
    sourceType: 'ORIGINAL', sourceNote: 'Sine-arch area.',
  },
  {
    subject: 'MATHEMATICS', section: 'B',
    text: `A fair die is rolled 4 times. The probability (round off to two decimals) of getting exactly one six is:`,
    correctAnswer: '0.39',
    solutionText: `Binomial with $n = 4$, $p = 1/6$:
$$P(X = 1) = \\binom41\\left(\\frac16\\right)\\left(\\frac56\\right)^3 = 4 \\times \\frac{1}{6} \\times \\frac{125}{216}$$

$$= \\frac{500}{1296} = \\frac{125}{324} = 0.3858 \\approx 0.39$$

**Sanity check:** $P(\\text{no six}) = (5/6)^4 \\approx 0.48$, $P(\\geq 2\\ \\text{sixes}) \\approx 0.13$; $0.39 + 0.48 + 0.13 = 1$ ✓`,
    formulaConcept: 'Binomial PMF: $\\binom{n}{k}p^k(1-p)^{n-k}$ — roll-by-roll independence.',
    difficulty: 'HARD', chapterSlug: 'probability', topicSlug: 'binomial-distribution',
    sourceType: 'ORIGINAL', sourceNote: 'Exactly-one-six in four rolls.',
  },
  {
    subject: 'MATHEMATICS', section: 'B',
    text: `Line $L_1$ passes through $(1, 2, 3)$ along the $x$-axis direction; line $L_2$ passes through $(2, 4, 5)$ along the $y$-axis direction. The shortest distance between $L_1$ and $L_2$ is:`,
    correctAnswer: '2',
    solutionText: `Setup:
$$\\vec P_1 = (1,2,3), \\ \\vec d_1 = (1,0,0); \\qquad \\vec P_2 = (2,4,5), \\ \\vec d_2 = (0,1,0)$$

**Shortest distance between skew lines:**
$$d = \\frac{|(\\vec P_2 - \\vec P_1)\\cdot(\\vec d_1 \\times \\vec d_2)|}{|\\vec d_1 \\times \\vec d_2|}$$

**Cross product:**
$$\\vec d_1 \\times \\vec d_2 = (1,0,0)\\times(0,1,0) = (0, 0, 1)$$

**Numerator:**
$$(\\vec P_2 - \\vec P_1) = (1, 2, 2), \\qquad (1,2,2)\\cdot(0,0,1) = 2$$

$$d = \\frac{|2|}{1} = 2$$

Only the $z$-separation survives — the $x$ and $y$ offsets can be absorbed by sliding along the lines.`,
    formulaConcept: 'Skew-line distance: project $\\vec{P_2}-\\vec{P_1}$ onto $\\hat n = \\vec d_1\\times\\vec d_2$.',
    difficulty: 'VERY_HARD', chapterSlug: 'three-dimensional-geometry', topicSlug: 'distances-in-3d',
    sourceType: 'ORIGINAL', sourceNote: 'Axis-aligned skew lines with 3D sketch.',
    diagram: {
      kind: 'v3d',
      axesLength: 3.2,
      showGrid: true,
      lines: [
        { from: [0.6, 2, 3], to: [3, 2, 3], label: 'L₁ (∥ x-axis)', color: 'var(--gold)' },
        { from: [2, 2.6, 5], to: [2, 4.4, 5], label: 'L₂ (∥ y-axis)', color: 'var(--chart-2)' },
        { from: [2, 2, 3], to: [2, 2, 5], color: 'var(--chart-3)', dashed: true },
        { from: [1, 2, 3], to: [2, 2, 3], label: 'Δx absorbed', color: 'var(--chart-5)', dashed: true },
        { from: [2, 4, 5], to: [2, 2, 5], label: 'Δy absorbed', color: 'var(--chart-5)', dashed: true },
      ],
      points: [
        { x: 1, y: 2, z: 3, label: '(1,2,3)', color: 'var(--gold)' },
        { x: 2, y: 4, z: 5, label: '(2,4,5)', color: 'var(--chart-2)' },
        { x: 2, y: 2, z: 3, label: 'F₁', color: 'var(--chart-3)' },
        { x: 2, y: 2, z: 5, label: 'F₂', color: 'var(--chart-3)' },
      ],
      vectors: [
        { from: [2, 2, 3], to: [2, 2, 5], label: 'd = 2', color: 'var(--chart-3)' },
      ],
    },
  },
]
