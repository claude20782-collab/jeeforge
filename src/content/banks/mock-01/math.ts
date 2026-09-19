import type { SeedQuestion } from '@/content/types'

// ============================================================================
// MOCK 01 — MATHEMATICS (Q51–Q75: 20 MCQ Section A + 5 numerical Section B)
// Difficulty target: Hard JEE Main. All questions verified; solutions complete.
// ============================================================================

export const MATHEMATICS_MOCK01: SeedQuestion[] = [
  // ---------------- SECTION A (MCQ) Q51–Q70 ----------------
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `If $\\alpha$ and $\\beta$ are the roots of $x^2 - x + 1 = 0$, then the value of $\\alpha^{2057} + \\beta^{2057}$ is:`,
    options: ['−1', '2', '−2', '1'],
    correctAnswer: 'D',
    solutionText: `The roots of $x^2 - x + 1 = 0$ are
$$\\alpha, \\beta = \\frac{1 \\pm i\\sqrt{3}}{2} = e^{\\pm i\\pi/3}$$

so $\\alpha^6 = \\beta^6 = 1$ — they are primitive 6th roots of unity.

**Reduce the power mod 6:**
$$2057 = 6 \\times 342 + 5 \\implies \\alpha^{2057} = \\alpha^5,\\ \\beta^{2057} = \\beta^5$$

**Compute the power sums $s_k = \\alpha^k + \\beta^k$** via the recurrence from the equation $x^2 = x - 1$ (i.e. $s_k = s_{k-1} - s_{k-2}$), with $s_0 = 2,\\ s_1 = 1$:
$$s_2 = 1 - 2 = -1,\\quad s_3 = -1 - 1 = -2,\\quad s_4 = -2+1 = -1,\\quad s_5 = -1 + 2 = 1,\\quad s_6 = 1+1 = 2 = s_0$$

The sequence is periodic with period 6: $2, 1, -1, -2, -1, 1, \\dots$

$$s_{2057} = s_5 = \\boxed{1}$$`,
    formulaConcept: 'Roots of $x^2 - x + 1 = 0$ are $e^{\\pm i\\pi/3}$ (6th roots of unity); power sums satisfy $s_k = s_{k-1} - s_{k-2}$ with period 6.',
    difficulty: 'HARD', chapterSlug: 'quadratic-equations', topicSlug: 'roots-nature',
    sourceType: 'ORIGINAL', sourceNote: 'High-power root-sum via periodicity.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The sum $\\displaystyle\\sum_{n=1}^{\\infty} \\frac{n(n+1)}{2^n}$ equals:`,
    options: ['4', '8', '6', '16'],
    correctAnswer: 'B',
    solutionText: `Use the standard generating-function identity (valid for $|x| < 1$):
$$\\sum_{n=1}^{\\infty} n(n+1)x^n = \\frac{2x}{(1-x)^3}$$

*(Derivation: differentiate $\\sum x^{n+1} = \\frac{x^2}{1-x}$ twice — each differentiation brings down an $n$ factor.)*

**Substitute $x = \\tfrac{1}{2}$:**
$$\\sum_{n=1}^{\\infty} \\frac{n(n+1)}{2^n} = \\frac{2\\times\\tfrac{1}{2}}{\\left(1 - \\tfrac{1}{2}\\right)^3} = \\frac{1}{\\tfrac{1}{8}} = 8$$

*Sanity check by partial sums:* the first few terms are $\\frac{2}{2} + \\frac{6}{4} + \\frac{12}{8} + \\frac{20}{16} + \\cdots = 1 + 1.5 + 1.5 + 1.25 + \\dots$ — the partial sums climb towards 8 ✓.`,
    formulaConcept: '$\\sum n(n+1)x^n = 2x/(1-x)^3$ for $|x|<1$.',
    difficulty: 'HARD', chapterSlug: 'sequences-and-series', topicSlug: 'special-series',
    sourceType: 'ORIGINAL', sourceNote: 'Power-series summation.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The number of ways to distribute 10 identical candies among 4 children such that each child receives at least one candy and no child receives more than 4 is:`,
    options: ['84', '80', '44', '40'],
    correctAnswer: 'C',
    solutionText: `We count integer solutions of
$$x_1 + x_2 + x_3 + x_4 = 10, \\qquad 1 \\le x_i \\le 4$$

**Substitute** $y_i = x_i - 1 \\ge 0$, so $\\sum y_i = 6$ with $y_i \\le 3$.

By inclusion–exclusion on the upper bounds:
- **Without the upper bound:** $\\binom{6+3}{3} = \\binom{9}{3} = 84$
- **Subtract cases with some $y_i \\ge 4$:** choose the child (4 ways), set $z_i = y_i - 4 \\ge 0$, so $\\sum z + \\text{others} = 2$: $\\binom{2+3}{3} = \\binom{5}{3} = 10$ each → $4 \\times 10 = 40$
- **Two children $\\ge 4$:** needs $\\ge 8 > 6$ — impossible.

$$\\text{Total} = 84 - 40 = 44$$

*Direct enumeration check:* partitions of 6 into 4 parts each ≤ 3 (as $y_i$): $(3,3,0,0)$: 6 ways; $(3,2,1,0)$: 24; $(3,1,1,1)$: 4; $(2,2,2,0)$: 4; $(2,2,1,1)$: 6 → $6+24+4+4+6 = 44$ ✓`,
    formulaConcept: 'Bounded stars-and-bars via inclusion–exclusion: $\\binom{n+k-1}{k-1} - \\sum \\binom{n-u+k-1}{k-1} + \\cdots$',
    difficulty: 'HARD', chapterSlug: 'permutations-combinations', topicSlug: 'distributions',
    sourceType: 'ORIGINAL', sourceNote: 'Bounded distribution with inclusion–exclusion.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The coefficient of $x^5$ in the expansion of $(1+x)^2 + (1+x)^3 + \\dots + (1+x)^{50}$ is:`,
    options: ['$\\binom{51}{6}$', '$\\binom{50}{6}$', '$\\binom{51}{5}$', '$\\binom{50}{5}$'],
    correctAnswer: 'A',
    solutionText: `The coefficient of $x^5$ in the sum is the sum of the coefficients of $x^5$ in each term:
$$\\sum_{k=2}^{50} \\binom{k}{5} = \\binom{2}{5} + \\binom{3}{5} + \\dots + \\binom{50}{5}$$

Since $\\binom{k}{5} = 0$ for $k < 5$, this is
$$\\sum_{k=5}^{50} \\binom{k}{5}$$

**Apply the hockey-stick identity:**
$$\\sum_{k=r}^{n} \\binom{k}{r} = \\binom{n+1}{r+1}$$

With $r = 5,\\ n = 50$:
$$\\sum_{k=5}^{50}\\binom{k}{5} = \\binom{51}{6}$$

Hence the required coefficient is $\\binom{51}{6} = 18{,}009{,}460$.

*(Why not $\\binom{51}{5}$? That would be the sum of $\\binom{k}{4}$ — off by one in the lower index, the classic slip.)*`,
    formulaConcept: 'Hockey-stick identity: $\\sum_{k=r}^{n}\\binom{k}{r} = \\binom{n+1}{r+1}$.',
    difficulty: 'HARD', chapterSlug: 'binomial-theorem', topicSlug: 'binomial-series',
    sourceType: 'ORIGINAL', sourceNote: 'Hockey-stick coefficient sum.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `If $A$ is a $3 \\times 3$ matrix with $\\det(A) = 2$, then $\\det\\left(\\text{adj}\\left(A^{-1}\\right)\\right)$ equals:`,
    options: ['$4$', '$\\dfrac{1}{4}$', '$\\dfrac{1}{2}$', '$2$'],
    correctAnswer: 'B',
    solutionText: `**Key facts** (for $n \\times n$ matrices):
1. $\\det(A^{-1}) = \\dfrac{1}{\\det A}$
2. $\\det(\\text{adj}\\, B) = (\\det B)^{n-1}$

**Step 1:**
$$\\det(A^{-1}) = \\frac{1}{\\det A} = \\frac{1}{2}$$

**Step 2** (with $n = 3$, so $n - 1 = 2$):
$$\\det\\left(\\text{adj}\\left(A^{-1}\\right)\\right) = \\left(\\det(A^{-1})\\right)^{2} = \\left(\\frac{1}{2}\\right)^2 = \\frac{1}{4}$$

(Choosing 4 forgets the inversion — that would be $\\det(\\text{adj } A) = 2^2$; choosing 1/2 forgets to square.)`,
    formulaConcept: '$\\det(A^{-1}) = 1/\\det A$; $\\det(\\text{adj } B) = (\\det B)^{n-1}$.',
    difficulty: 'HARD', chapterSlug: 'matrices-determinants', topicSlug: 'inverse-and-systems',
    sourceType: 'ORIGINAL', sourceNote: 'Adj/inverse determinant identity chain.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `If $z$ is a complex number with $|z| = 2$, then the **maximum** value of $|z + \\tfrac{1}{z}|$ is:`,
    options: ['$2$', '$3$', '$4$', '$\\dfrac{5}{2}$'],
    correctAnswer: 'D',
    solutionText: `Write $z = 2(\\cos\\theta + i\\sin\\theta)$. Then
$$\\frac{1}{z} = \\frac{1}{2}(\\cos\\theta - i\\sin\\theta)$$

So
$$z + \\frac{1}{z} = \\left(2 + \\frac{1}{2}\\right)\\cos\\theta + i\\left(2 - \\frac{1}{2}\\right)\\sin\\theta = \\frac{5}{2}\\cos\\theta + \\frac{3}{2}i\\sin\\theta$$

**The locus is an ellipse** with semi-axes $\\tfrac{5}{2}$ (real) and $\\tfrac{3}{2}$ (imaginary). The maximum modulus of a point on this ellipse is the larger semi-axis:
$$\\max\\left|z + \\frac{1}{z}\\right| = \\frac{5}{2}$$

attained at $\\theta = 0$ or $\\pi$ (i.e. $z = \\pm 2$). (2 is the minimum on the real axis? At $\\theta = \\pi/2$: $|\\tfrac{3}{2}i| = 3/2$; the maximum over the ellipse is indeed 5/2, attained on the major axis.)`,
    formulaConcept: 'On $|z|=r$: $z + 1/z$ traces the ellipse $\\left(\\frac{x}{r+1/r}\\right)^2 + \\left(\\frac{y}{r-1/r}\\right)^2 = 1$; max modulus $= r + 1/r$.',
    difficulty: 'HARD', chapterSlug: 'complex-numbers', topicSlug: 'argand-plane',
    sourceType: 'ORIGINAL', sourceNote: 'Ellipse-locus maximisation.',
    diagram: {
      kind: 'geometry',
      xRange: [-3.2, 3.2], yRange: [-2.6, 2.6], showGrid: true,
      title: 'Locus of w = z + 1/z for |z| = 2',
      elements: [
        { type: 'circle', cx: 0, cy: 0, r: 2, dashed: true, color: 'var(--chart-5)', label: 'circle |z| = 2' },
        { type: 'ellipse', cx: 0, cy: 0, a: 2.5, b: 1.5, label: 'w-plane locus' },
        { type: 'line', from: [-3, 0], to: [3, 0], dashed: true, color: 'var(--muted-foreground)' },
        { type: 'line', from: [0, -2.4], to: [0, 2.4], dashed: true, color: 'var(--muted-foreground)' },
        { type: 'point', x: 2, y: 0, label: 'z = 2', labelPos: 'SE', color: 'var(--chart-5)' },
        { type: 'point', x: 2.5, y: 0, label: 'w = 5/2 (max |w|)', labelPos: 'SE' },
        { type: 'point', x: -2, y: 0, label: 'z = −2', labelPos: 'SW', color: 'var(--chart-5)' },
        { type: 'point', x: -2.5, y: 0, label: 'w = −5/2', labelPos: 'SW' },
        { type: 'point', x: 0, y: 2, label: 'z = 2i', labelPos: 'W', color: 'var(--chart-5)' },
        { type: 'point', x: 0, y: 1.5, label: 'w = 3i/2', labelPos: 'E' },
        { type: 'segment', from: [2, 0], to: [2.5, 0], label: 'a = 2.5', color: 'var(--gold)' },
        { type: 'segment', from: [0, 0], to: [0, 1.5], label: 'b = 1.5', color: 'var(--chart-2)' },
      ],
    },
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `A set $A$ has 5 elements. The number of relations on $A$ that are **both reflexive and symmetric** is:`,
    options: ['$2^{10}$', '$2^{15}$', '$2^{20}$', '$2^{5}$'],
    correctAnswer: 'A',
    solutionText: `A relation on $A$ is a subset of $A \\times A$, which has $25$ ordered pairs.

**Reflexivity forces** all 5 diagonal pairs $(a, a)$ to be present — no choice there.

**Symmetry pairs up** the remaining $20$ off-diagonal pairs into $\\binom{5}{2} = 10$ unordered pairs $\\{(a,b), (b,a)\\}$. For each such pair, either **both** elements are included or **neither** is — 2 independent choices per pair.

**Total:**
$$2^{10} = 1024$$

*(For comparison: symmetric relations alone = $2^{15}$ (10 off-diagonal pairs + 5 diagonal free choices), and all relations = $2^{25}$.)*`,
    formulaConcept: 'Reflexive+symmetric relations on an n-set: $2^{n(n-1)/2}$ (diagonal forced, off-diagonal pairs chosen in pairs).',
    difficulty: 'HARD', chapterSlug: 'sets-relations-functions', topicSlug: 'relations',
    sourceType: 'ORIGINAL', sourceNote: 'Counting relations with two properties.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `$\\displaystyle\\lim_{x \\to 0} \\frac{\\sin x - x + \\dfrac{x^3}{6}}{x^5}$ equals:`,
    options: ['$-\\dfrac{1}{120}$', '$\\dfrac{1}{6}$', '$\\dfrac{1}{120}$', '$0$'],
    correctAnswer: 'C',
    solutionText: `Use the Maclaurin expansion of $\\sin x$:
$$\\sin x = x - \\frac{x^3}{6} + \\frac{x^5}{120} - \\dots$$

**Substitute in the numerator:**
$$\\sin x - x + \\frac{x^3}{6} = \\left(x - \\frac{x^3}{6} + \\frac{x^5}{120} - \\dots\\right) - x + \\frac{x^3}{6} = \\frac{x^5}{120} - \\dots$$

All terms below $x^5$ cancel exactly. Hence
$$\\lim_{x\\to 0}\\frac{\\frac{x^5}{120} + O(x^7)}{x^5} = \\frac{1}{120}$$

(The $-1/120$ distractor drops a sign; 1/6 stops at the cubic term — which has already cancelled.)`,
    formulaConcept: '$\\sin x = x - x^3/3! + x^5/5! - \\dots$ — series cancellation for $0/0$ limits.',
    difficulty: 'MODERATE', chapterSlug: 'limits-continuity', topicSlug: 'limits',
    sourceType: 'ORIGINAL', sourceNote: 'Taylor-cancellation limit.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The minimum value of $(x-1)^4 + (x+3)^4$ for real $x$ is:`,
    options: ['16', '8', '64', '32'],
    correctAnswer: 'D',
    solutionText: `Let
$$f(x) = (x-1)^4 + (x+3)^4$$

**Differentiate and set to zero:**
$$f'(x) = 4(x-1)^3 + 4(x+3)^3 = 0 \\implies (x-1)^3 = -(x+3)^3$$

Taking cube roots (monotonic, so safe):
$$x - 1 = -(x+3) \\implies 2x = -2 \\implies x = -1$$

**Minimum value** (by symmetry the critical point is the global minimum since $f \\to \\infty$ at both ends):
$$f(-1) = (-2)^4 + (2)^4 = 16 + 16 = 32$$

*Insight:* the minimum occurs at the midpoint of the centres $1$ and $-3$, i.e. $x = -1$, by symmetry of the two quartic terms.`,
    formulaConcept: 'Minimise $|x-a|^n + |x-b|^n$: by symmetry the minimum is at the midpoint $x = \\frac{a+b}{2}$.',
    difficulty: 'MODERATE', chapterSlug: 'application-of-derivatives', topicSlug: 'maxima-minima',
    sourceType: 'ORIGINAL', sourceNote: 'Symmetric quartic minimisation.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The value of $\\displaystyle\\int_0^{\\pi/2} \\frac{dx}{1 + \\tan^3 x}$ is:`,
    options: ['$\\dfrac{\\pi}{4}$', '$\\dfrac{\\pi}{2}$', '$\\dfrac{\\pi}{8}$', '$\\dfrac{3\\pi}{4}$'],
    correctAnswer: 'A',
    solutionText: `Apply the **King property** $\\displaystyle\\int_0^a f(x)\\,dx = \\int_0^a f(a-x)\\,dx$ with $a = \\pi/2$.

Let
$$I = \\int_0^{\\pi/2}\\frac{dx}{1+\\tan^3 x}$$

Then, replacing $x \\to \\frac{\\pi}{2} - x$ (so $\\tan x \\to \\cot x$):
$$I = \\int_0^{\\pi/2}\\frac{dx}{1+\\cot^3 x} = \\int_0^{\\pi/2}\\frac{\\tan^3 x}{1+\\tan^3 x}\\,dx$$

**Add the two forms:**
$$2I = \\int_0^{\\pi/2}\\frac{1 + \\tan^3 x}{1+\\tan^3 x}\\,dx = \\int_0^{\\pi/2} dx = \\frac{\\pi}{2}$$

$$I = \\frac{\\pi}{4}$$

(This works for *any* odd power of tan — the specific exponent 3 is a red herring.)`,
    formulaConcept: "King's property: $\\int_0^{a} f(x)dx = \\int_0^{a} f(a-x)dx$; pair $f + f(a-x) = 1$ to halve the interval.",
    difficulty: 'HARD', chapterSlug: 'integral-calculus', topicSlug: 'definite-integration',
    sourceType: 'ORIGINAL', sourceNote: 'King-property definite integral.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The area of the region bounded by the parabola $y^2 = 4x$ and the line $y = 2x - 4$ (shown) is:`,
    options: ['18', '$\\dfrac{32}{3}$', '9', '$\\dfrac{16}{3}$'],
    correctAnswer: 'C',
    solutionText: `**Find the intersections.** Write the parabola as $x = \\dfrac{y^2}{4}$ and the line as $x = \\dfrac{y+4}{2}$:
$$\\frac{y^2}{4} = \\frac{y+4}{2} \\implies y^2 = 2y + 8 \\implies y^2 - 2y - 8 = 0 \\implies (y-4)(y+2) = 0$$

The curves meet at $y = -2$ and $y = 4$.

**Integrate with respect to $y$** (right curve − left curve):
$$A = \\int_{-2}^{4}\\left[\\frac{y+4}{2} - \\frac{y^2}{4}\\right]dy$$

**Evaluate:**
$$\\int \\frac{y+4}{2}dy = \\frac{y^2}{4} + 2y, \\qquad \\int\\frac{y^2}{4}dy = \\frac{y^3}{12}$$

At $y = 4$: $4 + 8 - \\tfrac{64}{12} = 12 - \\tfrac{16}{3} = \\tfrac{20}{3}$

At $y = -2$: $1 - 4 + \\tfrac{8}{12} = -3 + \\tfrac{2}{3} = -\\tfrac{7}{3}$

$$A = \\frac{20}{3} - \\left(-\\frac{7}{3}\\right) = \\frac{27}{3} = 9$$`,
    formulaConcept: 'Area between curves: integrate (right − left) $dy$ between intersection ordinates when curves are $x = f(y)$.',
    difficulty: 'HARD', chapterSlug: 'integral-calculus', topicSlug: 'area-under-curves',
    sourceType: 'ORIGINAL', sourceNote: 'Parabola–line area by horizontal strips.',
    diagram: {
      kind: 'geometry',
      xRange: [-1.5, 6], yRange: [-3, 5], showGrid: true,
      title: 'y² = 4x and y = 2x − 4',
      elements: [
        { type: 'parabola', vertex: [0, 0], a: 0.25, xRange: [0, 6], label: 'y² = 4x' },
        { type: 'line', from: [0.5, -3], to: [4.5, 5], label: 'y = 2x − 4' },
        { type: 'polygon', points: [[1, -2], [2.5, 1], [4, 4], [1, 2], [0, 0]], color: 'var(--gold)', fill: 'var(--gold)', label: 'A = 9' },
        { type: 'point', x: 1, y: -2, label: '(1, −2)', labelPos: 'SW' },
        { type: 'point', x: 4, y: 4, label: '(4, 4)', labelPos: 'NE' },
        { type: 'segment', from: [0.25, 1], to: [2.5, 1], dashed: true, color: 'var(--chart-2)', label: 'strip: x from y²/4 to (y+4)/2' },
        { type: 'label', x: 3.2, y: -2.2, text: 'integrate (right − left) dy' },
      ],
    },
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The order and degree of the differential equation
$$\\left(\\frac{d^2y}{dx^2}\\right)^{3/2} - \\left(\\frac{dy}{dx}\\right)^{1/2} = 0$$
(after removing the fractional powers) are respectively:`,
    options: ['2 and 2', '2 and 3', '1 and 3', '3 and 2'],
    correctAnswer: 'B',
    solutionText: `The **order** is the highest derivative present: $\\dfrac{d^2y}{dx^2}$ → order $= 2$.

The **degree** is the power of the highest-order derivative *after* the equation is made a polynomial in derivatives (no fractional powers).

**Remove the fractional powers.** Write the equation as
$$\\left(\\frac{d^2y}{dx^2}\\right)^{3/2} = \\left(\\frac{dy}{dx}\\right)^{1/2}$$

Squaring both sides:
$$\\left(\\frac{d^2y}{dx^2}\\right)^3 = \\frac{dy}{dx}$$

Now the highest-order derivative ($y''$) appears with power **3**.

$$\\text{order} = 2, \\qquad \\text{degree} = 3$$

(Choosing degree 2 forgets that squaring a $3/2$ power gives a cube; degree is only defined once the equation is polynomial in its derivatives.)`,
    formulaConcept: 'Degree = exponent of the highest-order derivative after rationalising the equation into polynomial form.',
    difficulty: 'MODERATE', chapterSlug: 'differential-equations', topicSlug: 'order-degree',
    sourceType: 'ORIGINAL', sourceNote: 'Fractional-power rationalisation trap.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The image of the point $(1, 6)$ in the line $y = x + 1$ (shown) is:`,
    options: ['$(5, 2)$', '$(2, 5)$', '$(-5, -2)$', '$(6, 1)$'],
    correctAnswer: 'A',
    solutionText: `**Find the foot of the perpendicular** from $P(1,6)$ to the line $y = x + 1$ (slope 1).

The perpendicular has slope $-1$ and passes through $(1, 6)$:
$$y - 6 = -(x - 1) \\implies y = -x + 7$$

**Intersect with the mirror line:**
$$x + 1 = -x + 7 \\implies 2x = 6 \\implies x = 3,\\ y = 4$$

Foot $M = (3, 4)$.

**Reflect:** $P' = 2M - P$:
$$P' = (2\\cdot3 - 1,\\ 2\\cdot4 - 6) = (5, 2)$$

*Check:* the midpoint $(3,4)$ lies on $y = x+1$ ✓, and $PP'$ has slope $\\dfrac{2-6}{5-1} = -1$ (perpendicular to the line of slope 1) ✓.`,
    formulaConcept: 'Reflection in $y = x + c$: foot of perpendicular $M$, then image $P\u2032 = 2M \u2212 P$.',
    difficulty: 'MODERATE', chapterSlug: 'straight-lines', topicSlug: 'point-line-distance',
    sourceType: 'ORIGINAL', sourceNote: 'Reflection in an oblique line.',
    diagram: {
      kind: 'geometry',
      xRange: [-1, 7], yRange: [-1, 8], showGrid: true, square: true,
      title: 'Reflection of P(1, 6) in y = x + 1',
      elements: [
        { type: 'line', from: [0, 1], to: [7, 8], label: 'y = x + 1 (mirror, slope 1)' },
        { type: 'point', x: 1, y: 6, label: 'P(1, 6)', labelPos: 'N' },
        { type: 'point', x: 5, y: 2, label: "P'(5, 2)", labelPos: 'E' },
        { type: 'segment', from: [1, 6], to: [5, 2], dashed: true, label: "PP' (slope −1)" },
        { type: 'point', x: 3, y: 4, label: 'M(3, 4) = midpoint', labelPos: 'W' },
        { type: 'angleArc', at: [3, 4], fromDeg: 135, toDeg: 180, r: 20, label: '90°' },
        { type: 'segment', from: [1, 6], to: [3, 4], label: 'd', color: 'var(--chart-2)', dashed: true },
        { type: 'segment', from: [3, 4], to: [5, 2], label: 'd', color: 'var(--chart-2)', dashed: true },
        { type: 'label', x: 5.8, y: 6.5, text: "P' = 2M − P" },
      ],
    },
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The radical axis of the circles $x^2 + y^2 = 4$ and $x^2 + y^2 - 4x + 2y - 4 = 0$ is:`,
    options: ['$2x + y = 0$', '$x - 2y = 0$', '$x + 2y = 0$', '$2x - y = 0$'],
    correctAnswer: 'D',
    solutionText: `The **radical axis** of two circles $S_1 = 0$ and $S_2 = 0$ is $S_1 - S_2 = 0$.

Here:
$$S_1 = x^2 + y^2 - 4, \\qquad S_2 = x^2 + y^2 - 4x + 2y - 4$$

**Subtract:**
$$S_1 - S_2 = 4x - 2y = 0 \\implies 2x - y = 0$$

The radical axis is the line $2x - y = 0$ (i.e. $y = 2x$). *(Check: subtracting cancels the quadratic terms — always true for two circles, so the radical axis is always a straight line. Here the two circles actually intersect — putting $y = 2x$ into $x^2 + y^2 = 4$ gives $x = \\pm\\tfrac{2}{\\sqrt{5}}$ — so the radical axis is precisely their common chord.)*`,
    formulaConcept: 'Radical axis: $S_1 - S_2 = 0$ (quadratic terms cancel → a line).',
    difficulty: 'MODERATE', chapterSlug: 'circles', topicSlug: 'radical-axis',
    sourceType: 'ORIGINAL', sourceNote: 'Radical axis by subtraction.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `For the parabola $y^2 = 12x$ (shown), the focal distance of the point on it whose ordinate is 6 is:`,
    options: ['3', '9', '6', '4'],
    correctAnswer: 'C',
    solutionText: `Compare $y^2 = 12x$ with $y^2 = 4ax$:
$$4a = 12 \\implies a = 3$$

**Locate the point** with ordinate $y = 6$:
$$6^2 = 12x \\implies x = 3$$

So the point is $P(3, 6)$, and the focus is $S(a, 0) = (3, 0)$.

**Focal distance:**
$$SP = x + a = 3 + 3 = 6$$

*(Alternatively, directly: $SP = \\sqrt{(3-3)^2 + (6-0)^2} = 6$ ✓ — here the point happens to lie directly above the focus.)*

The focal distance of any point $(x_1, y_1)$ on $y^2 = 4ax$ equals $x_1 + a$ — the defining reflection property of the parabola.`,
    formulaConcept: "Parabola $y^2 = 4ax$: focal distance of point $(x_1,y_1)$ is $x_1 + a$; focus at $(a,0)$.",
    difficulty: 'MODERATE', chapterSlug: 'conic-sections', topicSlug: 'parabola',
    sourceType: 'ORIGINAL', sourceNote: 'Focal distance computation.',
    diagram: {
      kind: 'geometry',
      xRange: [-4, 6.5], yRange: [-7, 7], showGrid: true,
      title: 'y² = 12x (a = 3)',
      elements: [
        { type: 'parabola', vertex: [0, 0], a: 0.25, xRange: [0, 6], label: 'y² = 12x' },
        { type: 'line', from: [-3, 3], to: [-3, -3], dashed: true, color: 'var(--chart-4)', label: 'directrix x = −3' },
        { type: 'point', x: 3, y: 0, label: 'S(3, 0) = focus', labelPos: 'S' },
        { type: 'point', x: 3, y: 6, label: 'P(3, 6)', labelPos: 'N' },
        { type: 'point', x: 0, y: 0, label: 'V(0, 0)', labelPos: 'SW' },
        { type: 'segment', from: [3, 0], to: [3, 6], label: 'SP = x₁ + a = 6', color: 'var(--chart-3)' },
        { type: 'segment', from: [-3, 6], to: [3, 6], dashed: true, color: 'var(--chart-2)', label: "dist. to directrix = x₁ + a = 6" },
        { type: 'line', from: [-4, 0], to: [6, 0], dashed: true },
        { type: 'point', x: -3, y: 6, label: 'M_d(−3, 6)', labelPos: 'NW', color: 'var(--chart-2)' },
      ],
    },
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `If the length of the latus rectum of an ellipse is equal to half of its minor axis, then the eccentricity of the ellipse is:`,
    options: ['$\\dfrac{1}{2}$', '$\\dfrac{\\sqrt{3}}{2}$', '$\\dfrac{1}{\\sqrt{2}}$', '$\\dfrac{2}{\\sqrt{3}}$'],
    correctAnswer: 'B',
    solutionText: `For the ellipse $\\dfrac{x^2}{a^2} + \\dfrac{y^2}{b^2} = 1$ ($a > b$):
- Latus rectum: $\\text{LR} = \\dfrac{2b^2}{a}$
- Eccentricity: $e^2 = 1 - \\dfrac{b^2}{a^2}$

**Given condition:** the latus rectum equals half the minor axis. The minor axis is $2b$, so half of it is $b$:
$$\\frac{2b^2}{a} = b$$

Since $b \\neq 0$:
$$\\frac{2b}{a} = 1 \\implies b = \\frac{a}{2}$$

**Eccentricity:**
$$e^2 = 1 - \\frac{b^2}{a^2} = 1 - \\frac{1}{4} = \\frac{3}{4} \\implies e = \\frac{\\sqrt{3}}{2}$$

(Note: the latus rectum is $\\frac{2b^2}{a}$, and "half the minor axis" is $b$, not $\\frac{b}{2}$ of that — reading the condition correctly is the whole trick.)`,
    formulaConcept: 'Ellipse: LR = 2b²/a; e² = 1 − b²/a². "Half the minor axis" = b.',
    difficulty: 'HARD', chapterSlug: 'conic-sections', topicSlug: 'ellipse',
    sourceType: 'ORIGINAL', sourceNote: 'Latus-rectum condition on eccentricity.',
    diagram: {
      kind: 'geometry',
      xRange: [-3, 3], yRange: [-1.8, 1.8], showGrid: true,
      title: 'Ellipse with b = a/2 (a = 2, b = 1)',
      elements: [
        { type: 'ellipse', cx: 0, cy: 0, a: 2, b: 1 },
        { type: 'point', x: 2, y: 0, label: 'A(a, 0)', labelPos: 'SE' },
        { type: 'point', x: -2, y: 0, label: "A'", labelPos: 'SW' },
        { type: 'point', x: 0, y: 1, label: 'B(0, b = a/2)', labelPos: 'NW' },
        { type: 'point', x: 1.73, y: 0, label: 'F₁(√3, 0)', labelPos: 'NE', color: 'var(--chart-3)' },
        { type: 'point', x: -1.73, y: 0, label: 'F₂(−√3, 0)', labelPos: 'NW', color: 'var(--chart-3)' },
        { type: 'line', from: [2, 0], to: [0, 0], dashed: true, label: 'a = 2' },
        { type: 'line', from: [0, 0], to: [0, 1], dashed: true, label: 'b = 1' },
        { type: 'segment', from: [1.73, 0.5], to: [1.73, -0.5], color: 'var(--chart-5)', label: 'LR = 2b²/a = 1' },
        { type: 'segment', from: [-1.73, 0.5], to: [-1.73, -0.5], color: 'var(--chart-5)' },
      ],
    },
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `If $\\vec{a} = \\hat{i} + \\hat{j}$, $\\vec{b} = \\hat{j} + \\hat{k}$ and $\\vec{c} = \\hat{k} + \\hat{i}$, then $\\vec{a}\\cdot(\\vec{b} \\times \\vec{c})$ equals:`,
    options: ['2', '0', '1', '4'],
    correctAnswer: 'A',
    solutionText: `The scalar triple product is the determinant of the components:
$$\\vec{a}\\cdot(\\vec{b}\\times\\vec{c}) = \\begin{vmatrix} 1 & 1 & 0 \\\\ 0 & 1 & 1 \\\\ 1 & 0 & 1 \\end{vmatrix}$$

**Expand along the first row:**
$$= 1\\begin{vmatrix}1&1\\\\0&1\\end{vmatrix} - 1\\begin{vmatrix}0&1\\\\1&1\\end{vmatrix} + 0\\begin{vmatrix}0&1\\\\1&0\\end{vmatrix}$$
$$= 1(1 - 0) - 1(0 - 1) + 0 = 1 + 1 = 2$$

So $\\vec{a}\\cdot(\\vec{b}\\times\\vec{c}) = 2$.

*(Geometrically, $|[\\vec a\\,\\vec b\\,\\vec c]| = 2$ is the volume of the parallelepiped spanned by $\\vec a, \\vec b, \\vec c$.)*`,
    formulaConcept: 'Scalar triple product $[\\vec a\\,\\vec b\\,\\vec c]$ = determinant of components; geometrically the volume of the parallelepiped.',
    difficulty: 'MODERATE', chapterSlug: 'vector-algebra', topicSlug: 'scalar-triple-product',
    sourceType: 'ORIGINAL', sourceNote: 'Unit-vector triple product.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The angle between two lines whose direction ratios are $(2, 3, 6)$ and $(1, 2, 2)$ (vectors shown) is:`,
    options: ['$\\sin^{-1}\\left(\\dfrac{20}{21}\\right)$', '$\\tan^{-1}\\left(\\dfrac{20}{21}\\right)$', '$\\cos^{-1}\\left(\\dfrac{2}{3}\\right)$', '$\\cos^{-1}\\left(\\dfrac{20}{21}\\right)$'],
    correctAnswer: 'D',
    solutionText: `The angle $\\theta$ between directions $\\vec{u} = (2,3,6)$ and $\\vec{v} = (1,2,2)$ satisfies
$$\\cos\\theta = \\frac{|\\vec{u}\\cdot\\vec{v}|}{|\\vec{u}||\\vec{v}|}$$

**Dot product:**
$$\\vec{u}\\cdot\\vec{v} = 2(1) + 3(2) + 6(2) = 2 + 6 + 12 = 20$$

**Magnitudes:**
$$|\\vec{u}| = \\sqrt{4+9+36} = \\sqrt{49} = 7, \\qquad |\\vec{v}| = \\sqrt{1+4+4} = 3$$

**Hence**
$$\\cos\\theta = \\frac{20}{7\\times3} = \\frac{20}{21} \\implies \\theta = \\cos^{-1}\\left(\\frac{20}{21}\\right)$$

(An acute angle, since the dot product is positive — no absolute-value issues.)`,
    formulaConcept: 'Angle between 3D lines: $\\cos\\theta = \\dfrac{|\\vec u\\cdot\\vec v|}{|\\vec u||\\vec v|}$.',
    difficulty: 'MODERATE', chapterSlug: 'three-dimensional-geometry', topicSlug: 'lines-in-3d',
    sourceType: 'ORIGINAL', sourceNote: 'Direction-ratio angle computation.',
    diagram: {
      kind: 'v3d',
      axesLength: 4,
      vectors: [
        { to: [2, 3, 6], label: 'u = (2,3,6), |u| = 7' },
        { to: [1, 2, 2], label: 'v = (1,2,2), |v| = 3', color: 'var(--chart-5)' },
      ],
      planes: [
        { points: [[0, 0, 0], [2, 3, 6], [1, 2, 2]], label: 'plane of u, v', color: 'var(--chart-4)', opacity: 0.25 },
      ],
      lines: [
        { from: [2, 3, 6], to: [1, 2, 2], dashed: true, color: 'var(--muted-foreground)' },
      ],
      showGrid: true,
    },
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `A box contains three coins: two fair coins and one double-headed coin. A coin is selected at random and tossed. Given that it shows **heads**, the probability that the selected coin was the double-headed one is:`,
    options: ['$\\dfrac{1}{3}$', '$\\dfrac{1}{2}$', '$\\dfrac{2}{3}$', '$\\dfrac{3}{4}$'],
    correctAnswer: 'B',
    solutionText: `Use **Bayes' theorem**. Events: $D$ = "double-headed coin chosen", $F$ = "fair coin chosen"; evidence $H$ = "toss shows heads".

**Prior:**
$$P(D) = \\tfrac{1}{3}, \\qquad P(F) = \\tfrac{2}{3}$$

**Likelihoods:**
$$P(H \\mid D) = 1, \\qquad P(H \\mid F) = \\tfrac{1}{2}$$

**Total probability:**
$$P(H) = \\tfrac{1}{3}(1) + \\tfrac{2}{3}\\left(\\tfrac{1}{2}\\right) = \\tfrac{1}{3} + \\tfrac{1}{3} = \\tfrac{2}{3}$$

**Bayes:**
$$P(D \\mid H) = \\frac{P(H \\mid D)P(D)}{P(H)} = \\frac{\\tfrac{1}{3}}{\\tfrac{2}{3}} = \\frac{1}{2}$$

(Note the answer is *not* $1/3$ — observing heads is *more likely* under the double-headed coin, so the posterior shifts upward from the prior.)`,
    formulaConcept: "Bayes' theorem: $P(D|H) = \\frac{P(H|D)P(D)}{P(H)}$; $P(H) = \\sum P(H|C_i)P(C_i)$.",
    difficulty: 'HARD', chapterSlug: 'probability', topicSlug: 'total-probability-bayes',
    sourceType: 'ORIGINAL', sourceNote: 'Classic conditional coin puzzle.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The marks obtained by 30 students are shown in the frequency table. The mean of the data is:`,
    options: ['6.0', '5.8', '5.9', '6.2'],
    correctAnswer: 'C',
    solutionText: `The mean of a frequency distribution is
$$\\bar{x} = \\frac{\\sum f_i x_i}{\\sum f_i}$$

**Compute $\\sum f_i x_i$:**
$$4(4) + 5(7) + 6(10) + 7(6) + 8(3) = 16 + 35 + 60 + 42 + 24 = 177$$

**Total frequency:**
$$4 + 7 + 10 + 6 + 3 = 30$$

**Mean:**
$$\\bar{x} = \\frac{177}{30} = 5.9$$

(Since the mean of marks 4–8 without weights would be 6, the slight left-skew of frequencies pulls the weighted mean down to 5.9.)`,
    formulaConcept: 'Mean of grouped data: $\\bar x = \\sum f_ix_i / \\sum f_i$.',
    difficulty: 'MODERATE', chapterSlug: 'statistics', topicSlug: 'central-tendency',
    sourceType: 'ORIGINAL', sourceNote: 'Frequency-table mean.',
    diagram: {
      kind: 'table',
      headers: ['Marks (x)', '4', '5', '6', '7', '8'],
      rows: [
        ['No. of students (f)', '4', '7', '10', '6', '3'],
        ['f · x', '16', '35', '60', '42', '24'],
      ],
      caption: 'Σf·x = 177, Σf = 30 → mean = 177/30 = 5.9',
      highlightCells: [[0, 4], [1, 4]],
    },
  },
  // ---------------- SECTION B (numerical) Q71–Q75 ----------------
  {
    subject: 'MATHEMATICS', section: 'B',
    text: `If $\\theta \\in$ (second quadrant) and $\\sin\\theta + \\cos\\theta = \\dfrac{1}{5}$, then the value of $\\sin\\theta$ is: (round off to two decimal places)`,
    correctAnswer: '0.8',
    solutionText: `**Square the given equation:**
$$\\sin^2\\theta + \\cos^2\\theta + 2\\sin\\theta\\cos\\theta = \\frac{1}{25}$$
$$1 + 2\\sin\\theta\\cos\\theta = \\frac{1}{25} \\implies 2\\sin\\theta\\cos\\theta = -\\frac{24}{25}$$

**Then:**
$$(\\sin\\theta - \\cos\\theta)^2 = 1 - 2\\sin\\theta\\cos\\theta = 1 + \\frac{24}{25} = \\frac{49}{25}$$
$$\\sin\\theta - \\cos\\theta = \\pm\\frac{7}{5}$$

**Sign decision:** in the second quadrant $\\sin\\theta > 0 > \\cos\\theta$, so $\\sin\\theta - \\cos\\theta > 0$:
$$\\sin\\theta - \\cos\\theta = \\frac{7}{5}$$

**Solve the linear system** (adding/subtracting with $\\sin\\theta + \\cos\\theta = \\tfrac{1}{5}$):
$$2\\sin\\theta = \\frac{1}{5} + \\frac{7}{5} = \\frac{8}{5} \\implies \\sin\\theta = \\frac{4}{5} = 0.8$$

*(Check: then $\\cos\\theta = -3/5$; indeed $\\sin + \\cos = 1/5$ ✓.)*`,
    formulaConcept: 'Use $(\\sin\\theta \\pm \\cos\\theta)^2 = 1 \\pm \\sin 2\\theta$; fix the sign from the quadrant.',
    difficulty: 'HARD', chapterSlug: 'trigonometry', topicSlug: 'trig-identities-equations',
    sourceType: 'ORIGINAL', sourceNote: 'sin+cos = 1/5 classic with quadrant sign logic.',
  },
  {
    subject: 'MATHEMATICS', section: 'B',
    text: `The value of $\\displaystyle\\int_{-\\pi/4}^{\\pi/4} \\left(x^3 + x\\cos x + \\tan^2 x\\right)\\,dx$ is: (round off to two decimal places; take $\\pi = 3.1416$)`,
    correctAnswer: '0.43',
    solutionText: `**Split the integrand by parity** over the symmetric interval $[-\\pi/4, \\pi/4]$:

- $x^3$ is odd → integrates to 0.
- $x\\cos x$ is odd (odd × even) → integrates to 0.
- $\\tan^2 x$ is even → survives.

$$I = \\int_{-\\pi/4}^{\\pi/4}\\tan^2 x\\,dx = 2\\int_0^{\\pi/4}\\tan^2x\\,dx$$

**Use the identity** $\\tan^2 x = \\sec^2 x - 1$:
$$I = 2\\int_0^{\\pi/4}(\\sec^2x - 1)\\,dx = 2\\Big[\\tan x - x\\Big]_0^{\\pi/4} = 2\\left(1 - \\frac{\\pi}{4}\\right)$$

**Numerically:**
$$I = 2\\left(1 - \\frac{\\pi}{4}\\right) = 2 - \\frac{\\pi}{2} = 2 - 1.5708 = 0.4292 \\approx 0.43$$

*(The odd terms must be discarded first — integrating $x\\cos x$ by parts individually would give the same zero, at far more effort.)*`,
    formulaConcept: 'Odd functions integrate to zero on symmetric intervals; $\\tan^2 x = \\sec^2 x - 1$.',
    difficulty: 'HARD', chapterSlug: 'integral-calculus', topicSlug: 'definite-integration',
    sourceType: 'ORIGINAL', sourceNote: 'Parity + standard identity.',
  },
  {
    subject: 'MATHEMATICS', section: 'B',
    text: `The distance between the parallel planes $2x - y + 2z = 4$ and $2x - y + 2z = 13$ is:`,
    correctAnswer: '3',
    solutionText: `**Distance between parallel planes** $ax + by + cz = d_1$ and $ax + by + cz = d_2$:
$$D = \\frac{|d_2 - d_1|}{\\sqrt{a^2 + b^2 + c^2}}$$

**Here** $a = 2, b = -1, c = 2$, $d_1 = 4$, $d_2 = 13$:
$$\\sqrt{a^2+b^2+c^2} = \\sqrt{4 + 1 + 4} = \\sqrt{9} = 3$$

$$D = \\frac{|13 - 4|}{3} = \\frac{9}{3} = 3$$

The planes are 3 units apart. (Note the normal $(2,-1,2)$ is already a $3$-vector — the numbers were chosen for a clean answer; forgetting the square root gives 9.)`,
    formulaConcept: 'Distance between parallel planes: $|d_2 - d_1| / \\sqrt{a^2+b^2+c^2}$.',
    difficulty: 'MODERATE', chapterSlug: 'three-dimensional-geometry', topicSlug: 'planes',
    sourceType: 'ORIGINAL', sourceNote: 'Parallel-plane distance.',
  },
  {
    subject: 'MATHEMATICS', section: 'B',
    text: `In an arithmetic progression, the 3rd term is 7 and the 7th term is 19. The sum of the first 20 terms is:`,
    correctAnswer: '590',
    solutionText: `**Set up equations** with first term $a$ and common difference $d$:
$$a + 2d = 7 \\qquad (3\\text{rd term})$$
$$a + 6d = 19 \\qquad (7\\text{th term})$$

**Subtract:** $4d = 12 \\implies d = 3$, and then $a = 7 - 2(3) = 1$.

**Sum of the first $n$ terms:**
$$S_n = \\frac{n}{2}\\big(2a + (n-1)d\\big)$$

With $n = 20$:
$$S_{20} = \\frac{20}{2}\\big(2(1) + 19(3)\\big) = 10\\,(2 + 57) = 10 \\times 59 = 590$$`,
    formulaConcept: 'AP: $a_n = a + (n-1)d$; $S_n = \\frac{n}{2}(2a + (n-1)d)$.',
    difficulty: 'MODERATE', chapterSlug: 'sequences-and-series', topicSlug: 'arithmetic-progression',
    sourceType: 'ORIGINAL', sourceNote: 'Two-condition AP sum.',
  },
  {
    subject: 'MATHEMATICS', section: 'B',
    text: `A fair coin is tossed 10 times. Let $X$ denote the number of heads. The variance of $X$ is: (round off to one decimal place)`,
    correctAnswer: '2.5',
    solutionText: `The number of heads in $n$ independent Bernoulli trials (probability $p$ each) follows a **binomial distribution** $B(n, p)$, for which
$$\\text{Variance} = npq$$

**Here** $n = 10$, $p = \\tfrac{1}{2}$, $q = 1 - p = \\tfrac{1}{2}$:
$$\\text{Var}(X) = 10 \\times \\frac{1}{2} \\times \\frac{1}{2} = \\frac{10}{4} = 2.5$$

*(For reference, the mean is $np = 5$, and $\\sigma = \\sqrt{2.5} \\approx 1.58$. A common error is to report $np(1-p)$ with $n = 9$ (forgetting one trial) or to square the variance.)*`,
    formulaConcept: 'Binomial $B(n,p)$: mean $= np$, variance $= npq$.',
    difficulty: 'MODERATE', chapterSlug: 'probability', topicSlug: 'binomial-distribution',
    sourceType: 'ORIGINAL', sourceNote: 'Binomial variance computation.',
  },
]
