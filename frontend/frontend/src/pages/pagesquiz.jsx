import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import Sidebar from "../components/sidebar";

import {
  Brain,
  Trophy,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft
} from "lucide-react";

export default function Quiz() {

  const { documentId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [quiz, setQuiz] = useState([]);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [selectedAnswerIndex, setSelectedAnswerIndex] =
    useState(null);

  const [score, setScore] = useState(0);

  const [finished, setFinished] =
    useState(false);

  const token =
    localStorage.getItem("token");

  useEffect(() => {
    loadQuiz();
  }, []);

  const loadQuiz = async () => {

    try {
      setError(null);
      const response =
        await axios.post(
          `http://localhost:8000/api/quizzes/${documentId}`,
          {
            num_questions: 10,
            difficulty: "medium"
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      if (!response.data.quiz || response.data.quiz.length === 0) {
        setError("Failed to generate quiz questions. Please try again.");
        setQuiz([]);
      } else {
        setQuiz(response.data.quiz);
      }

    } catch (error) {
      console.error(error);
      setError("Error loading quiz: " + (error.response?.data?.detail || error.message));
      setQuiz([]);

    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = () => {

    const question =
      quiz[currentQuestion];

    if (selectedAnswerIndex === question.correct_answer) {
      setScore(score + 1);
    }

    setSelectedAnswerIndex(null);

    if (
      currentQuestion ===
      quiz.length - 1
    ) {
      setFinished(true);

    } else {

      setCurrentQuestion(
        currentQuestion + 1
      );
    }
  };

  if (loading) {

    return (
      <div className="
      h-screen
      flex
      justify-center
      items-center
      bg-[#F8F8FF]
      ">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Generating AI Quiz...</p>
        </div>
      </div>
    );
  }

  if (error || quiz.length === 0) {
    return (
      <div className="flex min-h-screen bg-[#F8F8FF]">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-xl bg-white rounded-3xl shadow-sm p-10 text-center">
            <AlertCircle size={80} className="text-red-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Unable to Generate Quiz
            </h1>
            <p className="text-gray-600 mb-8">
              {error || "Failed to generate quiz questions. Please try again."}
            </p>
            <button
              onClick={loadQuiz}
              className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-2xl"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8F8FF]">

      <Sidebar />

      <main className="flex-1 p-8">

        {finished ? (

          <div className="
          max-w-xl
          mx-auto
          bg-white
          rounded-3xl
          shadow-sm
          p-10
          text-center
          ">

            <Trophy
              size={80}
              className="
              text-yellow-500
              mx-auto
              mb-4
              "
            />

            <h1 className="
            text-4xl
            font-bold
            ">
              Quiz Complete
            </h1>

            <p className="
            text-xl
            mt-4
            ">
              Score:
              {" "}
              {score}
              /
              {quiz.length}
            </p>

            <p className="text-lg text-gray-600 mt-6">
              {((score / quiz.length) * 100).toFixed(0)}% Correct
            </p>

            <button
              onClick={() => navigate("/quiz-select")}
              className="mt-8 bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-2xl"
            >
              Back to Document Selection
            </button>

          </div>

        ) : (

          <div className="max-w-4xl mx-auto">

            <div className="
            flex
            items-center
            gap-3
            mb-8
            ">

              <Brain
                className="
                text-violet-600
                "
              />

              <h1 className="
              text-4xl
              font-bold
              ">
                AI Quiz
              </h1>

            </div>

            <div className="
            bg-white
            rounded-3xl
            shadow-sm
            p-8
            ">

              <div className="
              mb-6
              text-sm
              text-gray-500
              ">
                Question
                {" "}
                {currentQuestion + 1}
                {" "}
                of
                {" "}
                {quiz.length}
              </div>

              <h2 className="
              text-2xl
              font-bold
              mb-8
              ">
                {
                  quiz[currentQuestion]
                    ?.question
                }
              </h2>

              <div className="
              grid
              gap-4
              ">

                {quiz[
                  currentQuestion
                ]?.options?.map(
                  (option, index) => (

                  <button
                    key={index}
                    onClick={() =>
                      setSelectedAnswerIndex(index)
                    }
                    className={`
                    p-4
                    rounded-2xl
                    border
                    text-left
                    transition

                    ${
                      selectedAnswerIndex === index
                      ? "bg-violet-100 border-violet-500"
                      : "bg-white border-gray-200 hover:border-gray-300"
                    }
                    `}
                  >
                    {option}
                  </button>

                ))}
              </div>

              <button
                disabled={selectedAnswerIndex === null}
                onClick={handleAnswer}
                className="
                mt-8
                bg-violet-600
                hover:bg-violet-700
                disabled:bg-gray-400
                text-white
                px-8
                py-3
                rounded-2xl
                transition
                "
              >
                Next Question
              </button>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}