import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  FileText,
  MessageSquare,
  Search,
  Sparkles,
  BookOpen,
  CheckCircle,
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: <MessageSquare className="w-7 h-7 text-violet-600" />,
      title: "AI Chat with Notes",
      desc: "Ask questions and get instant answers from your uploaded notes and PDFs.",
    },
    {
      icon: <Sparkles className="w-7 h-7 text-violet-600" />,
      title: "Smart Summaries",
      desc: "Generate concise summaries from long notes and study material.",
    },
    {
      icon: <BookOpen className="w-7 h-7 text-violet-600" />,
      title: "Quiz Generator",
      desc: "Automatically create quizzes, MCQs and practice questions.",
    },
    {
      icon: <Search className="w-7 h-7 text-violet-600" />,
      title: "Semantic Search",
      desc: "Find concepts using AI-powered semantic understanding.",
    },
  ];

  return (
    <div className="bg-[#F8F8FF] text-gray-900 min-h-screen overflow-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 lg:px-20 py-6">
        <div className="flex items-center gap-3">
          <div className="bg-violet-600 p-2 rounded-xl">
            <Brain className="text-white w-6 h-6" />
          </div>

          <h1 className="text-2xl font-bold">LEARN FLOW</h1>
        </div>

        <div className="hidden lg:flex items-center gap-10 text-gray-600 font-medium">
          <a href="#">Features</a>
          <a href="#">How it Works</a>
          <a href="#">Pricing</a>
          <a href="#">Docs</a>
        </div>

        <div className="flex items-center gap-4">
          <button className="hidden md:block text-gray-700 font-medium">
            <Link to="/login">Login</Link>
          </button>

          <button className="bg-violet-600 hover:bg-violet-700 transition-all text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2">
            <Link to="/signup">Get Started</Link>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-8 lg:px-20 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              AI-Powered Learning Platform
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Study Smarter.
              <br />
              Learn Faster.
              <br />
              <span className="text-violet-600">Powered by AI.</span>
            </h1>

            <p className="text-gray-600 text-lg mt-8 leading-relaxed max-w-xl">
              Upload notes, chat with PDFs, generate quizzes, flashcards,
              summaries and collaborate with AI in one modern learning
              workspace.
            </p>

            <div className="flex flex-wrap gap-5 mt-10">
              <button className="bg-violet-600 hover:bg-violet-700 transition-all text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 shadow-lg shadow-violet-200">

                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </button>

              <button className="border border-gray-300 hover:border-violet-400 transition-all bg-white px-8 py-4 rounded-2xl font-semibold">
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-10 mt-14">
              <div>
                <h3 className="text-3xl font-bold">10K+</h3>
                <p className="text-gray-500">Students</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold">50K+</h3>
                <p className="text-gray-500">Notes Uploaded</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold">1M+</h3>
                <p className="text-gray-500">AI Responses</p>
              </div>
            </div>
          </div>

          {/* Right Dashboard */}
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-72 h-72 bg-violet-300 rounded-full blur-3xl opacity-20"></div>

            <div className="relative bg-white border border-gray-200 rounded-[32px] p-6 shadow-2xl">
              {/* Top */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-bold text-xl">Dashboard</h2>

                <div className="w-10 h-10 rounded-full bg-violet-100"></div>
              </div>

              {/* Cards */}
              <div className="grid grid-cols-2 gap-5">
                <div className="bg-violet-50 p-5 rounded-2xl">
                  <FileText className="text-violet-600 w-8 h-8 mb-4" />
                  <h3 className="font-bold text-2xl">128</h3>
                  <p className="text-gray-500">Notes</p>
                </div>

                <div className="bg-blue-50 p-5 rounded-2xl">
                  <BookOpen className="text-blue-600 w-8 h-8 mb-4" />
                  <h3 className="font-bold text-2xl">32</h3>
                  <p className="text-gray-500">Quizzes</p>
                </div>

                <div className="bg-pink-50 p-5 rounded-2xl">
                  <Sparkles className="text-pink-600 w-8 h-8 mb-4" />
                  <h3 className="font-bold text-2xl">215</h3>
                  <p className="text-gray-500">Flashcards</p>
                </div>

                <div className="bg-green-50 p-5 rounded-2xl">
                  <Brain className="text-green-600 w-8 h-8 mb-4" />
                  <h3 className="font-bold text-2xl">48h</h3>
                  <p className="text-gray-500">Study Time</p>
                </div>
              </div>

              {/* AI Chat */}
              <div className="mt-8 bg-gray-50 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-5">
                  <div className="bg-violet-600 p-2 rounded-xl">
                    <Brain className="text-white w-5 h-5" />
                  </div>

                  <div>
                    <h4 className="font-semibold">AI Tutor</h4>
                    <p className="text-sm text-gray-500">
                      Ask anything from your notes
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 text-gray-700 border border-gray-100">
                  Explain polymorphism in OOP with examples...
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-8 lg:px-20 py-24">
        <div className="text-center mb-20">
          <div className="inline-flex bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            Features
          </div>

          <h2 className="text-5xl font-bold mb-6">
            Everything You Need To Learn Better
          </h2>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            AI-powered tools designed to help students understand concepts
            faster and study more effectively.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="bg-violet-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>

              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>

              <p className="text-gray-600 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="px-8 lg:px-20 py-24">
        <div className="text-center mb-20">
          <div className="inline-flex bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            How It Works
          </div>

          <h2 className="text-5xl font-bold mb-6">
            Learn in 3 Simple Steps
          </h2>

          <p className="text-gray-600 text-lg">
            Upload → AI Processing → Smart Learning
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {[
            "Upload Notes & PDFs",
            "AI Understands Your Content",
            "Chat, Quiz & Learn",
          ].map((step, index) => (
            <div
              key={index}
              className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm"
            >
              <div className="w-14 h-14 rounded-2xl bg-violet-600 text-white flex items-center justify-center text-xl font-bold mb-8">
                {index + 1}
              </div>

              <h3 className="text-3xl font-bold mb-5">{step}</h3>

              <p className="text-gray-600 leading-relaxed">
                Experience seamless AI-powered learning with intelligent note
                understanding and semantic processing.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 lg:px-20 py-20">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[40px] p-12 lg:p-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>

          <div className="grid lg:grid-cols-2 gap-12 items-center relative">
            <div>
              <div className="inline-flex bg-white/20 px-4 py-2 rounded-full text-sm font-medium mb-8">
                Ready To Start Learning Smarter?
              </div>

              <h2 className="text-5xl font-bold leading-tight mb-8">
                Join Thousands Of Students Using AI
              </h2>

              <p className="text-lg text-violet-100 mb-10 max-w-xl">
                Build better study habits, understand concepts faster and boost
                your productivity with AI-powered learning.
              </p>

              <button className="bg-white text-violet-700 hover:bg-gray-100 transition-all px-8 py-4 rounded-2xl font-bold flex items-center gap-3">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white rounded-3xl p-8 text-gray-900 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-violet-600 p-2 rounded-xl">
                  <Brain className="text-white w-5 h-5" />
                </div>

                <div>
                  <h4 className="font-bold">AI Tutor</h4>
                  <p className="text-gray-500 text-sm">Online</p>
                </div>
              </div>

              <div className="bg-gray-100 rounded-2xl p-5 mb-5">
                Explain recursion in simple words.
              </div>

              <div className="bg-violet-50 rounded-2xl p-5 text-gray-700 leading-relaxed">
                Recursion is when a function calls itself to solve smaller
                versions of the same problem until it reaches a base condition.
              </div>

              <div className="flex items-center gap-4 mt-6 text-green-600">
                <CheckCircle className="w-5 h-5" />
                AI response generated successfully
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 lg:px-20 py-10 border-t border-gray-200">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-violet-600 p-2 rounded-xl">
              <Brain className="text-white w-5 h-5" />
            </div>

            <h3 className="text-xl font-bold">LEARN FLOW</h3>
          </div>

          <div className="flex items-center gap-8 text-gray-600">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Docs</a>
            <a href="#">Support</a>
          </div>

          <p className="text-gray-500">
            © 2026 Learn Flow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}