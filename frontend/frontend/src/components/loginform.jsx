import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../services/authservice";
import { useAuth } from "../services/authcontext";


const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = await loginUser(formData);

      login(data);

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };


  return (
  <div className="min-h-screen bg-gray-50 flex">

    {/* LEFT SIDE */}
    <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-violet-600 to-indigo-700 text-white p-12 flex-col justify-between">

      <div>
        <h1 className="text-5xl font-bold mb-4">
          LEARN FLOW
        </h1>

        <p className="text-xl text-violet-100">
          Your Smart Learning Companion
        </p>
      </div>

      <div>
        <h2 className="text-4xl font-bold leading-tight mb-6">
          Learn Smarter,
          <br />
          Not Harder.
        </h2>

        <p className="text-violet-100 text-lg">
          Generate Notes, Flashcards, Quizzes,
          AI Summaries and Chat with your PDFs.
        </p>
      </div>

      <div className="text-violet-200 text-sm">
        © 2026 Learn Flow. All rights reserved.
      </div>

    </div>

    {/* RIGHT SIDE */}
    <div className="flex-1 flex items-center justify-center p-8">

      <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-8 shadow-xl">

        <div className="mb-8 text-center">

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>

          <p className="text-gray-500">
            Login to continue your learning journey
          </p>

        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>

            <label className="text-sm text-gray-600 block mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="
              w-full
              border
              border-gray-300
              rounded-xl
              px-4
              py-3
              focus:outline-none
              focus:ring-2
              focus:ring-violet-500
              "
              required
            />

          </div>

          <div>

            <label className="text-sm text-gray-600 block mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="
              w-full
              border
              border-gray-300
              rounded-xl
              px-4
              py-3
              focus:outline-none
              focus:ring-2
              focus:ring-violet-500
              "
              required
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="
            w-full
            bg-violet-600
            hover:bg-violet-700
            text-white
            py-3
            rounded-xl
            font-semibold
            transition
            "
          >
            {loading ? "Please wait..." : "Sign In"}
          </button>

        </form>

        <p className="text-gray-500 text-sm text-center mt-6">

          Don't have an account?{" "}

          <Link
            to="/signup"
            className="text-violet-600 font-semibold hover:underline"
          >
            Create Account
          </Link>

        </p>

      </div>

    </div>

  </div>
);
};

export default LoginForm;