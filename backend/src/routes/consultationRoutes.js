const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

const {
  uploadConsultation,
  getConsultations,
} = require("../controllers/consultationController");

// Upload file
router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  uploadConsultation
);

// Get all
router.get("/", authMiddleware, getConsultations);

module.exports = router;