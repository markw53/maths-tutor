type ResourceLink = {
  title: string;
  description?: string;
  href: string;
  tag?: string; // e.g. GCSE CS / GCSE Maths
};

type ResourceSection = {
  heading: string;
  intro?: string;
  links: ResourceLink[];
};

const sections: ResourceSection[] = [
    {
    heading: "Schemes of Work (Suggested)",
    intro:
      "Structured plans you can follow week-by-week. These are good starting points for organising revision.",
    links: [
      {
        title: "GCSE Scheme of Work (XLSX)",
        description: "Download the full GCSE scheme of work spreadsheet.",
        href: "/files/GCSE_scheme_of_work.xlsx",
        tag: "GCSE",
      },
      // ...other links
    ],
  },
  {
    heading: "Syllabus / Specifications (GCSE)",
    intro: "Use your exam board specification as your checklist for what can be assessed.",
    links: [
      {
        title: "AQA GCSE Mathematics specification",
        href: "https://www.aqa.org.uk/subjects/mathematics/gcse/mathematics-8300/specification-at-a-glance",
        tag: "GCSE Maths",
      },
      {
        title: "Edexcel GCSE Mathematics (9–1) specification",
        href: "https://qualifications.pearson.com/en/qualifications/edexcel-gcses/mathematics-2015.html",
        tag: "GCSE Maths",
      },
      {
        title: "AQA GCSE Computer Science specification",
        href: "https://www.aqa.org.uk/subjects/computer-science-and-it/gcse/computer-science-8525/specification-at-a-glance",
        tag: "GCSE CS",
      },
      {
        title: "OCR GCSE Computer Science specification",
        href: "https://www.ocr.org.uk/qualifications/gcse/computer-science-j277-from-2020/",
        tag: "GCSE CS",
      },
    ],
  },
  {
    heading: "Past Papers & Practice Questions",
    intro:
      "Timed practice + reviewing mistakes is one of the fastest ways to improve.",
    links: [
      {
        title: "Maths Genie (GCSE practice + exam questions)",
        description: "Topic booklets, worked solutions, predicted papers.",
        href: "https://www.mathsgenie.co.uk/",
        tag: "GCSE Maths",
      },
      {
        title: "Physics & Maths Tutor (GCSE resources)",
        description: "Topic questions, past papers, mark schemes.",
        href: "https://www.physicsandmathstutor.com/",
        tag: "GCSE",
      },
      {
        title: "AQA Past Papers / Mark Schemes",
        description: "Find official AQA assessment materials.",
        href: "https://www.aqa.org.uk/find-past-papers-and-mark-schemes",
        tag: "Exam Board",
      },
    ],
  },
  {
    heading: "Computer Science – Programming Practice",
    intro:
      "Short daily practice is better than long occasional sessions. These sites are great for Python/problem solving.",
    links: [
      {
        title: "Replit (online coding environment)",
        description: "Run Python in the browser—great for homework and quick practice.",
        href: "https://replit.com/",
        tag: "CS",
      },
      {
        title: "W3Schools Python",
        description: "Beginner-friendly Python reference and exercises.",
        href: "https://www.w3schools.com/python/",
        tag: "Python",
      },
      {
        title: "Project Euler (challenge problems)",
        description: "Great for computational thinking (mathy coding).",
        href: "https://projecteuler.net/",
        tag: "CS/Maths",
      },
    ],
  },
  {
    heading: "Study Skills & Exam Technique",
    intro:
      "Improve revision efficiency: spaced repetition, active recall, and exam reflection.",
    links: [
      {
        title: "Pomodoro timer (focus blocks)",
        description: "Work in 25-minute blocks to reduce procrastination.",
        href: "https://pomofocus.io/",
        tag: "Study Skills",
      },
      {
        title: "Anki (spaced repetition flashcards)",
        description: "Good for definitions, formulas, and CS theory.",
        href: "https://apps.ankiweb.net/",
        tag: "Revision",
      },
    ],
  },
];

function ResourceCard({ link }: { link: ResourceLink }) {
  return (
    <a
      href={link.href}
      target={link.href.endsWith(".xlsx") ? undefined : "_blank"}
      rel={link.href.endsWith(".xlsx") ? undefined : "noreferrer"}
      download={link.href.endsWith(".xlsx") ? "" : undefined}
      className="block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:shadow-md transition"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">{link.title}</h3>
        {link.tag && (
          <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-200">
            {link.tag}
          </span>
        )}
      </div>
      {link.description && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {link.description}
        </p>
      )}
      <p className="mt-3 text-sm text-indigo-600 dark:text-indigo-400 underline">
        Open resource
      </p>
    </a>
  );
}

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <header className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Resources Hub
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Useful GCSE resources for Mathematics and Computer Science: schemes of work,
          exam board specifications, practice questions, and revision tools.
        </p>
      </header>

      <div className="space-y-10">
        {sections.map((section) => (
          <section key={section.heading} className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {section.heading}
              </h2>
              {section.intro && (
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  {section.intro}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {section.links.map((link) => (
                <ResourceCard key={link.title} link={link} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Want a personalised plan?
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          If you tell me your exam board, current grade, and target grade, I can
          recommend exactly which topics and resources to focus on first.
        </p>
        <a
          href="/#contact"
          className="inline-block mt-4 px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
        >
          Contact me
        </a>
      </section>
    </div>
  );
}