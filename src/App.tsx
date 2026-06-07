import { useState, useEffect } from "react";
import { ResumeUploader } from "./components/ResumeUploader.jsx";
import { DashboardView } from "./components/DashboardView.jsx";
import { ImprovementPanel } from "./components/ImprovementPanel.jsx";
import { InterviewPreparer } from "./components/InterviewPreparer.jsx";
import { PrintTemplate } from "./components/PrintTemplate.jsx";
import { FullAnalysisPayload } from "./types.js";
import { generatePrintableHtml } from "./utils/printHelper.js";
import { 
  Sparkles, 
  Settings, 
  BarChart3, 
  Wrench, 
  FolderGit2, 
  Printer, 
  FileJson, 
  RefreshCw, 
  HeartHandshake,
  Workflow
} from "lucide-react";

export default function App() {
  const [data, setData] = useState<FullAnalysisPayload | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState("Summoning Master Orchestrator...");
  const [activeTab, setActiveTab] = useState<"dashboard" | "improvements" | "interview">("dashboard");
  const [errorMsg, setErrorMsg] = useState("");

  // Professional, descriptive progress updates to simulate the analytical pipeline
  const loadingMessages = [
    "Orchestrating raw resume content blocks parsing...",
    "Mapping categorized taxonomic skill indices...",
    "Calculating ATS structural compliance grade...",
    "Aligning semantic vectors with job description...",
    "Simulating cosine similarity matching models...",
    "Projecting top predicted engineering roles...",
    "Synthesizing actionable resume rewrites blueprint...",
    "Coding custom situational and architectural checklists...",
    "Preparing telemetry metrics visualization dashboard...",
    "Compiling high-fidelity downloadable reports..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      let idx = 0;
      interval = setInterval(() => {
        if (idx < loadingMessages.length - 1) {
          idx++;
          setLoadingStage(loadingMessages[idx]);
        }
      }, 2300);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleAnalyze = async (file: File | null, resumeText: string, jdText: string) => {
    setIsLoading(true);
    setErrorMsg("");
    setData(null);
    setLoadingStage(loadingMessages[0]);

    try {
      const formData = new FormData();
      if (file) {
        formData.append("resume", file);
      }
      formData.append("resumeText", resumeText);
      formData.append("jdText", jdText);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Failed to analyze profile.");
      }

      const results: FullAnalysisPayload = await response.json();
      setData(results);
      setActiveTab("dashboard");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred during processing. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    // 1. Attempt native browser print framework
    try {
      window.print();
    } catch (err) {
      console.warn("Direct iframe sandbox container blocked print prompt:", err);
    }

    // 2. Instantly bundle and download the self-contained printable HTML report
    if (!data) return;
    try {
      const htmlContent = generatePrintableHtml(data);
      const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.id = "download-printable-html-trigger";
      link.href = url;
      link.download = `Print_Report_${data.resume.candidateName.replace(/\s+/g, "_")}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to generate offline print template file:", err);
    }
  };

  const handleDownloadJson = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.resume.candidateName.replace(/\s+/g, "_")}_Career_Blueprint.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="application-container" className="min-h-screen bg-[#070b1e] text-zinc-100 font-sans antialiased relative print:bg-white print:text-black">
      {/* Decorative ambient background glows - hidden when printing */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none print:hidden"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none print:hidden"></div>

      {/* Header Bar */}
      <header id="nav-header" className="border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-40 print:hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center p-0.5 shadow-lg shadow-indigo-500/10">
              <div className="w-full h-full bg-[#070b1e] rounded-[10px] flex items-center justify-center text-white font-bold text-lg leading-none">
                <Workflow className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <span className="font-bold text-sm md:text-base tracking-tight text-white flex items-center gap-1.5 leading-none">
                AI Resume Analyzer
              </span>
              <span className="text-[10px] font-mono text-zinc-500 block mt-0.5 uppercase tracking-widest font-semibold">
                Professional Intelligence Suite
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 print:p-0">
        {/* Splash Landing / File Upload panel */}
        {!data && !isLoading && (
          <div className="space-y-12 animate-fade-in print:hidden">
            {/* Title Hero */}
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <span className="px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 font-mono uppercase tracking-wider font-semibold inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Collaborative Analytics Framework
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
                Calibrate Your Placement Fit
              </h1>
              <p className="text-base md:text-lg text-zinc-400 max-w-2xl mx-auto font-sans leading-relaxed">
                Connect your professional details to an orchestra of specialized analytical engines evaluating layouts, careers, semantic gaps, and generating interview prep modules instantly.
              </p>
            </div>

            {errorMsg && (
              <div className="max-w-4xl mx-auto p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex gap-3 items-center">
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                <span>{errorMsg}</span>
              </div>
            )}

            <ResumeUploader onAnalyze={handleAnalyze} isLoading={isLoading} />
          </div>
        )}

        {/* Loading Dashboards */}
        {isLoading && (
          <div className="max-w-xl mx-auto py-24 text-center space-y-8 animate-fade-in print:hidden">
            <div className="relative inline-block">
              {/* Rotating outer frame */}
              <div className="w-16 h-16 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-spin"></div>
              {/* Heartbeat pulse */}
              <div className="absolute inset-2 bg-indigo-500/5 rounded-full animate-ping"></div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Analyzing Profile...</h3>
              <p className="text-sm font-mono text-indigo-300 px-4 py-2 bg-indigo-950/20 border border-indigo-500/15 rounded-xl inline-block max-w-[90%]">
                {loadingStage}
              </p>
              <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
                Our pipeline coordinates layout models, NLP dictionaries, semantic encoders, and revision engines. This takes around 15-20 seconds.
              </p>
            </div>
          </div>
        )}

        {/* Analytical Results Dashboard View */}
        {data && !isLoading && (
          <div className="space-y-8 print:m-0 print:p-0 print:space-y-0">
            {/* Header Controls (Tabs & Actions) - Hidden in Print View */}
            <div id="results-controls" className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/40 border border-white/5 p-4 rounded-3xl backdrop-blur-md print:hidden">
              {/* Navigation Tabs */}
              <div className="flex bg-white/5 p-1.5 rounded-2xl self-start md:self-auto gap-1">
                <button
                  type="button"
                  id="tab-btn-dashboard"
                  onClick={() => setActiveTab("dashboard")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition ${
                    activeTab === "dashboard" ? "bg-indigo-600 text-white shadow" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Analytics Dashboard
                </button>
                <button
                  type="button"
                  id="tab-btn-improvements"
                  onClick={() => setActiveTab("improvements")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition ${
                    activeTab === "improvements" ? "bg-indigo-600 text-white shadow" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Wrench className="w-4 h-4" />
                  Improvements Center
                </button>
                <button
                  type="button"
                  id="tab-btn-interview"
                  onClick={() => setActiveTab("interview")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition ${
                    activeTab === "interview" ? "bg-indigo-600 text-white shadow" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <FolderGit2 className="w-4 h-4" />
                  Q&A Interview Prep
                </button>
              </div>

              {/* Utility Export Actions */}
              <div className="flex items-center gap-2 self-end md:self-auto">
                <button
                  type="button"
                  id="btn-print-action"
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold font-sans bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20 transition active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  Print / Save PDF
                </button>
                <button
                  type="button"
                  id="btn-json-action"
                  onClick={handleDownloadJson}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold font-sans bg-white/5 border border-white/10 text-white hover:bg-white/10 transition active:scale-95"
                >
                  <FileJson className="w-4 h-4" />
                  Download JSON
                </button>
                <button
                  type="button"
                  id="btn-reanalyze-action"
                  onClick={() => { setData(null); setErrorMsg(""); }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold font-sans bg-zinc-800 text-zinc-300 hover:text-white transition hover:bg-zinc-700 active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>
            </div>

            {/* Main active tab components (Hidden in printer stylesheets) */}
            <div className="print:hidden">
              {activeTab === "dashboard" && <DashboardView data={data} />}
              {activeTab === "improvements" && <ImprovementPanel improvements={data.improvements} />}
              {activeTab === "interview" && <InterviewPreparer questions={data.interviewQuestions} />}
            </div>

            {/* High fidelity print layout (compiled natively to PDF during print dialog triggers) */}
            <PrintTemplate data={data} />
          </div>
        )}
      </main>

      {/* Footer bar - Hidden when printing */}
      <footer id="main-footer" className="border-t border-white/5 bg-black/20 py-8 text-center text-xs text-zinc-500 mt-20 print:hidden space-y-2">
        <p className="flex items-center justify-center gap-1">
          <HeartHandshake className="w-4 h-4 text-indigo-400" />
          AI Resume Analyzer powered by GenAI Career Intelligence
        </p>
      </footer>
    </div>
  );
}
