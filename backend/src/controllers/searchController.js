const Consultation = require("../models/Consultation");

const {
  generateEmbedding
} = require("../services/embedding.service");

const cosineSimilarity = (
  vecA,
  vecB
) => {

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {

    dot += vecA[i] * vecB[i];

    normA += vecA[i] * vecA[i];

    normB += vecB[i] * vecB[i];

  }

  return (
    dot /
    (Math.sqrt(normA) *
      Math.sqrt(normB))
  );
};

exports.semanticSearch = async (
  req,
  res
) => {

  try {

    const { query } = req.body;

    const queryEmbedding =
      await generateEmbedding(query);

    const consultations =
      await Consultation.find({
        user: req.user.id
      });

    const scoredResults =
      consultations.map((consultation) => {

        const score =
          cosineSimilarity(
            queryEmbedding,
            consultation.embedding
          );

        return {
          score,
          consultation
        };

      });

    scoredResults.sort(
      (a, b) => b.score - a.score
    );

    res.status(200).json({
      success: true,
      results: scoredResults.slice(
        0,
        5
      )
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};