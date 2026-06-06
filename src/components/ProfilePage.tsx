import React, { useState } from "react";
import { User, Key, Save, AlertCircle, Sparkles, Check, Github, BookOpen, Award, FileText, Star, TrendingUp, HelpCircle } from "lucide-react";
import { UserProfile } from "../types";
import { db } from "../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

interface ProfilePageProps {
  t: any;
  lang: "fr" | "en";
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

export default function ProfilePage({ t, lang, userProfile, setUserProfile }: ProfilePageProps) {
  const [skills, setSkills] = useState(userProfile.skills.join(", "));
  const [certifications, setCertifications] = useState(userProfile.certifications || "");
  const [experience, setExperience] = useState(userProfile.experience || "");
  const [education, setEducation] = useState(userProfile.education || "");
  const [github, setGithub] = useState(userProfile.github || "");
  const [projects, setProjects] = useState(userProfile.projects || "");
  const [interests, setInterests] = useState(userProfile.interests || "");
  
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setMessage("");
    setErrorMsg("");

    const skillList = skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const updatedData = {
      skills: skillList,
      certifications,
      experience,
      education,
      github,
      projects,
      interests,
    };

    try {
      const userRef = doc(db, "users", userProfile.userId);
      await updateDoc(userRef, updatedData);
      
      setUserProfile((prev: any) => ({
        ...prev,
        ...updatedData,
      }));
      setMessage(t.profileSaved);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(lang === "fr" ? "Erreur lors de la sauvegarde : " + err.message : "Save error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAiAnalysis = async () => {
    // Save current profile data first to ensure latest is sent
    await handleSaveProfile();

    setAnalyzing(true);
    setMessage("");
    setErrorMsg("");

    const skillList = skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const profilePayload = {
      displayName: userProfile.displayName,
      skills: skillList,
      certifications,
      experience,
      education,
      github,
      projects,
      interests,
    };

    try {
      const res = await fetch("/api/analyze-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: profilePayload, lang }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to analyze skills");
      }

      const report = await res.json();

      // Update Firestore profile with scores and AI analysis report
      const updatedProfile = {
        aiSummary: report.summary,
        aiStrengths: report.strengths,
        aiWeaknesses: report.weaknesses,
        aiPotential: report.potential,
        aiScores: report.scores,
      };

      const userRef = doc(db, "users", userProfile.userId);
      await updateDoc(userRef, updatedProfile);

      setUserProfile((prev: any) => ({
        ...prev,
        ...updatedProfile,
      }));

      setMessage(lang === "fr" ? "Analyse d'impact IA complétée avec succès !" : "AI validation and analysis successfully completed!");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred with the Gemini API server.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="md:flex md:items-center md:justify-between border-b border-slate-100 dark:border-slate-800 pb-6 mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
            {t.professionalProfile}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-sans">
            {lang === "fr" 
              ? "Enrichissez votre parcours pour révéler les prédictions d'excellence de l'IA."
              : "Enrich your background to reveal powerful intelligence projections."}
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <button
            id="btn-save-profile"
            onClick={() => handleSaveProfile()}
            disabled={saving || analyzing}
            className="inline-flex items-center px-4 py-2.5 border border-slate-205 dark:border-gray-800/80 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? t.loading : t.save}
          </button>
          
          <button
            id="btn-run-ai"
            onClick={handleAiAnalysis}
            disabled={saving || analyzing}
            className="inline-flex items-center px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-md hover:shadow-lg shadow-blue-100 dark:shadow-none transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {analyzing ? t.aiAnalyzing : t.runAiAnalysis}
          </button>
        </div>
      </div>

      {message && (
        <div id="profile-success-msg" className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 rounded-xl text-sm flex items-center space-x-2.5">
          <Check className="w-5 h-5 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {errorMsg && (
        <div id="profile-error-msg" className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 rounded-xl text-sm flex items-center space-x-2.5">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left column: Editor Inputs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-850 pb-3 font-display">
              {lang === "fr" ? "Détails du CV & Expérience" : "Resume Details & Experience"}
            </h3>

            {/* Competency tags input */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase font-mono tracking-wider">
                {t.skillsLabel}
              </label>
              <input
                id="input-skills"
                type="text"
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-100 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB]"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React, TypeScript, Node.js, Python, Leadership, Docker..."
              />
            </div>

            {/* Experience */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase font-mono tracking-wider">
                {t.experienceLabel}
              </label>
              <textarea
                id="input-experience"
                rows={4}
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-100 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB]"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder={t.experiencePlaceholder}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Education */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase font-mono tracking-wider">
                  {t.educationLabel}
                </label>
                <textarea
                  id="input-education"
                  rows={3}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-100 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB]"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder={t.educationPlaceholder}
                />
              </div>

              {/* Certifications */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase font-mono tracking-wider">
                  {t.certsLabel}
                </label>
                <textarea
                  id="input-certifications"
                  rows={3}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-100 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB]"
                  value={certifications}
                  onChange={(e) => setCertifications(e.target.value)}
                  placeholder={t.certsPlaceholder}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
              {/* GitHub Link */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase font-mono flex items-center tracking-wider">
                  <Github className="w-3.5 h-3.5 mr-1" />
                  {t.githubLabel}
                </label>
                <input
                  id="input-github"
                  type="url"
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-100 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB]"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/myusername"
                />
              </div>

              {/* Targets / Aspirations */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase font-mono tracking-wider">
                  {t.interestsLabel}
                </label>
                <input
                  id="input-interests"
                  type="text"
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-100 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB]"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder={t.interestsPlaceholder}
                />
              </div>
            </div>

            {/* Major projects */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase font-mono tracking-wider">
                {t.projectsLabel}
              </label>
              <textarea
                id="input-projects"
                rows={3}
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-100 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB]"
                value={projects}
                onChange={(e) => setProjects(e.target.value)}
                placeholder={t.projectsPlaceholder}
              />
            </div>
          </div>
        </div>

        {/* Right column: AI assessment output block if exists */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#1E293B] p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <Sparkles className="w-5 h-5 text-[#2563EB]" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                ✨ {lang === "fr" ? "Évaluation Sémantique IA" : "Semantic AI Report"}
              </h3>
            </div>

            {userProfile.aiSummary ? (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-[#2563EB] uppercase font-mono mb-2 tracking-wider">
                    {t.personalSummary}
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed bg-[#F8FAFC] dark:bg-[#0F172A] p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    {userProfile.aiSummary}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[#2563EB] uppercase font-mono mb-2 tracking-wider">
                    {t.strengths}
                  </h4>
                  <ul className="space-y-2">
                    {userProfile.aiStrengths?.map((strength, idx) => (
                      <li key={idx} className="text-xs font-medium text-emerald-700 dark:text-emerald-400 flex items-start space-x-2">
                        <Check className="w-4 h-4 text-emerald-500 mr-1.5 flex-shrink-0 mt-0.5" />
                        <span className="font-sans">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase font-mono mb-2 tracking-wider">
                    {t.weaknesses}
                  </h4>
                  <ul className="space-y-2">
                    {userProfile.aiWeaknesses?.map((weakness, idx) => (
                      <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start space-x-2">
                        <TrendingUp className="w-4 h-4 text-amber-500 mr-1.5 flex-shrink-0 mt-0.5" />
                        <span className="font-sans">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase font-mono mb-2 tracking-wider">
                    {t.potentialGrowth}
                  </h4>
                  <ul className="space-y-2">
                    {userProfile.aiPotential?.map((p, idx) => (
                      <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start space-x-2">
                        <Star className="w-4 h-4 text-blue-500 mr-1.5 flex-shrink-0 mt-0.5" />
                        <span className="font-sans">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 flex flex-col justify-center items-center">
                <HelpCircle className="w-12 h-12 text-slate-400 mb-4 stroke-[1.5]" />
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed font-sans">
                  {lang === "fr" 
                    ? "Aucune analyse sémantique n'a encore été générée. Remplissez vos informations et cliquez sur 'Lancer l'Analyse'."
                    : "No validation data processed yet. Complete your profile attributes and click 'Run AI Analysis'."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
