// src/pages/Home.tsx
import React, { useRef, useState } from "react";
import { tutor, testimonials } from "@/lib/mockData";
import emailjs from "@emailjs/browser";

function Home() {
  const form = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.current) return;

    setLoading(true);
    setStatus(null);

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,  // ✅ secured
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID, // ✅ secured
        form.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY   // ✅ secured
      );
      setStatus("Message sent successfully ✅");
      form.current.reset();
    } catch (error) {
      console.error("EmailJS Error:", error);
      setStatus("Failed to send message ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">

      {/* ✅ Hero Section */}
      <section className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Maths & Computer Science Tutoring 🚀</h1>
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

      {/* ✅ Single Tutor Section */}
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
      <section className="py-20 bg-gray-100 w-full px-4">
        <h2 className="text-3xl font-bold text-center mb-10">
          What Our Students Say
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 bg-gray-50 dark:bg-gray-800 shadow rounded-lg flex flex-col">
              <p className="text-gray-800 dark:text-gray-200 italic mb-4">
                "{testimonial.quote}"
              </p>
              <div className="mt-auto">
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ Contact */}
      <section id="contact" className="py-20 bg-indigo-50 w-full text-center px-4">
        <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
        <p className="mb-8">
          Fill out the form below and I’ll get back to you as soon as possible.
        </p>

        <form
          ref={form}
          onSubmit={sendEmail}
          className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow"
        >
          <div className="mb-4">
            <label className="block text-left mb-2 font-semibold">Name</label>
            <input
              type="text"
              name="from_name"
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-left mb-2 font-semibold">Email</label>
            <input
              type="email"
              name="from_email"
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-left mb-2 font-semibold">Message</label>
            <textarea
              name="message"
              rows={5}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        {status && (
          <p className="mt-4 text-gray-700 font-medium">{status}</p>
        )}
      </section>
    </div>
  );
}

export default Home;