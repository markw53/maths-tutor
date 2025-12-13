import { Link } from "react-router-dom";

type PlanValue = "single_60" | "pack_4x60" | "intensive_90";

type PricingTier = {
  planValue: PlanValue;
  name: string;
  price: string;
  duration: string;
  description: string;
  features: string[];
  highlight?: boolean;
};

const tiers: PricingTier[] = [
  {
    planValue: "single_60",
    name: "Single Lesson",
    price: "£35",
    duration: "60 minutes",
    description:
      "Perfect for targeted support on a specific topic or exam question style.",
    features: [
      "1:1 online tutoring (Maths or Computer Science)",
      "Personalised plan for the session",
      "Practice questions + walkthrough",
      "Short homework / next steps (optional)",
    ],
  },
  {
    planValue: "pack_4x60",
    name: "Exam Prep Pack",
    price: "£120",
    duration: "4 × 60 minutes",
    description:
      "Ideal for consistent progress and exam preparation over a few weeks.",
    features: [
      "4 weekly 1:1 lessons",
      "Topic-by-topic revision plan",
      "Exam technique & timed practice",
      "Progress notes after each lesson",
    ],
    highlight: true,
  },
  {
    planValue: "intensive_90",
    name: "Intensive Session",
    price: "£50",
    duration: "90 minutes",
    description:
      "Best for deep dives into harder topics or mock paper review.",
    features: [
      "1:1 online tutoring (90 mins)",
      "Mock paper / past paper review",
      "Target weak areas quickly",
      "Action plan for revision",
    ],
  },
];

export default function Pricing() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10 text-gray-800 dark:text-gray-200">
      {/* Header */}
      <header className="text-center space-y-3">
        <h1 className="text-4xl font-bold">Pricing</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Clear, simple pricing for 1:1 Mathematics and Computer Science tutoring.
          If you’re not sure what you need, send a message and I’ll recommend the best option.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            to="/?plan=single_60#contact"
            className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            Enquire / Book
          </Link>

          <Link
            to="/faq"
            className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-700 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            View FAQs
          </Link>
        </div>
      </header>

      {/* Pricing cards */}
      <section className="grid gap-6 md:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={[
              "rounded-xl p-6 shadow",
              "bg-white dark:bg-gray-900",
              tier.highlight
                ? "ring-2 ring-indigo-500 relative"
                : "border border-gray-200 dark:border-gray-800",
            ].join(" ")}
          >
            {tier.highlight && (
              <div className="absolute -top-3 right-6 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Most popular
              </div>
            )}

            <h2 className="text-2xl font-bold">{tier.name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {tier.description}
            </p>

            <div className="mt-5 flex items-end gap-2">
              <div className="text-4xl font-extrabold text-gray-900 dark:text-white">
                {tier.price}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 pb-1">
                / {tier.duration}
              </div>
            </div>

            <ul className="mt-6 space-y-2 text-sm">
              {tier.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-indigo-600 dark:text-indigo-400">•</span>
                  <span className="text-gray-700 dark:text-gray-300">{f}</span>
                </li>
              ))}
            </ul>

            {/* ✅ This is the important link: it sets plan=... and jumps to #contact */}
            <Link
              to={`/?plan=${tier.planValue}#contact`}
              className="mt-6 inline-block w-full text-center px-5 py-3 rounded-lg font-semibold transition bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Choose {tier.name}
            </Link>
          </div>
        ))}
      </section>

      {/* Notes / Policies */}
      <section className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-3">
        <h3 className="text-xl font-semibold">Notes</h3>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
          <li>Lessons can be Maths or Computer Science (KS3/GCSE or equivalent).</li>
          <li>Online lessons via Teams/Google Meet.</li>
          <li>Payment is due in advance unless otherwise agreed.</li>
          <li>
            Cancellations: please provide at least 24 hours’ notice (see{" "}
            <Link to="/terms" className="text-indigo-600 dark:text-indigo-400 underline">
              Terms of Service
            </Link>
            ).
          </li>
        </ul>
      </section>
    </div>
  );
}