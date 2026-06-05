import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/axios";
import Sidebar from "../components/sidebar";

const Summary = () => {
  const { documentId } = useParams();

  const [summary, setSummary] = useState("");
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateSummary();
    fetchSummaries();
  }, []);

  const generateSummary = async () => {
    try {
      setLoading(true);

      const response = await API.post(
        "/summary/generate",
        {
          document_id: Number(documentId),
          summary_length: "medium",
        }
      );

      setSummary(response.data.content);

      fetchSummaries();

    } catch (err) {
      console.log("Summary Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummaries = async () => {
    try {
      const response = await API.get("/summary/");

      if (Array.isArray(response.data)) {
        setSummaries(response.data);
      } else {
        setSummaries([]);
      }

    } catch (err) {
      console.log("Fetch Summaries Error:", err);
      setSummaries([]);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F8FF]">

    {/* SIDEBAR */}
    <Sidebar />

    {/* MAIN CONTENT */}
    <div className="flex-1 overflow-auto p-8">
      <div className="mb-8">

        <h1 className="text-4xl font-bold text-gray-900">
          AI Summaries
        </h1>

        <p className="text-gray-500 mt-2">
          Generate and manage AI-powered summaries
        </p>

      </div>

      {/* CURRENT SUMMARY */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 mb-8">

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-2xl font-bold text-gray-900">
            Latest Summary
          </h2>

          <button
            onClick={generateSummary}
            className="
            bg-violet-600
            hover:bg-violet-700
            text-white
            px-5
            py-2
            rounded-xl
            "
          >
            Regenerate
          </button>

        </div>

        {loading ? (

          <div className="space-y-3">

            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>

          </div>

        ) : (

          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {summary || "No summary generated yet"}
          </div>

        )}

      </div>

      {/* OLD SUMMARIES */}
      <div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Previous Summaries
        </h2>

        {summaries.length === 0 ? (

          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500">
            No summaries found
          </div>

        ) : (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {summaries.map((item) => (

              <div
                key={item.id}
                className="
                bg-white
                border
                border-gray-200
                rounded-2xl
                p-5
                shadow-sm
                hover:shadow-md
                transition
                "
              >

                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  {item.title}
                </h3>

                <p className="text-gray-600 text-sm line-clamp-6">
                  {item.content}
                </p>

                <div className="mt-4 text-xs text-gray-400">
                  {item.created_at
                    ? new Date(
                        item.created_at
                      ).toLocaleDateString()
                    : "No Date"}
                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>.
    </div>
  );
};

export default Summary;