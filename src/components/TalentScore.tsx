import React, { useState } from "react";
import { Award, Star, Trophy, ArrowRight, ShieldCheck, HelpCircle, AlertCircle, Sparkles, Brain, ChevronRight } from "lucide-react";
import { UserProfile } from "../types";

interface TalentScoreProps {
  t: any;
  lang: "fr" | "en";
  userProfile: UserProfile;
  setCurrentTab?: (tab: string) => void;
}

export default function TalentScore({ t, lang, userProfile, setCurrentTab }: TalentScoreProps) {
  const [activeDimension, setActiveDimension] = useState<string>("technical");

  const hasScores = !!userProfile.aiScores;
  const scores = userProfile.aiScores || {
    technical: 0,
    communication: 0,
    leadership: 0,
    creativity: 0,
    problemSolving: 0,
  };

  // Dimension details labels mapper
  const getDimensionDescription = (dim: string, val: number): string => {
    if (lang === "fr") {
      switch (dim) {
        case "technical":
          return `Indice Technique (${val}%) : Cet indice mesure votre niveau d'adaptation aux architectures logicielles modernes, aux bibliothèques de code complexes et à l'exactitude de votre exécution (comme React 18+, TypeScript et les configurations de serveurs).`;
        case "communication":
          return `Indice Communication (${val}%) : Évalue votre capacité à synthétiser les concepts techniques complexes pour les clients, collaborer en binôme et partager des rapports sémantiques limpides de manière professionnelle.`;
        case "leadership":
          return `Indice Leadership (${val}%) : Mesure votre aptitude à piloter des feuilles de route, mentorer de plus jeunes développeurs, arbitrer les priorités de sprint et porter la vision produit sans friction directionnelle.`;
        case "creativity":
          return `Indice Créativité (${val}%) : Traduit votre audace à concevoir des solutions innovantes, sortir des sentiers battus (out-of-the-box thinking) et formuler de nouvelles interfaces UX ergonomiques et stimulantes.`;
        case "problemSolving":
          return `Indice Résolution Problèmes (${val}%) : Représente votre persévérance et efficacité analytique face aux erreurs complexes du serveur, l'investigation de bugs bloquants et la rapidité de prise de décision logique.`;
        default:
          return "";
      }
    } else {
      switch (dim) {
        case "technical":
          return `Technical Score (${val}%): Reflects your absolute command of software engineering principles, framework architectures, structured syntax guidelines, and cloud operations.`;
        case "communication":
          return `Communication Score (${val}%): Evaluates your clarity in verbal/textual alignment, explaining complex design systems to customers, and writing clean documents.`;
        case "leadership":
          return `Leadership Score (${val}%): Evaluates master timeline scheduling, managing sprint priorities, mentoring teammates, and driving projects towards fast outcomes.`;
        case "creativity":
          return `Creativity Score (${val}%): Reflects your out-of-the-box thinking style, innovating new custom components, or adding unique UX visual depth.`;
        case "problemSolving":
          return `Problem Solving (${val}%): Measures speed in debugging nested service crashes, tracing performance bottlenecks, and compiling secure recovery scripts.`;
        default:
          return "";
      }
    }
  };

  // Radar chart concentric drawing constants
  const center = 110;
  const maxRadius = 80;
  const categories = [
    { key: "technical", label: lang === "fr" ? "Technique" : "Technical" },
    { key: "communication", label: lang === "fr" ? "Communication" : "Communication" },
    { key: "leadership", label: lang === "fr" ? "Leadership" : "Leadership" },
    { key: "creativity", label: lang === "fr" ? "Créativité" : "Creativity" },
    { key: "problemSolving", label: lang === "fr" ? "Résolution Problèmes" : "Problem Solving" },
  ];

  // Map coordinate coordinates of current active score polygon outline
  const points: string[] = [];
  categories.forEach((cat, idx) => {
    const angle = (idx * 2 * Math.PI) / 5 - Math.PI / 2;
    const val = scores[cat.key as keyof typeof scores] || 50;
    const radius = (val / 100) * maxRadius;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    points.push(`${Math.round(x)},${Math.round(y)}`);
  });

  const polygonPoints = points.join(" ");
  const rings = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Formulate absolute numeric rating average sum
  const sumScores = scores.technical + scores.communication + scores.leadership + scores.creativity + scores.problemSolving;
  const averageScore = Math.round(sumScores / 5);

  const getRankLabel = (avg: number): string => {
    if (avg >= 90) return lang === "fr" ? "Expert Stratégique / Principal" : "Strategic Expert / Principal";
    if (avg >= 75) return lang === "fr" ? "Spécialiste Senior Level III" : "Senior Specialist Level III";
    if (avg >= 55) return lang === "fr" ? "Associé Mid-Core" : "Mid-Core Associate";
    return lang === "fr" ? "Junior en Ascension" : "Rising Junior Practitioner";
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      
      {/* Starting header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-6 mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
          {lang === "fr" ? "Talent Score IA" : "AI Talent Score Dashboard"}
        </h2>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 font-sans">
          {lang === "fr" 
            ? "Visualisez votre niveau d'expertise holistique cartographié par sémantique prédictive."
            : "Explore your holistic expertise map rendered from text files parsing logic."}
        </p>
      </div>

      {!hasScores ? (
        /* LOCKED REDIRECTION SCREEN IF NO PROFILE SCORES YET */
        <div className="text-center py-20 px-8 bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="w-14 h-14 bg-blue-100 dark:bg-blue-950/40 text-[#2563EB] rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Award className="w-7 h-7 stroke-[1.5]" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
              {lang === "fr" ? "Scores de Talent Verrouillés" : "Talent Index Locked"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-440 max-w-sm mx-auto leading-relaxed">
              {lang === "fr"
                ? "Vous devez d'abord lancer l'Analyse IA de votre profil (via votre CV ou résumé) pour pouvoir générer et explorer votre carte radar sémantique."
                : "You must run the initial AI resume evaluation to unlock dynamic parameters and charts computations."}
            </p>
          </div>
          <button
            id="go-analyse-ia-ts"
            onClick={() => setCurrentTab?.("analyse_ia")}
            className="px-6 py-3 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow-md transition-colors cursor-pointer flex items-center justify-center space-x-2.5 mx-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>{lang === "fr" ? "Lancer l'Analyse IA" : "Trigger AI Review Now"}</span>
          </button>
        </div>
      ) : (
        /* RENDER DYNAMIC METRICS CHARTS COHESIVE SYSTEM */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Block: Big Gauge circular view & clickable descriptors list (cols 5) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Round Gauge */}
            <div className="p-8 bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm text-center flex flex-col items-center justify-center space-y-5">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest block">
                {lang === "fr" ? "MAÎTRISE CONSOLIDÉE" : "CONSOLIDATED MASTERY"}
              </span>

              {/* Dynamic Circular progress */}
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    fill="transparent"
                    className="stroke-slate-105 dark:stroke-slate-800"
                    strokeWidth="8"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    fill="transparent"
                    stroke="#2563EB"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 60}`}
                    strokeDashoffset={`${2 * Math.PI * 60 * (1 - averageScore / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-black text-slate-900 dark:text-white font-display">
                    {averageScore}%
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-black uppercase tracking-wider">
                    {lang === "fr" ? "MAÎTRISE" : "MASTERY"}
                  </span>
                </div>
              </div>

              {/* Rank description label */}
              <div className="space-y-1.5 pt-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
                  {lang === "fr" ? "Grade d'Ingénierie IA :" : "AI Computed Status :"}
                </span>
                <span className="text-sm font-black font-sans text-[#2563EB] tracking-tight bg-blue-500/10 px-3.5 py-1.5 rounded-full uppercase">
                  🏆 {getRankLabel(averageScore)}
                </span>
              </div>
            </div>

            {/* Explanatory box describing currently selected key dimension */}
            <div className="p-6 bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/40 rounded-2xl shadow-sm mini-description mt-4">
              <h4 className="text-xs font-mono font-black text-[#2563EB] uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
                <Brain className="w-4 h-4" />
                <span>{lang === "fr" ? "EXPLICATION DU SCORE" : "DIMENSION SCORE OUTLOOK"}</span>
              </h4>
              <p className="text-xs text-slate-605 dark:text-slate-300 leading-relaxed font-sans font-medium transition-all duration-200">
                {getDimensionDescription(activeDimension, scores[activeDimension as keyof typeof scores] || 50)}
              </p>
            </div>

          </div>

          {/* Right Block: Dynamic SVG Radar visualization & categories list (cols 7) */}
          <div className="lg:col-span-7 p-8 bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8">
            
            {/* Center Area: Drawing our crisp radar chart with concentrics polygon indices */}
            <div className="flex-1 flex justify-center">
              <svg viewBox="0 0 220 220" className="w-[240px] h-[240px] select-none">
                
                {/* 5 concentric circles/rings */}
                {rings.map((ring, rIdx) => {
                  const rPoints: string[] = [];
                  for (let i = 0; i < 5; i++) {
                    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                    const x = center + maxRadius * ring * Math.cos(angle);
                    const y = center + maxRadius * ring * Math.sin(angle);
                    rPoints.push(`${x},${y}`);
                  }
                  return (
                    <polygon
                      key={rIdx}
                      points={rPoints.join(" ")}
                      fill="none"
                      className="stroke-slate-100 dark:stroke-slate-800"
                      strokeWidth="1"
                      strokeDasharray={rIdx === 4 ? "0" : "3,3"}
                    />
                  );
                })}

                {/* Draw axes linking from center point origin */}
                {categories.map((cat, idx) => {
                  const angle = (idx * 2 * Math.PI) / 5 - Math.PI / 2;
                  const x = center + maxRadius * Math.cos(angle);
                  const y = center + maxRadius * Math.sin(angle);
                  return (
                    <line
                      key={idx}
                      x1={center}
                      y1={center}
                      x2={x}
                      y2={y}
                      className="stroke-slate-100 dark:stroke-slate-800"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* DRAW SCORE FILL POLYGON GRAPH ACCENT */}
                <polygon
                  points={polygonPoints}
                  fill="rgba(37, 99, 235, 0.16)"
                  className="stroke-[#2563EB]"
                  strokeWidth="2.5"
                />

                {/* Radar label annotations text overlay */}
                {categories.map((cat, idx) => {
                  const angle = (idx * 2 * Math.PI) / 5 - Math.PI / 2;
                  const labelDist = maxRadius + 18;
                  const x = center + labelDist * Math.cos(angle);
                  const y = center + labelDist * Math.sin(angle);
                  
                  // Alignment anchor mappings
                  let textAnchor = "middle";
                  if (idx === 1 || idx === 2) textAnchor = "start";
                  if (idx === 3 || idx === 4) textAnchor = "end";

                  const isActive = activeDimension === cat.key;

                  return (
                    <text
                      key={idx}
                      x={x}
                      y={y + 3}
                      textAnchor={textAnchor}
                      className={`font-mono text-[9px] font-bold uppercase transition-all duration-200 ${
                        isActive 
                          ? "fill-[#2563EB] font-black scale-105" 
                          : "fill-slate-400 dark:fill-slate-500"
                      }`}
                    >
                      {cat.label}
                    </text>
                  );
                })}
              </svg>
            </div>

            {/* Sidebar list items representing each sub-metric */}
            <div className="w-full md:w-60 space-y-2 flex-shrink-0">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-4">
                {lang === "fr" ? "DIMENSIONS DE GRAPH EN CLIC" : "CLICK DIMENSION TO DESTRUCT"}
              </span>

              {categories.map((cat) => {
                const val = scores[cat.key as keyof typeof scores] || 50;
                const isCurrent = activeDimension === cat.key;

                return (
                  <button
                    key={cat.key}
                    onClick={() => setActiveDimension(cat.key)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isCurrent
                        ? "bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900 ring-1 ring-blue-500/10"
                        : "bg-white dark:bg-[#0F172A]/40 border-slate-100 dark:border-slate-800/60 hover:border-slate-205 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="space-y-1">
                      <span className={`text-xs font-bold block ${isCurrent ? "text-[#2563EB] dark:text-blue-400" : "text-slate-700 dark:text-slate-300"}`}>
                        {cat.label}
                      </span>
                      {/* Simple progress bar mock wrapper */}
                      <div className="w-24 bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                        <div 
                          className={`h-1 rounded-full ${isCurrent ? "bg-[#2563EB]" : "bg-slate-400"}`}
                          style={{ width: `${val}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 font-mono text-xs font-black">
                      <span className={isCurrent ? "text-[#2563EB]" : "text-slate-500"}>{val}%</span>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
