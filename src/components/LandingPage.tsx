import React, { useState } from "react";
import { ArrowRight, Sparkles, Brain, Award, Users, ShieldCheck, Zap, Layers, Cpu, Compass, Star, Database, ArrowUpRight, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

interface LandingPageProps {
  t: any;
  onGetStarted: () => void;
  lang: string;
}

export default function LandingPage({ t, onGetStarted, lang }: LandingPageProps) {
  // Simple hover state trackers for the three custom staircase cards (representing the uploaded images)
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <div className="transition-colors duration-200 text-slate-900 dark:text-white bg-[#F8FAFC] dark:bg-[#0F172A]">
      {/* 1. Hero Section (Two Columns - First Design Layout) */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & Primary Actions */}
          <div className="lg:col-span-7 space-y-8 text-left">
            {/* Sparkles pill */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/45 text-[#2563EB] text-xs font-bold tracking-wider uppercase border border-blue-100/60 dark:border-blue-900/40"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>{lang === "fr" ? "INTELLIGENCE ARTICIELLE & TRANSITION" : "ARTIFICIAL INTELLIGENCE & CAREERS"}</span>
            </motion.div>

            {/* Master Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight font-display"
            >
              Vos compétences. <br />
              <span className="text-[#2563EB]">Votre avenir.</span> <br />
              Propulsés par l'IA.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed font-sans"
            >
              {t.heroSubtitle}
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4"
            >
              <button
                id="hero-btn-primary"
                type="button"
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg shadow-md hover:shadow-lg shadow-blue-100 dark:shadow-none transition-all duration-150 flex items-center justify-center space-x-2 group cursor-pointer font-sans"
              >
                <span>{lang === "fr" ? "Commencer" : "Get Started"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                id="hero-btn-secondary"
                type="button"
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-4 text-base font-semibold border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all cursor-pointer font-sans"
              >
                {lang === "fr" ? "Voir la démo" : "View demo"}
              </button>
            </motion.div>
          </div>

          {/* Right Column: Simulated Dashboard Mockup Card */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="w-full max-w-sm bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between aspect-[4/5]"
            >
              {/* Card top border line glow */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
              
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="text-[10px] font-mono tracking-widest text-[#2563EB] bg-blue-500/10 px-2 py-0.5 rounded uppercase font-bold">
                  SKILLON COGNITIVE METRICS
                </div>
              </div>

              {/* Talent Score Block */}
              <div className="space-y-4">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  {lang === "fr" ? "SCORE DE TALENT REQUIS" : "TALENT PROGRESSION LEVEL"}
                </span>

                <div className="flex items-baseline space-x-1">
                  <span className="text-5xl font-black font-display text-slate-900 dark:text-white">92</span>
                  <span className="text-lg font-bold text-slate-400 font-sans">/100</span>
                </div>

                {/* Stars scoring */}
                <div className="flex items-center space-x-1 text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
              </div>

              {/* Skills lists block */}
              <div className="mt-6 space-y-3">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                  TOP SKILLS
                </span>
                
                <div className="space-y-2">
                  {[
                    { name: "React / Frontend architectures", val: "94%" },
                    { name: "Leadership & Strategy", val: "88%" },
                    { name: "Firebase / Multi-agent Cloud Systems", val: "91%" }
                  ].map((sk, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <div className="flex items-center space-x-2 text-slate-705 dark:text-slate-300 font-sans font-medium">
                        <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
                        <span>{sk.name}</span>
                      </div>
                      <span className="font-mono font-bold text-[#2563EB] bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded">
                        {sk.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating micro indicators */}
              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>⚡ VERIFIED BY GEMINI 1.5</span>
                <span className="text-[#2563EB] font-bold">RANK: SENIOR SPECIALIST</span>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 2. Visual Metaphor Pathway Section (Inspired exactly by User's 3 Staircase/Climbing Images) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-100 dark:border-slate-800">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
            {lang === "fr" ? "L'Ascension de Votre Potentiel" : "Your Journey to the Top"}
          </h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400 text-base leading-relaxed font-sans">
            {lang === "fr" 
              ? "Trois étapes clefs modélisées à partir de notre méthodologie d'apprentissage continu et d'alignement stratégique des compétences."
              : "Three key evolutionary phases modeled by our competency mapping and predictive AI-powered growth systems."}
          </p>
        </div>

        {/* 3 Columns replicating the 3 images provided by the user */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Card 1: Represents first image (Hand sketching climb path showing candidate ascension) */}
          <div
            id="img-staircase-card-1"
            className="group relative p-8 bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden"
            onMouseEnter={() => setHoveredStep(1)}
            onMouseLeave={() => setHoveredStep(null)}
          >
            <div>
              {/* Premium Vector Representation of Image 1 */}
              <div className="w-full h-44 bg-[#F8FAFC] dark:bg-slate-900/40 rounded-xl relative border border-slate-100/60 dark:border-slate-800 flex items-center justify-center p-4 overflow-hidden mb-6">
                
                {/* Hand-drawing pencil outline path styling */}
                <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                  <path
                    d="M 50,130 L 110,105 L 170,80 L 230,55"
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="2.5"
                    className="stroke-blue-500"
                  />
                  {/* Dashed background graph grid */}
                  <line x1="110" y1="20" x2="110" y2="150" stroke="currentColor" strokeOpacity="0.05" strokeDasharray="3,3" />
                  <line x1="170" y1="20" x2="170" y2="150" stroke="currentColor" strokeOpacity="0.05" strokeDasharray="3,3" />
                  <line x1="230" y1="20" x2="230" y2="150" stroke="currentColor" strokeOpacity="0.05" strokeDasharray="3,3" />
                </svg>

                {/* Drawn steps */}
                <div className="absolute bottom-6 left-6 flex items-end space-x-1">
                  <div className="w-12 h-6 border-t-2 border-r-2 border-blue-500 bg-blue-500/10 rounded-sm" />
                  <div className="w-12 h-12 border-t-2 border-r-2 border-blue-500 bg-blue-500/10 rounded-sm" />
                  <div className="w-12 h-20 border-t-2 border-r-2 border-blue-500 bg-blue-500/10 rounded-sm relative">
                    <motion.div 
                      animate={hoveredStep === 1 ? { y: [0, -3, 0] } : {}}
                      className="absolute -top-1.5 -right-1 w-3 h-3 rounded-full bg-blue-500"
                    />
                  </div>
                </div>

                {/* Hand drawing indicator */}
                <motion.div
                  animate={hoveredStep === 1 ? { x: [0, 15, -10, 0], y: [0, -8, 5, 0] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-1/3 right-1/4 transform translate-x-3 -translate-y-4 z-10 text-blue-500 flex flex-col items-center bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-blue-200 dark:border-blue-900 shadow-md"
                >
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#2563EB] mb-0.5">GUIDE</span>
                  <svg className="w-5 h-5 fill-current text-blue-500" viewBox="0 0 24 24">
                    <path d="M14.06,9l.94,.94L5.92,19H5v-.92L14.06,9M17.66,3c-.25,0-.51,.1-.7,.29l-1.83,1.83,3.75,3.75,1.83-1.83c.39-.39,.39-1.02,0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29m-3.6,5.13L3,17.25V21H6.75L18.06,9.69,14.06,8.13Z"/>
                  </svg>
                </motion.div>
              </div>

              {/* Title & Description of Stage 1 */}
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xs font-mono font-bold text-blue-500 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded">01</span>
                <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white font-display">
                  {lang === "fr" ? "Cartographie & Tracé" : "Visual Skill Assessment"}
                </h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans font-normal">
                {lang === "fr"
                  ? "L'IA analyse vos certifications et expériences pour générer un schéma clair de vos forces et tracer vos paliers d'évolution."
                  : "AI scans your portfolio, files and credentials to draw an active roadmap representing your baseline and custom-made steps."}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-800/60 text-xs font-mono text-slate-450 font-medium">
              {lang === "fr" ? "Mémoire cognitive de départ" : "Initial cognitive footprint assessment"}
            </div>
          </div>

          {/* Card 2: Represents second image (Wooden blocks spelling S-K-I-L-L-S scale up to Target) */}
          <div
            id="img-staircase-card-2"
            className="group relative p-8 bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden"
            onMouseEnter={() => setHoveredStep(2)}
            onMouseLeave={() => setHoveredStep(null)}
          >
            <div>
              {/* Premium Vector Representation of Image 2 */}
              <div className="w-full h-44 bg-[#F8FAFC] dark:bg-slate-900/40 rounded-xl relative border border-slate-100/60 dark:border-slate-800 flex items-center justify-center p-4 overflow-hidden mb-6">
                
                {/* Red Target bullseye centered */}
                <div className="absolute top-4 right-4 flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full border-4 border-red-500 bg-red-50 dark:bg-red-950/20 flex items-center justify-center shadow">
                    <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                  </div>
                </div>

                {/* S K I L L S ascending wooden architectural Blocks layout */}
                <div className="absolute bottom-4 left-4 flex items-end space-x-1">
                  {["S", "K", "I", "L", "L", "S"].map((letter, idx) => {
                    const heightClass = [
                      "h-8",
                      "h-12",
                      "h-16",
                      "h-20",
                      "h-24",
                      "h-28"
                    ][idx];

                    return (
                      <motion.div
                        key={idx}
                        animate={hoveredStep === 2 ? { y: [0, -2, 0] } : {}}
                        transition={{ delay: idx * 0.05 }}
                        className={`w-8 ${heightClass} bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-md flex flex-col justify-between p-1 text-center shadow-sm relative`}
                      >
                        <span className="text-[7px] font-mono text-slate-400">0{idx+1}</span>
                        <span className="text-xs font-black font-display text-slate-800 dark:text-slate-100">{letter}</span>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Micro Runner figure approaching target */}
                <motion.div
                  animate={hoveredStep === 2 ? { x: [0, 8, -5, 0], y: [0, -3, 2, 0] } : {}}
                  className="absolute bottom-[28%] right-[22%] text-xs"
                >
                  🏃
                </motion.div>
              </div>

              {/* Title & Description of Stage 2 */}
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xs font-mono font-bold text-blue-500 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded">02</span>
                <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white font-display">
                  {lang === "fr" ? "Ascension de Compétences" : "The Core Competency Climb"}
                </h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans font-normal">
                {lang === "fr"
                  ? "Chaque module acquis, chaque défi résolu s'empile pour bâtir un score de talent et vous élever vers vos objectifs."
                  : "Every challenge solved and validation completed piles up like wooden blocks, elevating your Talent Score toward custom careers."}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-800/60 text-xs font-mono text-slate-450 font-medium">
              {lang === "fr" ? "Score de talent : 0 ➔ 100" : "Talent Progression: 0 ➔ 100 PTS Max"}
            </div>
          </div>

          {/* Card 3: Represents third image (AI Assistant placing the bridging block for climber) */}
          <div
            id="img-staircase-card-3"
            className="group relative p-8 bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden"
            onMouseEnter={() => setHoveredStep(3)}
            onMouseLeave={() => setHoveredStep(null)}
          >
            <div>
              {/* Premium Vector Representation of Image 3 */}
              <div className="w-full h-44 bg-[#F8FAFC] dark:bg-slate-900/40 rounded-xl relative border border-slate-100/60 dark:border-slate-800 flex items-center justify-center p-4 overflow-hidden mb-6">
                
                {/* Stair steps featuring a gap */}
                <div className="absolute bottom-6 left-6 flex items-end space-x-1.5">
                  <div className="w-9 h-6 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="w-9 h-12 bg-slate-200 dark:bg-slate-800 rounded" />
                  
                  {/* Empty missing gap representation */}
                  <div className="w-9 h-16 border-2 border-dashed border-blue-400/40 bg-blue-500/5 rounded flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
                  </div>

                  <div className="w-9 h-22 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="w-9 h-28 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>

                {/* Hand/AI block descending into place */}
                <motion.div
                  animate={hoveredStep === 3 ? { y: [0, 8, 0] } : { y: [-6, 0, -6] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-6 left-[105px] w-9 h-16 bg-blue-500 text-white rounded flex flex-col justify-between p-1.5 shadow-lg shadow-blue-400 dark:shadow-none z-10 border border-blue-600"
                >
                  <span className="text-[7px] font-mono text-blue-200 uppercase tracking-widest text-center">AI BLOCK</span>
                  <div className="w-full text-center text-xs">🧩</div>
                </motion.div>

                {/* Climber at the bottom of the gap waiting */}
                <div className="absolute bottom-[36px] left-[78px] text-sm">
                  👤
                </div>

                {/* Floating help guide text */}
                <div className="absolute top-4 right-4 bg-[#2563EB]/10 border border-blue-105 dark:border-blue-900/40 text-[#2563EB] text-[9.5px] font-bold py-1 px-2.5 rounded-full font-mono uppercase">
                  {lang === "fr" ? "Soutien IA actif" : "AI coaching bypass"}
                </div>
              </div>

              {/* Title & Description of Stage 3 */}
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xs font-mono font-bold text-blue-500 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded">03</span>
                <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white font-display">
                  {lang === "fr" ? "Résolution & Tremplin" : "AI Custom Bridging"}
                </h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans font-normal">
                {lang === "fr"
                  ? "L'IA identifie instantanément vos manques de compétences clés et y insère la brique d'acquisition idéale."
                  : "AI actively detects critical skill gaps on your climbing staircase and drops in the ideal project recommendation structure to lift you."}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-800/60 text-xs font-mono text-slate-450 font-medium font-sans">
              {lang === "fr" ? "Apprentissage sur-mesure résilient" : "Resilient custom gap bypass mechanics"}
            </div>
          </div>

        </div>
      </section>

      {/* 3. Comment ça marche Section (3 Horizontal Cards in Column grid matching wireframe) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-100 dark:border-slate-800 bg-gray-50/30 dark:bg-transparent">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
            {t.howItWorksTitle}
          </h2>
          <p className="mt-4 text-base text-slate-500 dark:text-slate-400 leading-relaxed font-sans font-normal">
            {t.howItWorksSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[
            { 
              num: "1. Importez", 
              items: lang === "fr" ? ["CV", "GitHub / Portfolio", "Certificats"] : ["Resume File", "GitHub / Portfolio", "Certifications"],
              desc: lang === "fr" ? "Téléversez vos documents ou copiez simplement votre parcours." : "Provide your experiences, files, links or simple plain-text bios." 
            },
            { 
              num: "2. Analyse IA", 
              items: lang === "fr" ? ["Analyse Gemini 1.5", "Sémantique croisée", "Détection angles morts"] : ["Gemini 1.5 parsing", "Cognitive alignment", "Strategic feedback"],
              desc: lang === "fr" ? "Le moteur IA croise vos acquis et génère vos indices de compétences." : "AI processes information in seconds to reveal your core baseline metrics." 
            },
            { 
              num: "3. Développez", 
              items: lang === "fr" ? ["Roadmap personnalisée", "Défis Duolingo", "Dialogues IA 24/7"] : ["Tailored learning roadmap", "Duolingo challenges", "Interactive AI support"],
              desc: lang === "fr" ? "Exécutez votre feuille de route et progressez vers les métiers cibles." : "Gain level-up points, undertake challenges and master upcoming key modules." 
            },
          ].map((step, idx) => (
            <div key={idx} className="bg-white dark:bg-[#1E293B] p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-blue-500/20 transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-[#2563EB] font-display">{step.num}</span>
                  <span className="text-xs font-mono font-medium text-slate-450">Step 0{idx+1}</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-sans leading-relaxed">{step.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-800/60 flex flex-wrap gap-1.5">
                {step.items.map((it, itIdx) => (
                  <span key={itIdx} className="text-[10px] font-mono font-bold bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-md border border-slate-100 dark:border-slate-800">
                    ✓ {it}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Features Selection Grid (6 visual cards as requested) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-100 dark:border-slate-800">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
            {t.featuresTitle}
          </h2>
          <p className="mt-4 text-base text-slate-505 dark:text-slate-400 leading-relaxed font-sans font-normal">
            {t.featuresSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: Brain, title: "Analyse IA", desc: lang === "fr" ? "Analyse sémantique Gemini ultra-poussée de vos diplômes, certifications et contributions techniques." : "Deep semantic NLP analysis crossing academic, side project and workforce milestones." },
            { icon: Layers, title: "Roadmap Évolutive", desc: lang === "fr" ? "Chronologie interactive générée sur-mesure décrivant vos prochaines étapes d'études et certifications." : "Tailored step-by-step curriculum timelines pointing you to exact skills and resources." },
            { icon: Cpu, title: "Coach IA Interactif", desc: lang === "fr" ? "Un tuteur technique disponible 24/7 pour des simulations de questions d'entretien complexes." : "Technical mentor active around the clock for deep dialogue, guidance and system design help." },
            { icon: Award, title: "Défis d'Expertise", desc: lang === "fr" ? "Améliorez votre classement et score en accomplissant des micro-défis quotidiens ludiques." : "Earn rank point multipliers by resolving gamified project milestones." },
            { icon: ShieldCheck, title: "Talent Score Dynamique", desc: lang === "fr" ? "Mesurez et visualisez vos compétences selon un modèle holistique validé scientifiquement." : "Scientifically backed tracking for technique, communication, leadership and problem solving." },
            { icon: Compass, title: "Analyse Prospective", desc: lang === "fr" ? "Explorez des trajectoires d'avenir innovantes et calculez l'indice de concordance de votre profil." : "Predict matching scores and upcoming jobs before market saturated trends." },
          ].map((item, index) => (
            <div key={index} className="p-8 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 transition-all duration-200 shadow-sm hover:shadow-md hover:border-transparent hover:ring-2 hover:ring-blue-500/10">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 text-[#2563EB]">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight font-display">{item.title}</h3>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-450 leading-relaxed font-sans">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Footer (Minimalist) */}
      <footer className="py-12 border-t border-slate-100 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-[#2563EB] flex items-center justify-center text-white font-bold font-display text-base">
              S
            </div>
            <span className="font-bold text-slate-900 dark:text-white font-display text-sm tracking-tight">SkillOn</span>
          </div>
          <p className="font-sans">© 2026 SkillOn Inc. {lang === "fr" ? "Tous droits réservés." : "All rights reserved."}</p>
          <div className="flex space-x-4 font-mono">
            <span>GEMINI 1.5</span>
            <span>•</span>
            <span>FIREBASE SECURE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
