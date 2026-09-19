import type { SeedQuestion } from '@/content/types'

// ============================================================================
// MOCK 03 — CHEMISTRY (Q26–Q50: 20 MCQ Section A + 5 numerical Section B)
// Difficulty target: Hard JEE Main. All stoichiometry/numerics verified by hand.
// ============================================================================

export const CHEMISTRY_MOCK03: SeedQuestion[] = [
  // ---------------- SECTION A (MCQ) Q26–Q45 ----------------
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `The molarity of pure water (density $1\\ \\text{g/mL}$) is:`,
    options: ['10 M', '18 M', '100 M', '55.5 M'],
    correctAnswer: 'D',
    solutionText: `Take 1 litre of pure water (mass = 1000 g since $\\rho = 1$ g/mL):

$$n(\\text{H}_2\\text{O}) = \\frac{1000\\ \\text{g}}{18\\ \\text{g/mol}} = 55.5\\ \\text{mol}$$

In a 1 L sample, that is **55.5 mol/L** — pure water is a 55.5 M "solution" of itself. (Water's auto-ionisation — $10^{-7}$ M of $\\text{H}_3\\text{O}^+$ — is utterly negligible against this background, which is why the ionic product works out as it does.)

**Why the others are wrong:** (A) 10 M corresponds to a molar mass of 100; (B) 18 M treats grams as moles; (C) 100 M inverts the density reasoning.`,
    formulaConcept: 'Molarity of a pure liquid = density × 1000 / molar mass — 55.5 M for water.',
    difficulty: 'MODERATE', chapterSlug: 'some-basic-concepts', topicSlug: 'concentration-terms',
    sourceType: 'ORIGINAL', sourceNote: 'The classic 55.5 M water factoid with reasoning.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `The ratio of the radius of the second Bohr orbit of H$(Z=1)$ to that of the third orbit of $\\text{Li}^{2+}$ $(Z=3)$ is: (radius $r_n = 0.529\\, n^2/Z\\ \\text{Å}$)`,
    options: ['3 : 4', '1 : 1', '4 : 3', '9 : 4'],
    correctAnswer: 'C',
    solutionText: `Bohr radius for a hydrogen-like species:
$$r_n = 0.529\\frac{n^2}{Z}\\ \\text{Å}$$

**Hydrogen, $n = 2$:**
$$r_H = 0.529 \\times \\frac{4}{1} = 2.116\\ \\text{Å}$$

**Lithium(2+), $n = 3$:**
$$r_{Li^{2+}} = 0.529 \\times \\frac{9}{3} = 1.587\\ \\text{Å}$$

**Ratio:**
$$\\frac{r_H}{r_{Li^{2+}}} = \\frac{2.116}{1.587} = \\frac{4}{3}$$

The higher nuclear charge of Li³⁺ pulls its electrons closer — even in a bigger orbit.

**Why the others are wrong:** (A) 3:4 inverts; (B) 1:1 assumes $n^2$ and $Z$ scale equally (here $4/1 \\ne 9/3$); (D) 9:4 compares the $n^2$ values alone.`,
    formulaConcept: 'Hydrogen-like radii: $r_n \\propto n^2/Z$ — compare both factors together.',
    difficulty: 'MODERATE', chapterSlug: 'atomic-structure', topicSlug: 'bohrs-model-hydrogen',
    sourceType: 'ORIGINAL', sourceNote: 'Radius comparison across species with table.',
    diagram: {
      kind: 'table',
      headers: ['Species', 'n', 'Z', 'n²/Z', 'rₙ = 0.529·n²/Z (Å)'],
      rows: [
        ['H', 2, 1, '4/1 = 4', '2.116'],
        ['Li²⁺', 3, 3, '9/3 = 3', '1.587'],
      ],
      caption: 'r(H) : r(Li²⁺) = 4 : 3 — the higher nuclear charge of Li²⁺ pulls its electron cloud inward',
      highlightCells: [[0, 4], [1, 4]],
    },
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `The shape of the $\\text{SF}_4$ molecule is:`,
    options: ['Tetrahedral', 'See-saw', 'Square planar', 'Trigonal bipyramidal'],
    correctAnswer: 'B',
    solutionText: `Steric count for S in $\\text{SF}_4$:
- 4 bond pairs (F atoms)
- 1 lone pair on S (6 valence electrons: 4 used in bonds, 2 left over)

**Hybridisation $sp^3d$ → 5 electron domains → trigonal bipyramidal arrangement of domains.** The lone pair takes an **equatorial** position (it has only two 90° neighbours there, versus three in an axial slot), leaving a **see-saw** molecular shape.

**Why the others are wrong:** (A) tetrahedral would need 4 domains and no lone pair (that is $\\text{SiF}_4$); (C) square planar belongs to $sp^3d^2$ with **2** lone pairs ($\\text{XeF}_4$); (D) trigonal bipyramidal is the *electron-pair* geometry — but with one lone pair the *molecular* shape distorts to see-saw.`,
    formulaConcept: 'VSEPR: $sp^3d$ + 1 lone pair → see-saw; lone pairs prefer equatorial sites in TBP geometry.',
    difficulty: 'MODERATE', chapterSlug: 'chemical-bonding', topicSlug: 'vsepr-shapes',
    sourceType: 'ORIGINAL', sourceNote: 'See-saw SF₄ with lone-pair structure drawn.',
    diagram: {
      kind: 'molecule',
      atoms: [
        { sym: 'S', x: 170, y: 120 },
        { sym: 'F', x: 170, y: 50 },
        { sym: 'F', x: 170, y: 190 },
        { sym: 'F', x: 95, y: 105, label: 'F (equatorial)' },
        { sym: 'F', x: 245, y: 150, label: 'F (equatorial)' },
      ],
      bonds: [
        { a: 0, b: 1, order: 1 }, { a: 0, b: 2, order: 1 },
        { a: 0, b: 3, order: 1 }, { a: 0, b: 4, order: 1 },
      ],
      lonePairs: [{ atom: 0, count: 1, angles: [-32] }],
      caption: 'SF₄ see-saw: axial F above/below, 2 equatorial F, lone pair in the 3rd equatorial slot (fewer 90° repulsions) — angles squeeze: ax–eq < 90°, eq–eq < 120°',
    },
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `For a reaction, $\\Delta H = -40\\ \\text{kJ mol}^{-1}$ and $\\Delta S = -100\\ \\text{J K}^{-1}\\text{mol}^{-1}$. The temperature (in K) at which the reaction is at equilibrium (i.e. $\\Delta G = 0$) is:`,
    options: ['100 K', '250 K', '400 K', '500 K'],
    correctAnswer: 'C',
    solutionText: `Set $\\Delta G = 0$:
$$\\Delta G = \\Delta H - T\\Delta S = 0 \\implies T = \\frac{\\Delta H}{\\Delta S}$$

**Unit alert** — convert $\\Delta H$ to J or $\\Delta S$ to kJ first:
$$T = \\frac{-40\\,000\\ \\text{J mol}^{-1}}{-100\\ \\text{J K}^{-1}\\text{mol}^{-1}} = 400\\ \\text{K}$$

**Interpretation:** both quantities are negative — the reaction is exothermic but order-increasing. It is spontaneous ($\\Delta G < 0$) **below** 400 K, where the enthalpy term dominates; above 400 K the $-T\\Delta S$ term wins and the process turns non-spontaneous.

**Why the others are wrong:** (A) 100 K mixes kJ with J ($40/100 = 0.4$-style blunder ×100); (B) 250 K forgets the sign conventions; (D) 500 K divides by $\\Delta S/2$-style values.`,
    formulaConcept: 'Equilibrium crossover: $T = \\Delta H/\\Delta S$ (same units!); below it exothermic-orderly reactions run forward.',
    difficulty: 'VERY_HARD', chapterSlug: 'thermodynamics-chemistry', topicSlug: 'spontaneity',
    sourceType: 'ORIGINAL', sourceNote: 'Crossover temperature with ΔG–T graph.',
    diagram: {
      kind: 'graph',
      title: 'ΔG vs T: ΔH = −40 kJ/mol, ΔS = −0.1 kJ/(mol·K)',
      xAxis: { label: 'T (K)', min: 0, max: 800, ticks: [0, 100, 200, 300, 400, 500, 600, 700, 800] },
      yAxis: { label: 'ΔG (kJ/mol)', min: -55, max: 55, ticks: [-40, -20, 0, 20, 40] },
      showGrid: true,
      square: false,
      curves: [
        { type: 'line', color: 'var(--gold)', label: 'ΔG = ΔH − TΔS', points: [[0, -40], [100, -30], [200, -20], [300, -10], [400, 0], [500, 10], [600, 20], [700, 30], [800, 40]] },
      ],
      markers: [
        { x: 400, y: 0, label: 'crossover: T = ΔH/ΔS = 400 K' },
      ],
      shadedRegions: [
        { points: [[0, -40], [400, 0], [400, -55], [0, -55]], color: 'var(--chart-2)', label: 'ΔG < 0: spontaneous' },
        { points: [[400, 0], [800, 40], [800, 55], [400, 55]], color: 'var(--chart-3)', label: 'ΔG > 0: not spontaneous' },
      ],
    },
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `1 mol of liquid $A$ $(p^\\circ_A = 100\\ \\text{mm Hg})$ is mixed with 3 mol of liquid $B$ $(p^\\circ_B = 80\\ \\text{mm Hg})$ to form an ideal solution at the same temperature. The total vapour pressure of the solution is:`,
    options: ['85 mm Hg', '90 mm Hg', '95 mm Hg', '80 mm Hg'],
    correctAnswer: 'A',
    solutionText: `**Mole fractions:** $x_A = \\dfrac{1}{4} = 0.25$, $x_B = 0.75$.

**Raoult's law** (ideal solution — both components volatile):
$$p_{total} = p^\\circ_A x_A + p^\\circ_B x_B = 100 \\times 0.25 + 80 \\times 0.75$$
$$= 25 + 60 = 85\\ \\text{mm Hg}$$

The vapour is richer in A (the more volatile component): $y_A = 25/85 = 0.294 > x_A = 0.25$ — the entire basis of fractional distillation.

**Why the others are wrong:** (B) 90 mm Hg takes the simple average of 100 and 80 (assumes $x_A = x_B = 0.5$); (C) 95 mm Hg weights A too heavily; (D) 80 mm Hg is the pressure of pure B (as if A were non-volatile).`,
    formulaConcept: 'Ideal solution: $p = \\sum p^\\circ_i x_i$ — mole-fraction weighted, and vapour is always richer in the volatile component.',
    difficulty: 'MODERATE', chapterSlug: 'solutions', topicSlug: 'raoults-law',
    sourceType: 'ORIGINAL', sourceNote: 'Two-component Raoult with p–x diagram.',
    diagram: {
      kind: 'graph',
      title: 'Raoult: ideal solution of A (100 mm) + B (80 mm)',
      xAxis: { label: 'x_A (mole fraction of A)', min: 0, max: 1, ticks: [0, 0.25, 0.5, 0.75, 1] },
      yAxis: { label: 'p (mm Hg)', min: 60, max: 110, ticks: [60, 70, 80, 90, 100, 110] },
      showGrid: true,
      square: false,
      curves: [
        { type: 'line', color: 'var(--chart-3)', label: 'p_A = 100·x_A', points: [[0.6, 60], [0.7, 70], [0.8, 80], [0.9, 90], [1, 100]] },
        { type: 'line', color: 'var(--chart-5)', label: 'p_B = 80(1 − x_A)', points: [[0, 80], [0.125, 70], [0.25, 60]] },
        { type: 'line', color: 'var(--gold)', label: 'p_total = p_A + p_B', points: [[0, 80], [0.25, 85], [0.5, 90], [0.75, 95], [1, 100]] },
      ],
      markers: [
        { x: 0.25, y: 85, label: 'our mixture: x_A = 0.25 → 85 mm', color: 'var(--gold)' },
        { x: 0, y: 80, label: 'p°_B', color: 'var(--chart-5)' },
        { x: 1, y: 100, label: 'p°_A', color: 'var(--chart-3)' },
      ],
    },
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `A buffer contains $0.2\\ \\text{M}$ acetic acid and $0.1\\ \\text{M}$ sodium acetate. Taking $pK_a = 4.74$ for acetic acid, the pH of the buffer is:`,
    options: ['4.44', '5.04', '4.14', '3.74'],
    correctAnswer: 'A',
    solutionText: `**Henderson–Hasselbalch equation:**
$$pH = pK_a + \\log\\frac{[\\text{salt}]}{[\\text{acid}]}$$

**Substituting:**
$$pH = 4.74 + \\log\\frac{0.1}{0.2} = 4.74 + \\log 0.5 = 4.74 - 0.30 = 4.44$$

Since acid exceeds salt 2:1, the pH sits 0.30 units **below** $pK_a$ — the buffer resists change in both directions, but its resting point depends on that ratio.

**Why the others are wrong:** (B) 5.04 adds 0.30 (ratio inverted — thinks salt is in excess); (C) 4.14 subtracts 0.60 (squares the ratio); (D) 3.74 subtracts a full unit (ratio treated as 1/10).`,
    formulaConcept: 'HH equation: $pH = pK_a + \\log(\\text{base}/\\text{acid})$ — the ratio, not the absolute amounts, sets the pH.',
    difficulty: 'MODERATE', chapterSlug: 'equilibrium', topicSlug: 'buffers',
    sourceType: 'ORIGINAL', sourceNote: 'Acid-heavy buffer pH.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `Given the limiting molar conductivities $\\Lambda^\\circ_m(\\text{HCl}) = 426$, $\\Lambda^\\circ_m(\\text{CH}_3\\text{COONa}) = 91$ and $\\Lambda^\\circ_m(\\text{NaCl}) = 126$ (all in $\\text{S cm}^2\\text{mol}^{-1}$), the $\\Lambda^\\circ_m$ of acetic acid is:`,
    options: ['295', '451', '391', '643'],
    correctAnswer: 'C',
    solutionText: `**Kohlrausch's law of independent migration** lets us assemble the weak electrolyte's value from strong-electrolyte data:

$$\\Lambda^\\circ(\\text{CH}_3\\text{COOH}) = \\Lambda^\\circ(\\text{CH}_3\\text{COONa}) + \\Lambda^\\circ(\\text{HCl}) - \\Lambda^\\circ(\\text{NaCl})$$

**Why this works:** adding the first two brings in every needed ion ($\\text{CH}_3\\text{COO}^-$, $\\text{Na}^+$, $\\text{H}^+$, $\\text{Cl}^-$) — and the NaCl subtraction cancels the spectator pair $\\text{Na}^+ + \\text{Cl}^-$:
$$\\Lambda^\\circ(\\text{CH}_3\\text{COOH}) = 91 + 426 - 126 = 391\\ \\text{S cm}^2\\text{mol}^{-1}$$

**Why the others are wrong:** (A) 295 does $426 - 91 - 40$-style damage; (B) 451 adds NaCl instead of subtracting ($91+426+...$); (D) 643 sums everything.
`,
    formulaConcept: 'Kohlrausch: build weak-electrolyte $\\Lambda^\\circ$ by ion bookkeeping from three strong electrolytes.',
    difficulty: 'HARD', chapterSlug: 'redox-electrochemistry', topicSlug: 'conductance',
    sourceType: 'ORIGINAL', sourceNote: 'Kohlrausch triangle for acetic acid.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `The units of the rate constant $k$ for a **zero-order** reaction are:`,
    options: ['mol L⁻¹ s⁻¹', 's⁻¹', 'L mol⁻¹ s⁻¹', 'M⁻¹ s⁻¹'],
    correctAnswer: 'A',
    solutionText: `For order $n$, the rate law has units:
$$\\text{rate} (\\text{mol L}^{-1}\\text{s}^{-1}) = k \\times (\\text{mol L}^{-1})^n \\implies [k] = (\\text{mol L}^{-1})^{1-n}\\ \\text{s}^{-1}$$

**For $n = 0$:**
$$[k] = \\text{mol L}^{-1}\\ \\text{s}^{-1}$$

— identical to the units of rate itself, because the rate does not depend on any concentration.

(Contrast: first order → $\\text{s}^{-1}$; second order → $\\text{L mol}^{-1}\\text{s}^{-1}$.)

**Why the others are wrong:** (B) s⁻¹ is first order; (C) and (D) are second-order forms (M⁻¹s⁻¹ is the same as L mol⁻¹s⁻¹ written differently).`,
    formulaConcept: '$[k] = (\\text{concentration})^{1-n}(\\text{time})^{-1}$ — zero order makes $k$ share the rate\'s units.',
    difficulty: 'MODERATE', chapterSlug: 'chemical-kinetics', topicSlug: 'rate-laws-order',
    sourceType: 'ORIGINAL', sourceNote: 'Rate-constant units by order.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `The element with the **highest electron affinity** (electron gain enthalpy, most negative) is:`,
    options: ['F', 'Cl', 'Br', 'O'],
    correctAnswer: 'B',
    solutionText: `Chlorine releases **more** energy on gaining an electron than fluorine does:
$$\\text{Cl} > \\text{F} > \\text{Br} > \\text{I}$$

**Why F < Cl?** Fluorine's 2p subshell is so compact that the incoming electron faces strong inter-electronic repulsion in the small $n = 2$ shell. Chlorine's roomier 3p shell accommodates the extra electron with less repulsion — its electron affinity (≈ −349 kJ/mol) beats fluorine's (≈ −328 kJ/mol).

**Why the others are wrong:** (A) F — the electronegativity champion but NOT the electron-affinity champion; (C) Br follows Cl in the halogen series; (D) O shows the same second-row penalty (S beats O for the same reason).`,
    formulaConcept: 'Second-row smallness penalty: Cl > F and S > O in electron affinity — repulsion in compact shells beats higher effective nuclear charge.',
    difficulty: 'VERY_HARD', chapterSlug: 'classification-periodicity', topicSlug: 'electronegativity-ea',
    sourceType: 'ORIGINAL', sourceNote: 'The classic Cl > F anomaly.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `Among the oxoacids of chlorine — $\\text{HClO}$, $\\text{HClO}_2$, $\\text{HClO}_3$, $\\text{HClO}_4$ — the strongest acid is:`,
    options: ['HClO', 'HClO₂', 'HClO₃', 'HClO₄'],
    correctAnswer: 'D',
    solutionText: `Acid strength grows with the number of terminal oxygens attached to Cl:
$$\\text{HClO} < \\text{HClO}_2 < \\text{HClO}_3 < \\text{HClO}_4$$

**Two ways to see it:**
1. **Polarity of the O–H bond:** each extra O pulls electron density from Cl, which in turn pulls it from the O–H bond, weakening it — the proton departs more readily.
2. **Conjugate-base stability:** in $\\text{ClO}_4^-$ the single negative charge delocalises over four O atoms (three Cl=O and one Cl–O⁻) — far more resonance spread than in $\\text{ClO}^-$, where one O carries it all.

**Why the others are wrong:** (A) HClO is the weakest of the set (hypochlorous acid, pKa ≈ 7.5); (B) and (C) sit in between (HClO₃ is strong but still below HClO₄, pKa ≈ −8).`,
    formulaConcept: 'Oxoacid strength ↑ with # of O atoms: more O → more polarised O–H + more resonance-stable anion.',
    difficulty: 'HARD', chapterSlug: 'p-block-elements', topicSlug: 'halogens-noble-gases',
    sourceType: 'ORIGINAL', sourceNote: 'Oxoacid strength trend with comparison table.',
    diagram: {
      kind: 'table',
      headers: ['Acid', 'Cl ox. state', 'Terminal O atoms', 'pKₐ (approx)', 'Strength'],
      rows: [
        ['HClO', '+1', '1', '7.5', 'weakest'],
        ['HClO₂', '+3', '2', '≈ 2', 'weak'],
        ['HClO₃', '+5', '3', '≈ −1', 'strong'],
        ['HClO₄', '+7', '4', '≈ −8', 'strongest'],
      ],
      caption: 'each extra terminal O polarises the O–H bond and delocalises the conjugate-base charge ⇒ stronger acid',
      highlightCells: [[3, 0], [3, 4]],
    },
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `The **highest oxidation state** exhibited by an element of the 3d transition series is:`,
    options: ['+6', '+7', '+8', '+5'],
    correctAnswer: 'B',
    solutionText: `Manganese reaches $+7$ in $\\text{MnO}_4^-$ (and $\\text{Mn}_2\\text{O}_7$):
$$\\text{Mn}: [\\text{Ar}]\\,3d^5 4s^2 \\implies \\text{up to } 7\\ \\text{valence electrons}$$

The +7 state is the maximum for 3d: to go beyond it you would need to involve core (3p) electrons, which chemistry simply does not do. The genuine +8 state belongs to **osmium** (5d) in $\\text{OsO}_4$.

**Why the others are wrong:** (A) +6 appears (Cr in $\\text{CrO}_3$/$\\text{Cr}_2\\text{O}_7^{2-}$, Fe in $\\text{FeO}_4^{2-}$ marginally) but is not the max; (C) +8 requires a 5d element (Os/Ru); (D) +5 (V in $\\text{VO}_3^-$) is well short.`,
    formulaConcept: 'Max oxidation state = number of valence electrons (3d⁵4s² → Mn at +7); +8 is the 5d privilege of Os.',
    difficulty: 'HARD', chapterSlug: 'd-f-block-elements', topicSlug: 'oxidation-states-compounds',
    sourceType: 'ORIGINAL', sourceNote: '3d ceiling at Mn(VII).',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `The number of **geometrical isomers** possible for the complex ion $[\\text{Co}(\\text{NH}_3)_4\\text{Cl}_2]^+$ is:`,
    options: ['1', '2', '3', '4'],
    correctAnswer: 'B',
    solutionText: `With 6 ligands, Co(III) is octahedral ($sp^3d^2$-type geometry). Four identical $\\text{NH}_3$ plus two identical Cl give exactly two arrangements:

1. **trans**: the two Cl on opposite vertices (180° apart) — a symmetric isomer
2. **cis**: the two Cl on adjacent vertices (90° apart) — a polar isomer (has a dipole)

$$\\boxed{2\\ \\text{geometrical isomers (cis and trans)}}$$

(For $[\\text{Ma}_4b_2]$-type octahedral complexes the count is always 2. The cis form of the closely related $[\\text{Co}(\\text{NH}_3)_4\\text{Cl}_2]^+$ is famously the "praseo" salt, the trans the "violeo" salt — historically the first geometric isomers recognized in coordination chemistry.)

**Why the others are wrong:** (A) 1 would mean no isomerism (true only for $\\text{Ma}_6$ or $\\text{Ma}_5b$); (C) 3 is the count for $\\text{Ma}_3b_3$; (D) 4 overcounts (cis has one variant here — optical isomerism needs chelates).`,
    formulaConcept: 'Octahedral $\\text{MA}_4\\text{B}_2$ → cis/trans pair; $\\text{MA}_3\\text{B}_3$ → fac/mer (3-count).',
    difficulty: 'HARD', chapterSlug: 'coordination-compounds', topicSlug: 'nomenclature',
    sourceType: 'ORIGINAL', sourceNote: 'MA₄B₂ isomer counting.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `The most **stable carbocation** among the following is:`,
    options: ['CH₃⁺', 'Isopropyl cation (CH₃)₂CH⁺', 'tert-Butyl cation (CH₃)₃C⁺', 'Benzyl cation C₆H₅CH₂⁺'],
    correctAnswer: 'D',
    solutionText: `Rank carbocations by the delocalisation available to the positive charge:

**Benzyl cation:** the vacant p-orbital on $\\text{CH}_2^+$ overlaps the aromatic π-system, delocalising the charge over **four resonance structures** (three aromatic ring positions plus the benzylic carbon). This resonance stabilisation outclasses alkyl hyperconjugation:
$$\\text{benzyl}^+ \\approx \\text{allyl}^+ > 3^\\circ > 2^\\circ > 1^\\circ > \\text{CH}_3^+$$

**Why the others are wrong:** (C) tert-butyl has 9 hyperconjugative C–H structures — strong, but each is weaker than a true resonance structure, and the charge stays localised on one carbon; (B) isopropyl has only 6; (A) methyl has zero stabilisation — the least stable carbocation known.`,
    formulaConcept: 'Resonance (real delocalisation) beats hyperconjugation (partial donation): benzyl⁺ > 3° > 2° > 1° > CH₃⁺.',
    difficulty: 'HARD', chapterSlug: 'basic-principles-organic', topicSlug: 'reaction-intermediates',
    sourceType: 'ORIGINAL', sourceNote: 'Benzyl vs tert-butyl cation stability.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `The major monobromination product of 2-methylbutane under free-radical conditions ($\\text{Br}_2, h\\nu$) is:`,
    options: ['1-bromo-2-methylbutane', '2-bromo-2-methylbutane', '2-bromo-3-methylbutane', '1-bromo-3-methylbutane'],
    correctAnswer: 'B',
    solutionText: `Bromine radicals are **highly selective**; the relative per-hydrogen reactivities are:
$$3^\circ : 2^\circ : 1^\circ = 1600 : 82 : 1$$

Identify the distinct hydrogen types in 2-methylbutane $\big((\text{CH}_3)_2\text{CH}\text{CH}_2\text{CH}_3\big)$ and weight them:

| H type | Count | Weight | Score |
|---|---|---|---|
| tertiary (C-2) | 1 | 1600 | 1600 |
| secondary (C-3) | 2 | 82 | 164 |
| primary (two CH₃ on C-2 + terminal CH₃) | 6 + 3 = 9 | 1 | 9 |

**Tertiary score dominates:**
$$\frac{1600}{1600 + 164 + 9} \approx 90\% \implies \textbf{2-bromo-2-methylbutane is the major product}$$

The tertiary C–H bond is weakest (stabilised transition state), and Br• is slow enough to be picky — the classic **reactivity–selectivity principle**. (Chlorination, with its more reactive radical, gives a statistical mixture instead.)

**Why the others are wrong:** (A) and (D) are primary-substitution products (~1% each); (C) is the secondary product (~9%) — the numbering trap for 2-bromo-3-methylbutane.`,
    formulaConcept: 'Bromination selectivity 1600 : 82 : 1 (3° : 2° : 1°) — weight by H count; the tertiary product dominates.',
    difficulty: 'VERY_HARD', chapterSlug: 'hydrocarbons', topicSlug: 'alkanes',
    sourceType: 'ORIGINAL', sourceNote: 'Radical bromination selectivity with structure drawn.',
    diagram: {
      kind: 'organic',
      parts: [
        { type: 'chain', x: 20, y: 70, atoms: [{ sym: 'CH₃' }, { sym: 'CH(CH₃)' }, { sym: 'CH₂' }, { sym: 'CH₃' }] },
        { type: 'text', x: 85, y: 104, text: 'H inventory: 1×3° (C-2) · 2×2° (C-3) · 9×1°' },
        { type: 'text', x: 85, y: 124, text: 'Br• selectivity 3° : 2° : 1° = 1600 : 82 : 1' },
        { type: 'arrow', x1: 85, y1: 140, x2: 85, y2: 172, label: 'Br₂, hν (radical)' },
        { type: 'chain', x: 20, y: 210, atoms: [{ sym: 'CH₃' }, { sym: 'CBr' }, { sym: 'CH₂' }, { sym: 'CH₃' }] },
        { type: 'text', x: 85, y: 244, text: 'major product: 2-bromo-2-methylbutane (≈90%)', bold: true },
      ],
      caption: '2-methylbutane — the tertiary C–H at C-2 wins under bromination',
    },
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `2-bromo-2-methylbutane is heated with alcoholic KOH. Following Saytzeff's rule, the major alkene formed is:`,
    options: ['2-methylbut-1-ene', '3-methylbut-1-ene', '2-methylbut-2-ene', 'pent-1-ene'],
    correctAnswer: 'C',
    solutionText: `E2 elimination removes a β-hydrogen; two distinct β-carbons exist in $(\\text{CH}_3)_2\\text{C(Br)}\\text{CH}_2\\text{CH}_3$:

1. Removing H from a **methyl** β-carbon → 2-methylbut-1-ene (terminal, monosubstituted)
2. Removing H from the **CH₂** β-carbon → 2-methylbut-2-ene (internal, **trisubstituted**)

**Saytzeff's rule:** the more substituted (more stable) alkene dominates. 2-methylbut-2-ene is tri-substituted (three alkyl groups donate electron density into the double bond by hyperconjugation/+I), so it is the major product:
$$(\\text{CH}_3)_2\\text{C} = \\text{CH}\\text{CH}_3 \\quad \\text{(major)}$$

**Why the others are wrong:** (A) is the less-substituted terminal alkene (Hofmann product — would need a bulky base); (B) has the wrong skeleton (the methyl moved!); (D) pent-1-ene discards a carbon.`,
    formulaConcept: 'Saytzeff: eliminate towards the more substituted β-carbon — trisubstituted > disubstituted > monosubstituted alkenes.',
    difficulty: 'HARD', chapterSlug: 'haloalkanes-haloarenes', topicSlug: 'elimination-reactions',
    sourceType: 'ORIGINAL', sourceNote: 'Saytzeff dehydrohalogenation.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `The correct Williamson synthesis for preparing **ethyl tert-butyl ether** is:`,
    options: [
      'sodium ethoxide + 2-bromo-2-methylpropane',
      'sodium tert-butoxide + bromoethane',
      'ethanol + tert-butyl chloride with heat',
      'sodium ethoxide + ethanol',
    ],
    correctAnswer: 'B',
    solutionText: `Williamson ether synthesis is an **$S_N2$** reaction: a strong alkoxide nucleophile attacks a **primary** alkyl halide backside.

**Rule:** put the bulky group in the *alkoxide* and the simple group in the *halide*:
$$(\\text{CH}_3)_3\\text{C}\\text{O}^-\\text{Na}^+ + \\text{C}_2\\text{H}_5\\text{Br} \\to (\\text{CH}_3)_3\\text{C}\\text{O}\\text{C}_2\\text{H}_5 + \\text{NaBr}$$

The primary bromoethane is a perfect $S_N2$ substrate — unhindered backside attack.

**Why the others are wrong:** (A) tert-butyl bromide is 3° — alkoxides are strong *bases*, so with a 3° halide the reaction goes **E2** (isobutylene, not the ether); (C) tert-butyl chloride + ethanol under acid/heat gives elimination and/or the ether only inefficiently via $S_N1$ (and rearranged/oligomerised side products); (D) two alcohols have no leaving group — nothing happens.`,
    formulaConcept: 'Williamson = SN2: primary halide + any alkoxide ✓; tertiary halide + alkoxide ✗ (E2 wins).',
    difficulty: 'HARD', chapterSlug: 'alcohols-phenols-ethers', topicSlug: 'ethers',
    sourceType: 'ORIGINAL', sourceNote: 'Williamson substrate-pairing logic.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `The correct order of reactivity towards **nucleophilic addition** reactions is:`,
    options: [
      'CH₃COCH₃ > CH₃CHO > HCHO',
      'CH₃CHO > HCHO > CH₃COCH₃',
      'HCHO > CH₃CHO > CH₃COCH₃',
      'All react equally',
    ],
    correctAnswer: 'C',
    solutionText: `Nucleophilic addition to a carbonyl is slowed by anything that (i) donates electron density to the C=O carbon (+I/+R alkyl groups) or (ii) blocks the nucleophile's approach (steric bulk).

**Both factors rank:**
$$\\underbrace{\\text{HCHO}}_{\\text{no alkyl}} > \\underbrace{\\text{CH}_3\\text{CHO}}_{\\text{one alkyl}} > \\underbrace{\\text{CH}_3\\text{COCH}_3}_{\\text{two alkyls}}$$

Formaldehyde — electron-poor and unhindered — is the most reactive carbonyl in the series (and hydrates completely in water); acetone, with two methyls feeding the carbon, is the least reactive of the three (though still a ketone that adds well).

**Why the others are wrong:** (A) is the exact reverse (ketone placed above aldehydes — reverses both effects); (B) mixes the pattern; (D) ignores both electronic and steric effects.`,
    formulaConcept: 'Carbonyl reactivity: fewer alkyl groups → less +I donation + less steric hindrance → faster addition.',
    difficulty: 'HARD', chapterSlug: 'aldehydes-ketones-acids', topicSlug: 'nucleophilic-addition',
    sourceType: 'ORIGINAL', sourceNote: 'Aldehyde vs ketone reactivity ordering.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `Benzenediazonium chloride is converted to chlorobenzene using:`,
    options: ['Cu₂Cl₂/HCl (Sandmeyer)', 'Cu/HCl (Gattermann)', 'HCl alone', 'CuCl₂/H₂O'],
    correctAnswer: 'A',
    solutionText: `Replacing the diazonium group with chlorine requires a **chloride-carrying copper(I) reagent**:
$$\\text{C}_6\\text{H}_5\\text{N}_2^+\\text{Cl}^- \\xrightarrow{\\ \\text{Cu}_2\\text{Cl}_2 / \\text{HCl}\\ } \\text{C}_6\\text{H}_5\\text{Cl} + \\text{N}_2\\uparrow$$

This is the **Sandmeyer reaction** (1884): Cu(I) is oxidised to Cu(II) as it hands over the nucleophile — a radical-mediated substitution with clean loss of nitrogen gas.

**Why the others are wrong:** (B) Cu/HCl is the **Gattermann** reaction — it also gives chlorobenzene, but in lower yield; JEE convention assigns Sandmeyer ($\\text{Cu}_2\\text{Cl}_2$/HCl) as the standard answer for the diazonium → chloro conversion; (C) HCl alone cannot replace $\\text{N}_2^+$ — no copper catalyst; (D) aqueous $\\text{CuCl}_2$ mainly brings hydrolysis to phenol side-products.`,
    formulaConcept: 'Sandmeyer: ArN₂⁺ + Cu₂Cl₂/HCl → ArCl + N₂; Gattermann (Cu/HCl) same product, lower yield.',
    difficulty: 'MODERATE', chapterSlug: 'amines', topicSlug: 'diazonium-salts',
    sourceType: 'ORIGINAL', sourceNote: 'Diazonium-to-chloro conversion with scheme.',
    diagram: {
      kind: 'organic',
      parts: [
        { type: 'ring', x: 95, y: 90, ringSize: 6, aromatic: true, label: 'benzenediazonium chloride', substituents: [{ position: 0, label: 'N₂⁺Cl⁻' }] },
        { type: 'arrow', x1: 190, y1: 90, x2: 280, y2: 90, label: 'Cu₂Cl₂ / HCl', labelAbove: true },
        { type: 'arrow', x1: 235, y1: 62, x2: 235, y2: 26, label: '−N₂ ↑', labelAbove: true },
        { type: 'ring', x: 372, y: 90, ringSize: 6, aromatic: true, label: 'chlorobenzene', substituents: [{ position: 0, label: 'Cl' }] },
        { type: 'text', x: 235, y: 165, text: 'Sandmeyer (1884): Cu(I) delivers Cl•', bold: true },
        { type: 'text', x: 235, y: 185, text: 'diazo salts kept cold (0–5 °C), N₂ bubbles out cleanly' },
      ],
      caption: 'diazonium → chlorobenzene (Cu₂Cl₂/HCl)',
    },
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `Among the following vitamins, the one that is **fat-soluble** is:`,
    options: ['Vitamin B₁', 'Vitamin B₁₂', 'Vitamin C', 'Vitamin D'],
    correctAnswer: 'D',
    solutionText: `Vitamins sort into two solubility classes:

| Fat-soluble (stored in liver/fat) | Water-soluble (excreted daily) |
|---|---|
| A, D, E, K | B-complex, C |

**Vitamin D** (cholecalciferol family — steroidal, hydrocarbon-rich) dissolves in fats, which is why it can be stored in the body for months and why deficiency develops slowly.

**Why the others are wrong:** (A) thiamine (B₁) and (B) cobalamin (B₁₂) are B-complex members with polar, water-soluble structures; (C) ascorbic acid (vitamin C) is famously water-soluble (hence the daily glass of citrus).`,
    formulaConcept: 'Fat-soluble vitamins: A, D, E, K ("A DEK"); everything else (B, C) is water-soluble.',
    difficulty: 'MODERATE', chapterSlug: 'biomolecules', topicSlug: 'vitamins-nucleic-acids',
    sourceType: 'ORIGINAL', sourceNote: 'Vitamin solubility classification.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `0.30 g of an organic compound on complete combustion gives 0.44 g of $\\text{CO}_2$ and 0.18 g of $\\text{H}_2\\text{O}$. The percentages of carbon and hydrogen in the compound are:`,
    options: ['40% C, 6.67% H', '20% C, 12% H', '40% C, 12% H', '26.7% C, 2.2% H'],
    correctAnswer: 'A',
    solutionText: `**Carbon** (all of it lands in $\\text{CO}_2$, molar mass 44, of which C is 12):
$$\\%C = \\frac{12}{44} \\times \\frac{m(\\text{CO}_2)}{m(\\text{sample})} \\times 100 = \\frac{12}{44} \\times \\frac{0.44}{0.30} \\times 100 = 40\\%$$

**Hydrogen** (each $\\text{H}_2\\text{O}$, mass 18, carries 2 g of H):
$$\\%H = \\frac{2}{18} \\times \\frac{0.18}{0.30} \\times 100 = 6.67\\%$$

(Quick check: 40 + 6.67 = 46.7%, remainder 53.3% is oxygen or another element — consistent with a carbohydrate-like empirical formula $\\text{CH}_2\\text{O}$: C 40.0%, H 6.67%, O 53.3% ✓.)

**Why the others are wrong:** (B) 20% halves the CO₂ carbon fraction; (C) 12% H counts the whole water mass as hydrogen; (D) 26.7%/2.2% belong to a different sample entirely.`,
    formulaConcept: 'Combustion analysis: $\\%C = \\tfrac{12}{44}(m_{CO_2}/m) \\cdot 100$, $\\%H = \\tfrac{2}{18}(m_{H_2O}/m) \\cdot 100$.',
    difficulty: 'HARD', chapterSlug: 'purification-characterisation', topicSlug: 'quantitative-analysis',
    sourceType: 'ORIGINAL', sourceNote: 'Liebig combustion percentages.',
    diagram: {
      kind: 'apparatus',
      parts: [
        { type: 'arrow', x1: 8, y1: 122, x2: 36, y2: 122 },
        { type: 'label', x: 24, y: 104, text: 'O₂ + sample' },
        { type: 'tube', x: 130, y: 100, w: 190, h: 44, label: 'combustion tube (red-hot CuO)' },
        { type: 'burner', x: 110, y: 162 },
        { type: 'burner', x: 205, y: 162 },
        { type: 'arrow', x1: 228, y1: 122, x2: 258, y2: 122 },
        { type: 'tube', x: 305, y: 100, w: 80, h: 44, label: 'H₂O absorber (Mg(ClO₄)₂)' },
        { type: 'arrow', x1: 350, y1: 122, x2: 380, y2: 122 },
        { type: 'tube', x: 425, y: 100, w: 80, h: 44, label: 'CO₂ absorber (KOH)' },
        { type: 'label', x: 365, y: 168, text: 'absorbers weighed before & after' },
        { type: 'label', x: 365, y: 188, text: 'Δm(H₂O) → %H · Δm(CO₂) → %C' },
      ],
      caption: 'Liebig combustion train for C and H estimation',
    },
  },
  // ---------------- SECTION B (numerical) Q46–Q50 ----------------
  {
    subject: 'CHEMISTRY', section: 'B',
    text: `A weak monobasic acid HA has $K_a = 1\\times10^{-5}$ and concentration $0.1\\ \\text{M}$. The pH of its solution is:`,
    correctAnswer: '3',
    solutionText: `For a weak acid with small dissociation, $[\\text{H}^+] = \\sqrt{K_a C}$:
$$[\\text{H}^+] = \\sqrt{10^{-5} \\times 10^{-1}} = \\sqrt{10^{-6}} = 10^{-3}\\ \\text{M}$$

**pH:**
$$pH = -\\log[\\text{H}^+] = 3$$

(The degree of dissociation $\\alpha = \\sqrt{K_a/C} = \\sqrt{10^{-4}} = 0.01$ — only 1% dissociated, confirming the approximation $C - x \\approx C$ used above.)`,
    formulaConcept: 'Weak acid: $[H^+] = \\sqrt{K_aC}$; check the approximation via $\\alpha = \\sqrt{K_a/C} \\ll 1$.',
    difficulty: 'HARD', chapterSlug: 'equilibrium', topicSlug: 'ionic-equilibrium-ph',
    sourceType: 'ORIGINAL', sourceNote: 'Ostwald dilution-law pH.',
  },
  {
    subject: 'CHEMISTRY', section: 'B',
    text: `The number of moles of electrons required to reduce one mole of $\\text{Cr}_2\\text{O}_7^{2-}$ to $\\text{Cr}^{3+}$ in acidic medium is:`,
    correctAnswer: '6',
    solutionText: `Balance the half-reaction (acidic medium):
$$\\text{Cr}_2\\text{O}_7^{2-} + 14\\text{H}^+ + n e^- \\to 2\\text{Cr}^{3+} + 7\\text{H}_2\\text{O}$$

**Count the electron transfer per chromium:** Cr goes from $+6$ (in dichromate: $2x + 7(-2) = -2 \\Rightarrow x = +6$) to $+3$ — that is **3 electrons gained per Cr**.

**Two chromium atoms per dichromate:**
$$n = 2 \\times 3 = 6\\ \\text{electrons}$$

**Verify by charge balance:** left: $-2 + 14 - 6 = +6$; right: $2(+3) = +6$ ✓`,
    formulaConcept: 'Dichromate half-reaction: 2 Cr × (6 → 3) = 6 electrons; the workhorse of redox titrimetry.',
    difficulty: 'MODERATE', chapterSlug: 'redox-electrochemistry', topicSlug: 'redox-reactions',
    sourceType: 'ORIGINAL', sourceNote: 'Dichromate electron count.',
  },
  {
    subject: 'CHEMISTRY', section: 'B',
    text: `A first-order reaction has a half-life of $10\\ \\text{min}$. The time (in minutes, round off to one decimal) required for 90% completion is: $(\\ln 10 = 2.303)$`,
    correctAnswer: '33.2',
    solutionText: `**Rate constant from the half-life:**
$$k = \\frac{\\ln 2}{t_{1/2}} = \\frac{0.693}{10} = 0.0693\\ \\text{min}^{-1}$$

**First-order integrated equation for 90% completion** (10% left):
$$t = \\frac{2.303}{k}\\log\\frac{[A]_0}{[A]} = \\frac{2.303}{0.0693}\\log\\frac{100}{10} = \\frac{2.303}{0.0693} \\times 1 = 33.2\\ \\text{min}$$

**Shortcut check:** 90% completion ≈ 3.32 half-lives ($2^{3.32} \\approx 10$), and $3.32 \\times 10 = 33.2$ min ✓ — the "rule of 3.3 half-lives".`,
    formulaConcept: 'First order: $t_{90\\%} = 3.32\\,t_{1/2}$ — count half-lives, don\'t re-derive.',
    difficulty: 'HARD', chapterSlug: 'chemical-kinetics', topicSlug: 'integrated-rate-equations',
    sourceType: 'ORIGINAL', sourceNote: '90%-completion timing.',
  },
  {
    subject: 'CHEMISTRY', section: 'B',
    text: `The osmotic pressure (in atm, round off to two decimals) of a $0.1\\ \\text{M}$ aqueous NaCl solution at $300\\ \\text{K}$ is: (assume complete dissociation, $R = 0.0821\\ \\text{L atm mol}^{-1}\\text{K}^{-1}$)`,
    correctAnswer: '4.93',
    solutionText: `NaCl dissociates completely: $i = 2$ (one Na⁺ + one Cl⁻ per formula unit).

**van't Hoff equation:**
$$\\pi = iCRT = 2 \\times 0.1 \\times 0.0821 \\times 300$$

**Compute:**
$$\\pi = 2 \\times 0.1 \\times 24.63 = 4.926 \\approx 4.93\\ \\text{atm}$$

A glucose solution of the same molarity would exert only 2.46 atm — the electrolyte doubles the particle count and hence the osmotic pull. (This is why saline for medical use is carefully isotonic at ~0.9% w/v.)`,
    formulaConcept: '$\\pi = iCRT$ — dissociation multiplies particles, and particles are all the semipermeable membrane feels.',
    difficulty: 'HARD', chapterSlug: 'solutions', topicSlug: 'colligative-properties',
    sourceType: 'ORIGINAL', sourceNote: 'Electrolyte osmotic pressure.',
  },
  {
    subject: 'CHEMISTRY', section: 'B',
    text: `An organic acid has vapour density $30$. Combustion analysis shows it contains $40\\%$ carbon and $6.67\\%$ hydrogen by mass (the rest being oxygen). The molecular mass of the acid (in g/mol) is:`,
    correctAnswer: '60',
    solutionText: `**Step 1 — empirical formula.** For a 100 g basis:
$$n_C : n_H : n_O = \\frac{40}{12} : \\frac{6.67}{1} : \\frac{53.3}{16} = 3.33 : 6.67 : 3.33 = 1 : 2 : 1$$

Empirical formula: $\\text{CH}_2\\text{O}$ — empirical mass $= 12 + 2 + 16 = 30$ g/mol.

**Step 2 — molecular mass from vapour density:**
$$M = 2 \\times VD = 2 \\times 30 = 60\\ \\text{g/mol}$$

**Step 3 — consistency check:** $n = \\dfrac{60}{30} = 2 \\Rightarrow$ molecular formula $\\text{C}_2\\text{H}_4\\text{O}_2$ — acetic acid ($\\text{CH}_3\\text{COOH}$), whose percentages (24/60 = 40% C, 4/60 = 6.67% H, 32/60 = 53.3% O) match perfectly ✓`,
    formulaConcept: '$M = 2 \\times$ vapour density; scale the empirical formula by $M/M_{emp}$.',
    difficulty: 'HARD', chapterSlug: 'some-basic-concepts', topicSlug: 'empirical-formulas',
    sourceType: 'ORIGINAL', sourceNote: 'Vapour-density to molecular formula.',
  },
]
