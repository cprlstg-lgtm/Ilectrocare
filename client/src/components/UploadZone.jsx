import { FileImage, FileText, UploadCloud, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";

const MAX_SIZE = 10 * 1024 * 1024;
const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

export default function UploadZone({ file, setFile, error, setError }) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const previewUrl = useMemo(() => {
    if (!file || !file.type.startsWith("image/")) return null;
    return URL.createObjectURL(file);
  }, [file]);

  function validateAndSet(selectedFile) {
    if (!selectedFile) return;

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("শুধু JPG, PNG, অথবা PDF upload করা যাবে।");
      return;
    }

    if (selectedFile.size > MAX_SIZE) {
      setError("File size 10MB বা তার কম হতে হবে।");
      return;
    }

    setError("");
    setFile(selectedFile);
  }

  function onDrop(event) {
    event.preventDefault();
    setDragActive(false);
    validateAndSet(event.dataTransfer.files?.[0]);
  }

  function clearFile(event) {
    event.stopPropagation();
    setFile(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <section className="space-y-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={`flex min-h-[210px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-center transition ${
          dragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40"
            : "border-slate-300 bg-white hover:border-blue-400 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-500"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
          className="hidden"
          onChange={(event) => validateAndSet(event.target.files?.[0])}
        />

        {file ? (
          <div className="w-full space-y-3">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Uploaded electrical drawing preview"
                className="mx-auto max-h-64 rounded-md border border-slate-200 object-contain dark:border-slate-700"
              />
            ) : (
              <div className="mx-auto flex h-40 w-full max-w-sm items-center justify-center rounded-md border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                <FileText className="text-blue-600" size={42} />
              </div>
            )}
            <div className="flex items-center justify-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              {file.type === "application/pdf" ? <FileText size={18} /> : <FileImage size={18} />}
              <span className="max-w-[240px] truncate">{file.name}</span>
              <span className="text-slate-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
            </div>
            <button
              type="button"
              onClick={clearFile}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <X size={15} />
              Remove
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <UploadCloud className="mx-auto text-blue-600" size={44} />
            <div>
              <p className="text-base font-semibold text-slate-800 dark:text-white">
                Drawing upload করুন
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Drag & drop অথবা click করে JPG, PNG, PDF দিন
              </p>
            </div>
            <p className="text-xs text-slate-400">Maximum file size: 10MB</p>
          </div>
        )}
      </button>

      {error ? <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p> : null}
    </section>
  );
}
