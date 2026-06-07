import { ImprovementSuggestion } from "../types.js";
import { Sparkles, TrendingUp, AlertTriangle, ArrowRight, CornerDownRight } from "lucide-react";

interface ImprovementPanelProps {
  improvements: ImprovementSuggestion[];
}

export function ImprovementPanel({ improvements }: ImprovementPanelProps) {
  return (
    <div id="improvement-panel-container" className="space-y-6 animate-fade-in">
      <div className="border border-white/10 bg-white/[0.03] backdrop-blur-[20px] rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Prioritized Improvement Blueprint</h3>
            <p className="text-sm text-gray-400">Agent 7 has evaluated layout density and target role alignment to build structural actions.</p>
          </div>
        </div>

        <div className="space-y-6">
          {improvements.map((imp, idx) => {
            const priorityColors = {
              High: "bg-rose-500/10 border-rose-500/20 text-rose-400",
              Medium: "bg-amber-500/10 border-amber-500/20 text-amber-400",
              Low: "bg-blue-500/10 border-blue-500/20 text-blue-400"
            };

            return (
              <div 
                key={idx} 
                className="p-5 md:p-6 bg-white/[0.01] border border-white/5 rounded-2.5xl relative overflow-hidden"
              >
                {/* Visual marker inside card depending on priority */}
                <div className={`absolute top-0 left-0 bottom-0 w-1 ${
                  imp.priority === "High" ? "bg-rose-500" : imp.priority === "Medium" ? "bg-amber-500" : "bg-blue-500"
                }`}></div>

                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 text-[11px] font-mono rounded-lg border uppercase tracking-wider ${priorityColors[imp.priority]}`}>
                      {imp.priority} Priority
                    </span>
                    <span className="text-xs text-indigo-400 font-mono">
                      in {imp.section}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                      The Issue:
                    </h4>
                    <p className="text-xs md:text-sm text-gray-400 mt-1 pl-5">
                      {imp.issue}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                      Actionable Guideline:
                    </h4>
                    <p className="text-xs md:text-sm text-gray-300 mt-1 pl-5 leading-relaxed">
                      {imp.recommendation}
                    </p>
                  </div>

                  {imp.exampleRevision && imp.exampleRevision.trim() !== "" && (
                    <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">Before & After Revision Sandbox</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1 bg-red-950/10 border border-red-900/10 p-3 rounded-lg">
                          <span className="text-red-400 font-mono text-[10px] uppercase font-bold">Unoptimized Draft</span>
                          <p className="text-gray-400 italic">
                            {imp.exampleRevision.split(/AFTER:/i)[0]?.replace(/BEFORE:/i, "")?.trim() || "Original copy missing quantification."}
                          </p>
                        </div>
                        <div className="space-y-1 bg-emerald-950/10 border border-emerald-900/10 p-3 rounded-lg relative">
                          <span className="text-emerald-400 font-mono text-[10px] uppercase font-bold flex items-center gap-1">
                            <ArrowRight className="w-3 h-3 text-emerald-400" />
                            Multi-Agent Approved Rewrite
                          </span>
                          <p className="text-gray-200 font-medium">
                            {imp.exampleRevision.split(/AFTER:/i)[1]?.trim() || imp.exampleRevision}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {improvements.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto opacity-40 mb-2" />
              <p className="text-sm">Congratulations! Your resume is highly competitive across all audited vectors.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// Define CheckCircle to handle TS warnings locally
function CheckCircle({ className, ...props }: { className?: string; [key: string]: any }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={2}
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
