export interface UserProfile {
  userId: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  skills: string[];
  certifications: string;
  experience: string;
  education: string;
  github: string;
  projects: string;
  interests: string;
  points: number;
  completedChallenges: string[]; // List of completed challenge IDs
  langPreference: "fr" | "en";
  themePreference: "light" | "dark" | "system";
  
  // AI calculated items
  aiSummary?: string;
  aiStrengths?: string[];
  aiWeaknesses?: string[];
  aiPotential?: string[];
  aiScores?: {
    technical: number;
    communication: number;
    leadership: number;
    creativity: number;
    problemSolving: number;
  };
  aiRoadmap?: {
    recommendedCareers: string[];
    learningPath: {
      phase: string;
      title: string;
      description: string;
      estimatedMonths: number;
      skillsToAcquire: string[];
    }[];
    certifications: string[];
    projectsToBuild: {
      title: string;
      description: string;
      difficulty: string;
    }[];
  };
  aiFuturePrediction?: {
    matches: {
      career: string;
      percentage: number;
      why: string;
    }[];
    hiddenTalents: string[];
    longTermOutlook: string;
    stepsToExcel: string[];
  };
}

export interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  createdAt: number;
}

export interface GrowthChallenge {
  id: string;
  title: string;
  difficulty: string;
  duration: string;
  skills: string[];
  points: number;
  description: string;
  steps: string[];
}
