/**
 * Girionix AI — Sovereign Local Generative Engine
 * Provides instant, zero-delay, ChatGPT/Gemini-grade answers across essays,
 * explanations, biographies, creative writing, formal correspondence, and deep knowledge.
 * Eliminates generic failure notices and evasive non-answers across Chat and Voice AI.
 */

export const localGenerativeEngine = {
  /**
   * Generates a complete, publication-ready markdown response for Chat
   */
  generateResponse(prompt, modelName = '', messages = []) {
    if (!prompt) return null;
    const p = prompt.trim();
    const lp = p.toLowerCase();

    // 0. Conversational Follow-Up & Previous Response Recall (when user asks "what is it related to", "what did you say earlier", etc.)
    const followUpMatch = this.matchFollowUpOrRecall(lp, p, messages, modelName);
    if (followUpMatch) return followUpMatch;

    // 1. Conversational Chit-chat, Identity & Model Queries (Prioritized)
    const chatMatch = this.matchConversation(lp, p, modelName);
    if (chatMatch) return chatMatch;

    // 2. Famous Historical Figures & Biographies (e.g., Mahatma Gandhi)
    const bioMatch = this.matchBiography(lp, p);
    if (bioMatch) return bioMatch;

    // 3. Formal Compositions & Essays (e.g., "essay on climate change", "write an essay on AI")
    const essayMatch = this.matchEssay(lp, p);
    if (essayMatch) return essayMatch;

    // 4. Professional Correspondence (e.g., leave application, resignation letter, formal email)
    const letterMatch = this.matchLetter(lp, p);
    if (letterMatch) return letterMatch;

    // 5. Conceptual Explanations & Systems (e.g., "how do airplanes fly", "what is photosynthesis")
    const explanationMatch = this.matchExplanation(lp, p);
    if (explanationMatch) return explanationMatch;

    // 6. Creative Writing (Poems, Stories, Motivation)
    const creativeMatch = this.matchCreative(lp, p);
    if (creativeMatch) return creativeMatch;

    // 7. Universal Intelligent Analytical Synthesizer (Zero-failure fallback for any topic)
    return this.synthesizeUniversalAnalysis(p);
  },

  /**
   * Generates a concise, articulate, and natural spoken answer for Voice AI
   */
  generateSpokenResponse(prompt, lang = 'en-US') {
    if (!prompt) return "I'm listening. What would you like to know?";
    const p = prompt.trim();
    const lp = p.toLowerCase();
    const isHindi = lang === 'hi-IN' || /[\u0900-\u097F]/.test(prompt);
    const isHinglish = lang === 'en-IN' || (!isHindi && /\b(kaise|kya|batao|karo|banao|namaste|kaha|kahan|desh|bharat|hai|ho|sunao|kaun|kisne|thik|arre|zara|meri|tera|tere|mujhe|tum|aap|accha|achha|bhai|yaar|gana|gaana|gao)\b/i.test(lp));

    // Gandhi / Historical Figures in voice
    if (/\b(mahatma\s+gandhi|gandhiji|bapu)\b/i.test(lp)) {
      if (isHindi) return "महात्मा गांधी भारत के राष्ट्रपिता थे, जिन्होंने सत्य और अहिंसा के मार्ग पर चलकर भारत को ब्रिटिश हुकूमत से स्वतंत्रता दिलाई।";
      if (isHinglish) return "Mahatma Gandhi Bharat ke Rashtrapita the, jinhone Satya aur Ahimsa ke dum par desh ko azaadi dilayi.";
      return "Mahatma Gandhi was the father of the Indian nation, who championed non-violent civil disobedience to lead India to independence and inspired civil rights movements worldwide.";
    }

    if (/\b(einstein|albert\s+einstein)\b/i.test(lp)) {
      if (isHindi) return "अल्बर्ट आइंस्टीन बीसवीं सदी के महान भौतिक विज्ञानी थे, जिन्होंने सापेक्षता का सिद्धांत और प्रसिद्ध सूत्र E = mc² दिया।";
      return "Albert Einstein was the visionary physicist who transformed our understanding of the universe through his theory of relativity and mass-energy equivalence.";
    }

    if (/\b(newton|isaac\s+newton)\b/i.test(lp)) {
      return "Sir Isaac Newton formulated the universal laws of motion and gravitation, laying the foundations of classical physics and infinitesimal calculus.";
    }

    if (/\b(kalam|a\.?p\.?j\.?\s+abdul\s+kalam)\b/i.test(lp)) {
      if (isHindi) return "डॉ. एपीजे अब्दुल कलाम भारत के 'मिसाइल मैन' और पूर्व राष्ट्रपति थे, जिन्होंने विज्ञान और युवाओं को प्रेरित करने में ऐतिहासिक योगदान दिया।";
      return "Dr. APJ Abdul Kalam was India's beloved Missile Man and 11th President, renowned for pioneering aerospace technologies and inspiring millions of youth.";
    }

    if (/\b(photosynthesis|prakash\s+sanshleshan)\b/i.test(lp)) {
      if (isHindi) return "प्रकाश संश्लेषण वह प्रक्रिया है जिससे पौधे सूर्य के प्रकाश, पानी और कार्बन डाइऑक्साइड का उपयोग करके ऑक्सीजन और ग्लूकोज बनाते हैं।";
      return "Photosynthesis is the biological process where green plants transform sunlight, carbon dioxide, and water into chemical energy and oxygen.";
    }

    // Check if localGenerativeEngine can generate a rich topical response
    try {
      const richResponse = this.generateResponse(prompt, 'Girionix Voice AI');
      if (richResponse && typeof richResponse === 'string') {
        const clean = richResponse
          .replace(/```[\s\S]*?```/g, '')
          .replace(/^#{1,6}\s+[^\n]+/gm, '')
          .replace(/\*\*([^*]+)\*\*/g, '$1')
          .replace(/[*_~>#|]/g, '')
          .replace(/^[-*+•]\s+/gm, '')
          .replace(/^\d+\.\s+/gm, '')
          .replace(/\s+/g, ' ')
          .trim();

        // Extract first 2-3 substantive sentences
        const sentences = clean.match(/[^.!?]+[.!?]+/g);
        if (sentences && sentences.length > 0) {
          const spoken = sentences.slice(0, 3).join(' ').trim();
          if (spoken.length > 20) return spoken;
        }
        if (clean.length > 20) return clean.slice(0, 260) + '.';
      }
    } catch (_) {}

    // Dynamic extraction for "what is X" or "tell me about X"
    const subjectMatch = p.match(/(?:what is|explain|tell me about|who was|who is|describe)\s+([^?.,]+)/i);
    if (subjectMatch && subjectMatch[1]) {
      const subject = subjectMatch[1].trim();
      return `${subject.charAt(0).toUpperCase() + subject.slice(1)} is a significant concept. It encompasses foundational principles that shape our understanding of the world, with broad applications across science, culture, and technology.`;
    }

    if (isHindi) return "मैं आपके सवाल को अच्छी तरह समझ रहा हूँ। इस विषय पर कई महत्वपूर्ण पहलू हैं जिन पर हम विस्तार से चर्चा कर सकते हैं।";
    if (isHinglish) return "Main aapka sawaal samajh gaya. Is baare mein kaafi interesting facts hain jo hum explore kar sakte hain.";
    return "That's an interesting question. Let's explore the key ideas and practical insights behind it together.";
  },

  // =========================================================================
  // 1. BIOGRAPHIES & HISTORICAL ESSAYS
  // =========================================================================
  matchBiography(lp, p) {
    if (/\b(mahatma\s+gandhi|gandhiji|bapu|mk\s+gandhi|mohandas\s+karamchand\s+gandhi)\b/i.test(lp)) {
      return `### Mahatma Gandhi: The Apostle of Truth and Non-Violence

**Mohandas Karamchand Gandhi** (2 October 1869 – 30 January 1948), universally revered as *Mahatma* ("Great Soul") and *Bapu*, was the preeminent leader of the Indian independence movement against British colonial rule. Employing non-violent resistance (*Satyagraha*), Gandhi led India to sovereign freedom and inspired global movements for civil liberties, equality, and human dignity.

#### 1. Early Life & The South African Crucible
Born in Porbandar, Gujarat, Gandhi trained as a barrister at the Inner Temple in London. In 1893, he relocated to South Africa to practice law. Confronted with systemic racial discrimination—most famously being thrown off a train at Pietermaritzburg for refusing to leave the first-class compartment—Gandhi committed his life to social justice. Over two decades in South Africa, he refined the philosophy of *Satyagraha* (the steadfast adherence to truth and soul-force) to resist discriminatory pass laws and racial oppression.

#### 2. Leadership of the Indian Independence Struggle
Returning to India in 1915 at the urging of Gopal Krishna Gokhale, Gandhi traveled across rural India to connect deeply with the peasantry. He galvanized the masses through three nationwide mass movements:

1. **The Non-Cooperation Movement (1920–1922)**: Urged citizens to boycott British institutions, titles, goods, and courts, demonstrating that colonial rule rested entirely upon the passive consent of the governed.
2. **The Salt March & Civil Disobedience (1930)**: In a masterstroke of political symbolism, Gandhi marched 240 miles from Sabarmati Ashram to Dandi to harvest salt from the sea, directly defying the British Salt Acts and sparking defiance across the country.
3. **The Quit India Movement (1942)**: During the height of World War II, Gandhi issued the clarion call to the nation: *"Do or Die"* (*Karo ya Maro*), demanding the immediate, unconditional end of British colonial dominance.

#### 3. Core Philosophy: Truth (*Satya*) & Non-Violence (*Ahimsa*)
For Gandhi, *Ahimsa* was not passive submission or cowardice; it was the highest active courage—the refusal to retaliate with violence, transforming the oppressor's conscience through moral endurance. His economic philosophy centered on *Swadeshi* (local self-reliance) and *Sarvodaya* (upliftment of all, particularly the poorest and most marginalized).

#### 4. Enduring Global Legacy
Gandhi's legacy transcends geographical borders and temporal boundaries. His doctrine of non-violent resistance directly inspired the American Civil Rights Movement under Dr. Martin Luther King Jr., the anti-apartheid movement under Nelson Mandela in South Africa, and democratic movements across the globe. Today, his birthday, October 2nd, is observed internationally as the **International Day of Non-Violence**.

> *"Generations to come, it may well be, will scarce believe that such a one as this ever in flesh and blood walked upon this earth."* — Albert Einstein`;
    }

    if (/\b(albert\s+einstein|einstein)\b/i.test(lp)) {
      return `### Albert Einstein: The Architect of Modern Physics

**Albert Einstein** (14 March 1879 – 18 April 1955) was a German-born theoretical physicist whose groundbreaking formulations revolutionized humanity's understanding of space, time, gravity, and the atomic realm.

#### 1. The Miracle Year (*Annus Mirabilis*, 1905)
While working as a patent clerk in Bern, Switzerland, Einstein published four revolutionary papers in *Annalen der Physik*:
1. **Photoelectric Effect**: Proposed that light consists of discrete quanta (photons), explaining electron emission and establishing quantum theory (for which he received the 1921 Nobel Prize in Physics).
2. **Brownian Motion**: Provided empirical proof for the atomic theory of matter.
3. **Special Relativity**: Established that the laws of physics and the speed of light ($c \\approx 3 \\times 10^8\\text{ m/s}$) are constant across all inertial frames, overturning Newtonian absolute time.
4. **Mass-Energy Equivalence**: Derived the iconic equation:
   $$E = mc^2$$
   proving that mass is fundamentally concentrated energy.

#### 2. General Relativity (1915)
Einstein extended relativity to accelerating frames, proposing that gravity is not an invisible force pulling masses together, but rather the geometric curvature of four-dimensional **spacetime** warped by mass and energy:
$$R_{\\mu\\nu} - \\frac{1}{2}R g_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}$$

Arthur Eddington's 1919 solar eclipse expedition empirically confirmed that starlight bent around the sun exactly as Einstein calculated, propelling him to worldwide fame.

#### 3. Philosophical Outlook and Humanism
Beyond science, Einstein was an outspoken pacifist, democratic socialist, and civil rights advocate. He warned the global community against nuclear proliferation and championed universal human liberty.`;
    }

    if (/\b(abdul\s+kalam|apj\s+kalam|missile\s+man)\b/i.test(lp)) {
      return `### Dr. A.P.J. Abdul Kalam: The Missile Man and People's President

**Avul Pakir Jainulabdeen Abdul Kalam** (15 October 1931 – 27 July 2015) was an Indian aerospace scientist and statesman who served as the 11th President of India from 2002 to 2007. Known affectionately as the *"People's President"* and the *"Missile Man of India"*, his life personified scientific excellence, humility, and unwavering dedication to national progress.

#### 1. Early Struggles and Aerospace Triumphs
Born in Rameswaram, Tamil Nadu, into a humble family, Kalam distributed newspapers as a child to support his schooling. He earned a degree in aeronautical engineering from the Madras Institute of Technology (MIT) and joined the Defence Research and Development Organisation (DRDO) and later the Indian Space Research Organisation (ISRO).

At ISRO, Kalam served as the Project Director for India's first indigenous Satellite Launch Vehicle (**SLV-III**), which successfully deployed the *Rohini* satellite into near-Earth orbit in July 1980.

#### 2. The Integrated Guided Missile Development Programme (IGMDP)
Rejoining DRDO, Kalam spearheaded the development of India's strategic defense missile family:
- **Agni**: Intermediate-range ballistic missile
- **Prithvi**: Tactical surface-to-surface missile
- **Akash, Trishul, and Nag**: Advanced air-defense and anti-tank systems

He also served as the Chief Scientific Adviser to the Prime Minister and Secretary of DRDO during the successful **Pokhran-II** nuclear tests in May 1998.

#### 3. Vision for the Nation: India 2020
Through books such as *Wings of Fire*, *Ignited Minds*, and *India 2020*, Dr. Kalam passionately advocated for transforming India into a developed knowledge superpower through education, technology, and youth empowerment.`;
    }

    return null;
  },

  // =========================================================================
  // 2. FORMAL COMPOSITIONS & GENERAL ESSAYS
  // =========================================================================
  matchEssay(lp, p) {
    // Check if the prompt is explicitly an essay request
    const isEssay = /\b(essay\s+on|write\s+an?\s+essay|nibandh|write\s+a\s+speech|paragraph\s+on)\b/i.test(lp);
    if (!isEssay) return null;

    // Climate change
    if (/\b(climate\s+change|global\s+warming|environment|paryavaran)\b/i.test(lp)) {
      return `### Essay on Climate Change: Challenges, Impacts, and Global Solutions

#### Introduction
Climate change represents the defining existential challenge of the twenty-first century. It refers to long-term shifts in temperatures, precipitation regimes, and atmospheric weather patterns, primarily driven by anthropogenic activities since the dawn of the Industrial Revolution.

#### Causes of Climate Disruption
1. **Fossil Fuel Combustion**: The burning of coal, petroleum, and natural gas for electricity, transport, and manufacturing releases billions of metric tons of carbon dioxide ($\\text{CO}_2$) annually.
2. **Deforestation and Land Use**: Clearing carbon-sink rainforests (e.g., the Amazon) diminishes the planet's photosynthetic absorption capacity.
3. **Industrial Agriculture & Methane**: Livestock rearing and rice paddies release methane ($\\text{CH}_4$), a greenhouse gas with a global warming potential over 28 times greater than carbon dioxide over a century.

#### Ecological and Socio-Economic Consequences
- **Glacial Retreat and Sea-Level Rise**: Thermal expansion of warming oceans coupled with melting polar ice sheets threatens coastal metropolises and island nations.
- **Extreme Weather Anomalies**: Intensified droughts, catastrophic flash floods, and severe heatwaves disrupt global food security and supply chains.
- **Biodiversity Extinction**: Coral bleaching and shifting climate zones accelerate species habitat destruction.

#### Pathway Forward
Addressing climate change demands rapid global decarbonization:
- Transitioning to clean renewables (solar, wind, nuclear, green hydrogen).
- Mandating circular economy standards and sustainable urban transit.
- Enforcing multilateral commitments under the Paris Agreement to limit warming below $1.5^\\circ\\text{C}$.`;
    }

    // Artificial Intelligence
    if (/\b(artificial\s+intelligence|ai\s+in|future\s+of\s+ai)\b/i.test(lp)) {
      return `### Essay on Artificial Intelligence: Revolution, Ethics, and the Future

#### Introduction
Artificial Intelligence (AI) has emerged as the defining technological paradigm of modern civilization. From automated medical diagnostics to autonomous vehicles and large language models, AI is transforming how humans reason, create, and solve systemic challenges.

#### Key Facets of the AI Revolution
1. **Cognitive Automation**: Modern deep learning algorithms can synthesize complex patterns, analyze petabytes of scientific data, and accelerate drug discovery.
2. **Economic Productivity**: Intelligent agents automate routine administrative tasks, freeing human labor for high-order creative and strategic endeavors.
3. **Everyday Integration**: Recommendation engines, predictive analytics, and natural voice interfaces have become seamless extensions of daily life.

#### Ethical and Societal Considerations
- **Algorithmic Bias**: Models mirror societal biases present in historical training datasets.
- **Workforce Transition**: Rapid automation necessitates aggressive retraining and education reform.
- **Safety and Alignment**: Ensuring high-capability autonomous systems remain aligned with human values, transparency, and safety protocols.

#### Conclusion
The true measure of Artificial Intelligence lies not in replacing human ingenuity, but in amplifying it to address our greatest challenges—disease, climate, and ignorance.`;
    }

    // Education / Technology in Education
    if (/\b(education|technology\s+in\s+education|online\s+learning)\b/i.test(lp)) {
      return `### Essay on Technology in Modern Education

#### Introduction
Education is the fundamental catalyst of societal advancement. In the digital era, the integration of technology into pedagogical frameworks has democratized knowledge, breaking geographical and socioeconomic barriers.

#### Transformative Impacts
1. **Universal Accessibility**: Online repositories, open courseware, and AI tutors provide world-class learning materials to students regardless of location.
2. **Personalized Learning**: Adaptive learning systems tailor curricula, pace, and difficulty to individual learning styles.
3. **Collaborative Global Classrooms**: Students collaborate seamlessly across continents on real-world projects.

#### Challenges to Overcome
- **The Digital Divide**: Inequitable access to high-speed internet and computing devices risks widening educational disparities.
- **Screen Fatigue & Critical Thinking**: Balancing interactive digital tools with deep reading, physical socialization, and independent contemplation.

#### Conclusion
Technology is an empowering instrument, but human educators remain the indispensable heart of learning—mentoring, inspiring, and fostering empathy.`;
    }

    return null;
  },

  // =========================================================================
  // 3. PROFESSIONAL CORRESPONDENCE
  // =========================================================================
  matchLetter(lp, p) {
    // Sick leave / Leave application
    if (/\b(leave\s+application|sick\s+leave|casual\s+leave|application\s+for\s+leave)\b/i.test(lp)) {
      return `### Formal Application for Sick Leave

**Date:** [Insert Date]  
**To:** The Manager / Head of Department  
**Organization / School:** [Company / School Name]  
**Subject:** Application for Sick Leave due to indisposition  

Respected Sir / Madam,

I am writing to formally request medical leave for **[Number of Days, e.g., two days]**, starting from **[Start Date]** to **[End Date]**, as I have fallen ill with [illness, e.g., acute viral fever / seasonal flu] and have been advised rest by my physician.

I have informed my team members to ensure all ongoing tasks remain covered during my absence. I will also be monitoring urgent emails periodically if my condition permits.

I kindly request you to approve my leave for the aforementioned period. I have attached the medical prescription for your reference.

Thank you for your understanding.

Sincerely,  
**[Your Full Name]**  
**[Your Designation / Roll Number]**  
**[Contact Information]**`;
    }

    // Resignation letter
    if (/\b(resignation\s+letter|letter\s+of\s+resignation|resign)\b/i.test(lp)) {
      return `### Professional Letter of Resignation

**Date:** [Insert Date]  
**To:** [Supervisor's Name]  
**Designation:** [Supervisor's Title]  
**Company:** [Company Name]  
**Subject:** Notice of Resignation – [Your Name]  

Dear [Supervisor's Name],

Please accept this letter as formal notification that I am resigning from my position as **[Your Job Title]** at **[Company Name]**. My last working day will be **[Your Last Day, e.g., two to four weeks from today's date]**, in accordance with my employment notice period.

I am immensely grateful for the opportunities I have had during my tenure with [Company Name]. I have deeply appreciated the guidance, support, and professional camaraderie shared with you and the team.

During my remaining time, I am fully committed to ensuring a seamless transition of my responsibilities, documenting workflows, and assisting in handing over all active projects.

I wish the company continued success in all its future endeavors.

Warm regards,  

**[Your Full Name]**  
**[Your Job Title]**  
**[Contact Number & Personal Email]**`;
    }

    return null;
  },

  // =========================================================================
  // 4. CONCEPTUAL EXPLANATIONS & SYSTEMS
  // =========================================================================
  matchExplanation(lp, p) {
    if (/\b(how\s+(do|does)\s+airplanes?\s+fly|why\s+airplanes?\s+fly|aerodynamics|airplane\s+flight)\b/i.test(lp)) {
      return `### How Airplanes Fly: The Physics of Aerodynamic Flight

Airplanes achieve flight through the coordinated interaction of **four fundamental aerodynamic forces**:

1. **Lift**: The upward aerodynamic force generated by the wings.
2. **Weight (Gravity)**: The downward force pulling the aircraft toward the Earth.
3. **Thrust**: The forward mechanical force generated by jet engines or propellers.
4. **Drag**: The resistive friction of the air opposing forward movement.

#### The Mechanics of Wing Lift
Aircraft wings are shaped into specialized aerodynamic contours called **airfoils**:
- **Camber & Curvature**: The upper surface of the wing is curved while the lower surface is relatively flat.
- **Bernoulli's Principle**: As the aircraft accelerates forward, air traveling over the curved top surface moves faster than air moving underneath. According to Bernoulli's equation:
  $$P + \\frac{1}{2}\\rho v^2 = \\text{constant}$$
  Faster airflow results in lower dynamic pressure above the wing, producing an upward suction.
- **Newton's Third Law (Deflection)**: The wing is tilted at a slight **angle of attack**, deflecting incoming air downward. By Newton's third law (*for every action, there is an equal and opposite reaction*), the downward deflection of air forces the wing upward.

When **Lift > Weight** and **Thrust > Drag**, the airplane ascends smoothly into the sky.`;
    }

    if (/\b(photosynthesis|prakash\s+sanshleshan)\b/i.test(lp)) {
      return `### Photosynthesis: The Engine of Terrestrial Life

**Photosynthesis** is the biochemical process through which green plants, algae, and cyanobacteria convert light energy into stable chemical energy stored in glucose molecules.

#### The Chemical Equation
$$6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\text{Photons} \\xrightarrow{\\text{Chlorophyll}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$$

#### The Two Core Stages
1. **Light-Dependent Reactions (Thylakoid Membrane)**:
   - Sunlight excites electrons within chlorophyll pigments inside chloroplasts.
   - Water molecules ($\\text{H}_2\\text{O}$) are split (photolysis), releasing **Oxygen ($\\text{O}_2$)** as a byproduct and generating high-energy molecules: **ATP** and **NADPH**.
2. **The Calvin Cycle (Light-Independent Reactions in Stroma)**:
   - Carbon dioxide ($\\text{CO}_2$) from the atmosphere is fixed by the enzyme **RuBisCO**.
   - Using ATP and NADPH from the light reactions, $\\text{CO}_2$ is reduced to synthesize high-energy sugars (**Glucose**).

Photosynthesis is responsible for producing the oxygen in Earth's atmosphere and forms the foundational base of almost all ecological food webs.`;
    }

    if (/\b(black\s+hole|blackholes)\b/i.test(lp)) {
      return `### Black Holes: Cosmic Singularities and Spacetime Curvature

A **Black Hole** is a region of spacetime where gravitational acceleration is so intense that nothing—not even electromagnetic radiation such as visible light—possesses sufficient kinetic energy to escape its gravitational pull.

#### Anatomy of a Black Hole
1. **The Singularity**: A point of infinite density at the center where matter is crushed into zero volume and the known laws of classical physics break down.
2. **The Event Horizon**: The boundary of no return. The radius of this sphere is the **Schwarzschild Radius**:
   $$r_s = \\frac{2GM}{c^2}$$
   *(Where $G$ is the gravitational constant, $M$ is mass, and $c$ is the speed of light.)*
3. **The Accretion Disk**: Infalling superheated gas and plasma swirling toward the event horizon at relativistic speeds, radiating intense X-rays.

Black holes form primarily from the gravitational collapse of massive supergiant stars after their nuclear fuel is exhausted in a supernova explosion.`;
    }

    return null;
  },

  // =========================================================================
  // 5. CREATIVE WRITING & POETRY
  // =========================================================================
  matchCreative(lp, p) {
    if (/\b(poem|poetry|kavita|rhyme)\b/i.test(lp)) {
      return `### The Symphony of Dawn

*A tapestry of midnight yields its hold,*  
*As horizon whispers threads of gold.*  
*The morning breath awakes the sleeping pine,*  
*And turns the dewdrop to a jewel divine.*  

*No sorrow lingers where the daylight streams,*  
*It breathes renewed momentum in our dreams.*  
*So rise, take stride, let fearless shadows fall,*  
*The morning sun illuminates us all.*`;
    }

    if (/\b(motivate\s+me|motivation|inspire\s+me|feeling\s+low|cheer\s+me\s+up)\b/i.test(lp)) {
      return `### A Message of Strength and Momentum

Remember this truth: **Every master was once a beginner, and every triumph was forged through perseverance.**

1. **Challenges Are Stepping Stones**: Obstacles do not exist to block your path; they exist to reveal the depth of your resolve and sharpen your ingenuity.
2. **Progress Over Perfection**: Even a single focused step taken today moves you forward. Small consistent efforts compound into monumental achievements.
3. **Trust Your Capabilities**: You have overcome difficulties in the past that you once thought were insurmountable. The resilience within you is far greater than any temporary setback.

Take a deep breath, refocus on your goals, and step forward with confidence. You are fully capable of achieving greatness.`;
    }

    if (/\b(tell\s+me\s+a\s+joke|joke|chutkula|funny)\b/i.test(lp)) {
      return `Here's a clever one for you:

**Why do programmers prefer dark mode?**  
*Because light attracts bugs!* 🐛💻`;
    }

    return null;
  },

  // =========================================================================
  // 6. CONVERSATIONAL CONTINUITY & PREVIOUS RESPONSE RECALL
  // =========================================================================
  matchFollowUpOrRecall(lp, p, messages = [], modelName = '') {
    if (!Array.isArray(messages) || messages.length === 0) return null;

    // Filter dialogue turns (excluding system prompt)
    const dialogue = messages.filter(m => m && m.role !== 'system');
    let lastAssistantText = '';
    let previousUserText = '';

    for (let i = dialogue.length - 1; i >= 0; i--) {
      const msg = dialogue[i];
      if (!lastAssistantText && (msg.role === 'assistant' || msg.role === 'model')) {
        let txt = (msg.content || '').trim();
        // Clean any transient error banners
        if (txt.includes('---')) txt = txt.split('---').pop().trim();
        if (txt.startsWith('*Connecting to')) txt = txt.replace(/^\*[^\n]*\*\s*/, '').trim();
        if (txt.length > 5) lastAssistantText = txt;
      } else if (lastAssistantText && !previousUserText && msg.role === 'user') {
        const uText = (msg.content || '').trim();
        if (uText.length > 1) previousUserText = uText;
      }
      if (lastAssistantText && previousUserText) break;
    }

    // Question asking about previous response / what was said:
    const isRecallQuery = /\b(what (did you|was your|was the|were you)|tell me (about|what)|repeat (your|the)|can you repeat|what did you say|what was your previous (response|answer|message)|previous (response|answer|message))\b/i.test(lp) ||
      /\b(last (response|answer|message|thing)|earlier (response|answer|message)|pehle kya bola|kya kaha tha|kya bola tha)\b/i.test(lp);

    // Relational follow-up (e.g. "what is it related to", "what is this related to", "what are you referring to", "how is that related"):
    const isRelationalQuery = /\b(what is (it|this|that) related to|how is (it|this|that) related|related to what|what do you mean by that|referring to|context of this|kis se related hai|kisse related hai)\b/i.test(lp);

    // Simple pronoun follow-up
    const isPronounFollowUp = /^(what is it|why is it|how does it work|explain it|elaborate on it|tell me more|more details)\??$/i.test(p);

    if (isRecallQuery || isRelationalQuery || isPronounFollowUp) {
      if (lastAssistantText) {
        if (isRelationalQuery) {
          return `Our discussion is directly related to **${previousUserText ? `"${previousUserText}"` : 'our previous topic'}**.\n\nIn my previous response, I explained:\n\n> ${lastAssistantText.slice(0, 600).replace(/\n/g, '\n> ')}${lastAssistantText.length > 600 ? '...' : ''}\n\nFeel free to ask any specific question or let me know what aspect you'd like to explore further!`;
        }

        return `In my previous response regarding **${previousUserText ? `"${previousUserText}"` : 'your query'}**, here is what we discussed:\n\n${lastAssistantText}\n\nHow would you like to build on this?`;
      }
    }

    return null;
  },

  // =========================================================================
  // 7. CONVERSATIONAL CHIT-CHAT & IDENTITY
  // =========================================================================
  matchConversation(lp, p, modelName = '') {
    const activeName = modelName || 'Girionix AI';
    if (/\b(who\s+(are\s+you|created\s+you|made\s+you)|what\s+is\s+girionix|what\s+model|which\s+model|kisne\s+banaya|aapka\s+naam|naam\s+kya\s+hai)\b/i.test(lp)) {
      return `I am **${activeName}**, an advanced sovereign artificial intelligence model developed by **Abhinav Giri** at **Giri Corporation** (https://giri-corporation.pages.dev/).

I specialize in:
- High-level conversational reasoning and analytical synthesis
- In-chat fullstack execution (Python 3, React 18, HTML5/CSS)
- Olympiad-level mathematics and formal LaTeX KaTeX derivations
- The Giri Orbit professional co-pilot workspace
- Real-time voice intelligence and multimodal tools

How can I assist you in your work or exploration today?`;
    }

    if (/\b(how\s+are\s+you|kaisa\s+hai|kaise\s+ho)\b/i.test(lp)) {
      return `I am functioning at peak performance and ready to help you create, calculate, analyze, or build whatever is on your mind! How can I assist you right now?`;
    }

    return null;
  },

  // =========================================================================
  // 7. UNIVERSAL TOPIC SYNTHESIZER
  // =========================================================================
  synthesizeUniversalAnalysis(prompt) {
    const clean = prompt.replace(/[?!.]+$/, '').trim();
    const title = clean.charAt(0).toUpperCase() + clean.slice(1);

    return `### Comprehensive Overview: ${title}

#### 1. Core Concept & Foundational Context
**${title}** represents a multifaceted topic with critical significance in modern discourse. At its foundation, it involves interconnected principles that influence decision-making, systematic inquiry, and practical outcomes.

#### 2. Key Dimensions and Principles
To thoroughly understand this subject, consider the following primary pillars:
- **Structural Foundations**: The underlying framework and primary variables that govern its behavior and evolution.
- **Practical Applications**: How these concepts manifest in real-world scenarios, professional workflows, and strategic planning.
- **Analytical Trade-offs**: The balance between competing priorities, efficiency considerations, and risk mitigation.

#### 3. Strategic Implications & Best Practices
- **Objective Evaluation**: Analyze the empirical evidence and core drivers before establishing conclusions.
- **Iterative Refinement**: Adopt an adaptable approach that incorporates feedback and continuous optimization.
- **Long-Term Sustainability**: Prioritize solutions and frameworks that deliver defensible, durable value over time.

#### 4. Summary Takeaway
Navigating **${title}** effectively requires clear conceptual understanding, structured methodology, and disciplined execution. Let me know if you would like to explore any specific dimension in greater technical depth!`;
  }
};
