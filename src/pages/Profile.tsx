import React, { useRef, useState } from "react";
import { tutor } from "@/lib/mockData";
import emailjs from "@emailjs/browser";

export default function Profile() {
  const form = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const sendQuestion = async (e: React.FormEvent) => {
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
      setStatus("Message sent successfully ✅");
      form.current.reset();
    } catch (err) {
      console.error("Email error:", err);
      setStatus("Failed to send ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-4">Your Tutor Profile</h1>

      {/* Profile Card */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center text-center">
        <img
          src={tutor.image}
          alt={tutor.name}
          className="w-32 h-32 rounded-full border-4 border-indigo-500 object-cover mb-4"
        />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Mark Workman</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-md">
          Dedicated Maths and Computer Science Tutor helping students build confidence and achieve their best results in Key Stage 3 and GCSE courses.
        </p>
      </div>

      {/* Qualifications */}
      <section className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow space-y-2">
        <h3 className="text-xl font-semibold">Qualifications</h3>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
          <li>BSc (Hons) Mathematics and Statistics – University of Plymouth</li>
          <li>Certificate in Secondary Computing Teaching - National Centre for Computing Education</li>
          <li>Certificate in GCSE Computer Science Subject Knowledge - NCCE</li>
          <li>Software Development Bootcamp in JavaScript - Northcoders</li>
          <li>Qualified Teacher Status (QTS)</li>
          <li>Enhanced DBS Checked</li>
        </ul>
      </section>

      {/* Subjects */}
      <section className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow space-y-2">
        <h3 className="text-xl font-semibold">Subjects Taught</h3>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
          <li>Mathematics – Key Stage 3, GCSE</li>
          <li>Computer Science – Key Stage 3, GCSE</li>
        </ul>
      </section>

      {/* Contact Tutor Form */}
      <section id="contact" className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Contact Your Tutor</h3>
        <form ref={form} onSubmit={sendQuestion} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Your Name</label>
            <input
              type="text"
              name="from_name"
              required
              className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email Address</label>
            <input
              type="email"
              name="from_email"
              required
              className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Message</label>
            <textarea
              name="message"
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
            {loading ? "Sending..." : "Send Message"}
          </button>

          {status && <p className="text-center mt-3 font-medium">{status}</p>}
        </form>
      </section>
    </div>
  );
}