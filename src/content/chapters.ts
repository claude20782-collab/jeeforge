// JEE Main syllabus (2025–26 pattern) — chapters + topics per subject.
// Used by scripts/seed.ts; slugs are stable identifiers referenced by question banks.

export interface TopicSeed { slug: string; name: string }
export interface ChapterSeed { slug: string; name: string; topics: TopicSeed[] }

export const PHYSICS_CHAPTERS: ChapterSeed[] = [
  { slug: 'units-and-measurements', name: 'Units and Measurements', topics: [
    { slug: 'dimensional-analysis', name: 'Dimensional Analysis' },
    { slug: 'measurement-errors', name: 'Errors in Measurement' },
    { slug: 'significant-figures', name: 'Significant Figures' },
    { slug: 'physical-quantities', name: 'Physical Quantities & SI Units' },
  ]},
  { slug: 'kinematics', name: 'Kinematics', topics: [
    { slug: 'motion-in-a-straight-line', name: 'Motion in a Straight Line' },
    { slug: 'motion-in-a-plane', name: 'Motion in a Plane' },
    { slug: 'projectile-motion', name: 'Projectile Motion' },
    { slug: 'relative-motion', name: 'Relative Motion' },
  ]},
  { slug: 'laws-of-motion', name: 'Laws of Motion', topics: [
    { slug: 'newtons-laws', name: "Newton's Laws of Motion" },
    { slug: 'friction', name: 'Friction' },
    { slug: 'impulse-and-momentum', name: 'Impulse and Momentum' },
    { slug: 'circular-dynamics', name: 'Dynamics of Circular Motion' },
  ]},
  { slug: 'work-energy-power', name: 'Work, Energy and Power', topics: [
    { slug: 'work-energy-theorem', name: 'Work-Energy Theorem' },
    { slug: 'conservative-forces-pe', name: 'Conservative Forces & Potential Energy' },
    { slug: 'collisions', name: 'Collisions' },
    { slug: 'power', name: 'Power' },
  ]},
  { slug: 'rotational-motion', name: 'Rotational Motion', topics: [
    { slug: 'moment-of-inertia', name: 'Moment of Inertia' },
    { slug: 'torque-and-equilibrium', name: 'Torque & Rotational Equilibrium' },
    { slug: 'angular-momentum', name: 'Angular Momentum' },
    { slug: 'rolling-motion', name: 'Rolling Motion' },
  ]},
  { slug: 'gravitation', name: 'Gravitation', topics: [
    { slug: 'keplers-laws', name: "Kepler's Laws" },
    { slug: 'newtons-law-of-gravitation', name: "Newton's Law of Gravitation" },
    { slug: 'gravitational-potential', name: 'Gravitational Potential & Field' },
    { slug: 'satellites-and-escape-velocity', name: 'Satellites & Escape Velocity' },
  ]},
  { slug: 'properties-of-solids-and-fluids', name: 'Properties of Solids and Fluids', topics: [
    { slug: 'elasticity', name: 'Elasticity' },
    { slug: 'fluid-statics', name: 'Pressure & Buoyancy' },
    { slug: 'viscosity', name: 'Viscosity & Stokes Law' },
    { slug: 'surface-tension', name: 'Surface Tension' },
    { slug: 'bernoulli-and-flow', name: 'Fluid Flow & Bernoulli Principle' },
  ]},
  { slug: 'thermodynamics', name: 'Thermodynamics', topics: [
    { slug: 'first-law', name: 'First Law of Thermodynamics' },
    { slug: 'thermodynamic-processes', name: 'Thermodynamic Processes' },
    { slug: 'heat-engines', name: 'Heat Engines & Carnot Cycle' },
    { slug: 'second-law', name: 'Second Law & Entropy' },
  ]},
  { slug: 'kinetic-theory', name: 'Kinetic Theory of Gases', topics: [
    { slug: 'ktg-basics', name: 'Kinetic Theory Fundamentals' },
    { slug: 'specific-heat-of-gases', name: 'Specific Heat of Gases' },
    { slug: 'degrees-of-freedom', name: 'Degrees of Freedom' },
    { slug: 'mean-free-path', name: 'Mean Free Path' },
  ]},
  { slug: 'oscillations', name: 'Oscillations', topics: [
    { slug: 'shm-kinematics', name: 'SHM — Kinematics' },
    { slug: 'shm-energy', name: 'Energy in SHM' },
    { slug: 'shm-superposition', name: 'Superposition of SHMs' },
    { slug: 'pendulums', name: 'Pendulums' },
  ]},
  { slug: 'waves', name: 'Waves', topics: [
    { slug: 'wave-motion', name: 'Travelling Waves' },
    { slug: 'standing-waves', name: 'Standing Waves' },
    { slug: 'beats', name: 'Beats' },
    { slug: 'doppler-effect', name: 'Doppler Effect' },
  ]},
  { slug: 'electrostatics', name: 'Electrostatics', topics: [
    { slug: 'coulombs-law', name: "Coulomb's Law" },
    { slug: 'electric-field', name: 'Electric Field' },
    { slug: 'gauss-law', name: "Gauss's Law" },
    { slug: 'electric-potential', name: 'Electric Potential' },
    { slug: 'capacitors', name: 'Capacitors' },
    { slug: 'conductors', name: 'Conductors in Electrostatics' },
  ]},
  { slug: 'current-electricity', name: 'Current Electricity', topics: [
    { slug: 'ohms-law-resistance', name: "Ohm's Law & Resistance" },
    { slug: 'kirchhoffs-laws', name: "Kirchhoff's Laws" },
    { slug: 'cells-and-emf', name: 'Cells, EMF & Internal Resistance' },
    { slug: 'heating-effect', name: 'Heating Effect of Current' },
    { slug: 'instruments', name: 'Wheatstone Bridge & Meter Bridge' },
  ]},
  { slug: 'magnetic-effects-of-current', name: 'Magnetic Effects of Current', topics: [
    { slug: 'biot-savart-law', name: 'Biot–Savart Law' },
    { slug: 'amperes-law', name: "Ampere's Law" },
    { slug: 'force-on-moving-charges', name: 'Force on Moving Charges & Conductors' },
    { slug: 'magnetic-dipole', name: 'Magnetic Dipole & Moving Coil Galvanometer' },
  ]},
  { slug: 'magnetism-and-matter', name: 'Magnetism and Matter', topics: [
    { slug: 'bar-magnet', name: 'Bar Magnet & Magnetic Field' },
    { slug: 'magnetic-materials', name: 'Magnetic Materials & Hysteresis' },
    { slug: 'earths-magnetism', name: "Earth's Magnetism" },
  ]},
  { slug: 'emi', name: 'Electromagnetic Induction', topics: [
    { slug: 'faradays-law', name: "Faraday's Law" },
    { slug: 'lenzs-law', name: "Lenz's Law & Eddy Currents" },
    { slug: 'motional-emf', name: 'Motional EMF' },
    { slug: 'inductance', name: 'Self & Mutual Inductance' },
    { slug: 'ac-generator', name: 'AC Generator' },
  ]},
  { slug: 'alternating-current', name: 'Alternating Current', topics: [
    { slug: 'ac-basics', name: 'AC Fundamentals & Phasors' },
    { slug: 'lcr-circuits', name: 'Series LCR Circuits' },
    { slug: 'resonance', name: 'Resonance' },
    { slug: 'power-in-ac', name: 'Power Factor & Wattless Current' },
    { slug: 'transformer', name: 'Transformer' },
  ]},
  { slug: 'em-waves', name: 'Electromagnetic Waves', topics: [
    { slug: 'displacement-current', name: 'Displacement Current' },
    { slug: 'em-spectrum', name: 'EM Spectrum' },
    { slug: 'em-wave-properties', name: 'Properties of EM Waves' },
  ]},
  { slug: 'ray-optics', name: 'Ray Optics', topics: [
    { slug: 'reflection-mirrors', name: 'Reflection & Mirrors' },
    { slug: 'refraction-lenses', name: 'Refraction & Lenses' },
    { slug: 'prisms-tir', name: 'Prisms & Total Internal Reflection' },
    { slug: 'optical-instruments', name: 'Optical Instruments' },
  ]},
  { slug: 'wave-optics', name: 'Wave Optics', topics: [
    { slug: 'interference', name: 'Interference & YDSE' },
    { slug: 'diffraction', name: 'Diffraction' },
    { slug: 'polarisation', name: 'Polarisation' },
  ]},
  { slug: 'dual-nature', name: 'Dual Nature of Matter and Radiation', topics: [
    { slug: 'photoelectric-effect', name: 'Photoelectric Effect' },
    { slug: 'de-broglie-waves', name: 'de Broglie Wavelength' },
    { slug: 'x-rays', name: 'X-rays' },
  ]},
  { slug: 'atoms', name: 'Atoms', topics: [
    { slug: 'bohr-model', name: 'Bohr Model' },
    { slug: 'atomic-spectra', name: 'Atomic Spectra' },
    { slug: 'rutherford-model', name: 'Rutherford Scattering' },
  ]},
  { slug: 'nuclei', name: 'Nuclei', topics: [
    { slug: 'nuclear-properties', name: 'Nuclear Size, Mass & Density' },
    { slug: 'binding-energy', name: 'Mass Defect & Binding Energy' },
    { slug: 'radioactivity', name: 'Radioactivity' },
    { slug: 'fission-fusion', name: 'Fission & Fusion' },
  ]},
  { slug: 'semiconductors', name: 'Semiconductor Devices', topics: [
    { slug: 'pn-junction', name: 'p–n Junction & Diodes' },
    { slug: 'diode-circuits', name: 'Rectifiers & Diode Circuits' },
    { slug: 'logic-gates', name: 'Logic Gates' },
  ]},
]

export const CHEMISTRY_CHAPTERS: ChapterSeed[] = [
  { slug: 'some-basic-concepts', name: 'Some Basic Concepts of Chemistry', topics: [
    { slug: 'mole-concept', name: 'Mole Concept' },
    { slug: 'stoichiometry', name: 'Stoichiometry & Limiting Reagent' },
    { slug: 'concentration-terms', name: 'Concentration Terms' },
    { slug: 'empirical-formulas', name: 'Percentage Composition & Formulas' },
  ]},
  { slug: 'atomic-structure', name: 'Atomic Structure', topics: [
    { slug: 'quantum-numbers-orbitals', name: 'Quantum Numbers & Orbitals' },
    { slug: 'bohrs-model-hydrogen', name: 'Bohr Model for Hydrogen' },
    { slug: 'photoelectric-spectra', name: 'Photoelectric Effect & Spectra' },
    { slug: 'electronic-configuration', name: 'Electronic Configuration' },
  ]},
  { slug: 'chemical-bonding', name: 'Chemical Bonding and Molecular Structure', topics: [
    { slug: 'vsepr-shapes', name: 'VSEPR Theory & Shapes' },
    { slug: 'hybridisation', name: 'Hybridisation' },
    { slug: 'molecular-orbital-theory', name: 'Molecular Orbital Theory' },
    { slug: 'dipole-moments', name: 'Dipole Moments' },
    { slug: 'bond-parameters', name: 'Bond Parameters & Resonance' },
  ]},
  { slug: 'thermodynamics-chemistry', name: 'Chemical Thermodynamics', topics: [
    { slug: 'enthalpy', name: 'Enthalpy & Thermochemistry' },
    { slug: 'hess-law', name: "Hess's Law" },
    { slug: 'entropy-gibbs-energy', name: 'Entropy & Gibbs Energy' },
    { slug: 'spontaneity', name: 'Spontaneity & Equilibrium Constant' },
  ]},
  { slug: 'solutions', name: 'Solutions', topics: [
    { slug: 'raoults-law', name: "Raoult's Law" },
    { slug: 'colligative-properties', name: 'Colligative Properties' },
    { slug: 'abnormal-molar-mass', name: 'Abnormal Molar Mass' },
    { slug: 'henrys-law', name: "Henry's Law" },
  ]},
  { slug: 'equilibrium', name: 'Equilibrium', topics: [
    { slug: 'chemical-equilibrium', name: 'Chemical Equilibrium' },
    { slug: 'ionic-equilibrium-ph', name: 'Ionic Equilibrium & pH' },
    { slug: 'buffers', name: 'Buffers' },
    { slug: 'solubility-product', name: 'Solubility Product' },
  ]},
  { slug: 'redox-electrochemistry', name: 'Redox Reactions and Electrochemistry', topics: [
    { slug: 'redox-reactions', name: 'Redox Reactions & Balancing' },
    { slug: 'galvanic-cells', name: 'Galvanic Cells & Cell Potential' },
    { slug: 'nernst-equation', name: 'Nernst Equation' },
    { slug: 'conductance', name: 'Conductance & Kohlrausch Law' },
    { slug: 'electrolysis', name: 'Electrolysis & Faraday Laws' },
  ]},
  { slug: 'chemical-kinetics', name: 'Chemical Kinetics', topics: [
    { slug: 'rate-laws-order', name: 'Rate Laws & Order of Reaction' },
    { slug: 'integrated-rate-equations', name: 'Integrated Rate Equations' },
    { slug: 'arrhenius-equation', name: 'Arrhenius Equation & Activation Energy' },
    { slug: 'collision-theory', name: 'Collision Theory' },
  ]},
  { slug: 'classification-periodicity', name: 'Classification of Elements and Periodicity', topics: [
    { slug: 'periodic-trends', name: 'Periodic Trends' },
    { slug: 'ionization-enthalpy', name: 'Ionization Enthalpy' },
    { slug: 'electronegativity-ea', name: 'Electronegativity & Electron Gain Enthalpy' },
  ]},
  { slug: 'p-block-elements', name: 'p-Block Elements', topics: [
    { slug: 'group-13-14', name: 'Groups 13 & 14' },
    { slug: 'group-15-16', name: 'Groups 15 & 16' },
    { slug: 'halogens-noble-gases', name: 'Halogens & Noble Gases' },
    { slug: 'important-p-block-compounds', name: 'Important p-Block Compounds' },
  ]},
  { slug: 'd-f-block-elements', name: 'd- and f-Block Elements', topics: [
    { slug: 'transition-element-properties', name: 'Transition Element Properties' },
    { slug: 'oxidation-states-compounds', name: 'Oxidation States & Compounds' },
    { slug: 'lanthanoids', name: 'Lanthanoids' },
  ]},
  { slug: 'coordination-compounds', name: 'Coordination Compounds', topics: [
    { slug: 'nomenclature', name: 'Nomenclature & Isomerism' },
    { slug: 'crystal-field-theory', name: 'Crystal Field Theory' },
    { slug: 'valence-bond-theory', name: 'Valence Bond Theory' },
    { slug: 'applications', name: 'Applications of Complexes' },
  ]},
  { slug: 'basic-principles-organic', name: 'Some Basic Principles of Organic Chemistry', topics: [
    { slug: 'nomenclature-isomerism', name: 'Nomenclature & Isomerism' },
    { slug: 'electronic-effects', name: 'Electronic Effects' },
    { slug: 'reaction-intermediates', name: 'Reaction Intermediates' },
    { slug: 'stereochemistry', name: 'Stereochemistry' },
  ]},
  { slug: 'hydrocarbons', name: 'Hydrocarbons', topics: [
    { slug: 'alkanes', name: 'Alkanes' },
    { slug: 'alkenes-alkynes', name: 'Alkenes & Alkynes' },
    { slug: 'aromatic-hydrocarbons', name: 'Aromatic Hydrocarbons' },
  ]},
  { slug: 'haloalkanes-haloarenes', name: 'Haloalkanes and Haloarenes', topics: [
    { slug: 'nucleophilic-substitution', name: 'Nucleophilic Substitution (SN1/SN2)' },
    { slug: 'elimination-reactions', name: 'Elimination Reactions' },
    { slug: 'reactions-haloarenes', name: 'Reactions of Haloarenes' },
  ]},
  { slug: 'alcohols-phenols-ethers', name: 'Alcohols, Phenols and Ethers', topics: [
    { slug: 'preparation-properties', name: 'Preparation & Properties' },
    { slug: 'acidity', name: 'Acidity of Alcohols & Phenols' },
    { slug: 'ethers', name: 'Ethers' },
  ]},
  { slug: 'aldehydes-ketones-acids', name: 'Aldehydes, Ketones and Carboxylic Acids', topics: [
    { slug: 'nucleophilic-addition', name: 'Nucleophilic Addition' },
    { slug: 'condensation-reactions', name: 'Aldol & Cannizzaro Reactions' },
    { slug: 'name-reactions', name: 'Name Reactions' },
    { slug: 'carboxylic-acids', name: 'Carboxylic Acids' },
  ]},
  { slug: 'amines', name: 'Amines', topics: [
    { slug: 'basicity', name: 'Basicity of Amines' },
    { slug: 'preparation-reactions', name: 'Preparation & Reactions' },
    { slug: 'diazonium-salts', name: 'Diazonium Salts' },
  ]},
  { slug: 'biomolecules', name: 'Biomolecules', topics: [
    { slug: 'carbohydrates', name: 'Carbohydrates' },
    { slug: 'proteins', name: 'Proteins & Enzymes' },
    { slug: 'vitamins-nucleic-acids', name: 'Vitamins & Nucleic Acids' },
  ]},
  { slug: 'purification-characterisation', name: 'Purification and Characterisation', topics: [
    { slug: 'purification-methods', name: 'Purification Methods' },
    { slug: 'qualitative-analysis', name: 'Qualitative Analysis' },
    { slug: 'quantitative-analysis', name: 'Quantitative Analysis' },
  ]},
]

export const MATHEMATICS_CHAPTERS: ChapterSeed[] = [
  { slug: 'sets-relations-functions', name: 'Sets, Relations and Functions', topics: [
    { slug: 'sets', name: 'Sets' },
    { slug: 'relations', name: 'Relations' },
    { slug: 'functions', name: 'Functions' },
  ]},
  { slug: 'complex-numbers', name: 'Complex Numbers', topics: [
    { slug: 'cn-algebra', name: 'Algebra of Complex Numbers' },
    { slug: 'argand-plane', name: 'Argand Plane & Modulus' },
    { slug: 'roots-of-unity', name: 'Roots of Unity' },
  ]},
  { slug: 'quadratic-equations', name: 'Quadratic Equations', topics: [
    { slug: 'roots-nature', name: 'Nature of Roots' },
    { slug: 'common-roots-conditions', name: 'Conditions on Roots' },
  ]},
  { slug: 'sequences-and-series', name: 'Sequences and Series', topics: [
    { slug: 'arithmetic-progression', name: 'Arithmetic Progression' },
    { slug: 'geometric-progression', name: 'Geometric Progression' },
    { slug: 'special-series', name: 'AM–GM & Special Series' },
  ]},
  { slug: 'permutations-combinations', name: 'Permutations and Combinations', topics: [
    { slug: 'fundamental-counting', name: 'Fundamental Counting' },
    { slug: 'permutations', name: 'Permutations' },
    { slug: 'combinations', name: 'Combinations' },
    { slug: 'distributions', name: 'Distributions & Grouping' },
  ]},
  { slug: 'binomial-theorem', name: 'Binomial Theorem', topics: [
    { slug: 'general-middle-terms', name: 'General & Middle Terms' },
    { slug: 'binomial-series', name: 'Series involving Coefficients' },
  ]},
  { slug: 'matrices-determinants', name: 'Matrices and Determinants', topics: [
    { slug: 'matrix-algebra', name: 'Matrix Algebra' },
    { slug: 'determinant-properties', name: 'Properties of Determinants' },
    { slug: 'inverse-and-systems', name: 'Adjoint, Inverse & Linear Systems' },
  ]},
  { slug: 'limits-continuity', name: 'Limits and Continuity', topics: [
    { slug: 'limits', name: 'Limits' },
    { slug: 'continuity-differentiability', name: 'Continuity & Differentiability' },
  ]},
  { slug: 'application-of-derivatives', name: 'Application of Derivatives', topics: [
    { slug: 'tangents-normals', name: 'Tangents & Normals' },
    { slug: 'monotonicity', name: 'Monotonicity' },
    { slug: 'maxima-minima', name: 'Maxima & Minima' },
    { slug: 'rate-of-change', name: 'Rate of Change' },
  ]},
  { slug: 'integral-calculus', name: 'Integral Calculus', topics: [
    { slug: 'indefinite-integration', name: 'Indefinite Integration' },
    { slug: 'definite-integration', name: 'Definite Integration & Properties' },
    { slug: 'area-under-curves', name: 'Area under Curves' },
  ]},
  { slug: 'differential-equations', name: 'Differential Equations', topics: [
    { slug: 'order-degree', name: 'Order & Degree' },
    { slug: 'variable-separable', name: 'Variable Separable' },
    { slug: 'linear-differential-equations', name: 'Linear Differential Equations' },
  ]},
  { slug: 'straight-lines', name: 'Straight Lines', topics: [
    { slug: 'line-forms', name: 'Equations of Lines' },
    { slug: 'point-line-distance', name: 'Distance & Angle between Lines' },
    { slug: 'family-of-lines', name: 'Family of Lines & Concurrency' },
  ]},
  { slug: 'circles', name: 'Circles', topics: [
    { slug: 'circle-equation', name: 'Equation of Circle' },
    { slug: 'tangents-to-circles', name: 'Tangents & Normals' },
    { slug: 'radical-axis', name: 'Radical Axis & Family' },
  ]},
  { slug: 'conic-sections', name: 'Conic Sections', topics: [
    { slug: 'parabola', name: 'Parabola' },
    { slug: 'ellipse', name: 'Ellipse' },
    { slug: 'hyperbola', name: 'Hyperbola' },
  ]},
  { slug: 'vector-algebra', name: 'Vector Algebra', topics: [
    { slug: 'dot-product', name: 'Dot Product & Projections' },
    { slug: 'cross-product', name: 'Cross Product' },
    { slug: 'scalar-triple-product', name: 'Scalar Triple Product' },
  ]},
  { slug: 'three-dimensional-geometry', name: 'Three Dimensional Geometry', topics: [
    { slug: 'lines-in-3d', name: 'Lines in 3D' },
    { slug: 'planes', name: 'Planes' },
    { slug: 'distances-in-3d', name: 'Distances & Angles in 3D' },
  ]},
  { slug: 'probability', name: 'Probability', topics: [
    { slug: 'conditional-probability', name: 'Conditional Probability & Independence' },
    { slug: 'total-probability-bayes', name: 'Total Probability & Bayes' },
    { slug: 'binomial-distribution', name: 'Binomial Distribution' },
  ]},
  { slug: 'statistics', name: 'Statistics', topics: [
    { slug: 'central-tendency', name: 'Mean, Median & Mode' },
    { slug: 'dispersion', name: 'Variance & Standard Deviation' },
  ]},
  { slug: 'trigonometry', name: 'Trigonometry', topics: [
    { slug: 'trig-identities-equations', name: 'Identities & Equations' },
    { slug: 'inverse-trig-functions', name: 'Inverse Trigonometric Functions' },
    { slug: 'properties-of-triangles', name: 'Properties of Triangles' },
  ]},
]

export const ALL_CHAPTERS: Array<{ subject: 'PHYSICS' | 'CHEMISTRY' | 'MATHEMATICS'; chapters: ChapterSeed[] }> = [
  { subject: 'PHYSICS', chapters: PHYSICS_CHAPTERS },
  { subject: 'CHEMISTRY', chapters: CHEMISTRY_CHAPTERS },
  { subject: 'MATHEMATICS', chapters: MATHEMATICS_CHAPTERS },
]
