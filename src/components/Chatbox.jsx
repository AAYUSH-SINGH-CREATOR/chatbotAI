import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../Context/AppContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FiAlertCircle, FiCopy, FiCheck } from "react-icons/fi";

// ── Copy button with transient "Copied!" feedback ──────────────────────────
function CopyButton({ text, dark }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      onClick={handleCopy}
      title={copied ? "Copied!" : "Copy"}
      className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all duration-200 select-none ${
        copied
          ? dark
            ? "text-green-400 bg-green-400/10"
            : "text-green-600 bg-green-50"
          : dark
          ? "text-zinc-500 hover:text-zinc-300 hover:bg-white/8"
          : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
      }`}
    >
      {copied ? (
        <>
          <FiCheck size={12} />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <FiCopy size={12} />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

// ── Nexora avatar ───────────────────────────────────────────────────────────
function NexoraAvatar({ dark }) {
  return (
    <div
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold select-none ${
        dark ? "bg-violet-700 text-white" : "bg-violet-100 text-violet-700"
      }`}
    >
      N
    </div>
  );
}

// ── Welcome / empty-state screen ────────────────────────────────────────────
function WelcomeScreen({ dark }) {
  const suggestions = [
    "Explain quantum computing simply",
    "Write a poem about the ocean",
    "Debug this React code for me",
    "Summarize the history of AI",
  ];

  const { callGemini, setPrompt } = useContext(AppContext);

  function handleSuggestion(text) {
    setPrompt(text);
    callGemini(text);
  }

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-8 px-4 text-center">
      <div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-br from-violet-400 to-indigo-500 bg-clip-text text-transparent">
          Hello, I'm Nexora
        </h1>
        <p className={`text-base ${dark ? "text-zinc-400" : "text-gray-500"}`}>
          Your intelligent AI assistant. Ask me anything.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
        {suggestions.map((p) => (
          <button
            key={p}
            onClick={() => handleSuggestion(p)}
            className={`text-left text-sm px-4 py-3 rounded-2xl border transition-all duration-200 ${
              dark
                ? "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:border-violet-500/40"
                : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-violet-50 hover:border-violet-300"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Prose classes for markdown ───────────────────────────────────────────────
const proseBase =
  "prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-li:my-0.5 " +
  "prose-code:px-1 prose-code:rounded prose-code:text-sm ";
const proseDark  = "prose-invert prose-code:bg-zinc-700 prose-pre:bg-zinc-800 ";
const proseLight = "prose-code:bg-gray-100 prose-pre:bg-gray-100 ";

// ── Main Chatbox ─────────────────────────────────────────────────────────────
export default function Chatbox() {
  const { res, dark, loading } = useContext(AppContext);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [res, loading]);

  return (
    <div className="flex flex-col w-full h-full">
      {res.length === 0 && !loading ? (
        <WelcomeScreen dark={dark} />
      ) : (
        <div className="flex flex-col gap-6 pb-6">
          {res.map((message, index) =>
            message.role === "user" ? (

              /* ── User bubble ── */
              <div key={index} className="flex flex-col items-end gap-1">
                <div
                  className={`max-w-[80%] sm:max-w-[70%] rounded-3xl px-5 py-3 text-sm leading-6 shadow-sm ${
                    dark ? "bg-zinc-700 text-white" : "bg-gray-200 text-gray-900"
                  }`}
                >
                  {message.text}
                </div>
                {/* Copy button below user message */}
                <div className="px-2">
                  <CopyButton text={message.text} dark={dark} />
                </div>
              </div>

            ) : (

              /* ── AI response ── */
              <div key={index} className="flex flex-col gap-1">
                <div className="flex items-start gap-3">
                  <NexoraAvatar dark={dark} />

                  {message.isError ? (
                    <div
                      className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-sm ${
                        dark
                          ? "bg-red-900/30 text-red-300 border border-red-800/40"
                          : "bg-red-50 text-red-600 border border-red-200"
                      }`}
                    >
                      <FiAlertCircle size={15} className="shrink-0" />
                      {message.text}
                    </div>
                  ) : (
                    <div
                      className={`min-w-0 flex-1 rounded-3xl px-5 py-3 text-sm leading-7 ${
                        dark
                          ? "bg-white/5 text-zinc-100"
                          : "bg-white text-gray-900 shadow-sm border border-gray-100"
                      } ${proseBase} ${dark ? proseDark : proseLight}`}
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.text}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>

                {/* Copy button below AI response (indented to align with bubble) */}
                {!message.isError && (
                  <div className="pl-11">
                    <CopyButton text={message.text} dark={dark} />
                  </div>
                )}
              </div>

            )
          )}

          {/* Loading dots */}
          {loading && (
            <div className="flex items-start gap-3">
              <NexoraAvatar dark={dark} />
              <div
                className={`rounded-3xl px-5 py-4 ${
                  dark
                    ? "bg-white/5"
                    : "bg-white shadow-sm border border-gray-100"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      style={{ animationDelay: `${delay}ms` }}
                      className={`h-2 w-2 rounded-full animate-bounce ${
                        dark ? "bg-violet-400" : "bg-violet-500"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={endRef} />
        </div>
      )}
    </div>
  );
}