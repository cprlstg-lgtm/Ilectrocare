const fs = require("fs/promises");
const path = require("path");
const express = require("express");
const multer = require("multer");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { convertPdfFirstPageToImage } = require("../utils/pdfToImage");

const router = express.Router();

const SYSTEM_PROMPT = `You are an expert electrical engineer and technical drawing analyst.
Your job is to analyze electrical drawings, single line diagrams (SLD),
wiring diagrams, schematic diagrams — then explain them in clear Bengali.

For each drawing provide:
### ১. Drawing পরিচয়
### ২. Symbol তালিকা
### ৩. Power Flow (ধাপে ধাপে)
### ৪. সংযোগ বিবরণ
### ৫. Protection & Control
### ⚠️ সতর্কতা / ঝুঁকি

Rules:
- বাংলায় ব্যাখ্যা, technical terms ইংরেজিতে রাখো
- অনিশ্চিত হলে "সম্ভবত" বলো
- শেষে safety disclaimer যোগ করো:
  "⚠️ Actual কাজের আগে licensed electrician দিয়ে verify করাবেন।"`;

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "application/pdf"]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      const error = new Error("Only JPG, PNG, and PDF files are supported.");
      error.status = 400;
      return cb(error);
    }

    cb(null, true);
  },
});

function parseHistory(rawHistory) {
  if (!rawHistory) return [];

  try {
    const history = JSON.parse(rawHistory);
    if (!Array.isArray(history)) return [];

    return history
      .filter((message) => message && ["user", "assistant"].includes(message.role) && message.content)
      .slice(-10)
      .map((message) => ({
        role: message.role,
        content: String(message.content).slice(0, 4000),
      }));
  } catch {
    return [];
  }
}

function formatHistory(history) {
  if (!history.length) return "";

  return history
    .map((message) => `${message.role === "user" ? "User" : "Assistant"}: ${message.content}`)
    .join("\n\n");
}

router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "Server is missing GEMINI_API_KEY.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Please upload a JPG, PNG, or PDF file.",
      });
    }

    const question = String(req.body.question || "সম্পূর্ণ ব্যাখ্যা করো").trim();
    const history = parseHistory(req.body.history);

    let filePath = req.file.path;
    let mimeType = req.file.mimetype;

    if (req.file.mimetype === "application/pdf") {
      filePath = await convertPdfFirstPageToImage(req.file.path);
      mimeType = "image/png";
    }

    const fileBuffer = await fs.readFile(filePath);
    const base64File = fileBuffer.toString("base64");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    const historyText = formatHistory(history);
    const prompt = `Previous conversation, if relevant:
${historyText || "No previous messages."}

Current user question:
${question}

Analyze the uploaded drawing and answer in Bengali with clear markdown headings.`;

    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          data: base64File,
          mimeType,
        },
      },
    ]);

    const reply = result.response.text();

    res.json({
      success: true,
      reply,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
