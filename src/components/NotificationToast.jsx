export default function NotificationToast({ type, message, onClose }) {
  const isSuccess = type === 'success';
  
  return (
    <div className="fixed top-4 right-4 z-9999 animate-slide-in">
      <div
        className={`flex items-center gap-3 rounded-2xl border px-6 py-4 shadow-2xl ${
          isSuccess
            ? 'border-green-500/50 bg-green-500/40 text-green-200'
            : 'border-red-500/50 bg-red-500/40 text-red-200'
        }`}
      >
        <div className="shrink-0">
          {isSuccess ? (
            <svg
              className="h-6 w-6 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </div>
        <p className="font-poppins text-sm font-semibold">{message}</p>
        <button
          onClick={onClose}
          className="ml-2 shrink-0 text-white/60 hover:text-white transition"
          aria-label="Close notification"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}