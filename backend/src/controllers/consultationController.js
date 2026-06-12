const cloudinary = require("../config/cloudinary");
const Consultation = require("../models/Consultation");

const {
  generateTranscript,
  generateSummary,
  generateInsights,
} = require("../services/geminiService");


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

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // 1. Upload to Cloudinary
    const cloudResult = await streamUpload(file.buffer);

    // 2. Generate AI Transcript (temporary prompt-based)
    const transcript = await generateTranscript(
      "User discussed project delays, system issues, and backend architecture challenges during consultation."
    );

    // 3. Generate Summary
    const summary = await generateSummary(transcript);

    // 4. Generate Insights
    const insights = await generateInsights(transcript);

    // 5. Save to MongoDB
    const consultation = await Consultation.create({
      userId: req.user?.userId || null,
      clientName: req.body.clientName,
      recordingUrl: cloudResult.secure_url,
      transcript,
      summary,
      insights,
    });

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