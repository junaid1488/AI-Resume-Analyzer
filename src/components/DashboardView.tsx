import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell
} from "recharts";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Cpu, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle, 
  AlertTriangle 
} from "lucide-react";
import { FullAnalysisPayload } from "../types.js";

interface DashboardViewProps {
  data: FullAnalysisPayload;
}

export function DashboardView({ data }: DashboardViewProps) {
  const { resume, skills, ats, rolePredictions, analytics, jdAnalysis, jdMatch } = data;

  // Format skills radar data
  const radarData = analytics.skillRadar.labels.map((label, idx) => ({
    subject: label,
    value: analytics.skillRadar.values[idx] || 0,
    fullMark: 10
  }));

  // Format roles confidences data
  const rolesData = rolePredictions.map(r => ({
    name: r.roleName,
    confidence: r.confidence
  }));

  return (
    <div id="dashboard-view-container" className="space-y-8 animate-fade-in">
      {/* 1. Candidate Hero Card */}
      <div id="candidate-hero-card" className="border border-white/10 bg-white/[0.03] backdrop-blur-[20px] rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-sans font-bold text-white tracking-tight">
                  {resume.candidateName}
                </h1>
                <p className="text-indigo-400 font-medium text-sm">
                  Top Target Path: {rolePredictions[0]?.roleName || "Technology Specialist"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs md:text-sm text-gray-400">
              {resume.email && (
                <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5">
                  <Mail className="w-3.5 h-3.5 text-indigo-300" />
                  {resume.email}
                </span>
              )}
              {resume.phone && (
                <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5">
                  <Phone className="w-3.5 h-3.5 text-indigo-300" />
                  {resume.phone}
                </span>
              )}
              {resume.location && (
                <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-300" />
                  {resume.location}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-row items-center gap-4 self-stretch md:self-auto justify-between border-t border-white/5 md:border-0 pt-4 md:pt-0">
            <div className="text-center md:text-right">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block">ATS Score</span>
              <span className={`text-4xl md:text-5xl font-mono font-bold ${
                ats.overallScore >= 85 ? "text-emerald-400" : ats.overallScore >= 65 ? "text-amber-400" : "text-rose-400"
              }`}>
                {ats.overallScore}
              </span>
              <span className="text-xs text-gray-500 font-mono">/100</span>
            </div>
            {jdMatch && (
              <div className="text-center md:text-right border-l border-white/10 pl-4 md:pl-6">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block">JD Fit</span>
                <span className={`text-4xl md:text-5xl font-mono font-bold ${
                  jdMatch.matchPercentage >= 75 ? "text-emerald-400" : jdMatch.matchPercentage >= 50 ? "text-amber-400" : "text-rose-400"
                }`}>
                  {jdMatch.matchPercentage}%
                </span>
                <span className="text-xs text-indigo-400 font-mono block mt-0.5">{jdAnalysis?.roleTitle}</span>
              </div>
            )}
          </div>
        </div>

        {resume.summary && (
          <div className="mt-6 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
            <p className="text-sm text-gray-300 leading-relaxed italic">
              &ldquo;{resume.summary}&rdquo;
            </p>
          </div>
        )}
      </div>

      {/* 2. Key Interactive Visualizations Panel */}
      <div id="analytics-charts-panel" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart: Skill Taxonomy Profile */}
        <div className="border border-white/10 bg-white/[0.03] backdrop-blur-[20px] rounded-3xl p-6 shadow-xl flex flex-col h-[400px]">
          <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            Skill Balance Distribution
          </h3>
          <p className="text-xs text-gray-400 mb-6">Proportional strength count across extracted organizational taxonomy buckets.</p>
          <div className="w-full flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#3f3f46" strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#d4d4d8', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: '#71717a' }} />
                <Radar
                  name="Category Skills Count"
                  dataKey="value"
                  stroke="#818cf8"
                  fill="#818cf8"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Predicted Career Path match */}
        <div className="border border-white/10 bg-white/[0.03] backdrop-blur-[20px] rounded-3xl p-6 shadow-xl flex flex-col h-[400px]">
          <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-400" />
            Matching Role Vectors
          </h3>
          <p className="text-xs text-gray-400 mb-6">Comparative alignment confidence across mainstream engineering vectors.</p>
          <div className="w-full flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={rolesData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
              >
                <XAxis type="number" domain={[0, 100]} tick={{ fill: '#a1a1aa', fontSize: 10 }} />
                <YAxis dataKey="name" type="category" width={110} tick={{ fill: '#d4d4d8', fontSize: 10 }} />
                <Tooltip
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '12px' }}
                  labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                />
                <Bar dataKey="confidence" radius={[0, 8, 8, 0]}>
                  {rolesData.map((entry, index) => {
                    const colors = ["#6366f1", "#8b5cf6", "#ec4899"];
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. JD Match Details / Semantic Fit Panel */}
      {jdMatch && jdAnalysis && (
        <div id="jd-analysis-summary" className="border border-indigo-500/20 bg-indigo-950/10 backdrop-blur-[20px] rounded-3xl p-6 md:p-8 shadow-xl">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400 animate-pulse" />
            Semantic Alignment & Gap Analysis ({jdAnalysis.roleTitle})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="p-4 bg-white/[0.02] rounded-2.5xl border border-white/5">
              <span className="text-xs text-gray-400 block mb-1">Required Skills Match</span>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${jdMatch.requiredSkillsMatch}%` }}></div>
                </div>
                <span className="text-sm font-mono font-semibold text-white">{jdMatch.requiredSkillsMatch}%</span>
              </div>
            </div>
            
            <div className="p-4 bg-white/[0.02] rounded-2.5xl border border-white/5">
              <span className="text-xs text-gray-400 block mb-1">Preferred Skills Match</span>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${jdMatch.preferredSkillsMatch}%` }}></div>
                </div>
                <span className="text-sm font-mono font-semibold text-white">{jdMatch.preferredSkillsMatch}%</span>
              </div>
            </div>

            <div className="p-4 bg-white/[0.02] rounded-2.5xl border border-white/5">
              <span className="text-xs text-gray-400 block mb-1">Experience Alignment</span>
              <span className={`text-sm font-semibold flex items-center gap-1.5 ${
                jdMatch.experienceFitRating === "Fully Met" || jdMatch.experienceFitRating === "Overqualified" ? "text-emerald-400" : "text-amber-400"
              }`}>
                <CheckCircle className="w-4 h-4 shrink-0" />
                {jdMatch.experienceFitRating}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-emerald-400 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Matched Strengths
              </h4>
              <ul className="space-y-1.5">
                {jdMatch.strengthsMatch.map((str, idx) => (
                  <li key={idx} className="text-xs md:text-sm text-gray-300 flex items-start gap-1.5">
                    <span className="text-indigo-400 mt-1 shrink-0">•</span>
                    {str}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-amber-400 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Key Gaps & Missing Technologies
              </h4>
              <div className="flex flex-wrap gap-2 mb-3">
                {jdMatch.missingSkills.map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-xs">
                    {skill}
                  </span>
                ))}
                {jdMatch.missingSkills.length === 0 && (
                  <span className="text-xs text-gray-400 italic">No critical missing skill gaps detected!</span>
                )}
              </div>
              <ul className="space-y-1.5">
                {jdMatch.weaknessGaps.map((gap, idx) => (
                  <li key={idx} className="text-xs md:text-sm text-gray-400 flex items-start gap-1.5">
                    <span className="text-amber-400 mt-1 shrink-0">•</span>
                    {gap}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 4. Categorized Industry Skills Taxonomy Component */}
      <div id="skills-taxonomy-block" className="border border-white/10 bg-white/[0.03] backdrop-blur-[20px] rounded-3xl p-6 md:p-8 shadow-xl">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-400" />
          Extracted Career Architecture Taxonomy
        </h3>
        <p className="text-sm text-gray-400 mb-6">{skills.industryContext}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.categories.map((category, idx) => (
            <div key={idx} className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-xs text-indigo-300/80 font-medium font-mono uppercase tracking-wider block mb-2">
                  {category.category}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {category.skills.map((skill, sIdx) => {
                    const isMatchedInJd = jdMatch?.matchingSkills?.includes(skill);
                    return (
                      <span 
                        key={sIdx} 
                        className={`px-2 py-1 rounded-md text-xs font-mono border ${
                          isMatchedInJd 
                            ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-200 font-semibold"
                            : "bg-white/5 border-white/5 text-gray-300"
                        }`}
                      >
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {skills.uncommonSkills && skills.uncommonSkills.length > 0 && (
          <div className="mt-6 pt-6 border-t border-white/5">
            <span className="text-xs text-indigo-400 font-mono uppercase tracking-wider block mb-2">
              Advanced / Uncommon Specialty Identifiers:
            </span>
            <div className="flex flex-wrap gap-2">
              {skills.uncommonSkills.map((spec, sIdx) => (
                <span key={sIdx} className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/25 text-purple-200 font-mono text-xs">
                  {spec}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 5. ATS scoring metrics breakdown & Structural Health checks */}
      <div id="container-ats" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rules Checklist */}
        <div className="lg:col-span-2 border border-white/10 bg-white/[0.03] backdrop-blur-[20px] rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" />
            ATS Criterion Compliance Audit
          </h3>
          <div className="divide-y divide-white/5">
            {ats.rules.map((rule, idx) => (
              <div key={idx} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 first:pt-0 last:pb-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-white">{rule.criterion}</span>
                    <span className="text-xs text-gray-500 font-mono">({rule.score}/{rule.maxScore} pts)</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed max-w-[500px]">
                    {rule.feedback}
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="w-32 bg-white/5 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        (rule.score / rule.maxScore) >= 0.8 ? "bg-emerald-500" : (rule.score / rule.maxScore) >= 0.6 ? "bg-amber-400" : "text-rose-500 bg-rose-500"
                      }`}
                      style={{ width: `${(rule.score / rule.maxScore) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Health Indicators / Red Flags */}
        <div className="border border-white/10 bg-white/[0.03] backdrop-blur-[20px] rounded-3xl p-6 shadow-xl flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              Impact Audits & Red Flags
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white/[0.01] border border-white/5">
                <span className="text-gray-300">Contact Details Verified</span>
                {analytics.healthIndicators.hasContactInfo ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                )}
              </div>
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white/[0.01] border border-white/5">
                <span className="text-gray-300">Executive Summary Checked</span>
                {analytics.healthIndicators.hasSummary ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                )}
              </div>
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white/[0.01] border border-white/5">
                <span className="text-gray-300">Work Experience Tracked</span>
                {analytics.healthIndicators.hasExperience ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                )}
              </div>
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white/[0.01] border border-white/5">
                <span className="text-gray-300">Projects Section Extracted</span>
                {analytics.healthIndicators.hasProjects ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                )}
              </div>
            </div>
          </div>

          {ats.redFlags && ats.redFlags.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 space-y-2">
              <span className="text-xs text-rose-300 font-mono font-semibold uppercase tracking-wider block">
                Warning Flags Identified:
              </span>
              <ul className="space-y-1">
                {ats.redFlags.map((flag, idx) => (
                  <li key={idx} className="text-[11px] text-gray-400 flex items-start gap-1">
                    <span className="text-rose-400 mt-1 shrinkage-0">•</span>
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* 6. Parsed Work History & Details Verification */}
      <div id="career-history-blocks" className="border border-white/10 bg-white/[0.03] backdrop-blur-[20px] rounded-3xl p-6 md:p-8 shadow-xl">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-400" />
          Extracted Career Trajectory
        </h3>

        <div className="space-y-8">
          {resume.experience.map((exp, idx) => (
            <div key={idx} className="relative pl-6 border-l-2 border-indigo-500/20 last:border-0 pb-2">
              <div className="absolute left-[-6px] top-1 w-[10px] h-[10px] rounded-full bg-indigo-500 shadow-md"></div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                <div>
                  <h4 className="text-base font-semibold text-white">{exp.role}</h4>
                  <p className="text-sm text-indigo-300/80 font-medium">@{exp.company}</p>
                </div>
                <span className="text-xs font-mono text-gray-400 bg-white/5 border border-white/5 px-2.5 py-1 rounded-md self-start md:self-auto">
                  {exp.duration}
                </span>
              </div>

              <ul className="space-y-1.5 list-disc pl-5 text-xs md:text-sm text-gray-300 leading-relaxed">
                {exp.responsibilities.map((resp, rIdx) => (
                  <li key={rIdx}>{resp}</li>
                ))}
              </ul>
            </div>
          ))}
          {resume.experience.length === 0 && (
            <p className="text-xs text-gray-500 italic">No professional experiences parsed.</p>
          )}
        </div>
      </div>

      {/* 7. Education, Projects & Certifications Side-by-Side */}
      <div id="side-by-side-academic" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Education & Credentials */}
        <div className="border border-white/10 bg-white/[0.03] backdrop-blur-[20px] rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            Education & Academic Credentials
          </h3>
          <div className="space-y-4">
            {resume.education.map((edu, idx) => (
              <div key={idx} className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl space-y-1">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="text-sm font-semibold text-white">{edu.degree}</h4>
                  <span className="text-[10px] font-mono text-gray-400 bg-white/5 px-1.5 py-0.5 rounded">
                    {edu.year}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{edu.institution}</p>
                {edu.gpa && edu.gpa !== "N/A" && edu.gpa.trim() !== "" && (
                  <p className="text-xs text-indigo-300 font-mono mt-1">GPA: {edu.gpa}</p>
                )}
              </div>
            ))}
            {resume.education.length === 0 && (
              <p className="text-xs text-gray-500 italic">No academic credentials found.</p>
            )}
          </div>
        </div>

        {/* Certifications Card */}
        <div className="border border-white/10 bg-white/[0.03] backdrop-blur-[20px] rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" />
            Certifications & Industry Badges
          </h3>
          <div className="flex flex-wrap gap-2">
            {resume.certifications.map((cert, idx) => (
              <span key={idx} className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                {cert}
              </span>
            ))}
            {resume.certifications.length === 0 && (
              <p className="text-xs text-gray-400 italic">No industry credentials listed.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
