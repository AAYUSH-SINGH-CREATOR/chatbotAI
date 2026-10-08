import { createContext, useState, useRef } from "react";
import { GoogleGenAI } from "@google/genai";

export const AppContext = createContext();

export default function AppContextProvider({ children }) {
  const [prompt, setPrompt] = useState("");
  const [res, setRes] = useState([]);
  const [dark, setDark] = useState(true);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState("gemini-3.5-flash-lite");

  // The only model that works with the current API key — always used for actual calls
  const ACTIVE_MODEL = "gemini-3.5-flash-lite";

  // Multi-turn conversation history
  const historyRef = useRef([]);
  // Prevent duplicate in-flight requests (React StrictMode safe)
  const inFlightRef = useRef(false);

  async function callGemini(userPrompt) {
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    // Optimistically add user message
    setRes((prev) => [...prev, { role: "user", text: userPrompt }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

      // Build contents array from history + new message
      const contents = [
        ...historyRef.current,
        { role: "user", parts: [{ text: userPrompt }] },
      ];

      const response = await ai.models.generateContent({
        model: ACTIVE_MODEL,
        contents,
      });

      const modelText = response.text;

      // Persist both turns to history
      historyRef.current = [
        ...historyRef.current,
        { role: "user",  parts: [{ text: userPrompt }] },
        { role: "model", parts: [{ text: modelText }] },
      ];

      setRes((prev) => [...prev, { role: "model", text: modelText }]);
    } catch (error) {
      const status = error?.status ?? error?.message ?? "";
      const errMsg =
        String(status).includes("401") || String(status).includes("API key")
          ? "Invalid API key. Please check your .env configuration."
          : String(status).includes("404")
          ? `Model not found. Try a different model.`
          : "Something went wrong. Please try again.";

      setRes((prev) => [
        ...prev,
        { role: "model", text: errMsg, isError: true },
      ]);
    } finally {
      setLoading(false);
      inFlightRef.current = false;
    }
  }

  function clearChat() {
    setRes([]);
    setPrompt("");
    historyRef.current = [];
  }

  const value = {
    prompt,
    setPrompt,
    res,
    callGemini,
    dark,
    setDark,
    loading,
    model,
    setModel,
    clearChat,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}