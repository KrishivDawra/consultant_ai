const store = global.__VECTOR_STORE__ || (global.__VECTOR_STORE__ = []);

// -----------------------------
// ADD DOCUMENT
// -----------------------------
const addDocument = (embedding, metadata) => {
  store.push({
    embedding,
    metadata,
  });
};

// -----------------------------
// COSINE SIMILARITY (SAFE)
// -----------------------------
const cosineSimilarity = (a, b) => {
  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  const denominator = Math.sqrt(magA) * Math.sqrt(magB);

  if (denominator === 0) return 0;

  return dot / denominator;
};

// -----------------------------
// SEARCH (FINAL FIXED VERSION)
// -----------------------------
function search(queryEmbedding, topK = 3) {
  const results = store
    .map((item) => {
      const score = cosineSimilarity(queryEmbedding, item.embedding);

      return {
        ...item,
        score,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  // 🔥 DEBUG LOGS (IMPORTANT)
  console.log("🔎 RAG RAW SCORES:", results.map(r => r.score));
  console.log("🔎 RAG FINAL RESULTS:", results);

  return results;
}

// -----------------------------
// CLEAR STORE (DEBUG ONLY)
// -----------------------------
function clearStore() {
  store.length = 0;
}

// -----------------------------
// EXPORTS
// -----------------------------
module.exports = {
  addDocument,
  search,
  clearStore,
};