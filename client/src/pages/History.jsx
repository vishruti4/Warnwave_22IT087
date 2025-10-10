import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const History = () => {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    axios
      .get(`http://localhost:5000/api/history/${user.email.trim().toLowerCase()}`)
      .then((res) => setHistory(res.data))
      .catch((err) => console.error("Error fetching history:", err))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-lg text-gray-600 dark:text-gray-300 animate-pulse">
          Loading history...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-fit bg-gray-50 dark:bg-gray-900 py-10 px-5">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-all">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white tracking-wide">
          Gesture Detection History
        </h2>

        {history.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No gesture history yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-center border-collapse rounded-xl overflow-hidden">
              <thead className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
                <tr>
                  <th className="py-3 px-4 text-sm font-semibold">Sr.No</th>
                  <th className="py-3 px-4 text-sm font-semibold">Gesture</th>
                  <th className="py-3 px-4 text-sm font-semibold">Confidence</th>
                  <th className="py-3 px-4 text-sm font-semibold">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {history.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 text-gray-800 dark:text-gray-200 font-medium capitalize">
                      {item.gesture}
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full text-sm font-semibold">
                        {(item.confidence * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {item.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;