import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/sidebar";

import {
  Brain,
  BookOpen,
  FileText,
  Sparkles,
  Clock,
  Search,
  Bell,
  Plus,
  MessageSquare,
  Settings,
  LogOut,
  LayoutDashboard,
  FolderOpen,
  ChevronRight,
} from "lucide-react";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}`;

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    recentNotes: [],
    recentChats: [],
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_BASE_URL}/api/dashboard/overview`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDashboardData(response.data);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  

  if (loading) {
    return (
      <div className="h-screen bg-[#F8F8FF] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
      </div>
    );
  }

 return (
  <div className="min-h-screen bg-[#F8F8FF] flex">
    <Sidebar />

    <main className="flex-1 p-6 overflow-y-auto">
      {/* Topbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome Back 👋
          </h1>

          <p className="text-gray-500 mt-1">
            Continue your AI-powered learning journey.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-2 w-[300px]">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              className="bg-transparent outline-none flex-1"
            />
          </div>

          <button className="bg-white border border-gray-200 w-12 h-12 rounded-xl flex items-center justify-center">
            <Bell className="w-5 h-5 text-gray-700" />
          </button>

          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500"></div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
       
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="bg-violet-100 w-fit p-3 rounded-xl mb-4">
            <FileText className="text-violet-600 w-6 h-6" />
          </div>

          <h3 className="text-3xl font-bold">
            {dashboardData.stats.notes || 0}
          </h3>

          <p className="text-gray-500 mt-1">Total Notes</p>
        </div>

        {/* Quiz */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="bg-pink-100 w-fit p-3 rounded-xl mb-4">
            <Sparkles className="text-pink-600 w-6 h-6" />
          </div>

          <h3 className="text-3xl font-bold">
            {dashboardData.stats.quizzes || 0}
          </h3>

          <p className="text-gray-500 mt-1">Generated Quizzes</p>
        </div>

        {/* Flashcards */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="bg-blue-100 w-fit p-3 rounded-xl mb-4">
            <Brain className="text-blue-600 w-6 h-6" />
          </div>

          <h3 className="text-3xl font-bold">
            {dashboardData.stats.flashcards || 0}
          </h3>

          <p className="text-gray-500 mt-1">Flashcards</p>
        </div>
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Notes */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold">Recent Notes</h2>
              <p className="text-gray-500 text-sm">
                Latest uploaded study material
              </p>
            </div>

            <button className="bg-violet-600 text-white px-4 py-2 rounded-xl flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Upload
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {dashboardData.recentNotes.map((note, index) => (
              <div
                key={index}
                className="border border-gray-100 rounded-xl p-4 hover:bg-violet-50"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-violet-100 p-3 rounded-xl">
                    <FileText className="w-5 h-5 text-violet-600" />
                  </div>

                  <div>
                    <h3 className="font-semibold">{note.title}</h3>
                    <p className="text-xs text-gray-500">
                      {note.created_at}
                    </p>
                  </div>
                </div>

                <button className="text-violet-600 text-sm font-medium">
                  View Note
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side */}
        <div className="space-y-6">
          {/* Activity */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-xl font-bold mb-5">
              Recent Activity
            </h2>

            <div className="space-y-4">
              {dashboardData.recentChats.map((chat, index) => (
                <div
                  key={index}
                  className="flex gap-3 pb-4 border-b border-gray-100 last:border-none"
                >
                  <div className="bg-violet-100 p-2 rounded-lg">
                    <MessageSquare className="w-4 h-4 text-violet-600" />
                  </div>

                  <div>
                    <h3 className="font-medium text-sm">
                      {chat.question}
                    </h3>

                    <p className="text-xs text-gray-500">
                      {chat.created_at}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-xl font-bold mb-5">
              Weekly Progress
            </h2>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Study Goal</span>
                  <span>75%</span>
                </div>

                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-2 w-[75%] bg-violet-600 rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span>Quiz Completion</span>
                  <span>62%</span>
                </div>

                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-2 w-[62%] bg-pink-500 rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span>AI Learning</span>
                  <span>88%</span>
                </div>

                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-2 w-[88%] bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-xl font-bold mb-4">
              Quick Actions
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <button className="bg-violet-100 p-4 rounded-xl font-medium">
                Upload Note
              </button>

              <button className="bg-pink-100 p-4 rounded-xl font-medium">
                Generate Quiz
              </button>

              <button className="bg-blue-100 p-4 rounded-xl font-medium">
                Flashcards
              </button>

              <button className="bg-green-100 p-4 rounded-xl font-medium">
                AI Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
);
}