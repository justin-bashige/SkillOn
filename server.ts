import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Securely check if GEMINI_API_KEY is configured
const apiKey = process.env.GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;
if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const app = express();
const PORT = 3000;

app.use(express.json());

// API Endpoints
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", localized: true });
});

// Helper to ensure Gemini is active and configured
function getGemini() {
  if (!ai) {
    throw new Error("GEMINI_API_KEY environment variable is missing or default. Please configure it in the Secrets panel.");
  }
  return ai;
}

// 1. Analyze Skills Endpoint (Supports both structured profile evaluation and raw CV parsing)
app.post("/api/analyze-skills", async (req, res) => {
  try {
    const gemini = getGemini();
    const { profile, rawCvText, lang = "fr" } = req.body;

    const systemInstruction = lang === "fr"
      ? "Vous êtes un analyste de talents de classe mondiale qualifié IA. Évaluez le CV ou profil fourni en français. Soyez précis, analytique et constructif."
      : "You are a world-class AI-powered talent analyst. Evaluate the provided CV or profile in English. Be precise, analytical, and highly professional.";

    if (rawCvText) {
      const prompt = lang === "fr"
        ? `Analysez ce texte de CV ou profil brut et extrayez de manière structurée les catégories suivantes :
           - Compétences clés (liste de mots-clés simples)
           - Expérience professionnelle (résumé de l'expérience, de l'historique et des postes occupés)
           - Éducation & diplômes
           - Certifications
           - Projets personnels ou réalisations majeures
           - Intérêts et buts de carrière professionnels
           
           Générez également une évaluation sémantique complète comprenant :
           - Résumé professionnel inspirant (summary, max 2-3 phrases)
           - 3 forces majeures (strengths)
           - 3 axes d'amélioration critiques (weaknesses)
           - 3 opportunités d'évolution futures (potential)
           - Scores de compétences (de 0 à 100) pour ces 5 dimensions : technique (technical), communication (communication), leadership (leadership), créativité (creativity), résolution de problèmes (problemSolving).
           
           Texte brut du CV ou profil à analyser :
           ${rawCvText}`
        : `Analyze this raw CV or profile text and structurally extract the following categories:
           - Core skills (skills, list of keywords as strings)
           - Work experience (experience summary)
           - Education & academic credentials
           - Professional certifications
           - Personal or work projects of note
           - Career goals and professional interests
           
           Also generate a complete semantic evaluation including:
           - Inspiring professional summary (summary, max 2-3 sentences)
           - 3 key strengths (strengths)
           - 3 critical areas of improvement (weaknesses)
           - 3 potential growth paths (potential)
           - Competency metrics (0-100) for these 5 radar dimensions: technical, communication, leadership, creativity, problemSolving.
           
           Raw CV / profile text:
           ${rawCvText}`;

      const response = await gemini.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              extractedProfile: {
                type: Type.OBJECT,
                properties: {
                  skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  experience: { type: Type.STRING },
                  education: { type: Type.STRING },
                  certifications: { type: Type.STRING },
                  projects: { type: Type.STRING },
                  interests: { type: Type.STRING }
                },
                required: ["skills", "experience", "education", "certifications", "projects", "interests"]
              },
              summary: { type: Type.STRING },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              potential: { type: Type.ARRAY, items: { type: Type.STRING } },
              scores: {
                type: Type.OBJECT,
                properties: {
                  technical: { type: Type.INTEGER },
                  communication: { type: Type.INTEGER },
                  leadership: { type: Type.INTEGER },
                  creativity: { type: Type.INTEGER },
                  problemSolving: { type: Type.INTEGER },
                },
                required: ["technical", "communication", "leadership", "creativity", "problemSolving"],
              },
            },
            required: ["extractedProfile", "summary", "strengths", "weaknesses", "potential", "scores"],
          },
        },
      });

      const data = JSON.parse(response.text || "{}");
      return res.json(data);
    }

    // Standard structured profile analysis
    const prompt = lang === "fr"
      ? `Évaluez ce profil utilisateur pour générer un résumé de compétences, des forces, des points d'amélioration, ainsi que des notes numériques complexes (0-100) pour ces catégories : technique, communication, leadership, créativité, résolution de problèmes.
      
      Profil de l'utilisateur :
      - Nom ou prénom : ${profile.displayName || "Candidat"}
      - Compétences actuelles : ${profile.skills?.join(", ") || "Non spécifié"}
      - Certifications : ${profile.certifications || "Non spécifié"}
      - Expérience professionnelle : ${profile.experience || "Non spécifié"}
      - Éducation : ${profile.education || "Non spécifié"}
      - GitHub / Portfolio : ${profile.github || "Non spécifié"}
      - Projets personnels : ${profile.projects || "Non spécifié"}`
      : `Evaluate this user profile to generate a skills summary, key strengths, potential areas for improvement, and numeric scores (0-100) for: technical, communication, leadership, creativity, problemSolving.
      
      User Profile:
      - Name: ${profile.displayName || "Candidate"}
      - Current Skills: ${profile.skills?.join(", ") || "Not specified"}
      - Certifications: ${profile.certifications || "Not specified"}
      - Work Experience: ${profile.experience || "Not specified"}
      - Education: ${profile.education || "Not specified"}
      - GitHub / Portfolio: ${profile.github || "Not specified"}
      - Personal Projects: ${profile.projects || "Not specified"}`;

    const response = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            potential: { type: Type.ARRAY, items: { type: Type.STRING } },
            scores: {
              type: Type.OBJECT,
              properties: {
                technical: { type: Type.INTEGER },
                communication: { type: Type.INTEGER },
                leadership: { type: Type.INTEGER },
                creativity: { type: Type.INTEGER },
                problemSolving: { type: Type.INTEGER },
              },
              required: ["technical", "communication", "leadership", "creativity", "problemSolving"],
            },
          },
          required: ["summary", "strengths", "weaknesses", "potential", "scores"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "An error occurred during skills analysis" });
  }
});

// 2. Generate Career Roadmap Timeline
app.post("/api/roadmap", async (req, res) => {
  try {
    const gemini = getGemini();
    const { profile, lang = "fr" } = req.body;

    const systemInstruction = lang === "fr"
      ? "Vous êtes un conseiller d'orientation professionnelle IA expert. Concevez une feuille de route détaillée et chronologique."
      : "You are an expert AI Career Pathfinder. Generate a detailed, inspiring chronological career roadmap.";

    const prompt = lang === "fr"
      ? `Générez un plan d'évolution de carrière en français basé sur ce profil. Le plan doit comprendre les carrières recommandées (au moins 2), un parcours d'apprentissage chronologique découpé en phases réalistes (généralement 3 phases : Court terme, Moyen terme, Long terme), des certifications pertinentes recommandées, et des projets pratiques spécifiques à développer.
      
      Profil :
      - Compétences existantes : ${profile.skills?.join(", ") || "Aucune"}
      - Expérience : ${profile.experience || "Débutant"}
      - Éducation : ${profile.education || "N/A"}
      - Objectifs de carrière ou champs d'intérêt : ${profile.interests || "Non précisés"}`
      : `Generate a chronological career path roadmap in English based on this profile. Include recommended careers (at least 2), a phased learning path (typically 3 phases: Short-term, Medium-term, Long-term), recommended industry certifications, and specific practical projects to build.
      
      Profile:
      - Current skills: ${profile.skills?.join(", ") || "None"}
      - Experience: ${profile.experience || "Beginner"}
      - Education: ${profile.education || "N/A"}
      - Goals/Interests: ${profile.interests || "Not specified"}`;

    const response = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedCareers: { type: Type.ARRAY, items: { type: Type.STRING } },
            learningPath: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phase: { type: Type.STRING }, // e.g. "Phase 1: Short Term"
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  estimatedMonths: { type: Type.INTEGER },
                  skillsToAcquire: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["phase", "title", "description", "estimatedMonths", "skillsToAcquire"],
              },
            },
            certifications: { type: Type.ARRAY, items: { type: Type.STRING } },
            projectsToBuild: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                },
                required: ["title", "description", "difficulty"],
              },
            },
          },
          required: ["recommendedCareers", "learningPath", "certifications", "projectsToBuild"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "An error occurred while generating your career roadmap" });
  }
});

// 3. AI Coach Chat Interactive
app.post("/api/coach-chat", async (req, res) => {
  try {
    const gemini = getGemini();
    const { messages, lang = "fr", profile } = req.body;

    const systemInstruction = lang === "fr"
      ? `Vous êtes le coach de carrière IA dédié de SkillOn. Votre mission est d'optimiser le potentiel professionnel de l’utilisateur.
         Soyez à la fois encourageant, pragmatique, direct, précis et hautement pertinent comme un recruteur de la Silicon Valley ou un mentor exécutif.
         Sachez que le profil de l'utilisateur contient :
         - Compétences : ${profile?.skills?.join(", ") || "N/A"}
         - Expérience : ${profile?.experience || "N/A"}
         - Certifications : ${profile?.certifications || "N/A"}
         Répondez obligatoirement en français.`
      : `You are the dedicated SkillOn AI Career Coach. Your mission is to nurture the user's professional potential.
         Be encouraging, practical, concise, and highly relevant, like a premier recruiter or executive mentor.
         Know that the user's profile consists of:
         - Skills: ${profile?.skills?.join(", ") || "N/A"}
         - Experience: ${profile?.experience || "N/A"}
         - Certifications: ${profile?.certifications || "N/A"}
         Always respond in English.`;

    const chatMessages = messages.map((m: any) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    // Generate content using simple text invocation or chats
    const response = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents: chatMessages,
      config: {
        systemInstruction,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "An error occurred with the AI Coach" });
  }
});

// 4. Personalized Growth Challenges Generator
app.post("/api/challenges", async (req, res) => {
  try {
    const gemini = getGemini();
    const { profile, lang = "fr" } = req.body;

    const systemInstruction = lang === "fr"
      ? "Vous êtes un formateur professionnel agile. Générez des défis de croissance stimulants et applicables."
      : "You are an agile professional development trainer. Generate high-growth, practical profile-specific challenges.";

    const prompt = lang === "fr"
      ? `Générez une liste de 3 défis personnalisés en français basés sur ce profil. Chaque défi doit correspondre à ses compétences actuelles et l'aider à grandir.
      Donnez des défis réalistes, avec difficulté (Facile, Moyen, Difficile), durée estimée, compétences requises, points de récompense (de 100 à 500) et des étapes concrètes d’exécution.
      
      Profil :
      - Compétences : ${profile.skills?.join(", ") || "Inconnu"}
      - Expérience : ${profile.experience || "Aucun"}`
      : `Generate a list of exactly 3 personalized growth challenges in English based on this profile. They must match existing competencies and encourage development.
      Provide detailed parameters: Difficulty (Easy, Medium, Hard), duration, skills targeted, point rewards (100-500), and step-by-step action plans.
      
      Profile:
      - Skills: ${profile.skills?.join(", ") || "Unknown"}
      - Experience : ${profile.experience || "None"}`;

    const response = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              difficulty: { type: Type.STRING }, // "Easy", "Medium", "Hard" or localized
              duration: { type: Type.STRING },
              skills: { type: Type.ARRAY, items: { type: Type.STRING } },
              points: { type: Type.INTEGER },
              description: { type: Type.STRING },
              steps: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["id", "title", "difficulty", "duration", "skills", "points", "description", "steps"],
          },
        },
      },
    });

    const data = JSON.parse(response.text || "[]");
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "An error occurred generated personalized challenges" });
  }
});

// 5. Discover My Future Predictive Endpoint
app.post("/api/discover-future", async (req, res) => {
  try {
    const gemini = getGemini();
    const { profile, lang = "fr" } = req.body;

    const systemInstruction = lang === "fr"
      ? "Vous êtes un prospectiviste de carrière expert de l'économie numérique. Prédisez l'avenir professionnel de l'utilisateur."
      : "You are a professional future-strategist specializing in the digital workforce. Predict the future career trajectories for the user.";

    const prompt = lang === "fr"
      ? `Prédisez l'avenir professionnel de l'utilisateur en français. Identifiez au moins 3 opportunités de carrières futuristes / émergentes idéales avec leur pourcentage de correspondance,
         leurs talents cachés ou sous-estimés révélés par leur historique, un bilan à long terme inspirant et des étapes stratégiques pour briller.
         
         Profil :
         - Compétences : ${profile.skills?.join(", ") || "Nouveau"}
         - Expérience : ${profile.experience || "Non spécifié"}
         - Éducation : ${profile.education || "Non spécifié"}
         - Projets : ${profile.projects || "Aucun"}`
      : `Predict the future occupational outlook for this user in English. Identify at least 3 emerging/premium career paths suited for them with percentage match index values,
         hidden talents uncovered from their accomplishments, an inspiring long-term visionary forecast, and strategic actions.
         
         Profile:
         - Skills: ${profile.skills?.join(", ") || "Beginner"}
         - Experience: ${profile.experience || "Not specified"}
         - Education: ${profile.education || "Not specified"}
         - Projects: ${profile.projects || "None"}`;

    const response = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  career: { type: Type.STRING },
                  percentage: { type: Type.INTEGER },
                  why: { type: Type.STRING },
                },
                required: ["career", "percentage", "why"],
              },
            },
            hiddenTalents: { type: Type.ARRAY, items: { type: Type.STRING } },
            longTermOutlook: { type: Type.STRING },
            stepsToExcel: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["matches", "hiddenTalents", "longTermOutlook", "stepsToExcel"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "An error occurred predicting your career outlook" });
  }
});

// Configure Vite middleware and static handlers
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server launched on port ${PORT}`);
  });
}

bootstrap();
