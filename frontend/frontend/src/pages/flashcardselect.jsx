import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/sidebar";
import { Brain, FileText, ChevronRight, Loader2 } from "lucide-react";

export default function FlashcardSelect() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8000/api/notes/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDocuments(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDocument = (docId) => {
    navigate(`/flashcards/${docId}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#F8F8FF]">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-violet-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading documents...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8F8FF]">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-10">
            <div className="bg-violet-100 p-4 rounded-3xl">
              <Brain className="text-violet-600" size={30} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Generate Flashcards
              </h1>
              <p className="text-gray-500 mt-2">
                Select a document to generate AI-powered flashcards
              </p>
            </div>
          </div>

          {/* Documents Grid */}
          {documents.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-sm p-12 text-center">
              <FileText size={60} className="mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No Documents Found
              </h2>
              <p className="text-gray-500 mb-6">
                Upload a PDF document first to generate flashcards
              </p>
              <button
                onClick={() => navigate("/notes")}
                className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-2xl"
              >
                Go to My Notes
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="bg-violet-100 p-3 rounded-xl">
                        <FileText className="text-violet-600" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {doc.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {doc.filename} • {(doc.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSelectDocument(doc.id)}
                      disabled={selecting[doc.id]}
                      className="bg-violet-600 hover:bg-violet-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-xl flex items-center gap-2 transition"
                    >
                      {selecting[doc.id] ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          Generate Flashcards
                          <ChevronRight size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
