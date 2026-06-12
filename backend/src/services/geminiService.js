const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = "llama-3.1-8b-instant";

// Transcript (mock for now)
const generateTranscript = async (text) => text;

// Summary
const generateSummary = async (text) => {
  const res = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "user",
        content: `Summarize this consultation:\n\n${text}`,
      },
    ],
  });

  return res.choices[0].message.content;
};

// Insights
const generateInsights = async (text) => {
  const res = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "user",
        content: `
Extract:
1. Key Problems
2. Action Items
3. Recommendations
4. Follow-ups

Return JSON.

Text:
${text}
        `,
      },
    ],
  });

  return res.choices[0].message.content;
};

module.exports = {
  generateTranscript,
  generateSummary,
  generateInsights,
};