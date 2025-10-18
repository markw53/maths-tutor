import React, { useEffect } from "react";

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
  // Auto‑close after 3 seconds
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl p-8 text-center max-w-sm mx-4 animate-fadeScaleIn">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          🎉 Message Sent!
        </h2>
        <p className="text-gray-700 dark:text-gray-300">{message}</p>
      </div>

      {/* --- Animations --- */}
      <style jsx>{`
        @keyframes fadeScaleIn {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeScaleIn {
          animation: fadeScaleIn 0.35s ease-out forwards;
        }
      `}</style>
    </div>
  );
}