import React, { useState } from "react";
import { Sparkles, Trophy, CheckSquare, Zap, Clock, ShieldCheck, AlertCircle } from "lucide-react";
import { UserProfile, GrowthChallenge } from "../types";
import { db } from "../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

interface AIChallengesProps {
  t: any;
  lang: "fr" | "en";
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  setCurrentTab?: (tab: string) => void;
}

export default function AIChallenges({ t, lang, userProfile, setUserProfile, setCurrentTab }: AIChallengesProps) {
  const [challenges, setChallenges] = useState<GrowthChallenge[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isProfileEmpty = !userProfile.skills || userProfile.skills.length === 0;

  const handleFetchChallenges = async () => {
    if (isProfileEmpty) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: userProfile, lang }),
      });

      if (!res.ok) {
        throw new Error("Failed to consult Gemini challenges generator");
      }

      const list = await res.json();
      setChallenges(list);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred fetching growth challenges.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteChallenge = async (challengeId: string) => {
    // Locate the challenge
    const challenge = challenges.find((c) => c.id === challengeId);
    if (!challenge) return;

    if (userProfile.completedChallenges?.includes(challengeId)) {
      return; // Already completed
    }

    const percentageBoost = Math.round((challenge.points || 150) / 75);
    const updatedPoints = Math.min((userProfile.points || 35) + percentageBoost, 100);
    const completedList = [...(userProfile.completedChallenges || []), challengeId];

    try {
      const userRef = doc(db, "users", userProfile.userId);
      await updateDoc(userRef, {
        points: updatedPoints,
        completedChallenges: completedList,
      });

      setUserProfile((prev: any) => ({
        ...prev,
        points: updatedPoints,
        completedChallenges: completedList,
      }));
    } catch (err) {
      console.error("Error setting challenge points:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      {/* Head section */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
            {t.challengesTitle}
          </h2>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 font-sans">
            {t.challengesSubtitle}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            id="btn-load-challenges"
            onClick={handleFetchChallenges}
            disabled={loading || isProfileEmpty}
            className="inline-flex items-center px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-md hover:shadow-lg shadow-blue-100 dark:shadow-none transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4.5 h-4.5 mr-1.5" />
            {loading ? t.loading : t.loadChallengesBtn}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 rounded-xl text-sm flex items-center space-x-2.5">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {isProfileEmpty ? (
        /* LOCKED PROFILE EMPTY REDIRECTION */
         <div className="text-center py-20 px-8 bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Trophy className="w-7 h-7 stroke-[1.5]" />
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
            id="go-profile-challenges"
            onClick={() => setCurrentTab?.("profile")}
            className="px-6 py-3 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow-md transition-colors cursor-pointer flex items-center justify-center space-x-2.5 mx-auto"
          >
            <CheckSquare className="w-4 h-4" />
            <span>{lang === "fr" ? "Compléter mon Profil" : "Go to Profile"}</span>
          </button>
        </div>
      ) : challenges.length === 0 ? (
        <div id="no-challenges-banner" className="text-center py-16 px-4 bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm">
          <Trophy className="w-12 h-12 text-[#2563EB] mx-auto mb-4 stroke-[1.5]" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 font-display">
            {lang === "fr" ? "Affrontez des défis pour accumuler des Étoiles" : "Undertake challenges and log experience"}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6 leading-relaxed">
            {lang === "fr" 
              ? "Prêt à tester vos compétences ? Cliquez pour générer trois défis alignés sur vos compétences clés !"
              : "Ready to test your execution limits? Tap to schedule three customized target milestones!"}
          </p>
          <button
            id="btn-initiate-challenges"
            onClick={handleFetchChallenges}
            disabled={loading}
            className="px-5 py-3 text-sm font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg shadow-md hover:shadow-lg shadow-blue-100 dark:shadow-none transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? t.loading : (lang === "fr" ? "Générer mes Défis" : "Generate Core Challenges")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {challenges.map((c) => {
            const finished = userProfile.completedChallenges?.includes(c.id);
            return (
              <div
                key={c.id}
                className={`relative bg-white dark:bg-[#1E293B] rounded-2xl border p-6 flex flex-col justify-between transition-transform duration-200 hover:scale-[1.01] shadow-sm ${
                  finished 
                    ? "border-emerald-200 dark:border-emerald-900/60" 
                    : "border-slate-100 dark:border-slate-800/80"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[9px] font-mono font-bold uppercase px-2.5 py-1 rounded-full ${
                      c.difficulty.toLowerCase().includes("easy") || c.difficulty.toLowerCase().includes("facile")
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450"
                        : c.difficulty.toLowerCase().includes("hard") || c.difficulty.toLowerCase().includes("difficile")
                        ? "bg-red-500/10 text-red-600"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-450"
                    }`}>
                      {c.difficulty}
                    </span>
                    <span className="text-[10px] text-slate-450 dark:text-slate-400 font-mono flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      {c.duration}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight font-display">{c.title}</h3>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-normal">{c.description}</p>

                  <div className="mt-5 space-y-4">
                    {/* Action checklists */}
                    <div>
                      <span className="text-[9px] font-bold text-slate-450 dark:text-slate-500 uppercase font-mono tracking-wider">
                        {lang === "fr" ? "Étapes d'exécution :" : "Action plans :"}
                      </span>
                      <ul className="space-y-1.5 mt-2">
                        {c.steps?.map((step, sIdx) => (
                          <li key={sIdx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB] mr-1.5 mt-0.5 flex-shrink-0" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Skills target */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-805 dark:border-slate-800">
                      <div className="flex flex-wrap gap-1">
                        {c.skills?.map((sk, skIdx) => (
                          <span
                            key={skIdx}
                            className="text-[9px] font-mono font-bold bg-[#2563EB]/5 text-blue-700 dark:text-blue-400 border border-blue-500/10 px-1.5 py-0.5 rounded"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center justify-between space-x-2">
                    <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center font-mono bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 rounded">
                      <Zap className="w-3.5 h-3.5 mr-1 text-blue-500 animate-pulse" />
                      +{Math.round((c.points || 150) / 75)}% {lang === "fr" ? "Maîtrise" : "Mastery"}
                    </span>
                    <button
                      id={`btn-complete-${c.id}`}
                      onClick={() => handleCompleteChallenge(c.id)}
                      disabled={finished}
                      className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        finished
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center space-x-1"
                          : "bg-[#2563EB] hover:bg-blue-700 text-white"
                      }`}
                    >
                      {finished ? (
                        <>
                          <CheckSquare className="w-3.5 h-3.5 mr-1" />
                          <span>{t.completed}</span>
                        </>
                      ) : (
                        <span>
                          {lang === "fr" 
                            ? `Valider (+${Math.round((c.points || 150) / 75)}% de Maîtrise)` 
                            : `Log Completed (+${Math.round((c.points || 150) / 75)}% Mastery)`}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
