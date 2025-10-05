// import React from "react";

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-4 text-center">Privacy Policy</h1>
      <p className="text-sm italic text-center text-gray-500 dark:text-gray-400">
        Last updated {new Date().toLocaleDateString()}
      </p>

      <section className="space-y-4">
        <p>
          This Privacy Policy explains how <strong>Maths &amp; CS Tutor</strong>{" "}
          (“we”, “us”, or “our”) collects, uses, and protects personal
          information provided through our website and tutoring services.
        </p>

        <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
        <p>
          We collect information that you voluntarily provide, for example:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Contact details such as name and email address when you submit a form or book a lesson.</li>
          <li>Lesson preferences, availability, and any notes you choose to share.</li>
          <li>Basic website analytics data (e.g. page views, browser type) to help us improve the site.</li>
        </ul>

        <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
        <p>Your information is used only to:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Respond to enquiries or lesson requests.</li>
          <li>Provide tutoring services and learning resources.</li>
          <li>Send important notifications related to your sessions (if requested).</li>
        </ul>

        <h2 className="text-2xl font-semibold">3. Data Storage and Security</h2>
        <p>
          We store your contact information securely using industry‑standard cloud providers such as EmailJS and Supabase. Access is limited to the tutor only for legitimate teaching purposes.
        </p>

        <h2 className="text-2xl font-semibold">4. Data Sharing</h2>
        <p>
          We do not sell or trade personal information. Data is only shared with third‑party services strictly necessary for operations (e.g. EmailJS for form delivery or analytics providers to understand traffic).
        </p>

        <h2 className="text-2xl font-semibold">5. Your Rights</h2>
        <p>You may:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Request a copy of the data we hold about you.</li>
          <li>Ask for corrections or deletion of your data.</li>
          <li>Withdraw consent for future contact at any time via email.</li>
        </ul>

        <h2 className="text-2xl font-semibold">6. Cookies &amp; Analytics</h2>
        <p>
          Our site may use basic cookies or analytics tools (Vercel Analytics / Google Analytics) to measure visits. These do not collect personally identifiable information.
        </p>

        <h2 className="text-2xl font-semibold">7. Contact Us</h2>
        <p>
          For questions about this policy or data requests, please email:{" "}
          <a
            href="mailto:info@mathtutors.com"
            className="text-indigo-600 dark:text-indigo-400"
          >
            info@mathtutors.com
          </a>
        </p>
      </section>
    </div>
  );
}