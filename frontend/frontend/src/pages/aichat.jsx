import API from "../utils/axios";
import Sidebar from "../components/sidebar";
import { User, Bot, Send } from "lucide-react";
import { useState } from "react";

const AIChat = () => {

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello 👋 Ask me anything about your uploaded study materials."
    }
  ]);

  const sendMessage = async () => {

    if (!message.trim()) return;

    const currentMessage = message;

    setMessages(prev => [
      ...prev,
      {
        role: "user",
        content: currentMessage
      }
    ]);

    setMessage("");

    try {

      setLoading(true);

      const response = await API.post(
        "/chat/",
        {
          message: currentMessage
        }
      );

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content:
            response.data.answer
        }
      ]);

    } catch (error) {

      console.error(error);

      let errorMessage =
        "Something went wrong.";

      if (error.response?.status === 401) {
        errorMessage =
          "Please login again.";
      }

      if (error.response?.status === 404) {
        errorMessage =
          "No documents found.";
      }

      if (error.response?.status === 500) {
        errorMessage =
          "AI service error.";
      }

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: errorMessage
        }
      ]);

    } finally {

      setLoading(false);

    }
  };

  return (
  <div className="flex min-h-screen bg-[#F8F8FF]">

    {/* SIDEBAR */}
    <Sidebar />

    {/* MAIN */}
    <div className="flex-1 flex flex-col h-screen">

      {/* HEADER */}
      <div className="border-b border-gray-200 p-5 bg-white shadow-sm">

        <h1 className="text-3xl font-bold text-gray-900">
          AI PDF Chat
        </h1>

        <p className="text-gray-500 mt-1">
          Chat with your uploaded document
        </p>

      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-[#F8F8FF] to-white">

        {messages.map((msg, index) => (

          <div
            key={index}
            className={`flex ${
              msg.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >

            <div
              className={`max-w-3xl rounded-3xl px-5 py-4 flex gap-3 ${
                msg.role === "user"
                  ? "bg-violet-600 text-white shadow-lg"
                  : "bg-white text-gray-800 border border-gray-200 shadow-sm"
              }`}
            >

              <div className="mt-1">

                {msg.role === "user" ? (
                  <User size={20} />
                ) : (
                  <Bot size={20} />
                )}

              </div>

              <div className="leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                {msg.content}
              </div>

            </div>

          </div>

        ))}

        {/* LOADING */}
        {loading && (

          <div className="flex justify-start">

            <div className="bg-white border border-gray-200 px-5 py-4 rounded-3xl flex items-center gap-3 shadow-sm">

              <Bot
                size={20}
                className="text-violet-600"
              />

              <div className="flex gap-1">

                <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"></div>

                <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce delay-100"></div>

                <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce delay-200"></div>

              </div>

            </div>

          </div>

        )}

      </div>

      {/* INPUT */}
      <div className="p-5 border-t border-gray-200 bg-white">

        <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-3 shadow-sm">

          <textarea
            rows={1}
            placeholder="Ask something about the PDF..."
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            onKeyDown={(e) => {

              if (
                e.key === "Enter" &&
                !e.shiftKey
              ) {

                e.preventDefault();

                sendMessage();
              }

            }}
            className="
              flex-1
              bg-transparent
              outline-none
              resize-none
              text-gray-800
              placeholder:text-gray-400
            "
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="
              bg-violet-600
              hover:bg-violet-700
              text-white
              p-3
              rounded-xl
              transition
              shadow-md
              disabled:opacity-50
            "
          >

            <Send size={20} />

          </button>

        </div>

      </div>

    </div>

  </div>
);
};
export default AIChat;