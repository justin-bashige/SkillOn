import React, { useState } from "react";
import { Sparkles, Calendar, Award, Code, CheckCircle, ArrowRight, HelpCircle, AlertCircle } from "lucide-react";
import { UserProfile } from "../types";
import { db } from "../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

interface CareerRoadmapProps {
  t: any;
  lang: "fr" | "en";
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  setCurrentTab?: (tab: string) => void;
}

export default function CareerRoadmap({ t, lang, userProfile, setUserProfile, setCurrentTab }: CareerRoadmapProps) {
  const [generating, setGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isProfileEmpty = !userProfile.skills || userProfile.skills.length === 0;

  const handleGenerateRoadmap = async () => {
    if (isProfileEmpty) return;
    setGenerating(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: userProfile, lang }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to generate roadmap");
      }

      const report = await res.json();

      const userRef = doc(db, "users", userProfile.userId);
      await updateDoc(userRef, {
        aiRoadmap: report,
      });

      setUserProfile((prev: any) => ({
        ...prev,
        aiRoadmap: report,
      }));
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Could not generate roadmap from Gemini server.");
    } finally {
      setGenerating(false);
    }
  };

  const roadmap = userProfile.aiRoadmap;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      {/* Header Info */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
            {t.roadmapTitle}
          </h2>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 font-sans">
            {t.roadmapSubtitle}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            id="btn-generate-roadmap"
            onClick={handleGenerateRoadmap}
            disabled={generating || isProfileEmpty}
            className="inline-flex items-center px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-md hover:shadow-lg shadow-blue-100 dark:shadow-none transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4.5 h-4.5 mr-1.5" />
            {generating 
              ? (lang === "fr" ? "Élaboration en cours..." : "Pathfinding...")
              : (lang === "fr" ? "Reconstruire mon Parcours IA" : "Generate My Career Path")}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div id="roadmap-error-msg" className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 rounded-xl text-sm flex items-center space-x-2.5">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {isProfileEmpty ? (
        /* LOCKED PROFILE EMPTY REDIRECTION */
        <div className="text-center py-20 px-8 bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <AlertCircle className="w-7 h-7 stroke-[1.5]" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
              {lang === "fr" ? "Profil vide détecté dans la base" : "Profile Empty in Database"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              {lang === "fr"
                ? "Pour éviter toute hallucination de l'IA, vous devez d'abord compléter vos informations (compétences, expériences, formations) sur votre profil."
                : "To prevent AI hallucinations, you must first fill in your skills, experiences, and educational background on your profile page."}
            </p>
          </div>
          <button
            id="go-profile-roadmap"
            onClick={() => setCurrentTab?.("profile")}
            className="px-6 py-3 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow-md transition-colors cursor-pointer flex items-center justify-center space-x-2.5 mx-auto"
          >
            <ArrowRight className="w-4 h-4" />
            <span>{lang === "fr" ? "Compléter mon Profil" : "Go to Profile"}</span>
          </button>
        </div>
      ) : !roadmap ? (
        <div id="no-roadmap-banner" className="text-center py-16 px-4 bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm">
          <Calendar className="w-12 h-12 text-[#2563EB] mx-auto mb-4 stroke-[1.5]" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 font-display">
            {lang === "fr" ? "Créez votre Plan de Croissance sur mesure" : "Discover your tailored learning timeline"}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6 leading-relaxed">
            {lang === "fr" 
              ? "Laissez Gemini cartographier vos prochaines certifications et projets d'apprentissage en un clic !"
              : "Let Gemini align your upcoming industry qualifications and milestones in seconds!"}
          </p>
          <button
            id="btn-initiate-roadmap"
            onClick={handleGenerateRoadmap}
            disabled={generating}
            className="px-5 py-3 text-sm font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg shadow-md hover:shadow-lg shadow-blue-100 dark:shadow-none transition-all cursor-pointer disabled:opacity-50"
          >
            {generating ? t.loading : (lang === "fr" ? "Générer mon Parcours Carrière" : "Generate Core Roadmap")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Timeline column */}
          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center space-x-2 font-display">
              <Calendar className="w-5 h-5 text-[#2563EB]" />
              <span>{lang === "fr" ? "Étapes Chronologiques" : "Phased Milestones"}</span>
            </h3>

            <div className="relative border-l border-slate-100 dark:border-slate-800 ml-4 space-y-12">
              {roadmap.learningPath?.map((phase, idx) => (
                <div key={idx} className="relative pl-8 group">
                  {/* Timeline dot */}
                  <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-[#2563EB] border border-white dark:border-[#0F172A] transition-transform duration-250 group-hover:scale-125" />
                  
                  <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                      <span className="text-[10px] font-mono font-bold text-[#2563EB] uppercase tracking-widest bg-blue-500/10 px-2.5 py-1 rounded-full w-max font-mono">
                        {phase.phase}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-tight mt-1 sm:mt-0 font-mono">
                        ⏳ {phase.estimatedMonths} {roadmap.learningPath.length > 0 ? t.months : "months"}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight font-display">{phase.title}</h4>
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">{phase.description}</p>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
                        {lang === "fr" ? "Compétences cibles" : "Target Competence"}
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {phase.skillsToAcquire?.map((sk, skIdx) => (
                          <span
                            key={skIdx}
                            className="text-[10px] font-semibold bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg border border-slate-150 dark:border-slate-800"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sibling column: Recommendations targets */}
          <div className="space-y-6">
            {/* Recommended Target roles */}
            <div className="p-6 bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 flex items-center justify-between font-display">
                <span>{t.recommendedRoles}</span>
                <Sparkles className="w-4 h-4 text-[#2563EB]" />
              </h3>
              <ul className="space-y-2">
                {roadmap.recommendedCareers?.map((car, idx) => (
                  <li key={idx} className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300 bg-[#F8FAFC] dark:bg-[#0F172A] px-3.5 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0" />
                    <span className="font-medium font-sans">{car}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Certifications and Badges recommendations */}
            <div className="p-6 bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 flex items-center justify-between font-display">
                <span>{t.suggestedCerts}</span>
                <Award className="w-4 h-4 text-[#2563EB]" />
              </h3>
              <ul className="space-y-3.5">
                {roadmap.certifications?.map((c, cIdx) => (
                  <li key={cIdx} className="flex items-start space-x-2">
                    <ArrowRight className="w-3.5 h-3.5 text-[#2563EB] mt-0.5 flex-shrink-0" />
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300 font-sans">{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Practical Milestone Projects */}
            <div className="p-6 bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 flex items-center justify-between font-display">
                <span>{t.suggestedProjects}</span>
                <Code className="w-4 h-4 text-[#2563EB]" />
              </h3>
              <div className="space-y-4">
                {roadmap.projectsToBuild?.map((proj, pIdx) => (
                  <div key={pIdx} className="p-3.5 bg-[#F8FAFC] dark:bg-[#0F172A] rounded-xl border border-slate-100 dark:border-slate-800/50">
                    <div className="flex justify-between items-center mb-1.5">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white font-display">{proj.title}</h4>
                      <span className="text-[8px] font-mono font-bold bg-[#2563EB]/10 text-[#2563EB] px-1.5 py-0.5 rounded uppercase font-mono">
                        {proj.difficulty}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal font-sans">
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
