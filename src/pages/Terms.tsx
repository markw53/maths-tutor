// import React from "react";

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold text-center mb-4">
        Terms of Service
      </h1>
      <p className="text-sm italic text-center text-gray-500 dark:text-gray-400">
        Last updated {new Date().toLocaleDateString()}
      </p>

      <section className="space-y-4">
        <p>
          Welcome to <strong>South Brent Tutoring</strong> (“we”, “us”, or “our”).  
          By booking a lesson or using our website, you agree to the following Terms of Service.  
          Please read them carefully.
        </p>

        <h2 className="text-2xl font-semibold">1. Tutoring Services</h2>
        <p>
          We provide online and/or in‑person tuition in Mathematics and Computer Science. Lessons are booked in advance and delivered via the methods described on our website.
        </p>

        <h2 className="text-2xl font-semibold">2. Bookings &amp; Payments</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Lesson requests can be made through our contact or booking forms.</li>
          <li>Bookings are confirmed once we send you written confirmation and payment details.</li>
          <li>Payments are due by invoice prior to the session unless otherwise agreed.</li>
        </ul>

        <h2 className="text-2xl font-semibold">3. Cancellations &amp; Rescheduling</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>
            At least <strong>24 hours’ notice</strong> is required to cancel or reschedule a lesson without charge.
          </li>
          <li>
            Sessions cancelled with less than 24 hours’ notice may be charged in full at our discretion.
          </li>
          <li>
            If we need to cancel a session, you will be offered a reschedule or full refund.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold">4. Student Responsibilities</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Students should arrive on time (online or in person) and come prepared with any materials required for the lesson.
          </li>
          <li>
            Recording, redistribution, or commercial use of lesson materials without permission is prohibited.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold">5. Liability &amp; Guarantees</h2>
        <p>
          We aim to provide high‑quality tuition, but cannot guarantee particular exam results. Our liability is limited to the value of services provided.
        </p>

        <h2 className="text-2xl font-semibold">6. Privacy and Data Protection</h2>
        <p>
          Personal information is handled in accordance with our{" "}
          <a
            href="/privacy"
            className="text-indigo-600 dark:text-indigo-400 underline"
          >
            Privacy Policy
          </a>.
        </p>

        <h2 className="text-2xl font-semibold">7. Intellectual Property</h2>
        <p>
          All lesson materials and resources are copyright © South Brent Tutoring unless otherwise stated. They may not be shared publicly without permission.
        </p>

        <h2 className="text-2xl font-semibold">8. Changes to These Terms</h2>
        <p>
          We may update these terms periodically. Any changes will be posted on this page with a revised date.
        </p>

        <h2 className="text-2xl font-semibold">9. Contact</h2>
        <p>
          For questions about these Terms, please email us at{" "}
          <a
            href="mailto:southbrenttutoring@outlook.com"
            className="text-indigo-600 dark:text-indigo-400"
          >
            southbrenttutoring@outlook.com
          </a>.
        </p>
      </section>
    </div>
  );
}