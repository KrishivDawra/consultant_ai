import { useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

const UploadConsultation = () => {
  const [file, setFile] = useState(null);
  const [clientName, setClientName] = useState("");
  const [result, setResult] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("file", file);
    formData.append("clientName", clientName);

    try {
      const res = await api.post(
        "/consultations/upload",
        formData
      );

      setResult(res.data.consultation);
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Upload Consultation
        </h1>

        <form onSubmit={handleUpload}>
          <input
            className="border w-full p-3 mb-3"
            placeholder="Client Name"
            value={clientName}
            onChange={(e) =>
              setClientName(e.target.value)
            }
          />

          <input
            type="file"
            className="mb-4"
            onChange={(e) =>
              setFile(e.target.files[0])
            }
          />

          <button className="bg-black text-white px-5 py-2 rounded">
            Upload
          </button>
        </form>

        {result && (
          <div className="mt-8 border p-4 rounded">
            <h2 className="font-bold text-xl">
              AI Results
            </h2>

            <p className="mt-3">
              <strong>Transcript:</strong>
            </p>
            <p>{result.transcript}</p>

            <p className="mt-3">
              <strong>Summary:</strong>
            </p>
            <p>{result.summary}</p>

            <p className="mt-3">
              <strong>Insights:</strong>
            </p>
            <pre className="bg-gray-100 p-3 rounded overflow-auto">
              {result.insights}
            </pre>
          </div>
        )}
      </div>
    </>
  );
};

export default UploadConsultation;