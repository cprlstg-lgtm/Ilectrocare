import { Loader2, Send, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import QuickButtons from "./QuickButtons";

export default function ChatBox({ file }) {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function askAI(questionText = question) {
    const trimmed = questionText.trim();
    if (!trimmed || loading) return;

    if (!file) {
      setError("আগে একটি drawing upload করুন।");
      return;
    }

    setError("");
    setQuestion("");

    const userMessage = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("question", trimmed);
      formData.append("history", JSON.stringify(messages.slice(-10)));

      const response = await fetch(`${import.meta.env.VITE_API_URL?.trim() || ""}/api/analyze`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "AI response failed.");
      }

      setMessages([...nextMessages, { role: "assistant", content: data.reply }]);
    } catch (requestError) {
      setError(requestError.message || "কিছু একটা সমস্যা হয়েছে।");
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      askAI();
    }
  }

  return (
    <section className="flex min-h-[580px] flex-col rounded-lg border border-slate-200 bg-slate-50 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">AI Explanation Chat</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            প্রশ্ন করুন বাংলায় অথবা English-এ
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setMessages([]);
            setError("");
          }}
          className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800"
          title="Clear chat"
          aria-label="Clear chat"
        >
          <Trash2 size={19} />
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full min-h-[260px] items-center justify-center text-center">
            <div className="max-w-sm">
              <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
                Drawing upload করে quick question চাপুন
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                AI drawing দেখে symbol, power flow, protection, wiring connection ব্যাখ্যা করবে।
              </p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => <MessageBubble key={`${message.role}-${index}`} message={message} />)
        )}

        {loading ? (
          <div className="flex justify-start">
            <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              <Loader2 className="animate-spin text-blue-600" size={18} />
              AI drawing analyze করছে...
            </div>
          </div>
        ) : null}
        <div ref={scrollRef} />
      </div>

      <div className="space-y-3 border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <QuickButtons onSelect={askAI} disabled={loading || !file} />

        <div className="flex gap-2">
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            rows={2}
            placeholder="যেমন: এই SLD-তে main breaker থেকে load পর্যন্ত flow বুঝাও"
            className="min-h-[52px] flex-1 resize-none rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
          <button
            type="button"
            onClick={() => askAI()}
            disabled={loading || !question.trim()}
            className="inline-flex w-12 items-center justify-center rounded-md bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            title="Send"
            aria-label="Send"
          >
            {loading ? <Loader2 className="animate-spin" size={19} /> : <Send size={19} />}
          </button>
        </div>

        {error ? <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p> : null}
      </div>
    </section>
  );
}
