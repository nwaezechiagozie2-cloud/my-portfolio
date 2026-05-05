import { useState, useEffect } from "react";
import { MessageSquare, X, Send } from "lucide-react";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    fetch("/app/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.chat_enabled) {
          setEnabled(true);
        }
      })
      .catch(() => {});
  }, []);

  if (!enabled) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-80 h-[500px] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <h3 className="font-bold">AI Assistant</h3>
            <button onClick={() => setOpen(false)} aria-label="Close Chat">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-sm bg-gray-50 dark:bg-gray-900/50">
            <div className="bg-blue-100 dark:bg-blue-900 w-fit sm:max-w-[80%] rounded-2xl rounded-tl-sm p-3 shadow-sm">
              <p>Hi there! I'm the AI assistant for this portfolio. How can I help you?</p>
            </div>
          </div>
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <form className="relative" onSubmit={e => e.preventDefault()}>
              <input
                disabled
                type="text"
                placeholder="Chat unavailable (Placeholder)"
                className="w-full bg-gray-100 dark:bg-gray-700 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none"
              />
              <button disabled className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition shrink-0"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
