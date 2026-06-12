const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    clientName: String,

    recordingUrl: String,

    transcript: String,

    summary: String,

    insights: Object,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Consultation", consultationSchema);