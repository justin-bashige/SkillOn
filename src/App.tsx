import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./lib/firebase";
import { translations, Language, Theme } from "./lib/translations";
import { UserProfile } from "./types";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import AuthScreen from "./components/AuthScreen";
import Dashboard from "./components/Dashboard";
import ProfilePage from "./components/ProfilePage";
import AnalyseIa from "./components/AnalyseIa";
import TalentScore from "./components/TalentScore";
import CareerRoadmap from "./components/CareerRoadmap";
import AICoach from "./components/AICoach";
import AIChallenges from "./components/AIChallenges";
import DiscoverFuture from "./components/DiscoverFuture";
import SettingsPage from "./components/SettingsPage";

// Lucide icon imports for left sidebar navigation menu
import { Home, User, Brain, Award, Zap, Compass, Users, Sparkles, Settings, LogOut, Trophy } from "lucide-react";

export default function App() {
  // 1. Language State Control (Default to French "fr")
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem("skillon_lang");
    if (saved === "en" || saved === "fr") return saved as Language;
    return "fr";
  });

  // 2. Theme State Control (Default to "light")
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("skillon_theme");
    if (saved === "light" || saved === "dark" || saved === "system") return saved as Theme;
    return "light";
  });

  const [currentTab, setCurrentTab] = useState<string>("home");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Synchronize language and theme values to refs to prevent stale closure in auth listener
  const langRef = React.useRef(lang);
  const themeRef = React.useRef(theme);

  useEffect(() => {
    langRef.current = lang;
  }, [lang]);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  // Synchronize language to state and localStorage
  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("skillon_lang", newLang);
  };

  // Synchronize theme dynamically toggling tailwind `.dark` classes on document root
  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("skillon_theme", newTheme);
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      // System mode logic
      const darkPref = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (darkPref) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [theme]);

  // Setup Firebase state transitions - ONLY ONCE ON MOUNT
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthLoading(true);
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const snapshot = await getDoc(userDocRef);

          if (snapshot.exists()) {
            const data = snapshot.data();
            setUserProfile({
              userId: firebaseUser.uid,
              ...data
            } as UserProfile);
            // On sign in, redirect to dashboard if on home or auth screen
            setCurrentTab((prev) => (prev === "home" || prev === "auth" ? "dashboard" : prev));
          } else {
            // Document does not exist yet (e.g. first login via Google). Safely initialize default profile.
            const name = firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Candidate";
            const initialProfile: UserProfile = {
              userId: firebaseUser.uid,
              email: firebaseUser.email || "",
              displayName: name,
              skills: [],
              certifications: "",
              experience: "",
              education: "",
              github: "",
              projects: "",
              interests: "",
              points: 100, // Welcome points
              completedChallenges: [],
              langPreference: langRef.current,
              themePreference: themeRef.current,
            };

            await setDoc(userDocRef, initialProfile);
            setUserProfile(initialProfile);
            setCurrentTab("dashboard");
          }
        } catch (err) {
          console.error("Error synchronizing authenticated user profile from database:", err);
        }
      } else {
        setUserProfile(null);
        setCurrentTab("home");
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUserProfile(null);
    setCurrentTab("home");
  };

  const currentTranslations = translations[lang] || translations.fr;

  // Primary rendering router switcher
  const renderContent = () => {
    if (authLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 dark:text-gray-400">
          <div className="w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mb-4" />
          <span className="font-semibold text-sm tracking-wide font-mono animate-pulse">
            {currentTranslations.loading}
          </span>
        </div>
      );
    }

    switch (currentTab) {
      case "home":
        return (
          <LandingPage
            t={currentTranslations}
            lang={lang}
            onGetStarted={() => {
              if (userProfile) {
                setCurrentTab("dashboard");
              } else {
                setCurrentTab("auth");
              }
            }}
          />
        );

      case "auth":
        return (
          <AuthScreen
            t={currentTranslations}
            lang={lang}
            theme={theme}
            onAuthSuccess={(profile) => {
              setUserProfile(profile);
              setCurrentTab("dashboard");
            }}
          />
        );

      case "dashboard":
        return userProfile ? (
          <Dashboard
            t={currentTranslations}
            lang={lang}
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            setCurrentTab={setCurrentTab}
          />
        ) : (
          <AuthScreen t={currentTranslations} lang={lang} theme={theme} onAuthSuccess={setUserProfile} />
        );

      case "profile":
        return userProfile ? (
          <ProfilePage
            t={currentTranslations}
            lang={lang}
            userProfile={userProfile}
            setUserProfile={setUserProfile}
          />
        ) : (
          <AuthScreen t={currentTranslations} lang={lang} theme={theme} onAuthSuccess={setUserProfile} />
        );

      case "analyse_ia":
        return userProfile ? (
          <AnalyseIa
            t={currentTranslations}
            lang={lang}
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            setCurrentTab={setCurrentTab}
          />
        ) : (
          <AuthScreen t={currentTranslations} lang={lang} theme={theme} onAuthSuccess={setUserProfile} />
        );

      case "talent_score":
        return userProfile ? (
          <TalentScore
            t={currentTranslations}
            lang={lang}
            userProfile={userProfile}
            setCurrentTab={setCurrentTab}
          />
        ) : (
          <AuthScreen t={currentTranslations} lang={lang} theme={theme} onAuthSuccess={setUserProfile} />
        );

      case "roadmap":
        return userProfile ? (
          <CareerRoadmap
            t={currentTranslations}
            lang={lang}
            userProfile={userProfile}
            setUserProfile={setUserProfile}
          />
        ) : (
          <AuthScreen t={currentTranslations} lang={lang} theme={theme} onAuthSuccess={setUserProfile} />
        );

      case "coach":
        return userProfile ? (
          <AICoach t={currentTranslations} lang={lang} userProfile={userProfile} />
        ) : (
          <AuthScreen t={currentTranslations} lang={lang} theme={theme} onAuthSuccess={setUserProfile} />
        );

      case "challenges":
        return userProfile ? (
          <AIChallenges
            t={currentTranslations}
            lang={lang}
            userProfile={userProfile}
            setUserProfile={setUserProfile}
          />
        ) : (
          <AuthScreen t={currentTranslations} lang={lang} theme={theme} onAuthSuccess={setUserProfile} />
        );

      case "future":
        return userProfile ? (
          <DiscoverFuture
            t={currentTranslations}
            lang={lang}
            userProfile={userProfile}
            setUserProfile={setUserProfile}
          />
        ) : (
          <AuthScreen t={currentTranslations} lang={lang} theme={theme} onAuthSuccess={setUserProfile} />
        );

      case "settings":
        return userProfile ? (
          <SettingsPage
            t={currentTranslations}
            lang={lang}
            setLang={handleSetLang}
            theme={theme}
            setTheme={handleSetTheme}
            userProfile={userProfile}
          />
        ) : (
          <AuthScreen t={currentTranslations} lang={lang} theme={theme} onAuthSuccess={setUserProfile} />
        );

      default:
        return (
          <LandingPage
            t={currentTranslations}
            lang={lang}
            onGetStarted={() => setCurrentTab(userProfile ? "dashboard" : "auth")}
          />
        );
    }
  };

  // Check if we show the Left Sidebar configuration:
  // Show it only when the user is logged in AND on a dashboard area screen (not "home" or "auth" screen)
  const showSidebar = !!userProfile && currentTab !== "home" && currentTab !== "auth";

  // Navigation menu items for our left sidebar
  const sidebarItems = [
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] transition-colors duration-250 flex flex-col font-sans antialiased text-slate-900 dark:text-slate-100">
      
      {/* Sticky top menu bar */}
      <Navbar
        lang={lang}
        setLang={handleSetLang}
        theme={theme}
        setTheme={handleSetTheme}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        userProfile={userProfile}
        onLogout={handleLogout}
        t={currentTranslations}
      />
      
      {/* Render layout either with Sidebar or simple centered pane */}
      {showSidebar ? (
        <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto md:px-4 lg:px-8">
          
          {/* LEFT PERSISTENT NAVIGATION SIDEBAR */}
          <aside className="w-full lg:w-64 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800/60 p-6 lg:p-8 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <span className="text-[10px] font-mono font-black text-slate-400 block uppercase tracking-widest px-3">
                {lang === "fr" ? "Espace de Travail" : "Workspace Hub"}
              </span>
              
              <nav className="space-y-1">
                {sidebarItems.map((item) => {
                  const isActive = currentTab === item.key;
                  const IconComp = item.icon;

                  return (
                    <button
                      key={item.key}
                      id={`sidebar-tab-${item.key}`}
                      onClick={() => setCurrentTab(item.key)}
                      className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                        isActive
                          ? "bg-blue-50/70 dark:bg-blue-950/20 text-[#2563EB] font-bold"
                          : "text-slate-600 dark:text-slate-405 hover:bg-slate-50 dark:hover:bg-slate-900/40 hover:text-slate-902 dark:hover:text-white"
                      }`}
                    >
                      <IconComp className={`w-4.5 h-4.5 ${isActive ? "text-[#2563EB]" : "text-slate-400 dark:text-slate-500"}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Micro User stats or bio inside Sidebar */}
            {userProfile && (
              <div className="hidden lg:block pt-6 border-t border-slate-100 dark:border-slate-800/60 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-black text-lg shadow-sm">
                    {userProfile.displayName ? userProfile.displayName[0].toUpperCase() : "U"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-black text-slate-900 dark:text-white truncate block">
                      {userProfile.displayName || "Candidat"}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate block font-mono">
                      {userProfile.email}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* MAIN CONTENT PANE */}
          <main className="flex-grow flex flex-col justify-start min-w-0 overflow-x-hidden md:py-4">
            {renderContent()}
          </main>

        </div>
      ) : (
        /* STANDARD SIMPLE CENTERED WRAPPER for Landing and Auth Screens */
        <main className="flex-grow flex flex-col justify-start">
          {renderContent()}
        </main>
      )}

    </div>
  );
}
