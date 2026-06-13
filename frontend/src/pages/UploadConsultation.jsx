import { useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

const UploadConsultation = () => {
  const [file, setFile] = useState(null);
  const [clientName, setClientName] = useState("");
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      if (file) {
        formData.append("file", file);
      }

      formData.append("clientName", clientName);
      formData.append("transcript", transcript);

      const res = await api.post(
        "/consultations/upload",
        formData
      );

      setResult(res.data.consultation);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">
          Upload Astrology Consultation
        </h1>

        <form
          onSubmit={handleUpload}
          className="bg-white shadow rounded p-6"
        >
          <input
            type="text"
            placeholder="Client Name"
            className="border w-full p-3 mb-4 rounded"
            value={clientName}
            onChange={(e) =>
              setClientName(e.target.value)
            }
            required
          />

          <textarea
            rows={8}
            className="border w-full p-3 mb-4 rounded"
            placeholder="Enter consultation notes..."
            value={transcript}
            onChange={(e) =>
              setTranscript(e.target.value)
            }
            required
          />

          <input
            type="file"
            className="mb-4"
            onChange={(e) =>
              setFile(e.target.files[0])
            }
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-6 py-3 rounded"
          >
            {loading
              ? "Processing..."
              : "Upload Consultation"}
          </button>
        </form>

        {result && (
          <div className="mt-8 border rounded p-5">
            <h2 className="text-2xl font-bold mb-4">
              AI Analysis
            </h2>

            <div className="mb-4">
              <h3 className="font-semibold">
                Transcript
              </h3>
              <p>{result.transcript}</p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold">
                Summary
              </h3>
              <p>{result.summary}</p>
            </div>

            <div>
              <h3 className="font-semibold">
                Insights
              </h3>

              <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
                {typeof result.insights === "string"
                  ? result.insights
                  : JSON.stringify(
                      result.insights,
                      null,
                      2
                    )}
              </pre>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UploadConsultation;