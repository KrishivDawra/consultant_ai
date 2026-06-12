import { useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

const AskAI = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAsk = async () => {
    try {
      const res = await api.post("/rag/ask", {
        question,
      });

      setAnswer(res.data.answer);
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">
          Ask AI
        </h1>

        <textarea
          className="w-full border p-3 h-32"
          placeholder="Ask about previous consultations..."
          value={question}
          onChange={(e) =>
            setQuestion(e.target.value)
          }
        />

        <button
          onClick={handleAsk}
          className="bg-black text-white px-5 py-2 mt-4 rounded"
        >
          Ask
        </button>

        {answer && (
          <div className="mt-6 border p-4 rounded">
            <h2 className="font-bold mb-2">
              Answer
            </h2>

            <p>{answer}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default AskAI;