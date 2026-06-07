import { GoogleGenAI } from "@google/genai";
import { 
  ResumeDetails, 
  SkillAnalysis, 
  AtsReport, 
  JdAnalysis, 
  MatchReport, 
  RolePrediction, 
  ImprovementSuggestion, 
  InterviewQuestion, 
  AnalyticsSummary,
  FullAnalysisPayload
} from "./src/types.js";

// Initialize Gemini client strictly adhering to key/telemetry guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

/**
 * Analytics Dashboard Service
 * Synthesizes individual data outputs into a single streamlined dashboard structure
 */
export function runAnalyticsAgent(
  resume: ResumeDetails,
  skills: SkillAnalysis, 
  ats: AtsReport, 
  predictions: RolePrediction[]
): AnalyticsSummary {
  const categories = skills.categories.map(c => c.category);
  const flexCounts = skills.categories.map(c => c.skills.length);

  return {
    atsGauge: {
      score: ats.overallScore,
      color: ats.overallScore >= 80 ? "#10b981" : ats.overallScore >= 65 ? "#f59e0b" : "#ef4444"
    },
    skillRadar: {
      labels: categories.length > 0 ? categories : ["Languages", "Frameworks", "Databases", "Cloud", "Tools", "Soft Skills"],
      values: flexCounts.length > 0 ? flexCounts : [5, 4, 3, 2, 4, 3]
    },
    roleBarChart: {
      roles: predictions.map(p => p.roleName),
      confidences: predictions.map(p => p.confidence)
    },
    healthIndicators: {
      hasContactInfo: !!(resume.email || resume.phone),
      hasEducation: resume.education.length > 0,
      hasExperience: resume.experience.length > 0,
      hasProjects: resume.projects.length > 0,
      hasSummary: resume.summary.length > 40
    }
  };
}

/**
 * Master Agent / Orchestration Pipeline
 * Calls the state-of-the-art Gemini LLM exactly ONCE to parse, evaluate, profile, predict, and match
 * the candidate's resume and job description. This prevents rate limit 429 quota exhaustion 
 * errors completely, speeds up response times significantly, and maintains high qualitative alignment.
 */
export async function runMasterOrchestrator(
  fileBuffer?: Buffer, 
  mimeType?: string, 
  plainText?: string, 
  jdText?: string
): Promise<FullAnalysisPayload> {
  console.log("Unified Master Orchestration started dynamic career analysis...");

  let contentPart: any;
  if (fileBuffer && mimeType) {
    contentPart = {
      inlineData: {
        mimeType: mimeType,
        data: fileBuffer.toString("base64")
      }
    };
  } else if (plainText) {
    contentPart = { text: plainText };
  } else {
    throw new Error("No resume content or text provided for analysis.");
  }

  const parseJdPromptFragment = jdText && jdText.trim().length > 10 
    ? `An optional target Job Description (JD) is provided here for role classification and semantic compatibility mapping:
--- TARGET JOB DESCRIPTION ---
${jdText}
--- END JOB DESCRIPTION ---

Please perform a semantic match compliance audit. Map skills, estimate required experience fit and identify critical missing skills or weaknesses. Record this in 'jdAnalysis' and 'jdMatch' variables in the target JSON schema below.`
    : `Note: No target job description has been provided. Please omit 'jdAnalysis' and 'jdMatch' sections, or leave them as null/undefined. Do not generate fake JD data.`;

  const instructionPrompt = `You are a Unified Orchestration Team of 10 specialized Career Intelligence Experts.
Your collective mission is to analyze the attached resume document and output a comprehensive career-diagnostic, ATS-scores, technological taxonomy, predicted roles, improvement recommendations, and custom matching criteria (if target alignment description is provided below).

${parseJdPromptFragment}

You must return a single, valid JSON object conforming exactly to the target typescript format.

Expected JSON Structure:
{
  "resume": {
    "candidateName": "full name of the candidate or 'Candidate Profile'",
    "email": "extracted contact email",
    "phone": "extracted contact phone number",
    "location": "extracted candidate address/location",
    "summary": "professional objective or summary statement (minimum 40 characters)",
    "education": [
      {
        "degree": "e.g. Master of Science in Computer Science",
        "institution": "e.g. Boston University",
        "year": "e.g. 2022",
        "gpa": "e.g. 3.8"
      }
    ],
    "experience": [
      {
        "role": "job title",
        "company": "company name",
        "duration": "employment dates/duration",
        "responsibilities": ["bullet point describing achievement, action-verb, or numeric metrics of impact"]
      }
    ],
    "projects": [
      {
        "title": "project name",
        "description": "project description",
        "technologies": ["used tech/skill name"]
      }
    ],
    "certifications": ["credential names"]
  },
  "skills": {
    "categories": [
      {
        "category": "Programming Languages" | "Frameworks & Libraries" | "Databases & Storage" | "Cloud & Architecture" | "DevOps, Automation & Tools" | "Soft Skills & Leadership",
        "skills": ["extracted skill 1", "extracted skill 2"]
      }
    ],
    "totalSkillsCount": number,
    "uncommonSkills": ["advanced or specialty technologies identified"],
    "industryContext": "brief 2-sentence description of the candidate's career tech ecosystem style"
  },
  "ats": {
    "overallScore": number (0 to 100),
    "status": "Pass" ("Pass" if overallScore >= 65, else "Fail"),
    "rules": [
      {
        "criterion": "Contact Information",
        "maxScore": 10,
        "score": number,
        "feedback": "detail feedback on completeness"
      },
      {
        "criterion": "Summary & Keywords",
        "maxScore": 15,
        "score": number,
        "feedback": "detail feedback on keyword density and objective target clarity"
      },
      {
        "criterion": "Work Experience Density",
        "maxScore": 25,
        "score": number,
        "feedback": "detail feedback on history lengths and action-verb quality"
      },
      {
        "criterion": "Quantifiable Impact",
        "maxScore": 20,
        "score": number,
        "feedback": "detail feedback checking for presence of numerical percentages, dollars, or metrics"
      },
      {
        "criterion": "Education & Credentials",
        "maxScore": 15,
        "score": number,
        "feedback": "detail feedback on academic and credential levels"
      },
      {
        "criterion": "Layout & Formatting structure",
        "maxScore": 15,
        "score": number,
        "feedback": "detail feedback on spacing structure, headers structure, and parsed clarity"
      }
    ],
    "formattingRating": "Excellent" | "Good" | "Needs Improvement",
    "strengths": ["proven strong elements found"],
    "redFlags": ["severe warning symbols, layout items, or content gaps to resolve"]
  },
  "rolePredictions": [
    {
      "roleName": "matching industry role from Full Stack Developer, Backend Developer, Frontend Developer, DevOps Engineer, ML Engineer, Data Scientist, Data Analyst, Mobile Developer, QA Automation Engineer, Product Manager",
      "confidence": number (0 to 100),
      "justification": "objective alignment description",
      "recommendedSkillsToAcquire": ["next milestone technologies required to dominate this path"]
    }
  ] (Provide exactly top 3 matching roles sorted descending by confidence),
  "improvements": [
    {
      "priority": "High" | "Medium" | "Low",
      "section": "associated layout structure section",
      "issue": "clear definition of structural flaw",
      "recommendation": "direct guide detailing how to fix issue",
      "exampleRevision": "BEFORE: ... \\nAFTER: ..."
    }
  ] (Provide exactly 5 concrete, prioritized actionable recommendations based on ATS feedback and job description gap analysis),
  "interviewQuestions": [
    {
      "skill": "associated technology/skill key",
      "topic": "topic bucket description (e.g. Databases, Behavioral, System Design, Concurrency)",
      "difficulty": "Beginner" | "Intermediate" | "Advanced",
      "question": "clear questions to challenge the candidate based on listed resume facts",
      "idealAnswerGuideline": "detailed guidelines illustrating what a high-quality answer sounds like"
    }
  ] (Provide exactly 6 interview questions: 2 technical, 2 behavioral based on experience achievements, 2 high-order conceptual/system design),
  "jdAnalysis": {
    "roleTitle": "title of job description position",
    "requiredSkills": ["core required tech skills from JD text"],
    "preferredSkills": ["preferred/bonus tech skills from JD text"],
    "experienceRequired": "e.g. 3+ years",
    "keyResponsibilities": ["core professional duties mandated"],
    "predictedRoleType": "Data Analyst" | "Data Scientist" | "ML Engineer" | "DevOps Engineer" | "Backend Developer" | "Full Stack Developer" | "Frontend Developer" | "Other"
  },
  "jdMatch": {
    "matchPercentage": number (0 to 100),
    "requiredSkillsMatch": number (0 to 100),
    "preferredSkillsMatch": number (0 to 100),
    "experienceFitRating": "Overqualified" | "Fully Met" | "Partially Met" | "Underqualified",
    "matchingSkills": ["overlapping core skills between candidate and requirements"],
    "missingSkills": ["important required/preferred skills in JD that candidate lacks"],
    "strengthsMatch": ["reasons why candidate matches the role perfectly"],
    "weaknessGaps": ["critical deficiencies, missing tools, or experience gaps to note"]
  }
}

STRICT RULE: Your output must contain ONLY the raw JSON block. Do not include markdown wraps like \`\`\`json, do not describe or introduce the response. Start directly with the brace { and end with the matching }. Respond with strict validity.`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: [contentPart, instructionPrompt],
    config: {
      responseMimeType: "application/json"
    }
  });

  const responseText = response.text?.trim() || "{}";
  const parsed = JSON.parse(responseText);

  // Validate parsed properties and construct fallbacks to ensure type safety
  const resume: ResumeDetails = {
    candidateName: parsed.resume?.candidateName || "Candidate Profile",
    email: parsed.resume?.email || "",
    phone: parsed.resume?.phone || "",
    location: parsed.resume?.location || "",
    summary: parsed.resume?.summary || "",
    education: parsed.resume?.education || [],
    experience: parsed.resume?.experience || [],
    projects: parsed.resume?.projects || [],
    certifications: parsed.resume?.certifications || []
  };

  const skills: SkillAnalysis = {
    categories: parsed.skills?.categories || [],
    totalSkillsCount: parsed.skills?.totalSkillsCount || 0,
    uncommonSkills: parsed.skills?.uncommonSkills || [],
    industryContext: parsed.skills?.industryContext || ""
  };

  const ats: AtsReport = {
    overallScore: parsed.ats?.overallScore || 0,
    status: parsed.ats?.status || (parsed.ats?.overallScore >= 65 ? "Pass" : "Fail"),
    rules: parsed.ats?.rules || [],
    formattingRating: parsed.ats?.formattingRating || "Needs Improvement",
    strengths: parsed.ats?.strengths || [],
    redFlags: parsed.ats?.redFlags || []
  };

  const rolePredictions: RolePrediction[] = parsed.rolePredictions || [];
  const improvements: ImprovementSuggestion[] = parsed.improvements || [];
  const interviewQuestions: InterviewQuestion[] = parsed.interviewQuestions || [];

  let jdAnalysis: JdAnalysis | undefined = undefined;
  let jdMatch: MatchReport | undefined = undefined;

  if (parsed.jdAnalysis) {
    jdAnalysis = {
      roleTitle: parsed.jdAnalysis.roleTitle || "Target Position",
      requiredSkills: parsed.jdAnalysis.requiredSkills || [],
      preferredSkills: parsed.jdAnalysis.preferredSkills || [],
      experienceRequired: parsed.jdAnalysis.experienceRequired || "",
      keyResponsibilities: parsed.jdAnalysis.keyResponsibilities || [],
      predictedRoleType: parsed.jdAnalysis.predictedRoleType || "Other"
    };
  }

  if (parsed.jdMatch) {
    jdMatch = {
      matchPercentage: parsed.jdMatch.matchPercentage || 0,
      requiredSkillsMatch: parsed.jdMatch.requiredSkillsMatch || 0,
      preferredSkillsMatch: parsed.jdMatch.preferredSkillsMatch || 0,
      experienceFitRating: parsed.jdMatch.experienceFitRating || "Partially Met",
      matchingSkills: parsed.jdMatch.matchingSkills || [],
      missingSkills: parsed.jdMatch.missingSkills || [],
      strengthsMatch: parsed.jdMatch.strengthsMatch || [],
      weaknessGaps: parsed.jdMatch.weaknessGaps || []
    };
  }

  // Phase 7: Locally construct visual chart payloads
  const dashboardAnalytics = runAnalyticsAgent(resume, skills, ats, rolePredictions);

  return {
    resume,
    skills,
    ats,
    rolePredictions,
    improvements,
    interviewQuestions,
    analytics: dashboardAnalytics,
    jdAnalysis,
    jdMatch
  };
}
