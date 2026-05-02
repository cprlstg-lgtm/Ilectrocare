const questions = [
  "সম্পূর্ণ ব্যাখ্যা করো",
  "Power flow দেখাও",
  "Symbol তালিকা দাও",
  "Safety check করো",
];

export default function QuickButtons({ onSelect, disabled }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
      {questions.map((question) => (
        <button
          key={question}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(question)}
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500"
        >
          {question}
        </button>
      ))}
    </div>
  );
}
