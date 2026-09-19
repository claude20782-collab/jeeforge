import type { SeedQuestion } from '@/content/types'

// ============================================================================
// MOCK 02 — MATHEMATICS (Q51–Q75: 20 MCQ Section A + 5 numerical Section B)
// Difficulty target: Hard JEE Main. Every calculation hand-verified.
// ============================================================================

export const MATHEMATICS_MOCK02: SeedQuestion[] = [
  // ---------------- SECTION A (MCQ) Q51–Q70 ----------------
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The number of reflexive relations possible on a set containing 3 elements is:`,
    options: ['8', '16', '64', '512'],
    correctAnswer: 'C',
    solutionText: `A relation on set $A$ is any subset of $A \\times A$. With $|A| = 3$ there are $3^2 = 9$ ordered pairs, so a relation is a choice of "in or out" for each of 9 pairs: $2^9$ total relations.

**Reflexivity forces** the 3 diagonal pairs $(a,a), (b,b), (c,c)$ to be **included** — no freedom there. Only the remaining $9 - 3 = 6$ off-diagonal pairs are optional:
$$N = 2^{n^2 - n} = 2^{9-3} = 2^6 = 64$$

**Why the others are wrong:** (A) 8 = 2³ counts only diagonal choices; (B) 16 = 2⁴ (miscounting the free pairs as 4); (D) 512 = 2⁹ is ALL relations, reflexive or not.`,
    formulaConcept: 'Reflexive relations on $n$ elements: $2^{n^2-n}$ (diagonal forced in).',
    difficulty: 'MODERATE', chapterSlug: 'sets-relations-functions', topicSlug: 'relations',
    sourceType: 'ORIGINAL', sourceNote: 'Counting constrained relations.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The value of $(1 + i)^8$, where $i = \\sqrt{-1}$, is:`,
    options: ['16', '−16', '16i', '8'],
    correctAnswer: 'A',
    solutionText: `Square step by step:
$$(1+i)^2 = 1 + 2i + i^2 = 2i$$
$$(1+i)^4 = (2i)^2 = 4i^2 = -4$$
$$(1+i)^8 = (-4)^2 = 16$$

A purely real answer — the argument of $1+i$ is $45^\\circ$, and $8 \\times 45^\\circ = 360^\\circ$ lands back on the positive real axis.

**Why the others are wrong:** (B) −16 would come from an odd multiple of $180^\\circ$ rotation (e.g. $(1+i)^6$); (C) 16i corresponds to a $90^\\circ$ total rotation; (D) 8 forgets to square twice.`,
    formulaConcept: 'Polar form: $(1+i) = \\sqrt2\\,e^{i\\pi/4}$, so $(1+i)^8 = 16\\,e^{i2\\pi} = 16$.',
    difficulty: 'MODERATE', chapterSlug: 'complex-numbers', topicSlug: 'cn-algebra',
    sourceType: 'ORIGINAL', sourceNote: 'Successive squaring in GCD-friendly steps.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `If $\\alpha$ and $\\beta$ are the roots of $x^2 - 2x + 4 = 0$, then $\\alpha^3 + \\beta^3$ equals:`,
    options: ['-8', '8', '0', '-16'],
    correctAnswer: 'D',
    solutionText: `From the equation: $\\alpha + \\beta = 2$ and $\\alpha\\beta = 4$.

**Identity for the sum of cubes:**
$$\\alpha^3 + \\beta^3 = (\\alpha+\\beta)^3 - 3\\alpha\\beta(\\alpha+\\beta)$$

**Substituting:**
$$\\alpha^3 + \\beta^3 = 2^3 - 3(4)(2) = 8 - 24 = -16$$

(Indeed the discriminant is negative — $4 - 16 = -12$ — so the roots are complex conjugates $1 \\pm i\\sqrt{3}$; the identity route avoids computing them.)

**Quick verify with the roots:** $(1+i\\sqrt3)^3 = 1 + 3i\\sqrt3 - 9 - 3i\\sqrt3 = -8$, and conjugating, the sum is $-8 + (-8) = -16$ ✓.

**Why the others are wrong:** (A) −8 is a single root's cube; (B) 8 = $(\\alpha+\\beta)^3$ only; (C) 0 forgets the $-3\\alpha\\beta(\\alpha+\\beta)$ term.`,
    formulaConcept: '$\\alpha^3+\\beta^3 = (\\alpha+\\beta)^3 - 3\\alpha\\beta(\\alpha+\\beta)$ — symmetric functions need no root formula.',
    difficulty: 'HARD', chapterSlug: 'quadratic-equations', topicSlug: 'roots-nature',
    sourceType: 'ORIGINAL', sourceNote: 'Symmetric-function evaluation with complex roots.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The sum $1^2 + 3^2 + 5^2 + \\dots + 19^2$ (squares of the first 10 odd natural numbers) is:`,
    options: ['940', '1330', '1440', '2850'],
    correctAnswer: 'B',
    solutionText: `Write the $k$-th odd number as $(2k-1)$ and expand:
$$\\sum_{k=1}^{10} (2k-1)^2 = \\sum (4k^2 - 4k + 1) = 4\\sum k^2 - 4\\sum k + 10$$

**Standard sums for $n = 10$:** $\\sum k = 55$, $\\sum k^2 = 385$:
$$S = 4(385) - 4(55) + 10 = 1540 - 220 + 10 = 1330$$

**Closed form check:** $\\sum_{k=1}^{n}(2k-1)^2 = \\dfrac{n(2n-1)(2n+1)}{3}$:
$$\\frac{10 \\times 19 \\times 21}{3} = \\frac{3990}{3} = 1330 \\checkmark$$

**Why the others are wrong:** (A) 940 = 1330 − 390 (a slip in the $-4\\sum k$ term); (C) 1440 rounds/derails the middle term; (D) 2850 = $\\sum_{k=1}^{20} k^2$ (all integers up to 20, not just odds).`,
    formulaConcept: 'Sum of first $n$ odd squares $= n(2n-1)(2n+1)/3$; derive by expanding $(2k-1)^2$.',
    difficulty: 'HARD', chapterSlug: 'sequences-and-series', topicSlug: 'special-series',
    sourceType: 'ORIGINAL', sourceNote: 'Odd-squares telescoping via standard sums.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `5 boys and 5 girls are to be seated in a row so that no two girls sit together. The number of arrangements is:`,
    options: ['720', '14400', '86400', '1209600'],
    correctAnswer: 'C',
    solutionText: `**Gap method.** Seat the 5 boys first:
$$5! = 120\\ \\text{ways}$$

The 5 boys create **6 gaps** (including the two ends):
$$\\_\\,B\\,\\_\\,B\\,\\_\\,B\\,\\_\\,B\\,\\_\\,B\\,\\_$$

Choose 5 of these 6 gaps for the girls and permute the girls within them:
$$^{6}P_5 = \\frac{6!}{1!} = 720$$

**Total:**
$$5! \\times {}^6P_5 = 120 \\times 720 = 86{,}400$$

**Why the others are wrong:** (A) 720 counts only the girls' placement; (B) 14400 = 120 × 120 (choosing gaps as combinations × fewer permutations — a mixed-up 5! for girls inside fixed gaps); (D) 1,209,600 = $6! \\times 5! \\times 2$-ish overshoot (treating gaps as 6! and doubling).`,
    formulaConcept: 'No-two-together rows: $n! \\times {}^{(n+1)}P_m$ — boys create $n+1$ gaps, girls fill $m$ of them.',
    difficulty: 'HARD', chapterSlug: 'permutations-combinations', topicSlug: 'permutations',
    sourceType: 'ORIGINAL', sourceNote: 'Gap-method seating.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The coefficient of $x^5$ in the expansion of $(x + 2)^8$ is:`,
    options: ['1792', '56', '112', '448'],
    correctAnswer: 'D',
    solutionText: `The general term of $(x+2)^8$ is
$$T_{k+1} = \\binom{8}{k} x^{8-k}\\, 2^{k}$$

**For the $x^5$ term we need $8 - k = 5 \\implies k = 3$:**
$$\\binom{8}{3} \\cdot 2^3 = 56 \\times 8 = 448$$

**Why the others are wrong:** (A) 1792 = $\\binom{8}{2}\\cdot 2^6$ — coefficient of $x^2$ (wrong power targeted: $k=2$ needs $2^6$ but $8-2=6 \\ne 5$; actually it's $k = 6$: $\\binom86 2^6 = 28 \\times 64 = 1792$); (B) 56 is the binomial factor alone, forgetting $2^3$; (C) 112 = $56 \\times 2$ (only one factor of 2).`,
    formulaConcept: `Binomial term selection: match the power first ($8-k = 5$), then multiply by the constant's power $2^k$.`,
    difficulty: 'MODERATE', chapterSlug: 'binomial-theorem', topicSlug: 'general-middle-terms',
    sourceType: 'ORIGINAL', sourceNote: 'Term-targeting in a small binomial.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `If $A$ is a $3 \\times 3$ matrix with $|A| = 4$, then $|2A|$ equals:`,
    options: ['8', '16', '32', '64'],
    correctAnswer: 'C',
    solutionText: `Each of the 3 rows of $A$ gets multiplied by 2 when forming $2A$. The determinant is **linear in each row separately**, so:
$$|2A| = 2^3 \\, |A| = 8 \\times 4 = 32$$

For an $n \\times n$ matrix: $|kA| = k^n |A|$ — the scalar multiplies once per row.

**Why the others are wrong:** (A) 8 = 2³ forgets $|A|$ entirely; (B) 16 = 2⁴ (wrong exponent); (D) 64 = 4³ (cubing the determinant instead of the scalar).`,
    formulaConcept: '$|kA| = k^n|A|$ for $n \\times n$ matrices — one factor per row.',
    difficulty: 'MODERATE', chapterSlug: 'matrices-determinants', topicSlug: 'determinant-properties',
    sourceType: 'ORIGINAL', sourceNote: 'Scalar multiple of a determinant.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The value of $\\displaystyle\\lim_{x \\to 0} \\frac{\\sin x - x}{x^3}$ is:`,
    options: ['1/6', '−1/6', '−1/3', '0'],
    correctAnswer: 'B',
    solutionText: `Apply L'Hôpital's rule three times (each pass gives 0/0):

**First pass:**
$$\\lim \\frac{\\cos x - 1}{3x^2}$$
**Second pass:**
$$\\lim \\frac{-\\sin x}{6x} = -\\frac{1}{6}\\lim\\frac{\\sin x}{x}$$
**Third pass (or the standard limit):**
$$= -\\frac{1}{6} \\times 1 = -\\frac{1}{6}$$

**Series check:** $\\sin x = x - \\tfrac{x^3}{6} + \\tfrac{x^5}{120} - \\dots$, so
$$\\frac{\\sin x - x}{x^3} = -\\frac{1}{6} + \\frac{x^2}{120} - \\dots \\xrightarrow{x \\to 0} -\\frac{1}{6}$$

**Why the others are wrong:** (A) +1/6 misses the sign (sin x *lags* x near zero); (C) −1/3 doubles it; (D) 0 treats the numerator as $O(x)$-cancelled to nothing.`,
    formulaConcept: 'Near zero: $\\sin x = x - x^3/6 + \\dots$ — the cubic term decides the limit.',
    difficulty: 'HARD', chapterSlug: 'limits-continuity', topicSlug: 'limits',
    sourceType: 'ORIGINAL', sourceNote: 'Triple L\'Hôpital / Taylor limit.',
    diagram: {
      kind: 'graph',
      title: 'y = (sin x − x)/x³ near x = 0',
      xAxis: { label: 'x', min: -1.5, max: 1.5, ticks: [-1, 0, 1] },
      yAxis: { label: 'y', min: -0.2, max: 0, ticks: [-0.1667, 0] },
      curves: [
        { type: 'curve', color: 'var(--gold)', points: [[-1.5, -0.149], [-1, -0.1585], [-0.5, -0.166], [-0.15, -0.167], [0.15, -0.167], [0.5, -0.166], [1, -0.1585], [1.5, -0.149]] },
        { type: 'line', color: 'var(--chart-2)', points: [[-1.5, -0.1667], [1.5, -0.1667]], dashed: true },
      ],
      markers: [{ x: 0, y: -0.1667, label: 'limit = −1/6' }],
    },
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The local maximum value of the function $f(x) = x^3 - 12x + 5$ is:`,
    options: ['−11', '11', '21', '27'],
    correctAnswer: 'C',
    solutionText: `**Stationary points:**
$$f'(x) = 3x^2 - 12 = 3(x-2)(x+2) = 0 \\implies x = \\pm 2$$

**Second derivative test:** $f''(x) = 6x$:
- $f''(-2) = -12 < 0$ → concave down → **local maximum at $x = -2$**
- $f''(2) = +12 > 0$ → concave up → local minimum at $x = 2$

**Maximum value:**
$$f(-2) = -8 + 24 + 5 = 21$$

(The local minimum value is $f(2) = 8 - 24 + 5 = -11$.)

**Why the others are wrong:** (A) −11 is the *minimum* value (reading the wrong stationary point); (B) 11 drops a sign; (D) 27 = f(−2) with the wrong linear term.`,
    formulaConcept: `Optimise: set $f'=0$, classify with $f''$ sign, then evaluate $f$ — not the derivative — at the point.`,
    difficulty: 'HARD', chapterSlug: 'application-of-derivatives', topicSlug: 'maxima-minima',
    sourceType: 'ORIGINAL', sourceNote: 'Cubic extremum with classic min-value trap.',
    diagram: {
      kind: 'graph',
      title: 'y = x³ − 12x + 5',
      xAxis: { label: 'x', min: -4, max: 4, ticks: [-4, -2, 2, 4] },
      yAxis: { label: 'y', min: -15, max: 25, ticks: [-11, 5, 21] },
      curves: [
        { type: 'curve', color: 'var(--gold)', points: [[-4, -11], [-3, 14], [-2, 21], [-1, 16], [0, 5], [1, -6], [2, -11], [3, -4], [4, 21]] },
      ],
      markers: [
        { x: -2, y: 21, label: 'local max (−2, 21)' },
        { x: 2, y: -11, label: 'local min (2, −11)' },
      ],
    },
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The value of $\\displaystyle\\int_0^{\\pi/2} \\frac{dx}{1 + \\tan x}$ is:`,
    options: ['π/4', 'π/2', 'π/8', '0'],
    correctAnswer: 'A',
    solutionText: `**King's property:** $\\displaystyle\\int_a^b f(x)\\,dx = \\int_a^b f(a+b-x)\\,dx$. Here $a+b = \\pi/2$:
$$I = \\int_0^{\\pi/2} \\frac{dx}{1 + \\tan\\left(\\frac{\\pi}{2}-x\\right)} = \\int_0^{\\pi/2} \\frac{dx}{1 + \\cot x}$$

Simplify the transformed integrand:
$$\\frac{1}{1+\\cot x} = \\frac{1}{1 + \\tfrac{\\cos x}{\\sin x}} = \\frac{\\sin x}{\\sin x + \\cos x}$$

**Add the two forms of $I$:**
$$2I = \\int_0^{\\pi/2} \\left(\\frac{\\cos x}{\\sin x + \\cos x} + \\frac{\\sin x}{\\sin x + \\cos x}\\right) dx = \\int_0^{\\pi/2} 1\\,dx = \\frac{\\pi}{2}$$

$$\\boxed{I = \\frac{\\pi}{4}}$$

**Why the others are wrong:** (B) π/2 is the raw length of the interval (the naive guess if the integrand were 1); (C) π/8 halves once more; (D) 0 assumes odd-symmetry about the midpoint — the integrand is not antisymmetric.`,
    formulaConcept: "King's rule $x \\to a+b-x$ pairs complementary trig integrands; their sum is often 1.",
    difficulty: 'VERY_HARD', chapterSlug: 'integral-calculus', topicSlug: 'definite-integration',
    sourceType: 'ORIGINAL', sourceNote: 'Complementary-argument definite integral.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The general solution of the differential equation $\\dfrac{dy}{dx} + y = e^{-x}$ is:`,
    options: ['y = xeˣ + C', 'y = (x + C)eˣ', 'y = xe⁻ˣ + C', 'y = (x + C)e⁻ˣ'],
    correctAnswer: 'D',
    solutionText: `**Linear first-order ODE** with $P(x) = 1$, $Q(x) = e^{-x}$.

**Integrating factor:**
$$IF = e^{\\int 1\\,dx} = e^{x}$$

**Multiply through and integrate:**
$$\\frac{d}{dx}\\left(y e^{x}\\right) = e^{x}\\,e^{-x} = 1$$
$$y e^{x} = x + C$$

**Hence:**
$$y = (x + C)e^{-x}$$

**Check by substitution:** $y' = e^{-x} - (x+C)e^{-x}$, so $y' + y = e^{-x} - (x+C)e^{-x} + (x+C)e^{-x} = e^{-x}$ ✓

**Why the others are wrong:** (A)/(B) grow like $e^{x}$ — they solve $y' - y = e^{x}$-type equations; (C) has the right decay shape but the constant $C$ must be *inside* the bracket (otherwise it also decays and cannot satisfy the equation for all $C$).`,
    formulaConcept: 'Linear ODE $y\'+Py=Q$: multiply by $IF = e^{\\int P}$, integrate the exact derivative.',
    difficulty: 'VERY_HARD', chapterSlug: 'differential-equations', topicSlug: 'linear-differential-equations',
    sourceType: 'ORIGINAL', sourceNote: 'IF method with matching decay rate.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The distance between the parallel lines $3x + 4y - 9 = 0$ and $6x + 8y + 15 = 0$ is:`,
    options: ['1.65', '3.3', '16.5', '6.6'],
    correctAnswer: 'B',
    solutionText: `First make the coefficients **identical** — divide the second equation by 2:
$$6x + 8y + 15 = 0 \\iff 3x + 4y + 7.5 = 0$$

**Distance between parallel lines** $ax + by + c_1 = 0$ and $ax + by + c_2 = 0$:
$$d = \\frac{|c_1 - c_2|}{\\sqrt{a^2 + b^2}} = \\frac{|-9 - 7.5|}{\\sqrt{9 + 16}} = \\frac{16.5}{5} = 3.3$$

**Why the others are wrong:** (A) 1.65 forgets to halve the second equation first ($|{-9 - 15}|/10$ gives 2.4 — neither; 1.65 is half the true answer from mixing forms); (C) 16.5 is the numerator — forgot to divide by 5; (D) 6.6 doubles it.`,
    formulaConcept: '$d = |c_1 - c_2|/\\sqrt{a^2+b^2}$ — only after matching the line coefficients exactly.',
    difficulty: 'HARD', chapterSlug: 'straight-lines', topicSlug: 'point-line-distance',
    sourceType: 'ORIGINAL', sourceNote: 'Normalise-then-subtract discipline.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The length of the tangent drawn from the point $(5, 4)$ to the circle $x^2 + y^2 + 4x - 2y - 5 = 0$ is:`,
    options: ['4', '4√2', '4√3', '2√13'],
    correctAnswer: 'C',
    solutionText: `**Tangent length formula:** for a point $P$ outside the circle $S = 0$:
$$L = \\sqrt{S(P)}$$

**Evaluate $S$ at $(5,4)$:**
$$S(P) = 25 + 16 + 20 - 8 - 5 = 48$$

**Tangent length:**
$$L = \\sqrt{48} = 4\\sqrt{3}$$

(For reference, the circle's centre is $(-2, 1)$ and radius $\\sqrt{4+1+5} = \\sqrt{10}$; then $L = \\sqrt{|PC|^2 - r^2} = \\sqrt{58 - 10} = \\sqrt{48}$ ✓ — the same computation in disguise.)

**Why the others are wrong:** (A) 4 = the $x$-offset; (B) $4\\sqrt2 = \\sqrt{32}$ (arithmetic slip in $S(P)$); (D) $2\\sqrt{13} = \\sqrt{52}$ uses $-2y$ as $+2y$.`,
    formulaConcept: `Tangent length $= \\sqrt{S_1}$ — substitute the point directly into the circle's equation.`,
    difficulty: 'MODERATE', chapterSlug: 'circles', topicSlug: 'tangents-to-circles',
    sourceType: 'ORIGINAL', sourceNote: 'S(P) tangent length with a diagram.',
    diagram: {
      kind: 'geometry',
      xRange: [-8, 8],
      yRange: [-5, 8],
      elements: [
        { type: 'circle', cx: -2, cy: 1, r: 3.16, label: '' },
        { type: 'point', x: -2, y: 1, label: 'C (−2, 1)', labelPos: 'W' },
        { type: 'point', x: 5, y: 4, label: 'P (5, 4)', labelPos: 'E' },
        { type: 'segment', from: [5, 4], to: [0.34, -1.13], label: 'L = 4√3', color: 'var(--gold)' },
        { type: 'segment', from: [5, 4], to: [-1.93, 4.16], label: '', color: 'var(--gold)' },
        { type: 'segment', from: [-2, 1], to: [0.34, -1.13], label: 'r', color: 'var(--chart-2)', dashed: true },
        { type: 'segment', from: [-2, 1], to: [-1.93, 4.16], label: 'r', color: 'var(--chart-2)', dashed: true },
        { type: 'label', x: 0.6, y: 2.4, text: 'T₁', color: 'var(--gold)' },
        { type: 'label', x: -3.6, y: 4.6, text: 'T₂', color: 'var(--gold)' },
      ],
      showGrid: false,
      title: 'tangents from P to the circle',
    },
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The eccentricity of the ellipse $\\dfrac{x^2}{25} + \\dfrac{y^2}{16} = 1$ is:`,
    options: ['3/5', '4/5', '1/2', '3/4'],
    correctAnswer: 'A',
    solutionText: `For an ellipse $a^2 > b^2$ with foci on the $x$-axis:
$$a^2 = 25, \\quad b^2 = 16$$
$$c^2 = a^2 - b^2 = 25 - 16 = 9 \\implies c = 3$$

**Eccentricity:**
$$e = \\frac{c}{a} = \\frac{3}{5}$$

Always $0 < e < 1$ for an ellipse; here the foci sit at $(\\pm 3, 0)$.

**Why the others are wrong:** (B) 4/5 = $b/a$ (using the minor axis); (C) 1/2 would need $c = 2.5$; (D) 3/4 mixes $c/b$-type ratios.`,
    formulaConcept: 'Ellipse: $e = \\sqrt{1 - b^2/a^2}$ with $a$ the semi-major axis.',
    difficulty: 'MODERATE', chapterSlug: 'conic-sections', topicSlug: 'ellipse',
    sourceType: 'ORIGINAL', sourceNote: 'Ellipse eccentricity with focal property.',
    diagram: {
      kind: 'geometry',
      xRange: [-6, 6],
      yRange: [-5, 5],
      elements: [
        { type: 'ellipse', cx: 0, cy: 0, a: 5, b: 4, label: 'x²/25 + y²/16 = 1' },
        { type: 'point', x: -3, y: 0, label: 'F₁ (−3, 0)', labelPos: 'S' },
        { type: 'point', x: 3, y: 0, label: 'F₂ (3, 0)', labelPos: 'S' },
        { type: 'point', x: 2.5, y: 3.46, label: 'P', labelPos: 'NE' },
        { type: 'segment', from: [2.5, 3.46], to: [-3, 0], label: 'PF₁ = 6.5', color: 'var(--gold)' },
        { type: 'segment', from: [2.5, 3.46], to: [3, 0], label: 'PF₂ = 3.5', color: 'var(--gold)' },
        { type: 'label', x: -5.5, y: 4.4, text: 'PF₁ + PF₂ = 10 = 2a', color: 'var(--chart-3)' },
      ],
      showGrid: false,
      square: true,
    },
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `If $\\vec a = \\hat i + \\hat j$, $\\vec b = \\hat j + \\hat k$ and $\\vec c = \\hat k + \\hat i$, then the volume of the parallelepiped whose coterminous edges are $\\vec a, \\vec b, \\vec c$ is:`,
    options: ['0', '1', '√2', '2'],
    correctAnswer: 'D',
    solutionText: `The volume is the absolute value of the **scalar triple product**:
$$V = |[\\vec a\\ \\vec b\\ \\vec c]| = \\left|\\vec a \\cdot (\\vec b \\times \\vec c)\\right|$$

**Compute the determinant:**
$$[\\vec a\\ \\vec b\\ \\vec c] = \\begin{vmatrix} 1 & 1 & 0 \\\\ 0 & 1 & 1 \\\\ 1 & 0 & 1 \\end{vmatrix}$$

Expanding along the first row:
$$= 1\\begin{vmatrix}1&1\\\\0&1\\end{vmatrix} - 1\\begin{vmatrix}0&1\\\\1&1\\end{vmatrix} + 0 = 1(1-0) - 1(0-1) = 1+1 = 2$$

So $V = |2| = 2$ (cubic units). The three edge vectors are coplanar only if this determinant vanished — it doesn't.

**Why the others are wrong:** (A) 0 would mean coplanar edges; (B) 1 loses a cofactor sign in the middle minor; (C) √2 mixes up with the vectors' lengths ($|\\vec a| = \\sqrt2$).`,
    formulaConcept: 'Parallelepiped volume $= |[\\vec a\\,\\vec b\\,\\vec c]|$ — a 3×3 determinant of the components.',
    difficulty: 'VERY_HARD', chapterSlug: 'vector-algebra', topicSlug: 'scalar-triple-product',
    sourceType: 'ORIGINAL', sourceNote: 'Clean unit-vector triple product.',
    diagram: {
      kind: 'v3d',
      axesLength: 2.4,
      vectors: [
        { from: [0, 0, 0], to: [1, 1, 0], label: 'a', color: 'var(--gold)' },
        { from: [0, 0, 0], to: [0, 1, 1], label: 'b', color: 'var(--chart-2)' },
        { from: [0, 0, 0], to: [1, 0, 1], label: 'c', color: 'var(--chart-3)' },
      ],
      planes: [
        { points: [[0, 0, 0], [1, 1, 0], [1, 2, 1], [0, 1, 1]], label: '', color: 'var(--gold)', opacity: 0.25 },
        { points: [[0, 0, 0], [1, 1, 0], [2, 1, 1], [1, 0, 1]], label: '', color: 'var(--chart-3)', opacity: 0.25 },
        { points: [[0, 0, 0], [0, 1, 1], [1, 1, 2], [1, 0, 1]], label: '', color: 'var(--chart-2)', opacity: 0.25 },
      ],
      showGrid: false,
    },
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The distance of the point $(1, 2, 3)$ from the plane $2x - y + 2z - 5 = 0$ is:`,
    options: ['1', '1/3', '2/3', '3'],
    correctAnswer: 'B',
    solutionText: `**Point-to-plane distance formula:**
$$d = \\frac{|ax_0 + by_0 + cz_0 + d|}{\\sqrt{a^2+b^2+c^2}}$$

**Substituting** $(x_0,y_0,z_0) = (1,2,3)$ with $(a,b,c,d) = (2,-1,2,-5)$:
$$d = \\frac{|2(1) - 2 + 2(3) - 5|}{\\sqrt{4+1+4}} = \\frac{|2 - 2 + 6 - 5|}{3} = \\frac{1}{3}$$

**Why the others are wrong:** (A) 1 forgets the $\\sqrt9 = 3$ divisor; (C) 2/3 mis-evaluates the numerator as 2; (D) 3 is the denominator alone.`,
    formulaConcept: 'Plane distance $= |ax_0+by_0+cz_0+d|/\\sqrt{a^2+b^2+c^2}$ — the normal vector length does the dividing.',
    difficulty: 'HARD', chapterSlug: 'three-dimensional-geometry', topicSlug: 'planes',
    sourceType: 'ORIGINAL', sourceNote: 'Direct plane-distance computation.',
    diagram: {
      kind: 'v3d',
      axesLength: 3.2,
      points: [
        { x: 1, y: 2, z: 3, label: 'P (1,2,3)', color: 'var(--gold)' },
        { x: 0.78, y: 2.11, z: 2.78, label: 'Q (foot)', color: 'var(--chart-2)' },
      ],
      planes: [
        { points: [[2.5, 0, 0], [0, -5, 0], [0, 0, 2.5]], label: '2x − y + 2z = 5', color: 'var(--chart-3)', opacity: 0.3 },
      ],
      vectors: [
        { from: [1, 2, 3], to: [0.78, 2.11, 2.78], label: 'd = 1/3', color: 'var(--gold)' },
      ],
      showGrid: false,
    },
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `A binomial variate $X$ has mean 4 and variance 2. The probability of exactly 2 successes is:`,
    options: ['1/16', '7/32', '7/64', '7/128'],
    correctAnswer: 'C',
    solutionText: `For $X \\sim B(n, p)$:
$$np = 4, \\qquad npq = 2 \\implies q = \\frac{npq}{np} = \\frac{2}{4} = \\frac{1}{2}$$

So $p = 1 - q = 1/2$ and $n = \\dfrac{4}{p} = 8$.

**Exactly 2 successes:**
$$P(X=2) = \\binom{8}{2} \\left(\\frac{1}{2}\\right)^2 \\left(\\frac{1}{2}\\right)^6 = 28 \\times \\frac{1}{2^8} = \\frac{28}{256} = \\frac{7}{64}$$

**Why the others are wrong:** (A) 1/16 = 2⁴⁻¹-ish confusion of the powers; (B) 7/32 forgets one factor of 2 (uses $2^7$); (D) 7/128 uses $2^9$ with $\\binom{8}{2} = 14$-style slip.`,
    formulaConcept: 'Binomial: mean $= np$, variance $= npq$ → recover $q, p, n$, then $P(X=k) = \\binom{n}{k}p^kq^{n-k}$.',
    difficulty: 'HARD', chapterSlug: 'probability', topicSlug: 'binomial-distribution',
    sourceType: 'ORIGINAL', sourceNote: 'Mean/variance to full distribution.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The variance of the first 10 natural numbers is:`,
    options: ['8.25', '8', '9', '2.87'],
    correctAnswer: 'A',
    solutionText: `**Mean:**
$$\\bar x = \\frac{1+2+\\dots+10}{10} = \\frac{55}{10} = 5.5$$

**Sums needed:** $\\sum x = 55$, $\\sum x^2 = 385$:
$$\\sigma^2 = \\frac{\\sum x^2}{n} - \\bar x^2 = \\frac{385}{10} - (5.5)^2 = 38.5 - 30.25 = 8.25$$

**Closed form check** — variance of first $n$ naturals $= \\dfrac{n^2-1}{12}$:
$$\\frac{100 - 1}{12} = \\frac{99}{12} = 8.25 \\checkmark$$

**Why the others are wrong:** (B) 8 rounds down wrongly; (C) 9 = $\\dfrac{n^2+?}{...}$ guess; (D) 2.87 is the **standard deviation** ($\\sqrt{8.25} \\approx 2.87$), not the variance.`,
    formulaConcept: 'Variance $= \\sum x^2/n - \\bar{x}^2$; for $1..n$ it is $(n^2-1)/12$.',
    difficulty: 'MODERATE', chapterSlug: 'statistics', topicSlug: 'dispersion',
    sourceType: 'ORIGINAL', sourceNote: 'Population variance of 1..10.',
    diagram: {
      kind: 'table',
      headers: ['k', 'xₖ', 'xₖ²'],
      rows: [
        [1, 1, 1], [2, 2, 4], [3, 3, 9], [4, 4, 16], [5, 5, 25],
        [6, 6, 36], [7, 7, 49], [8, 8, 64], [9, 9, 81], [10, 10, 100],
        ['Σ', 55, 385],
      ],
      caption: 'variance = 385/10 − 5.5² = 8.25',
      highlightCells: [[10, 1], [10, 2]],
    },
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The value of $\\tan^{-1} 1 + \\tan^{-1} 2 + \\tan^{-1} 3$ is:`,
    options: ['π/2', '3π/4', 'π/3', 'π'],
    correctAnswer: 'D',
    solutionText: `**Combine the last two terms** with the addition formula $\\tan^{-1}x + \\tan^{-1}y = \\pi + \\tan^{-1}\\dfrac{x+y}{1-xy}$ (valid since $xy = 6 > 1$ and $x, y > 0$):
$$\\tan^{-1}2 + \\tan^{-1}3 = \\pi + \\tan^{-1}\\frac{5}{1-6} = \\pi + \\tan^{-1}(-1) = \\pi - \\frac{\\pi}{4} = \\frac{3\\pi}{4}$$

**Add the first term:**
$$\\tan^{-1}1 + \\frac{3\\pi}{4} = \\frac{\\pi}{4} + \\frac{3\\pi}{4} = \\pi$$

**Why the others are wrong:** (A) π/2 ignores the branch correction (naively: $\\tan^{-1}\\infty$ thinking); (B) 3π/4 stops after combining two terms only; (C) π/3 is a wild distractor. The principal-branch trap is the whole point — the naive formula without the $+\\pi$ gives $-\\pi/4$ for the pair, leading to 0.`,
    formulaConcept: 'For $x,y>0,\\ xy>1$: $\\tan^{-1}x + \\tan^{-1}y = \\pi + \\tan^{-1}\\frac{x+y}{1-xy}$ — mind the branch.',
    difficulty: 'HARD', chapterSlug: 'trigonometry', topicSlug: 'inverse-trig-functions',
    sourceType: 'ORIGINAL', sourceNote: 'Branch-correct inverse tangent sum.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `In a triangle $ABC$ with sides $a = 5$, $b = 12$, $c = 13$, the inradius $r$ of the triangle is:`,
    options: ['1', '2', '3', '2.5'],
    correctAnswer: 'B',
    solutionText: `First notice $5^2 + 12^2 = 25 + 144 = 169 = 13^2$ — the triangle is **right-angled** (right angle between the legs 5 and 12).

**Semi-perimeter and area:**
$$s = \\frac{5+12+13}{2} = 15, \\qquad \\Delta = \\tfrac12 \\times 5 \\times 12 = 30$$

**Inradius:**
$$r = \\frac{\\Delta}{s} = \\frac{30}{15} = 2$$

(For any right triangle with legs $p, q$ and hypotenuse $h$: $r = \\tfrac{p+q-h}{2} = \\tfrac{5+12-13}{2} = 2$ ✓ — a handy shortcut.)

**Why the others are wrong:** (A) 1 = $(5+13-12)/2$-style mixing of sides; (C) 3 would be the exradius-scale guess; (D) 2.5 is half the smallest side.`,
    formulaConcept: '$r = \\Delta/s$ (area over semi-perimeter); right triangle shortcut $r = (p+q-h)/2$.',
    difficulty: 'MODERATE', chapterSlug: 'trigonometry', topicSlug: 'properties-of-triangles',
    sourceType: 'ORIGINAL', sourceNote: 'Right-triangle inradius via area.',
    diagram: {
      kind: 'geometry',
      xRange: [-2, 15],
      yRange: [-2, 8],
      elements: [
        { type: 'polygon', points: [[0, 0], [12, 0], [0, 5]], label: '', color: 'var(--gold)', fill: 'transparent' },
        { type: 'point', x: 0, y: 0, label: 'A (right angle)', labelPos: 'SW' },
        { type: 'point', x: 12, y: 0, label: 'B', labelPos: 'SE' },
        { type: 'point', x: 0, y: 5, label: 'C', labelPos: 'NW' },
        { type: 'circle', cx: 2, cy: 2, r: 2, label: 'r = 2', color: 'var(--chart-2)' },
        { type: 'segment', from: [0, 5], to: [12, 0], label: 'c = 13', color: 'var(--chart-3)' },
        { type: 'label', x: 6, y: -1.2, text: 'b = 12', color: 'var(--chart-3)' },
        { type: 'label', x: -1.3, y: 2.5, text: 'a = 5', color: 'var(--chart-3)' },
      ],
      showGrid: false,
      title: '5–12–13 triangle with incircle',
    },
  },
  // ---------------- SECTION B (numerical) Q71–Q75 ----------------
  {
    subject: 'MATHEMATICS', section: 'B',
    text: `The number of real solutions of the equation $x^2 - 5|x| + 6 = 0$ is:`,
    correctAnswer: '4',
    solutionText: `Case split on the absolute value.

**Case 1: $x \\ge 0$.** Then $|x| = x$:
$$x^2 - 5x + 6 = 0 \\implies (x-2)(x-3) = 0 \\implies x = 2, 3$$
Both satisfy $x \\ge 0$ ✓ — two solutions.

**Case 2: $x < 0$.** Then $|x| = -x$:
$$x^2 + 5x + 6 = 0 \\implies (x+2)(x+3) = 0 \\implies x = -2, -3$$
Both satisfy $x < 0$ ✓ — two more solutions.

**Total:** $x \\in \\{-3, -2, 2, 3\\}$ → **4 real solutions**.

Equivalently, put $t = |x| \\ge 0$: $t^2 - 5t + 6 = 0$ gives $t = 2, 3$; each positive $t$ yields two $x$ values ($\\pm t$).`,
    formulaConcept: 'Substitute $t = |x|$: a quadratic in $t$ with positive roots gives 2 roots each for $x = \\pm t$.',
    difficulty: 'MODERATE', chapterSlug: 'quadratic-equations', topicSlug: 'roots-nature',
    sourceType: 'ORIGINAL', sourceNote: 'Absolute-value quadratic count.',
  },
  {
    subject: 'MATHEMATICS', section: 'B',
    text: `If $A$ is a non-singular $3 \\times 3$ matrix with $|A| = 5$, then $|\\operatorname{adj} A|$ equals:`,
    correctAnswer: '25',
    solutionText: `The adjoint satisfies
$$A\\,(\\operatorname{adj} A) = |A|\\, I_n$$

**Take determinants** (for $n = 3$):
$$|A| \\times |\\operatorname{adj} A| = |\\,|A| I\\,| = |A|^{n} = |A|^3$$

**Solve** (with $|A| = 5 \\ne 0$):
$$|\\operatorname{adj} A| = \\frac{|A|^3}{|A|} = |A|^{n-1} = 5^{2} = 25$$

**General rule:** $|\\operatorname{adj} A| = |A|^{n-1}$ for an $n \\times n$ non-singular matrix — for $3\\times3$, the square.`,
    formulaConcept: '$|\\operatorname{adj} A| = |A|^{n-1}$ — from $A\\,\\operatorname{adj}A = |A|I_n$ by taking determinants.',
    difficulty: 'HARD', chapterSlug: 'matrices-determinants', topicSlug: 'inverse-and-systems',
    sourceType: 'ORIGINAL', sourceNote: 'Adjoint determinant identity.',
  },
  {
    subject: 'MATHEMATICS', section: 'B',
    text: `The area (in square units, round off to two decimals) of the region bounded by the curves $y = x^2$ and $y = 2x$ is:`,
    correctAnswer: '1.33',
    solutionText: `**Intersection points:** $x^2 = 2x \\implies x(x - 2) = 0 \\implies x = 0, 2$ — the curves meet at $(0,0)$ and $(2,4)$.

Between them, the line lies **above** the parabola ($2x \\ge x^2$ on $[0,2]$):
$$A = \\int_0^2 (2x - x^2)\\,dx$$

**Evaluate:**
$$A = \\left[ x^2 - \\frac{x^3}{3} \\right]_0^2 = 4 - \\frac{8}{3} = \\frac{4}{3} \\approx 1.33$$

**Sanity check:** the region sits inside the 2×4 bounding box (area 8) and looks like a thin crescent — $\\approx 1.3$ is plausible.`,
    formulaConcept: 'Area between curves: $\\int_a^b (y_{top} - y_{bottom})dx$ between intersection abscissae.',
    difficulty: 'HARD', chapterSlug: 'integral-calculus', topicSlug: 'area-under-curves',
    sourceType: 'ORIGINAL', sourceNote: 'Parabola–line region with shaded diagram.',
    diagram: {
      kind: 'graph',
      title: 'region between y = x² and y = 2x',
      xAxis: { label: 'x', min: -0.5, max: 2.5, ticks: [0, 1, 2] },
      yAxis: { label: 'y', min: -0.5, max: 4.5, ticks: [1, 2, 4] },
      curves: [
        { type: 'curve', color: 'var(--chart-2)', points: [[-0.4, 0.16], [0, 0], [0.5, 0.25], [1, 1], [1.5, 2.25], [2, 4], [2.4, 5.76]] },
        { type: 'line', color: 'var(--gold)', points: [[-0.2, -0.4], [2.2, 4.4]] },
      ],
      shadedRegions: [{ points: [[0, 0], [2, 4], [1.5, 2.25], [1, 1], [0.5, 0.25]], color: 'var(--gold)' }],
      markers: [
        { x: 1, y: 1, label: '(1, 1)' },
        { x: 2, y: 4, label: '(2, 4)' },
      ],
    },
  },
  {
    subject: 'MATHEMATICS', section: 'B',
    text: `A man is known to speak the truth 3 times out of 4. He throws a die and reports that a six showed up. The probability that a six actually showed up (round off to three decimals) is:`,
    correctAnswer: '0.375',
    solutionText: `**Bayes' theorem on the report "six".**

Let $S$ = "a six was rolled" and $R$ = "he reports six".

- $P(S) = 1/6$; $P(S') = 5/6$
- Truth-teller: $P(R|S) = 3/4$ (he truthfully reports the six)
- Liar: when the die shows non-six ($S'$), he *must* claim six to lie about it specifically: $P(R|S') = 1/4$

**Total probability of the report:**
$$P(R) = P(R|S)P(S) + P(R|S')P(S') = \\frac{3}{4}\\cdot\\frac{1}{6} + \\frac{1}{4}\\cdot\\frac{5}{6} = \\frac{3}{24} + \\frac{5}{24} = \\frac{8}{24}$$

**Bayes:**
$$P(S|R) = \\frac{\\frac{3}{24}}{\\frac{8}{24}} = \\frac{3}{8} = 0.375$$

Even though he is honest 75% of the time, the prior odds of a six (1/6) are weak enough that a report is only 37.5% reliable — Bayes' lesson in a single number.`,
    formulaConcept: 'Bayes: posterior $\\propto$ likelihood × prior; add the liar\'s false-report path in the denominator.',
    difficulty: 'VERY_HARD', chapterSlug: 'probability', topicSlug: 'total-probability-bayes',
    sourceType: 'ORIGINAL', sourceNote: 'Truth-telling die report.',
  },
  {
    subject: 'MATHEMATICS', section: 'B',
    text: `If $\\vec a + \\vec b + \\vec c = \\vec 0$ with $|\\vec a| = 3$, $|\\vec b| = 5$ and $|\\vec c| = 7$, then the angle (in degrees) between $\\vec a$ and $\\vec b$ is:`,
    correctAnswer: '60',
    solutionText: `From $\\vec c = -(\\vec a + \\vec b)$, so
$$|\\vec c|^2 = |\\vec a + \\vec b|^2 = |\\vec a|^2 + |\\vec b|^2 + 2\\,\\vec a\\cdot\\vec b$$

**Substituting the magnitudes:**
$$49 = 9 + 25 + 2\\,\\vec a\\cdot\\vec b \\implies \\vec a\\cdot\\vec b = \\frac{49 - 34}{2} = \\frac{15}{2}$$

**Angle between $\\vec a$ and $\\vec b$:**
$$\\cos\\theta = \\frac{\\vec a\\cdot\\vec b}{|\\vec a||\\vec b|} = \\frac{15/2}{15} = \\frac{1}{2} \\implies \\theta = 60^\\circ$$

The three magnitudes $3, 5, 7$ closing into a triangle is no accident — vectors summing to zero form a triangle, and the angle between $\\vec a$ and $\\vec b$ is the **external** angle of that triangle at their common vertex (here $120^\\circ$ internal → $60^\\circ$ between the vectors placed tail-to-tail... in fact $\\vec a \\cdot \\vec b$ directly measures the tail-to-tail angle, which is $60^\\circ$).`,
    formulaConcept: 'Closure $\\vec a+\\vec b+\\vec c = 0$: use $|\\vec c|^2 = |\\vec a|^2 + |\\vec b|^2 + 2\\vec a\\cdot\\vec b$ to extract the dot product.',
    difficulty: 'HARD', chapterSlug: 'vector-algebra', topicSlug: 'dot-product',
    sourceType: 'ORIGINAL', sourceNote: 'Closed-vector-triangle angle.',
  },
]
