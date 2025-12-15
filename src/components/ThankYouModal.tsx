import { useEffect, useCallback } from "react";

interface ThankYouModalProps {
  open: boolean;
  onClose: () => void;
  message?: string;
}

export default function ThankYouModal({
  open,
  onClose,
  message = "Thank you for your message! I’ll reply as soon as possible.",
}: ThankYouModalProps) {
  // Automatically close after 3 seconds
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [open, onClose]);

  // 🔹  Close on ESC key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    },
    [open, onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
      onClick={onClose} // 🔹 click background to close
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl p-8 text-center max-w-sm mx-4 animate-fadeScaleIn"
        onClick={(e) => e.stopPropagation()} // stop closing if inner box clicked
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          🎉 Message Sent!
        </h2>
        <p className="text-gray-700 dark:text-gray-300">{message}</p>
      </div>
    </div>
  );
}