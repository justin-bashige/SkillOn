import React from "react";
import { Sparkles, Trophy, CheckCircle2, Award, Zap, Compass, ArrowRight, Brain, ShieldAlert, Cpu } from "lucide-react";
import { UserProfile } from "../types";

interface DashboardProps {
  t: any;
  lang: "fr" | "en";
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  setCurrentTab: (tab: string) => void;
}

export default function Dashboard({ t, lang, userProfile, setUserProfile, setCurrentTab }: DashboardProps) {
  const hasScores = !!userProfile.aiScores;
  const scores = userProfile.aiScores || {
    technical: 0,
    communication: 0,
    leadership: 0,
    creativity: 0,
    problemSolving: 0,
  };

  // Grade helper based on overall points or average score level
  const getGradeName = () => {
    const pointsValue = userProfile.points || 100;
    if (pointsValue >= 500) return lang === "fr" ? "Expert Visionnaire II" : "Visionary Expert II";
    if (pointsValue >= 300) return lang === "fr" ? "Technologue Senior I" : "Senior Technologist I";
    if (pointsValue >= 150) return lang === "fr" ? "Professionnel Initiateur" : "Ascending Practitioner";
    return lang === "fr" ? "Apprenti Novateur" : "Novice Explorer";
  };

  // Profile completion percent calculation
  const calculateCompletion = () => {
    let fields = 0;
    if (userProfile.skills && userProfile.skills.length > 0) fields++;
    if (userProfile.experience) fields++;
    if (userProfile.education) fields++;
    if (userProfile.certifications) fields++;
    if (userProfile.github) fields++;
    if (userProfile.projects) fields++;
    if (userProfile.interests) fields++;
    return Math.round((fields / 7) * 100);
  };

  const completionPercent = calculateCompletion();

  // Parse certificates quantity safely
  const getCertificatesCount = () => {
    if (!userProfile.certifications) return 0;
    const items = userProfile.certifications.split(",").filter(c => c.trim().length > 0);
    return Math.max(items.length, 1); // Return at least 1 if string exists
  };

  // Average Talent score mapping
  const sumScores = scores.technical + scores.communication + scores.leadership + scores.creativity + scores.problemSolving;
  const averageScore = hasScores ? Math.round(sumScores / 5) : 0;

  // Next steps preview list mapping
  const learningSteps = userProfile.aiRoadmap?.learningPath || [];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-10 transition-colors duration-200">
      
      {/* ================= BLOC 1: Welcome & Global point indicators ================= */}
      <div className="bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden">
        {/* Decorative corner element */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-blue-500/5 to-transparent rounded-bl-full pointer-events-none" />
        
        <div className="space-y-3 relative z-10">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-[#2563EB] uppercase tracking-widest bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full">
              {lang === "fr" ? "PROFIL ACTIF SÉCURISÉ" : "SECURED SESSION ACTIVE"}
            </span>
            <span className="text-xs font-mono text-slate-400">
              GRADE: {getGradeName()}
            </span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-black text-slate-909 dark:text-white tracking-tight font-display">
            {lang === "fr" 
              ? `Bienvenue, ${userProfile.displayName || "Candidat"} 👋` 
              : `Welcome back, ${userProfile.displayName || "Candidate"} 👋`}
          </h2>
          
          <p className="text-sm text-slate-500 dark:text-slate-450 leading-relaxed max-w-xl font-sans font-medium">
            {hasScores 
              ? (lang === "fr" 
                  ? "Votre Talent Score consolidé est synchronisé. Explorez votre roadmap et résolvez des défis pour propulser votre carrière."
                  : "Explore your prospective career timelines and master weekly challenges to increase points standing.")
              : (lang === "fr"
                  ? "Rejoignez l'élite technologique. Activez l'Analyse IA d'un fichier CV ci-dessous pour révéler votre Talent Score de départ."
                  : "Uncover hidden strengths. Copy and paste your bio or upload a document to bootstrap scores.")}
          </p>
        </div>

        {/* Right item points card indicator value */}
        <div className="bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-100 dark:border-slate-800 p-5 rounded-xl flex items-center space-x-4 flex-shrink-0 relative z-10 shadow-sm md:w-64">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider">
              {lang === "fr" ? "Points accumulés" : "Rank score balance"}
            </span>
            <span className="text-xl font-black font-display text-slate-900 dark:text-white block">
              {userProfile.points || 100} PX
            </span>
            <span className="text-[11px] font-bold text-[#2563EB] font-serif block mt-0.5">
              👑 {getGradeName()}
            </span>
          </div>
        </div>
      </div>

      {/* ================= BLOC 2: 4 Stats Cards metrics grid ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Stat 1: Talent score index */}
        <div className="p-6 bg-white dark:bg-[#1E293B] border border-slate-105 dark:border-slate-800 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">
              Talent Score
            </span>
            <span className="text-2xl font-black font-display text-slate-808 dark:text-white block">
              {hasScores ? `${averageScore}/100` : "--/100"}
            </span>
            <span className="text-[10px] font-sans text-slate-500 leading-none">
              {hasScores ? (lang === "fr" ? "Consolidé par l'IA" : "Verified by Gemini") : (lang === "fr" ? "Analyse requise" : "Evaluation pending")}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-[#2563EB]">
            <Award className="w-5 h-5" />
          </div>
        </div>

        {/* Stat 2: Completed Growth challenges */}
        <div className="p-6 bg-white dark:bg-[#1E293B] border border-slate-105 dark:border-slate-800 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">
              {lang === "fr" ? "Défis Terminés" : "Completed Challenges"}
            </span>
            <span className="text-2xl font-black font-display text-slate-808 dark:text-white block">
              {userProfile.completedChallenges?.length || 0} / 10
            </span>
            <span className="text-[10px] font-sans text-slate-500 leading-none">
              {lang === "fr" ? "Pratiques techniques" : "Technical practices log"}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        {/* Stat 3: Total declared certifications */}
        <div className="p-6 bg-white dark:bg-[#1E293B] border border-slate-105 dark:border-slate-800 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">
              Certificats
            </span>
            <span className="text-2xl font-black font-display text-slate-808 dark:text-white block">
              {getCertificatesCount()} {lang === "fr" ? "validé(s)" : "verified"}
            </span>
            <span className="text-[10px] font-sans text-slate-500 leading-none">
              {lang === "fr" ? "Prouvés sur le profil" : "Matching credentials"}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Stat 4: Profile overall completeness info */}
        <div className="p-6 bg-white dark:bg-[#1E293B] border border-slate-105 dark:border-slate-800 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">
              Progression
            </span>
            <span className="text-2xl font-black font-display text-slate-808 dark:text-white block">
              {completionPercent}%
            </span>
            <span className="text-[10px] font-sans text-slate-500 leading-none">
              {lang === "fr" ? "Complétude générale" : "General profile fill rate"}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
            <Compass className="w-5 h-5" />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ================= BLOC 3: Roadmap Rapide Preview columns (7 cols) ================= */}
        <div className="lg:col-span-12 xl:col-span-7 bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800/80 pb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider flex items-center space-x-2.5">
              <Compass className="w-4.5 h-4.5 text-[#2563EB]" />
              <span>{lang === "fr" ? "Votre Roadmap Rapide (Prochaines Étapes)" : "Quick Roadmap Preview"}</span>
            </h3>
            
            <button
              onClick={() => setCurrentTab("roadmap")}
              className="text-xs font-semibold text-[#2563EB] flex items-center space-x-1 hover:underline cursor-pointer"
            >
              <span>{lang === "fr" ? "Voir tout" : "Expand all"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {learningSteps.length === 0 ? (
            /* Blank state roadmap preview */
            <div className="text-center py-10 space-y-3.5">
              <Compass className="w-10 h-10 text-slate-350 mx-auto" strokeWidth="1.5" />
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                {lang === "fr"
                  ? "Votre plan d'études chronologique n'est pas encore défini. Demandez l'apprentissage IA dans Parcours Professionnel !"
                  : "No career learning timeline synthesized yet. Go to Career Roadmap to bootstrap next milestones."}
              </p>
              <button
                id="btn-goto-roadmap-pre"
                onClick={() => setCurrentTab("roadmap")}
                className="px-4 py-2 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-[#2563EB] text-xs font-semibold rounded-lg hover:bg-[#2563EB] hover:text-white transition-colors cursor-pointer"
              >
                {lang === "fr" ? "Élaborer ma Roadmap" : "Bootstrap Learning Steps"}
              </button>
            </div>
          ) : (
            /* Render next 2 physical milestones steps dynamically */
            <div className="relative border-l border-slate-100 dark:border-slate-800 ml-3 space-y-6">
              {learningSteps.slice(0, 2).map((phase, idx) => (
                <div key={idx} className="relative pl-6 group">
                  <div className="absolute -left-1 w-2.5 h-2.5 rounded-full bg-[#2563EB] border border-white dark:border-[#1E293B]" />
                  <div className="space-y-1.5 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-850">
                    <div className="flex items-center space-x-2 text-[10px] font-mono text-[#2563EB] font-bold">
                      <span className="uppercase tracking-wider mr-2">{phase.phase}</span>
                      <span>⏳ {phase.estimatedMonths} {lang === "fr" ? "mois" : "months"}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                      {phase.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans font-normal">
                      {phase.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= BLOC 4: Recommandation IA du Jour (5 cols) ================= */}
        <div className="lg:col-span-12 xl:col-span-5 bg-gradient-to-br from-blue-50/50 to-indigo-50/20 dark:from-blue-950/20 dark:to-indigo-950/10 border border-blue-100/50 dark:border-blue-900/40 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-[#2563EB]">
              <Zap className="w-5 h-5 fill-current animate-bounce" />
              <h3 className="text-sm font-bold uppercase tracking-wider font-mono">
                {lang === "fr" ? "Recommandation IA de l'heure" : "AI Hour Recommendation"}
              </h3>
            </div>

            <p className="text-xs text-slate-655 dark:text-slate-300 leading-relaxed font-sans font-normal">
              {hasScores 
                ? (lang === "fr"
                    ? "D'après votre profil et vos scores compilés, vous devriez lancer les défis de croissance pour optimiser votre score d'influence et accumuler de la crédibilité."
                    : "Based on calculated skills levels, we highly advice testing the Weekly Growth Challenge to bypass gaps and increase standing.")
                : (lang === "fr"
                    ? "L'analyse IA de votre profil n'a pas encore été effectuée. Téléversez votre parcours dans Analyse IA pour recevoir des suggestions sur-mesure !"
                    : "Analysis profile metrics pending. Boot up your workspace credentials report to obtain hourly strategic targets.")}
            </p>
          </div>

          <div className="pt-4 border-t border-blue-100/40 dark:border-blue-900/30 flex justify-end">
            <button
              id="dashboard-recommend-cta"
              onClick={() => {
                if (hasScores) {
                  setCurrentTab("challenges");
                } else {
                  setCurrentTab("analyse_ia");
                }
              }}
              className="px-5 py-3 bg-[#2563EB] text-white hover:bg-blue-700 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-2"
            >
              <span>{hasScores ? (lang === "fr" ? "Rejoindre le défi" : "Take challenge") : (lang === "fr" ? "Lancer Analyse IA" : "Execute AI Review")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
