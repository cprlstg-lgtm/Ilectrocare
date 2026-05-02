import { Moon, Sun, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import ChatBox from "./components/ChatBox";
import UploadZone from "./components/UploadZone";

export default function App() {
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-600 text-white">
              <Zap size={22} />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold tracking-normal sm:text-2xl">
                Electrical Drawing Explainer
              </h1>
              <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                SLD, wiring diagram, schematic বাংলায় বুঝুন
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setDarkMode((value) => !value)}
            className="rounded-md border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            title={darkMode ? "Light mode" : "Dark mode"}
            aria-label={darkMode ? "Light mode" : "Dark mode"}
          >
            {darkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[420px_1fr] lg:px-8">
        <aside className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-3 text-lg font-bold">Upload Drawing</h2>
            <UploadZone file={file} setFile={setFile} error={uploadError} setError={setUploadError} />
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
            <p className="font-semibold">Safety note</p>
            <p>AI explanation learning এবং review-এর জন্য। Actual কাজের আগে licensed electrician দিয়ে verify করাবেন।</p>
          </div>
        </aside>

        <ChatBox file={file} />
      </div>
    </main>
  );
}
