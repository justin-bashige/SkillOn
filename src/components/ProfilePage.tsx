import React, { useState, useRef } from "react";
import { User, Key, Save, AlertCircle, Sparkles, Check, Github, BookOpen, Award, FileText, Star, TrendingUp, HelpCircle, Upload, Cpu, Brain, RefreshCw } from "lucide-react";
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

  // CV Importer state variables
  const [isDragging, setIsDragging] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [pastedText, setPastedText] = useState("");
  const [showImporter, setShowImporter] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleAiAnalysis = async (customPayload?: any) => {
    setAnalyzing(true);
    setMessage("");
    setErrorMsg("");
    setProgressMsg(lang === "fr" ? "Analyse sémantique intensive par Gemini..." : "Processing full-profile evaluation...");

    try {
      let profilePayload = customPayload;
      if (!profilePayload) {
        // Save contemporary text fields to index
        const skillList = skills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0);

        profilePayload = {
          displayName: userProfile.displayName,
          skills: skillList,
          certifications,
          experience,
          education,
          github,
          projects,
          interests,
        };

        const userRef = doc(db, "users", userProfile.userId);
        await updateDoc(userRef, profilePayload);
        setUserProfile((prev: any) => ({
          ...prev,
          ...profilePayload,
        }));
      }

      const res = await fetch("/api/analyze-full-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: profilePayload, lang }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to analyze skills");
      }

      const report = await res.json();

      // If we got extracted fields, sync the local state text boxes so they populate instantly!
      const extractionData = report.extractedProfile ? {
        skills: report.extractedProfile.skills || [],
        experience: report.extractedProfile.experience || "",
        education: report.extractedProfile.education || "",
        certifications: report.extractedProfile.certifications || "",
        projects: report.extractedProfile.projects || "",
        interests: report.extractedProfile.interests || "",
      } : {};

      if (report.extractedProfile) {
        setSkills(report.extractedProfile.skills.join(", "));
        setExperience(report.extractedProfile.experience || "");
        setEducation(report.extractedProfile.education || "");
        setCertifications(report.extractedProfile.certifications || "");
        setProjects(report.extractedProfile.projects || "");
        setInterests(report.extractedProfile.interests || "");
      }

      const updatedProfile = {
        ...extractionData,
        aiSummary: report.summary,
        aiStrengths: report.strengths,
        aiWeaknesses: report.weaknesses,
        aiPotential: report.potential,
        aiScores: report.scores,
        aiRoadmap: report.roadmap,
        aiFuturePrediction: report.futurePrediction,
      };

      const userRef = doc(db, "users", userProfile.userId);
      await updateDoc(userRef, updatedProfile);

      setUserProfile((prev: any) => ({
        ...prev,
        ...updatedProfile,
      }));

      setMessage(lang === "fr" 
        ? "Super ! Votre profil a été entièrement mis à jour et réanalysé. Vos scores (radar), roadmap et prédictions d'avenir de carrière sont synchronisés !" 
        : "Awesome! Your profile has been thoroughly updated and analyzed. Your competency scores (radar), roadmap, and career predictions are fully synchronized!");
      setShowImporter(false);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred with the Gemini API server.");
    } finally {
      setAnalyzing(false);
      setProgressMsg("");
    }
  };

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
    setErrorMsg("");

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg("");
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    setProgressMsg(lang === "fr" ? "Préparation du document pour l'IA..." : "Preparing document for AI analysis...");
    const reader = new FileReader();

    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) {
        setErrorMsg(lang === "fr" ? "Le document sélectionné n'a pas pu être lu." : "The selected document could not be read.");
        return;
      }
      const commaIndex = dataUrl.indexOf(",");
      const base64 = dataUrl.substring(commaIndex + 1);
      const mimeType = file.type || "application/pdf";

      runGeminiCvFileParser(base64, mimeType, file.name);
    };

    reader.onerror = () => {
      setErrorMsg(lang === "fr" ? "Erreur lors de la lecture du fichier." : "Error occurred while reading the file.");
    };

    reader.readAsDataURL(file);
  };

  const runGeminiCvFileParser = async (base64: string, mimeType: string, filename: string) => {
    setAnalyzing(true);
    setErrorMsg("");
    setMessage("");
    setProgressMsg(lang === "fr" ? "Validation et structuration de votre document par l'IA..." : "AI validation and structured processing of your document...");

    try {
      const res = await fetch("/api/analyze-full-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileData: { base64, mimeType, filename }, lang }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to analyze profiles");
      }

      setProgressMsg(lang === "fr" ? "Synchronisation de vos compétences..." : "Saving cognitive professional coordinates...");
      const report = await res.json();

      if (report.isValidProfile === false) {
        setErrorMsg(report.validationFeedback);
        return;
      }

      // If we got extracted fields, sync local state inputs instantly!
      if (report.extractedProfile) {
        setSkills(report.extractedProfile.skills.join(", "));
        setExperience(report.extractedProfile.experience || "");
        setEducation(report.extractedProfile.education || "");
        setCertifications(report.extractedProfile.certifications || "");
        setProjects(report.extractedProfile.projects || "");
        setInterests(report.extractedProfile.interests || "");
      }

      const updatedProfile = {
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
        aiRoadmap: report.roadmap,
        aiFuturePrediction: report.futurePrediction,
      };

      const userRef = doc(db, "users", userProfile.userId);
      await updateDoc(userRef, updatedProfile);

      setUserProfile((prev: any) => ({
        ...prev,
        ...updatedProfile,
      }));

      setMessage(lang === "fr" 
        ? "Succès ! Votre document a été importé, les champs ont été remplis, et l'IA a mis à jour votre score, roadmap et prédictions de carrière !" 
        : "Success! Your portfolio document has been successfully imported, text fields populated, and scores, roadmap, and future outlook synced!");
      setShowImporter(false);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Could not complete the semantic analysis correctly.");
    } finally {
      setAnalyzing(false);
      setProgressMsg("");
    }
  };

  const runGeminiCvParser = async (rawText: string) => {
    setAnalyzing(true);
    setErrorMsg("");
    setMessage("");
    setProgressMsg(lang === "fr" ? "Analyse et structuration intelligente de votre profil par l'IA..." : "AI processing and structuring of your text...");

    try {
      const res = await fetch("/api/analyze-full-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawCvText: rawText, lang }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to analyze profile text");
      }

      setProgressMsg(lang === "fr" ? "Consolidation sémantique du profil..." : "Saving career brain details...");
      const report = await res.json();

      if (report.isValidProfile === false) {
        setErrorMsg(report.validationFeedback);
        return;
      }

      // If we got extracted fields, sync local state inputs instantly!
      if (report.extractedProfile) {
        setSkills(report.extractedProfile.skills.join(", "));
        setExperience(report.extractedProfile.experience || "");
        setEducation(report.extractedProfile.education || "");
        setCertifications(report.extractedProfile.certifications || "");
        setProjects(report.extractedProfile.projects || "");
        setInterests(report.extractedProfile.interests || "");
      }

      const updatedProfile = {
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
        aiRoadmap: report.roadmap,
        aiFuturePrediction: report.futurePrediction,
      };

      const userRef = doc(db, "users", userProfile.userId);
      await updateDoc(userRef, updatedProfile);

      setUserProfile((prev: any) => ({
        ...prev,
        ...updatedProfile,
      }));

      setMessage(lang === "fr" 
        ? "Succès ! Vos informations ont été analysées, les champs ont été remplis, et l'IA a mis à jour votre score, roadmap et prédictions de carrière !" 
        : "Success! Your text bio has been successfully processed, fields updated, and future outlook synced!");
      setShowImporter(false);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Could not complete the semantic analysis correctly.");
    } finally {
      setAnalyzing(false);
      setProgressMsg("");
    }
  };

  const handlePasteSubmit = () => {
    if (!pastedText.trim()) {
      setErrorMsg(lang === "fr" ? "Veuillez d'abord coller des informations." : "Please paste some profile bio text first.");
      return;
    }
    runGeminiCvParser(pastedText);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="md:flex md:items-center md:justify-between border-b border-slate-100 dark:border-slate-800 pb-6 mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display font-display">
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
            id="btn-toggle-importer"
            onClick={() => setShowImporter(!showImporter)}
            disabled={saving || analyzing}
            className="inline-flex items-center px-4 py-2.5 border border-[#2563EB] hover:bg-blue-50 dark:hover:bg-blue-950/20 text-[#2563EB] rounded-lg text-sm font-semibold cursor-pointer disabled:opacity-50"
          >
            <Upload className="w-4 h-4 mr-2" />
            {lang === "fr" ? "Importer un CV" : "Import CV"}
          </button>

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
            onClick={() => handleAiAnalysis()}
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
          
          {/* AI Importer Section If Toggled */}
          {showImporter && (
            <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-blue-500/20 dark:border-blue-500/30 p-6 shadow-md space-y-5 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-[#2563EB]" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                    {lang === "fr" ? "Module d'Importation Intelligence CV" : "AI Cognitive Resume Importer"}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowImporter(false)}
                  className="text-xs text-slate-450 hover:text-slate-600 dark:hover:text-slate-300 font-semibold cursor-pointer"
                >
                  {lang === "fr" ? "Fermer" : "Close"}
                </button>
              </div>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-[#2563EB] bg-blue-500/5"
                    : "border-slate-200 dark:border-slate-700 hover:border-[#2563EB] hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
                }`}
              >
                <input
                  type="file"
                  id="cv-file-uploader"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".txt,.md,.json,.rtf,.pdf,.docx"
                  className="hidden"
                />
                <Upload className="w-10 h-10 text-[#2563EB] mx-auto mb-2 stroke-[1.5]" />
                <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1 font-display">
                  {lang === "fr" ? "Téléverser votre CV ou document (.pdf, .docx, .txt, .md)" : "Upload CV or Professional Document (.pdf, .docx, .txt, .md)"}
                </h5>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed max-w-sm mx-auto">
                  {lang === "fr"
                    ? "Glissez-déposez ici ou cliquez pour choisir un fichier. Vos informations rempliront le formulaire automatiquement et l'IA synchronisera tout !"
                    : "Drop files or click to browse. Your fields will autofill and all AI stats will sync instantly!"}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase font-mono tracking-wider block">
                  {lang === "fr" ? "Ou coller votre texte libre brut" : "Or paste raw resume content text"}
                </label>
                <textarea
                  rows={4}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-150 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-blue-500/5 font-sans leading-relaxed"
                  placeholder={
                    lang === "fr"
                      ? "Exemple : Développeur React avec 4 ans d'expérience. Certifié Google Cloud Architect..."
                      : "Example: React developer with 4 years experience. Certified Google Cloud Cloud Architect..."
                  }
                />
                <div className="flex justify-end pt-1">
                  <button
                    id="btn-import-raw-cv"
                    onClick={handlePasteSubmit}
                    disabled={analyzing}
                    className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{lang === "fr" ? "Extraire & Analyser par l'IA" : "Extract & Analyze with AI"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* AI Loader Overlay / Active Running Indicator */}
          {analyzing && progressMsg && (
            <div className="p-8 text-center bg-blue-500/5 border border-blue-500/10 rounded-2xl shadow-sm space-y-3 animate-pulse">
              <div className="w-8 h-8 border-3 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto" />
              <h4 className="text-xs font-bold text-[#2563EB] font-mono uppercase tracking-wider">
                {lang === "fr" ? "SYNCHRONISATION IA COMPLÈTE EN COURS..." : "FULL AI SYNCHRONIZATION IN PROGRESS..."}
              </h4>
              <p className="text-[11px] text-slate-550 dark:text-slate-400">
                {progressMsg}
              </p>
            </div>
          )}

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
