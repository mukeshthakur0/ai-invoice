import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import Sidebar from "../components/sidebar";

import {
  Brain,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  AlertCircle,
  Loader2
} from "lucide-react";

export default function Flashcards() {

  const { documentId } = useParams();
  const navigate = useNavigate();

  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadFlashcards();
  }, []);

  const loadFlashcards = async () => {

    try {
      setError(null);

      const existing = await axios.get(
        `http://localhost:8000/api/flashcards/${documentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (
        existing.data.flashcards &&
        existing.data.flashcards.length > 0
      ) {
        setFlashcards(
          existing.data.flashcards
        );

      } else {

        const generated =
          await axios.post(
            `${import.meta.env.VITE_API_URL}/api/flashcards/${documentId}`,
            {},
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );

        if (generated.data.flashcards && generated.data.flashcards.length > 0) {
          setFlashcards(
            generated.data.flashcards
          );
        } else {
          setError("Failed to generate flashcards. Please try again.");
        }
      }

    } catch (err) {
      console.error(err);
      setError("Error loading flashcards: " + (err.response?.data?.detail || err.message));

    } finally {
      setLoading(false);
    }
  };

  const nextCard = () => {

    if (
      currentIndex <
      flashcards.length - 1
    ) {

      setCurrentIndex(
        currentIndex + 1
      );

      setFlipped(false);
    }
  };

  const prevCard = () => {

    if (currentIndex > 0) {

      setCurrentIndex(
        currentIndex - 1
      );

      setFlipped(false);
    }
  };

  const card =
    flashcards[currentIndex];

  return (
    <div className="flex min-h-screen bg-[#F8F8FF]">

      <Sidebar />

      <main className="flex-1 p-8">

        <div className="max-w-5xl mx-auto">

          {/* Header */}

          <div className="flex items-center gap-4 mb-10">

            <div className="
              bg-violet-100
              p-4
              rounded-3xl
            ">
              <Brain
                className="
                text-violet-600
                "
                size={30}
              />
            </div>

            <div>

              <h1 className="
              text-4xl
              font-bold
              text-gray-900
              ">
                AI Flashcards
              </h1>

              <p className="text-gray-500">
                Study smarter with AI
              </p>

            </div>

          </div>

          {/* Loading */}

          {loading ? (

            <div className="
            bg-white
            rounded-3xl
            p-16
            text-center
            shadow-sm
            ">

              <Loader2 className="w-14 h-14 animate-spin text-violet-600 mx-auto mb-4" />

              <p className="
              mt-5
              text-gray-600
              ">
                Generating AI Flashcards...
              </p>

            </div>

          ) : error ? (

            <div className="bg-white rounded-3xl p-16 text-center shadow-sm">
              <AlertCircle size={60} className="mx-auto text-red-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Unable to Generate Flashcards
              </h2>
              <p className="text-gray-600 mb-8">{error}</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={loadFlashcards}
                  className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-2xl"
                >
                  Try Again
                </button>
                <button
                  onClick={() => navigate("/flashcard-select")}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-8 py-3 rounded-2xl"
                >
                  Back
                </button>
              </div>
            </div>

          ) : flashcards.length === 0 ? (

            <div className="
            bg-white
            rounded-3xl
            p-16
            text-center
            ">

              <Brain
                size={60}
                className="
                mx-auto
                text-violet-500
                "
              />

              <h2 className="
              text-2xl
              font-bold
              mt-4
              ">
                No Flashcards Found
              </h2>

              <p className="text-gray-600 mt-2">
                Unable to generate flashcards for this document
              </p>

              <button
                onClick={() => navigate("/flashcard-select")}
                className="mt-8 bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-2xl"
              >
                Back to Selection
              </button>

            </div>

          ) : (

            <>
              {/* Progress */}

              <div className="
              flex
              justify-between
              items-center
              mb-6
              ">

                <span className="
                text-gray-500
                ">
                  Card {currentIndex + 1}
                  /
                  {flashcards.length}
                </span>

                <button
                  onClick={() =>
                    setFlipped(false)
                  }
                  className="
                  flex
                  items-center
                  gap-2
                  bg-white
                  px-4
                  py-2
                  rounded-xl
                  shadow-sm
                  "
                >
                  <RotateCcw size={16} />
                  Reset
                </button>

              </div>

              {/* Flashcard */}

              <div
                onClick={() =>
                  setFlipped(
                    !flipped
                  )
                }
                className="
                cursor-pointer
                "
              >

                <div
                  className="
                  bg-white
                  rounded-[40px]
                  shadow-sm
                  min-h-[420px]
                  flex
                  items-center
                  justify-center
                  p-12
                  text-center
                  transition-all
                  "
                >

                  {!flipped ? (

                    <div>

                      <p className="
                      text-sm
                      uppercase
                      text-violet-600
                      mb-4
                      ">
                        Question
                      </p>

                      <h2 className="
                      text-3xl
                      font-bold
                      text-gray-900
                      ">
                        {card.question}
                      </h2>

                    </div>

                  ) : (

                    <div>

                      <p className="
                      text-sm
                      uppercase
                      text-green-600
                      mb-4
                      ">
                        Answer
                      </p>

                      <p className="
                      text-xl
                      text-gray-700
                      leading-relaxed
                      ">
                        {card.answer}
                      </p>

                    </div>

                  )}

                </div>

              </div>

              {/* Controls */}

              <div className="
              flex
              justify-center
              gap-4
              mt-8
              ">

                <button
                  onClick={prevCard}
                  disabled={
                    currentIndex === 0
                  }
                  className="
                  bg-white
                  px-6
                  py-3
                  rounded-2xl
                  shadow-sm
                  disabled:opacity-50
                  "
                >
                  <ChevronLeft />
                </button>

                <button
                  onClick={() =>
                    setFlipped(
                      !flipped
                    )
                  }
                  className="
                  bg-violet-600
                  text-white
                  px-10
                  py-3
                  rounded-2xl
                  "
                >
                  Flip Card
                </button>

                <button
                  onClick={nextCard}
                  disabled={
                    currentIndex ===
                    flashcards.length - 1
                  }
                  className="
                  bg-white
                  px-6
                  py-3
                  rounded-2xl
                  shadow-sm
                  disabled:opacity-50
                  "
                >
                  <ChevronRight />
                </button>

              </div>

              {/* Back Button */}
              <div className="text-center mt-10">
                <button
                  onClick={() => navigate("/flashcard-select")}
                  className="text-violet-600 hover:text-violet-700 font-semibold"
                >
                  ← Back to Documents
                </button>
              </div>

            </>
          )}

        </div>

      </main>

    </div>
  );
}