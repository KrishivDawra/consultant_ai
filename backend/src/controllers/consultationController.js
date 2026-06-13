const cloudinary = require("../config/cloudinary");
const Consultation = require("../models/Consultation");

// AI SERVICE (Groq)
const {
  generateTranscript,
  generateSummary,
  generateInsights,
} = require("../services/aiService");

// 🧠 RAG IMPORT (ADD THIS)
const { storeConsultationEmbedding } = require("../rag/ragService");

// ================================
// 🔥 Cloudinary Upload Helper
// ================================
const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "consultai",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
};

// ================================
// 🚀 Upload Consultation (MAIN API)
// ================================
const uploadConsultation = async (req, res) => {
  try {
    const file = req.file;

    let recordingUrl = "";

    if (file) {
      const cloudResult = await streamUpload(file.buffer);
      recordingUrl = cloudResult.secure_url;
    }

    // 1. Upload to Cloudinary
    const cloudResult = await streamUpload(file.buffer);

    // 2. TRANSCRIPT
    if (!req.body.transcript) {
      return res.status(400).json({
        message: "Consultation notes are required",
      });
    }

    const transcript = req.body.transcript;

    // 3. SUMMARY (Groq)
    const summary = await generateSummary(transcript);

    // 4. INSIGHTS (Groq)
    const insights = await generateInsights(transcript);

    // 5. SAVE TO DATABASE
    const consultation = await Consultation.create({
      userId: req.user?.userId || null,
      clientName: req.body.clientName,
      recordingUrl: cloudResult.secure_url,
      transcript,
      summary,
      insights,
    });

    // 🧠 6. STORE EMBEDDING (RAG MEMORY) — ADD THIS
    //await storeConsultationEmbedding(consultation);

    return res.status(201).json({
      message: "Upload + AI processing successful",
      consultation,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ================================
// 📄 Get All Consultations
// ================================
const getConsultations = async (req, res) => {
  try {
    const data = await Consultation.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  uploadConsultation,
  getConsultations,
};