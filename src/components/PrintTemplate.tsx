import { FullAnalysisPayload } from "../types.js";

interface PrintTemplateProps {
  data: FullAnalysisPayload;
}

export function PrintTemplate({ data }: PrintTemplateProps) {
  const { resume, skills, ats, rolePredictions, improvements, interviewQuestions, jdAnalysis, jdMatch } = data;

  return (
    <div id="print-report-template" className="hidden print:block bg-white text-black p-8 max-w-[210mm] mx-auto space-y-6 font-sans text-xs">
      {/* Print Document Header */}
      <div className="border-b-2 border-black pb-4 text-center space-y-1">
        <h1 className="text-2xl font-bold uppercase tracking-wider text-black">
          Comprehensive Resume Analysis Report
        </h1>
        <p className="text-sm font-medium text-gray-700">
          Career Calibration & HR Intelligence Blueprint
        </p>
        <p className="text-[10px] text-gray-500 font-mono">
          Compiled: {new Date().toLocaleDateString()} | Candidate: {resume.candidateName}
        </p>
      </div>

      {/* 2. Executive Score Summary */}
      <div className="grid grid-cols-3 gap-4 border border-black p-4 rounded-lg bg-gray-50">
        <div>
          <span className="text-[10px] font-mono uppercase text-gray-500 block">Candidate Name</span>
          <span className="font-bold text-sm text-black">{resume.candidateName}</span>
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase text-gray-500 block">Overall ATS Score</span>
          <span className="font-mono font-bold text-lg text-black">{ats.overallScore}/100 ({ats.status})</span>
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase text-gray-500 block">Suggested Prime Vector</span>
          <span className="font-bold text-sm text-black">{rolePredictions[0]?.roleName || "Technology Consultant"}</span>
        </div>
      </div>

      {/* Contact Info Row */}
      <div className="grid grid-cols-3 gap-2 text-[10px] text-gray-600 border-b border-gray-200 pb-2">
        {resume.email && <div><strong>Email:</strong> {resume.email}</div>}
        {resume.phone && <div><strong>Phone:</strong> {resume.phone}</div>}
        {resume.location && <div><strong>Location:</strong> {resume.location}</div>}
      </div>

      {/* 4. Semantic JD Alignment (If JD provided) */}
      {jdMatch && jdAnalysis && (
        <div className="border border-black p-3 rounded-lg space-y-2">
          <h2 className="text-xs font-bold uppercase border-b border-black pb-1">
            Job Match Diagnostics: {jdAnalysis.roleTitle}
          </h2>
          <div className="grid grid-cols-4 gap-2">
            <div>
              <span className="text-[9px] text-gray-500 font-mono uppercase block">Overall Match Fit</span>
              <strong className="text-sm">{jdMatch.matchPercentage}%</strong>
            </div>
            <div>
              <span className="text-[9px] text-gray-500 font-mono uppercase block">Req. Skills Match</span>
              <strong className="text-sm">{jdMatch.requiredSkillsMatch}%</strong>
            </div>
            <div>
              <span className="text-[9px] text-gray-500 font-mono uppercase block">Pref. Skills Match</span>
              <strong className="text-sm">{jdMatch.preferredSkillsMatch}%</strong>
            </div>
            <div>
              <span className="text-[9px] text-gray-500 font-mono uppercase block">Exp Fit Alignment</span>
              <strong className="text-sm text-gray-700">{jdMatch.experienceFitRating}</strong>
            </div>
          </div>
          <div className="text-[10px] text-gray-700">
            <strong>Matched Strengths:</strong> {jdMatch.strengthsMatch.join(", ") || "None listed."}
          </div>
          {jdMatch.missingSkills.length > 0 && (
            <div className="text-[10px] text-gray-700">
              <strong>Crucial Tech Gaps identified:</strong> {jdMatch.missingSkills.join(", ")}
            </div>
          )}
        </div>
      )}

      {/* 5. Career Taxonomy Balance */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase border-b border-black pb-1">
          Extracted Technology Taxonomy
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {skills.categories.map((cat, idx) => (
            <div key={idx} className="space-y-1">
              <span className="text-[9px] font-bold text-gray-700 uppercase tracking-wide font-mono block">
                {cat.category}
              </span>
              <p className="text-[10px] text-gray-800 leading-relaxed font-mono">
                {cat.skills.join(", ")}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Score Breakdown */}
      <div className="space-y-2 page-break-before">
        <h2 className="text-xs font-bold uppercase border-b border-black pb-1">
          ATS Audit Metric Gaps
        </h2>
        <table className="w-full text-left border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 font-mono text-[9px] uppercase border">
              <th className="p-1 border border-gray-300 w-1/3">Diagnostic Category</th>
              <th className="p-1 border border-gray-300 w-10 text-center">Score</th>
              <th className="p-1 border border-gray-300">Detailed Structural Feedback</th>
            </tr>
          </thead>
          <tbody>
            {ats.rules.map((rule, idx) => (
              <tr key={idx} className="border border-gray-300">
                <td className="p-1.5 border border-gray-300 font-semibold">{rule.criterion}</td>
                <td className="p-1.5 border border-gray-300 text-center font-mono">{rule.score}/{rule.maxScore}</td>
                <td className="p-1.5 border border-gray-300 text-gray-700 leading-normal">{rule.feedback}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 7. Action Improvements */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase border-b border-black pb-1">
          Prioritized Blueprint Revisions
        </h2>
        <div className="space-y-2">
          {improvements.map((imp, idx) => (
            <div key={idx} className="p-2 border border-gray-200 rounded leading-relaxed">
              <div className="flex justify-between font-mono text-[9px] text-gray-500 uppercase font-bold mb-1">
                <span>{imp.section} | {imp.priority} Priority</span>
              </div>
              <p className="text-[10px] text-black">
                <strong>Issue:</strong> {imp.issue}
              </p>
              <p className="text-[10px] text-gray-800 italic mt-0.5">
                <strong>Action:</strong> {imp.recommendation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 8. Active prep questions */}
      <div className="space-y-2 page-break-before">
        <h2 className="text-xs font-bold uppercase border-b border-black pb-1">
          Simulated Interview Sandbox Questions
        </h2>
        <div className="space-y-3">
          {interviewQuestions.map((q, idx) => (
            <div key={idx} className="space-y-1 p-2 border border-black/40 rounded">
              <div className="flex justify-between font-mono text-[9px] text-gray-500 uppercase font-bold">
                <span>{q.skill} ({q.difficulty})</span>
                <span>Type: {q.topic}</span>
              </div>
              <p className="text-[10px] font-semibold text-black">
                Q: {q.question}
              </p>
              <p className="text-[9px] text-gray-700 pl-3 border-l border-gray-300">
                <strong>Evaluation Matrix:</strong> {q.idealAnswerGuideline}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
