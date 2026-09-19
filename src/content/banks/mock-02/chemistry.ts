import type { SeedQuestion } from '@/content/types'

// ============================================================================
// MOCK 02 — CHEMISTRY (Q26–Q50: 20 MCQ Section A + 5 numerical Section B)
// Difficulty target: Hard JEE Main. All stoichiometry/numerics verified by hand.
// ============================================================================

export const CHEMISTRY_MOCK02: SeedQuestion[] = [
  // ---------------- SECTION A (MCQ) Q26–Q45 ----------------
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `The percentage by mass of water of crystallisation in washing soda, $\\text{Na}_2\\text{CO}_3 \\cdot 10\\text{H}_2\\text{O}$, is closest to: $(\\text{Na} = 23, \\text{C} = 12, \\text{O} = 16, \\text{H} = 1)$`,
    options: ['34.5%', '54.9%', '62.9%', '72.7%'],
    correctAnswer: 'C',
    solutionText: `**Molar mass of the hydrate:**
$$M(\\text{Na}_2\\text{CO}_3) = 2(23) + 12 + 3(16) = 106\\ \\text{g/mol}$$
$$M(10\\text{H}_2\\text{O}) = 10 \\times 18 = 180\\ \\text{g/mol}$$
$$M_{hydrate} = 106 + 180 = 286\\ \\text{g/mol}$$

**Water fraction:**
$$\\%\\text{H}_2\\text{O} = \\frac{180}{286} \\times 100 = 62.94\\% \\approx 62.9\\%$$

Almost two-thirds of washing soda by mass is crystallisation water — which is why it effloresces in dry air.

**Why the others are wrong:** (A) 34.5% treats water as $106/286$ inverted-ish (uses the anhydrous fraction wrongly); (B) 54.9% counts only $\\tfrac{180}{328}$ — a wrong anhydrous mass (adding O instead of H₂O); (D) 72.7% = 208/286 slips an extra 28 into the water.`,
    formulaConcept: 'Hydrate composition: $\\% \\text{water} = 10 \\times 18 / M_{hydrate} \\times 100$.',
    difficulty: 'MODERATE', chapterSlug: 'some-basic-concepts', topicSlug: 'mole-concept',
    sourceType: 'ORIGINAL', sourceNote: 'Washing-soda water of crystallisation.',
    diagram: {
      kind: 'table',
      headers: ['Species', 'Molar mass (g/mol)'],
      rows: [
        ['Na₂CO₃ (anhydrous)', 106],
        ['10 H₂O', 180],
        ['Na₂CO₃·10H₂O', 286],
      ],
      caption: 'Molar masses used',
    },
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `The number of radial nodes in a $4p$ orbital is:`,
    options: ['0', '2', '3', '1'],
    correctAnswer: 'B',
    solutionText: `Radial nodes are spherical shells where the radial wavefunction crosses zero:
$$\\text{radial nodes} = n - \\ell - 1$$

**For $4p$:** $n = 4$, $\\ell = 1$:
$$\\text{radial nodes} = 4 - 1 - 1 = 2$$

(For contrast: a $4p$ orbital also has $\\ell = 1$ **angular** node — the plane/lobe boundary — so it has 3 nodes in total, of which 2 are radial.)

**Why the others are wrong:** (A) 0 radial nodes belongs to $1s/2p/3d$ orbitals ($n - \\ell - 1 = 0$); (C) 3 is the *total* node count or the value for $4s$; (D) 1 would be a $3p$ orbital.`,
    formulaConcept: 'Radial nodes $= n - \\ell - 1$; angular nodes $= \\ell$.',
    difficulty: 'MODERATE', chapterSlug: 'atomic-structure', topicSlug: 'quantum-numbers-orbitals',
    sourceType: 'ORIGINAL', sourceNote: 'Node counting for 4p.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `Among the following dioxygen species, the one that is **diamagnetic** with bond order 1 is:`,
    options: ['O₂⁺', 'O₂', 'O₂⁻', 'O₂²⁻'],
    correctAnswer: 'D',
    solutionText: `Fill the MO diagram (each O contributes 8 electrons; compare the table):

| Species | Bond order | Unpaired e⁻ |
|---|---|---|
| $\\text{O}_2^+$ | $\\tfrac{10-5}{2} = 2.5$ | 1 (paramagnetic) |
| $\\text{O}_2$ | $\\tfrac{10-6}{2} = 2$ | 2 (paramagnetic) |
| $\\text{O}_2^-$ | $\\tfrac{10-7}{2} = 1.5$ | 1 (paramagnetic) |
| $\\text{O}_2^{2-}$ | $\\tfrac{10-8}{2} = 1$ | 0 (**diamagnetic**) ✓ |

Bond order $= \\tfrac{1}{2}(N_b - N_a)$ over the bonding/antibonding $\\sigma 2p$ and $\\pi 2p$ set. Adding electrons to $\\text{O}_2$ fills the antibonding $\\pi^*$ orbitals one at a time: $\\text{O}_2^- \\to$ one unpaired, $\\text{O}_2^{2-} \\to$ both paired.

**Why the others are wrong:** every other option still has 1–2 unpaired $\\pi^*$ electrons — paramagnetic. Only the peroxide ion empties the unpaired spins while keeping BO = 1.`,
    formulaConcept: 'MO bond order $= \\tfrac12(N_b - N_a)$; $\\pi^*$ filling sequence decides paramagnetism.',
    difficulty: 'HARD', chapterSlug: 'chemical-bonding', topicSlug: 'molecular-orbital-theory',
    sourceType: 'ORIGINAL', sourceNote: 'Dioxygen MO magnetism/bond order series.',
    diagram: {
      kind: 'table',
      headers: ['Species', 'Bond order', 'Magnetism'],
      rows: [
        ['O₂⁺', 2.5, 'paramagnetic'],
        ['O₂', 2.0, 'paramagnetic'],
        ['O₂⁻', 1.5, 'paramagnetic'],
        ['O₂²⁻', 1.0, 'diamagnetic'],
      ],
      caption: 'Dioxygen MO summary',
      highlightCells: [[3, 0], [3, 1], [3, 2]],
    },
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `Given:
$$\\text{C(s)} + \\text{O}_2(\\text{g}) \\to \\text{CO}_2(\\text{g}) \\quad \\Delta H = -393.5\\ \\text{kJ}$$
$$\\text{CO(g)} + \\tfrac12\\text{O}_2(\\text{g}) \\to \\text{CO}_2(\\text{g}) \\quad \\Delta H = -283.0\\ \\text{kJ}$$
The enthalpy of formation of $\\text{CO(g)}$ from its elements is:`,
    options: ['−110.5 kJ/mol', '+110.5 kJ/mol', '−676.5 kJ/mol', '−283.0 kJ/mol'],
    correctAnswer: 'A',
    solutionText: `**Target:** $\\text{C(s)} + \\tfrac12\\text{O}_2 \\to \\text{CO(g)}$, $\\Delta H_f = ?$

Hess's law — subtract reaction (2) from reaction (1):

$\\Big[\\text{C} + \\text{O}_2 \\to \\text{CO}_2\\Big] - \\Big[\\text{CO} + \\tfrac12 \\text{O}_2 \\to \\text{CO}_2\\Big]$
gives
$\\text{C} + \\text{O}_2 - \\text{CO} - \\tfrac12\\text{O}_2 \\to 0$, i.e. $\\text{C} + \\tfrac12\\text{O}_2 \\to \\text{CO}$

$$\\Delta H = (-393.5) - (-283.0) = -110.5\\ \\text{kJ/mol}$$

The CO₂ cancels exactly; the oxygen halves out.

**Why the others are wrong:** (B) sign flip; (C) −676.5 adds the two enthalpies; (D) −283.0 is the second reaction itself, not the difference. Note $\\Delta H_f$(CO) **cannot be measured directly** — carbon preferentially forms CO₂ — which is the whole point of the Hess construction.`,
    formulaConcept: "Hess's law: $\\Delta H$ is path-independent; combine given reactions to build the target.",
    difficulty: 'HARD', chapterSlug: 'thermodynamics-chemistry', topicSlug: 'hess-law',
    sourceType: 'ORIGINAL', sourceNote: 'Classic CO formation via Hess.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `18 g of glucose ($M = 180\\ \\text{g/mol}$) is dissolved in 500 g of water ($K_f = 1.86\\ \\text{K·kg·mol}^{-1}$). The freezing point of the solution is closest to: (freezing point of pure water $= 0^\\circ\\text{C}$)`,
    options: ['−0.186 °C', '−0.372 °C', '−1.86 °C', '−3.72 °C'],
    correctAnswer: 'B',
    solutionText: `**Moles of glucose:**
$$n = \\frac{18}{180} = 0.1\\ \\text{mol}$$

**Molality** (solute per kg of solvent):
$$m = \\frac{0.1}{0.5} = 0.2\\ \\text{mol/kg}$$

**Freezing point depression** (glucose does not ionise, $i = 1$):
$$\\Delta T_f = K_f \\cdot m = 1.86 \\times 0.2 = 0.372\\ \\text{K}$$

**Freezing point:**
$$T_f = 0 - 0.372 = -0.372^\\circ\\text{C}$$

**Why the others are wrong:** (A) −0.186 °C uses molality 0.1 (forgetting the 500 g, i.e. using molarity-style dilution); (C) −1.86 °C uses 1 mol/kg; (D) −3.72 °C assumes $i = 2$ — glucose is a non-electrolyte.`,
    formulaConcept: '$\\Delta T_f = i K_f m$ — molality is per **kilogram of solvent**, and glucose keeps $i = 1$.',
    difficulty: 'HARD', chapterSlug: 'solutions', topicSlug: 'colligative-properties',
    sourceType: 'ORIGINAL', sourceNote: 'Freezing-point depression with correct molality.',
    diagram: {
      kind: 'graph',
      title: 'cooling curves',
      xAxis: { label: 'time', min: 0, max: 10, ticks: [2, 5, 8] },
      yAxis: { label: 'T (°C)', min: -1, max: 3, ticks: [-0.372, 0, 1, 2] },
      curves: [
        { type: 'curve', color: 'var(--chart-2)', points: [[0, 3], [1.5, 0.6], [2.5, 0.02], [5, 0], [7, -0.05], [8.5, -1.8]] },
        { type: 'curve', color: 'var(--gold)', points: [[0, 3], [1.5, -0.1], [2.5, -0.35], [5, -0.372], [7, -0.4], [8.5, -2]] },
      ],
      markers: [
        { x: 5.8, y: 0, label: 'pure water: 0 °C', color: 'var(--chart-2)' },
        { x: 5.8, y: -0.372, label: 'solution: −0.372 °C', color: 'var(--gold)' },
      ],
    },
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `For a sparingly soluble salt $AB_2$ with solubility product $K_{sp} = 3.2 \\times 10^{-11}$, the molar solubility $s$ (in mol/L) is:`,
    options: ['1 × 10⁻³', '1.5 × 10⁻⁴', '2 × 10⁻⁴', '3.2 × 10⁻⁴'],
    correctAnswer: 'C',
    solutionText: `Dissolution: $AB_2(s) \\rightleftharpoons A^{2+} + 2B^-$

At saturation with molar solubility $s$: $[A^{2+}] = s$ and $[B^-] = 2s$.

**Solubility product:**
$$K_{sp} = [A^{2+}][B^-]^2 = s \\times (2s)^2 = 4s^3$$

**Solve for $s$:**
$$s = \\sqrt[3]{\\frac{K_{sp}}{4}} = \\sqrt[3]{\\frac{3.2\\times10^{-11}}{4}} = \\sqrt[3]{8\\times10^{-12}} = 2\\times10^{-4}\\ \\text{mol/L}$$

(the cube root of $8 \\times 10^{-12}$ is clean: $2 \\times 10^{-4}$.)

**Why the others are wrong:** (A) $10^{-3}$ forgets the factor 4 and mis-roots; (B) $1.5\\times10^{-4}$ halves instead of cube-rooting; (D) $3.2\\times10^{-4}$ just re-labels $K_{sp}$'s mantissa as solubility.`,
    formulaConcept: '$AB_2$ type: $K_{sp} = 4s^3$; in general $K_{sp}$ grows with the $\\binom{\\text{ions}}{\\text{coefficients}}$ product.',
    difficulty: 'HARD', chapterSlug: 'equilibrium', topicSlug: 'solubility-product',
    sourceType: 'ORIGINAL', sourceNote: 'AB₂ Ksp back-calculation.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `For the cell
$$\\text{Zn}\\,|\\,\\text{Zn}^{2+}(0.1\\ \\text{M})\\,||\\,\\text{Cu}^{2+}(0.01\\ \\text{M})\\,|\\,\\text{Cu}$$
with $E^\\circ_{cell} = 1.10\\ \\text{V}$, the emf at $298\\ \\text{K}$ is closest to:`,
    options: ['1.13 V', '1.10 V', '1.05 V', '1.07 V'],
    correctAnswer: 'D',
    solutionText: `Cell reaction: $\\text{Zn} + \\text{Cu}^{2+} \\to \\text{Zn}^{2+} + \\text{Cu}$ (n = 2)

**Nernst equation** (base-10 form at 298 K):
$$E = E^\\circ - \\frac{0.059}{n}\\log\\frac{[\\text{Zn}^{2+}]}{[\\text{Cu}^{2+}]}$$

**Substituting:**
$$E = 1.10 - \\frac{0.059}{2}\\log\\frac{0.1}{0.01} = 1.10 - 0.0295 \\times \\log 10 = 1.10 - 0.0295 = 1.0705 \\approx 1.07\\ \\text{V}$$

The higher Zn²⁺ side (product) slightly *suppresses* the spontaneous direction, as expected from Le Chatelier.

**Why the others are wrong:** (A) 1.13 V adds the log term (inverted quotient); (B) 1.10 V ignores concentrations altogether (standard conditions only); (C) 1.05 V uses n = 1.`,
    formulaConcept: 'Nernst at 298 K: $E = E^\\circ - \\frac{0.059}{n}\\log Q$ — watch the ion ratio and $n$.',
    difficulty: 'VERY_HARD', chapterSlug: 'redox-electrochemistry', topicSlug: 'nernst-equation',
    sourceType: 'ORIGINAL', sourceNote: 'Concentration-cell Nernst with clean decade ratio.',
    diagram: {
      kind: 'apparatus',
      parts: [
        { type: 'beaker', x: 60, y: 160, w: 95, h: 105, label: 'ZnSO₄ (0.1 M)' },
        { type: 'beaker', x: 240, y: 160, w: 95, h: 105, label: 'CuSO₄ (0.01 M)' },
        { type: 'wire', x1: 95, y1: 90, x2: 95, y2: 165, label: 'Zn' },
        { type: 'wire', x1: 300, y1: 90, x2: 300, y2: 165, label: 'Cu' },
        { type: 'wire', x1: 95, y1: 90, x2: 300, y2: 90 },
        { type: 'tube', x: 155, y: 130, w: 90, h: 34, label: 'salt bridge (KNO₃)' },
        { type: 'arrow', x1: 130, y1: 72, x2: 265, y2: 72, label: 'e⁻ flow' },
        { type: 'label', x: 197, y: 50, text: 'E = ? (voltmeter)' },
      ],
      caption: 'Zn|Zn²⁺||Cu²⁺|Cu cell',
    },
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `A first-order reaction has a half-life of 20 minutes. The time required for 75% completion of the reaction is:`,
    options: ['40 min', '20 min', '60 min', '80 min'],
    correctAnswer: 'A',
    solutionText: `For a first-order reaction, every half-life consumes half of what remains — the half-life is concentration-independent:
$$t_{1/2} = \\frac{\\ln 2}{k} = 20\\ \\text{min}$$

**75% completion** means $\\tfrac34$ has reacted, i.e. $\\tfrac14$ remains:
$$\\frac{[A]}{[A]_0} = \\frac{1}{4} = \\left(\\frac{1}{2}\\right)^2 \\implies t = 2\\ T_{1/2} = 2 \\times 20 = 40\\ \\text{min}$$

(Equivalently: $t = \\tfrac{2.303}{k}\\log\\tfrac{100}{25} = \\tfrac{2.303}{k}\\log 4 = 2\\ T_{1/2}$.)

**Why the others are wrong:** (B) 20 min is one half-life = 50%; (C) 60 min assumes 75% ≈ 3 half-lives (that would be 87.5%); (D) 80 min = 4 half-lives (93.75%).`,
    formulaConcept: 'First order: fraction left $= (1/2)^{t/T_{1/2}}$ — count half-lives, don\'t re-derive.',
    difficulty: 'HARD', chapterSlug: 'chemical-kinetics', topicSlug: 'integrated-rate-equations',
    sourceType: 'ORIGINAL', sourceNote: 'Half-life bookkeeping for 75% completion.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `The correct order of **first ionisation enthalpy** (increasing) among B, Be, N, O is:`,
    options: ['B < Be < N < O', 'Be < B < N < O', 'B < Be < O < N', 'O < N < Be < B'],
    correctAnswer: 'C',
    solutionText: `Two anomalies of the second period decide this:

1. **Be > B**: beryllium's $2s^2$ is a stable, fully-filled s-subshell; boron loses a lone $2p^1$ electron more easily. ($IE_1$: Be ≈ 900, B ≈ 800 kJ/mol)
2. **N > O**: nitrogen's $2p^3$ is half-filled and exchange-stabilised; oxygen's $2p^4$ has a paired electron that repels, easing removal. ($IE_1$: N ≈ 1400, O ≈ 1310 kJ/mol)

**Overall increasing order:**
$$\\text{B} < \\text{Be} < \\text{O} < \\text{N}$$

**Why the others are wrong:** (A) and (B) put O above N — ignoring the half-filled stability of N; (D) reverses the whole trend.`,
    formulaConcept: 'IE anomalies: fully-filled $s^2$ (Be > B) and half-filled $p^3$ (N > O) beat the plain across-period rise.',
    difficulty: 'VERY_HARD', chapterSlug: 'classification-periodicity', topicSlug: 'ionization-enthalpy',
    sourceType: 'ORIGINAL', sourceNote: 'Second-period IE anomalies.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `Among the following oxides, the one that is **amphoteric** is:`,
    options: ['CO₂', 'CO', 'SnO₂', 'SiO₂'],
    correctAnswer: 'C',
    solutionText: `Amphoteric oxides react with both acids and bases:
$$\\text{SnO}_2 + 4\\text{HCl} \\to \\text{SnCl}_4 + 2\\text{H}_2\\text{O}$$
$$\\text{SnO}_2 + 2\\text{NaOH} \\to \\text{Na}_2\\text{SnO}_3 + \\text{H}_2\\text{O}$$

**Tin(IV) oxide is the classic amphoteric oxide** of group 14 — metallic character grows down the group, and by tin the oxide has become amphoteric.

**Why the others are wrong:** (A) CO₂ is acidic (gives carbonic acid, then carbonates with NaOH); (B) CO is **neutral** — it is the anhydride of no acid; (D) SiO₂ is a (weakly) acidic oxide — it reacts with molten/hot alkali to give silicates but not with acids (except HF), so it is not classified amphoteric.`,
    formulaConcept: 'Group 14 oxides: CO/CO₂ neutral/acidic → SiO₂ acidic → GeO₂, SnO₂ amphoteric → PbO₂ amphoteric (metallic character ↓ group).',
    difficulty: 'MODERATE', chapterSlug: 'p-block-elements', topicSlug: 'group-13-14',
    sourceType: 'ORIGINAL', sourceNote: 'Oxide acid–base character down group 14.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `The spin-only magnetic moment of $\\text{Fe}^{3+}$ (atomic number 26) is:`,
    options: ['5.92 BM', '4.90 BM', '3.87 BM', '1.73 BM'],
    correctAnswer: 'A',
    solutionText: `Fe is $[\\text{Ar}]\,3d^6 4s^2$; losing three electrons (two 4s, one 3d) gives:
$$\\text{Fe}^{3+}: [\\text{Ar}]\,3d^5$$

**High-spin d⁵** (free ion — no crystal field pairing): all five d electrons are unpaired, $n = 5$.

**Spin-only moment:**
$$\\mu = \\sqrt{n(n+2)} = \\sqrt{5 \\times 7} = \\sqrt{35} = 5.92\\ \\text{BM}$$

This is the *maximum* moment any 3d ion can show — d⁵ half-filled is as magnetic as the series gets.

**Why the others are wrong:** (B) 4.90 BM $= \\sqrt{24}$ ↔ 4 unpaired electrons (would be Mn³⁺/Cr²⁺ high-spin); (C) 3.87 BM $= \\sqrt{15}$ ↔ 3 unpaired (Cr³⁺); (D) 1.73 BM ↔ 1 unpaired (Ti³⁺/Fe³⁺ low-spin, e.g. in $[\\text{Fe(CN)}_6]^{3-}$).`,
    formulaConcept: '$\\mu_{spin-only} = \\sqrt{n(n+2)}$ BM; free-ion d⁵ stays high-spin.',
    difficulty: 'HARD', chapterSlug: 'd-f-block-elements', topicSlug: 'transition-element-properties',
    sourceType: 'ORIGINAL', sourceNote: 'Maximum μ from d⁵.',
    diagram: {
      kind: 'bars',
      title: 'spin-only moments of common 3d ions',
      categories: ['Ti³⁺ (d¹)', 'Cr³⁺ (d³)', 'Mn²⁺ (d⁵)', 'Fe³⁺ (d⁵)'],
      series: [{ name: 'μ (BM)', values: [1.73, 3.87, 5.92, 5.92], color: 'var(--gold)' }],
      yAxis: { label: 'μ (BM)', min: 0, max: 7 },
    },
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `The number of unpaired electrons in the complex $[\\text{Fe(CN)}_6]^{3-}$ is:`,
    options: ['5', '4', '3', '1'],
    correctAnswer: 'D',
    solutionText: `Oxidation state: $x + 6(-1) = -3 \\implies x = +3$, so the metal is $\\text{Fe}^{3+} = d^5$.

**CN⁻ is a strong-field ligand** — the crystal-field splitting $\\Delta_o$ exceeds the pairing energy $P$, so electrons **pair in the lower $t_{2g}$ set first** (low spin):

$$t_{2g}^5 e_g^0 \\quad \\Rightarrow \\quad \\uparrow\\downarrow\\,\\uparrow\\downarrow\\,\\uparrow$$

That is exactly **one unpaired electron**.

**Contrast:** with a weak-field ligand (H₂O in $[\\text{Fe(H}_2\\text{O)}_6]^{3+}$) the same d⁵ stays high-spin $t_{2g}^3 e_g^2$ with 5 unpaired electrons — the ligand, not the metal, sets the answer.

**Why the others are wrong:** (A) 5 is the high-spin/free-ion count; (B) 4 is impossible for d⁵ low-spin; (C) 3 would be Cr³⁺ behaviour.`,
    formulaConcept: 'Strong-field ligands (CN⁻, CO) force low-spin: fill $t_{2g}$ and pair up before touching $e_g$.',
    difficulty: 'HARD', chapterSlug: 'coordination-compounds', topicSlug: 'crystal-field-theory',
    sourceType: 'ORIGINAL', sourceNote: 'Low-spin d⁵ counting.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `The total number of **structural isomers** (chain + position) of monohydric alcohols with molecular formula $\\text{C}_4\\text{H}_{10}\\text{O}$ is:`,
    options: ['3', '4', '5', '8'],
    correctAnswer: 'B',
    solutionText: `The four alcohol skeletons (–OH on any carbon that keeps it an alcohol, no ethers counted):

1. **Butan-1-ol** — CH₃CH₂CH₂CH₂OH
2. **Butan-2-ol** — CH₃CH(OH)CH₂CH₃ *(a chiral alcohol)*
3. **2-Methylpropan-1-ol** (isobutyl alcohol) — (CH₃)₂CHCH₂OH
4. **2-Methylpropan-2-ol** (tert-butyl alcohol) — (CH₃)₃COH

That is **4** structural isomers. (Ethers like diethyl ether share the formula but are not alcohols.)

**Why the others are wrong:** (A) 3 misses either the branched primary or the tertiary; (C) 5 adds a phantom (2-methylbutan-... would need 5 carbons); (D) 8 counts ethers.`,
    formulaConcept: 'CₙH₂ₙ₊₂O alcohols: enumerate the carbon skeletons (n-butane + isobutane), then place –OH on each distinct carbon.',
    difficulty: 'MODERATE', chapterSlug: 'basic-principles-organic', topicSlug: 'nomenclature-isomerism',
    sourceType: 'ORIGINAL', sourceNote: 'C₄H₁₀O alcohol count.',
    diagram: {
      kind: 'organic',
      parts: [
        { type: 'text', x: 40, y: 40, text: 'butan-2-ol (one of the four):', bold: true },
        { type: 'chain', x: 40, y: 70, atoms: [{ sym: 'CH₃' }, { sym: 'CH(OH)' }, { sym: 'CH₂' }, { sym: 'CH₃' }] },
        { type: 'text', x: 40, y: 130, text: 'others: butan-1-ol, 2-methylpropan-1-ol,', bold: false },
        { type: 'text', x: 40, y: 155, text: '2-methylpropan-2-ol (tert-butyl alcohol)' },
      ],
      caption: 'C₄H₁₀O alcohols',
    },
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `2-methylbut-2-ene is subjected to ozonolysis followed by reductive workup (Zn/H₂O). The carbonyl products formed are:`,
    options: ['acetone + formaldehyde', 'propanal + formaldehyde', 'acetone + acetaldehyde', 'butanone + formaldehyde'],
    correctAnswer: 'C',
    solutionText: `Draw the alkene and cleave the C=C, replacing each double-bonded carbon with a C=O:

$$\\underset{\\text{2-methylbut-2-ene}}{(\\text{CH}_3)_2\\text{C} = \\text{CH}\\,\\text{CH}_3}$$

**Each alkene carbon keeps its substituents:**
- Carbon 1 of the double bond (the $\\text{C(CH}_3)_2$ carbon): two CH₃ groups → **acetone**, $(\\text{CH}_3)_2\\text{C}=\\text{O}$
- Carbon 2 (the CH): one H and one CH₃ → **acetaldehyde**, $\\text{CH}_3\\text{CHO}$

Reductive workup stops at the aldehyde (oxidative workup would push the CH side to acetic acid).

**Why the others are wrong:** (A) acetone + formaldehyde comes from 2-methylpropene (isobutylene); (B) propanal + formaldehyde would need the CH(CH₃)CH₃ fragment on the H-side; (D) butanone would need an ethyl on the disubstituted carbon.`,
    formulaConcept: 'Ozonolysis: every C=C carbon → C=O carrying its own substituents; reductive workup preserves aldehydes.',
    difficulty: 'HARD', chapterSlug: 'hydrocarbons', topicSlug: 'alkenes-alkynes',
    sourceType: 'ORIGINAL', sourceNote: 'Ozonolysis with a trisubstituted alkene.',
    diagram: {
      kind: 'organic',
      parts: [
        { type: 'chain', x: 40, y: 60, atoms: [{ sym: 'CH₃' }, { sym: 'C(CH₃)' }, { sym: 'CH' }, { sym: 'CH₃' }] },
        { type: 'text', x: 40, y: 100, text: 'C₂=C₃ double bond cleaved by O₃,', bold: false },
        { type: 'text', x: 40, y: 122, text: 'each carbon keeps its substituents' },
        { type: 'arrow', x1: 210, y1: 80, x2: 290, y2: 80, label: 'O₃; Zn/H₂O' },
        { type: 'text', x: 320, y: 60, text: '(CH₃)₂C=O', bold: true },
        { type: 'plus', x: 365, y: 85 },
        { type: 'text', x: 380, y: 60, text: 'CH₃CHO', bold: true },
        { type: 'text', x: 320, y: 100, text: 'acetone', bold: false },
        { type: 'text', x: 380, y: 100, text: 'acetaldehyde', bold: false },
      ],
      caption: 'ozonolysis of 2-methylbut-2-ene',
    },
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `The halide that undergoes solvolysis ($S_N1$) **most rapidly** in aqueous ethanol is:`,
    options: ['methyl chloride', '1-chlorobutane (n-butyl chloride)', 'chlorobenzene', 'tert-butyl chloride'],
    correctAnswer: 'D',
    solutionText: `The rate-determining step of $S_N1$ is the unimolecular ionisation to a **carbocation** — so the reactivity order is the carbocation stability order:
$$3^\\circ > 2^\\circ > 1^\\circ > \\text{CH}_3^+$$

**tert-Butyl chloride** ionises to the tert-butyl cation $(\\text{CH}_3)_3\\text{C}^+$, stabilised by hyperconjugation from nine β C–H bonds and the +I effect of three methyl groups — the most stable carbocation available here, hence fastest.

**Why the others are wrong:** (A) methyl chloride cannot ionise (would give CH₃⁺ — no stabilisation; it only reacts by $S_N2$); (B) primary → unstable primary cation (again mainly $S_N2$); (C) chlorobenzene's C–Cl bond has partial double-bond character (lone-pair resonance into the ring), so it ionises hardly at all — needs harsh conditions.`,
    formulaConcept: '$S_N1$ rate ∝ carbocation stability: $3^\\circ \\gg 2^\\circ > 1^\\circ$, aryl halides inert.',
    difficulty: 'MODERATE', chapterSlug: 'haloalkanes-haloarenes', topicSlug: 'nucleophilic-substitution',
    sourceType: 'ORIGINAL', sourceNote: 'SN1 reactivity via carbocation stability.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `The strongest acid among the following is:`,
    options: ['p-nitrophenol', 'phenol', 'ethanol', 'p-cresol (p-methylphenol)'],
    correctAnswer: 'A',
    solutionText: `Acidity of phenols tracks the stability of the **phenoxide ion** formed on losing H⁺:

- A $-\\text{NO}_2$ group at para position exerts a strong **−R (−M) electron-withdrawing effect**: it delocalises the negative charge of the phenoxide onto the nitro group itself (four extra resonance structures), stabilising the anion → **p-nitrophenol is the strongest** here ($pK_a \\approx 7.1$, phenol $pK_a \\approx 10$).
- $-\\text{CH}_3$ is a **+I/+R donor** — it *intensifies* the negative charge, destabilising the cresoxide → p-cresol is weaker than phenol ($pK_a \\approx 10.3$).
- Phenol itself benefits from ring resonance that ethanol's ethoxide lacks entirely → phenol ≫ ethanol in acidity ($pK_a \\approx 10$ vs $\\approx 16$).

**Order:** $p$-nitrophenol > phenol > $p$-cresol > ethanol.

**Why the others are wrong:** each candidate fails exactly one comparison above — phenol lacks the nitro boost, p-cresol has a donor, ethanol has no resonance stabilisation at all.`,
    formulaConcept: 'Phenol acidity: −R/−I groups (NO₂) stabilise the phenoxide → stronger acid; +R/+I groups (CH₃) destabilise it.',
    difficulty: 'HARD', chapterSlug: 'alcohols-phenols-ethers', topicSlug: 'acidity',
    sourceType: 'ORIGINAL', sourceNote: 'Substituent effects on phenol acidity.',
    diagram: {
      kind: 'organic',
      parts: [
        { type: 'ring', x: 130, y: 90, ringSize: 6, aromatic: true, label: 'p-nitrophenoxide', substituents: [{ position: 0, label: 'O⁻' }, { position: 3, label: 'NO₂' }] },
        { type: 'text', x: 40, y: 170, text: 'the −ve charge delocalises onto NO₂:', bold: false },
        { type: 'text', x: 40, y: 192, text: 'extra resonance forms stabilise the anion' },
      ],
      caption: 'resonance stabilisation of p-nitrophenoxide',
    },
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `The compound that gives a positive **iodoform test** (I₂/NaOH) is:`,
    options: ['benzaldehyde', 'acetophenone', 'benzophenone', '3-pentanone'],
    correctAnswer: 'B',
    solutionText: `The iodoform reaction needs the grouping $\\text{CH}_3\\text{CO}-$ (a methyl group directly attached to a carbonyl) — or the corresponding oxidisable $\\text{CH}_3\\text{CH(OH)}-$ unit.

**Acetophenone** is $\\text{C}_6\\text{H}_5\\text{COCH}_3$ — a methyl ketone. Base-iodine repeatedly enolises and iodinates the methyl to $\\text{CI}_3$, then OH⁻ cleaves the fragile bond:
$$\\text{C}_6\\text{H}_5\\text{COCH}_3 + 3\\text{I}_2 + 4\\text{OH}^- \\to \\text{C}_6\\text{H}_5\\text{COO}^- + \\text{CHI}_3\\downarrow + 3\\text{I}^- + 3\\text{H}_2\\text{O}$$
The pale-yellow crystalline iodoform (mp 119 °C, antiseptic smell) is the positive signal.

**Why the others are wrong:** (A) benzaldehyde $\\text{C}_6\\text{H}_5\\text{CHO}$ — no methyl on the carbonyl (gives a negative test; it instead gives Tollens'); (C) benzophenone has two aryl groups on the C=O; (D) 3-pentanone $(\\text{C}_2\\text{H}_5)_2\\text{CO}$ is symmetrical with only ethyl groups — no $\\text{CH}_3\\text{CO}$ fragment.`,
    formulaConcept: 'Iodoform test = methyl ketone fingerprint: $\\text{CH}_3\\text{COR} \\xrightarrow{I_2/\\text{NaOH}} \\text{RCOO}^- + \\text{CHI}_3\\downarrow$.',
    difficulty: 'HARD', chapterSlug: 'aldehydes-ketones-acids', topicSlug: 'name-reactions',
    sourceType: 'ORIGINAL', sourceNote: 'Iodoform test discrimination.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `In aqueous solution, the strongest base among the following is:`,
    options: ['NH₃', 'ethylamine (C₂H₅NH₂)', 'diethylamine ((C₂H₅)₂NH)', 'triethylamine ((C₂H₅)₃N)'],
    correctAnswer: 'C',
    solutionText: `Alkyl groups push electron density onto nitrogen by **+I effect**, so all ethylamines beat ammonia. But in **water** the trend is:
$$(\\text{C}_2\\text{H}_5)_2\\text{NH} > \\text{C}_2\\text{H}_5\\text{NH}_2 > (\\text{C}_2\\text{H}_5)_3\\text{N} > \\text{NH}_3$$

**Why the secondary amine wins:**
- Two ethyl groups give strong combined +I donation (more than one) —
- yet the nitrogen still carries **one N–H**, so it stays well **solvated** by hydrogen bonding with water, which stabilises the ammonium ion formed.

Triethylamine has three ethyls (+I boost) but **no N–H left for solvation of the cation** — steric crowding worsens this — so it drops *below* the primary amine in water. (In the gas phase the order would be 3° > 2° > 1° — the solvent makes the difference.)

**Why the others are wrong:** (A) NH₃ lacks alkyl donation; (B) one ethyl beats NH₃ but not the doubly-boosted, still-solvated secondary amine; (D) explained above — solvation loss trumps the third ethyl.`,
    formulaConcept: 'Aqueous basicity: +I boost vs solvation of the cation — $2^\\circ$ amines win the balance.',
    difficulty: 'HARD', chapterSlug: 'amines', topicSlug: 'basicity',
    sourceType: 'ORIGINAL', sourceNote: 'Aqueous amine basicity order with solvation rationale.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `Sucrose is a non-reducing sugar because:`,
    options: [
      'its fructose unit is a ketose, not an aldose',
      'it contains an α-1,2-glycosidic linkage rather than β',
      'it is non-polar and insoluble in Benedict\u2019s reagent',
      'the anomeric carbons of both glucose and fructose are locked in the glycosidic linkage',
    ],
    correctAnswer: 'D',
    solutionText: `A sugar reduces Tollens'/Fehling's reagent only if it can **open to an aldehyde (or α-hydroxy-ketone)** — which requires a *free anomeric carbon*.

In sucrose:
$$\\alpha\\text{-D-glucose} + \\beta\\text{-D-fructose} \\xrightarrow{\\text{C}_1\\text{–O–C}_2 \\text{ bond}} \\text{sucrose}$$

the glycosidic oxygen binds **C-1 of glucose AND C-2 of fructose — both anomeric carbons simultaneously**. Neither ring can open: no free hemiacetal/hemiketal exists, no equilibrium with an open-chain carbonyl, so the cupric ion has nothing to reduce.

**Why the others are wrong:** (A) ketose vs aldose is irrelevant — fructose itself reduces Benedict's via its α-hydroxy-keto tautomer; (B) α vs β linkage geometry does not decide reducing character (both maltose's α-1,4 and cellobiose's β-1,4 are reducing — one free anomeric carbon survives); (C) sucrose is highly water-soluble.`,
    formulaConcept: 'Reducing power ⇔ a free anomeric carbon that can equilibrate to an open-chain carbonyl.',
    difficulty: 'MODERATE', chapterSlug: 'biomolecules', topicSlug: 'carbohydrates',
    sourceType: 'ORIGINAL', sourceNote: 'Sucrose non-reducing rationale.',
  },
  {
    subject: 'CHEMISTRY', section: 'A',
    text: `In Lassaigne\u2019s test for nitrogen, the blue colour obtained on adding ferric chloride to the extract is due to the formation of:`,
    options: ['Fe₄[Fe(CN)₆]₃', 'Fe[Fe(CN)₆]', 'Fe₂[Fe(CN)₆]₃', 'Fe₃[Fe(CN)₆]₂'],
    correctAnswer: 'A',
    solutionText: `Sodium fusion converts the compound's N and C into **NaCN**, which then reacts with ferrous sulphate to give sodium ferrocyanide $\\text{Na}_4[\\text{Fe(CN)}_6]$:
$$6\\text{NaCN} + \\text{FeSO}_4 \\to \\text{Na}_4[\\text{Fe(CN)}_6] + \\text{Na}_2\\text{SO}_4$$

On adding $\\text{FeCl}_3$, ferric ions swap in to form **ferric ferrocyanide** — Prussian blue:
$$4\\text{Fe}^{3+} + 3[\\text{Fe(CN)}_6]^{4-} \\to \\text{Fe}_4[\\text{Fe(CN)}_6]_3\\downarrow$$

Charge balance check: $4 \\times (+3) + 3 \\times (-4) = 0$ ✓ — this is the only listed formula that is electrically neutral with sensible ion counts.

**Why the others are wrong:** (B) Fe[Fe(CN)₆] has charge +3−4 = −1 (it's not the neutral precipitate); (C) 2(+3)+3(−4) = −6; (D) 3(+3)+2(−4) = +1 — all fail charge neutrality.`,
    formulaConcept: 'Prussian blue = $\\text{Fe}_4[\\text{Fe(CN)}_6]_3$ — always verify complex formulas by charge balance.',
    difficulty: 'MODERATE', chapterSlug: 'purification-characterisation', topicSlug: 'qualitative-analysis',
    sourceType: 'ORIGINAL', sourceNote: 'Lassaigne chemistry with charge-balance check.',
  },
  // ---------------- SECTION B (numerical) Q46–Q50 ----------------
  {
    subject: 'CHEMISTRY', section: 'B',
    text: `The rate constant of a reaction doubles when the temperature rises from $300\\ \\text{K}$ to $310\\ \\text{K}$. The activation energy of the reaction (in kJ/mol, round off to one decimal) is: $(R = 8.314\\ \\text{J K}^{-1}\\text{mol}^{-1})$`,
    correctAnswer: '53.6',
    solutionText: `**Arrhenius equation** in two-temperature form:
$$\\ln\\frac{k_2}{k_1} = \\frac{E_a}{R}\\left(\\frac{1}{T_1} - \\frac{1}{T_2}\\right)$$

**Substituting** $k_2/k_1 = 2$, $T_1 = 300$ K, $T_2 = 310$ K:
$$\\ln 2 = \\frac{E_a}{8.314}\\left(\\frac{310 - 300}{300 \\times 310}\\right)$$

**Solve for $E_a$:**
$$E_a = 0.693 \\times 8.314 \\times \\frac{93000}{10} = 0.693 \\times 8.314 \\times 9300$$
$$E_a = 0.693 \\times 77{,}320 \\approx 53{,}590\\ \\text{J/mol} \\approx 53.6\\ \\text{kJ/mol}$$

This is the famous rule-of-thumb: *around room temperature, a 10 K rise doubles the rate when $E_a \\approx 53$ kJ/mol*.`,
    formulaConcept: 'Two-point Arrhenius: $E_a = R\\ln(k_2/k_1) \\cdot T_1T_2/(T_2-T_1)$.',
    difficulty: 'VERY_HARD', chapterSlug: 'chemical-kinetics', topicSlug: 'arrhenius-equation',
    sourceType: 'ORIGINAL', sourceNote: 'The classic "rate doubles per 10 K" computation.',
  },
  {
    subject: 'CHEMISTRY', section: 'B',
    text: `$\\text{PCl}_5$ dissociates as $\\text{PCl}_5(\\text{g}) \\rightleftharpoons \\text{PCl}_3(\\text{g}) + \\text{Cl}_2(\\text{g})$. Starting from pure $\\text{PCl}_5$ at an initial pressure of $1\\ \\text{atm}$, the degree of dissociation at equilibrium is $\\alpha = 0.5$. The equilibrium constant $K_p$ (in atm, round off to two decimals) is:`,
    correctAnswer: '0.5',
    solutionText: `Start with $n_0$ moles of pure $\\text{PCl}_5$ at temperature $T$ in a fixed volume, so the initial pressure is $P_0 = 1$ atm. At equilibrium with $\\alpha = 0.5$:

| | $\\text{PCl}_5$ | $\\text{PCl}_3$ | $\\text{Cl}_2$ | total |
|---|---|---|---|---|
| moles | $n_0(1-\\alpha) = 0.5n_0$ | $n_0\\alpha = 0.5n_0$ | $0.5n_0$ | $1.5n_0$ |

Because $P \\propto n$ at fixed $T, V$, the total pressure becomes
$$P_{total} = (1 + \\alpha)P_0 = 1.5\\ \\text{atm}$$

**Partial pressures** (mole fraction × total pressure):
$$p_{\\text{PCl}_5} = \\frac{1-\\alpha}{1+\\alpha}P_{total} = \\frac{0.5}{1.5} \\times 1.5 = 0.5\\ \\text{atm}$$
$$p_{\\text{PCl}_3} = p_{\\text{Cl}_2} = \\frac{\\alpha}{1+\\alpha}P_{total} = \\frac{0.5}{1.5} \\times 1.5 = 0.5\\ \\text{atm}$$

**Equilibrium constant:**
$$K_p = \\frac{p_{\\text{PCl}_3}\\,p_{\\text{Cl}_2}}{p_{\\text{PCl}_5}} = \\frac{0.5 \\times 0.5}{0.5} = 0.5\\ \\text{atm}$$

**Cross-check with the standard formula** for $A \\rightleftharpoons B + C$ started from pure $A$ at initial pressure $P_0$:
$$K_p = \\frac{(\\alpha P_0)^2}{(1-\\alpha)P_0} = \\frac{\\alpha^2 P_0}{1-\\alpha} = \\frac{0.25 \\times 1}{0.5} = 0.5\\ \\text{atm} \\checkmark$$

(If you instead use the *equilibrium* total pressure, the equivalent form $K_p = \\alpha^2 P_{eq}/(1-\\alpha^2) = 0.25 \\times 1.5 / 0.75 = 0.5$ atm gives the same value — the two textbook forms differ only in which pressure they reference.)`,
    formulaConcept: 'Dissociation $A \\rightleftharpoons B + C$ from pure $A$ at initial pressure $P_0$: $K_p = \\alpha^2 P_0/(1-\\alpha)$; every partial pressure is $p_i = x_i P_{total}$.',
    difficulty: 'HARD', chapterSlug: 'equilibrium', topicSlug: 'chemical-equilibrium',
    sourceType: 'ORIGINAL', sourceNote: 'PCl₅ dissociation with α = 0.5.',
  },
  {
    subject: 'CHEMISTRY', section: 'B',
    text: `The quantity of charge (in coulombs) required to deposit one mole of aluminium from a solution of $\\text{Al}_2(\\text{SO}_4)_3$ is: $(F = 96500\\ \\text{C mol}^{-1})$`,
    correctAnswer: '289500',
    solutionText: `The cathode half-reaction:
$$\\text{Al}^{3+} + 3e^- \\to \\text{Al}$$

**One mole of Al needs 3 moles of electrons:**
$$Q = n_{e^-} \\times F = 3 \\times 96500 = 289500\\ \\text{C}$$

(Verify the ion charge: in $\\text{Al}_2(\\text{SO}_4)_3$, aluminium is $+3$ — sulfate takes $-2$ each, $2(+3) + 3(-2) = 0$ ✓.)

For perspective: that much charge at 10 A would take $\\approx 8$ hours — aluminium electrolysis is expensive precisely because of this 3-electron price tag.`,
    formulaConcept: "Faraday's first law: $Q = (\\text{moles} \\times \\text{electrons per ion}) \\times F$.",
    difficulty: 'MODERATE', chapterSlug: 'redox-electrochemistry', topicSlug: 'electrolysis',
    sourceType: 'ORIGINAL', sourceNote: 'Trivalent electrodeposition charge.',
  },
  {
    subject: 'CHEMISTRY', section: 'B',
    text: `Benzoic acid ($M = 122\\ \\text{g/mol}$) dimerises in benzene to the extent of $80\\%$. The observed molar mass of the acid in this solution (in g/mol, round off to two decimals) is:`,
    correctAnswer: '203.33',
    solutionText: `Dimerisation: $2\\text{PhCOOH} \\rightleftharpoons (\\text{PhCOOH})_2$, degree $\\alpha = 0.8$.

**van't Hoff factor** (solute particles per formula unit):
$$i = 1 - \\alpha + \\frac{\\alpha}{2} = 1 - \\frac{\\alpha}{2} = 1 - 0.4 = 0.6$$

**Observed (colligative) molar mass** is *inflated* because fewer particles than expected:
$$M_{obs} = \\frac{M_{normal}}{i} = \\frac{122}{0.6} = 203.33\\ \\text{g/mol}$$

**Why the number makes sense:** at 80% dimerisation, on average each "molecule" weighs more — the solution behaves as if the solute had molar mass ~203, which is between 122 (monomer) and 244 (pure dimer), closer to the dimer end as expected.

**Check:** for $\\alpha = 1$ (complete dimerisation) $i = 0.5$ and $M_{obs} = 244$ ✓ consistent.`,
    formulaConcept: 'Association: $i = 1 - \\alpha/2$ for dimers, and $M_{obs} = M/i$.',
    difficulty: 'HARD', chapterSlug: 'solutions', topicSlug: 'abnormal-molar-mass',
    sourceType: 'ORIGINAL', sourceNote: 'Dimerisation-inflated molar mass.',
  },
  {
    subject: 'CHEMISTRY', section: 'B',
    text: `0.1 mol of an open-chain hydrocarbon (an alkene) on complete combustion yields $17.6\\ \\text{g}$ of $\\text{CO}_2$ and $7.2\\ \\text{g}$ of $\\text{H}_2\\text{O}$. The molar mass of the hydrocarbon (in g/mol) is: $(C = 12, \\ H = 1, \\ O = 16)$`,
    correctAnswer: '56',
    solutionText: `**Moles of products:**
$$n(\\text{CO}_2) = \\frac{17.6}{44} = 0.4\\ \\text{mol} \\qquad n(\\text{H}_2\\text{O}) = \\frac{7.2}{18} = 0.4\\ \\text{mol}$$

**Per molecule of hydrocarbon** (divide by 0.1 mol of fuel):
- Carbon atoms: $0.4 / 0.1 = 4$ → C₄
- Hydrogen atoms: $2 \\times 0.4 / 0.1 = 8$ → H₈

**Empirical/molecular formula:** $\\text{C}_4\\text{H}_8$ — and since the compound is an *open-chain alkene* ($C_nH_{2n}$), the empirical formula is already the molecular formula.

**Molar mass:**
$$M = 4(12) + 8(1) = 48 + 8 = 56\\ \\text{g/mol}$$

(The compound could be but-1-ene, but-2-ene or 2-methylpropene — combustion alone cannot distinguish isomers.)`,
    formulaConcept: 'Combustion stoichiometry: $n_C = n_{CO_2}$, $n_H = 2\\,n_{H_2O}$, all divided by moles of fuel.',
    difficulty: 'HARD', chapterSlug: 'some-basic-concepts', topicSlug: 'stoichiometry',
    sourceType: 'ORIGINAL', sourceNote: 'Combustion analysis to molecular formula.',
  },
]
