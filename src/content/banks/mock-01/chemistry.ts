import type { SeedQuestion } from '@/content/types'

// ============================================================================
// MOCK 01 — CHEMISTRY (Q26–Q50: 20 MCQ Section A + 5 numerical Section B)
// Difficulty target: Hard JEE Main. All questions verified; solutions complete.
// ============================================================================

export const CHEMISTRY_MOCK01: SeedQuestion[] = [
  // ---------------- SECTION A (MCQ) Q26–Q45 ----------------
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `25 mL of 0.5 M HCl is mixed with 75 mL of 0.1 M NaOH solution. The pH of the resulting solution is:`,
    options: ['1.00', '1.30', '2.00', '1.48'],
    correctAnswer: 'B',
    solutionText: `**Moles of acid and base:**
$$n_{\\text{HCl}} = 0.025 \\times 0.5 = 0.0125\\ \\text{mol}$$
$$n_{\\text{NaOH}} = 0.075 \\times 0.1 = 0.0075\\ \\text{mol}$$

HCl is in excess (strong acid + strong base react 1:1):
$$n_{\\text{H}^+}\\ \\text{left} = 0.0125 - 0.0075 = 0.005\\ \\text{mol}$$

**Total volume** $= 25 + 75 = 100\\ \\text{mL} = 0.1\\ \\text{L}$

$$[\\text{H}^+] = \\frac{0.005}{0.1} = 0.05\\ M$$

**pH:**
$$\\text{pH} = -\\log(0.05) = 2 - \\log 5 = 2 - 0.699 = 1.30$$

(1.48 corresponds to $[H^+] \\approx 0.033$ M — forgetting that the *combined* volume dilutes the excess acid; 1.00 would need $[H^+] = 0.1$ M.)`,
    formulaConcept: 'Strong acid–base mixing: find the limiting reagent, then pH = −log(excess H⁺ / total volume).',
    difficulty: 'HARD', chapterSlug: 'some-basic-concepts', topicSlug: 'mole-concept',
    sourceType: 'ORIGINAL', sourceNote: 'Mixing + dilution bookkeeping with pH.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `Which of the following sets of quantum numbers $(n,\\ l,\\ m_l,\\ m_s)$ is **NOT** possible for an electron in an atom?`,
    options: ['$(3, 2, -2, -\\tfrac{1}{2})$', '$(2, 1, 0, -\\tfrac{1}{2})$', '$(4, 3, -3, +\\tfrac{1}{2})$', '$(2, 2, 1, +\\tfrac{1}{2})$'],
    correctAnswer: 'D',
    solutionText: `Apply the quantum-number rules:
1. $l = 0, 1, 2, \\dots, (n-1)$ — the azimuthal quantum number cannot equal or exceed $n$.
2. $m_l = -l, \\dots, 0, \\dots, +l$.
3. $m_s = \\pm\\tfrac{1}{2}$.

**Check each option:**
- (A) $(3, 2, -2, -\\tfrac{1}{2})$: $l = 2 \\le n-1 = 2$, $|m_l| \\le 2$ ✓ — a $3d$ electron.
- (B) $(2, 1, 0, -\\tfrac{1}{2})$: a $2p$ electron ✓
- (C) $(4, 3, -3, +\\tfrac{1}{2})$: a $4f$ electron ✓
- **(D) $(2, 2, 1, +\\tfrac{1}{2})$**: $l = 2$ with $n = 2$ — but $l_{\\max} = n-1 = 1$. **Impossible** ✗

Hence option (D) violates the rule $l \\le n-1$ and is the impossible set.`,
    formulaConcept: 'Quantum number rules: l ∈ {0, …, n−1}; m_l ∈ {−l, …, +l}; m_s = ±½.',
    difficulty: 'MODERATE', chapterSlug: 'atomic-structure', topicSlug: 'quantum-numbers-orbitals',
    sourceType: 'ORIGINAL', sourceNote: 'Quantum-number validity check.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `The shape of the $\\text{SF}_4$ molecule (shown) and the hybridisation of sulphur in it are:`,
    options: ['square planar, $sp^3d^2$', 'tetrahedral, $sp^3$', 'see-saw, $sp^3d$', 'trigonal bipyramidal, $sp^3d$'],
    correctAnswer: 'C',
    solutionText: `**Count the electron domains on S:**
- Bond pairs: 4 (four S–F bonds)
- Lone pairs: 1 (S has 6 valence electrons; 4 are used in bonding, 2 remain as one lone pair)

Total domains $= 5$ → electron-pair geometry = trigonal bipyramidal → hybridisation $sp^3d$.

**Position of the lone pair:** in a trigonal bipyramid, lone pairs occupy **equatorial** positions (fewer 90° repulsions there). Removing one equatorial vertex from a trigonal bipyramid leaves a **see-saw** shape.

$$\\text{SF}_4:\\ \\text{see-saw shape},\\ \\text{S is } sp^3d$$

(Square planar needs 6 domains with 2 lone pairs *trans* ($sp^3d^2$, e.g. XeF₄); trigonal bipyramidal needs 5 bond pairs and no lone pair (PCl₅); tetrahedral needs 4 domains (CF₄).)`,
    formulaConcept: 'VSEPR: domains = bond pairs + lone pairs; 5 domains → TBP (sp³d); one equatorial lone pair → see-saw.',
    difficulty: 'MODERATE', chapterSlug: 'chemical-bonding', topicSlug: 'vsepr-shapes',
    sourceType: 'ORIGINAL', sourceNote: 'VSEPR with equatorial lone pair.',
    diagram: {
      kind: 'molecule',
      atoms: [
        { sym: 'S', x: 0, y: 0, label: 'S (sp³d)' },
        { sym: 'F', x: 0, y: -70, label: 'F_ax' },
        { sym: 'F', x: 0, y: 70, label: 'F_ax' },
        { sym: 'F', x: -78, y: 22, label: 'F_eq' },
        { sym: 'F', x: 78, y: 22, label: 'F_eq' },
      ],
      bonds: [
        { a: 0, b: 1 }, { a: 0, b: 2 }, { a: 0, b: 3 }, { a: 0, b: 4 },
      ],
      lonePairs: [{ atom: 0, count: 1, angles: [-90] }],
      caption: 'SF₄ — see-saw · lone pair equatorial · F_ax–S–F_ax ≈ 173°, F_eq–S–F_eq ≈ 102°',
    },
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `Among the following diatomic species, which one has the **highest** bond order?`,
    options: ['$\\text{O}_2^+$', '$\\text{O}_2$', '$\\text{O}_2^-$', '$\\text{O}_2^{2-}$'],
    correctAnswer: 'A',
    solutionText: `By molecular orbital theory, the bond order is
$$\\text{B.O.} = \\frac{N_b - N_a}{2}$$

For the oxygen family (O₂: 16 electrons), the highest occupied orbitals are the **antibonding** $\\pi^*2p$ levels. Relative to neutral $\\text{O}_2$ (B.O. = 2):
- **Removing one electron** (to form $\\text{O}_2^+$) takes it out of $\\pi^*$ → B.O. $= 2 + \\tfrac{1}{2} = 2.5$
- $\\text{O}_2$: B.O. $= 2$
- $\\text{O}_2^-$ (one extra electron in $\\pi^*$): B.O. $= 2 - \\tfrac{1}{2} = 1.5$
- $\\text{O}_2^{2-}$ (two extra): B.O. $= 2 - 1 = 1$

**Highest bond order: $\\text{O}_2^+$ (2.5)** — hence also the shortest, strongest bond of the set. (This also explains why $\\text{O}_2^+$ is paramagnetic with one unpaired electron, and $\\text{O}_2^{2-}$ is diamagnetic.)`,
    formulaConcept: 'MOT bond order = (N_b − N_a)/2; for the O₂ family, removing electrons from π* raises the bond order.',
    difficulty: 'HARD', chapterSlug: 'chemical-bonding', topicSlug: 'molecular-orbital-theory',
    sourceType: 'ORIGINAL', sourceNote: 'Bond-order ordering in the O₂ family.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `The enthalpy of neutralisation of a strong acid with a strong base is $-57.3\\ \\text{kJ mol}^{-1}$. The enthalpy of ionisation of a weak monobasic acid is $+1.9\\ \\text{kJ mol}^{-1}$. The enthalpy of neutralisation of this weak acid with the strong base is:`,
    options: ['$-57.3\\ \\text{kJ mol}^{-1}$', '$-55.4\\ \\text{kJ mol}^{-1}$', '$-59.2\\ \\text{kJ mol}^{-1}$', '$-52.1\\ \\text{kJ mol}^{-1}$'],
    correctAnswer: 'B',
    solutionText: `Neutralisation of a strong acid by a strong base is simply
$$\\text{H}^+ + \\text{OH}^- \\to \\text{H}_2\\text{O}, \\qquad \\Delta H = -57.3\\ \\text{kJ/mol}$$

A weak acid must **first ionise**, and ionisation **absorbs** energy ($\\Delta H_{\\text{ion}} = +1.9$ kJ/mol). The overall neutralisation is the sum of the two steps (Hess's law):

$$\\text{HA} \\to \\text{H}^+ + \\text{A}^- \\qquad \\Delta H_1 = +1.9$$
$$\\text{H}^+ + \\text{OH}^- \\to \\text{H}_2\\text{O} \\qquad \\Delta H_2 = -57.3$$

**Adding:**
$$\\text{HA} + \\text{OH}^- \\to \\text{H}_2\\text{O} + \\text{A}^- \\qquad \\Delta H = +1.9 - 57.3 = -55.4\\ \\text{kJ/mol}$$

The weak-acid neutralisation is **less exothermic** by exactly the ionisation enthalpy. (−59.2 wrongly *adds* the ionisation enthalpy as if it were released; −57.3 ignores ionisation.)`,
    formulaConcept: "Hess's law: ΔH_neut(weak acid) = ΔH_neut(strong) + ΔH_ionisation.",
    difficulty: 'HARD', chapterSlug: 'thermodynamics-chemistry', topicSlug: 'enthalpy',
    sourceType: 'ORIGINAL', sourceNote: 'Weak-acid neutralisation via Hess cycle.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `For the equilibrium $A \\rightleftharpoons B$ at temperature $T$, the equilibrium constant is $K_c = 4$. The equilibrium constant for the reaction $2B \\rightleftharpoons 2A$ at the same temperature is:`,
    options: ['$1/4$', '$16$', '$4$', '$1/16$'],
    correctAnswer: 'D',
    solutionText: `Manipulating equilibria changes $K_c$ in two standard ways:
- **Reversing** a reaction inverts the constant: $K' = 1/K_c$
- **Doubling** all coefficients squares the constant: $K'' = (K')^2$

Here we want $2B \\rightleftharpoons 2A$:
1. Reverse $A \\rightleftharpoons B$ → $B \\rightleftharpoons A$ with $K_1 = \\dfrac{1}{4}$
2. Double it → $2B \\rightleftharpoons 2A$ with
$$K_2 = \\left(\\frac{1}{4}\\right)^2 = \\frac{1}{16}$$

*Direct verification:* $K_c = [B]/[A] = 4$. For $2B \\rightleftharpoons 2A$,
$$K = \\frac{[A]^2}{[B]^2} = \\left(\\frac{[A]}{[B]}\\right)^2 = \\left(\\frac{1}{4}\\right)^2 = \\frac{1}{16}\\ \\checkmark$$

(1/4 forgets the squaring; 16 squares without reversing.)`,
    formulaConcept: 'Equilibrium constant manipulations: reverse → 1/K; multiply coefficients by n → Kⁿ.',
    difficulty: 'MODERATE', chapterSlug: 'equilibrium', topicSlug: 'chemical-equilibrium',
    sourceType: 'ORIGINAL', sourceNote: 'K manipulation (reverse + double).',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `For the cell reaction $\\text{Zn}(s) + \\text{Cu}^{2+}(aq) \\to \\text{Zn}^{2+}(aq) + \\text{Cu}(s)$, $E^\\circ_{\\text{cell}} = 1.10\\ \\text{V}$. The EMF of the cell with $[\\text{Zn}^{2+}] = 0.1\\ M$ and $[\\text{Cu}^{2+}] = 0.01\\ M$ at 298 K is:`,
    options: ['1.10 V', '1.13 V', '1.07 V', '1.04 V'],
    correctAnswer: 'C',
    solutionText: `Apply the **Nernst equation** at 298 K for the 2-electron process ($n = 2$):
$$E = E^\\circ - \\frac{0.059}{n}\\log\\frac{[\\text{Zn}^{2+}]}{[\\text{Cu}^{2+}]}$$

**Substitute:**
$$E = 1.10 - \\frac{0.059}{2}\\log\\frac{0.1}{0.01} = 1.10 - 0.0295\\log(10)$$
$$E = 1.10 - 0.0295 \\times 1 = 1.0705 \\approx 1.07\\ \\text{V}$$

The cell EMF **falls** below the standard value because the reaction quotient $Q = [\\text{Zn}^{2+}]/[\\text{Cu}^{2+}] = 10 > 1$ (concentrated product ion, dilute reactant ion).

(1.13 V results from dropping the minus sign; 1.04 V from using $n = 1$.)`,
    formulaConcept: 'Nernst equation: E = E° − (0.059/n)·log Q at 298 K.',
    difficulty: 'HARD', chapterSlug: 'redox-electrochemistry', topicSlug: 'nernst-equation',
    sourceType: 'ORIGINAL', sourceNote: 'Daniell-cell Nernst with non-standard ion concentrations.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `A first-order reaction is $75\\%$ complete in 40 minutes. Its half-life is:`,
    options: ['20 min', '40 min', '13.3 min', '10 min'],
    correctAnswer: 'A',
    solutionText: `For a **first-order** reaction the half-life is concentration-independent, so fixed fractions are reached after whole numbers of half-lives.

**$75\\%$ complete means $25\\%$ remains**, and
$$\\frac{1}{4} = \\left(\\frac{1}{2}\\right)^2$$

So $75\\%$ completion takes exactly **2 half-lives**:
$$2\\,T_{1/2} = 40\\ \\text{min} \\implies T_{1/2} = 20\\ \\text{min}$$

*Check with the integrated rate law:* $k = \\dfrac{2.303}{40}\\log\\dfrac{100}{25} = \\dfrac{2.303 \\times 0.602}{40} = 0.03466\\ \\text{min}^{-1}$, and
$$T_{1/2} = \\frac{0.693}{0.03466} = 20.0\\ \\text{min}\\ \\checkmark$$

(13.3 min comes from wrongly assuming 75% complete means 3 half-lives — three half-lives give 87.5% completion.)`,
    formulaConcept: 'First-order kinetics: fraction remaining after n half-lives = (½)ⁿ; 75% done ≡ 2 half-lives.',
    difficulty: 'MODERATE', chapterSlug: 'chemical-kinetics', topicSlug: 'rate-laws-order',
    sourceType: 'ORIGINAL', sourceNote: 'Half-life from percent completion.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `Among the hydrides of group 15 elements — $\\text{NH}_3$, $\\text{PH}_3$, $\\text{AsH}_3$ and $\\text{BiH}_3$ — the **strongest reducing agent** is:`,
    options: ['$\\text{NH}_3$', '$\\text{BiH}_3$', '$\\text{PH}_3$', '$\\text{AsH}_3$'],
    correctAnswer: 'B',
    solutionText: `Down group 15, the E–H bond becomes **longer and weaker** (E grows larger, orbital overlap poorer). A weaker E–H bond releases hydrogen more readily, so the hydride is more easily oxidised — i.e. a **stronger reducing agent**.

**Trend of reducing character:**
$$\\text{NH}_3 < \\text{PH}_3 < \\text{AsH}_3 < \\text{SbH}_3 < \\text{BiH}_3$$

$\\text{BiH}_3$ has the weakest Bi–H bonds and is the **strongest reducing agent** of the set.

**Contrast with basicity:** the same order runs *opposite* to basicity — $\\text{NH}_3$ is the strongest base (lone pair most available on the small, electronegative N). $\\text{BiH}_3$ is both the weakest base and the strongest reductant here — do not conflate the two trends.`,
    formulaConcept: 'Down the group: E–H bond strength ↓ ⇒ thermal stability ↓, reducing character ↑ (while basicity ↓).',
    difficulty: 'MODERATE', chapterSlug: 'p-block-elements', topicSlug: 'group-15-16',
    sourceType: 'ORIGINAL', sourceNote: 'Group-15 hydride trends (reducing power vs basicity).',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `The complex $K_3[\\text{Fe(CN)}_6]$ contains the octahedral ion $[\\text{Fe(CN)}_6]^{3-}$ (shown). The number of unpaired electrons and the hybridisation of iron in this complex are:`,
    options: ['5, $sp^3d^2$', '0, $d^2sp^3$', '1, $d^2sp^3$', '4, $sp^3d^2$'],
    correctAnswer: 'C',
    solutionText: `**Oxidation state of Fe:** $3(+1) + x + 6(-1) = 0 \\implies x = +3$ → $\\text{Fe}^{3+}$: $3d^5$ configuration.

**Effect of the strong-field ligand $\\text{CN}^-$:** it pairs up the $3d$ electrons in the lower $t_{2g}$ set (octahedral crystal field):
$$t_{2g}^5\\, e_g^0 \\quad\\text{i.e.}\\quad \\uparrow\\downarrow\\ \\uparrow\\downarrow\\ \\uparrow$$

Only **one unpaired electron** remains (low spin).

**Hybridisation:** with two $3d$ orbitals now empty, the complex uses **inner-orbital** $d^2sp^3$ hybridisation — octahedral, low-spin.

So: **1 unpaired electron, $d^2sp^3$**. (5 unpaired with $sp^3d^2$ describes weak-field $[\\text{FeF}_6]^{3-}$ (high spin, outer orbital); 0 unpaired fits low-spin $d^6$ like $[\\text{Fe(CN)}_6]^{4-}$; 4 unpaired fits $[\\text{Fe(H}_2\\text{O)}_6]^{3+}$ high spin $d^5$ with one promoted — not this case.)`,
    formulaConcept: 'CFT: strong-field CN⁻ → low-spin t₂g⁵e_g⁰ for Fe³⁺; 1 unpaired electron; inner-orbital d²sp³.',
    difficulty: 'HARD', chapterSlug: 'coordination-compounds', topicSlug: 'crystal-field-theory',
    sourceType: 'ORIGINAL', sourceNote: 'Low-spin ferricyanide CFT analysis.',
    diagram: {
      kind: 'molecule',
      atoms: [
        { sym: 'Fe', x: 0, y: 0, label: 'Fe³⁺', charge: '3+' },
        { sym: 'CN', x: 0, y: -80, label: 'CN⁻ (trans pair)' }, { sym: 'CN', x: 0, y: 80, label: 'CN⁻' },
        { sym: 'CN', x: -90, y: 0, label: 'CN⁻ (trans pair)' }, { sym: 'CN', x: 90, y: 0, label: 'CN⁻' },
        { sym: 'CN', x: -58, y: 52, label: 'CN⁻' }, { sym: 'CN', x: 58, y: -52, label: 'CN⁻' },
      ],
      bonds: [
        { a: 0, b: 1 }, { a: 0, b: 2 }, { a: 0, b: 3 }, { a: 0, b: 4 },
        { a: 0, b: 5, type: 'wedge' }, { a: 0, b: 6, type: 'hash' },
      ],
      caption: '[Fe(CN)₆]³⁻ — octahedral · 6 strong-field CN⁻ · low-spin t²g⁵e⁰ (1 unpaired e⁻) · d²sp³',
    },
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `The reaction of tert-butyl bromide, $(\\text{CH}_3)_3\\text{C–Br}$ (shown), with aqueous NaOH proceeds predominantly by:`,
    options: ['SN2, with rate $\\propto [(\\text{CH}_3)_3\\text{CBr}][\\text{OH}^-]$', 'SN2, with rate $\\propto [(\\text{CH}_3)_3\\text{CBr}]$ only', 'E2 only, no substitution product', 'SN1, with rate independent of $[\\text{OH}^-]$'],
    correctAnswer: 'D',
    solutionText: `**Steric environment:** tert-butyl bromide is a **3° alkyl halide** — the carbon bearing Br carries three methyl groups. Backside attack (SN2) is **blocked** by steric hindrance.

**SN1 pathway instead:** the C–Br bond ionises in the slow, unimolecular step:
$$(\\text{CH}_3)_3\\text{C–Br} \\to (\\text{CH}_3)_3\\text{C}^+ + \\text{Br}^- \\quad (\\text{slow, rate-determining})$$
$$(\\text{CH}_3)_3\\text{C}^+ + \\text{OH}^- \\to (\\text{CH}_3)_3\\text{C–OH} \\quad (\\text{fast})$$

The carbocation intermediate is well stabilised (3°; hyperconjugation from nine β C–H bonds; +I effect of methyl groups).

**Rate law:**
$$\\text{rate} = k[(\\text{CH}_3)_3\\text{CBr}]$$

— **independent of $[\\text{OH}^-]$**, because the nucleophile participates only *after* the rate-determining ionisation. Hence option (D). (SN2 options are excluded by sterics; some elimination competes, but in aqueous medium substitution dominates — so "E2 only" is wrong.)`,
    formulaConcept: '3° halides + weak/basic nucleophiles → SN1 (carbocation); rate = k[RX], nucleophile-independent.',
    difficulty: 'MODERATE', chapterSlug: 'haloalkanes-haloarenes', topicSlug: 'nucleophilic-substitution',
    sourceType: 'ORIGINAL', sourceNote: 'tert-Butyl halide mechanism selection.',
    diagram: {
      kind: 'molecule',
      atoms: [
        { sym: 'CH₃', x: -95, y: 30, label: '3 × CH₃ (9 β-H)' }, { sym: 'CH₃', x: -50, y: -60 }, { sym: 'CH₃', x: 40, y: -60 },
        { sym: 'C', x: 0, y: 0, label: '3° C⁺-forming' }, { sym: 'Br', x: 85, y: 35, label: 'Br (leaves as Br⁻)' },
      ],
      bonds: [
        { a: 0, b: 3, type: 'wedge' }, { a: 1, b: 3 }, { a: 2, b: 3, type: 'hash' }, { a: 3, b: 4 },
      ],
      caption: 'tert-Butyl bromide, (CH₃)₃C–Br — crowded 3° carbon → SN1 (rate = k[RX])',
    },
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `The four compounds shown are: (A) phenol, (B) $p$-nitrophenol, (C) $p$-cresol ($p$-methylphenol) and (D) ethanol. The **most acidic** among them is:`,
    options: ['Phenol', '$p$-Nitrophenol', '$p$-Cresol', 'Ethanol'],
    correctAnswer: 'B',
    solutionText: `Acidity of phenols is decided by the **stability of the phenoxide ion** formed on losing H⁺.

- **$p$-Nitrophenol:** $-\\text{NO}_2$ is a strong **electron-withdrawing group** ($-R$ and $-I$). It delocalises the negative charge of the phenoxide ion through the ring onto the nitro group, strongly stabilising the conjugate base → **most acidic** ($pK_a \\approx 7.1$).
- **Phenol:** no substituent; $pK_a \\approx 10.0$.
- **$p$-Cresol:** $-\\text{CH}_3$ is electron-**donating** (+I, hyperconjugation) — it *intensifies* the negative charge on phenoxide, destabilising it → less acidic than phenol ($pK_a \\approx 10.2$).
- **Ethanol:** the ethoxide ion has **no resonance stabilisation at all** → weakest acid of the set ($pK_a \\approx 16$).

**Order:**
$$p\\text{-nitrophenol} > \\text{phenol} > p\\text{-cresol} > \\text{ethanol}$$

Hence $p$-nitrophenol is the most acidic.`,
    formulaConcept: 'Phenol acidity: EDGs (−CH₃) destabilise phenoxide (less acidic); EWGs (−NO₂) stabilise it (more acidic).',
    difficulty: 'MODERATE', chapterSlug: 'alcohols-phenols-ethers', topicSlug: 'acidity',
    sourceType: 'ORIGINAL', sourceNote: 'Substituent effect on phenol acidity.',
    diagram: {
      kind: 'organic',
      parts: [
        { type: 'ring', x: 100, y: 90, label: '(A) phenol', substituents: [{ position: 0, label: 'OH' }] },
        { type: 'ring', x: 260, y: 90, label: '(B) p-nitrophenol', substituents: [{ position: 0, label: 'OH' }, { position: 3, label: 'NO₂' }] },
        { type: 'ring', x: 420, y: 90, label: '(C) p-cresol', substituents: [{ position: 0, label: 'OH' }, { position: 3, label: 'CH₃' }] },
        { type: 'text', x: 545, y: 90, text: '(D) CH₃CH₂OH', bold: true },
        { type: 'text', x: 100, y: 130, text: 'pKₐ ≈ 10.0' },
        { type: 'text', x: 260, y: 130, text: 'pKₐ ≈ 7.1 ← most acidic' },
        { type: 'text', x: 420, y: 130, text: 'pKₐ ≈ 10.2' },
        { type: 'text', x: 545, y: 130, text: 'pKₐ ≈ 16' },
      ],
    },
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `Which of the following compounds does **NOT** give a positive iodoform test?`,
    options: ['Acetone', 'Ethanol', 'Benzaldehyde', 'Acetaldehyde'],
    correctAnswer: 'C',
    solutionText: `The iodoform test requires a methyl ketone unit $\\text{CH}_3\\text{CO–}$, or a compound oxidisable to it ($\\text{CH}_3\\text{CH(OH)–}$):

- **Acetone** $\\text{CH}_3\\text{COCH}_3$: contains $\\text{CH}_3\\text{CO–}$ → **positive** (yellow CHI₃).
- **Ethanol** $\\text{CH}_3\\text{CH}_2\\text{OH}$: oxidised by I₂/alkali to acetaldehyde, which then gives the test → **positive**.
- **Acetaldehyde** $\\text{CH}_3\\text{CHO}$: contains the $\\text{CH}_3\\text{CO–}$ unit → **positive**.
- **Benzaldehyde** $\\text{C}_6\\text{H}_5\\text{CHO}$: has **no methyl group** on the carbonyl carbon and is not oxidised to a methyl ketone under test conditions → **negative**.

So benzaldehyde does not answer the iodoform test. (Overall reaction: $\\text{CH}_3\\text{COR} + 3\\text{I}_2 + 4\\text{OH}^- \\to \\text{CHI}_3\\downarrow + \\text{RCOO}^- + 3\\text{I}^- + 3\\text{H}_2\\text{O}$.)`,
    formulaConcept: 'Iodoform test: needs CH₃CO– or CH₃CH(OH)–; aryl aldehydes without the α-methyl fail.',
    difficulty: 'MODERATE', chapterSlug: 'aldehydes-ketones-acids', topicSlug: 'name-reactions',
    sourceType: 'ORIGINAL', sourceNote: 'Iodoform test negative case.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `The correct order of basic strength in **aqueous solution** for the ethylamines is:`,
    options: ['$(\\text{C}_2\\text{H}_5)_2\\text{NH} > (\\text{C}_2\\text{H}_5)_3\\text{N} > \\text{C}_2\\text{H}_5\\text{NH}_2 > \\text{NH}_3$', '$(\\text{C}_2\\text{H}_5)_3\\text{N} > (\\text{C}_2\\text{H}_5)_2\\text{NH} > \\text{C}_2\\text{H}_5\\text{NH}_2 > \\text{NH}_3$', '$\\text{C}_2\\text{H}_5\\text{NH}_2 > (\\text{C}_2\\text{H}_5)_2\\text{NH} > (\\text{C}_2\\text{H}_5)_3\\text{N} > \\text{NH}_3$', '$\\text{NH}_3 > \\text{C}_2\\text{H}_5\\text{NH}_2 > (\\text{C}_2\\text{H}_5)_2\\text{NH} > (\\text{C}_2\\text{H}_5)_3\\text{N}$'],
    correctAnswer: 'A',
    solutionText: `Basicity of amines in water is a balance of **three effects**:

1. **+I (electron release) of ethyl groups** — increases electron density on N → more basic. This alone would order 3° > 2° > 1°.
2. **Solvation of the cation** — the ammonium ion formed on protonation is stabilised by H-bonding with water. Fewer alkyl groups → more N–H bonds → better solvation. This alone would order 1° > 2° > 3°.
3. **Steric hindrance** — bulky groups hinder both protonation and solvation, penalising 3° most.

**For ethylamines in water**, the solvation + steric effects overtake the inductive effect between 2° and 3°, giving the anomalous order:
$$(\\text{C}_2\\text{H}_5)_2\\text{NH} > (\\text{C}_2\\text{H}_5)_3\\text{N} > \\text{C}_2\\text{H}_5\\text{NH}_2 > \\text{NH}_3$$

i.e. **2° > 3° > 1° > NH₃** — option (A).

(Note: in the **gas phase**, or for methylamines, the order differs — the classic JEE trap. $\\text{NH}_3$ is weakest in water here because it has no alkyl groups donating electron density.)`,
    formulaConcept: 'Aqueous amine basicity = inductive effect (+) vs solvation of cation & steric crowding (−); ethylamines: 2° > 3° > 1° > NH₃.',
    difficulty: 'HARD', chapterSlug: 'amines', topicSlug: 'basicity',
    sourceType: 'ORIGINAL', sourceNote: 'Anomalous aqueous basicity order of ethylamines.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `In proteins, the $\\alpha$-helix structure is stabilised by:`,
    options: ['peptide bonds between adjacent amino acid residues', 'hydrogen bonds between the C=O of one amino acid residue and the N–H of the fourth residue along the chain', 'disulphide bridges between cysteine residues', 'hydrophobic interactions between non-polar side chains'],
    correctAnswer: 'B',
    solutionText: `The $\\alpha$-helix is a **secondary structure** — a right-handed coil with about 3.6 amino acid residues per turn (rise ≈ 1.5 Å per residue).

**Stabilisation:** each backbone carbonyl oxygen (C=O) of residue $n$ forms a **hydrogen bond** with the amide N–H of residue $n + 4$ — i.e. the N–H of the **fourth amino acid** along the chain. All the interior N–H and C=O groups participate, with the bonds running roughly parallel to the helix axis.

**Why the others are wrong:**
- Peptide bonds are the *primary* covalent linkage joining residues — they define the backbone, not the helix as such.
- Disulphide (–S–S–) bridges link distant cysteines in the **tertiary** structure.
- Hydrophobic interactions stabilise tertiary/quaternary folding, not the $\\alpha$-helix itself.`,
    formulaConcept: 'α-helix: intrachain H-bond, C=O (n) ⋯ H–N (n+4); ~3.6 residues per turn.',
    difficulty: 'MODERATE', chapterSlug: 'biomolecules', topicSlug: 'proteins',
    sourceType: 'ORIGINAL', sourceNote: 'Secondary-structure stabilisation concept.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `Aniline is immiscible with water and volatile with steam. The technique shown in the figure — used to purify aniline from an aniline–water mixture — is:`,
    options: ['simple distillation', 'fractional distillation', 'vacuum distillation', 'steam distillation'],
    correctAnswer: 'D',
    solutionText: `**Steam distillation** is used to purify liquids that are:
- immiscible with water,
- volatile with steam (appreciable vapour pressure near 100 °C),
- and can thereby be distilled *below* their normal boiling point.

Steam is passed into the flask containing the impure organic liquid; the compound and water co-distil when the **sum of their vapour pressures** equals atmospheric pressure — i.e. at a temperature **below 100 °C**. The distillate separates into two layers; the organic layer (aniline) is collected and dried.

- Simple/fractional distillation applies to **miscible** liquids (fractional for close boiling points).
- Vacuum (reduced-pressure) distillation is for compounds that decompose near their normal boiling points — no steam involved.

Aniline (b.p. 184 °C) co-distils with steam at ~98–100 °C, so the figure shows **steam distillation**.`,
    formulaConcept: 'Steam distillation: P_total = P_water + P_organic ≥ P_atm → distillation below 100 °C for immiscible, steam-volatile liquids.',
    difficulty: 'MODERATE', chapterSlug: 'purification-characterisation', topicSlug: 'purification-methods',
    sourceType: 'ORIGINAL', sourceNote: 'Technique identification from apparatus.',
    diagram: {
      kind: 'apparatus',
      parts: [
        { type: 'flask', x: 120, y: 150, label: 'aniline + water (immiscible)', fill: 0.4 },
        { type: 'burner', x: 120, y: 252, label: 'heat' },
        { type: 'tube', x: 225, y: 95, w: 100, label: 'steam in →' },
        { type: 'condenser', x: 345, y: 95, label: 'condenser (cold)' },
        { type: 'beaker', x: 440, y: 165, fill: 0.3, label: 'distillate: 2 layers' },
        { type: 'arrow', x1: 452, y1: 55, x2: 452, y2: 125, label: 'water out' },
        { type: 'arrow', x1: 238, y1: 128, x2: 238, y2: 58, label: 'water in' },
        { type: 'label', x: 265, y: 135, text: 'co-distils at ≈ 98 °C (P_H₂O + P_org ≥ 1 atm)' },
        { type: 'label', x: 440, y: 210, text: 'aniline layer + water layer' },
      ],
      caption: 'Steam distillation of aniline — P_total = P_water + P_aniline',
    },
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `Four aqueous solutions are prepared as in the table. Which one has the **highest boiling point**? (Assume complete dissociation of the electrolytes.)`,
    options: ['0.1 M K₂SO₄', '0.1 M NaCl', '0.2 M urea', '0.05 M MgCl₂'],
    correctAnswer: 'A',
    solutionText: `The elevation of boiling point is a colligative property:
$$\\Delta T_b = i\\,K_b\\,m$$

so the solution with the largest product $i \\times m$ (van 't Hoff factor × molality) boils highest.

**Evaluate each (complete dissociation):**
- $\\text{K}_2\\text{SO}_4 \\to 2\\text{K}^+ + \\text{SO}_4^{2-}$: $i = 3$ → $i\\,m = 3 \\times 0.1 = 0.30$
- $\\text{NaCl} \\to \\text{Na}^+ + \\text{Cl}^-$: $i = 2$ → $i\\,m = 2 \\times 0.1 = 0.20$
- Urea (non-electrolyte): $i = 1$ → $i\\,m = 0.20$
- $\\text{MgCl}_2 \\to \\text{Mg}^{2+} + 2\\text{Cl}^-$: $i = 3$ → $i\\,m = 3 \\times 0.05 = 0.15$

**Ranking:** K₂SO₄ (0.30) > NaCl = urea (0.20) > MgCl₂ (0.15)

Hence **0.1 M K₂SO₄** has the highest boiling point. (Urea at 0.2 M merely ties with 0.1 M NaCl — a deliberate distractor; MgCl₂'s higher $i$ is defeated by its lower concentration.)`,
    formulaConcept: 'ΔT_b = i·K_b·m — compare the product i·m; electrolytes multiply particle count.',
    difficulty: 'HARD', chapterSlug: 'solutions', topicSlug: 'colligative-properties',
    sourceType: 'ORIGINAL', sourceNote: 'Colligative comparison from a data table.',
    diagram: {
      kind: 'table',
      headers: ['Solution', 'Molality (m)', 'i (complete dissoc.)', 'i × m ∝ ΔT_b'],
      rows: [
        ['K₂SO₄ → 2K⁺ + SO₄²⁻', '0.1', '3', '0.30 ← highest'],
        ['NaCl → Na⁺ + Cl⁻', '0.1', '2', '0.20'],
        ['Urea (non-electrolyte)', '0.2', '1', '0.20'],
        ['MgCl₂ → Mg²⁺ + 2Cl⁻', '0.05', '3', '0.15'],
      ],
      caption: 'Given data — compare i × m: the largest product boils highest',
      highlightCells: [[0, 0], [0, 1], [0, 2], [0, 3]],
    },
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `The species $\\text{N}^{3-}$, $\\text{O}^{2-}$, $\\text{F}^-$ and $\\text{Na}^+$ are isoelectronic (10 electrons each). The correct order of their **ionic radii** is:`,
    options: ['$\\text{Na}^+ > \\text{F}^- > \\text{O}^{2-} > \\text{N}^{3-}$', '$\\text{F}^- > \\text{O}^{2-} > \\text{N}^{3-} > \\text{Na}^+$', '$\\text{N}^{3-} > \\text{O}^{2-} > \\text{F}^- > \\text{Na}^+$', 'All are equal since they are isoelectronic'],
    correctAnswer: 'C',
    solutionText: `For **isoelectronic species**, the number of electrons is identical (here 10), so the size is controlled purely by the **nuclear charge Z**:
- Larger Z pulls the same electron cloud in more tightly → **smaller radius**.
- Lower Z with more negative charge → the cloud expands → **larger radius**.

**Atomic numbers:** N (7) < O (8) < F (9) < Na (11).

Hence the radius order (inverse of Z):
$$\\text{N}^{3-} > \\text{O}^{2-} > \\text{F}^- > \\text{Na}^+$$

(Reference values: N³⁻ ≈ 171 pm, O²⁻ ≈ 140 pm, F⁻ ≈ 136 pm, Na⁺ ≈ 95 pm.) "Isoelectronic" does **not** mean equal size — the electron count is the same, but the nucleus holding the cloud differs.`,
    formulaConcept: 'Isoelectronic series: radius ∝ 1/Z (same electron count, increasing nuclear charge shrinks the ion).',
    difficulty: 'MODERATE', chapterSlug: 'classification-periodicity', topicSlug: 'periodic-trends',
    sourceType: 'ORIGINAL', sourceNote: 'Isoelectronic radii ordering.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `For an **ideal** binary solution of liquids A and B, which one of the following statements is **false**?`,
    options: ['The enthalpy of mixing is zero', 'The volume change on mixing is zero', `It obeys Raoult's law over the entire range of composition`, 'The A–B intermolecular interactions are stronger than both A–A and B–B interactions'],
    correctAnswer: 'D',
    solutionText: `An **ideal solution** is defined by the following properties:

1. It obeys **Raoult's law** over the whole composition range: $p_A = x_A p_A^\\circ$, $p_B = x_B p_B^\\circ$ ✓ (true)
2. $\\Delta H_{\\text{mix}} = 0$ — no heat is evolved or absorbed on mixing ✓ (true)
3. $\\Delta V_{\\text{mix}} = 0$ — volumes are additive ✓ (true)
4. The **A–B interaction strength equals the A–A and B–B interaction strengths** — this is the molecular reason behind (1)–(3).

If A–B interactions were *stronger* than A–A and B–B, mixing would release heat ($\\Delta H_{\\text{mix}} < 0$) and the vapour pressures would fall **below** Raoult's-law values — a **negative deviation** (e.g. chloroform + acetone, with H-bonding). Such a solution is NOT ideal.

Hence the **false** statement is (D).

(Note: mixing of an ideal solution is still spontaneous because $\\Delta S_{\\text{mix}} > 0$, making $\\Delta G_{\\text{mix}} = -T\\Delta S_{\\text{mix}} < 0$.)`,
    formulaConcept: 'Ideal solution: ΔH_mix = 0, ΔV_mix = 0, Raoult\'s law obeyed exactly; A–B = A–A = B–B interactions.',
    difficulty: 'HARD', chapterSlug: 'solutions', topicSlug: 'raoults-law',
    sourceType: 'ORIGINAL', sourceNote: 'Definition-level concept check on ideal solutions.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `The four aromatic compounds shown are: (A) toluene, (B) chlorobenzene, (C) nitrobenzene and (D) benzene. Which of them undergoes electrophilic aromatic substitution **most readily**?`,
    options: ['Toluene', 'Chlorobenzene', 'Nitrobenzene', 'Benzene'],
    correctAnswer: 'A',
    solutionText: `The rate of electrophilic aromatic substitution (EAS) depends on the electron density of the ring, which the substituent controls:

- **Toluene, $-\\text{CH}_3$:** strongly **activating** (+I effect + hyperconjugation) → electron-rich ring → **fastest EAS**.
- **Benzene:** the unsubstituted reference ring.
- **Chlorobenzene, $-\\text{Cl}$:** overall **deactivating** (strong $-I$ outweighs weak $+R$), though still ortho/para-directing → slower than benzene.
- **Nitrobenzene, $-\\text{NO}_2$:** strongly **deactivating** ($-R$ and $-I$) and meta-directing → slowest.

**Order of EAS reactivity:**
$$\\text{toluene} > \\text{benzene} > \\text{chlorobenzene} > \\text{nitrobenzene}$$

Hence **toluene** undergoes electrophilic substitution most readily — the methyl group pushes electron density into the ring and stabilises the arenium (Wheland) intermediate.`,
    formulaConcept: 'EAS reactivity: activators (+I/+R like CH₃, OH) accelerate; deactivators (−R like NO₂; −I like Cl) retard.',
    difficulty: 'MODERATE', chapterSlug: 'hydrocarbons', topicSlug: 'aromatic-hydrocarbons',
    sourceType: 'ORIGINAL', sourceNote: 'Substituent activation comparison.',
    diagram: {
      kind: 'organic',
      parts: [
        { type: 'ring', x: 100, y: 95, label: '(A) toluene', substituents: [{ position: 0, label: 'CH₃' }] },
        { type: 'ring', x: 260, y: 95, label: '(B) chlorobenzene', substituents: [{ position: 0, label: 'Cl' }] },
        { type: 'ring', x: 420, y: 95, label: '(C) nitrobenzene', substituents: [{ position: 0, label: 'NO₂' }] },
        { type: 'ring', x: 560, y: 95, label: '(D) benzene' },
        { type: 'text', x: 100, y: 135, text: 'activating (+I, hyperconj.)' },
        { type: 'text', x: 260, y: 135, text: 'deactivating, o/p-director' },
        { type: 'text', x: 420, y: 135, text: 'strongly deactivating, meta-dir.' },
        { type: 'text', x: 560, y: 135, text: 'reference' },
      ],
    },
  },
  // ---------------- SECTION B (numerical) Q46–Q50 ----------------
  {
    subject: 'CHEMISTRY', section: 'B',
    text: `2.0 g of pure limestone ($\\text{CaCO}_3$, $M = 100\\ \\text{g mol}^{-1}$) is completely decomposed by heating:
$$\\text{CaCO}_3 \\to \\text{CaO} + \\text{CO}_2$$
The volume of $\\text{CO}_2$ evolved, measured at STP, is: (in L; round off to three decimal places)`,
    correctAnswer: '0.448',
    solutionText: `**Moles of calcium carbonate:**
$$n_{\\text{CaCO}_3} = \\frac{2.0}{100} = 0.02\\ \\text{mol}$$

**Stoichiometry:** 1 mol $\\text{CaCO}_3$ → 1 mol $\\text{CO}_2$, so
$$n_{\\text{CO}_2} = 0.02\\ \\text{mol}$$

**Volume at STP** (molar volume $= 22.4\\ \\text{L mol}^{-1}$):
$$V = 0.02 \\times 22.4 = 0.448\\ \\text{L}$$

So $0.448$ L (= 448 mL) of $\\text{CO}_2$ is evolved at STP.`,
    formulaConcept: 'Stoichiometry: n = m/M; at STP, V = n × 22.4 L.',
    difficulty: 'MODERATE', chapterSlug: 'some-basic-concepts', topicSlug: 'stoichiometry',
    sourceType: 'ORIGINAL', sourceNote: 'Thermal decomposition gas-volume problem.',
  },
  {
    subject: 'CHEMISTRY', section: 'B',
    text: `The ionisation constant of acetic acid is $K_a = 1.8 \\times 10^{-5}$. The pH of a 0.1 M acetic acid solution is: (round off to two decimal places)`,
    correctAnswer: '2.87',
    solutionText: `For a weak monobasic acid (Ostwald dilution law, $\\alpha \\ll 1$):
$$[\\text{H}^+] = \\sqrt{K_a C}$$

**Substitute** $K_a = 1.8\\times10^{-5}$, $C = 0.1$ M:
$$[\\text{H}^+] = \\sqrt{1.8\\times10^{-5} \\times 0.1} = \\sqrt{1.8\\times10^{-6}} = 1.342\\times10^{-3}\\ \\text{M}$$

(Degree of dissociation $\\alpha = 1.34\\times10^{-3}/0.1 = 1.34\\%$ — small, so $1-\\alpha \\approx 1$ is valid.)

**pH:**
$$\\text{pH} = -\\log(1.342\\times10^{-3}) = 3 - \\log 1.342 = 3 - 0.1276 = 2.87$$`,
    formulaConcept: 'Weak acid: [H⁺] = √(K_a·C); pH = −log[H⁺].',
    difficulty: 'HARD', chapterSlug: 'equilibrium', topicSlug: 'ionic-equilibrium-ph',
    sourceType: 'ORIGINAL', sourceNote: 'Ostwald dilution-law computation.',
  },
  {
    subject: 'CHEMISTRY', section: 'B',
    text: `A current of 2 A is passed through a solution of $\\text{CuSO}_4$ for 965 s using inert electrodes. The mass of copper deposited at the cathode is: (in g; $M_{\\text{Cu}} = 63.5$; $F = 96500\\ \\text{C mol}^{-1}$; round off to three decimal places)`,
    correctAnswer: '0.635',
    solutionText: `**Charge passed:**
$$Q = It = 2 \\times 965 = 1930\\ \\text{C}$$

**Moles of electrons:**
$$n_{e^-} = \\frac{Q}{F} = \\frac{1930}{96500} = 0.02\\ \\text{mol}$$

**Cathode reaction:** $\\text{Cu}^{2+} + 2e^- \\to \\text{Cu}$ — 2 mol electrons deposit 1 mol Cu:
$$n_{\\text{Cu}} = \\frac{0.02}{2} = 0.01\\ \\text{mol}$$

**Mass deposited:**
$$m = 0.01 \\times 63.5 = 0.635\\ \\text{g}$$

(By Faraday's first law, $m = ZIt$ with $Z = M/nF = 63.5/193000$ — same result.)`,
    formulaConcept: "Faraday's laws: n(e⁻) = It/F; Cu²⁺ + 2e⁻ → Cu ⇒ m = ItM/nF.",
    difficulty: 'MODERATE', chapterSlug: 'redox-electrochemistry', topicSlug: 'electrolysis',
    sourceType: 'ORIGINAL', sourceNote: 'Faraday electrolysis computation.',
  },
  {
    subject: 'CHEMISTRY', section: 'B',
    text: `The number of **structural isomers** of $\\text{C}_4\\text{H}_{10}\\text{O}$ that are **alcohols** (not ethers) is:`,
    correctAnswer: '4',
    solutionText: `We need all constitutional alcohols with a 4-carbon skeleton — butanols and methylpropanols.

**Straight chain (butanols):**
1. Butan-1-ol: $\\text{CH}_3\\text{CH}_2\\text{CH}_2\\text{CH}_2\\text{OH}$
2. Butan-2-ol: $\\text{CH}_3\\text{CH(OH)CH}_2\\text{CH}_3$

**Branched chain (methylpropanols):**
3. 2-Methylpropan-1-ol (isobutanol): $(\\text{CH}_3)_2\\text{CHCH}_2\\text{OH}$
4. 2-Methylpropan-2-ol (tert-butanol): $(\\text{CH}_3)_3\\text{COH}$

**Total: 4 structural isomeric alcohols.**

(Ether isomers of $\\text{C}_4\\text{H}_{10}\\text{O}$ — e.g. ethoxyethane, methoxypropanes — are excluded by the question. Including them would raise the count — the classic trap.)`,
    formulaConcept: 'Structural isomer enumeration: butanols (2) + methylpropanols (2) = 4 alcohols for C₄H₁₀O.',
    difficulty: 'HARD', chapterSlug: 'basic-principles-organic', topicSlug: 'nomenclature-isomerism',
    sourceType: 'ORIGINAL', sourceNote: 'Isomer counting with exclusion condition.',
  },
  {
    subject: 'CHEMISTRY', section: 'B',
    text: `A first-order reaction is $50\\%$ complete in 30 minutes. The time required for $90\\%$ completion is: (in minutes; round off to one decimal place)`,
    correctAnswer: '99.7',
    solutionText: `**Rate constant from the half-life:**
$$k = \\frac{0.693}{T_{1/2}} = \\frac{0.693}{30} = 0.0231\\ \\text{min}^{-1}$$

**Integrated first-order rate equation:**
$$t = \\frac{2.303}{k}\\log\\frac{a}{a-x}$$

For $90\\%$ completion, $a - x = 0.1a$, so $\\dfrac{a}{a-x} = 10$:
$$t = \\frac{2.303}{0.0231}\\log 10 = \\frac{2.303 \\times 1}{0.0231} = 99.7\\ \\text{min}$$

*Alternative (fast) method:* $t_{90} = 3.32\\,T_{1/2} = 3.32 \\times 30 = 99.6 \\approx 99.7$ min — consistent.

So the reaction is 90% complete in about **99.7 minutes**.`,
    formulaConcept: 'k = 0.693/T½; t₉₀% = 2.303/k = 3.32·T½.',
    difficulty: 'HARD', chapterSlug: 'chemical-kinetics', topicSlug: 'integrated-rate-equations',
    sourceType: 'ORIGINAL', sourceNote: 't₉₀ from half-life.',
  },
]
