import type { SeedQuestion } from '@/content/types'

// ============================================================================
// MOCK 04 — CHEMISTRY (Q26–Q50: 20 MCQ Section A + 5 numerical Section B)
// Difficulty target: Moderate JEE Main. All calculations hand-verified.
// Answer keys balanced 5/5/5/5 across Section A. Scenarios FRESH
// (no reuse from mocks 01–03).
// ============================================================================

export const CHEMISTRY_MOCK04: SeedQuestion[] = [
  // ---------------- SECTION A (MCQ) Q26–Q45 ----------------
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `Exactly $5.85\\ \\text{g}$ of $\\text{NaCl}$ $(M = 58.5\\ \\text{g/mol})$ is dissolved in water to make $500\\ \\text{mL}$ of solution. The molarity of the solution is:`,
    options: ['0.05 M', '0.2 M', '0.4 M', '2.0 M'],
    correctAnswer: 'B',
    solutionText: `**Moles of NaCl:**
$$n = \\frac{5.85}{58.5} = 0.1\\ \\text{mol}$$

**Molarity** $=$ moles per litre of solution:
$$M = \\frac{0.1\\ \\text{mol}}{0.5\\ \\text{L}} = 0.2\\ \\text{M}$$

**Why the others are wrong:** (A) 0.05 M treats 500 mL as 2 L; (C) 0.4 M divides by 0.25 L; (D) 2.0 M forgets to convert mL→L somewhere and also drops the 0.1.`,
    formulaConcept: 'Molarity $=$ moles of solute / volume of solution in litres.',
    difficulty: 'EASY', chapterSlug: 'some-basic-concepts', topicSlug: 'concentration-terms',
    sourceType: 'ORIGINAL', sourceNote: 'Basic molarity computation.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `The number of radial (spherical) nodes in a $3p$ orbital is:`,
    options: ['0', '2', '1', '3'],
    correctAnswer: 'C',
    solutionText: `**Radial nodes** occur where the radial wavefunction passes through zero between shells:
$$\\text{radial nodes} = n - l - 1$$

For $3p$: $n = 3$, $l = 1$:
$$\\text{nodes} = 3 - 1 - 1 = 1$$

*(Check: a $3p$ orbital has one inner spherical shell where $\\psi = 0$ — separating the outer lobe from the nucleus region, plus one angular node — the nodal plane of every p orbital.)*

**Why the others are wrong:** (A) 0 nodes is the $2p$ case ($2-1-1=0$) — one shell lower; (B) 2 is the *angular* node count of a d orbital, misapplied here; (D) 3 equals $n$ itself — that is the TOTAL node count of the shell, not the radial count.`,
    formulaConcept: 'Radial nodes $= n - l - 1$; angular nodes $= l$; total nodes $= n - 1$.',
    difficulty: 'EASY', chapterSlug: 'atomic-structure', topicSlug: 'quantum-numbers-orbitals',
    sourceType: 'ORIGINAL', sourceNote: 'Node counting for 3p.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `The shape of the $\\text{ClF}_3$ molecule is:`,
    options: ['T-shaped', 'Trigonal planar', 'Trigonal pyramidal', 'Bent (V-shaped)'],
    correctAnswer: 'A',
    solutionText: `**Steric count:** chlorine has 7 valence electrons; three are used in $\\sigma$-bonds to F, leaving **2 lone pairs**.
$$\\text{electron domains} = 3\\ (\\text{bonds}) + 2\\ (\\text{lp}) = 5 \\implies sp^3d\\ \\text{hybridisation}$$

Five domains arrange trigonal-bipyramidally. The lone pairs occupy **two equatorial positions** (they repel most, so they take the roomiest sites $120^\\circ$ apart). What remains visible:
$$\\text{two axial F} + \\text{one equatorial F} \\implies \\textbf{T-shape}$$

The axial F–Cl–F angle is squeezed below $180^\\circ$ ($\\approx 175^\\circ$) by lone-pair repulsion — see the structure.

**Why the others are wrong:** (B) trigonal planar ignores lone pairs entirely; (C) pyramidal would be $\\text{NH}_3$-like — only one lone pair, three bonds; (D) bent is two bonds + lp/lp — water-like.`,
    formulaConcept: 'ClF₃: 5 domains, lone pairs equatorial → T-shaped (compare SF₄ see-saw with one lp).',
    difficulty: 'MODERATE', chapterSlug: 'chemical-bonding', topicSlug: 'vsepr-shapes',
    sourceType: 'ORIGINAL', sourceNote: 'ClF3 T-shape with lone pairs shown.',
    diagram: {
      kind: 'molecule',
      atoms: [
        { sym: 'Cl', x: 100, y: 100, label: 'Cl (sp³d)' },
        { sym: 'F', x: 100, y: 30, label: 'F_ax' },
        { sym: 'F', x: 100, y: 170, label: 'F_ax' },
        { sym: 'F', x: 185, y: 100, label: 'F_eq' },
      ],
      bonds: [
        { a: 0, b: 1 }, { a: 0, b: 2 }, { a: 0, b: 3 },
      ],
      lonePairs: [
        { atom: 0, count: 2, angles: [120, 240] },
      ],
      caption: 'ClF₃ — T-shaped · 2 lone pairs equatorial · F_ax–Cl–F_ax ≈ 175°',
    },
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `The bond order of the superoxide ion $\\text{O}_2^-$ is:`,
    options: ['1.0', '2.0', '2.5', '1.5'],
    correctAnswer: 'D',
    solutionText: `**Valence MO filling for $\\text{O}_2^-$ (13 valence electrons):**

$$\\sigma 2s^2\\;\\sigma^{*}2s^2\\;\\sigma 2p_z^2\\;(\\pi 2p_x = \\pi 2p_y)^4\\;(\\pi^{*}2p_x)^2\\,(\\pi^{*}2p_y)^1$$

Bonding electrons: $N_b = 2 + 2 + 4 = 8$ (in $\\sigma 2s$, $\\sigma 2p_z$, and the $\\pi$ pair). Antibonding: $N_a = 2 + 2 + 1 = 5$.

**Bond order:**
$$\\text{BO} = \\frac{N_b - N_a}{2} = \\frac{8 - 5}{2} = 1.5$$

One electron sits in $\\pi^*$ → **one unpaired electron → paramagnetic**.

*(The family: $\\text{O}_2^+$ BO 2.5 · $\\text{O}_2$ BO 2 · $\\text{O}_2^-$ BO 1.5 · $\\text{O}_2^{2-}$ BO 1 — see table.)*

**Why the others are wrong:** (A) 1.0 is peroxide $\\text{O}_2^{2-}$; (B) 2.0 is neutral $\\text{O}_2$; (C) 2.5 is $\\text{O}_2^+$.`,
    formulaConcept: 'Bond order $= (N_b - N_a)/2$ from the MO filling; each $\\pi^*$ electron lowers BO by ½.',
    difficulty: 'MODERATE', chapterSlug: 'chemical-bonding', topicSlug: 'molecular-orbital-theory',
    sourceType: 'ORIGINAL', sourceNote: 'Superoxide bond order with MO table.',
    diagram: {
      kind: 'table',
      headers: ['Species', 'e⁻ count', 'Extra π* e⁻', 'Bond order', 'Magnetism'],
      rows: [
        ['O₂⁺', 15, '−1 (hole)', '2.5', 'paramagnetic (1 e⁻)'],
        ['O₂', 16, '0', '2.0', 'paramagnetic (2 e⁻)'],
        ['O₂⁻', 17, '+1', '1.5', 'paramagnetic (1 e⁻)'],
        ['O₂²⁻', 18, '+2', '1.0', 'diamagnetic'],
      ],
      caption: 'The dioxygen MO family — bond order falls by ½ per π* electron; O–O length rises in the same order',
      highlightCells: [[2, 3], [2, 2]],
    },
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `A gas absorbs $500\\ \\text{J}$ of heat and, in expanding, does $200\\ \\text{J}$ of work on the surroundings. The change in internal energy of the gas is:`,
    options: ['+700 J', '+300 J', '−300 J', '−700 J'],
    correctAnswer: 'B',
    solutionText: `**First law** (with $w$ = work done BY the gas):
$$\\Delta U = q - w_{\\text{by}}$$

**Substituting:**
$$\\Delta U = 500 - 200 = +300\\ \\text{J}$$

The gas gained more energy thermally than it spent mechanically, so its internal energy (temperature, for an ideal gas) rises.

**Why the others are wrong:** (A) +700 J ADDS the work (that would be the $\\Delta U = q + w_{\\text{on}}$ sign if the work were done ON the gas); (C) −300 J flips the sign of $q$; (D) −700 J is the double error.

*(Sign conventions: IUPAC — $\\Delta U = q + w$ with $w$ = work ON the system $= -200$ J here, giving the same $+300$ J.)*`,
    formulaConcept: 'First law: $\\Delta U = q - w_{\\text{by system}}$ — heat in minus work delivered.',
    difficulty: 'EASY', chapterSlug: 'thermodynamics-chemistry', topicSlug: 'enthalpy',
    sourceType: 'ORIGINAL', sourceNote: 'First-law sign bookkeeping.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `For the reaction $\\text{N}_2(g) + 3\\text{H}_2(g) \\rightleftharpoons 2\\text{NH}_3(g)$, the relation between $K_p$ and $K_c$ is:`,
    options: ['$K_p = K_c$', '$K_p = K_c(RT)^{2}$', '$K_p = K_c(RT)^{-2}$', '$K_p = K_c(RT)^{1/2}$'],
    correctAnswer: 'C',
    solutionText: `**The general link:**
$$K_p = K_c\\,(RT)^{\\Delta n} \\quad \\text{where } \\Delta n = \\sum n_{\\text{gas,products}} - \\sum n_{\\text{gas,reactants}}$$

**Here:**
$$\\Delta n = 2 - (1 + 3) = -2$$

Therefore:
$$K_p = K_c\\,(RT)^{-2} = \\frac{K_c}{(RT)^2}$$

Since $\\Delta n < 0$, $K_p < K_c$ at any temperature — fewer gas moles on the product side.

**Why the others are wrong:** (A) holds only when $\\Delta n = 0$; (B) uses $+\\Delta n$ magnitude; (D) halves the exponent — a $\\Delta n = 1/2$ situation that cannot occur with integer stoichiometry.`,
    formulaConcept: '$K_p = K_c(RT)^{\\Delta n}$ — count gas moles on both sides; here $\\Delta n = -2$.',
    difficulty: 'MODERATE', chapterSlug: 'equilibrium', topicSlug: 'chemical-equilibrium',
    sourceType: 'ORIGINAL', sourceNote: 'Kp–Kc relation with Δn table.',
    diagram: {
      kind: 'table',
      headers: ['Reaction', 'Δn (gas)', 'Kp vs Kc'],
      rows: [
        ['N₂ + 3H₂ ⇌ 2NH₃', '−2', 'Kp = Kc(RT)⁻² (smaller)'],
        ['H₂ + I₂ ⇌ 2HI', '0', 'Kp = Kc'],
        ['PCl₅ ⇌ PCl₃ + Cl₂', '+1', 'Kp = Kc(RT)¹ (larger)'],
        ['2SO₂ + O₂ ⇌ 2SO₃', '−1', 'Kp = Kc(RT)⁻¹ (smaller)'],
      ],
      caption: 'Δn decides everything: fewer product gas moles → Kp < Kc',
      highlightCells: [[0, 1], [0, 2]],
    },
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `The pH of a $0.001\\ \\text{M}$ aqueous $\\text{H}_2\\text{SO}_4$ solution (assuming complete dissociation of both protons) is closest to:`,
    options: ['2.7', '3.0', '2.0', '11.3'],
    correctAnswer: 'A',
    solutionText: `Sulfuric acid donates both protons (as assumed):
$$[\\text{H}^+] = 2 \\times 0.001 = 2 \\times 10^{-3}\\ \\text{M}$$

**pH:**
$$\\text{pH} = -\\log(2\\times10^{-3}) = 3 - \\log 2 = 3 - 0.301 = 2.70$$

**Why the others are wrong:** (B) 3.0 forgets the SECOND proton; (C) 2.0 is the pH of $10^{-2}$ M strong monoprotic — overshoots; (D) 11.3 is basic (sign flipped — pH of a BASE of that concentration, $-\\log$ of $\\text{pOH}$-style error).

*(In reality the second dissociation is not quite complete — $K_{a2} \\approx 10^{-2}$ — so the true pH is very slightly above 2.70, but 2.7 is the expected answer under the stated assumption.)*`,
    formulaConcept: 'Diprotic strong acid: $[\\text{H}^+] = 2C$; pH $= -\\log[H^+]$.',
    difficulty: 'MODERATE', chapterSlug: 'equilibrium', topicSlug: 'ionic-equilibrium-ph',
    sourceType: 'ORIGINAL', sourceNote: 'Diprotic strong-acid pH.',
    diagram: {
      kind: 'bars',
      title: 'pH of common 0.001 M species (for scale)',
      categories: ['H₂SO₄ (2H⁺)', 'HCl', 'NaOH', 'CH₃COOH (Ka=1.8×10⁻⁵)'],
      series: [
        { name: 'pH', values: [2.7, 3.0, 11.0, 3.88], color: 'var(--gold)' },
      ],
      yAxis: { label: 'pH', min: 0, max: 14 },
    },
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `The quantity of charge (in coulombs) required to deposit one mole of aluminium from molten $\\text{Al}_2\\text{O}_3$ by electrolysis is:`,
    options: ['$2.89 \\times 10^5$ C', '$1.93 \\times 10^4$ C', '$9.65 \\times 10^3$ C', '$9.65 \\times 10^4$ C'],
    correctAnswer: 'A',
    solutionText: `**The electrode reaction:**
$$\\text{Al}^{3+} + 3e^- \\to \\text{Al}$$

Each aluminium atom needs **3 electrons**, so one mole of Al consumes 3 moles of electrons:

**Charge:**
$$Q = 3F = 3 \\times 96{,}500 = 2.895 \\times 10^5\\ \\text{C} \\approx 2.89 \\times 10^5\\ \\text{C}$$

**Why the others are wrong:** (D) $9.65\\times10^4$ C is ONE faraday (monovalent case — Ag, Cu⁺); (B)/(C) divide instead of multiplying by 3 (and (C) is a further order down — the charge for 0.1 mol).`,
    formulaConcept: 'Faraday electrolysis law: $Q = nF$ where $n$ = moles of electrons $= (\\text{mol ions}) \\times |\\text{charge on ion}|$.',
    difficulty: 'MODERATE', chapterSlug: 'redox-electrochemistry', topicSlug: 'electrolysis',
    sourceType: 'ORIGINAL', sourceNote: 'Trivalent electrolysis charge.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `For a first-order reaction with rate constant $k = 6.93 \\times 10^{-3}\\ \\text{s}^{-1}$, the half-life is:`,
    options: ['50 s', '100 s', '200 s', '10 s'],
    correctAnswer: 'B',
    solutionText: `**First-order half-life:**
$$t_{1/2} = \\frac{\\ln 2}{k} = \\frac{0.693}{k}$$

**Substituting:**
$$t_{1/2} = \\frac{0.693}{6.93 \\times 10^{-3}} = \\frac{0.693}{0.00693} = 100\\ \\text{s}$$

*(Note the hallmark of first order: this half-life is independent of the initial concentration — the 4th half-life also takes 100 s.)*

**Why the others are wrong:** (A) 50 s uses $\\ln 2 \\approx 0.35$-style slip or halves twice; (C) 200 s doubles instead of reading the arithmetic; (D) 10 s drops a factor of ten in the exponent bookkeeping.`,
    formulaConcept: 'First order: $t_{1/2} = 0.693/k$ — concentration-independent.',
    difficulty: 'MODERATE', chapterSlug: 'chemical-kinetics', topicSlug: 'integrated-rate-equations',
    sourceType: 'ORIGINAL', sourceNote: 'First-order half-life with decay curve.',
    diagram: {
      kind: 'graph',
      title: 'first-order decay — [A]/[A]₀ halves every 100 s',
      xAxis: { label: 't (s)', min: 0, max: 500, ticks: [0, 100, 200, 300, 400, 500] },
      yAxis: { label: '[A]/[A]₀ (%)', min: 0, max: 100, ticks: [0, 25, 50, 75, 100] },
      showGrid: true, square: false,
      curves: [
        { type: 'curve', points: [[0, 100], [50, 70.7], [100, 50], [150, 35.4], [200, 25], [250, 17.7], [300, 12.5], [350, 8.8], [400, 6.25], [450, 4.4], [500, 3.1]], color: 'var(--gold)', label: 'e^(−kt)' },
      ],
      markers: [
        { x: 100, y: 50, label: 't½ = 100 s → 50%', color: 'var(--chart-2)' },
        { x: 200, y: 25, label: '2·t½ → 25%', color: 'var(--chart-3)' },
        { x: 300, y: 12.5, label: '3·t½ → 12.5%', color: 'var(--chart-4)' },
      ],
      shadedRegions: [],
    },
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `Which of the following is **NOT** a colligative property?`,
    options: ['Osmotic pressure', 'Elevation of boiling point', 'Optical rotation', 'Relative lowering of vapour pressure'],
    correctAnswer: 'C',
    solutionText: `Colligative properties depend **only on the number of solute particles**, not their identity:
- Relative lowering of VP $= x_{\\text{solute}}$ ✓
- Boiling point elevation $\\Delta T_b = K_b m$ ✓
- Freezing point depression $\\Delta T_f = K_f m$ ✓
- Osmotic pressure $\\pi = CRT$ ✓

**Optical rotation**, by contrast, depends on the *molecular chirality* of the solute — 0.1 M sucrose rotates plane-polarised light; 0.1 M glucose (same particle count) rotates differently; 0.1 M NaCl (achiral) does not rotate at all. It is an identity-dependent (extensive-in-a-different-sense) property, NOT colligative.

**Why the others are wrong:** (A), (B), (D) are the three classical colligative properties alongside $\\Delta T_f$.`,
    formulaConcept: 'Colligative $\\propto$ particle count only; optical rotation depends on chirality → not colligative.',
    difficulty: 'EASY', chapterSlug: 'solutions', topicSlug: 'colligative-properties',
    sourceType: 'ORIGINAL', sourceNote: 'Colligative-property identification.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `Among the elements Na, Mg, Al and Si, the one with the HIGHEST first ionisation enthalpy is:`,
    options: ['Si', 'Na', 'Mg', 'Al'],
    correctAnswer: 'A',
    solutionText: `**Across a period**, $IE_1$ generally rises: nuclear charge grows while electrons enter the same shell.

Values (kJ/mol): $\\text{Na}\\ 496 < \\text{Al}\\ 577 < \\text{Mg}\\ 737 < \\text{Si}\\ 786$.

**Silicon wins** — with one caveat worth knowing: Mg ($3s^2$) beats Al because removing Al's first $3p$ electron is easier than breaking Mg's filled $3s^2$ pair. That is why the order is NOT strictly monotonic, but the champion is still Si.

**Why the others are wrong:** (B) Na has the largest atom and lowest IE of the four; (C) Mg holds second place thanks to its $3s^2$ stability, not first; (D) Al's $3p^1$ electron is the most easily removed of the mid-trio.`,
    formulaConcept: 'IE1 rises across a period; the filled-subshell exception (Mg > Al) reorders the middle but Si still tops the row.',
    difficulty: 'MODERATE', chapterSlug: 'classification-periodicity', topicSlug: 'ionization-enthalpy',
    sourceType: 'ORIGINAL', sourceNote: 'Periodic IE trend with Mg/Al exception.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `The geometry of $\\text{XeF}_4$ is:`,
    options: ['Tetrahedral', 'Octahedral', 'See-saw', 'Square planar'],
    correctAnswer: 'D',
    solutionText: `**Steric count:** Xe has 8 valence electrons; four bond to F, leaving **2 lone pairs**:
$$\\text{domains} = 4\\ (\\text{bonds}) + 2\\ (\\text{lp}) = 6 \\implies sp^3d^2$$

Six domains arrange octahedrally. The two lone pairs take **opposite (trans) axial positions** to minimise $lp$–$lp$ repulsion, leaving the four F atoms in one plane:
$$\\text{square planar}, \\quad \\angle \\text{F–Xe–F} = 90^\\circ\\ \\text{exactly (symmetry)}$$

**Why the others are wrong:** (A) tetrahedral counts only bonds; (B) octahedral is the electron-pair geometry, not the molecular shape; (C) see-saw is the 5-domain $\\text{SF}_4$ case with ONE equatorial lone pair.`,
    formulaConcept: 'XeF₄: 6 domains, lone pairs trans-axial → square planar (D₄ₕ symmetry).',
    difficulty: 'MODERATE', chapterSlug: 'chemical-bonding', topicSlug: 'vsepr-shapes',
    sourceType: 'ORIGINAL', sourceNote: 'XeF4 square planar with lone pairs drawn.',
    diagram: {
      kind: 'molecule',
      atoms: [
        { sym: 'Xe', x: 100, y: 100, label: 'Xe (sp³d²)' },
        { sym: 'F', x: 100, y: 30, label: 'F' },
        { sym: 'F', x: 100, y: 170, label: 'F' },
        { sym: 'F', x: 30, y: 100, label: 'F' },
        { sym: 'F', x: 170, y: 100, label: 'F' },
      ],
      bonds: [
        { a: 0, b: 1 }, { a: 0, b: 2 }, { a: 0, b: 3 }, { a: 0, b: 4 },
      ],
      lonePairs: [
        { atom: 0, count: 2, angles: [135, 315] },
      ],
      caption: 'XeF₄ — square planar · lone pairs trans (above/below plane) · all F–Xe–F = 90°',
    },
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `Among the following ions, the one that is **colourless** in aqueous solution is:`,
    options: ['Ti³⁺', 'Sc³⁺', 'V³⁺', 'Mn²⁺'],
    correctAnswer: 'B',
    solutionText: `Colour in transition-metal ions arises from **d–d transitions**, which require a partially filled d subshell.

**Check each:**
- $\\text{Ti}^{3+}$: $d^1$ → partially filled → violet ✔ coloured
- $\\text{Sc}^{3+}$: $d^0$ → **no d electrons — no d–d transition possible → colourless** ✔
- $\\text{V}^{3+}$: $d^2$ → green ✔ coloured
- $\\text{Mn}^{2+}$: $d^5$ → pale pink ✔ coloured

**Why the others are wrong:** (A), (C), (D) all have partially filled d subshells and show d–d absorption bands.

*(The same logic makes $\\text{Zn}^{2+}$ ($d^{10}$, completely filled) colourless — d–d transitions are forbidden when $d$ is empty OR full.)*`,
    formulaConcept: 'd–d colour needs $0 < d\\text{-count} < 10$; $d^0$ (Sc³⁺, Ti⁴⁺) and $d^{10}$ (Zn²⁺, Cu⁺) are colourless.',
    difficulty: 'MODERATE', chapterSlug: 'd-f-block-elements', topicSlug: 'transition-element-properties',
    sourceType: 'ORIGINAL', sourceNote: 'd0 colourless ion.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `The complex $[\\text{Co}(\\text{NH}_3)_5\\text{Cl}]\\text{Cl}_2$ produces how many ions per formula unit when dissolved in water?`,
    options: ['2', '4', '6', '3'],
    correctAnswer: 'D',
    solutionText: `Werner's insight: the **coordination sphere** (square brackets) is a single, intact ion in solution; only the counter-ions outside dissociate.

$$[\\text{Co}(\\text{NH}_3)_5\\text{Cl}]\\text{Cl}_2 \\to [\\text{Co}(\\text{NH}_3)_5\\text{Cl}]^{2+} + 2\\text{Cl}^-$$

The complex cation keeps its inner Cl⁻ (it is a ligand, coordinated). Counting ions:
$$1\\ \\text{(complex cation)} + 2\\ \\text{(chloride)} = 3\\ \\text{ions}$$

**Why the others are wrong:** (A) 2 assumes only one counter-ion dissociates; (B) 4 wrongly lets the coordinated Cl⁻ escape too; (C) 6 counts the 5 NH₃ as separate particles — but neutral ligands never ionise off in solution (ligand exchange ≠ ionisation).`,
    formulaConcept: 'Ionisation $=$ ions OUTSIDE the coordination sphere; $[\\text{Co}(\\text{NH}_3)_5\\text{Cl}]^{2+}$ stays whole.',
    difficulty: 'MODERATE', chapterSlug: 'coordination-compounds', topicSlug: 'nomenclature',
    sourceType: 'ORIGINAL', sourceNote: 'Werner ion-count question.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `Optically active 2-bromobutane reacts with aqueous NaOH by an $S_N2$ pathway. The 2-butanol formed will have:`,
    options: ['the same configuration (retention)', 'a 50:50 mixture of both enantiomers (racemisation)', 'the inverted configuration (Walden inversion)', 'undergone elimination only, giving but-2-ene'],
    correctAnswer: 'C',
    solutionText: `In $S_N2$, the nucleophile ($\\text{OH}^-$) attacks the stereocentre from the **side directly opposite the leaving group** — backside attack through the $\\sigma^*$ orbital — while Br⁻ departs from the front. The transition state has the three remaining groups roughly planar, and they flip like an umbrella in a storm as the reaction completes:

$$\\text{(R)-2-bromobutane} + \\text{OH}^- \\to \\text{(S)-2-butanol} + \\text{Br}^-$$

This is a **single stereochemical outcome — inversion of configuration** (Walden inversion). The product remains optically active, with the sign of rotation typically reversed.

**Why the others are wrong:** (A) retention would need a double inversion (or an $S_Ni$ pathway); (B) racemisation is the $S_N1$ signature (planar carbocation attacked from both faces); (D) elimination competes with bulky/heat conditions, not aqueous OH⁻ at modest temperature on a primary-ish centre.`,
    formulaConcept: 'SN2 = backside attack → stereospecific inversion at the reacting carbon (umbrella flip).',
    difficulty: 'MODERATE', chapterSlug: 'haloalkanes-haloarenes', topicSlug: 'nucleophilic-substitution',
    sourceType: 'ORIGINAL', sourceNote: 'Walden inversion with umbrella-flip scheme.',
    diagram: {
      kind: 'organic',
      caption: 'SN2 backside attack — the umbrella flip at C-2',
      parts: [
        { type: 'text', x: 20, y: 60, text: 'CH₃–CH(Br)–CH₂–CH₃', bold: false },
        { type: 'text', x: 20, y: 45, text: '(R)-2-bromobutane' },
        { type: 'arrow', x1: 40, y1: 80, x2: 40, y2: 110, label: 'OH⁻ attacks from BACK', labelAbove: true },
        { type: 'text', x: 20, y: 130, text: '[TS: Br···C···OH linear]', bold: true },
        { type: 'text', x: 20, y: 118, text: 'CH₃, C₂H₅, H pushed planar' },
        { type: 'arrow', x1: 40, y1: 140, x2: 40, y2: 170, label: 'Br⁻ leaves from FRONT', labelAbove: true },
        { type: 'text', x: 20, y: 190, text: 'CH₃–CH(OH)–CH₂–CH₃' },
        { type: 'text', x: 20, y: 175, text: '(S)-2-butanol — INVERTED' },
        { type: 'text', x: 150, y: 80, text: 'one-step, concerted' },
        { type: 'text', x: 150, y: 65, text: 'rate = k[RX][OH⁻] (bimolecular)' },
        { type: 'text', x: 150, y: 130, text: 'no carbocation — no racemisation' },
        { type: 'text', x: 150, y: 115, text: 'stereospecific: 100% inversion' },
      ],
    },
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `Which alcohol gives immediate turbidity with the Lucas reagent (conc. $\\text{HCl}$ + anhydrous $\\text{ZnCl}_2$) at room temperature?`,
    options: ['Ethanol', 'tert-Butyl alcohol', 'Propan-2-ol', 'Methanol'],
    correctAnswer: 'B',
    solutionText: `The Lucas test classifies alcohols by how fast the $\\text{C–OH}$ converts to $\\text{C–Cl}$:

- **Tertiary alcohols** — instant turbidity: the $3^\\circ$ carbocation forms in a flash ($S_N1$), and the insoluble chloride clouds the mixture immediately.
- **Secondary** — turbidity in ~5 minutes.
- **Primary** — no visible reaction at room temperature (hours, or needs heating).

Among the options, only **tert-butyl alcohol** $(\\text{CH}_3)_3\\text{COH}$ is tertiary — instant cloudiness via the stable $(\\text{CH}_3)_3\\text{C}^+$.

**Why the others are wrong:** (A) ethanol and (D) methanol are primary — far too slow; (C) propan-2-ol is secondary — takes minutes, not instant.`,
    formulaConcept: 'Lucas test: reactivity order $3^\\circ > 2^\\circ > 1^\\circ$ — carbocation stability drives the SN1 rate.',
    difficulty: 'EASY', chapterSlug: 'alcohols-phenols-ethers', topicSlug: 'preparation-properties',
    sourceType: 'ORIGINAL', sourceNote: 'Lucas-test classification.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `Which of the following undergoes the Cannizzaro reaction with concentrated $\\text{NaOH}$?`,
    options: ['Benzaldehyde ($\\text{C}_6\\text{H}_5\\text{CHO}$)', 'Acetaldehyde ($\\text{CH}_3\\text{CHO}$)', 'Propanal ($\\text{CH}_3\\text{CH}_2\\text{CHO}$)', 'Acetone ($\\text{CH}_3\\text{COCH}_3$)'],
    correctAnswer: 'A',
    solutionText: `The Cannizzaro (disproportionation) reaction requires an aldehyde with **NO α-hydrogen** — then, in strong base, one molecule is oxidised (to the carboxylate) while another is reduced (to the alcohol):
$$2\\text{C}_6\\text{H}_5\\text{CHO} + \\text{OH}^- \\to \\text{C}_6\\text{H}_5\\text{COO}^- + \\text{C}_6\\text{H}_5\\text{CH}_2\\text{OH}$$

**Checking α-H:**
- $\\text{CH}_3\\text{CHO}$ — α-H present → aldol condensation instead
- $\\text{CH}_3\\text{CH}_2\\text{CHO}$ — α-H present → aldol
- Acetone — ketone AND α-H → aldol-type
- $\\text{C}_6\\text{H}_5\\text{CHO}$ — the carbon next to CHO is the aromatic ring carbon: **no α-H** → **Cannizzaro** ✔

**Why the others are wrong:** (B), (C), (D) all have α-hydrogens, so hydroxide deprotonates the α-carbon and channels them into the aldol pathway instead.`,
    formulaConcept: 'Cannizzaro needs a non-enolisable aldehyde (no α-H): ArCHO, HCHO, (CH₃)₃CCHO.',
    difficulty: 'MODERATE', chapterSlug: 'aldehydes-ketones-acids', topicSlug: 'name-reactions',
    sourceType: 'ORIGINAL', sourceNote: 'Cannizzaro substrate recognition with scheme.',
    diagram: {
      kind: 'organic',
      caption: 'Cannizzaro disproportionation of benzaldehyde — hydride transfer in strong base',
      parts: [
        { type: 'ring', x: 40, y: 70, ringSize: 6, aromatic: true, substituents: [{ position: 1, label: 'CHO' }] },
        { type: 'plus', x: 80, y: 70 },
        { type: 'ring', x: 120, y: 70, ringSize: 6, aromatic: true, substituents: [{ position: 1, label: 'CHO' }] },
        { type: 'arrow', x1: 60, y1: 95, x2: 60, y2: 130, label: 'conc. NaOH (no α-H!)', labelAbove: true },
        { type: 'ring', x: 40, y: 165, ringSize: 6, aromatic: true, substituents: [{ position: 1, label: 'CH₂OH' }] },
        { type: 'plus', x: 80, y: 165 },
        { type: 'ring', x: 120, y: 165, ringSize: 6, aromatic: true, substituents: [{ position: 1, label: 'COONa' }] },
        { type: 'text', x: 160, y: 70, text: 'one oxidised' },
        { type: 'text', x: 160, y: 55, text: '+ one reduced' },
        { type: 'text', x: 160, y: 165, text: 'H⁻ transfers directly' },
        { type: 'text', x: 160, y: 150, text: 'between two aldehydes' },
      ],
    },
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `The strongest acid among the following is:`,
    options: ['HCOOH (formic acid)', 'CH₃COOH (acetic acid)', 'C₂H₅COOH (propionic acid)', 'ClCH₂COOH (monochloroacetic acid)'],
    correctAnswer: 'D',
    solutionText: `Compare acid strengths via the electron-withdrawing power stabilising the carboxylate:

**Inductive order of substituents at the α-carbon:**
- Cl (strong −I) > H (reference) > CH₃ (weak +I) > C₂H₅ (slightly stronger +I)

The chlorine's strong −I (inductive withdrawal) stabilises the carboxylate anion far better than a bare hydrogen — check the pKa values:
$$\\text{ClCH}_2\\text{COOH}\\ (2.86) < \\text{HCOOH}\\ (3.75) < \\text{CH}_3\\text{COOH}\\ (4.76) < \\text{C}_2\\text{H}_5\\text{COOH}\\ (4.87)$$

Lower pKa = stronger acid, so the winner is **monochloroacetic acid**.

**Why the others are wrong:** (A) HCOOH is the strongest *unsubstituted* acid (no +I group), but loses to the Cl-substituted one; (B), (C) alkyl groups donate electron density, destabilising the anion.`,
    formulaConcept: 'Acid strength: −I groups (Cl) pull density from the carboxylate → lower pKa; +I alkyl groups raise it.',
    difficulty: 'MODERATE', chapterSlug: 'aldehydes-ketones-acids', topicSlug: 'carboxylic-acids',
    sourceType: 'ORIGINAL', sourceNote: 'Inductive-effect acidity comparison.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `Among the following ethyl-substituted amines in aqueous solution, the strongest Brønsted base is:`,
    options: ['Ethylamine ($\\text{C}_2\\text{H}_5\\text{NH}_2$)', 'Triethylamine ($(\\text{C}_2\\text{H}_5)_3\\text{N}$)', 'Diethylamine ($(\\text{C}_2\\text{H}_5)_2\\text{NH}$)', 'Aniline ($\\text{C}_6\\text{H}_5\\text{NH}_2$)'],
    correctAnswer: 'C',
    solutionText: `In **water**, basicity of aliphatic amines is a tug-of-war between:
1. **+I electron donation** — more ethyl groups push density onto N (favourable): $3^\\circ > 2^\\circ > 1^\\circ$
2. **Solvation of the ammonium ion** — more N–H bonds to hydrogen-bond with water stabilise the PROTONATED form (favourable): $1^\\circ > 2^\\circ > 3^\\circ$

For ethyl amines the solvation effect slightly beats the third ethyl's donation, giving the well-known aqueous order:
$$ (\\text{C}_2\\text{H}_5)_2\\text{NH} > (\\text{C}_2\\text{H}_5)_3\\text{N} > \\text{C}_2\\text{H}_5\\text{NH}_2 \\gg \\text{C}_6\\text{H}_5\\text{NH}_2$$

So the strongest base is **diethylamine**.

**Why the others are wrong:** (A) primary — fewer +I groups AND it is beaten by (B); (B) tertiary — best +I but worst solvation (no N–H left on the cation), dropping it below secondary in water; (D) aniline — the lone pair delocalises into the benzene ring, crippling basicity by ~10⁶.`,
    formulaConcept: 'Aqueous amine basicity (ethyl series): 2° > 3° > 1° — solvation of the cation vs inductive donation.',
    difficulty: 'MODERATE', chapterSlug: 'amines', topicSlug: 'basicity',
    sourceType: 'ORIGINAL', sourceNote: 'Aqueous basicity order of ethylamines.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `Which of the following sugars is a **non-reducing** sugar?`,
    options: ['Glucose', 'Maltose', 'Lactose', 'Sucrose'],
    correctAnswer: 'D',
    solutionText: `A sugar reduces Tollens'/Fehling's reagent **only if it has a free anomeric (hemiacetal/hemiketal) carbon** that can open to the carbonyl form.

- **Glucose** — free anomeric C1 ✔ reducing
- **Maltose** — glucose–glucose via α-1,4 link; ONE anomeric end stays free ✔ reducing
- **Lactose** — galactose–glucose via β-1,4; glucose anomeric carbon free ✔ reducing
- **Sucrose** — glucose C1 **and** fructose C2 are BOTH locked in the α-1↔β-2 glycosidic link: no free anomeric carbon anywhere ✘ **non-reducing** ✔

**Why the others are wrong:** (A), (B), (C) each possess at least one unlinked anomeric carbon — the aldehyde (or ketose-equivalent) equilibrium persists and reduces Cu²⁺/Ag⁺.

*(Sucrose is therefore also not a mutarotating sugar — no α/β equilibrium to shift.)*`,
    formulaConcept: 'Non-reducing ⇔ both anomeric carbons consumed in the glycosidic bond — sucrose (α-1,β-2).',
    difficulty: 'EASY', chapterSlug: 'biomolecules', topicSlug: 'carbohydrates',
    sourceType: 'ORIGINAL', sourceNote: 'Sucrose non-reducing with linkage sketch.',
    diagram: {
      kind: 'organic',
      caption: 'sucrose — BOTH anomeric carbons locked (α-1 ↔ β-2), no free reducing end',
      parts: [
        { type: 'ring', x: 45, y: 70, ringSize: 6, label: 'glucose', substituents: [{ position: 1, label: 'O–fructose (α)' }] },
        { type: 'arrow', x1: 75, y1: 70, x2: 105, y2: 70, label: 'α(1→2)β', labelAbove: true },
        { type: 'ring', x: 135, y: 70, ringSize: 5, label: 'fructose', hetero: [[2, 'O']], substituents: [{ position: 2, label: 'O–glucose (β)' }] },
        { type: 'text', x: 45, y: 115, text: 'C1 of glucose: locked ✔' },
        { type: 'text', x: 45, y: 100, text: 'C2 of fructose: locked ✔' },
        { type: 'text', x: 150, y: 115, text: '⇒ non-reducing' },
        { type: 'text', x: 150, y: 100, text: '⇒ no mutarotation' },
      ],
    },
  },

  // ---------------- SECTION B (numerical) Q46–Q50 ----------------
  {
    subject: 'CHEMISTRY', section: 'B',
    text: `What volume (in mL) of $0.1\\ \\text{M}$ HCl is required to exactly neutralise $25\\ \\text{mL}$ of $0.2\\ \\text{M}$ NaOH? ______ $\\text{mL}$.`,
    correctAnswer: '50',
    solutionText: `**Neutralisation (1:1 stoichiometry):**
$$\\text{HCl} + \\text{NaOH} \\to \\text{NaCl} + \\text{H}_2\\text{O}$$

**Moles of NaOH present:**
$$n_{\\text{NaOH}} = M \\times V = 0.2 \\times 0.025 = 0.005\\ \\text{mol}$$

**Volume of HCl needed** (same moles, 1:1):
$$V_{\\text{HCl}} = \\frac{n}{M} = \\frac{0.005}{0.1} = 0.05\\ \\text{L} = \\mathbf{50}\\ \\text{mL}$$

*(Shortcut: $M_1V_1 = M_2V_2$ for 1:1 acids/bases.)*`,
    formulaConcept: '1:1 titration: $M_{\\text{acid}}V_{\\text{acid}} = M_{\\text{base}}V_{\\text{base}}$.',
    difficulty: 'EASY', chapterSlug: 'some-basic-concepts', topicSlug: 'stoichiometry',
    sourceType: 'ORIGINAL', sourceNote: 'Acid-base stoichiometry.',
  },
  {
    subject: 'CHEMISTRY', section: 'B',
    text: `A current of $2\\ \\text{A}$ is passed through a $\\text{CuSO}_4$ solution for $965\\ \\text{s}$. The mass of copper deposited on the cathode is ______ $\\text{g}$. (Atomic mass of Cu $= 63.5$; $F = 96500\\ \\text{C/mol}$)`,
    correctAnswer: '0.635',
    solutionText: `**Charge passed:**
$$Q = It = 2 \\times 965 = 1930\\ \\text{C}$$

**Moles of electrons:**
$$n_{e^-} = \\frac{1930}{96500} = 0.02\\ \\text{mol}$$

**Copper deposition is divalent:**
$$\\text{Cu}^{2+} + 2e^- \\to \\text{Cu} \\implies n_{\\text{Cu}} = \\frac{0.02}{2} = 0.01\\ \\text{mol}$$

**Mass:**
$$m = 0.01 \\times 63.5 = \\mathbf{0.635}\\ \\text{g}$$`,
    formulaConcept: 'Faraday: $m = \\dfrac{ItM}{nF}$ — remember the 2-electron stoichiometry of Cu²⁺.',
    difficulty: 'MODERATE', chapterSlug: 'redox-electrochemistry', topicSlug: 'electrolysis',
    sourceType: 'ORIGINAL', sourceNote: 'Faraday copper deposition.',
  },
  {
    subject: 'CHEMISTRY', section: 'B',
    text: `A first-order reaction has a half-life of $20\\ \\text{min}$. The time required for $75\\%$ completion is ______ $\\text{min}$.`,
    correctAnswer: '40',
    solutionText: `**75% completion** means only 25% remains, i.e. the amount has halved twice:
$$100\\% \\xrightarrow{20\\ \\text{min}} 50\\% \\xrightarrow{20\\ \\text{min}} 25\\%$$

$$t_{75\\%} = 2\\,t_{1/2} = 2 \\times 20 = \\mathbf{40}\\ \\text{min}$$

**Calculus check:** fraction remaining $= 4^{-t/t_{1/2}}$... directly, $0.25 = e^{-kt}$ with $k = \\ln 2/20$:
$$t = \\frac{\\ln 4}{k} = \\frac{2\\ln 2}{\\ln 2/20} = 40\\ \\text{min} \\checkmark$$

*(Every extra 20 min halves whatever remains — the memoryless halving of first-order kinetics.)*`,
    formulaConcept: '75% done $= 2$ half-lives; 87.5% $= 3$; each half-life is equal.',
    difficulty: 'MODERATE', chapterSlug: 'chemical-kinetics', topicSlug: 'integrated-rate-equations',
    sourceType: 'ORIGINAL', sourceNote: 'Two-half-lives completion time.',
  },
  {
    subject: 'CHEMISTRY', section: 'B',
    text: `The energy of the photon emitted when a hydrogen atom undergoes the $n = 3 \\to n = 2$ transition is ______ $\\text{eV}$. (Round off to 2 decimals.)`,
    correctAnswer: '1.89',
    solutionText: `**Bohr energy levels:**
$$E_n = -\\frac{13.6}{n^2}\\ \\text{eV}$$

**Transition energy:**
$$\\Delta E = E_3 - E_2 = -13.6\\left(\\frac{1}{9} - \\frac{1}{4}\\right) = -13.6\\left(\\frac{4 - 9}{36}\\right) = \\frac{13.6 \\times 5}{36}$$

$$\\Delta E = \\frac{68}{36} = 1.888\\ldots \\approx \\mathbf{1.89}\\ \\text{eV}$$

*(This is the Hα line of the Balmer series — wavelength $\\lambda = 1240/1.89 \\approx 656\\ \\text{nm}$, the red line that colours hydrogen's spectrum.)*`,
    formulaConcept: '$\\Delta E = 13.6\\left(1/n_{\\text{low}}^2 - 1/n_{\\text{high}}^2\\right)$ eV — here $5/36 \\times 13.6$.',
    difficulty: 'MODERATE', chapterSlug: 'atomic-structure', topicSlug: 'bohrs-model-hydrogen',
    sourceType: 'ORIGINAL', sourceNote: 'Hα transition energy.',
  },
  {
    subject: 'CHEMISTRY', section: 'B',
    text: `Given $E^\\circ(\\text{Fe}^{2+}/\\text{Fe}) = -0.44\\ \\text{V}$ and $E^\\circ(\\text{Ag}^+/\\text{Ag}) = +0.80\\ \\text{V}$, the standard EMF of the cell $\\text{Fe}\\,|\\,\\text{Fe}^{2+}\\,||\\,\\text{Ag}^+\\,|\\,\\text{Ag}$ is ______ $\\text{V}$.`,
    correctAnswer: '1.24',
    solutionText: `**Identify the electrodes:** Fe is oxidised (anode — more negative reduction potential); Ag+ is reduced (cathode).

**Standard cell EMF:**
$$E^\\circ_{\\text{cell}} = E^\\circ_{\\text{cathode}} - E^\\circ_{\\text{anode}}$$

**Substituting:**
$$E^\\circ_{\\text{cell}} = 0.80 - (-0.44) = 0.80 + 0.44 = \\boxed{1.24}\\ \\text{V}$$

*(Positive EMF means the cell reaction $\\text{Fe} + 2\\text{Ag}^+ \\to \\text{Fe}^{2+} + 2\\text{Ag}$ is spontaneous — iron displaces silver.)*`,
    formulaConcept: 'E0cell = E0(cathode) minus E0(anode); subtracting a negative anode potential ADDS.',
    difficulty: 'HARD', chapterSlug: 'redox-electrochemistry', topicSlug: 'galvanic-cells',
    sourceType: 'ORIGINAL', sourceNote: 'Standard EMF from tabulated electrode potentials.',
  },
]
