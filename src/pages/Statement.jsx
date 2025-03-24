import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchStatement } from "../api/player_bank";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { FaRegEye } from "react-icons/fa";

export default function StatementPage() {
  const { token } = useContext(AuthContext);
  const [statementData, setStatementData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (token) fetchStatementData();
  }, [token]);

  const fetchStatementData = async () => {
    try {
      const response = await fetchStatement(token);
      if (response.status === "success") {
        setStatementData(response.statements || []);
      } else {
        setError("No statement found.");
      }
    } catch (err) {
      console.error("Error fetching statement:", err);
      setError("Failed to fetch statement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
            <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
              
            </tr>
          </thead>
          <tbody>
            {statementData.length > 0 ? (
              statementData.map((statement, index) => (
                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                    <td className="px-6 py-4">{new Date(statement.created_at).toLocaleString()}</td>
                  <td className="px-6 py-4">{statement.amount}</td>
                  <td className="px-3 py-4">
                    <p className={`text-center p-1 rounded ${statement.type === "CR" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                      {statement.type}
                    </p>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center">
                  No statement history available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
