import express from "express";
import path from "path";
import multer from "multer";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { runMasterOrchestrator } from "./server-agents.js";

// Load environment variables
dotenv.config();

// Configure Multer for processing file uploads in memory (10MB Max File Size limit)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Direct standard request parsing limit configuration
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ extended: true, limit: "15mb" }));

  // Basic diagnostic status endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // Master Unified Analysis / Multi-Agent endpoint
  // Supports file resume upload (pdf/txt) AND/OR manually pasted text along with optional Job Description
  app.post("/api/analyze", upload.single("resume"), async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const jdText = req.body.jdText || "";
      const resumeText = req.body.resumeText || "";
      
      let fileBuffer: Buffer | undefined = undefined;
      let mimeType: string | undefined = undefined;

      if (req.file) {
        fileBuffer = req.file.buffer;
        mimeType = req.file.mimetype;
        console.log(`Analyzing uploaded file: ${req.file.originalname} (${mimeType})`);
      } else {
        console.log(`Analyzing manually entered text resume (Length: ${resumeText.length})`);
      }

      if (!fileBuffer && !resumeText.trim()) {
        res.status(400).json({ 
          error: "No resume provided. Please upload a PDF file or paste your resume content in plain text format." 
        });
        return;
      }

      // Run our brilliant 10-Agent pipeline
      const results = await runMasterOrchestrator(fileBuffer, mimeType, resumeText, jdText);

      res.json(results);
    } catch (error: any) {
      console.error("Analysis Pipeline Failed:", error);
      res.status(500).json({ 
        error: "We encountered an issue during analysis. Please ensure your PDF is readable/not corrupt, or try pasting your resume content as text.",
        details: error?.message || String(error)
      });
    }
  });

  // Handle Vite Asset Serving & Routing
  if (process.env.NODE_ENV !== "production") {
    // In dev mode, mount Vite middleware to serve hot/cold browser modules
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production mode, serve built static static assets directly
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Full-Stack Server] Dynamic multi-agent resume engine running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
