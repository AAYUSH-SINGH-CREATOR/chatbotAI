import { useContext, useState, useRef } from "react";
import { AppContext } from "../Context/AppContext";
import { IoSendSharp } from "react-icons/io5";

// UI labels only — all calls use gemini-3.5-flash-lite internally
const MODEL_OPTIONS = [
  { label: "Nexora Flash",   value: "flash" },
  { label: "Nexora Standard", value: "standard" },
  { label: "Nexora Pro",     value: "pro" },
];

export default function Message() {
  const [question, setQuestion] = useState("");
  const { callGemini, dark, loading, model, setModel } = useContext(AppContext);
  const inputRef = useRef(null);

  function handleSend() {
    const trimmed = question.trim();
    if (!trimmed || loading) return;
    callGemini(trimmed);
    setQuestion("");
    inputRef.current?.focus();
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div
      className={`flex items-center gap-2 rounded-full w-full max-w-2xl px-4 py-2 shadow-lg border transition-colors ${
        dark
          ? "bg-zinc-800 border-white/10 shadow-black/30"
          : "bg-white border-gray-200 shadow-gray-200"
      }`}
    >
      {/* Model selector */}
      <select
        value={model}
        onChange={(e) => setModel(e.target.value)}
        className={`text-xs rounded-full px-2 py-1 outline-none border cursor-pointer transition-colors shrink-0 ${
          dark
            ? "bg-zinc-700 text-zinc-300 border-white/10 hover:bg-zinc-600"
            : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
        }`}
      >
        {MODEL_OPTIONS.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>

      {/* Text input */}
      <input
        ref={inputRef}
        type="text"
        placeholder="Ask Nexora anything…"
        className={`flex-1 bg-transparent outline-none text-sm placeholder:text-zinc-500 ${
          dark ? "text-white" : "text-gray-900"
        }`}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
        autoComplete="off"
      />

      {/* Send button */}
      <button
        onClick={handleSend}
        disabled={!question.trim() || loading}
        title="Send (Enter)"
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
          question.trim() && !loading
            ? "bg-violet-600 text-white hover:bg-violet-500 shadow-sm"
            : dark
            ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
      >
        <IoSendSharp size={15} />
      </button>
    </div>
  );
}
