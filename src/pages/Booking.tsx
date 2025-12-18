import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

type BookingOption = {
  id: "60" | "90" | "intro";
  label: string;
  description: string;
  url: string;
};

export default function Booking() {
  const location = useLocation();

  const options: BookingOption[] = useMemo(
    () => [
      {
        id: "60",
        label: "60-minute tutoring session",
        description: "Standard 1:1 session (Maths or Computer Science).",
        url: "https://calendly.com/markworkman00/new-meeting",
      },
      {
        id: "90",
        label: "90-minute tutoring session",
        description: "Best for deeper topics, mock paper review, or intensive revision.",
        url: "https://calendly.com/markworkman00/90-min-tutoring",
      },
      {
        id: "intro",
        label: "15-minute intro call",
        description: "A quick chat to discuss goals and plan next steps.",
        url: "https://calendly.com/markworkman00/15-min-intro-call",
      },
    ],
    []
  );

  const [selectedId, setSelectedId] = useState<BookingOption["id"]>("60");

  // ✅ Preselect based on URL: /booking?type=60|90|intro
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get("type");
    if (type === "60" || type === "90" || type === "intro") {
      setSelectedId(type);
    }
  }, [location.search]);

  const selected = options.find((o) => o.id === selectedId) ?? options[0];

  // ✅ Load Calendly script once
  useEffect(() => {
    const existing = document.querySelector(
      'script[src="https://assets.calendly.com/assets/external/widget.js"]'
    );
    if (existing) return;

    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Book a Session
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Select a session type, then choose an available time from the calendar.
        </p>
      </header>

      {/* Selector */}
      <div className="max-w-3xl mx-auto bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
        <label
          htmlFor="duration"
          className="block font-semibold text-gray-900 dark:text-white mb-2"
        >
          Session type
        </label>

        <select
          id="duration"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value as BookingOption["id"])}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 dark:border-gray-700"
        >
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {selected.description}
        </p>
      </div>

      {/* Calendly embed */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <div
          key={selected.url}
          className="calendly-inline-widget"
          data-url={`${selected.url}?hide_gdpr_banner=1`}
          style={{ minWidth: "320px", height: "820px" }}
        />
      </div>
    </div>
  );
}