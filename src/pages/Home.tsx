// src/pages/Home.tsx
import React, { useRef, useState } from "react";
import { tutors, testimonials } from "@/lib/mockData";
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

      {/* ✅ Hero */}
      <section className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Ace Your Math Exams 🚀
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          Personalized tutoring to boost confidence and achieve top grades.
        </p>
        <a
          href="#contact"
          className="mt-6 inline-block px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
        >
          Contact Us
        </a>
      </section>

      {/* ✅ Tutors */}
      <section className="py-16 w-full max-w-6xl px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Meet Our Tutors</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {tutors.map((tutor) => (
            <div
              key={tutor.id}
              className="p-6 bg-white shadow-lg rounded-lg transform hover:-translate-y-2 hover:shadow-2xl transition"
            >
              <h3 className="text-xl font-semibold mb-2">{tutor.name}</h3>
              <p className="text-indigo-500 font-medium">{tutor.subject}</p>
              <p className="text-gray-600 mt-3">{tutor.description}</p>
            </div>
          ))}
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
              className="p-6 bg-white shadow-lg rounded-lg flex flex-col"
            >
              <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
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
          Fill out the form below and we’ll get back to you as soon as possible.
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