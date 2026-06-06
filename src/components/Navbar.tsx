import React, { useState, useRef, useEffect } from "react";
import { 
  Menu, X, Sun, Moon, Globe, LogOut, Briefcase, Zap, User, 
  Home, Brain, Award, Compass, Users, Sparkles, Settings, ChevronDown 
} from "lucide-react";
import { Language, Theme } from "../lib/translations";
import { UserProfile } from "../types";

interface NavbarProps {
  lang: Language;
  setLang: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  userProfile: UserProfile | null;
  onLogout: () => void;
  t: any;
}

export default function Navbar({
  lang,
  setLang,
  theme,
  setTheme,
  currentTab,
  setCurrentTab,
  userProfile,
  onLogout,
  t,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setWorkspaceOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleLanguage = () => {
    setLang(lang === "fr" ? "en" : "fr");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isActive = (tab: string) => currentTab === tab;

  const handleTabClick = (tab: string) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
    setWorkspaceOpen(false);
  };

  // Helper to compute overall competency percentage baseline or AI average
  const getCompetencyPercentage = () => {
    if (!userProfile) return 0;
    if (userProfile.aiScores) {
      const { technical, communication, leadership, creativity, problemSolving } = userProfile.aiScores;
      return Math.round((technical + communication + leadership + creativity + problemSolving) / 5);
    }
    // Base estimation when not yet fully processed by Gemini
    let base = 35;
    if (userProfile.skills && userProfile.skills.length > 0) base += 5;
    if (userProfile.experience) base += 10;
    if (userProfile.certifications) base += 10;
    if (userProfile.projects) base += 10;
    return Math.min(base, 65); // Cap initial raw estimation before real evaluation
  };

  const progressPercentage = getCompetencyPercentage();

  // Navigation menu items for the dropdown workspace selector
  const workspaceItems = [
    { key: "dashboard", label: lang === "fr" ? "Accueil" : "Home", icon: Home },
    { key: "profile", label: lang === "fr" ? "Profil" : "Profile", icon: User },
    { key: "analyse_ia", label: "Analyse IA", icon: Brain },
    { key: "talent_score", label: "Talent Score", icon: Award },
    { key: "challenges", label: lang === "fr" ? "Défis" : "Challenges", icon: Zap },
    { key: "roadmap", label: "Roadmap", icon: Compass },
    { key: "coach", label: "Coach IA", icon: Users },
    { key: "future", label: lang === "fr" ? "Mon Avenir" : "Discover My Future", icon: Sparkles },
    { key: "settings", label: lang === "fr" ? "Paramètres" : "Settings", icon: Settings }
  ];

  const currentTabLabel = workspaceItems.find(item => item.key === currentTab)?.label || t.dashboard;

  return (
    <nav className="border-b transition-colors duration-200 bg-white dark:bg-[#0F172A] border-slate-100 dark:border-slate-800/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleTabClick("home")}>
            <div id="app-logo" className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-none animate-pulse">
              <span className="text-white text-xl font-bold font-display tracking-tight">S</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-900 dark:text-white leading-tight tracking-tight font-display">
                SkillOn
              </span>
            </div>
          </div>

          {/* Desktop WORKSPACE HUB DROPDOWN SELECTOR WITH HAMBURGER */}
          {userProfile && (
            <div className="hidden lg:flex items-center" ref={dropdownRef}>
              <div className="relative">
                <button
                  id="workspace-dropdown-trigger"
                  type="button"
                  onClick={() => setWorkspaceOpen(!workspaceOpen)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all cursor-pointer flex items-center space-x-2.5 border border-slate-100 dark:border-slate-800"
                  aria-label="Toggle Workspace Dropdown"
                >
                  <Menu className="w-4 h-4 text-[#2563EB]" />
                  <span className="text-slate-400">|</span>
                  <span>{lang === "fr" ? "Espace de travail" : "Workspace Hub"} :</span>
                  <span className="text-[#2563EB] font-bold">{currentTabLabel}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${workspaceOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown menu items */}
                {workspaceOpen && (
                  <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 shadow-xl py-2.5 z-55 animate-fade-in text-left">
                    <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase tracking-wider px-4 pb-2 border-b border-slate-50 dark:border-slate-800/85 mb-1.5">
                      {lang === "fr" ? "Modules Disponibles" : "Workspace Areas"}
                    </span>
                    <div className="max-h-[75vh] overflow-y-auto space-y-0.5 px-1.5">
                      {workspaceItems.map((item) => {
                        const tabActive = isActive(item.key);
                        const IconComponent = item.icon;

                        return (
                          <button
                            key={item.key}
                            onClick={() => handleTabClick(item.key)}
                            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
                              tabActive
                                ? "bg-blue-50/70 dark:bg-blue-950/20 text-[#2563EB] font-bold"
                                : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white"
                            }`}
                          >
                            <IconComponent className={`w-4 h-4 ${tabActive ? "text-[#2563EB]" : "text-slate-400 dark:text-slate-500"}`} />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Tools (Theme, Language, and sign-out) */}
          <div className="flex items-center space-x-3">
            {/* Display logged skill percentage rather than experience points */}
            {userProfile && (
              <div
                id="user-score-badge"
                className="flex items-center px-3.5 py-1.5 rounded-full bg-blue-50/80 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/60"
                title={lang === "fr" ? "Niveau de maîtrise algorithmique global" : "Global algorithmic mastery rate"}
              >
                <Zap className="w-3.5 h-3.5 text-[#2563EB] mr-1.5 fill-current animate-bounce" />
                <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-450">
                  {progressPercentage}% {lang === "fr" ? "Maîtrise" : "Mastery"}
                </span>
              </div>
            )}

            {/* Language Switcher Button */}
            <button
              id="btn-toggle-lang"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleLanguage();
              }}
              className="p-2 rounded-lg transition-colors bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              title="Switch Language / Basculer de langue"
              aria-label="Language Toggle"
            >
              <Globe className="w-4 h-4" />
            </button>

            {/* Theme Toggle Button */}
            <button
              id="btn-toggle-theme"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleTheme();
              }}
              className="p-2 rounded-lg transition-colors bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              title="Toggle Light/Dark Theme"
              aria-label="Theme Toggle"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Sign Out Trigger */}
            {userProfile && (
              <button
                id="btn-logout"
                onClick={onLogout}
                className="hidden md:flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40 text-xs font-medium transition-all"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.signOut}</span>
              </button>
            )}

            {!userProfile && currentTab !== "auth" && (
              <button
                id="btn-login-header"
                onClick={() => handleTabClick("auth")}
                className="px-4 py-2 text-xs font-semibold tracking-wide rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm transition-all"
              >
                {t.login}
              </button>
            )}

            {/* Mobile Menu Icon */}
            <div className="flex items-center lg:hidden">
              <button
                id="btn-mobile-menu"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Toggle Mobile navigation bar"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content Expand */}
      {mobileMenuOpen && userProfile && (
        <div className="lg:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0F172A] px-2 pt-2 pb-3 space-y-1">
          <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider px-3 pt-1">
            {lang === "fr" ? "Espace de travail" : "Workspace Hub"}
          </span>
          {workspaceItems.map((item) => {
            const hasFocus = isActive(item.key);
            const IconComponent = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => handleTabClick(item.key)}
                className={`w-full text-left flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold ${
                  hasFocus ? "text-[#2563EB] bg-blue-50/55 dark:bg-blue-950/30 font-bold" : "text-gray-750 dark:text-gray-350"
                }`}
              >
                <IconComponent className="w-4 h-4 text-slate-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
          
          <div className="border-t border-gray-100 dark:border-gray-800 pt-2 mt-2">
            <button
              onClick={onLogout}
              className="w-full text-left flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              <LogOut className="w-5 h-5" />
              <span>{t.signOut}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
