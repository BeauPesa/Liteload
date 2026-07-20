import express from "express";
import multer from "multer";
import cors from "cors";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const upload = multer({ dest: "uploads/" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());

app.post("/parse", upload.single("pdf"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      error: "No PDF uploaded.",
    });
  }

  const parserPath = path.resolve(__dirname, "../parser.py");
  const pdfPath = path.resolve(req.file.path);

  const python = spawn("python3", [parserPath, pdfPath]);

  let stdout = "";
  let stderr = "";

  python.stdout.on("data", (data) => {
    stdout += data.toString();
  });

  python.stderr.on("data", (data) => {
    stderr += data.toString();
  });

  python.on("close", (code) => {
    if (code !== 0) {
      console.error(stderr);

      return res.status(500).json({
        error: "Parser failed.",
        details: stderr,
      });
    }

    res.json({
      success: true,
      output: stdout,
    });
  });
});

app.get("/", (req, res) => {
  res.send("LiteLoad backend is running.");
});

app.listen(3001, () => {
  console.log("🚛 LiteLoad backend running on http://localhost:3001");
});