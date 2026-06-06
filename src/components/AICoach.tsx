import React, { useState, useEffect, useRef } from "react";
import { Sparkles, MessageSquare, Send, ArrowRight, Brain, User, RefreshCw } from "lucide-react";
import { UserProfile, Message } from "../types";
import { db } from "../lib/firebase";
import { collection, addDoc, getDocs, orderBy, query } from "firebase/firestore";

interface AICoachProps {
  t: any;
  lang: "fr" | "en";
  userProfile: UserProfile;
}

export default function AICoach({ t, lang, userProfile }: AICoachProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-coach",
      sender: "ai",
      text: lang === "fr" 
        ? "Bonjour ! Je suis votre Coach Carrière SkillOn. Comment puis-je vous accompagner aujourd'hui dans l'accélération de votre parcours numérique ?"
        : "Hello! I am your SkillOn AI Career Mentor. How can I help you accelerate your technical path or outline custom strategies today?",
      createdAt: Date.now(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sync historical messages from Firestore users/{userId}/chatHistory
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const chatRef = collection(db, "users", userProfile.userId, "chatHistory");
        const q = query(chatRef, orderBy("createdAt", "asc"));
        const snap = await getDocs(q);
        
        if (!snap.empty) {
          const loaded: Message[] = snap.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              sender: data.sender,
              text: data.text,
              createdAt: data.createdAt,
            };
          });
          setMessages([
            {
              id: "welcome-coach",
              sender: "ai",
              text: lang === "fr" 
                ? "Bonjour ! Je suis de retour. Comment puis-je vous guider aujourd'hui ?"
                : "Hello! I'm back. Where shall we direct our attention today?",
              createdAt: Date.now(),
            },
            ...loaded,
          ]);
        }
      } catch (err) {
        console.error("Error retrieving historical coach messages:", err);
      }
    };

    fetchChatHistory();
  }, [userProfile.userId, lang]);

  // Handle message sending to backend '/api/coach-chat'
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || sending) return;

    setSending(true);
    setInputText("");

    const userMsg: Message = {
      id: `m-user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      createdAt: Date.now(),
    };

    // Append localized user message
    setMessages((prev) => [...prev, userMsg]);

    try {
      // Save user message to Firestore
      const chatRef = collection(db, "users", userProfile.userId, "chatHistory");
      await addDoc(chatRef, {
        sender: "user",
        text: textToSend,
        createdAt: userMsg.createdAt,
      });

      // Query Gemini
      const response = await fetch("/api/coach-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages.slice(-5), userMsg], // send short relative context
          lang,
          profile: userProfile,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to consult AI Coach server");
      }

      const resData = await response.json();

      const coachMsg: Message = {
        id: `m-coach-${Date.now()}`,
        sender: "ai",
        text: resData.text || "...",
        createdAt: Date.now(),
      };

      setMessages((prev) => [...prev, coachMsg]);

      // Save coach feedback to Firestore
      await addDoc(chatRef, {
        sender: "ai",
        text: coachMsg.text,
        createdAt: coachMsg.createdAt,
      });
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `m-err-${Date.now()}`,
          sender: "ai",
          text: lang === "fr" 
            ? "Oups, une erreur réseau est survenue. Veuillez réessayer."
            : "Oops, a temporary network error was spotted. Try reloading.",
          createdAt: Date.now(),
        },
      ]);
    } finally {
      setSending(false);
      // scroll to bottom after state layout complete
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const handlePromptClick = (pText: string) => {
    handleSendMessage(pText);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200 h-[calc(100vh-8rem)] flex flex-col">
      {/* 1. Coach Meta Head */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-4 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-[#2563EB]">
            <Brain className="w-5.5 h-5.5" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none font-display">
              {t.coachTitle}
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-sans">
              {t.coachSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Dialogue window wrapper */}
      <div className="flex-1 overflow-y-auto border border-slate-100 dark:border-slate-800/80 rounded-2xl bg-white dark:bg-[#1E293B]/20 p-4 sm:p-6 mb-4 space-y-4 shadow-sm">
        {messages.map((m) => {
          const isUser = m.sender === "user";
          return (
            <div key={m.id} className={`flex items-start space-x-3.5 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse space-x-reverse" : "mr-auto"}`}>
              {/* Badge avatar indicator */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${
                isUser 
                  ? "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300" 
                  : "bg-[#2563EB]/10 border-blue-500/20 text-[#2563EB]"
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
              </div>

              {/* Chat Text Block */}
              <div className={`px-4.5 py-3 rounded-2xl text-xs leading-relaxed ${
                isUser 
                  ? "bg-[#2563EB] text-white rounded-br-none" 
                  : "bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-250 rounded-bl-none shadow-sm"
              }`}>
                {m.text}
              </div>
            </div>
          );
        })}
        {sending && (
          <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono italic">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#2563EB]" />
            <span>{lang === "fr" ? "Le coach réfléchit..." : "Coach is designing response..."}</span>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* 3. Prebuilt Prompt Suggestions */}
      {messages.length === 1 && (
        <div className="mb-4 flex-shrink-0">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase font-mono mb-2 block">
            {lang === "fr" ? "Questions et points d'appui suggérés :" : "Suggested career dialogues :"}
          </span>
          <div className="flex flex-wrap gap-2">
            {[t.suggested1, t.suggested2, t.suggested3].map((sugg, sIdx) => (
              <button
                key={sIdx}
                onClick={() => handlePromptClick(sugg)}
                className="text-xs bg-[#F8FAFC] dark:bg-[#1E293B]/70 hover:bg-slate-100 dark:hover:bg-[#1E293B] border border-slate-100 dark:border-slate-800/80 rounded-full px-4 py-2 text-slate-700 dark:text-slate-300 cursor-pointer transition-colors max-w-full text-left truncate"
              >
                {sugg}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. Message Input Action Bar */}
      <div className="flex items-center space-x-2 flex-shrink-0">
        <input
          id="coach-chat-input"
          type="text"
          disabled={sending}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage(inputText);
          }}
          className="flex-1 px-4 py-3.5 text-sm rounded-xl border border-slate-100 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#1E293B]/40 text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB]"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t.chatPlaceholder}
        />
        <button
          id="btn-coach-send"
          onClick={() => handleSendMessage(inputText)}
          disabled={sending || !inputText.trim()}
          className="p-3.5 bg-[#2563EB] hover:bg-blue-700 disabled:bg-slate-200 dark:disabled:bg-slate-800/85 text-white rounded-xl shadow-md hover:shadow-lg shadow-blue-100 dark:shadow-none transition-all cursor-pointer disabled:cursor-not-allowed"
          title="Send query"
        >
          <Send className="w-4.5 h-4.5" />
        </button>
      </div>
    </div>
  );
}
