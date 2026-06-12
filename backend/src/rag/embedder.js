const { pipeline } = require("@xenova/transformers");

let extractor = null;

// -----------------------------
// LOAD MODEL ONCE
// -----------------------------
const loadModel = async () => {
  if (!extractor) {
    console.log("🧠 Loading local embedding model...");

    extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );

    console.log("✅ Local embedding model loaded");
  }

  return extractor;
};

// -----------------------------
// TEXT → VECTOR
// -----------------------------
const getEmbedding = async (text) => {
  try {
    if (!text) return null;

    const model = await loadModel();

    const output = await model(text, {
      pooling: "mean",
      normalize: true,
    });

    return Array.from(output.data);
  } catch (err) {
    console.log("❌ Embedding error:", err.message);
    return null;
  }
};

module.exports = { getEmbedding };