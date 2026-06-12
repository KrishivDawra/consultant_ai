const { getEmbedding } = require("./src/rag/embedder");

(async () => {
  const emb = await getEmbedding("backend issues in node js");
  console.log("EMBEDDING LENGTH:", emb.length);
})();