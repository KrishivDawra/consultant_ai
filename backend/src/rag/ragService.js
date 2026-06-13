const Groq = require("groq-sdk");
const { getEmbedding } = require("./embedder");
const { addDocument, search } = require("./vectorStore");
const Consultation = require("../models/Consultation");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ---------------------------
// STORE EMBEDDINGS
// ---------------------------
const storeConsultationEmbedding = async (consultation) => {
  try {
    const text = `
Client: ${consultation.clientName}
Transcript: ${consultation.transcript}
Summary: ${consultation.summary}
`.trim();

    const embedding = await getEmbedding(text);

    if (!embedding || !Array.isArray(embedding)) {
      console.log("❌ Invalid embedding generated");
      return;
    }

    addDocument(embedding, {
      id: consultation._id,
      text,
    });

    console.log("✅ Embedding stored successfully");
  } catch (err) {
    console.error("❌ Error storing embedding:", err.message);
  }
};

// ---------------------------
// RAG QUERY
// ---------------------------
const askRag = async (question) => {
  try {
    const consultations = await Consultation.find()
      .sort({ createdAt: -1 })
      .limit(10);

    if (!consultations.length) {
      return "No consultation data found";
    }

    const context = consultations
      .map(
        (c) => `
Client: ${c.clientName}

Transcript:
${c.transcript}

Summary:
${c.summary}
`
      )
      .join("\n\n");

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are Humara Pandit's AI assistant.

Answer ONLY from consultation history.

Focus on:
- Astrology consultations
- Kundli analysis
- Marriage issues
- Career guidance
- Planetary positions
- Remedies
- Follow ups
          `,
        },
        {
          role: "user",
          content: `
Consultation History:
${context}

Question:
${question}
          `,
        },
      ],
    });

    return response.choices[0].message.content;
  } catch (err) {
    console.error(err);
    return "Failed to answer question";
  }
};

module.exports = {
  storeConsultationEmbedding,
  askRag,
};