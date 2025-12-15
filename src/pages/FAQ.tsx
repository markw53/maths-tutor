export default function FAQ() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold text-center">FAQs &amp; Contact Policy</h1>
      <p className="text-sm italic text-center text-gray-500 dark:text-gray-400">
        Last updated {new Date().toLocaleDateString()}
      </p>

      <section className="space-y-6">
        <p className="text-center">
          This page answers common questions about lessons, technology, and how to contact us.  
          If your question isn’t listed, please{" "}
          <a
            href="mailto:info@mathtutors.com"
            className="text-indigo-600 dark:text-indigo-400 underline"
          >
            email: info@mathtutors.com
          </a>.
        </p>

        {/* ---- General ---- */}
        <h2 className="text-2xl font-semibold">General</h2>
        <div className="space-y-2">
          <details className="bg-gray-50 dark:bg-gray-800 p-4 rounded shadow">
            <summary className="font-semibold cursor-pointer">
              What subjects do you teach?
            </summary>
            <p className="mt-2">
              I offer tutoring in <strong>Mathematics and Computer Science</strong> up to A‑Level / equivalent.
            </p>
          </details>

          <details className="bg-gray-50 dark:bg-gray-800 p-4 rounded shadow">
            <summary className="font-semibold cursor-pointer">
              Do you teach online or in person?
            </summary>
            <p className="mt-2">
              Most sessions are delivered online through Zoom or Google Meet.  
              In‑person lessons may be arranged locally by agreement.
            </p>
          </details>

          <details className="bg-gray-50 dark:bg-gray-800 p-4 rounded shadow">
            <summary className="font-semibold cursor-pointer">
              How long is each lesson?
            </summary>
            <p className="mt-2">
              Standard lessons are <strong>60 minutes</strong>.  
              90‑minute extended sessions are available for exam preparation.
            </p>
          </details>
        </div>

        {/* ---- Technology ---- */}
        <h2 className="text-2xl font-semibold">Technology &amp; Setup</h2>
        <div className="space-y-2">
          <details className="bg-gray-50 dark:bg-gray-800 p-4 rounded shadow">
            <summary className="font-semibold cursor-pointer">
              What technology do I need for online lessons?
            </summary>
            <p className="mt-2">
              Any laptop, tablet, or desktop with a stable internet connection, webcam, and microphone.  
              Please have Google Docs or equivalent ready for shared working. 
            </p>
          </details>

          <details className="bg-gray-50 dark:bg-gray-800 p-4 rounded shadow">
            <summary className="font-semibold cursor-pointer">
              How are resources shared?
            </summary>
            <p className="mt-2">
              Lesson notes and practice questions are shared using Google Drive or emailed directly after each session.
            </p>
          </details>
        </div>

        {/* ---- Booking / Cancellation ---- */}
        <h2 className="text-2xl font-semibold">Booking &amp; Cancellations</h2>
        <div className="space-y-2">
          <details className="bg-gray-50 dark:bg-gray-800 p-4 rounded shadow">
            <summary className="font-semibold cursor-pointer">
              How do I book a lesson?
            </summary>
            <p className="mt-2">
              Use the booking form on the <a href="/dashboard" className="text-indigo-600 dark:text-indigo-400 underline">Dashboard page</a>  
              or email your request directly with your preferred topic and time.
            </p>
          </details>

          <details className="bg-gray-50 dark:bg-gray-800 p-4 rounded shadow">
            <summary className="font-semibold cursor-pointer">
              What is your cancellation policy?
            </summary>
            <p className="mt-2">
              At least 24‑hours’ notice is required to cancel without charge.  
              See our <a href="/terms" className="text-indigo-600 dark:text-indigo-400 underline">Terms of Service</a> for details.
            </p>
          </details>
        </div>

        {/* ---- Contact policy ---- */}
        <h2 className="text-2xl font-semibold">Contact Policy</h2>
        <p>
          The best way to reach me is via email or the contact form on the home page.  
          I aim to respond within one working day. Urgent lesson changes should be sent by email or SMS (contact number provided to students after booking).
        </p>
      </section>
    </div>
  );
}