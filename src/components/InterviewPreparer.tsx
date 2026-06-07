import { useState } from "react";
import { InterviewQuestion } from "../types.js";
import { HelpCircle, ChevronRight, CheckSquare, Eye, Play, Keyboard } from "lucide-react";

interface InterviewPreparerProps {
  questions: InterviewQuestion[];
}

export function InterviewPreparer({ questions }: InterviewPreparerProps) {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [revealed, setRevealed] = useState<{ [key: number]: boolean }>({});
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  const handleTextChange = (idx: number, text: string) => {
    setAnswers(prev => ({ ...prev, [idx]: text }));
  };

  const toggleReveal = (idx: number) => {
    setRevealed(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const difficultyTags = {
    Beginner: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    Intermediate: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    Advanced: "bg-purple-500/10 border-purple-500/20 text-purple-400"
  };

  return (
    <div id="interview-preparer-container" className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      {/* Sidebar Selector list */}
      <div className="lg:col-span-1 border border-white/10 bg-white/[0.03] backdrop-blur-[20px] rounded-3xl p-5 md:p-6 shadow-xl space-y-4">
        <div>
          <h3 className="text-sm font-mono text-indigo-400 uppercase tracking-wider">Practice Sandbox</h3>
          <h2 className="text-lg font-semibold text-white mt-1">Simulated Interview</h2>
          <p className="text-xs text-gray-400 mt-1">Select structured questions generated dynamically by the analytics engine.</p>
        </div>

        <div className="space-y-2">
          {questions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              id={`q-btn-${idx}`}
              onClick={() => setSelectedIdx(idx)}
              className={`w-full text-left p-4 rounded-2xl transition border ${
                selectedIdx === idx
                  ? "bg-indigo-600/10 border-indigo-500 text-white shadow-md shadow-indigo-600/5"
                  : "bg-white/[0.01] border-white/5 hover:border-white/10 text-gray-400 hover:text-gray-300"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono border uppercase tracking-wider ${difficultyTags[q.difficulty]}`}>
                  {q.difficulty}
                </span>
                <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">{q.topic}</span>
              </div>
              <p className="text-xs md:text-sm font-medium line-clamp-2 pr-2 leading-relaxed">
                {q.question}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Active Question Simulator Workspace */}
      <div className="lg:col-span-2 border border-white/10 bg-white/[0.03] backdrop-blur-[20px] rounded-3xl p-6 md:p-8 shadow-xl flex flex-col justify-between">
        {questions[selectedIdx] ? (
          <div className="space-y-6 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4 pb-4 border-b border-white/5">
                <div>
                  <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest block">Focus Target</span>
                  <span className="text-lg font-semibold text-white font-mono">{questions[selectedIdx].skill}</span>
                </div>
                <div className="flex bg-white/5 px-3 py-1 rounded-full text-xs font-medium text-indigo-300 border border-white/5">
                  Type: {questions[selectedIdx].topic}
                </div>
              </div>

              {/* Question bubble */}
              <div className="p-4 p-5 md:p-6 bg-white/[0.02] border border-white/5 rounded-2.5xl relative overflow-hidden">
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600"></div>
                <h3 className="text-base md:text-lg text-white font-medium pl-2 leading-relaxed flex items-start gap-2.5">
                  <HelpCircle className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
                  {questions[selectedIdx].question}
                </h3>
              </div>

              {/* Practice Form Section */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Keyboard className="w-3.5 h-3.5" />
                    Write Practice Response
                  </span>
                  <span className="font-mono">{answers[selectedIdx]?.length || 0} characters</span>
                </div>
                <textarea
                  id={`practice-answer-${selectedIdx}`}
                  value={answers[selectedIdx] || ""}
                  onChange={(e) => handleTextChange(selectedIdx, e.target.value)}
                  placeholder="Draft your thoughts or type out a complete star-format response to test against rubrics..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/60 placeholder:text-gray-500 transition resize-none font-sans"
                />
              </div>
            </div>

            {/* Answer Evaluator / Guide */}
            <div className="space-y-4 pt-6 border-t border-white/5">
              <button
                type="button"
                id={`revealout-btn-${selectedIdx}`}
                onClick={() => toggleReveal(selectedIdx)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-semibold hover:bg-white/10 active:scale-95 transition"
              >
                <Eye className="w-4 h-4 text-indigo-400" />
                {revealed[selectedIdx] ? "Hide Evaluation Manual" : "Compare with Ideal Answer Benchmark"}
              </button>

              {revealed[selectedIdx] && (
                <div className="p-5 p-6 rounded-2xl bg-indigo-950/10 border border-indigo-500/10 space-y-4 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-mono text-indigo-300 uppercase tracking-widest font-bold">HIRING EVALUATION GUIDELINE:</span>
                  </div>
                  
                  <div className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans space-y-2">
                    <p className="font-semibold text-white">Ideal response characteristics:</p>
                    <div className="whitespace-pre-line pl-1 pl-4 border-l-2 border-indigo-500/30">
                      {questions[selectedIdx].idealAnswerGuideline}
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wide block mb-2">Self-Assessment Checklist</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-300">
                      <label className="flex items-center gap-2 cursor-pointer p-1">
                        <input type="checkbox" className="rounded bg-black border-white/10 text-indigo-600 focus:ring-0 focus:ring-offset-0" />
                        <span>Used STAR formatting framework</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer p-1">
                        <input type="checkbox" className="rounded bg-black border-white/10 text-indigo-600 focus:ring-0 focus:ring-offset-0" />
                        <span>Included specific numeric data/impact metrics</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer p-1">
                        <input type="checkbox" className="rounded bg-black border-white/10 text-indigo-600 focus:ring-0 focus:ring-offset-0" />
                        <span>Addressed technical trade-offs openly</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer p-1">
                        <input type="checkbox" className="rounded bg-black border-white/10 text-indigo-600 focus:ring-0 focus:ring-offset-0" />
                        <span>Demonstrated team collaborate/ownership</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Play className="w-12 h-12 text-indigo-500 mx-auto opacity-40 mb-2" />
            <p className="text-sm">Please select a question from the left sidebar to start practicing.</p>
          </div>
        )}
      </div>
    </div>
  );
}
