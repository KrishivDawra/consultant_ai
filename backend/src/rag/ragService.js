const Groq = require("groq-sdk");
const { getEmbedding } = require("./embedder");
const { addDocument, search } = require("./vectorStore");

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
    if (!question) {
      return "Invalid question";
    }

    const queryEmbedding = await getEmbedding(question);

    if (!queryEmbedding) {
      return "Embedding generation failed";
    }

    const results = search(queryEmbedding, 3);

    console.log("🔎 Retrieved Results:", results);

    if (!results || results.length === 0) {
      return "No relevant data found in memory";
    }

    const context = results
      .map((r) => r?.metadata?.text)
      .filter(Boolean)
      .join("\n\n");

    if (!context) {
      return "No relevant data found in memory";
    }

    console.log("📦 Context Sent to LLM:", context);

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are a strict RAG assistant.

RULES:
- Use ONLY the provided context
- If context is empty, say "No relevant data found in memory"
- Do NOT use outside knowledge
- Do NOT hallucinate or guess
          `,
        },
        {
          role: "user",
          content: `
Context:
${context}

Question:
${question}
          `,
        },
      ],
    });

    const answer = response.choices[0].message.content;

    console.log("🧠 Final Answer:", answer);

    return answer;
  } catch (err) {
    console.error("❌ RAG Error:", err.message);
    return "RAG processing failed";
  }
};

module.exports = {
  storeConsultationEmbedding,
  askRag,
};