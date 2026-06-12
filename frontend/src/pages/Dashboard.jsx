import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [consultations, setConsultations] = useState([]);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      const res = await api.get("/consultations");
      setConsultations(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">
          Consultations
        </h1>

        <div className="grid gap-4">
          {consultations.map((item) => (
            <div
              key={item._id}
              className="border rounded-lg p-4 shadow"
            >
              <h2 className="font-bold text-lg">
                {item.clientName}
              </h2>

              <p className="mt-2">
                {item.summary}
              </p>

              <p className="text-sm text-gray-500 mt-2">
                {new Date(
                  item.createdAt
                ).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;