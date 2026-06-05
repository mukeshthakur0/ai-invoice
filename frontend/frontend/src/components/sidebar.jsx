import {
  Brain,
  MessageSquare,
  LayoutDashboard,
  FolderOpen,
  Sparkles,
  Search,
  Settings,
  LogOut,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Globe,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useState } from "react";

function Sidebar() {
const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem("token"); // token remove
  sessionStorage.clear(); // optional
  navigate("/login"); // login page par redirect
};
  const [collapsed, setCollapsed] = useState(false);

  const sidebarItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: FolderOpen,
      label: "My Notes",
      path: "/notes",
    },
    {
      icon: MessageSquare,
      label: "AI Chat",
      path: "/ai-chat",
    },
    {
      icon: Sparkles,
      label: "Quiz Generator",
      path: "/quiz-select",
    },
    {
      icon: Brain,
      label: "Flashcards",
      path: "/flashcard-select",
    },
   
    {
      icon: Globe,
      label: "Resources",
      path: "/resources",
    },
    {
  icon: Settings,
  label: "Summary",
  path: "/summary"
},
    {
      icon: LogOut,
      label: "Logout",
      action: handleLogout,
      path:"/logout"
    },
  ];

  return (

    <aside
      className={`h-screen sticky top-0 bg-white border-r border-gray-100 transition-all duration-300 hidden lg:flex flex-col ${
        collapsed ? "w-[90px]" : "w-[280px]"
      }`}
    >

      {/* HEADER */}
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">

        {/* LOGO */}
        <div className="flex items-center gap-3 overflow-hidden">

          <div className="bg-violet-600 p-3 rounded-2xl min-w-fit">

            <Brain className="text-white w-6 h-6" />

          </div>

          {!collapsed && (
            <div>

              <h2 className="text-2xl font-bold text-gray-800">
              LEARNFLOW
              </h2>

              <p className="text-sm text-gray-500">
                Learning Workspace
              </p>

            </div>
          )}

        </div>

        {/* COLLAPSE BUTTON */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="bg-violet-50 hover:bg-violet-100 p-2 rounded-xl transition"
        >

          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-violet-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-violet-600" />
          )}

        </button>

      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-3">

        {sidebarItems.map((item, index) => {

          const Icon = item.icon;

          return (

            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center ${
                  collapsed ? "justify-center" : "justify-between"
                } px-4 py-4 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200"
                    : "hover:bg-violet-50 text-gray-600"
                }`
              }
            >

              <div className="flex items-center gap-4">

                <div className="p-2 rounded-xl transition-all">

                  <Icon className="w-5 h-5" />

                </div>

                {!collapsed && (
                  <span className="font-semibold whitespace-nowrap">
                    {item.label}
                  </span>
                )}

              </div>

            </NavLink>

          );
        })}

      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t border-gray-100">

        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-4 text-white">

          {!collapsed ? (
            <>
              <h3 className="font-semibold text-lg">
                AI Learning
              </h3>

              <p className="text-sm text-violet-100 mt-1">
                Your smart study assistant
              </p>
            </>
          ) : (
            <div className="flex justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
          )}

        </div>

      </div>
      

    </aside>
  );
}

export default Sidebar;