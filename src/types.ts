export interface ResumeDetails {
  candidateName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    gpa?: string;
  }>;
  experience: Array<{
    role: string;
    company: string;
    duration: string;
    responsibilities: string[];
  }>;
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
  }>;
  certifications: string[];
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface SkillAnalysis {
  categories: SkillCategory[];
  totalSkillsCount: number;
  uncommonSkills: string[];
  industryContext: string;
}

export interface AtsRuleScore {
  criterion: string;
  maxScore: number;
  score: number;
  feedback: string;
}

export interface AtsReport {
  overallScore: number;
  status: "Pass" | "Fail";
  rules: AtsRuleScore[];
  formattingRating: string;
  strengths: string[];
  redFlags: string[];
}

export interface JdAnalysis {
  roleTitle: string;
  requiredSkills: string[];
  preferredSkills: string[];
  experienceRequired: string;
  keyResponsibilities: string[];
  predictedRoleType: string;
}

export interface MatchReport {
  matchPercentage: number;
  requiredSkillsMatch: number;
  preferredSkillsMatch: number;
  experienceFitRating: string;
  matchingSkills: string[];
  missingSkills: string[];
  strengthsMatch: string[];
  weaknessGaps: string[];
}

export interface RolePrediction {
  roleName: string;
  confidence: number; // 0-100
  justification: string;
  recommendedSkillsToAcquire: string[];
}

export interface ImprovementSuggestion {
  priority: "High" | "Medium" | "Low";
  section: string;
  issue: string;
  recommendation: string;
  exampleRevision: string;
}

export interface InterviewQuestion {
  skill: string;
  topic: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  question: string;
  idealAnswerGuideline: string;
}

export interface AnalyticsSummary {
  atsGauge: {
    score: number;
    color: string;
  };
  skillRadar: {
    labels: string[];
    values: number[];
  };
  roleBarChart: {
    roles: string[];
    confidences: number[];
  };
  healthIndicators: {
    hasContactInfo: boolean;
    hasEducation: boolean;
    hasExperience: boolean;
    hasProjects: boolean;
    hasSummary: boolean;
  };
}

export interface FullAnalysisPayload {
  resume: ResumeDetails;
  skills: SkillAnalysis;
  ats: AtsReport;
  rolePredictions: RolePrediction[];
  improvements: ImprovementSuggestion[];
  interviewQuestions: InterviewQuestion[];
  analytics: AnalyticsSummary;
  jdAnalysis?: JdAnalysis;
  jdMatch?: MatchReport;
}
