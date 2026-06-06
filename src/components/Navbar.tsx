import React, { useState } from "react";
import { Menu, X, Sun, Moon, Globe, Trophy, LogOut, Briefcase, Zap, User } from "lucide-react";
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
  };

  return (
    <nav className="border-b transition-colors duration-200 bg-white dark:bg-[#0F172A] border-slate-100 dark:border-slate-800/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleTabClick("home")}>
            {/* Minimalist Logo conforming exactly to prompt specifications */}
            <div id="app-logo" className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-none">
              <span className="text-white text-xl font-bold font-display tracking-tight">S</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-900 dark:text-white leading-tight tracking-tight font-display">
                SkillOn
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          {userProfile && (
            <div className="hidden lg:flex items-center space-x-1">
              <button
                id="tab-dashboard"
                onClick={() => handleTabClick("dashboard")}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive("dashboard")
                    ? "text-[#2563EB] bg-[#F8FAFC] dark:bg-slate-900 font-semibold"
                    : "text-slate-600 dark:text-gray-300 hover:text-[#2563EB] hover:bg-[#F8FAFC]/50 dark:hover:bg-gray-800/50"
                }`}
              >
                {t.dashboard}
              </button>
              <button
                id="tab-profile"
                onClick={() => handleTabClick("profile")}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive("profile")
                    ? "text-[#2563EB] bg-[#F8FAFC] dark:bg-slate-900 font-semibold"
                    : "text-slate-600 dark:text-gray-300 hover:text-[#2563EB] hover:bg-[#F8FAFC]/50 dark:hover:bg-gray-800/50"
                }`}
              >
                {t.profile}
              </button>
              {userProfile.aiScores && (
                <>
                  <button
                    id="tab-roadmap"
                    onClick={() => handleTabClick("roadmap")}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive("roadmap")
                        ? "text-[#2563EB] bg-[#F8FAFC] dark:bg-slate-900 font-semibold"
                        : "text-slate-600 dark:text-gray-300 hover:text-[#2563EB] hover:bg-[#F8FAFC]/50 dark:hover:bg-gray-800/50"
                    }`}
                  >
                    {t.roadmap}
                  </button>
                  <button
                    id="tab-coach"
                    onClick={() => handleTabClick("coach")}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive("coach")
                        ? "text-[#2563EB] bg-[#F8FAFC] dark:bg-slate-900 font-semibold"
                        : "text-slate-600 dark:text-gray-300 hover:text-[#2563EB] hover:bg-[#F8FAFC]/50 dark:hover:bg-gray-800/50"
                    }`}
                  >
                    {t.coach}
                  </button>
                  <button
                    id="tab-challenges"
                    onClick={() => handleTabClick("challenges")}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive("challenges")
                        ? "text-[#2563EB] bg-[#F8FAFC] dark:bg-slate-900 font-semibold"
                        : "text-slate-600 dark:text-gray-300 hover:text-[#2563EB] hover:bg-[#F8FAFC]/50 dark:hover:bg-gray-800/50"
                    }`}
                  >
                    {t.challenges}
                  </button>
                  <button
                    id="tab-future"
                    onClick={() => handleTabClick("future")}
                    className={`px-3.5 py-2 rounded-lg text-xs tracking-wide uppercase transition-all border border-blue-100 dark:border-blue-900/50 hover:border-blue-500 hover:bg-blue-500/10 ${
                      isActive("future")
                        ? "text-[#2563EB] bg-blue-50 dark:bg-blue-950/30 font-bold"
                        : "text-slate-600 dark:text-gray-300"
                    }`}
                  >
                    🔮 {t.future}
                  </button>
                </>
              )}
              <button
                id="tab-settings"
                onClick={() => handleTabClick("settings")}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive("settings")
                    ? "text-[#2563EB] bg-[#F8FAFC] dark:bg-slate-900 font-semibold"
                    : "text-slate-600 dark:text-gray-300 hover:text-[#2563EB] hover:bg-[#F8FAFC]/50 dark:hover:bg-gray-800/50"
                }`}
              >
                {t.settings}
              </button>
            </div>
          )}

          {/* Action Tools (Theme, Language, trophy, and sign-out) */}
          <div className="flex items-center space-x-3">
            {/* Display logged points with elegant trophy banner */}
            {userProfile && (
              <div
                id="user-score-badge"
                className="hidden md:flex items-center px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60"
                title={`${userProfile.points} Experience points`}
              >
                <Trophy className="w-4 h-4 text-amber-500 mr-1.5" />
                <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                  {userProfile.points} Pts
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
          <button
            onClick={() => handleTabClick("dashboard")}
            className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium ${
              isActive("dashboard") ? "text-[#2563EB] bg-blue-50/50 dark:bg-blue-950/20" : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {t.dashboard}
          </button>
          <button
            onClick={() => handleTabClick("profile")}
            className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium ${
              isActive("profile") ? "text-[#2563EB] bg-blue-50/50 dark:bg-blue-950/20" : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {t.profile}
          </button>
          {userProfile.aiScores && (
            <>
              <button
                onClick={() => handleTabClick("roadmap")}
                className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("roadmap") ? "text-[#2563EB] bg-blue-50/50 dark:bg-blue-950/20" : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {t.roadmap}
              </button>
              <button
                onClick={() => handleTabClick("coach")}
                className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("coach") ? "text-[#2563EB] bg-blue-50/50 dark:bg-blue-950/20" : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {t.coach}
              </button>
              <button
                onClick={() => handleTabClick("challenges")}
                className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("challenges") ? "text-[#2563EB] bg-blue-50/50 dark:bg-blue-950/20" : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {t.challenges}
              </button>
              <button
                onClick={() => handleTabClick("future")}
                className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium border border-blue-500/20 text-blue-600 dark:text-blue-400 bg-blue-50/10 ${
                  isActive("future") ? "bg-blend-darken text-semibold" : ""
                }`}
              >
                ✨ {t.future}
              </button>
            </>
          )}
          <button
            onClick={() => handleTabClick("settings")}
            className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium ${
              isActive("settings") ? "text-[#2563EB] bg-blue-50/50 dark:bg-blue-950/20" : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {t.settings}
          </button>
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
