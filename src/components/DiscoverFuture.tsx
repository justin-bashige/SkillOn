import React, { useState } from "react";
import { Sparkles, HelpCircle, Compass, ShieldCheck, ArrowRight, TrendingUp, Cpu, Award } from "lucide-react";
import { UserProfile } from "../types";
import { db } from "../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

interface DiscoverFutureProps {
  t: any;
  lang: "fr" | "en";
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  setCurrentTab?: (tab: string) => void;
}

export default function DiscoverFuture({ t, lang, userProfile, setUserProfile, setCurrentTab }: DiscoverFutureProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isProfileEmpty = !userProfile.skills || userProfile.skills.length === 0;

  const handlePredictFuture = async () => {
    if (isProfileEmpty) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/discover-future", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: userProfile, lang }),
      });

      if (!res.ok) {
        throw new Error("Failed to pull career predictions from Gemini");
      }

      const report = await res.json();

      const userRef = doc(db, "users", userProfile.userId);
      await updateDoc(userRef, {
        aiFuturePrediction: report,
      });

      setUserProfile((prev: any) => ({
        ...prev,
        aiFuturePrediction: report,
      }));
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred with future forecast model.");
    } finally {
      setLoading(false);
    }
  };

  const prediction = userProfile.aiFuturePrediction;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      {/* Upper context info */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
            🔮 {t.futureTitle}
          </h2>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 font-sans">
            {t.futureSubtitle}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            id="btn-trigger-predictive"
            onClick={handlePredictFuture}
            disabled={loading || isProfileEmpty}
            className="inline-flex items-center px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-md hover:shadow-lg shadow-blue-100 dark:shadow-none transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4.5 h-4.5 mr-1.5" />
            {loading ? t.predictingLabel : t.predictBtn}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div id="future-error-msg" className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 rounded-xl text-sm flex items-center space-x-2.5">
          <HelpCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {isProfileEmpty ? (
        /* LOCKED PROFILE EMPTY REDIRECTION */
        <div className="text-center py-20 px-8 bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <HelpCircle className="w-7 h-7 stroke-[1.5]" />
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
            id="go-profile-future"
            onClick={() => setCurrentTab?.("profile")}
            className="px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm rounded-lg shadow-md transition-colors cursor-pointer flex items-center justify-center space-x-2.5 mx-auto"
          >
            <ArrowRight className="w-4 h-4" />
            <span>{lang === "fr" ? "Compléter mon Profil" : "Go to Profile"}</span>
          </button>
        </div>
      ) : !prediction ? (
        <div id="no-prediction-banner" className="text-center py-20 px-4 bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm">
          <Compass className="w-14 h-14 text-[#2563EB] mx-auto mb-5 stroke-[1.5]" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-display">
            {lang === "fr" ? "Prédisez vos trajectoires d'émergence" : "Predict your upcoming career alignment"}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-8 leading-relaxed">
            {lang === "fr" 
              ? "Accédez aux calculs de rupture sémantique de Gemini pour découvrir vos opportunités avant l'évolution globale de l'industrie !"
              : "Access Gemini predictive models to reveal high-rate positions ahead of global digital integration!"}
          </p>
          <button
            id="btn-direct-predictive"
            onClick={handlePredictFuture}
            disabled={loading}
            className="px-6 py-3.5 text-sm font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg shadow-md hover:shadow-lg shadow-blue-100 dark:shadow-none transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? t.predictingLabel : t.predictBtn}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Predictive matching cards column */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 mb-4 flex items-center font-display">
              <TrendingUp className="w-5 h-5 text-[#2563EB] mr-2" />
              <span>{lang === "fr" ? "Alignement des Carrières Futures" : "Emerging Occupational Alignments"}</span>
            </h3>

            <div className="space-y-4">
              {prediction.matches?.map((match, mIdx) => (
                <div
                  key={mIdx}
                  className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row md:items-start justify-between space-y-4 md:space-y-0 md:space-x-6"
                >
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight font-display">{match.career}</h4>
                    <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                      {match.why}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-center bg-[#2563EB]/5 px-4 py-3 rounded-xl border border-blue-500/10 min-w-[7.5rem]">
                    <span className="block text-[10px] uppercase font-mono font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                      {lang === "fr" ? "Correspondance" : "Match Rate"}
                    </span>
                    <span className="block text-2xl font-extrabold text-[#2563EB] font-mono mt-1">
                      {match.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lateral column: Latent strengths and systemic outlook */}
          <div className="space-y-6">
            {/* Latent Talents details */}
            <div className="p-6 bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 flex items-center justify-between">
                <span>{t.hiddenTalentsLabel}</span>
                <Cpu className="w-4 h-4 text-[#2563EB]" />
              </h3>
              <ul className="space-y-3">
                {prediction.hiddenTalents?.map((talent, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700 dark:text-slate-300">
                    <ShieldCheck className="w-4.5 h-4.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{talent}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Strategic actions checklists */}
            <div className="p-6 bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 flex items-center justify-between">
                <span>{t.stepsLabel}</span>
                <Award className="w-4 h-4 text-[#2563EB]" />
              </h3>
              <ul className="space-y-3.5 bg-[#F8FAFC] dark:bg-[#0F172A] p-4 rounded-xl border border-slate-100 dark:border-slate-800/50">
                {prediction.stepsToExcel?.map((step, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-mono text-[#2563EB] font-bold">0{idx + 1}.</span>
                    <span className="font-medium">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Long term forecasting summary text */}
            <div className="p-6 bg-blue-50/20 dark:bg-blue-950/20 border border-blue-500/10 rounded-2xl">
              <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest font-mono block mb-2.5">
                🌐 {t.longTermLabel}
              </span>
              <p className="text-xs text-slate-600 dark:text-blue-300 leading-relaxed italic">
                "{prediction.longTermOutlook}"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
