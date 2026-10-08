import { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import { BsSun } from "react-icons/bs";
import { MdDarkMode } from "react-icons/md";
import { FiTrash2 } from "react-icons/fi";

// Inline SVG logo — no external image dependency
function NexoraLogo() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Nexora logo"
    >
      <defs>
        <linearGradient id="nexora-grad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <rect width="36" height="36" rx="10" fill="url(#nexora-grad)" />
      <text
        x="18"
        y="26"
        textAnchor="middle"
        fontFamily="'Segoe UI', sans-serif"
        fontWeight="700"
        fontSize="20"
        fill="white"
        letterSpacing="-0.5"
      >
        N
      </text>
    </svg>
  );
}

export default function Header() {
  const { dark, setDark, clearChat, res } = useContext(AppContext);

  return (
    <header
      className={`flex items-center justify-between px-5 py-3 border-b backdrop-blur-sm sticky top-0 z-50 ${
        dark
          ? "border-white/10 bg-zinc-900/80"
          : "border-gray-200 bg-white/80"
      }`}
    >
      {/* Brand */}
      <div className="flex items-center gap-3">
        <NexoraLogo />
        <span
          className={`text-xl font-bold tracking-tight ${
            dark ? "text-white" : "text-gray-900"
          }`}
        >
          Nexora
        </span>
        <span
          className={`hidden sm:inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
            dark
              ? "bg-violet-900/50 text-violet-300"
              : "bg-violet-100 text-violet-700"
          }`}
        >
          AI
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {res.length > 0 && (
          <button
            onClick={clearChat}
            title="Clear conversation"
            className={`p-2 rounded-full transition-colors ${
              dark
                ? "text-zinc-400 hover:text-red-400 hover:bg-red-400/10"
                : "text-gray-500 hover:text-red-500 hover:bg-red-50"
            }`}
          >
            <FiTrash2 size={18} />
          </button>
        )}

        <button
          onClick={() => setDark((d) => !d)}
          title={dark ? "Switch to light mode" : "Switch to dark mode"}
          className={`p-2 rounded-full transition-colors ${
            dark
              ? "text-zinc-300 hover:bg-white/10"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {dark ? <BsSun size={18} /> : <MdDarkMode size={18} />}
        </button>
      </div>
    </header>
  );
}