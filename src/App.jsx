import { useContext } from "react";
import Header from "./components/Header";
import Message from "./components/Message";
import { AppContext } from "./Context/AppContext";
import Chatbox from "./components/Chatbox";

export default function App() {
  const { dark } = useContext(AppContext);

  return (
    <div
      className={`w-screen h-screen flex flex-col overflow-hidden ${
        dark ? "nexora-background" : "bg-gray-50"
      }`}
    >
      <Header />

      {/* Scrollable chat area */}
      <main className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="w-full max-w-3xl mx-auto px-4 pt-6 pb-32 sm:px-6">
          <Chatbox />
        </div>
      </main>

      {/* Pinned input bar */}
      <div
        className={`sticky bottom-0 w-full px-4 pb-6 pt-3 flex justify-center ${
          dark
            ? "bg-gradient-to-t from-[#09090b] via-[#09090b]/90 to-transparent"
            : "bg-gradient-to-t from-gray-50 via-gray-50/90 to-transparent"
        }`}
      >
        <Message />
      </div>
    </div>
  );
}
