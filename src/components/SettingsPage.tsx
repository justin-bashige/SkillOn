import React, { useState } from "react";
import { Settings, Globe, Sun, Moon, ShieldCheck, Database, HelpCircle, HardDrive, Check } from "lucide-react";
import { Language, Theme } from "../lib/translations";
import { UserProfile } from "../types";
import { db } from "../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

interface SettingsPageProps {
  t: any;
  lang: Language;
  setLang: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  userProfile: UserProfile;
}

export default function SettingsPage({
  t,
  lang,
  setLang,
  theme,
  setTheme,
  userProfile,
}: SettingsPageProps) {
  const [privacyChecked, setPrivacyChecked] = useState(true);
  const [autoUpdateChecked, setAutoUpdateChecked] = useState(true);
  const [diagPermsChecked, setDiagPermsChecked] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleUpdateSettings = async () => {
    setSavedSuccess(false);
    
    try {
      const userRef = doc(db, "users", userProfile.userId);
      await updateDoc(userRef, {
        langPreference: lang,
        themePreference: theme,
      });
      
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error("Error setting custom language themes preferences:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-6 mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center font-display">
          <Settings className="w-8 h-8 mr-2.5 text-[#2563EB]" />
          <span>{t.settingsTitle}</span>
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-sans">
          {lang === "fr" 
            ? "Gérez vos options linguistiques, thématiques et diagnostic confidentiel." 
            : "Control language triggers, core interface rules, and analytical indicators."}
        </p>
      </div>

      {savedSuccess && (
        <div id="settings-success-banner" className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 rounded-xl text-sm flex items-center space-x-2">
          <Check className="w-5 h-5 flex-shrink-0" />
          <span>{t.settingsSaveSuccess}</span>
        </div>
      )}

      <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-101 dark:border-slate-800 shadow-sm p-6 space-y-8">
        {/* Language preference selector */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="max-w-md">
            <span className="block text-sm font-bold text-slate-900 dark:text-white flex items-center font-display">
              <Globe className="w-4 h-4 mr-2 text-blue-500" />
              {t.settingsLang}
            </span>
            <span className="block text-xs text-slate-400 mt-1 font-sans">
              {lang === "fr" 
                ? "Choisissez votre langue d'interface par défaut." 
                : "Choose your preferred primary navigation terms."}
            </span>
          </div>
          <div className="mt-4 sm:mt-0 flex whitespace-nowrap bg-[#F8FAFC] dark:bg-[#0F172A] p-1 rounded-xl border border-slate-100 dark:border-slate-800/40">
            <button
              id="set-lang-fr"
              onClick={() => {
                setLang("fr");
                setTimeout(() => handleUpdateSettings(), 50);
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                lang === "fr" 
                  ? "bg-white dark:bg-[#1E293B] text-[#2563EB] shadow-sm" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
              }`}
            >
              Français (Default)
            </button>
            <button
              id="set-lang-en"
              onClick={() => {
                setLang("en");
                setTimeout(() => handleUpdateSettings(), 50);
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                lang === "en" 
                  ? "bg-white dark:bg-[#1E293B] text-[#2563EB] shadow-sm" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Theme preference switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="max-w-md">
            <span className="block text-sm font-bold text-slate-900 dark:text-white flex items-center font-display">
              {theme === "dark" ? <Moon className="w-4 h-4 mr-2 text-amber-500" /> : <Sun className="w-4 h-4 mr-2 text-amber-500" />}
              {t.settingsTheme}
            </span>
            <span className="block text-xs text-slate-400 mt-1 font-sans">
              {lang === "fr" 
                ? "Basculez entre le thème clair et le thème sombre." 
                : "Toggle visual color schemes."}
            </span>
          </div>
          <div className="mt-4 sm:mt-0 flex whitespace-nowrap bg-[#F8FAFC] dark:bg-[#0F172A] p-1 rounded-xl border border-slate-100 dark:border-slate-800/40">
            <button
              id="set-theme-light"
              onClick={() => {
                setTheme("light");
                setTimeout(() => handleUpdateSettings(), 50);
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                theme === "light" 
                  ? "bg-white dark:bg-[#1E293B] text-[#2563EB] shadow-sm" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
              }`}
            >
              Light Mode
            </button>
            <button
              id="set-theme-dark"
              onClick={() => {
                setTheme("dark");
                setTimeout(() => handleUpdateSettings(), 50);
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                theme === "dark" 
                  ? "bg-white dark:bg-[#1E293B] text-[#2563EB] shadow-sm" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
              }`}
            >
              Dark Mode
            </button>
          </div>
        </div>

        {/* Confidentiality Privacy toggles */}
        <div className="space-y-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <h4 className="text-xs font-bold text-slate-405 dark:text-slate-555 tracking-wider uppercase font-mono">
            {t.settingsPrivacy}
          </h4>

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 font-sans">
              {lang === "fr" ? "Isoler mes informations de profil du réseau public" : "Private portfolio access boundaries"}
            </span>
            <input
              id="toggle-privacy"
              type="checkbox"
              checked={privacyChecked}
              onChange={(e) => setPrivacyChecked(e.target.checked)}
              className="w-4 h-4 rounded text-[#2563EB] focus:ring-[#2563EB]"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 font-sans">
              {t.settingsAutoUpdate}
            </span>
            <input
              id="toggle-auto-update"
              type="checkbox"
              checked={autoUpdateChecked}
              onChange={(e) => setAutoUpdateChecked(e.target.checked)}
              className="w-4 h-4 rounded text-[#2563EB] focus:ring-[#2563EB]"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 font-sans">
              {t.diagnosticPerms}
            </span>
            <input
              id="toggle-diag-perms"
              type="checkbox"
              checked={diagPermsChecked}
              onChange={(e) => setDiagPermsChecked(e.target.checked)}
              className="w-4 h-4 rounded text-[#2563EB] focus:ring-[#2563EB]"
            />
          </div>
        </div>

        {/* Security / DB context info indicators */}
        <div className="p-4 bg-[#F8FAFC] dark:bg-[#0F172A] rounded-xl border border-slate-100 dark:border-slate-800 flex items-start space-x-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
          <Database className="w-5 h-5 text-[#2563EB] mt-0.5 flex-shrink-0" />
          <p>{t.creditsLabel}</p>
        </div>
      </div>
    </div>
  );
}
