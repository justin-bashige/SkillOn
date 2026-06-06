import React, { useState, useRef } from "react";
import { Sparkles, Upload, AlertCircle, CheckCircle2, RefreshCw, Cpu, Brain, ShieldAlert, Award } from "lucide-react";
import { UserProfile } from "../types";
import { db } from "../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

interface AnalyseIaProps {
  t: any;
  lang: "fr" | "en";
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  setCurrentTab?: (tab: string) => void;
}

export default function AnalyseIa({ t, lang, userProfile, setUserProfile, setCurrentTab }: AnalyseIaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [pastedText, setPastedText] = useState("");
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState("");
  const [progressMsg, setProgressMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasScores = !!userProfile.aiScores;

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setParseError("");

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParseError("");
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    setProgressMsg(lang === "fr" ? "Lecture du fichier d'expérience..." : "Reading experiences document...");
    const reader = new FileReader();

    reader.onload = async (event) => {
      const fileContent = event.target?.result as string;
      if (!fileContent || fileContent.trim().length === 0) {
        setParseError(lang === "fr" ? "Le document est vide." : "The selected file is empty.");
        return;
      }
      runGeminiParser(fileContent);
    };

    reader.onerror = () => {
      setParseError(lang === "fr" ? "Erreur lors de l'accès au fichier." : "Error occurred while reading the file.");
    };

    reader.readAsText(file);
  };

  const runGeminiParser = async (rawText: string) => {
    setParsing(true);
    setParseError("");
    setProgressMsg(lang === "fr" ? "Analyse sémantique par Gemini 1.5 en cours..." : "Invoking Gemini Semantic Brain Analysis...");

    try {
      const res = await fetch("/api/analyze-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawCvText: rawText, lang }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to analyze layout profiles");
      }

      setProgressMsg(lang === "fr" ? "Consolidation du profil cognitif..." : "Saving cognitive talent coordinates...");
      const report = await res.json();

      const updatedProfile: Partial<UserProfile> = {
        skills: report.extractedProfile?.skills || [],
        experience: report.extractedProfile?.experience || "",
        education: report.extractedProfile?.education || "",
        certifications: report.extractedProfile?.certifications || "",
        projects: report.extractedProfile?.projects || "",
        interests: report.extractedProfile?.interests || "",
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
    } catch (err: any) {
      console.error(err);
      setParseError(err.message || "Could not complete the semantic analysis correctly.");
    } finally {
      setParsing(false);
      setProgressMsg("");
    }
  };

  const handlePasteSubmit = () => {
    if (!pastedText.trim()) {
      setParseError(lang === "fr" ? "Veuillez d'abord coller des informations." : "Please paste some profile bio text first.");
      return;
    }
    runGeminiParser(pastedText);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      
      {/* Header Info */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
            Analyse IA
          </h2>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 font-sans">
            {lang === "fr"
              ? "Examinez vos compétences acquises et modélisez votre baseline technique."
              : "Review competencies indices and map your baseline sémantiques."}
          </p>
        </div>
      </div>

      {parseError && (
        <div id="analyse-error" className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 rounded-xl text-xs flex items-center space-x-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{parseError}</span>
        </div>
      )}

      {/* RENDER THE RESULTS IF ANALYZED */}
      {hasScores ? (
        <div className="space-y-8 animate-fade-in">
          
          {/* Header summary of current stats */}
          <div className="p-6 bg-[#2563EB] text-white rounded-2xl flex flex-col md:flex-row md:items-center justify-between shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-2 relative z-10">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-white/10 px-2.5 py-1 rounded">
                🤖 PROCESSED ACTIVE REPORT
              </span>
              <h3 className="text-xl font-bold font-display">
                {lang === "fr" ? "Analyse Terminée avec Succès" : "Analysis Finished Successfully"}
              </h3>
              <p className="text-xs text-blue-100/90 max-w-xl font-sans">
                {lang === "fr"
                  ? "Votre Talent Score et vos plans d'études sont maintenant calculés de manière résiliente."
                  : "Your cognitive profile is linked and indexed in real time."}
              </p>
            </div>

            <button
              id="btn-re-analyze"
              onClick={() => {
                // Clear state to let them re-evaluate
                window.confirm(lang === "fr" ? "Voulez-vous ré-analyser un nouveau document ?" : "Do you want to run a new evaluation?") && setUserProfile((prev: any) => ({ ...prev, aiScores: undefined }));
              }}
              className="mt-4 md:mt-0 px-5 py-2.5 bg-white text-blue-600 hover:bg-blue-50 font-bold text-xs rounded-xl shadow transition-colors flex items-center space-x-2 relative z-10 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{lang === "fr" ? "Ré-évaluer mon profil" : "Re-evaluate Profile"}</span>
            </button>
          </div>

          {/* Gemini Summary Section */}
          <div className="p-8 bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider flex items-center space-x-2">
              <Brain className="w-4.5 h-4.5 text-[#2563EB]" />
              <span>{lang === "fr" ? "Résumé Analyse IA" : "AI Review Summary"}</span>
            </h4>
            <p className="text-sm text-slate-605 dark:text-slate-300 leading-relaxed font-sans font-normal">
              {userProfile.aiSummary}
            </p>
          </div>

          {/* Column Grid fields: Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Strengths */}
            <div className="p-6 bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
              <h5 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase font-mono tracking-wider flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{lang === "fr" ? "points forts révélés" : "identified key strengths"}</span>
              </h5>
              <div className="space-y-2.5">
                {userProfile.aiStrengths?.map((st, sIdx) => (
                  <div key={sIdx} className="p-3 bg-emerald-500/5 text-slate-705 dark:text-slate-300 text-xs rounded-xl border border-emerald-500/10 flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{st}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weaknesses */}
            <div className="p-6 bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
              <h5 className="text-sm font-bold text-red-600 dark:text-red-450 uppercase font-mono tracking-wider flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4" />
                <span>{lang === "fr" ? "axes d'amélioration" : "operational vulnerabilities"}</span>
              </h5>
              <div className="space-y-2.5">
                {userProfile.aiWeaknesses?.map((wk, wIdx) => (
                  <div key={wIdx} className="p-3 bg-red-500/5 text-slate-705 dark:text-slate-300 text-xs rounded-xl border border-red-500/10 flex items-start space-x-2.5">
                    <ShieldAlert className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>{wk}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Growth Opportunities Potential spheres */}
          <div className="p-8 bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-6">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider flex items-center space-x-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Award className="w-4.5 h-4.5 text-blue-500" />
              <span>{lang === "fr" ? "Potentialité et Métiers Recommandés" : "Expansion targets and potential careers"}</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {userProfile.aiPotential?.map((p, pIdx) => (
                <div key={pIdx} className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  <span className="text-[10px] font-mono font-bold text-[#2563EB] block mb-2 uppercase">POTENTIAL TARGET 0{pIdx+1}</span>
                  {p}
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* OTHERWISE RENDER COGNITIVE UPLOADER FORM Zone */
        <div className="max-w-3xl mx-auto mt-6 space-y-8">
          
          <div className="text-center space-y-2">
            <Cpu className="w-12 h-12 text-[#2563EB] mx-auto mb-2 stroke-[1.5]" />
            <h3 className="text-xl font-bold text-slate-905 dark:text-white font-display">
              {lang === "fr" ? "Initialisez votre Profil maintenant" : "Bootstrap Your Cognitive Score Level"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              {lang === "fr"
                ? "Téléversez votre CV ou copiez-collez vos informations pour que Gemini trace vos indices de compétences."
                : "Provide raw text or resume files to allow our algorithm evaluate baseline metrics."}
            </p>
          </div>

          {parsing ? (
            /* ACTIVE RUNNING AI TIMER loader */
            <div className="p-12 text-center bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
              <div className="w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider">
                {lang === "fr" ? "ACQUISITION IA EN COURS" : "AI PROCESSING RUNNING"}
              </h4>
              <p className="text-xs text-slate-505 dark:text-slate-400 animate-pulse">
                {progressMsg}
              </p>
            </div>
          ) : (
            /* UPLOADER CONTROLS */
            <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-100 dark:border-slate-800/80 p-8 shadow-sm space-y-8">
              
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-[#2563EB] bg-blue-500/5"
                    : "border-slate-200 dark:border-slate-700 hover:border-[#2563EB] hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".txt,.md,.json,.rtf"
                  className="hidden"
                />
                <Upload className="w-12 h-12 text-[#2563EB] mx-auto mb-3 stroke-[1.5]" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1 font-display">
                  {lang === "fr" ? "Téléverser votre document d'expérience (.txt, .md, .json)" : "Upload CV File (.txt, .md, .json)"}
                </h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed max-w-sm mx-auto">
                  {lang === "fr"
                    ? "Glissez votre document ou cliquez pour parcourir votre bureau. (Pour les fichiers PDF ou Word, copiez le contenu en texte libre ci-dessous)."
                    : "Drop document file or search to browse. (For Word/PDF profiles copy and paste raw text labels down below)."}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-slate-500 dark:text-slate-400 uppercase font-mono tracking-wider block">
                    {lang === "fr" ? "Ou coller votre texte libre (LinkedIn / CV / Projets)" : "Or copy paste raw bio text"}
                  </label>
                  <span className="text-[10px] text-slate-450 font-mono font-medium">Alternative</span>
                </div>
                <textarea
                  rows={5}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  className="w-full px-4 py-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/5 font-sans leading-relaxed"
                  placeholder={
                    lang === "fr"
                      ? "Exemple : Développeur Web avec 3 ans de pratique. Passionné par React, Node, et TypeScript. J'ai réalisé des projets de gestion d'API et de bases de données..."
                      : "Example: Frontend builder focused on building React and Node applications. Dedicated to mastering clean component logic and custom hooks..."
                  }
                />
                <div className="flex justify-end pt-2">
                  <button
                    id="btn-pasted-analyze-la"
                    onClick={handlePasteSubmit}
                    disabled={parsing}
                    className="px-6 py-3 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow transition-colors flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{lang === "fr" ? "Lancer l'analyse IA" : "Execute AI Review"}</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
