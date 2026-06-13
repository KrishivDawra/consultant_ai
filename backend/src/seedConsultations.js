const mongoose = require("mongoose");
const Consultation = require("./models/Consultation");
require("dotenv").config();

// Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// Sample Astrology Data
const consultations = [
  {
    clientName: "Amit Sharma",
    transcript: `
Client Concern: Marriage delay for 3 years.

Planetary Analysis:
Saturn in 7th house causing delay in marriage prospects.
Venus weak in natal chart.

Remedies:
- Hanuman Chalisa daily
- Friday fasting
- Worship Goddess Lakshmi

Follow-up: 45 days review.
    `,
    summary: "Marriage delay due to Saturn influence and weak Venus. Remedies suggested.",
    insights: {
      problem: "Marriage delay",
      cause: "Saturn in 7th house, weak Venus",
      remedies: ["Hanuman Chalisa", "Friday fasting", "Lakshmi worship"]
    }
  },

  {
    clientName: "Neha Verma",
    transcript: `
Client Concern: Career instability and job switching.

Planetary Analysis:
Weak Jupiter affecting career growth.
Rahu influence causing confusion.

Remedies:
- Offer water to Sun every morning
- Wear yellow on Thursdays

Follow-up: 30 days.
    `,
    summary: "Career instability due to weak Jupiter and Rahu influence.",
    insights: {
      problem: "Career instability",
      cause: "Weak Jupiter, Rahu influence",
      remedies: ["Sun water offering", "Yellow clothing Thursday"]
    }
  },

  {
    clientName: "Rohit Kumar",
    transcript: `
Client Concern: Financial losses in business.

Planetary Analysis:
Rahu in 2nd house causing unstable finances.
Mercury weak affecting business decisions.

Remedies:
- Chant Ganesh mantra
- Keep green plant at workspace

Follow-up: 60 days.
    `,
    summary: "Financial instability due to Rahu and weak Mercury.",
    insights: {
      problem: "Financial losses",
      cause: "Rahu in 2nd house",
      remedies: ["Ganesh mantra", "Green plant"]
    }
  },

  {
    clientName: "Pooja Singh",
    transcript: `
Client Concern: Health anxiety and stress issues.

Planetary Analysis:
Moon afflicted causing emotional imbalance.

Remedies:
- Meditation daily
- Visit Shiva temple on Mondays

Follow-up: 30 days.
    `,
    summary: "Stress and anxiety due to Moon affliction.",
    insights: {
      problem: "Health anxiety",
      cause: "Moon affliction",
      remedies: ["Meditation", "Shiva worship"]
    }
  },

  {
    clientName: "Rahul Mehta",
    transcript: `
Client Concern: Delayed foreign travel opportunity.

Planetary Analysis:
Saturn delaying foreign settlement.
Mars causing delays in documentation.

Remedies:
- Recite Hanuman Chalisa
- Donate food on Saturdays

Follow-up: 90 days.
    `,
    summary: "Foreign travel delay due to Saturn and Mars influence.",
    insights: {
      problem: "Foreign travel delay",
      cause: "Saturn + Mars influence",
      remedies: ["Hanuman Chalisa", "Saturday donation"]
    }
  }
];

// Seed function
const seedDB = async () => {
  try {
    await Consultation.deleteMany(); // clean old data

    await Consultation.insertMany(consultations);

    console.log("🎉 Database Seeded Successfully");

    mongoose.connection.close();
  } catch (err) {
    console.log("❌ Seed Error:", err);
  }
};

seedDB();