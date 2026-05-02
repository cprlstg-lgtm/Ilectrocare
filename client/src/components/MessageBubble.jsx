import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

export default function MessageBubble({ message }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  async function copyMessage() {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`group relative max-w-[92%] rounded-lg px-4 py-3 text-sm leading-7 shadow-sm sm:max-w-[82%] ${
          isUser
            ? "bg-blue-600 text-white"
            : "border border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <>
            <button
              type="button"
              onClick={copyMessage}
              className="absolute right-2 top-2 rounded-md p-1.5 text-slate-500 opacity-0 transition hover:bg-slate-100 hover:text-slate-800 group-hover:opacity-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              title="Copy response"
              aria-label="Copy response"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
            <div className="markdown pr-5">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
