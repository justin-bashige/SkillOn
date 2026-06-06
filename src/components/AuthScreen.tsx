import React, { useState } from "react";
import { Mail, Lock, User, Sparkles, AlertCircle, RefreshCw, KeyRound, CheckSquare, Award } from "lucide-react";
import { motion } from "motion/react";
import { auth, db } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { UserProfile } from "../types";

interface AuthScreenProps {
  t: any;
  lang: "fr" | "en";
  theme: "light" | "dark" | "system";
  onAuthSuccess: (profile: UserProfile) => void;
}

export default function AuthScreen({ t, lang, theme, onAuthSuccess }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Initialize or store UserProfile in Firestore
  const setupUserProfile = async (userId: string, userEmail: string, name: string) => {
    const profileRef = doc(db, "users", userId);
    
    const initialProfile: UserProfile = {
      userId,
      email: userEmail,
      displayName: name || userEmail.split("@")[0],
      skills: [],
      certifications: "",
      experience: "",
      education: "",
      github: "",
      projects: "",
      interests: "",
      points: 100, // 100 welcome points
      completedChallenges: [],
      langPreference: lang,
      themePreference: theme,
    };

    await setDoc(profileRef, initialProfile);
    return initialProfile;
  };

  const getFriendlyErrorMessage = (err: any): string => {
    const code = err?.code || "";
    const msg = err?.message || "";
    
    if (code === "auth/popup-closed-by-user") {
      return lang === "fr" 
        ? "La fenêtre de connexion Google a été fermée avant la fin de l'authentification."
        : "The Google sign-in window was closed before completion.";
    }
    if (code === "auth/cancelled-popup-request") {
      return lang === "fr"
        ? "La requête de connexion par popup a été annulée. Veuillez réessayer."
        : "The popup sign-in request was cancelled. Please try again.";
    }
    if (code === "auth/invalid-credential") {
      return lang === "fr"
        ? "Identifiants invalides (adresse e-mail ou mot de passe incorrect)."
        : "Invalid credentials (incorrect email or password).";
    }
    if (code === "auth/email-already-in-use") {
      return lang === "fr"
        ? "Cette adresse e-mail est déjà associée à un compte existant."
        : "This email address is already associated with an account.";
    }
    if (code === "auth/weak-password") {
      return lang === "fr"
        ? "Le mot de passe doit contenir au moins 6 caractères."
        : "The password must be at least 6 characters long.";
    }
    if (code === "auth/invalid-email") {
      return lang === "fr"
        ? "L'adresse e-mail saisie n'est pas valide."
        : "The email address has an invalid format.";
    }
    if (code === "auth/too-many-requests") {
      return lang === "fr"
        ? "Accès temporairement bloqué en raison de trop nombreuses tentatives. Réessayez plus tard."
        : "Too many failed attempts. Access temporarily blocked. Please try again later.";
    }
    
    const displayMsg = code ? ` (${code})` : (msg ? `: ${msg}` : "");
    return (lang === "fr" ? "Erreur d'authentification" : "Authentication error") + displayMsg;
  };

  const handleAuthentication = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setInfoMessage("");
    setLoading(true);

    try {
      if (isSignUp) {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const profile = await setupUserProfile(credential.user.uid, email, displayName);
        onAuthSuccess(profile);
      } else {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getDoc(doc(db, "users", credential.user.uid));
        let profile: UserProfile;
        if (userDoc.exists()) {
          profile = {
            userId: credential.user.uid,
            ...userDoc.data()
          } as UserProfile;
        } else {
          profile = await setupUserProfile(credential.user.uid, email, credential.user.displayName || "");
        }
        onAuthSuccess(profile);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage("");
    setInfoMessage("");
    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const userDoc = await getDoc(doc(db, "users", result.user.uid));
      let profile: UserProfile;
      if (userDoc.exists()) {
        profile = {
          userId: result.user.uid,
          ...userDoc.data()
        } as UserProfile;
      } else {
        profile = await setupUserProfile(
          result.user.uid,
          result.user.email || "",
          result.user.displayName || ""
        );
      }
      onAuthSuccess(profile);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setErrorMessage(lang === "fr" ? "Veuillez entrer votre courriel d'abord." : "Please enter your email first.");
      return;
    }
    setErrorMessage("");
    setInfoMessage("");
    try {
      await sendPasswordResetEmail(auth, email);
      setInfoMessage(t.resetEmailSent || "Recovery link sent!");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row transition-colors duration-200">
      
      {/* LEFT COLUMN: Notion illustration style featuring brand details, tagline and achievements */}
      <div className="w-full lg:w-1/2 bg-[#0F172A] text-white flex flex-col justify-between p-8 sm:p-12 lg:p-16 relative overflow-hidden">
        
        {/* Abstract design elements matching original design */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Top: Logo representation */}
        <div className="flex items-center space-x-3 relative z-10 select-none">
          <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-lg">
            <span className="text-white text-xl font-bold font-display">S</span>
          </div>
          <span className="text-xl font-bold tracking-tight font-display">SkillOn</span>
        </div>

        {/* Center: Hero quote and staircase metaphor representation */}
        <div className="my-12 lg:my-auto max-w-lg relative z-10 space-y-8">
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#2563EB] bg-[#2563EB]/15 px-3 py-1 rounded-full">
              {lang === "fr" ? "VOTRE ALLIÉ CARRIÈRE" : "YOUR DEPLOYMENT COGNITIVE ENGINE"}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display leading-tight">
              {lang === "fr" ? "Révélez votre potentiel." : "Reveal your true prospective potential."}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-sans">
              {lang === "fr"
                ? "Bâtissez vos forces techniques et méthodologiques et escaladez vers votre futur rôle stratégique."
                : "Bridge critical baseline gaps, climb milestones securely, and take command of your next career move."}
            </p>
          </div>

          {/* Quick stair illustration vector representation */}
          <div className="border border-slate-800 bg-slate-900/60 p-6 rounded-2xl flex flex-col space-y-4 shadow-xl">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 border-b border-slate-800 pb-2">
              <span>TALENT ASSIST ENGINE</span>
              <span className="text-blue-500 font-bold">● ACTIVE</span>
            </div>
            {/* Horizontal progress visualization lines */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-xs font-sans text-slate-300">
                <span>1. Profiling initial</span>
                <span className="text-emerald-500 font-bold">100% OK</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-1 rounded-full w-full" />
              </div>
              <div className="flex justify-between text-xs font-sans text-slate-300">
                <span>2. Analyse de compétences Gemini</span>
                <span className="text-blue-500 font-bold">Synchronisé</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div className="bg-[#2563EB] h-1 rounded-full w-4/5" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom footer text metadata */}
        <div className="text-xs text-slate-500 relative z-10">
          <span>{lang === "fr" ? "Sécurisé par clés chiffrées Firestore & Firebase Auth" : "Authenticated through Firebase Secure Handshake"}</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Notion-style connection white card */}
      <div className="w-full lg:w-1/2 bg-white dark:bg-[#0F172A] flex flex-col justify-center items-center p-8 sm:p-12 lg:p-16">
        
        {/* Core Auth card form wrapper */}
        <div className="w-full max-w-sm space-y-8">
          
          <div className="space-y-2 text-left">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white font-display">
              {isSignUp ? (lang === "fr" ? "Créer un compte" : "Create an Account") : (lang === "fr" ? "Connexion" : "Log In")}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-sans">
              {isSignUp 
                ? (lang === "fr" ? "Commencez votre ascension professionnelle en quelques clics." : "Begin your career climb path in minutes.")
                : (lang === "fr" ? "Saisissez vos identifiants pour continuer." : "Enter your email credentials to login.")}
            </p>
          </div>

          {/* Success / Error Messages indicators */}
          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }} 
              animate={{ opacity: 1, y: 0 }}
              id="auth-error" 
              className="p-4 bg-red-500/5 text-red-600 dark:text-red-400 border border-red-500/10 rounded-xl text-xs flex items-start space-x-2.5"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {infoMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }} 
              animate={{ opacity: 1, y: 0 }}
              id="auth-info" 
              className="p-4 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 rounded-xl text-xs flex items-start space-x-2.5"
            >
              <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{infoMessage}</span>
            </motion.div>
          )}

          {/* Main Credentials Form */}
          <form onSubmit={handleAuthentication} className="space-y-4">
            
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase font-mono tracking-wider">
                  {lang === "fr" ? "Nom Complet" : "Full Name"}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    id="auth-input-name"
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#1E293B]/60 text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/10 transition-colors"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Justin Bashige"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase font-mono tracking-wider">
                {t.emailLabel}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="auth-input-email"
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#1E293B]/60 text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/10 transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="bashigejustin0@gmail.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase font-mono tracking-wider">
                  {t.passwordLabel}
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    className="text-[11px] font-semibold text-[#2563EB] hover:underline"
                  >
                    {lang === "fr" ? "Mot de passe oublié ?" : "Forgot password?"}
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="auth-input-password"
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#1E293B]/60 text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/10 transition-colors"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{t.loading}</span>
                </>
              ) : (
                <span>{isSignUp ? (lang === "fr" ? "S'inscrire" : "Sign Up") : (lang === "fr" ? "Se connecter" : "Log In")}</span>
              )}
            </button>
          </form>

          {/* Social login option */}
          <div className="flex items-center justify-between my-6 py-2">
            <span className="border-b w-1/4 dark:border-slate-800 border-slate-200"></span>
            <span className="text-[10px] text-slate-400 tracking-wider uppercase font-mono font-bold">
              {lang === "fr" ? "OU" : "OR"}
            </span>
            <span className="border-b w-1/4 dark:border-slate-800 border-slate-205"></span>
          </div>

          <button
            id="btn-google-login"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 px-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-705 dark:text-slate-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-3 cursor-pointer shadow-sm"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{t.signInGoogle}</span>
          </button>

          {/* Toggle button */}
          <div className="text-center pt-4">
            <button
              id="btn-toggle-auth-mode"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
            >
              {isSignUp ? t.haveAccount : t.needAccount}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
