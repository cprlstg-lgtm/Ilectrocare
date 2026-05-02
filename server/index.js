const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const analyzeRouter = require("./routes/analyze");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "electrical-drawing-explainer" });
});

app.use("/api/analyze", analyzeRouter);

const clientDist = path.join(__dirname, "..", "client", "dist");

if (process.env.NODE_ENV === "production") {
  app.use(express.static(clientDist));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.use((err, _req, res, _next) => {
  console.error(err);

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      success: false,
      error: "File size must be 10MB or less.",
    });
  }

  return res.status(err.status || 500).json({
    success: false,
    error: err.message || "Something went wrong.",
  });
});

app.listen(PORT, () => {
  console.log(`Electrical Drawing Explainer API running on http://localhost:${PORT}`);
});
