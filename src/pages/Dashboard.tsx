import React, { useEffect, useState, useRef } from "react";
import emailjs from "@emailjs/browser";
// import ProgressTracker from "@/components/ProgressTracker";

interface Topic {
  name: string;
  progress: number;
}

export default function Dashboard() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const form = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  // 🔹 Fetch progress data
  // useEffect(() => {
  //   fetch("/src/data/progress.json")
  //     .then((res) => res.json())
  //     .then(setTopics)
  //     .catch((err) => console.error("Progress data error:", err));
  // }, []);

  const sendBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.current) return;

    setLoading(true);
    setStatus(null);

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setStatus("Lesson request sent successfully ✅");
      form.current.reset();
    } catch (err) {
      console.error("Booking error:", err);
      setStatus("Could not send request ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold text-center mb-4">Dashboard</h1>

      {/* 🔸 Progress Tracker */}
      {/*
      {topics.length > 0 ? (
        <ProgressTracker topics={topics} />
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Loading progress data…
        </p>
      )}
      */}

      {/* Booking Form */}
      <section id="booking" className="bg-gray-50 dark:bg-gray-800 p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Book a Lesson</h2>

        <form ref={form} onSubmit={sendBooking} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">Your Name</label>
            <input
              type="text"
              id="name"
              name="from_name"
              placeholder="ENter your name"
              required
              className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 font-medium">Email Address</label>
            <input
              type="email"
              id="email"
              name="from_email"
              placeholder="you@example.com"
              required
              className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Preferred Date & Time</label>
            <input
              type="text"
              name="preferred_time"
              placeholder="e.g. Tuesday 5 pm"
              className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900"
            />
          </div>

          <div>
            <label htmlFor="message" className="block mb-1 font-medium">Message / Topics</label>
            <textarea
              id="message"
              name="message"
              placeholder="Write your message here..."
              rows={5}
              required
              className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded font-semibold hover:bg-indigo-700 transition"
          >
            {loading ? "Sending..." : "Send Request"}
          </button>

          {status && <p className="text-center mt-3 font-medium">{status}</p>}
        </form>
      </section>
    </div>
  );
}