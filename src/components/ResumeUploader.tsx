import React, { useState, useRef } from "react";
import { Upload, FileText, Clipboard, Sparkles, Building, AlertCircle } from "lucide-react";

interface ResumeUploaderProps {
  onAnalyze: (file: File | null, resumeText: string, jdText: string) => void;
  isLoading: boolean;
}

export function ResumeUploader({ onAnalyze, isLoading }: ResumeUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [inputType, setInputType] = useState<"file" | "paste">("file");
  const [errorMsg, setErrorMsg] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setErrorMsg("");

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setErrorMsg("");
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const isPdf = selectedFile.type === "application/pdf" || selectedFile.name.endsWith(".pdf");
    const isTxt = selectedFile.type === "text/plain" || selectedFile.name.endsWith(".txt");
    
    if (isPdf || isTxt) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setErrorMsg("File size exceeds 10MB limit.");
        return;
      }
      setFile(selectedFile);
    } else {
      setErrorMsg("Unsupported file format. Please upload a PDF or plain text (.txt) file.");
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputType === "file" && !file) {
      setErrorMsg("Please upload a resume file first.");
      return;
    }
    if (inputType === "paste" && !resumeText.trim()) {
      setErrorMsg("Please paste your resume text content.");
      return;
    }
    setErrorMsg("");
    onAnalyze(inputType === "file" ? file : null, resumeText, jdText);
  };

  return (
    <div id="resume-uploader-container" className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div id="uploader-card" className="border border-white/10 bg-white/[0.03] backdrop-blur-[20px] rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative subtle top gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/5">
          <div>
            <h2 className="text-xl md:text-2xl font-sans font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              1. Upload Candidate Profile
            </h2>
            <p className="text-sm text-gray-400 mt-1">Provide your resume via file upload (PDF/TXT) or manual copy-paste.</p>
          </div>
          
          <div className="flex bg-white/5 p-1 rounded-xl self-start md:self-auto">
            <button
              type="button"
              id="btn-toggle-file"
              onClick={() => { setInputType("file"); setErrorMsg(""); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition ${
                inputType === "file" ? "bg-indigo-600 text-white shadow-md" : "text-gray-400 hover:text-white"
              }`}
            >
              <Upload className="w-4 h-4" />
              PDF / TXT File
            </button>
            <button
              type="button"
              id="btn-toggle-paste"
              onClick={() => { setInputType("paste"); setErrorMsg(""); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition ${
                inputType === "paste" ? "bg-indigo-600 text-white shadow-md" : "text-gray-400 hover:text-white"
              }`}
            >
              <Clipboard className="w-4 h-4" />
              Paste Text
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div id="error-banner" className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {inputType === "file" ? (
            <div
              id="file-dropzone"
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={onButtonClick}
              className={`border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition cursor-pointer flex flex-col items-center justify-center gap-4 ${
                dragActive 
                  ? "border-indigo-400 bg-indigo-500/10" 
                  : "border-white/15 bg-white/[0.01] hover:border-white/30 hover:bg-white/[0.02]"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                name="resume"
                id="resume-file-input"
                className="hidden"
                accept=".pdf,.txt"
                onChange={handleChange}
              />
              
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-lg relative cursor-pointer">
                <Upload className="w-8 h-8 text-indigo-400" />
              </div>

              <div>
                <p className="text-base md:text-lg font-medium text-white">
                  {file ? file.name : "Drag & drop your resume file here"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Supports readable PDF or plain TXT files (Up to 10MB)
                </p>
              </div>

              {!file ? (
                <button
                  type="button"
                  id="btn-choose-file"
                  className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 active:scale-95 transition"
                >
                  Choose File
                </button>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  File loaded successfully
                </div>
              )}
            </div>
          ) : (
            <div id="paste-textbox" className="space-y-2">
              <label htmlFor="resumeText" className="block text-sm font-medium text-gray-300">
                Resume Content (Text)
              </label>
              <textarea
                id="resumeText"
                name="resumeText"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste the raw text of your resume here..."
                rows={8}
                className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/60 placeholder:text-gray-500 transition font-mono resize-y"
              />
            </div>
          )}

          {/* Optional Job Description Match section */}
          <div id="jd-section" className="pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <Building className="w-5 h-5 text-purple-400" />
              <label htmlFor="jdText" className="block text-base font-medium text-white">
                2. Target Job Description (Optional)
              </label>
            </div>
            <p className="text-sm text-gray-400 mb-2">
              Provide the job description description to evaluate skills alignment, semantic compatibility, and calculate role fit percentage.
            </p>
            <textarea
              id="jdText"
              name="jdText"
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the job description or role requirements here to run Agent 4 & 5 (semantic match analyzer)..."
              rows={4}
              className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/60 placeholder:text-gray-500 transition resize-y"
            />
          </div>

          <div id="submit-btn-row" className="flex justify-end pt-4">
            <button
              type="submit"
              id="btn-trigger-analysis"
              disabled={isLoading}
              className="w-full md:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-white font-medium hover:opacity-90 active:scale-[0.98] transition shadow-lg shadow-indigo-600/20 shrink-0 flex items-center justify-center gap-2 text-sm md:text-base disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Agents Evaluating Profile...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-indigo-200" />
                  Analyze Profile with 10-Agent Team
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Trust/Benefits indicators */}
      <div id="benefits-row" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Deterministic Parsing", desc: "Agent 1 & 2 handle layouts flawlessly with deep learning." },
          { title: "ATS Inspection Audit", desc: "Agent 3 reviews contact points, keywords, and spacing structures." },
          { title: "AI-Generated Q&A Engine", desc: "Agent 8 crafts customized technical prep questions." }
        ].map((benefit, i) => (
          <div key={i} className="p-4 border border-white/5 bg-white/[0.01] rounded-2xl backdrop-blur-sm flex items-start gap-3">
            <div className="w-8 h-8 shrink-0 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-mono text-sm">
              0{i + 1}
            </div>
            <div>
              <h4 className="text-white text-sm font-medium">{benefit.title}</h4>
              <p className="text-gray-400 text-xs mt-1">{benefit.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
