import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface ProgressTrackerProps {
  topics: { name: string; progress: number }[];
}

export default function ProgressTracker({ topics }: ProgressTrackerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div
      ref={ref}
      className="bg-gray-50 dark:bg-gray-800 p-6 rounded shadow space-y-4"
    >
      <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
        Progress Tracker
      </h2>

      {topics.map((t) => (
        <div key={t.name} className="space-y-1">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-gray-700 dark:text-gray-300">{t.name}</span>
            <span className="text-gray-700 dark:text-gray-300">
              {t.progress}%
            </span>
          </div>

          <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
            <motion.div
              className="h-3 rounded bg-gradient-to-r from-indigo-500 to-indigo-400 dark:from-indigo-400 dark:to-indigo-300"
              initial={{ width: 0 }}
              animate={{ width: isInView ? `${t.progress}%` : 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}