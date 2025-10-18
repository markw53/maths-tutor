import React, { useRef, useState } from "react";
import { tutor, testimonials } from "@/lib/mockData";
import { sendEmail } from "@/lib/email";
import ThankYouModal from "@/components/ThankYouModal";

function Home() {
  const form = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.current) return;
    setLoading(true);
    const ok = await sendEmail(form.current); // uses helper → shows toast feedback
    setLoading(false);
    if (ok) {
      setShowThankYou(true);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">

      {/* ✅ Hero Section */}
      <section className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Maths & Computer Science Tutoring 🚀
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          Helping students build confidence and excel in both Mathematics and Computer Science.
        </p>
        <a
          href="#contact"
          className="mt-6 inline-block px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
        >
          Contact Me
        </a>
      </section>

      {/* ✅ Tutor Section */}
      <section className="py-16 w-full max-w-3xl px-4 text-center">
        <h2 className="text-3xl font-bold mb-10">Meet Your Tutor</h2>
        <div className="p-8 bg-gray-50 dark:bg-gray-800 shadow-lg rounded-lg flex flex-col items-center">
          <img
            src={tutor.image}
            alt={tutor.name}
            className="w-32 h-32 rounded-full mb-4 object-cover border-4 border-indigo-500 shadow-md"
          />
          <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
            {tutor.name}
          </h3>
          <p className="text-indigo-600 font-medium mb-4">
            {tutor.subjects.join(" • ")}
          </p>
          <p className="text-gray-700 dark:text-gray-300 max-w-lg">
            {tutor.description}
          </p>
        </div>
      </section>

      {/* ✅ Testimonials */}
      <section
        className="py-20 w-full px-4
          bg-gradient-to-b from-gray-50 to-gray-200
          dark:from-gray-900 dark:to-gray-800"
      >
        <h2 className="text-3xl font-bold text-center mb-10">
          What Our Students Say
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 bg-white dark:bg-gray-900 shadow rounded-lg flex flex-col"
            >
              <p className="text-gray-800 dark:text-gray-200 italic mb-4">
                "{testimonial.quote}"
              </p>
              <div className="mt-auto">
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {testimonial.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {testimonial.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

     {/* ✅ Contact Section */}
    <section
      id="contact"
      className="py-20 w-full px-4 bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800"
    >
      <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
      <p className="mb-8">
        Fill out the form below and I’ll get back to you as soon as possible.
      </p>

      <form
        ref={form}
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-white dark:bg-gray-900 p-8 rounded-lg shadow space-y-4"
      >
        <div>
          <label className="block mb-2 font-semibold text-gray-500 dark:text-gray-400">
            Name
          </label>
          <input
            type="text"
            name="from_name"
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-500 dark:text-gray-400">
            Email
          </label>
          <input
            type="email"
            name="from_email"
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-500 dark:text-gray-400">
            Message
          </label>
          <textarea
            name="message"
            rows={5}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="relative w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-70"
        >
          {loading && (
            <svg
              className="absolute left-1/2 -translate-x-1/2 top-3.5 h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          )}
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>

      {/* ✅ Thank‑You Modal */}
      <ThankYouModal open={showThankYou} onClose={() => setShowThankYou(false)} />
    </section>
    </div>
  );
}

export default Home;