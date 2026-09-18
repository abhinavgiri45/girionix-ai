/**
 * Girionix AI — Sovereign Local Domain Knowledge Matrix
 * Deep, verified encyclopedic knowledge across all foundational fields:
 * - STEM & Deep Sciences (Quantum Mechanics, Thermodynamics, Chemistry, Biology, Relativity)
 * - Advanced Mathematics & Formal Logic (Linear Algebra, Calculus, Statistics, Graph Theory)
 * - Computer Science & Software Systems (System Design, Networking, Databases, Security, AI/ML)
 * - Economics, Finance & Business Strategy (DCF Valuation, CAPM, Macroeconomics, Unit Economics)
 * - Philosophy, History, Law & Cognition (Stoicism, Ethics, World History, Legal Frameworks)
 * - Communication, Writing & Applied Psychology (Persuasion, Systems 1 & 2, Rhetoric)
 */

export const localDomainKnowledge = {
  /**
   * Primary entry point to match domain-specific inquiries.
   * Returns a deeply reasoned, structured markdown response or null if unhandled.
   */
  matchDomainKnowledge(query, tag = '⚡ Sovereign Neural Engine') {
    if (!query) return null;
    const p = query.trim();
    const lp = p.toLowerCase();

    for (const entry of DOMAIN_TOPICS) {
      if (entry.pattern.test(lp)) {
        return entry.render(p, tag);
      }
    }
    return null;
  }
};

const DOMAIN_TOPICS = [
  // =========================================================================
  // 1. STEM: QUANTUM MECHANICS & MODERN PHYSICS
  // =========================================================================
  {
    pattern: /\b(quantum\s+mechanics|quantum\s+physics|schrodinger|wavefunction|uncertainty\s+principle|quantum\s+tunneling|heisenberg)\b/i,
    render: (q, tag) => `### ⚛️ Quantum Mechanics: Foundational Principles & Wave Mechanics (${tag})

Quantum mechanics describes the fundamental behavior of matter and energy at atomic and subatomic scales ($< 10^{-9}\\text{ m}$), where classical Newtonian mechanics ceases to hold.

#### 1. The Wavefunction & Born's Probability Interpretation
In quantum mechanics, physical state is represented by a complex wavefunction $\\Psi(\\mathbf{r}, t)$ in Hilbert space. The state evolves via the **Time-Dependent Schrödinger Equation**:

$$i\\hbar \\frac{\\partial}{\\partial t} \\Psi(\\mathbf{r}, t) = \\hat{\\mathcal{H}} \\Psi(\\mathbf{r}, t) = \\left( -\\frac{\\hbar^2}{2m} \\nabla^2 + V(\\mathbf{r}, t) \\right) \\Psi(\\mathbf{r}, t)$$

- **Born Rule**: The physical probability density $P(\\mathbf{r})$ of detecting a particle at position $\\mathbf{r}$ is the squared magnitude:
$$P(\\mathbf{r}) = |\\Psi(\\mathbf{r}, t)|^2 = \\Psi^* \\Psi$$
- **Normalization Condition**: The particle must exist somewhere in all space: $\\int_{-\\infty}^{+\\infty} |\\Psi|^2 \\, d^3r = 1$.

#### 2. The Heisenberg Uncertainty Principle
Operators for non-commuting observables cannot possess simultaneously sharp eigenvalues. For position $\\hat{x}$ and momentum $\\hat{p}_x$ ($[\\hat{x}, \\hat{p}_x] = i\\hbar$):

$$\\Delta x \\cdot \\Delta p_x \\ge \\frac{\\hbar}{2}$$

*(Where $\\hbar = \\frac{h}{2\\pi} \\approx 1.05457 \\times 10^{-34} \\text{ J}\\cdot\\text{s}$. This is not an experimental limitation of measurement apparatuses, but an intrinsic mathematical Fourier wave property of nature.)*

#### 3. Quantum Tunneling & Barrier Penetration
When a quantum particle encounters a potential energy barrier $V_0 > E$, its wavefunction does not drop abruptly to zero. Inside the classically forbidden zone, the wavefunction decays exponentially:

$$\\psi(x) \\propto e^{-\\kappa x}, \\quad \\text{where } \\kappa = \\frac{\\sqrt{2m(V_0 - E)}}{\\hbar}$$

This non-zero transmission probability powers:
- **Nuclear Alpha Decay** and stellar fusion in the Sun.
- **Scanning Tunneling Microscopy (STM)** for atomic imaging.
- **Flash Memory (NAND gates)** tunneling electrons through dielectric oxides.

---
💡 **Key Takeaway**: At the quantum scale, particles exhibit dual wave-particle nature. Physical observables are operator eigenvalues, and reality is fundamentally probabilistic until state projection occurs.`
  },

  // =========================================================================
  // 2. STEM: THERMODYNAMICS & STATISTICAL MECHANICS
  // =========================================================================
  {
    pattern: /\b(thermodynamics|laws?\s+of\s+thermodynamics|entropy|carnot\s+cycle|gibbs\s+free\s+energy|enthalpy)\b/i,
    render: (q, tag) => `### 🌡️ Thermodynamics & Statistical Mechanics (${tag})

Thermodynamics is the branch of physics governing energy transformation, heat transfer, entropy, and the spontaneous direction of macroscopic systems.

#### 1. The Four Fundamental Laws of Thermodynamics
| Law | Statement | Mathematical Formalism |
| :--- | :--- | :--- |
| **0th Law** | Thermal Equilibrium is transitive (basis for temperature measurement). | If $A \\sim B$ and $B \\sim C$, then $A \\sim C$ |
| **1st Law** | Conservation of Energy (Energy cannot be created or destroyed). | $dU = \\delta Q - \\delta W$ |
| **2nd Law** | Total entropy of an isolated system never decreases over time. | $\\Delta S_{\\text{universe}} \\ge 0$ |
| **3rd Law** | As temperature approaches absolute zero ($0\\text{ K}$), entropy approaches a constant minimum. | $\\lim_{T \\to 0} S = 0$ (for perfect crystal) |

#### 2. Boltzmann's Statistical Definition of Entropy
Ludwig Boltzmann unified macroscopic thermodynamics with microscopic atomistics:

$$S = k_B \\ln \\Omega$$

*(Where $k_B = 1.380649 \\times 10^{-23} \\text{ J/K}$ is the Boltzmann constant, and $\\Omega$ is the multiplicity—the number of microstates compatible with the macrostate.)*

#### 3. Carnot Heat Engine & Maximum Theoretical Efficiency
No heat engine operating between hot reservoir $T_H$ and cold reservoir $T_C$ can exceed the efficiency $\\eta_{\\text{Carnot}}$:

$$\\eta_{\\text{Carnot}} = 1 - \\frac{T_C}{T_H} = \\frac{W_{\\text{net}}}{Q_{\\text{in}}}$$

#### 4. Gibbs Free Energy ($\\Delta G$) & Chemical Spontaneity
At constant temperature and pressure, spontaneity is dictated by:

$$\\Delta G = \\Delta H - T\\Delta S$$

- $\\Delta G < 0$: **Exergonic** (spontaneous in the forward direction).
- $\\Delta G = 0$: **Dynamic equilibrium**.
- $\\Delta G > 0$: **Endergonic** (non-spontaneous; requires external energy input).`
  },

  // =========================================================================
  // 3. STEM: ELECTROMAGNETISM & MAXWELL'S EQUATIONS
  // =========================================================================
  {
    pattern: /\b(maxwell'?s?\s+equations|electromagnetism|lorentz\s+force|faraday'?s?\s+law|ampere'?s?\s+law|gauss'?s?\s+law)\b/i,
    render: (q, tag) => `### ⚡ Electromagnetism: Maxwell's Unified Equations (${tag})

James Clerk Maxwell unified electricity, magnetism, and optics into four coupled partial differential equations in 1865, revealing that light itself is a self-propagating electromagnetic wave.

#### Maxwell's Equations (Differential Form in Vacuum)
1. **Gauss's Law for Electricity**:
$$\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\varepsilon_0}$$
*Electric charges act as sources and sinks of electric divergence; electric field lines originate on positive charges and terminate on negative ones.*

2. **Gauss's Law for Magnetism**:
$$\\nabla \\cdot \\mathbf{B} = 0$$
*Magnetic monopoles do not exist in classical electrodynamics; magnetic field lines form continuous closed loops.*

3. **Faraday's Law of Induction**:
$$\\nabla \\times \\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t}$$
*A time-varying magnetic flux induces a circulating electric field (fundamental principle behind electric generators, inductors, and transformers).*

4. **Ampère-Maxwell Circuital Law**:
$$\\nabla \\times \\mathbf{B} = \\mu_0 \\mathbf{J} + \\mu_0 \\varepsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t}$$
*Magnetic fields are generated both by electric currents ($\\mathbf{J}$) and by Maxwell's displacement current (time-varying electric fields $\\frac{\\partial \\mathbf{E}}{\\partial t}$).*

#### The Electromagnetic Wave Speed
Taking the curl of Faraday's Law and substituting Ampère's Law yields the wave equation for fields in a vacuum:

$$\\nabla^2 \\mathbf{E} = \\mu_0 \\varepsilon_0 \\frac{\\partial^2 \\mathbf{E}}{\\partial t^2}, \\quad \\implies c = \\frac{1}{\\sqrt{\\mu_0 \\varepsilon_0}} \\approx 2.99792 \\times 10^8 \\text{ m/s}$$

#### The Lorentz Force Equation
The net force experienced by a charge $q$ moving with velocity $\\mathbf{v}$ through electromagnetic fields:

$$\\mathbf{F} = q(\\mathbf{E} + \\mathbf{v} \\times \\mathbf{B})$$`
  },

  // =========================================================================
  // 4. STEM: GENERAL & SPECIAL RELATIVITY
  // =========================================================================
  {
    pattern: /\b(special\s+relativity|general\s+relativity|time\s+dilation|lorentz\s+transformation|spacetime|einstein\s+field\s+equations)\b/i,
    render: (q, tag) => `### 🌌 Einstein's Theory of Relativity (${tag})

Albert Einstein revolutionized our understanding of space, time, and gravity through two monumental formulations: **Special Relativity (1905)** and **General Relativity (1915)**.

#### 1. Special Relativity (Inertial Frames & Invariant $c$)
Built on two foundational postulates:
1. The laws of physics are invariant across all inertial reference frames.
2. The speed of light in vacuum ($c = 299{,}792{,}458\\text{ m/s}$) is identical for all observers regardless of relative motion.

**Key Relativistic Consequences**:
- **Lorentz Factor ($\\gamma$)**:
$$\\gamma = \\frac{1}{\\sqrt{1 - \\frac{v^2}{c^2}}}$$
- **Time Dilation**: Clocks in motion tick slower relative to stationary observers:
$$\\Delta t = \\gamma \\Delta t_0 = \\frac{\\Delta t_0}{\\sqrt{1 - v^2/c^2}}$$
- **Length Contraction**: Physical length contracts along the axis of relative velocity:
$$L = \\frac{L_0}{\\gamma} = L_0 \\sqrt{1 - \\frac{v^2}{c^2}}$$
- **Mass-Energy Equivalence**:
$$E^2 = (pc)^2 + (m_0 c^2)^2 \\quad \\implies \\quad E_0 = m_0 c^2 \\text{ (at rest)}$$

#### 2. General Relativity (Spacetime Curvature & Gravity)
Gravity is not an attractive mechanical force (as Newton modeled), but the manifestation of **four-dimensional spacetime curvature** caused by energy-momentum density.

**The Einstein Field Equations**:
$$G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}$$

- $G_{\\mu\\nu}$: The Einstein tensor (Ricci curvature and scalar metric curvature).
- $\\Lambda$: The cosmological constant (associated with dark energy).
- $T_{\\mu\\nu}$: The Stress-Energy-Momentum tensor (distribution of matter, radiation, and pressure).
- Free-falling bodies follow **geodesics**—extremal paths through curved 4D spacetime.`
  },

  // =========================================================================
  // 5. STEM: CHEMISTRY, REACTIONS & PERIODIC TRENDS
  // =========================================================================
  {
    pattern: /\b(chemical\s+equilibrium|le\s+chatelier|periodic\s+table|electronegativity|acid\s+base|ph\s+scale|redox|oxidation\s+reduction|covalent\s+bond|ionic\s+bond)\b/i,
    render: (q, tag) => `### 🧪 Chemical Dynamics, Equilibrium & Periodic Architecture (${tag})

Chemistry explains the interactions, electronic transitions, and bond reorganizations that govern material transformations.

#### 1. Dynamic Chemical Equilibrium & Le Chatelier's Principle
For a reversible reaction $aA + bB \\rightleftharpoons cC + dD$, the equilibrium state is defined by the equilibrium constant $K_c$:

$$K_c = \\frac{[C]^c [D]^d}{[A]^a [B]^b}$$

**Le Chatelier's Principle**: When a dynamic equilibrium is subjected to an external perturbation (change in concentration, temperature, or pressure), the system shifts its position to counteract that perturbation:
- **Increasing Pressure**: Shifts toward the side with fewer gas moles.
- **Increasing Temperature**: Shifts in the endothermic direction ($\\Delta H > 0$).
- **Adding Reactants**: Shifts equilibrium forward toward products ($Q < K$).

#### 2. Acid-Base Chemistry & The pH Scale
Water auto-ionizes according to the ion product $K_w$:
$$2\\text{H}_2\\text{O} \\rightleftharpoons \\text{H}_3\\text{O}^+ + \\text{OH}^-, \\quad K_w = [\\text{H}_3\\text{O}^+][\\text{OH}^-] = 1.0 \\times 10^{-14} \\text{ at } 25^\\circ\\text{C}$$

$$\\text{pH} = -\\log_{10}[\\text{H}_3\\text{O}^+], \\qquad \\text{pOH} = -\\log_{10}[\\text{OH}^-], \\qquad \\text{pH} + \\text{pOH} = 14$$

**Henderson-Hasselbalch Equation** (for buffer solutions):
$$\\text{pH} = \\text{p}K_a + \\log_{10}\\left(\\frac{[\\text{A}^-]}{[\\text{HA}]}\\right)$$

#### 3. Periodic Trends
- **Atomic Radius**: Decreases across a period (left to right) due to increasing effective nuclear charge ($Z_{\\text{eff}}$); increases down a group due to electron shielding and additional principal quantum shells.
- **Electronegativity (Pauling Scale)**: Increases toward Fluorine ($3.98$), driving dipole moments and bond polarity.
- **Ionization Energy**: Energy required to remove the outermost electron ($X \\to X^+ + e^-$), peaking in noble gases.`
  },

  // =========================================================================
  // 6. STEM: BIOLOGY, CRISPR & CELLULAR BIOMEDICINE
  // =========================================================================
  {
    pattern: /\b(crispr|gene\s+editing|cas9|cellular\s+respiration|glycolysis|krebs\s+cycle|action\s+potential|neuroscience|immunology|antibodies|synapse)\b/i,
    render: (q, tag) => `### 🧬 Molecular Biomedicine, Genetics & Neurobiology (${tag})

Modern biosciences explain how macromolecular machines, ionic gradients, and genetic codes coordinate living organisms.

#### 1. CRISPR-Cas9 Precision Gene Editing
Originating as an adaptive immune system in bacteria against bacteriophages, CRISPR-Cas9 allows targeted genomic modification:
1. **Guide RNA (gRNA)**: A synthetic 20-nucleotide sequence designed to be complementary to the genomic target locus.
2. **PAM Sequence**: Cas9 scans DNA for a Protospacer Adjacent Motif ($5'\\text{-NGG-}3'$) necessary for target binding.
3. **Double-Strand Break (DSB)**: Cas9 endonuclease cleaves both phosphodiester backbones 3-4 base pairs upstream of PAM.
4. **DNA Repair Mechanisms**:
   - **NHEJ (Non-Homologous End Joining)**: Error-prone ligation causing insertions/deletions (indels) to knock out genes.
   - **HDR (Homology-Directed Repair)**: High-fidelity template-mediated insertion or replacement of precise sequences.

#### 2. Cellular Respiration (Aerobic Energy Yield)
The multi-stage catabolism of glucose into chemical energy:
$$\\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 \\longrightarrow 6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\sim 30\\text{--}32\\text{ ATP}$$

- **Glycolysis (Cytosol)**: 1 Glucose $\\to$ 2 Pyruvate, generating net 2 ATP and 2 NADH.
- **Pyruvate Decarboxylation & Krebs Cycle (Mitochondrial Matrix)**: Yields $6\\text{ NADH}, 2\\text{ FADH}_2, 2\\text{ GTP/ATP}$, and releases $4\\text{ CO}_2$.
- **Oxidative Phosphorylation & Chemiosmosis (Inner Cristae)**: Complexes I-IV pump $H^+$ ions, establishing a proton motive force. Protons flow through the rotary **ATP Synthase**, producing $\\sim 26\\text{--}28$ ATP.

#### 3. Neurobiology: The Neuronal Action Potential
Information travels along axons via rapid voltage-gated ionic flux:
1. **Resting Membrane Potential**: Held at $\\approx -70\\text{ mV}$ by the $\\text{Na}^+/\\text{K}^+$ ATPase pump ($3\\text{Na}^+$ pumped out, $2\\text{K}^+$ in).
2. **Depolarization**: Threshold ($\\approx -55\\text{ mV}$) triggers voltage-gated $\\text{Na}^+$ channels to open; $\\text{Na}^+$ floods in, driving membrane potential to $+30\\text{ mV}$.
3. **Repolarization**: $\\text{Na}^+$ channels inactivate, voltage-gated $\\text{K}^+$ channels open; $\\text{K}^+$ rushes out.
4. **Refractory Period**: Temporary hyperpolarization ensures unidirectional signal propagation.`
  },

  // =========================================================================
  // 7. MATHEMATICS: LINEAR ALGEBRA & EIGEN-DECOMPOSITION
  // =========================================================================
  {
    pattern: /\b(linear\s+algebra|eigenvalues?|eigenvectors?|matrix\s+multiplications?|svd|singular\s+value\s+decomposition|determinants?|vector\s+spaces?)\b/i,
    render: (q, tag) => `### 📐 Linear Algebra & Matrix Spectral Decomposition (${tag})

Linear algebra forms the structural foundation of computer graphics, quantum mechanics, econometrics, and modern artificial intelligence.

#### 1. The Eigenvalue Problem
For a square linear operator matrix $A \\in \\mathbb{R}^{n \\times n}$, an **eigenvector** $\\mathbf{v} \\neq \\mathbf{0}$ and scalar **eigenvalue** $\\lambda$ satisfy:

$$A\\mathbf{v} = \\lambda \\mathbf{v} \\iff (A - \\lambda I)\\mathbf{v} = \\mathbf{0}$$

To obtain non-trivial solutions, the determinant of the characteristic matrix must vanish:

$$\\det(A - \\lambda I) = 0 \\quad \\text{(Characteristic Polynomial)}$$

- The roots of this $n$-th degree polynomial yield the eigenvalues $\\{\\lambda_1, \\dots, \\lambda_n\\}$.
- **Geometric Interpretation**: Under the linear transformation $A$, the vector $\\mathbf{v}$ does not rotate; it only scales by factor $\\lambda$.

#### 2. Diagonalization & Spectral Theorem
If $A$ has $n$ linearly independent eigenvectors, it can be factored into:

$$A = Q \\Lambda Q^{-1}$$

*(Where $Q$ contains eigenvectors as columns, and $\\Lambda = \\text{diag}(\\lambda_1, \\dots, \\lambda_n)$).*
- For any real symmetric matrix ($A = A^T$), all eigenvalues are real, and eigenvectors can be chosen to be mutually orthonormal ($Q^{-1} = Q^T$).

#### 3. Singular Value Decomposition (SVD)
Any real matrix $A \\in \\mathbb{R}^{m \\times n}$ factors universally into:

$$A = U \\Sigma V^T$$

- $U \\in \\mathbb{R}^{m \\times m}$: Orthonormal eigenvectors of $AA^T$ (Left singular vectors).
- $\\Sigma \\in \\mathbb{R}^{m \\times n}$: Diagonal matrix of singular values $\\sigma_i = \\sqrt{\\lambda_i(A^T A)}$ ordered $\\sigma_1 \\ge \\sigma_2 \\ge \\dots \\ge 0$.
- $V \\in \\mathbb{R}^{n \\times n}$: Orthonormal eigenvectors of $A^T A$ (Right singular vectors).
- **Core Applications**: Principal Component Analysis (PCA), low-rank matrix approximation, recommendation engines, and image compression.`
  },

  // =========================================================================
  // 8. MATHEMATICS: CALCULUS & FOURIER ANALYSIS
  // =========================================================================
  {
    pattern: /\b(calculus|fundamental\s+theorem\s+of\s+calculus|fourier\s+transform|differential\s+equations?|taylor\s+series|gradient\s+descent)\b/i,
    render: (q, tag) => `### 📐 Advanced Calculus, Differential Equations & Harmonic Analysis (${tag})

Calculus provides the rigorous mathematical language for describing continuous change, dynamic optimization, and wave decomposition.

#### 1. The Fundamental Theorem of Calculus (FTC)
Unifies differential and integral calculus as inverse operations:
- **Part 1 (Accumulation Function)**:
$$\\frac{d}{dx} \\left[ \\int_a^x f(t) \\, dt \\right] = f(x)$$
- **Part 2 (Definite Evaluation)**:
$$\\int_a^b f(x) \\, dx = F(b) - F(a), \\quad \\text{where } F'(x) = f(x)$$

#### 2. Taylor & Maclaurin Power Series Expansion
Any infinitely differentiable function $f(x)$ around point $x = a$ can be represented as:

$$f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!} (x - a)^n = f(a) + f'(a)(x-a) + \\frac{f''(a)}{2!}(x-a)^2 + \\cdots$$

- **Euler's Exponential Series**: $e^x = \\sum_{n=0}^\\infty \\frac{x^n}{n!} = 1 + x + \\frac{x^2}{2} + \\frac{x^3}{6} + \\cdots$
- **Trigonometric Series**: $\\sin(x) = x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\cdots, \\quad \\cos(x) = 1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} - \\cdots$

#### 3. Continuous Fourier Transform
Decomposes any time-domain signal $f(t)$ into its constituent frequency components $\\hat{f}(\\omega)$:

$$\\hat{f}(\\omega) = \\int_{-\\infty}^{+\\infty} f(t) e^{-i\\omega t} \\, dt, \\qquad f(t) = \\frac{1}{2\\pi} \\int_{-\\infty}^{+\\infty} \\hat{f}(\\omega) e^{i\\omega t} \\, d\\omega$$

**Significance**: Transforms complex differential equations in the time domain into simple algebraic multiplications in the frequency domain.`
  },

  // =========================================================================
  // 9. MATHEMATICS: PROBABILITY & BAYESIAN INFERENCE
  // =========================================================================
  {
    pattern: /\b(bayes'?\s+theorem|conditional\s+probability|normal\s+distribution|central\s+limit\s+theorem|hypothesis\s+testing|p-value|markov\s+chain)\b/i,
    render: (q, tag) => `### 📊 Probability Theory, Bayesian Inference & Statistics (${tag})

Probability and statistical inference provide the mathematical framework for reasoning under conditions of uncertainty and noisy empirical data.

#### 1. Bayes' Theorem
Calculates the updated posterior probability of hypothesis $H$ given observed evidence $E$:

$$P(H|E) = \\frac{P(E|H) \\cdot P(H)}{P(E)}$$

- $P(H|E)$: **Posterior Probability** (belief in $H$ after seeing evidence $E$).
- $P(E|H)$: **Likelihood** (probability of observing $E$ if $H$ is true).
- $P(H)$: **Prior Probability** (initial baseline belief before new evidence).
- $P(E) = \\sum_i P(E|H_i)P(H_i)$: **Marginal Likelihood / Evidence** (normalizing constant).

#### 2. The Central Limit Theorem (CLT)
Given independent, identically distributed (i.i.d.) random variables $X_1, X_2, \\dots, X_n$ with mean $\\mu$ and finite variance $\\sigma^2$, as sample size $n \\to \\infty$, the sample mean distribution converges to a Gaussian normal distribution regardless of the underlying population's shape:

$$\\bar{X}_n = \\frac{1}{n} \\sum_{i=1}^n X_i \\xrightarrow{d} \\mathcal{N}\\left(\\mu, \\frac{\\sigma^2}{n}\\right)$$

#### 3. Standard Normal Distribution (Gaussian)
The probability density function (PDF) for a normal variable $X \\sim \\mathcal{N}(\\mu, \\sigma^2)$:

$$f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} \\exp\\left( -\\frac{(x - \\mu)^2}{2\\sigma^2} \\right)$$

- **Empirical 68-95-99.7 Rule**:
  - $\\mu \\pm 1\\sigma$: Contains $\\approx 68.27\\%$ of probability mass.
  - $\\mu \\pm 2\\sigma$: Contains $\\approx 95.45\\%$ of probability mass.
  - $\\mu \\pm 3\\sigma$: Contains $\\approx 99.73\\%$ of probability mass.`
  },

  // =========================================================================
  // 10. COMPUTER SCIENCE: DISTRIBUTED SYSTEMS & CAP THEOREM
  // =========================================================================
  {
    pattern: /\b(cap\s+theorem|distributed\s+systems?|microservices|load\s+balanc|consistent\s+hashing|lru\s+cache|caching\s+strateg)\b/i,
    render: (q, tag) => `### 🖥️ Distributed Systems Architecture & The CAP Theorem (${tag})

Distributed systems coordinate multiple independent nodes over a network to operate as a cohesive, fault-tolerant infrastructure.

#### 1. The CAP Theorem (Brewer's Theorem)
In any asynchronous network prone to node or communication failures, a distributed data store can guarantee at most **two out of three** properties simultaneously:

1. **Consistency (C)**: Every read receives the most recent write or an error. (All nodes reflect identical data at the same instant).
2. **Availability (A)**: Every non-failing node returns a non-error response for every request, without guaranteeing it contains the most recent write.
3. **Partition Tolerance (P)**: The system continues to operate despite arbitrary network message loss, delays, or packet drops between nodes.

**The Real-World Reality**: Because physical networks inevitably experience latency and disconnections, **Partition Tolerance ($P$) is non-negotiable**. Therefore, architects must trade off between:
- **CP Systems (e.g., Google Spanner, HBase, ZooKeeper, etcd)**: Refuse writes or reads if partition prevents consensus; prioritizes strict linearizability over availability.
- **AP Systems (e.g., Apache Cassandra, DynamoDB with eventual consistency, Couchbase)**: Continues serving reads/writes on partitioned islands; reconciles state divergence later via conflict-free replicated data types (CRDTs) or vector clocks.

#### 2. Consistent Hashing
Distributes keys across a dynamic cluster of $N$ nodes arranged in a logical $2^{32}-1$ hash ring:
- Keys and server nodes are hashed using the same uniform hashing function (e.g., Murmur3, SHA-256).
- When a server joins or departs, **only $K/N$ keys need migration** (where $K$ is total keys), compared to conventional modulo hashing ($key \\pmod N$) which would reshuffle almost 100% of data.
- **Virtual Nodes (V-nodes)**: Each physical node is assigned multiple points on the ring to prevent hash hotspots and balance memory load.

#### 3. Caching Strategies
- **Cache-Aside (Lazy Loading)**: Application queries cache first; on miss, queries DB, populates cache, and returns.
- **Write-Through**: Application writes data to cache, which synchronously persists to the primary database.
- **Write-Behind (Write-Back)**: Application writes to cache immediately; writes are batched and asynchronously persisted to DB for ultra-low latency.`
  },

  // =========================================================================
  // 11. COMPUTER SCIENCE: DATABASES & STORAGE ENGINES
  // =========================================================================
  {
    pattern: /\b(acid\s+properties|b-tree|lsm-tree|sql\s+vs\s+nosql|database\s+indexing|sharding|database\s+normalization)\b/i,
    render: (q, tag) => `### 🗄️ Database Internals: ACID, Indexing & Storage Engines (${tag})

Databases guarantee data persistence, durability, and low-latency retrieval through specialized disk-oriented and memory-mapped data structures.

#### 1. ACID Transaction Guarantees
- **Atomicity**: All operations in a transaction execute successfully, or the entire transaction is rolled back. (All-or-nothing).
- **Consistency**: The database transitions only between valid states satisfying all schemas, constraints, and triggers.
- **Isolation**: Concurrent transactions execute without cross-contamination. Isolation levels:
  - *Read Uncommitted* $\\to$ *Read Committed* $\\to$ *Repeatable Read* $\\to$ *Serializable* (prevents dirty reads, non-repeatable reads, and phantom reads).
- **Durability**: Once a transaction is committed, its changes survive system crashes and power failures (typically guaranteed via Write-Ahead Logging / WAL).

#### 2. Storage Engines: B+ Trees vs. Log-Structured Merge (LSM) Trees
| Metric | **B+ Tree Engines** (PostgreSQL, MySQL InnoDB) | **LSM-Tree Engines** (RocksDB, Cassandra, LevelDB) |
| :--- | :--- | :--- |
| **Primary Workload** | Read-heavy, random point lookups, range scans | High-throughput write-heavy workloads |
| **Write Mechanism** | In-place page updates; random disk I/O | Sequential append to MemTable (RAM) & WAL |
| **Disk Structure** | Balanced multi-way search tree with page pointers | Flushed immutable SSTables organized in leveled tiers |
| **Compaction Cost** | Zero (balanced during insertion) | Background merge-compaction required |
| **Read Complexity** | $O(\\log_B N)$ bounded page reads | Checks MemTable + Bloom filters across levels |

#### 3. Horizontal Sharding vs. Read Replication
- **Read Replication**: Master node processes all writes and streams changes to read replicas via binary logs. Great for high read-to-write ratios ($> 10:1$).
- **Sharding**: Horizontally partitions rows across distinct physical database clusters using a shard key (e.g., \`user_id % num_shards\`), distributing both storage volume and write load.`
  },

  // =========================================================================
  // 12. COMPUTER SCIENCE: CRYPTOGRAPHY & CYBERSECURITY
  // =========================================================================
  {
    pattern: /\b(cryptography|public\s+key|rsa(\s+algorithm|\s+encryption)?|diffie\s+hellman|aes|sha-256|zero\s+trust|owasp|sql\s+injection|xss|csrf)\b/i,
    render: (q, tag) => `### 🔒 Cryptography, Information Security & Zero Trust (${tag})

Modern cybersecurity protects data confidentiality, integrity, authenticity, and non-repudiation across hostile network perimeters.

#### 1. Public-Key Cryptography: The RSA Algorithm
RSA relies on the computational asymmetry between multiplying two large prime numbers and factoring their product:
1. **Key Generation**: Select two distinct large primes $p$ and $q$.
2. Compute modulus $n = p \\cdot q$ and Euler's totient function:
$$\\phi(n) = (p - 1)(q - 1)$$
3. Choose public exponent $e$ such that $1 < e < \\phi(n)$ and $\\gcd(e, \\phi(n)) = 1$ (commonly $e = 65537$).
4. Compute private exponent $d$ as the modular multiplicative inverse of $e$:
$$d \\cdot e \\equiv 1 \\pmod{\\phi(n)}$$
5. **Encryption**: Ciphertext $c = m^e \\pmod n$.
6. **Decryption**: Plaintext $m = c^d \\pmod n$.

#### 2. Diffie-Hellman Key Exchange
Allows two parties to establish a shared symmetric secret over an insecure channel without transmitting the secret:
- Public parameters: prime $p$ and base generator $g$.
- Alice picks secret $a$, sends $A = g^a \\pmod p$.
- Bob picks secret $b$, sends $B = g^b \\pmod p$.
- Both compute shared secret:
$$K = B^a \\pmod p = (g^b)^a = g^{ab} = (g^a)^b = A^b \\pmod p$$

#### 3. OWASP Top Critical Web Vulnerabilities
- **SQL Injection (SQLi)**: Untrusted input concatenated directly into database queries.
  - *Remediation*: Use parameterized prepared statements (\`PreparedStatement\` / ORM queries with bound parameters).
- **Cross-Site Scripting (XSS)**: Injecting malicious scripts executed in user browsers.
  - *Remediation*: Context-aware output encoding, Content Security Policy (CSP headers), sanitization.
- **Cross-Site Request Forgery (CSRF)**: Forcing an authenticated browser to execute unwanted actions.
  - *Remediation*: Anti-CSRF tokens (\`SameSite=Strict\` cookie attribute).
- **Zero Trust Architecture**: *"Never trust, always verify"*. Eliminates perimeter-based implicit trust; enforces micro-segmentation, continuous multi-factor authentication (MFA), and mutual TLS (mTLS).`
  },

  // =========================================================================
  // 13. COMPUTER SCIENCE: ARTIFICIAL INTELLIGENCE & TRANSFORMERS
  // =========================================================================
  {
    pattern: /\b(transformer\s+architecture|self\s+attention|backpropagation|neural\s+networks?|llm|large\s+language\s+model|gradient\s+descent)\b/i,
    render: (q, tag) => `### 🤖 Deep Learning: Transformer Architecture & Backpropagation (${tag})

Transformers (introduced in *Attention Is All You Need*, Vaswani et al., 2017) revolutionized machine learning by discarding sequential recurrence (RNNs/LSTMs) in favor of parallelized multi-head self-attention.

#### 1. Scaled Dot-Product Attention
For query matrix $Q$, key matrix $K$, and value matrix $V$ with key dimension $d_k$:

$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left( \\frac{QK^T}{\\sqrt{d_k}} \\right) V$$

- **Mechanics**:
  1. $QK^T$: Computes the pairwise similarity matrix between every token and every other token.
  2. $\\frac{1}{\\sqrt{d_k}}$: Scaling factor prevents inner products from growing excessively large, which would push softmax gradients into vanishing regions.
  3. $\\text{softmax}(\\cdot)$: Normalizes raw attention logits into a probability distribution across sequence positions.
  4. Multiply by $V$: Extracts a context-weighted representation for each token.

#### 2. Multi-Head Attention
Instead of performing a single attention function, projections are computed in $h$ distinct representation subspaces:

$$\\text{MultiHead}(Q, K, V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h)W^O$$
$$\\text{head}_i = \\text{Attention}(QW_i^Q, KW_i^K, VW_i^V)$$

#### 3. Backpropagation & Reverse-Mode Automatic Differentiation
Neural networks optimize parameter weights $\\mathbf{W}$ via gradient descent to minimize a scalar loss function $\\mathcal{L}$:

$$\\mathbf{W}_{t+1} = \\mathbf{W}_t - \\eta \\nabla_{\\mathbf{W}} \\mathcal{L}$$

Using the multivariate chain rule, error gradients cascade backward from output layers to input layers:

$$\\frac{\\partial \\mathcal{L}}{\\partial w_{ij}^{(l)}} = \\frac{\\partial \\mathcal{L}}{\\partial z_i^{(l)}} \\cdot \\frac{\\partial z_i^{(l)}}{\\partial w_{ij}^{(l)}} = \\delta_i^{(l)} \\cdot a_j^{(l-1)}$$

*(Where $z_i^{(l)} = \\sum_j w_{ij}^{(l)} a_j^{(l-1)} + b_i^{(l)}$ and $\\delta_i^{(l)}$ is the layer error vector).*`
  },

  // =========================================================================
  // 14. FINANCE: CORPORATE VALUATION & DCF
  // =========================================================================
  {
    pattern: /\b(dcf|discounted\s+cash\s+flow|valuation|wacc|npv|net\s+present\s+value|irr|internal\s+rate\s+of\s+return|financial\s+statements?)\b/i,
    render: (q, tag) => `### 💼 Corporate Finance: Valuation & Discounted Cash Flow (DCF) (${tag})

Corporate valuation establishes the intrinsic economic worth of an enterprise based on the present value of its future cash-generating capability.

#### 1. The Discounted Cash Flow (DCF) Model
The intrinsic enterprise value ($EV$) equals the discounted stream of Unlevered Free Cash Flows (UFCF) plus the discounted Terminal Value ($TV$):

$$EV = \\sum_{t=1}^N \\frac{\\text{UFCF}_t}{(1 + \\text{WACC})^t} + \\frac{\\text{Terminal Value}}{(1 + \\text{WACC})^N}$$

**Unlevered Free Cash Flow Formulation**:
$$\\text{UFCF} = \\text{EBIT} \\times (1 - t_c) + \\text{D\\&A} - \\Delta\\text{NWC} - \\text{CapEx}$$

*(Where $t_c$ is effective corporate tax rate, $\\text{D\\&A}$ is non-cash depreciation and amortization, $\\Delta\\text{NWC}$ is change in Net Working Capital, and $\\text{CapEx}$ is Capital Expenditures).*

#### 2. Weighted Average Cost of Capital (WACC)
WACC serves as the hurdle discount rate reflecting both equity and debt financing risk:

$$\\text{WACC} = \\left( \\frac{E}{E + D} \\right) r_e + \\left( \\frac{D}{E + D} \\right) r_d (1 - t_c)$$

- Cost of Equity ($r_e$) via Capital Asset Pricing Model (**CAPM**):
$$r_e = R_f + \\beta (E(R_m) - R_f)$$
*(Where $R_f$ is risk-free rate, $\\beta$ measures market volatility correlation, and $E(R_m) - R_f$ is market equity risk premium).*

#### 3. Terminal Value (Gordon Growth Method)
Assumes cash flows stabilize and grow at a steady perpetual rate $g$ ($g < \\text{GDP growth}$):

$$\\text{Terminal Value} = \\frac{\\text{UFCF}_{N+1}}{\\text{WACC} - g}$$`
  },

  // =========================================================================
  // 15. ECONOMICS: MACROECONOMICS & MONETARY POLICY
  // =========================================================================
  {
    pattern: /\b(macroeconomics|inflation|interest\s+rates|gdp|central\s+bank|monetary\s+policy|fiscal\s+policy|phillips\s+curve)\b/i,
    render: (q, tag) => `### 📈 Macroeconomics, Monetary Policy & Price Dynamics (${tag})

Macroeconomics examines aggregate economic behavior, analyzing output, employment, price levels, and international capital flows.

#### 1. Gross Domestic Product (GDP): Expenditure Approach
$$Y = C + I + G + (X - M)$$

- $C$: Household Personal Consumption.
- $I$: Gross Private Domestic Business Investment.
- $G$: Government Consumption and Public Infrastructure Spending.
- $(X - M)$: Net Exports (Total Exports $X$ minus Imports $M$).

#### 2. Inflation & The Quantity Theory of Money
Milton Friedman's classical formulation of monetary velocity:

$$M \\cdot V = P \\cdot Y$$

- $M$: Money supply.
- $V$: Velocity of money (rate at which currency changes hands).
- $P$: General price level.
- $Y$: Real economic output (Real GDP).
- *Implication*: If velocity $V$ and output $Y$ are relatively stable in the short run, sustained increases in the money supply $M$ translate directly into price inflation $P$.

#### 3. Central Banking & Monetary Transmission Mechanism
Central banks (e.g., Federal Reserve, RBI, ECB) stabilize purchasing power using monetary policy levers:
- **Policy Interest Rates (Repo / Fed Funds Rate)**: Raising rates increases the cost of borrowing, cooling capital investment and dampening inflation. Lowering rates stimulates credit expansion and job creation.
- **Quantitative Easing / Tightening (QE/QT)**: Expanding or shrinking central bank balance sheet assets via open-market bond operations to alter long-term yield curves.

#### 4. The Short-Run vs. Long-Run Phillips Curve
- **Short-Run**: Inverse relationship between inflation and unemployment (lower unemployment can trigger upward wage pressures and demand-pull inflation).
- **Long-Run**: Vertical at the Natural Rate of Unemployment ($u^*$ / NAIRU); sustained monetary stimulus only raises inflation expectations without lowering structural unemployment.`
  },

  // =========================================================================
  // 16. BUSINESS STRATEGY: VENTURE BUILDING & MOATS
  // =========================================================================
  {
    pattern: /\b(unit\s+economics|cac|ltv|product-market\s+fit|porter'?s?\s+five\s+forces|network\s+effects|economic\s+moat)\b/i,
    render: (q, tag) => `### 🚀 Venture Strategy, Unit Economics & Competitive Moats (${tag})

Sustainable competitive advantage requires defensible moats, product-market validation, and accretive unit economics.

#### 1. Unit Economics & Capital Efficiency
- **Customer Lifetime Value (LTV)**:
$$\\text{LTV} = \\frac{\\text{Average Revenue Per User (ARPU)} \\times \\text{Gross Margin (\\%)}}{\\text{Monthly Churn Rate (\\%)}}$$
- **Customer Acquisition Cost (CAC)**:
$$\\text{CAC} = \\frac{\\text{Total Sales \\& Marketing Expenditure}}{\\text{New Customers Acquired}}$$
- **The Golden Ratio of SaaS**:
  - $\\frac{\\text{LTV}}{\\text{CAC}} \\ge 3.0$: Healthy, scalable business model.
  - $\\text{CAC Payback Period} \\le 12\\text{ months}$: Efficient working capital cycle.

#### 2. Porter's Five Forces Framework
Michael Porter identified five competitive forces that shape industry profitability:
1. **Threat of New Entrants**: Governed by capital requirements, economies of scale, and switching costs.
2. **Bargaining Power of Buyers**: Higher when buyers have alternative options or purchase in bulk.
3. **Bargaining Power of Suppliers**: Elevated when inputs are proprietary or switching suppliers is expensive.
4. **Threat of Substitutes**: External alternatives offering attractive price-to-performance ratios.
5. **Competitive Rivalry**: Intensity of direct competitors competing on price, marketing, and features.

#### 3. Defensible Economic Moats (Warren Buffett & Hamilton Helmer)
- **Network Effects**: Value scales quadratically with each additional user (Metcalfe's Law: $V \\propto N^2$), e.g., payment rails, social networks.
- **Switching Costs**: Prohibitive friction (data migration, workflow reconfiguration) preventing customers from leaving.
- **Cost Advantage**: Proprietary technology or operational scale enabling lower structural cost-per-unit.
- **Brand & Regulatory Barriers**: Government licenses, patents, or trusted reputation commanding pricing power.`
  },

  // =========================================================================
  // 17. PHILOSOPHY & ETHICS: STOICISM, DEONTOLOGY, UTILITARIANISM
  // =========================================================================
  {
    pattern: /\b(stoicism|marcus\s+aurelius|epictetus|seneca|utilitarianism|deontology|immanuel\s+kant|categorical\s+imperative|virtue\s+ethics|existentialism)\b/i,
    render: (q, tag) => `### 🏛️ Philosophy, Ethics & Moral Reason (${tag})

Philosophy provides structured methods for examining human purpose, epistemic truth, and ethical decision-making.

#### 1. Stoicism & The Dichotomy of Control
Founded in Athens by Zeno of Citium and elevated in Rome by **Epictetus**, **Seneca**, and **Marcus Aurelius**:
- **The Dichotomy of Control (*Enchiridion*)**:
  Things belong to one of two categories:
  1. *Things within our control*: Our thoughts, impulses, intentions, virtues, and responses.
  2. *Things outside our control*: External outcomes, other people's opinions, physical health, status, and the weather.
- **Wisdom (Ataraxia)**: Suffering arises not from external events, but from our internal interpretations of them:
  > *"You have power over your mind - not outside events. Realize this, and you will find strength."* — Marcus Aurelius, *Meditations*.
- **The Four Cardinal Virtues**: **Wisdom** (*Sophia*), **Courage** (*Andreia*), **Justice** (*Dikaiosyne*), and **Temperance/Discipline** (*Sophrosyne*).

#### 2. The Three Major Western Ethical Frameworks
| Framework | Core Proponent | Decision Rule | Focus |
| :--- | :--- | :--- | :--- |
| **Utilitarianism (Consequentialism)** | Jeremy Bentham, John Stuart Mill | Act to maximize net happiness/utility for the greatest number of sentient beings. | **Outcomes & Consequences** |
| **Deontological Ethics** | Immanuel Kant | Act only according to universal moral duties and rules, treating persons always as ends and never merely as means. | **Duties & Intentions** |
| **Virtue Ethics** | Aristotle (*Nicomachean Ethics*) | Cultivate moral character habits that embody excellence (*Arete*) along the Golden Mean. | **Character & Flourishing (*Eudaimonia*)** |

#### 3. Kant's Categorical Imperative
- **Universal Law Formulation**: *"Act only according to that maxim whereby you can at the same time will that it should become a universal law."*
- **Humanity Formulation**: *"Act in such a way that you treat humanity, whether in your own person or in the person of any other, never merely as a means to an end, but always at the same time as an end."*`
  },

  // =========================================================================
  // 18. HISTORY: MAJOR WORLD PIVOTS & THE INDUSTRIAL REVOLUTION
  // =========================================================================
  {
    pattern: /\b(industrial\s+revolution|world\s+war\s+1|world\s+war\s+2|wwi|wwii|renaissance|scientific\s+revolution|cold\s+war)\b/i,
    render: (q, tag) => `### 📜 World History: Turning Points & Civilizational Shifts (${tag})

Historical pivots illustrate how technological breakthroughs, institutional structures, and geopolitical incentives reshape human civilization.

#### 1. The Industrial Revolutions (1.0 to 4.0)
- **First Industrial Revolution (circa 1760–1840)**:
  - *Key Enablers*: Watt steam engine, mechanical looms, coal metallurgy, canal transport.
  - *Impact*: Shift from agrarian cottage economies to centralized urban factory production.
- **Second Industrial Revolution (circa 1870–1914)**:
  - *Key Enablers*: Bessemer steel process, electrical grids, internal combustion engines, assembly lines.
  - *Impact*: Mass production, telecommunications (telegraph/telephone), transcontinental railroads.
- **Third Industrial Revolution (circa 1960–2000)**:
  - *Key Enablers*: Silicon semiconductors, digital computers, automated manufacturing, the internet.
- **Fourth Industrial Revolution (Present)**:
  - *Key Enablers*: Artificial intelligence, ubiquitous cloud compute, genomics, autonomous systems.

#### 2. The Geopolitical Catalyst of the World Wars
- **World War I (1914–1918)**:
  - *Underlying Causes (M-A-I-N)*: **M**ilitarism, **A**lliance systems, **I**mperial competition, **N**ationalism; sparked by the assassination of Archduke Franz Ferdinand.
  - *Consequences*: Collapse of four imperial dynasties (Russian, German, Ottoman, Austro-Hungarian); Treaty of Versailles redrew European boundaries with unsustainable war reparations.
- **World War II (1939–1945)**:
  - *Consequences*: Defeat of Axis totalitarianism, establishment of the United Nations, Bretton Woods monetary system, and the division of global geopolitics into the **Cold War** bipolar rivalry between the US and USSR.`
  },

  // =========================================================================
  // 19. PSYCHOLOGY & COGNITION: SYSTEM 1 VS SYSTEM 2
  // =========================================================================
  {
    pattern: /\b(system\s+1|system\s+2|daniel\s+kahneman|thinking\s+fast\s+and\s+slow|cognitive\s+bias|confirmation\s+bias|anchoring\s+bias)\b/i,
    render: (q, tag) => `### 🧠 Cognitive Psychology: Dual-Process Theory & Biases (${tag})

Nobel laureate Daniel Kahneman and Amos Tversky (*Thinking, Fast and Slow*) demonstrated that human judgment is governed by two interacting modes of thought:

#### 1. System 1 vs. System 2
| Dimension | **System 1 (Fast Thinking)** | **System 2 (Slow Thinking)** |
| :--- | :--- | :--- |
| **Operation** | Automatic, instinctive, effortless | Deliberate, conscious, effortful |
| **Speed** | Milliseconds | Seconds to minutes |
| **Awareness** | Operates below conscious introspection | Full working-memory engagement |
| **Role** | Pattern recognition, threat detection, routine motor actions | Complex mathematical calculation, critical analysis, logical deduction |
| **Vulnerability** | Susceptible to heuristic traps and cognitive illusions | Easily fatigued (ego depletion); default state is cognitive ease |

#### 2. Key Cognitive Biases & Heuristics
1. **Confirmation Bias**: The tendency to seek, interpret, and remember evidence that confirms prior hypotheses while discounting disconfirming data.
   - *Mitigation*: Actively seek falsifying evidence (Karl Popper's falsificationism).
2. **Anchoring & Adjustment**: Fixating disproportionately on the first piece of information encountered (the "anchor") when making numerical estimates.
3. **Availability Heuristic**: Evaluating the probability of an event based on how easily recent or vivid examples come to mind rather than objective base rates.
4. **Loss Aversion (Prospect Theory)**: Losses hurt psychologically roughly **twice as much** as equivalent gains feel pleasurable ($U(-x) \\approx 2 \\times |U(x)|$).`
  },

  // =========================================================================
  // 20. COMMUNICATION & RHETORIC: PERSUASION & NEGOTIATION
  // =========================================================================
  {
    pattern: /\b(negotiation|batna|persuasion|rhetoric|ethos\s+pathos\s+logos|minto\s+pyramid|executive\s+communication)\b/i,
    render: (q, tag) => `### 🎙️ Strategic Communication, Rhetoric & Negotiation Principles (${tag})

Effective communication converts complex technical insights into clear, actionable understanding that drives consensus and decisions.

#### 1. The Classical Rhetorical Triangle (Aristotle)
- **Ethos (Authority & Character)**: Establishing credibility, integrity, and domain expertise. Why should the audience trust your diagnosis?
- **Pathos (Empathy & Emotion)**: Connecting with the listener's core motivations, concerns, and psychological perspective.
- **Logos (Logic & Empirical Proof)**: Concrete evidence, clear syllogisms, and rigorous, unassailable deductions.

#### 2. Principled Negotiation & The BATNA Framework (Harvard Negotiation Project)
From Fisher, Ury, and Patton (*Getting to Yes*):
1. **Separate the People from the Problem**: Address technical friction objectively without personal antagonism.
2. **Focus on Underlying Interests, Not Entrenched Positions**: Positions are what people say they want; interests are *why* they want it.
3. **Invent Options for Mutual Gain**: Expand the pie before dividing it (non-zero-sum negotiation).
4. **BATNA (Best Alternative to a Negotiated Agreement)**:
   - Your true negotiating leverage is not aggression; it is your **walkaway alternative**.
   - The stronger your BATNA, the higher your bargaining power. Never accept a deal that is worse than your BATNA.

#### 3. The Minto Pyramid Principle (Barbara Minto)
Used by premier management consultancies for executive communication:
- **Lead with the Answer First (BLUF - Bottom Line Up Front)**: State the core recommendation or conclusion in the first sentence.
- **Group Supporting Arguments Logically**: Organize supporting evidence into mutually exclusive, collectively exhaustive (MECE) categories.
- **Support with Granular Data**: Provide technical proof only after high-level conceptual agreement is established.`
  }
];
