import type { SeedQuestion } from '@/content/types'

// ============================================================================
// MOCK 04 — MATHEMATICS (Q51–Q75: 20 MCQ Section A + 5 numerical Section B)
// Difficulty target: Moderate JEE Main. All answers hand-verified.
// Answer keys balanced 5/5/5/5 across Section A. Scenarios FRESH
// (no reuse from mocks 01–03).
// ============================================================================

export const MATHEMATICS_MOCK04: SeedQuestion[] = [
  // ---------------- SECTION A (MCQ) Q51–Q70 ----------------
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The number of proper subsets of the set $\\{1, 2, 3, 4\\}$ is:`,
    options: ['16', '15', '14', '4'],
    correctAnswer: 'B',
    solutionText: `A set with $n$ elements has $2^n$ subsets in total. **Proper subsets** exclude the set itself:
$$2^4 - 1 = 16 - 1 = 15$$

*(Note: the empty set $\\emptyset$ IS a proper subset — it stays in the count. Only $\\{1,2,3,4\\}$ itself is removed.)*

**Why the others are wrong:** (A) 16 counts ALL subsets including the set itself; (C) 14 also removes the empty set (a common slip); (D) 4 counts only singletons.`,
    formulaConcept: 'Proper subsets $= 2^n - 1$ (remove only the set itself; keep $\\emptyset$).',
    difficulty: 'EASY', chapterSlug: 'sets-relations-functions', topicSlug: 'sets',
    sourceType: 'ORIGINAL', sourceNote: 'Subset counting with the proper-subset subtlety.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `If $z = 1 + i$, then $z^8$ equals:`,
    options: ['$-16$', '$16i$', '$16$', '$-16i$'],
    correctAnswer: 'C',
    solutionText: `**Square first** (the modulus–argument way is equally fast, but the algebra is cleanest):
$$z^2 = (1+i)^2 = 1 + 2i + i^2 = 2i$$

**Then:**
$$z^8 = \\left(z^2\\right)^4 = (2i)^4 = 16\\,i^4 = 16 \\times 1 = 16$$

since $i^4 = 1$.

*(Polar check: $z = \\sqrt2\\,e^{i\\pi/4}$, so $z^8 = (\\sqrt2)^8 e^{i2\\pi} = 16 \\times 1 = 16$ ✓ — the argument $8 \\times 45^\\circ = 360^\\circ$ lands on the positive real axis.)*

**Why the others are wrong:** (A) $-16$ stops at $i^4 = -1$-style sign error; (B)/(D) leave a leftover factor of $i$ — the argument did not complete the full turn to $360^\\circ$.`,
    formulaConcept: 'Powers by repeated squaring: $(1+i)^2 = 2i$; $(2i)^4 = 16$. Argument adds: $8 \\times 45^\\circ = 360^\\circ$.',
    difficulty: 'EASY', chapterSlug: 'complex-numbers', topicSlug: 'cn-algebra',
    sourceType: 'ORIGINAL', sourceNote: 'Complex power by squaring.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `If $\\alpha$ and $\\beta$ are the roots of $x^2 - 5x + 6 = 0$, then $\\alpha^3 + \\beta^3$ equals:`,
    options: ['35', '27', '63', '125'],
    correctAnswer: 'A',
    solutionText: `**From Vieta:**
$$\\alpha + \\beta = 5, \\qquad \\alpha\\beta = 6$$

**Identity:**
$$\\alpha^3 + \\beta^3 = (\\alpha + \\beta)^3 - 3\\alpha\\beta(\\alpha + \\beta)$$

**Substituting:**
$$= 5^3 - 3 \\times 6 \\times 5 = 125 - 90 = 35$$

*(Direct check: the roots are $2$ and $3$; $8 + 27 = 35$ ✓)*

**Why the others are wrong:** (B) 27 assumes the roots are $(3,3)$; (C) 63 $= 125 - 2\\times6\\times5$ — uses $2$ instead of $3$ in the identity; (D) 125 is just $(\\alpha+\\beta)^3$ with no correction term.`,
    formulaConcept: '$\\alpha^3+\\beta^3 = (\\alpha+\\beta)^3 - 3\\alpha\\beta(\\alpha+\\beta)$ — symmetric, so computable from Vieta alone.',
    difficulty: 'EASY', chapterSlug: 'quadratic-equations', topicSlug: 'roots-nature',
    sourceType: 'ORIGINAL', sourceNote: 'Symmetric cubic sum from Vieta.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The sum of the first 20 terms of the arithmetic progression $3, 7, 11, 15, \\dots$ is:`,
    options: ['800', '810', '840', '820'],
    correctAnswer: 'D',
    solutionText: `**Identify:** $a = 3$, common difference $d = 4$.

**Sum formula:**
$$S_n = \\frac{n}{2}\\left[2a + (n-1)d\\right]$$

**For $n = 20$:**
$$S_{20} = 10\\left[6 + 19 \\times 4\\right] = 10\\left[6 + 76\\right] = 10 \\times 82 = 820$$

*(Pairing trick: first + last $= 3 + 79 = 82$, and there are 10 such pairs — same 820.)*

**Why the others are wrong:** (A) 800 uses $d = 3$; (B) 810 uses $19 \\times 4$ but keeps $n/2$ wrong ($\\tfrac{20}{2} \\to 10$ slipped to $\\tfrac{82 \\times 20 - 10}{2}$-style); (C) 840 uses $2a = 6 \\to 12$-style doubling error.`,
    formulaConcept: 'AP sum $S_n = \\frac{n}{2}[2a + (n-1)d]$ — or $n \\times$ (average of end terms).',
    difficulty: 'EASY', chapterSlug: 'sequences-and-series', topicSlug: 'arithmetic-progression',
    sourceType: 'ORIGINAL', sourceNote: 'Standard AP sum.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The number of distinct arrangements of the letters of the word **LEVEL** is:`,
    options: ['120', '30', '60', '20'],
    correctAnswer: 'B',
    solutionText: `**Count the letters:** L appears $2$ times, E appears $2$ times, V appears once — $5$ letters total.

**Permutations with repetition:**
$$\\frac{5!}{2!\\;2!} = \\frac{120}{4} = 30$$

Each swap of the two L's (or the two E's) among themselves produces the same visible word, so we divide by $2!\\,2!$.

**Why the others are wrong:** (A) 120 treats all letters as distinct; (C) 60 divides by only one $2!$; (D) 20 divides by $3!$-style extra factor.`,
    formulaConcept: 'Word arrangements: $\\dfrac{n!}{p_1!\\,p_2!\\cdots}$ for repeated letters.',
    difficulty: 'EASY', chapterSlug: 'permutations-combinations', topicSlug: 'permutations',
    sourceType: 'ORIGINAL', sourceNote: 'Repeated-letter word count.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The number of diagonals of a regular decagon (10-sided polygon) is:`,
    options: ['45', '30', '35', '40'],
    correctAnswer: 'C',
    solutionText: `**Total segments joining vertex pairs:**
$$\\binom{10}{2} = \\frac{10 \\times 9}{2} = 45$$

Of these, 10 are the **sides** of the polygon (adjacent vertices). Everything else is a diagonal:
$$D = \\binom{10}{2} - 10 = 45 - 10 = 35$$

*(General formula: $D = \\dfrac{n(n-3)}{2} = \\dfrac{10 \\times 7}{2} = 35$ — each vertex connects to $n - 3$ non-adjacent vertices, halved for double counting.)*

**Why the others are wrong:** (A) 45 forgets to remove the sides; (B) 30 uses $n(n-3)/2$ with $n-3 = 6$ slip; (D) 40 removes only 5 sides.`,
    formulaConcept: 'Diagonals $= \\dfrac{n(n-3)}{2}$ — from each vertex, $n-3$ diagonals fan out.',
    difficulty: 'EASY', chapterSlug: 'permutations-combinations', topicSlug: 'combinations',
    sourceType: 'ORIGINAL', sourceNote: 'Decagon diagonal count with fan-out figure.',
    diagram: {
      kind: 'geometry',
      xRange: [-1.6, 1.6], yRange: [-1.6, 1.6],
      showGrid: false, square: true,
      title: 'from ONE vertex of a decagon: 7 diagonals fan out',
      elements: [
        { type: 'polygon', points: Array.from({ length: 10 }, (_, k) => {
            const a = (Math.PI / 2) + (2 * Math.PI * k / 10);
            return [Math.cos(a) * 1.3, Math.sin(a) * 1.3];
          }), color: 'var(--chart-2)' },
        { type: 'point', x: 0, y: 1.3, label: 'V', labelPos: 'N' },
        { type: 'point', x: 0, y: 0, label: '', labelPos: 'S' },
        { type: 'line', from: [0, 1.3], to: [1.23, 0.40], color: 'var(--gold)', dashed: true },
        { type: 'line', from: [0, 1.3], to: [0.76, -1.05], color: 'var(--gold)', dashed: true },
        { type: 'line', from: [0, 1.3], to: [-0.76, -1.05], color: 'var(--gold)', dashed: true },
        { type: 'line', from: [0, 1.3], to: [-1.23, 0.40], color: 'var(--gold)', dashed: true },
        { type: 'line', from: [0, 1.3], to: [-1.23, -0.40], color: 'var(--gold)', dashed: true },
        { type: 'line', from: [0, 1.3], to: [1.23, -0.40], color: 'var(--gold)', dashed: true },
        { type: 'line', from: [0, 1.3], to: [0.76, 1.05], color: 'var(--gold)', dashed: true },
        { type: 'label', x: 0, y: -0.15, text: 'skip 2 neighbours (sides) + itself', color: 'var(--muted-foreground)' },
        { type: 'label', x: 0, y: -0.45, text: '10 − 3 = 7 diagonals per vertex', color: 'var(--gold)' },
        { type: 'label', x: 0, y: -0.75, text: 'D = 10 × 7 / 2 = 35', color: 'var(--chart-3)' },
      ],
    },
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The middle term in the binomial expansion of $(1 + x)^{10}$ is:`,
    options: ['$252\\,x^5$', '$210\\,x^5$', '$120\\,x^5$', '$45\\,x^5$'],
    correctAnswer: 'A',
    solutionText: `$(1+x)^{10}$ has $11$ terms ($T_1$ to $T_{11}$), so the single middle term is the **6th**:
$$T_{r+1} = \\binom{10}{r}x^{r} \\implies T_6 = \\binom{10}{5}x^5$$

**Computing:**
$$\\binom{10}{5} = \\frac{10!}{5!\\,5!} = \\frac{10 \\times 9 \\times 8 \\times 7 \\times 6}{120} = 252$$

$$\\boxed{T_6 = 252\\,x^5}$$

**Why the others are wrong:** (B) 210 is $\\binom{10}{4}$ (one step off the middle); (C) 120 is $\\binom{10}{3}$; (D) 45 is $\\binom{10}{2}$.`,
    formulaConcept: 'Even power $2n$ → single middle term $T_{n+1}$; here $\\binom{10}{5} = 252$.',
    difficulty: 'MODERATE', chapterSlug: 'binomial-theorem', topicSlug: 'general-middle-terms',
    sourceType: 'ORIGINAL', sourceNote: 'Middle-term binomial coefficient with Pascal row.',
    diagram: {
      kind: 'bars',
      title: 'row n = 10 of Pascal triangle (coefficients of (1+x)¹⁰)',
      categories: ['C(10,0)', 'C(10,1)', 'C(10,2)', 'C(10,3)', 'C(10,4)', 'C(10,5)', 'C(10,6)', 'C(10,7)', 'C(10,8)', 'C(10,9)', 'C(10,10)'],
      series: [
        { name: 'coefficient', values: [1, 10, 45, 120, 210, 252, 210, 120, 45, 10, 1], color: 'var(--gold)' },
      ],
      yAxis: { label: 'coefficient', min: 0, max: 260 },
    },
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `If $A$ is a $3 \\times 3$ matrix with $\\det(A) = 2$, then $\\det(\\text{adj}\\, A)$ equals:`,
    options: ['2', '8', '6', '4'],
    correctAnswer: 'D',
    solutionText: `**The adjugate determinant identity** (for an $n \\times n$ matrix):
$$|\\text{adj}\\,A| = |A|^{\\,n-1}$$

For $n = 3$ and $|A| = 2$:
$$|\\text{adj}\\,A| = 2^{3-1} = 2^2 = 4$$

*(Where it comes from: $A\\,(\\text{adj}\\,A) = |A|\\,I$. Taking determinants: $|A|\\,|\\text{adj}A| = |A|^n \\Rightarrow |\\text{adj}A| = |A|^{n-1}$.)*

**Why the others are wrong:** (A) 2 is $|A|$ itself; (B) 8 is $|A|^n$ (forgot to cancel one power); (C) 6 multiplies $2 \\times 3$ (the dimension!).`,
    formulaConcept: '$|\\text{adj}\\,A| = |A|^{n-1}$ — for $3\\times3$: the square of the determinant.',
    difficulty: 'MODERATE', chapterSlug: 'matrices-determinants', topicSlug: 'inverse-and-systems',
    sourceType: 'ORIGINAL', sourceNote: 'Adjugate determinant identity.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The distance of the point $(2, 3)$ from the line $x + y - 4 = 0$ is:`,
    options: ['$\\sqrt{2}$', '$\\dfrac{1}{\\sqrt{2}}$', '$2$', '$1$'],
    correctAnswer: 'B',
    solutionText: `**Point-to-line distance:**
$$d = \\frac{|ax_1 + by_1 + c|}{\\sqrt{a^2 + b^2}}$$

**Substituting** $(2, 3)$ into $x + y - 4 = 0$:
$$d = \\frac{|2 + 3 - 4|}{\\sqrt{1^2 + 1^2}} = \\frac{1}{\\sqrt{2}} = \\frac{\\sqrt{2}}{2} \\approx 0.707$$

*(Sanity: $(2,3)$ gives $2+3-4 = 1 > 0$ — the point sits just off the line on the positive side; the unit normal is $\\tfrac{1}{\\sqrt2}(1,1)$.)*

**Why the others are wrong:** (A) $\\sqrt2$ forgets the square root in the denominator; (C) 2 drops the normalisation entirely; (D) 1 is the numerator alone.`,
    formulaConcept: 'Distance $= \\dfrac{|ax_1+by_1+c|}{\\sqrt{a^2+b^2}}$ — always normalise by the norm of the normal vector.',
    difficulty: 'EASY', chapterSlug: 'straight-lines', topicSlug: 'point-line-distance',
    sourceType: 'ORIGINAL', sourceNote: 'Point-line distance.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The radius of the circle $x^2 + y^2 - 4x + 6y - 12 = 0$ is:`,
    options: ['4', '$\\sqrt{12}$', '5', '3'],
    correctAnswer: 'C',
    solutionText: `**Complete the squares:**
$$x^2 - 4x + 4 + y^2 + 6y + 9 = 12 + 4 + 9$$
$$(x-2)^2 + (y+3)^2 = 25$$

So the centre is $(2, -3)$ and
$$r = \\sqrt{25} = 5$$

**Shortcut check:** $r = \\sqrt{g^2 + f^2 - c} = \\sqrt{2^2 + (-3)^2 + 12} = \\sqrt{25} = 5$ ✓

**Why the others are wrong:** (A) 4 uses only $g^2 = 4$-style partial sum; (B) $\\sqrt{12}$ takes the constant term $-c$ alone; (D) 3 is the $|f|$ value.`,
    formulaConcept: 'General-form circle: centre $(-g, -f)$, radius $\\sqrt{g^2+f^2-c}$.',
    difficulty: 'EASY', chapterSlug: 'circles', topicSlug: 'circle-equation',
    sourceType: 'ORIGINAL', sourceNote: 'Circle from general form with centre-radius sketch.',
    diagram: {
      kind: 'geometry',
      xRange: [-4, 8], yRange: [-9, 3],
      showGrid: false, square: true,
      title: '(x−2)² + (y+3)² = 25 — centre (2, −3), r = 5',
      elements: [
        { type: 'circle', cx: 2, cy: -3, r: 5, color: 'var(--chart-2)' },
        { type: 'point', x: 2, y: -3, label: 'C(2, −3)', labelPos: 'SE' },
        { type: 'line', from: [2, -3], to: [7, -3], color: 'var(--gold)', label: 'r = 5' },
        { type: 'point', x: 7, y: -3, label: '(7, −3)', labelPos: 'SE' },
        { type: 'line', from: [2, -3], to: [2, 2], color: 'var(--chart-3)', dashed: true },
        { type: 'point', x: 2, y: 2, label: '(2, 2)', labelPos: 'NE' },
        { type: 'label', x: -3, y: -7, text: 'read-off: g = −2, f = 3, c = −12', color: 'var(--muted-foreground)' },
        { type: 'label', x: -3, y: -8, text: 'r = √(g² + f² − c) = √(4 + 9 + 12) = 5', color: 'var(--gold)' },
      ],
    },
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The eccentricity of the hyperbola $\\dfrac{x^2}{9} - \\dfrac{y^2}{16} = 1$ is:`,
    options: ['$\\dfrac{5}{3}$', '$\\dfrac{4}{3}$', '$\\dfrac{5}{4}$', '$\\dfrac{\\sqrt{7}}{3}$'],
    correctAnswer: 'A',
    solutionText: `**Identify:** $a^2 = 9 \\Rightarrow a = 3$; $b^2 = 16 \\Rightarrow b = 4$.

**Hyperbola eccentricity:**
$$e = \\sqrt{1 + \\frac{b^2}{a^2}} = \\sqrt{1 + \\frac{16}{9}} = \\sqrt{\\frac{25}{9}} = \\frac{5}{3}$$

(*Always $e > 1$ for a hyperbola — here $1.67$, a fairly "open" one.)*

**Why the others are wrong:** (B) $4/3$ uses $b/a$ alone; (C) $5/4$ swaps the roles ($1 + a^2/b^2$ with the wrong square root); (D) $\\sqrt7/3$ computes $\\sqrt{b^2 - a^2}/a$ — that is the focal distance over... nothing standard.`,
    formulaConcept: 'Hyperbola: $e = \\sqrt{1 + b^2/a^2} > 1$ always; ellipse: $e = \\sqrt{1 - b^2/a^2} < 1$.',
    difficulty: 'MODERATE', chapterSlug: 'conic-sections', topicSlug: 'hyperbola',
    sourceType: 'ORIGINAL', sourceNote: 'Hyperbola eccentricity with annotated sketch.',
    diagram: {
      kind: 'geometry',
      xRange: [-6, 6], yRange: [-5, 5],
      showGrid: false, square: false,
      title: 'x²/9 − y²/16 = 1: a = 3, b = 4, c = 5, e = 5/3',
      elements: [
        { type: 'hyperbola', cx: 0, cy: 0, a: 3, b: 4, branch: 'LR', color: 'var(--chart-2)' },
        { type: 'line', from: [-5, 0], to: [5, 0], color: 'var(--muted)', dashed: true },
        { type: 'line', from: [0, -4], to: [0, 4], color: 'var(--muted)', dashed: true },
        { type: 'line', from: [-3, -4], to: [3, 4], color: 'var(--muted-foreground)', dashed: true, label: 'asymptote y = (4/3)x' },
        { type: 'point', x: 3, y: 0, label: 'V(3, 0)', labelPos: 'SE' },
        { type: 'point', x: -3, y: 0, label: 'V′(−3, 0)', labelPos: 'SW' },
        { type: 'point', x: 5, y: 0, label: 'F(5, 0)', labelPos: 'NE' },
        { type: 'point', x: -5, y: 0, label: 'F′(−5, 0)', labelPos: 'NW' },
        { type: 'line', from: [0, 0], to: [5, 0], color: 'var(--gold)', label: 'c = 5' },
        { type: 'line', from: [0, 0], to: [3, 0], color: 'var(--chart-3)', label: 'a = 3' },
        { type: 'label', x: 0, y: -3.4, text: 'e = c/a = 5/3', color: 'var(--gold)' },
        { type: 'label', x: 0, y: -4, text: 'b² = c² − a² = 16', color: 'var(--muted-foreground)' },
      ],
    },
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The angle between the vectors $\\vec{a} = \\hat{i} + \\hat{j}$ and $\\vec{b} = \\hat{j} + \\hat{k}$ is:`,
    options: ['$30^\\circ$', '$45^\\circ$', '$90^\\circ$', '$60^\\circ$'],
    correctAnswer: 'D',
    solutionText: `**Dot product:**
$$\\vec{a} \\cdot \\vec{b} = (1)(0) + (1)(1) + (0)(1) = 1$$

**Magnitudes:**
$$|\\vec{a}| = \\sqrt{1+1} = \\sqrt2, \\qquad |\\vec{b}| = \\sqrt{1+1} = \\sqrt2$$

**Cosine of the angle:**
$$\\cos\\theta = \\frac{\\vec a \\cdot \\vec b}{|\\vec a||\\vec b|} = \\frac{1}{2} \\implies \\theta = 60^\\circ$$

*(Both vectors are face-diagonals of a unit cube; adjacent face-diagonals through a common edge enclose $60^\\circ$.)*

**Why the others are wrong:** (A) $30^\\circ$ would need $\\cos\\theta = \\tfrac{\\sqrt3}{2}$; (B) $45^\\circ$ needs $\\tfrac{1}{\\sqrt2}$ (forgot one factor $\\sqrt2$); (C) $90^\\circ$ would need a zero dot product — but they share the $\\hat j$ component.`,
    formulaConcept: '$\\cos\\theta = \\dfrac{\\vec a \\cdot \\vec b}{|\\vec a||\\vec b|}$ — face diagonals of a cube meet at $60^\\circ$.',
    difficulty: 'MODERATE', chapterSlug: 'vector-algebra', topicSlug: 'dot-product',
    sourceType: 'ORIGINAL', sourceNote: 'Cube face-diagonal angle.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `If $|\\vec{a}| = 3$, $|\\vec{b}| = 4$ and $\\vec{a} \\cdot \\vec{b} = 6$, then $|\\vec{a} \\times \\vec{b}|$ equals:`,
    options: ['$6$', '$6\\sqrt{3}$', '$3\\sqrt{3}$', '$12$'],
    correctAnswer: 'B',
    solutionText: `**First find the angle** from the dot product:
$$\\cos\\theta = \\frac{\\vec a \\cdot \\vec b}{|\\vec a||\\vec b|} = \\frac{6}{12} = \\frac{1}{2} \\implies \\theta = 60^\\circ$$

**Then the cross product magnitude:**
$$|\\vec{a} \\times \\vec{b}| = |\\vec a||\\vec b|\\sin\\theta = 3 \\times 4 \\times \\frac{\\sqrt3}{2} = 6\\sqrt3$$

**Why the others are wrong:** (A) 6 is the dot product value itself; (C) $3\\sqrt3$ uses $\\sin\\theta$ correctly but drops a factor 2; (D) 12 uses $\\sin\\theta = 1$ (perpendicular-case habit).`,
    formulaConcept: 'Get $\\theta$ from the dot, then $|\\vec a \\times \\vec b| = |\\vec a||\\vec b|\\sin\\theta$; identity: $|\\vec a\\times\\vec b|^2 = |\\vec a|^2|\\vec b|^2 - (\\vec a \\cdot \\vec b)^2$.',
    difficulty: 'MODERATE', chapterSlug: 'vector-algebra', topicSlug: 'cross-product',
    sourceType: 'ORIGINAL', sourceNote: 'Cross magnitude via dot product.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `$\\displaystyle\\lim_{x \\to 0} \\frac{\\sin 3x}{\\tan 5x}$ equals:`,
    options: ['$\\dfrac{5}{3}$', '$1$', '$\\dfrac{3}{5}$', '$0$'],
    correctAnswer: 'C',
    solutionText: `**Use the standard small-angle limits** ($\\sin u \\sim u$, $\\tan u \\sim u$ as $u \\to 0$):
$$\\frac{\\sin 3x}{\\tan 5x} \\;\\sim\\; \\frac{3x}{5x} = \\frac{3}{5}$$

**Careful write-out:**
$$\\lim_{x\\to0}\\frac{\\sin 3x}{\\tan 5x} = \\lim_{x\\to0}\\left(\\frac{\\sin 3x}{3x}\\right)\\left(\\frac{5x}{\\tan 5x}\\right)\\cdot\\frac{3}{5} = 1 \\times 1 \\times \\frac{3}{5}$$

**Why the others are wrong:** (A) $5/3$ inverts the ratio (the argument in the DENOMINATOR goes below); (B) 1 assumes both arguments equal; (D) 0 treats $\\sin 3x$ as vanishing faster — both numerator and denominator vanish at the same order here.`,
    formulaConcept: 'Near 0: $\\sin kx \\approx \\tan kx \\approx kx$ — the ratio of the coefficients survives.',
    difficulty: 'EASY', chapterSlug: 'limits-continuity', topicSlug: 'limits',
    sourceType: 'ORIGINAL', sourceNote: 'Trig small-angle ratio.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The local minimum value of the function $f(x) = x^3 - 3x$ is:`,
    options: ['$-2$', '$2$', '$0$', '$-4$'],
    correctAnswer: 'A',
    solutionText: `**Critical points:**
$$f'(x) = 3x^2 - 3 = 0 \\implies x = \\pm 1$$

**Classify** (second derivative $f''(x) = 6x$):
- At $x = 1$: $f''(1) = 6 > 0$ → **local minimum**
- At $x = -1$: $f''(-1) = -6 < 0$ → local maximum

**Minimum value:**
$$f(1) = 1 - 3 = -2$$

**Why the others are wrong:** (B) 2 is the local MAXIMUM value $f(-1)$; (C) 0 is an inflection-level value at $x=0$ (no extremum there); (D) $-4$ over-shifts.`,
    formulaConcept: 'Cubic extrema: zero derivative locates, second-derivative sign classifies; $x^3-3x$ has min $-2$ at $x=1$.',
    difficulty: 'MODERATE', chapterSlug: 'application-of-derivatives', topicSlug: 'maxima-minima',
    sourceType: 'ORIGINAL', sourceNote: 'Cubic extrema with labelled curve.',
    diagram: {
      kind: 'graph',
      title: 'y = x³ − 3x: max at (−1, 2), min at (1, −2)',
      xAxis: { label: 'x', min: -2.6, max: 2.6, ticks: [-2, -1, 0, 1, 2] },
      yAxis: { label: 'y', min: -4, max: 4, ticks: [-4, -2, 0, 2, 4] },
      showGrid: true, square: false,
      curves: [
        { type: 'curve', points: [[-2.3, -4.9], [-2, -2], [-1.6, 0.104], [-1.2, 1.627], [-1, 2], [-0.7, 1.757], [-0.35, 1.043], [0, 0], [0.35, -1.043], [0.7, -1.757], [1, -2], [1.2, -1.627], [1.6, -0.104], [2, 2], [2.3, 4.9]], color: 'var(--gold)', label: 'y = x³ − 3x' },
      ],
      markers: [
        { x: -1, y: 2, label: 'max (−1, 2)', color: 'var(--chart-3)' },
        { x: 1, y: -2, label: 'min (1, −2) ← answer', color: 'var(--chart-2)' },
      ],
      shadedRegions: [],
    },
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The equation of the tangent to the curve $y = x^3$ at the point $(1, 1)$ is:`,
    options: ['$y = x - 2$', '$y = 2x - 1$', '$y = 3x + 2$', '$y = 3x - 2$'],
    correctAnswer: 'D',
    solutionText: `**Slope of the tangent:**
$$\\frac{dy}{dx} = 3x^2 \\implies m\\big|_{x=1} = 3$$

**Point-slope form at $(1, 1)$:**
$$y - 1 = 3(x - 1) \\implies y = 3x - 2$$

*(Check: $x = 1 \\Rightarrow y = 1$ ✓ the tangent passes through the contact point.)*

**Why the others are wrong:** (A) slope 1 — uses $y = x$ confusion; (B) slope 2 — evaluates $3x^2$ at some other point or halves; (C) right slope but sign slip in the intercept ($y-1 = 3(x-1)$ gives $-2$, not $+2$).`,
    formulaConcept: 'Tangent at $(x_1, y_1)$: $y - y_1 = f′(x_1)(x - x_1)$; here the slope at $x = 1$ is $3$.',
    difficulty: 'EASY', chapterSlug: 'application-of-derivatives', topicSlug: 'tangents-normals',
    sourceType: 'ORIGINAL', sourceNote: 'Cubic tangent with contact sketch.',
    diagram: {
      kind: 'graph',
      title: 'y = x³ and its tangent y = 3x − 2 at (1, 1)',
      xAxis: { label: 'x', min: -2, max: 2.4, ticks: [-2, -1, 0, 1, 2] },
      yAxis: { label: 'y', min: -3, max: 3.4, ticks: [-3, -2, -1, 0, 1, 2, 3] },
      showGrid: true, square: false,
      curves: [
        { type: 'curve', points: [[-1.7, -4.9], [-1.4, -2.7], [-1.1, -1.3], [-0.8, -0.5], [-0.5, -0.125], [0, 0], [0.5, 0.125], [0.8, 0.5], [1.1, 1.3], [1.4, 2.7], [1.6, 4.1]], color: 'var(--chart-2)', label: 'y = x³' },
        { type: 'line', points: [[-0.3, -2.9], [2.2, 4.6]], color: 'var(--gold)', label: 'tangent: y = 3x − 2' },
      ],
      markers: [
        { x: 1, y: 1, label: '(1, 1) — slope 3', color: 'var(--chart-3)' },
      ],
      shadedRegions: [],
    },
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `$\\displaystyle\\int_0^1 x\\,e^x\\,dx$ equals:`,
    options: ['$e - 1$', '$1$', '$e$', '$2$'],
    correctAnswer: 'B',
    solutionText: `**Integration by parts** ($u = x$, $dv = e^x dx$):
$$\\int_0^1 xe^x\\,dx = \\Big[x e^x\\Big]_0^1 - \\int_0^1 e^x\\,dx$$

**Evaluate:**
$$= (1 \\cdot e - 0) - \\Big[e^x\\Big]_0^1 = e - (e - 1) = \\boxed{1}$$

The boundary term and the leftover integral cancel beautifully — a classic.

**Why the others are wrong:** (A) $e-1$ is just $\\int_0^1 e^x\\,dx$ (drops the by-parts correction); (C) $e$ keeps only the boundary term; (D) 2 doubles something.`,
    formulaConcept: 'By parts $\\int u\\,dv = uv - \\int v\\,du$; for $xe^x$ the correction cancels the boundary exactly.',
    difficulty: 'MODERATE', chapterSlug: 'integral-calculus', topicSlug: 'definite-integration',
    sourceType: 'ORIGINAL', sourceNote: 'Classic by-parts cancellation.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The area enclosed by the ellipse $\\dfrac{x^2}{4} + \\dfrac{y^2}{1} = 1$ is:`,
    options: ['$4\\pi$', '$\\pi$', '$2\\pi$', '$\\dfrac{\\pi}{2}$'],
    correctAnswer: 'C',
    solutionText: `**Ellipse area:**
$$A = \\pi a b$$

Reading the equation: $a^2 = 4 \\Rightarrow a = 2$ (semi-major), $b^2 = 1 \\Rightarrow b = 1$ (semi-minor):
$$A = \\pi \\times 2 \\times 1 = 2\\pi$$

*(Not to be confused with the circle $A = \\pi r^2$ — the ellipse generalises it to $\\pi ab$; when $a = b = r$ they coincide.)*

**Why the others are wrong:** (A) $4\\pi$ uses $a^2$; (B) $\\pi$ uses $b^2$ alone; (D) $\\pi/2$ takes $ab/2$.`,
    formulaConcept: 'Ellipse area $= \\pi ab$ — half the bounding rectangle of sides $2a \\times 2b$.',
    difficulty: 'EASY', chapterSlug: 'integral-calculus', topicSlug: 'area-under-curves',
    sourceType: 'ORIGINAL', sourceNote: 'Ellipse area with shaded region.',
    diagram: {
      kind: 'geometry',
      xRange: [-3, 3], yRange: [-2, 2],
      showGrid: false, square: false,
      title: 'x²/4 + y²/1 = 1 — shaded area = π·a·b = 2π',
      elements: [
        { type: 'ellipse', cx: 0, cy: 0, a: 2, b: 1, color: 'var(--gold)', dashed: true },
        { type: 'line', from: [-2, 1], to: [2, 1], color: 'var(--muted)', dashed: true },
        { type: 'line', from: [-2, -1], to: [2, -1], color: 'var(--muted)', dashed: true },
        { type: 'line', from: [-2, -1], to: [-2, 1], color: 'var(--muted)', dashed: true },
        { type: 'line', from: [2, -1], to: [2, 1], color: 'var(--muted)', dashed: true },
        { type: 'line', from: [0, 0], to: [2, 0], color: 'var(--gold)', label: 'a = 2' },
        { type: 'line', from: [0, 0], to: [0, 1], color: 'var(--chart-3)', label: 'b = 1' },
        { type: 'label', x: 0, y: -1.4, text: 'area = πab = 2π (half the 4 × 2 rectangle)', color: 'var(--gold)' },
        { type: 'point', x: 2, y: 0, label: '(2, 0)', labelPos: 'SE' },
        { type: 'point', x: 0, y: 1, label: '(0, 1)', labelPos: 'NE' },
      ],
    },
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `The order and degree of the differential equation $\\left(\\dfrac{d^2y}{dx^2}\\right)^3 + \\left(\\dfrac{dy}{dx}\\right)^2 + y = 0$ are respectively:`,
    options: ['2 and 3', '3 and 2', '2 and 2', '1 and 3'],
    correctAnswer: 'A',
    solutionText: `**Order** = the highest derivative present:
- $\\dfrac{d^2y}{dx^2}$ (second) vs $\\dfrac{dy}{dx}$ (first) → order $= 2$

**Degree** = the power of the highest-order derivative (after the equation is polynomial in derivatives):
$$\\left(\\dfrac{d^2y}{dx^2}\\right)^{\\!3} \\implies \\text{degree} = 3$$

The $(dy/dx)^2$ term is NOT the highest order, so its power does not set the degree.

**Why the others are wrong:** (B) 3 and 2 swaps the two concepts; (C) 2 and 2 takes the power of the first derivative; (D) 1 and 3 miscounts the order.`,
    formulaConcept: 'Order = highest derivative; degree = its power — powers of LOWER derivatives never matter.',
    difficulty: 'EASY', chapterSlug: 'differential-equations', topicSlug: 'order-degree',
    sourceType: 'ORIGINAL', sourceNote: 'Order vs degree discrimination.',
  },
  {
    subject: 'MATHEMATICS', section: 'A',
    text: `Two fair dice are rolled once. The probability that the sum of the numbers shown is $8$ is:`,
    options: ['$\\dfrac{1}{6}$', '$\\dfrac{1}{9}$', '$\\dfrac{7}{36}$', '$\\dfrac{5}{36}$'],
    correctAnswer: 'D',
    solutionText: `**Total outcomes:** $6 \\times 6 = 36$ (ordered pairs).

**Favourable (sum $= 8$):**
$$(2,6),\\ (3,5),\\ (4,4),\\ (5,3),\\ (6,2) \\implies 5\\ \\text{outcomes}$$

**Probability:**
$$P(\\text{sum} = 8) = \\frac{5}{36}$$

*(The sum distribution over two dice is a symmetric tent peaking at 7 with probability $6/36$; the neighbours 6 and 8 each carry $5/36$.)*

**Why the others are wrong:** (A) $1/6 = 6/36$ is the probability of sum 7; (B) $1/9 = 4/36$ would be 4 outcomes (forgets one of the symmetric pairs); (C) $7/36$ overshoots by counting (4,4) twice.`,
    formulaConcept: 'Two-dice sums form a tent: $P(s) = \\dfrac{6 - |s-7|}{36}$ — so $P(8) = 5/36$.',
    difficulty: 'EASY', chapterSlug: 'probability', topicSlug: 'conditional-probability',
    sourceType: 'ORIGINAL', sourceNote: 'Two-dice sum with distribution chart.',
    diagram: {
      kind: 'bars',
      title: 'P(sum = s) for two dice — the symmetric tent',
      categories: ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      series: [
        { name: 'P × 36', values: [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1], color: 'var(--gold)' },
      ],
      yAxis: { label: 'outcomes out of 36', min: 0, max: 6 },
    },
  },

  // ---------------- SECTION B (numerical) Q71–Q75 ----------------
  {
    subject: 'MATHEMATICS', section: 'B',
    text: `The variance of the data $2, 4, 6, 8, 10$ is ______ .`,
    correctAnswer: '8',
    solutionText: `**Mean:**
$$\\bar{x} = \\frac{2+4+6+8+10}{5} = 6$$

**Deviations:** $-4, -2, 0, 2, 4$ — squares: $16, 4, 0, 4, 16$.

**Variance (population form, as used in JEE):**
$$\\sigma^2 = \\frac{16+4+0+4+16}{5} = \\frac{40}{5} = 8$$

*(The data is a symmetric AP, so the mean sits on the middle term and the deviations mirror.)*`,
    formulaConcept: 'Variance $= \\dfrac{\\sum(x_i - \\bar x)^2}{n}$; symmetry makes AP data quick.',
    difficulty: 'EASY', chapterSlug: 'statistics', topicSlug: 'dispersion',
    sourceType: 'ORIGINAL', sourceNote: 'Symmetric AP variance.',
  },
  {
    subject: 'MATHEMATICS', section: 'B',
    text: `For a sequence, the sum of the first $n$ terms is $S_n = n^2 + 2n$. The 5th term, $a_5$, is ______ .`,
    correctAnswer: '11',
    solutionText: `**Use the telescoping relation** $a_n = S_n - S_{n-1}$ (for $n \\ge 2$):
$$a_5 = S_5 - S_4 = (25 + 10) - (16 + 8) = 35 - 24 = \\boxed{11}$$

*(Check the sequence directly: $a_1 = S_1 = 3$; then $a_n = S_n - S_{n-1} = 2n + 1$ — an AP with $d = 2$: $3, 5, 7, 9, \\mathbf{11}, \\dots$ ✓)*`,
    formulaConcept: '$a_n = S_n - S_{n-1}$ — the difference of consecutive partial sums IS the term.',
    difficulty: 'EASY', chapterSlug: 'sequences-and-series', topicSlug: 'arithmetic-progression',
    sourceType: 'ORIGINAL', sourceNote: 'Sn-to-an conversion.',
  },
  {
    subject: 'MATHEMATICS', section: 'B',
    text: `Events $A$ and $B$ are independent with $P(A) = 0.6$ and $P(B) = 0.3$. The value of $P(A \\cup B)$ is ______ .`,
    correctAnswer: '0.72',
    solutionText: `**Independence gives the product rule:**
$$P(A \\cap B) = P(A)\\,P(B) = 0.6 \\times 0.3 = 0.18$$

**Inclusion–exclusion:**
$$P(A \\cup B) = P(A) + P(B) - P(A \\cap B) = 0.6 + 0.3 - 0.18 = \\boxed{0.72}$$

*(Sanity: the union can never exceed 1 ✓, and here it exceeds both individual probabilities as it must.)*`,
    formulaConcept: 'Independent: $P(A \\cap B) = P(A)P(B)$; then $P(A\\cup B) = P(A)+P(B)-P(A\\cap B)$.',
    difficulty: 'MODERATE', chapterSlug: 'probability', topicSlug: 'conditional-probability',
    sourceType: 'ORIGINAL', sourceNote: 'Independence + inclusion-exclusion.',
  },
  {
    subject: 'MATHEMATICS', section: 'B',
    text: `The minimum value of the function $f(x) = x^2 + 2x + 5$ for real $x$ is ______ .`,
    correctAnswer: '4',
    solutionText: `**Complete the square:**
$$f(x) = x^2 + 2x + 5 = (x+1)^2 + 4$$

Since $(x+1)^2 \\ge 0$ for every real $x$, with equality at $x = -1$:
$$f_{\\min} = 0 + 4 = \\boxed{4}$$

*(Calculus check: $f'(x) = 2x + 2 = 0 \\Rightarrow x = -1$; $f'' = 2 > 0$ — minimum; $f(-1) = 1 - 2 + 5 = 4$ ✓)*`,
    formulaConcept: 'Complete the square: $x^2+2x+5 = (x+1)^2+4$ — the constant IS the minimum.',
    difficulty: 'EASY', chapterSlug: 'quadratic-equations', topicSlug: 'roots-nature',
    sourceType: 'ORIGINAL', sourceNote: 'Quadratic minimum by completion.',
  },
  {
    subject: 'MATHEMATICS', section: 'B',
    text: `$\\displaystyle\\int_0^{\\pi/4} \\sec^2 x\\, dx$ equals ______ .`,
    correctAnswer: '1',
    solutionText: `**Antiderivative:**
$$\\int \\sec^2 x\\,dx = \\tan x + C$$

**Evaluate:**
$$\\Big[\\tan x\\Big]_0^{\\pi/4} = \\tan\\frac{\\pi}{4} - \\tan 0 = 1 - 0 = \\boxed{1}$$

*(Geometric view: the integral is the area under the $\\sec^2 x$ curve from $0$ to $45^\\circ$ — it grows steeply near the right end but encloses exactly unit area, mirroring the tangent rise from 0 to 1.)*`,
    formulaConcept: '$\\int \\sec^2x\\,dx = \\tan x$; $\\tan(\\pi/4) = 1$.',
    difficulty: 'EASY', chapterSlug: 'integral-calculus', topicSlug: 'definite-integration',
    sourceType: 'ORIGINAL', sourceNote: 'Basic definite integral.',
  },
]
