import { FullAnalysisPayload } from "../types.js";

/**
 * Generates an ultra-premium, self-contained, responsive HTML document
 * containing the full Career Calibration & Profile analysis report.
 * Styled with Tailwind CDN and optimized for standard A4/Letter size paper printouts.
 */
export function generatePrintableHtml(data: FullAnalysisPayload): string {
  const { resume, skills, ats, rolePredictions, improvements, interviewQuestions, jdAnalysis, jdMatch } = data;

  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume_Analysis_Report_${resume.candidateName.replace(/\s+/g, "_")}</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            serif: ['Georgia', 'serif'],
          }
        }
      }
    }
  </script>
  <style>
    @media print {
      body {
        background: white !important;
        color: black !important;
      }
      .no-print {
        display: none !important;
      }
      .page-break {
        page-break-before: always;
      }
    }
    body {
      background-color: #f8fafc;
      font-family: ui-sans-serif, system-ui, sans-serif;
    }
  </style>
</head>
<body class="text-slate-900 antialiased py-8 px-4 md:px-8">

  <!-- Floating Help Alert Header for Desktop Viewers -->
  <div class="no-print max-w-4xl mx-auto mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl shadow-sm text-sm flex flex-col md:flex-row items-center justify-between gap-3">
    <div class="flex items-center gap-3">
      <span class="flex h-3 w-3 relative">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
      </span>
      <p class="font-medium text-xs md:text-sm">
        <strong>Print Ready:</strong> This self-contained file was downloaded bypass-protecting sandboxed browser environments.
      </p>
    </div>
    <div class="flex gap-2">
      <button onclick="window.print()" class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm">
        Trigger Print (Ctrl + P)
      </button>
    </div>
  </div>

  <div class="max-w-[210mm] mx-auto bg-white p-8 md:p-12 border border-slate-200 shadow-lg rounded-3xl print:shadow-none print:border-none print:p-0 print:rounded-none">
    
    <!-- Report Header Banner -->
    <div class="border-b-4 border-slate-900 pb-6 text-center space-y-2">
      <h1 class="text-3xl font-extrabold tracking-tight text-slate-950 uppercase">
        Comprehensive Resume Analysis Report
      </h1>
      <p class="text-sm font-medium text-slate-600 tracking-wider font-mono">
        Career Calibration & HR Intelligence Analytics Index
      </p>
      <div class="text-xs text-slate-400 font-mono pt-1">
        Generated on: ${dateStr} | Profile: ${resume.candidateName}
      </div>
    </div>

    <!-- Executive Candidate Info & High level summary Card -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 print:bg-white print:border-slate-300">
      <div>
        <span class="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider block">Candidate Identity</span>
        <span class="font-bold text-base text-slate-900">${resume.candidateName}</span>
      </div>
      <div>
        <span class="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider block">ATS Audit Classification</span>
        <span class="font-bold text-base text-indigo-600 print:text-slate-900 font-mono">${ats.overallScore}/100 [${ats.status}]</span>
      </div>
      <div>
        <span class="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider block">Top Projected Path</span>
        <span class="font-bold text-base text-slate-900">${rolePredictions[0]?.roleName || "Technology Consultant"}</span>
      </div>
    </div>

    <!-- Contact details row -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 border-b border-slate-200 pb-4 mb-6 text-xs text-slate-600 print:border-slate-300">
      ${resume.email ? `<div><strong>Email Target:</strong> ${resume.email}</div>` : ""}
      ${resume.phone ? `<div><strong>Phone Target:</strong> ${resume.phone}</div>` : ""}
      ${resume.location ? `<div><strong>Registered Location:</strong> ${resume.location}</div>` : ""}
    </div>

    <!-- Semantic JD Alignment Segment (If JD matching active) -->
    ${jdMatch && jdAnalysis ? `
    <div class="border border-slate-900 p-6 rounded-2xl space-y-4 mb-8 bg-slate-50 print:bg-white print:border-slate-400">
      <h2 class="text-sm font-black uppercase text-slate-950 border-b border-slate-900 pb-2">
        Target Job Match Metrics: ${jdAnalysis.roleTitle}
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div class="p-4 bg-white border border-slate-200 rounded-xl">
          <span class="text-[9px] text-slate-500 font-mono uppercase block font-bold">Overall Match Fit</span>
          <strong class="text-xl text-indigo-600 print:text-slate-900 font-black font-mono">${jdMatch.matchPercentage}%</strong>
        </div>
        <div class="p-4 bg-white border border-slate-200 rounded-xl">
          <span class="text-[9px] text-slate-500 font-mono uppercase block font-bold">Required Skills Match</span>
          <strong class="text-xl text-slate-800 font-black font-mono">${jdMatch.requiredSkillsMatch}%</strong>
        </div>
        <div class="p-4 bg-white border border-slate-200 rounded-xl">
          <span class="text-[9px] text-slate-500 font-mono uppercase block font-bold">Preferred Skills Match</span>
          <strong class="text-xl text-slate-800 font-black font-mono">${jdMatch.preferredSkillsMatch}%</strong>
        </div>
        <div class="p-4 bg-white border border-slate-200 rounded-xl">
          <span class="text-[9px] text-slate-500 font-mono uppercase block font-bold">Experience Fit</span>
          <strong class="text-base text-slate-800 font-bold">${jdMatch.experienceFitRating}</strong>
        </div>
      </div>
      <div class="text-xs text-slate-800 leading-relaxed space-y-1.5 pt-2">
        <div><strong>Aligned Profile Strengths:</strong> ${jdMatch.strengthsMatch.join(", ") || "No specific overlaps reported."}</div>
        ${jdMatch.missingSkills.length > 0 ? `<div><strong class="text-red-700 print:text-slate-950 font-bold">Identified Technology Deficiencies:</strong> ${jdMatch.missingSkills.join(", ")}</div>` : ""}
        ${jdMatch.weaknessGaps.length > 0 ? `<div><strong>Calibration Weaknesses:</strong> ${jdMatch.weaknessGaps.join(", ")}</div>` : ""}
      </div>
    </div>
    ` : ""}

    <!-- Dynamic Technological Taxonomy -->
    <div class="space-y-3 mb-8">
      <h2 class="text-sm font-black uppercase text-slate-950 border-b border-slate-900 pb-2">
        Extracted Technology Taxonomy
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${skills.categories.map(cat => `
          <div class="space-y-1">
            <span class="text-[10px] font-black text-slate-700 uppercase tracking-wide font-mono block">
              ${cat.category}
            </span>
            <p class="text-slate-800 leading-relaxed font-mono text-xs">
              ${cat.skills.join(", ") || "No mapped indexes."}
            </p>
          </div>
        `).join("")}
      </div>
    </div>

    <!-- Page break for cleaner page alignments -->
    <div class="page-break"></div>

    <!-- Tabular ATS Scores breakdown -->
    <div class="space-y-3 mb-8">
      <h2 class="text-sm font-black uppercase text-slate-950 border-b border-slate-900 pb-2">
        Detailed ATS Compliance Audit Gaps
      </h2>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse border border-slate-350">
          <thead>
            <tr class="bg-slate-100 font-mono text-[10px] uppercase border font-bold text-slate-700">
              <th class="p-2 border border-slate-300 w-1/3">Diagnostic Metric Focus</th>
              <th class="p-2 border border-slate-300 w-16 text-center">Audit Grade</th>
              <th class="p-2 border border-slate-300">Detailed Structural Compliance Feedback</th>
            </tr>
          </thead>
          <tbody>
            ${ats.rules.map(rule => `
              <tr class="border-b border-slate-200">
                <td class="p-2 border border-slate-300 font-bold text-slate-800">${rule.criterion}</td>
                <td class="p-2 border border-slate-300 text-center font-mono font-bold">${rule.score}/${rule.maxScore}</td>
                <td class="p-2 border border-slate-300 text-slate-600 leading-relaxed">${rule.feedback}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Action Improvements Matrix -->
    <div class="space-y-3 mb-8">
      <h2 class="text-sm font-black uppercase text-slate-950 border-b border-slate-900 pb-2">
        Prioritized Actionable Blueprints & Suggestions
      </h2>
      <div class="space-y-3">
        ${improvements.map(imp => `
          <div class="p-4 border border-slate-200 rounded-xl bg-slate-50 print:bg-white print:border-slate-300">
            <div class="flex justify-between items-center text-[10px] font-mono text-slate-400 font-bold uppercase mb-1">
              <span>Section Target: ${imp.section}</span>
              <span class="px-2 py-0.5 bg-slate-200 text-slate-700 rounded-sm font-black tracking-wider print:bg-none">${imp.priority} Priority</span>
            </div>
            <p class="text-xs text-slate-900 font-semibold">
              <strong>Observed Flaw:</strong> ${imp.issue}
            </p>
            <p class="text-xs text-slate-700 mt-1 italic">
              <strong>Remediation Method:</strong> ${imp.recommendation}
            </p>
            ${imp.exampleRevision ? `
            <div class="mt-2 text-[10px] font-mono bg-slate-100 p-2.5 rounded-lg border border-slate-200 text-slate-800 whitespace-pre-wrap max-w-full overflow-hidden leading-relaxed">
              ${imp.exampleRevision}
            </div>
            ` : ""}
          </div>
        `).join("")}
      </div>
    </div>

    <div class="page-break"></div>

    <!-- Active Prep Questions Sandbox -->
    <div class="space-y-3 mb-4">
      <h2 class="text-sm font-black uppercase text-slate-950 border-b border-slate-900 pb-2">
        Simulated Question & Answer Practice Guide
      </h2>
      <div class="space-y-4">
        ${interviewQuestions.map((q, idx) => `
          <div class="space-y-2 p-4 border border-slate-250 rounded-xl">
            <div class="flex justify-between items-center text-[10px] font-mono text-slate-400 font-bold uppercase">
              <span>Focus Target: ${q.skill} (${q.difficulty})</span>
              <span>Topic: ${q.topic}</span>
            </div>
            <p class="text-xs font-bold text-slate-950">
              Q${idx + 1}: ${q.question}
            </p>
            <div class="text-[11px] text-slate-600 pl-4 border-l-2 border-slate-400 leading-relaxed font-serif italic whitespace-pre-line">
              <strong>Response Evaluation Guideline:</strong><br />
              ${q.idealAnswerGuideline}
            </div>
          </div>
        `).join("")}
      </div>
    </div>

    <!-- Document Footer -->
    <div class="border-t border-slate-200 pt-6 mt-12 text-center text-[10px] text-slate-400 no-print">
      End of Report. Press keyboard combination <strong>Ctrl + P</strong> (Windows) or <strong>Cmd + P</strong> (Mac) to export this exact view directly safely.
    </div>

  </div>

  <script>
    // Safe auto-activation wrapper
    window.addEventListener("DOMContentLoaded", function() {
      // Small timeout delay ensures browser styles and google/tailwind rendering settle before prompt
      setTimeout(function() {
        window.print();
      }, 1000);
    });
  </script>
</body>
</html>`;
}
