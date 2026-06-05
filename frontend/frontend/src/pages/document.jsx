// src/pages/Documents.jsx
import {useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from  "../components/sidebar";
import {
  Upload,
  FileText,
  Trash2,
  Loader2,
  Download,
  Brain,
} from "lucide-react";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const token = localStorage.getItem("token");

  // =========================
  // FETCH DOCUMENTS
  // =========================
  const fetchDocuments = async () => {
    try {
      setFetchLoading(true);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/notes/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDocuments(response.data);

    } catch (error) {
      console.log(error.response?.data);

    } finally {
      setFetchLoading(false);
    }
  };
  const navigate = useNavigate();


  // =========================
  // UPLOAD DOCUMENT
  // =========================
  const handleUpload = async () => {

    if (!file) {
      alert("Please select a file");
      return;
    }

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("file", file);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/notes/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);

      setFile(null);

      fetchDocuments();

    } catch (error) {

      console.log(error.response?.data);

    } finally {

      setLoading(false);
    }
  };
  const openPDF = async (doc) => {
  try {
    const response = await axios.get(
      `http://localhost:8000/api/notes/open/${doc.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      }
    );

    const pdfBlob = new Blob(
      [response.data],
      { type: "application/pdf" }
    );

    const pdfUrl =
      URL.createObjectURL(pdfBlob);

    window.open(
      pdfUrl,
      "_blank"
    );

  } catch (error) {
    console.error(error);
    alert("Unable to open PDF");
  }
};

  // =========================
  // DELETE DOCUMENT
  // =========================
  const deleteDocument = async (id) => {

    try {

      await axios.delete(
        `http://localhost:8000/api/notes/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchDocuments();

    } catch (error) {

      console.log(error.response?.data);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

 return (
  <div className="flex min-h-screen bg-[#F8F8FF]">

    {/* SIDEBAR */}
    <Sidebar />

    {/* MAIN CONTENT */}
    <div className="flex-1 overflow-auto p-6 text-white">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-black">
          My Documents
        </h1>

        <p className="text-gray-500 mt-2">
          Upload and manage your PDF documents
        </p>
      </div>

      {/* UPLOAD BOX */}
      <div className="bg-[#1e293b] border border-slate-700 rounded-3xl p-6 mb-10">

        <div className="border-2 border-dashed border-slate-600 rounded-2xl p-10 text-center">

          <Upload
            size={50}
            className="mx-auto text-blue-400 mb-4"
          />

          <h2 className="text-2xl font-semibold mb-2">
            Upload PDF
          </h2>

          <p className="text-gray-400 mb-6">
            Upload your study material or notes
          </p>

          <input
            type="file"
            accept=".pdf"
            id="fileUpload"
            hidden
            onChange={(e) => setFile(e.target.files[0])}
          />

          <label
            htmlFor="fileUpload"
            className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl cursor-pointer transition"
          >
            Choose File
          </label>

          {file && (
            <div className="mt-5 bg-[#0f172a] p-4 rounded-xl inline-block">
              <p className="text-sm text-green-400">
                Selected:
              </p>

              <p className="font-medium">
                {file.name}
              </p>
            </div>
          )}

          <div className="mt-6">

            <button
              onClick={handleUpload}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl font-medium flex items-center gap-2 mx-auto"
            >

              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Upload Document
                </>
              )}

            </button>

          </div>

        </div>

      </div>

      {/* DOCUMENTS */}
      <div>

        <div className="flex items-center justify-between mb-5">

          <h2 className="text-2xl font-semibold text-black">
            Uploaded Documents
          </h2>

          <div className="bg-[#1e293b] px-4 py-2 rounded-xl">
            {documents.length} Files
          </div>

        </div>

        {fetchLoading ? (

          <div className="flex items-center gap-3 text-black">
            <Loader2 className="animate-spin" />
            Loading Documents...
          </div>

        ) : documents.length === 0 ? (

          <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-10 text-center">

            <FileText
              size={60}
              className="mx-auto text-gray-500 mb-4"
            />

            <h3 className="text-2xl font-semibold">
              No Documents Found
            </h3>

            <p className="text-gray-400 mt-2">
              Upload your first PDF document
            </p>

          </div>

        ) : (

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">

            {documents.map((doc) => (

              <div
                key={doc.id}
                className="bg-[#1e293b] border border-slate-700 rounded-2xl p-5 hover:border-blue-500 transition"
              >

                <div className="flex items-start justify-between">

                  <div>

                    <h3 className="text-lg font-semibold line-clamp-1">
                      {doc.title}
                    </h3>

                    <p className="text-gray-400 text-sm mt-1">
                      {doc.filename}
                    </p>

                  </div>

                  <FileText className="text-blue-400" />

                </div>

                <div className="mt-4">

                  <div className="text-sm text-gray-400">
                    Size
                  </div>

                  <div className="font-medium">
                    {(doc.size / 1024).toFixed(2)} KB
                  </div>

                </div>

               <div className="grid grid-cols-1 gap-3 mt-6">

  <button
    onClick={() => openPDF(doc)}
    className="
    bg-blue-600
    hover:bg-blue-700
    py-2
    rounded-xl
    "
  >
    Open PDF
  </button>

  <button
    onClick={() =>
      navigate(`/flashcards/${doc.id}`)
    }
    className="
    bg-violet-600
    hover:bg-violet-700
    py-2
    rounded-xl
    flex
    items-center
    justify-center
    gap-2
    "
  >
    <Brain size={18} />
    Generate Flashcards
  </button>
    <button
  onClick={() =>
    navigate(`/summary/${doc.id}`)
  }
  className="
  bg-emerald-600
  hover:bg-emerald-700
  py-2
  rounded-xl
  flex
  items-center
  justify-center
  gap-2
  "
>
  <Brain size={18} />
  Generate Summary
</button>
  <button
    onClick={() =>
      deleteDocument(doc.id)
    }
    className="
    bg-red-600
    hover:bg-red-700
    py-2
    rounded-xl
    flex
    items-center
    justify-center
    gap-2
    "
  >
    <Trash2 size={18} />
    Delete
  </button>

</div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  </div>
);
};

export default Documents;