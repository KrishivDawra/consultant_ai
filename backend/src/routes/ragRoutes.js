const express = require("express");
const router = express.Router();

const { askRag } = require("../rag/ragService");

// 🧠 RAG CHAT ENDPOINT
router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    const answer = await askRag(question);

    res.json({
      question,
      answer,
    });
  } catch (err) {
    console.error("RAG ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;