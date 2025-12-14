type ResourceLink = {
  title: string;
  description?: string;
  href: string;
  tag?: string; // e.g. GCSE / A-Level / CS / Maths
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
        title: "GCSE Maths – 12-week revision plan (template)",
        description: "A simple checklist-style plan (topics + past paper schedule).",
        href: "https://www.example.com/gcse-maths-revision-plan",
        tag: "GCSE Maths",
      },
      {
        title: "A-Level Maths – Core topics scheme (template)",
        description: "Pure + Stats/Mechanics topic order and suggested practice.",
        href: "https://www.example.com/alevel-maths-scheme",
        tag: "A-Level Maths",
      },
      {
        title: "GCSE Computer Science – topic-by-topic scheme (template)",
        description: "Theory + programming practice milestones.",
        href: "https://www.example.com/gcse-cs-scheme",
        tag: "GCSE CS",
      },
    ],
  },
  {
    heading: "Syllabus / Specifications",
    intro:
      "Use your exam board specification as the main checklist for what can be assessed.",
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
      {
        title: "AQA A-Level Mathematics specification",
        href: "https://www.aqa.org.uk/subjects/mathematics/as-and-a-level/mathematics-7357/specification-at-a-glance",
        tag: "A-Level Maths",
      },
    ],
  },
  {
    heading: "Past Papers & Practice Questions",
    intro:
      "The fastest way to improve is timed practice + review of mistakes. These sources are reliable and free.",
    links: [
      {
        title: "Maths Genie (GCSE practice + exam questions)",
        description: "Topic booklets, worked solutions, predicted papers.",
        href: "https://www.mathsgenie.co.uk/",
        tag: "GCSE Maths",
      },
      {
        title: "Physics & Maths Tutor (Maths + CS resources)",
        description: "Topic questions, past papers, mark schemes.",
        href: "https://www.physicsandmathstutor.com/",
        tag: "GCSE/A-Level",
      },
      {
        title: "AQA Past Papers (Maths & CS)",
        description: "Use your exam board’s assessment materials where available.",
        href: "https://www.aqa.org.uk/find-past-papers-and-mark-schemes",
        tag: "Exam Boards",
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
        title: "GeeksForGeeks (DSA + theory)",
        description: "Good for A-Level/advanced topics, algorithms, complexity.",
        href: "https://www.geeksforgeeks.org/",
        tag: "Algorithms",
      },
      {
        title: "Project Euler (challenge problems)",
        description: "Excellent for building computational thinking (mathy coding).",
        href: "https://projecteuler.net/",
        tag: "CS/Maths",
      },
    ],
  },
  {
    heading: "Study Skills & Exam Technique",
    intro:
      "Use these to improve revision efficiency: spaced repetition, active recall, and exam reflection.",
    links: [
      {
        title: "Pomodoro timer (focus blocks)",
        description: "Work in 25-minute blocks to reduce procrastination.",
        href: "https://pomofocus.io/",
        tag: "Study Skills",
      },
      {
        title: "Anki (spaced repetition flashcards)",
        description: "Great for definitions, formulas, CS theory.",
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
      target="_blank"
      rel="noreferrer"
      className="block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:shadow-md transition"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {link.title}
        </h3>
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
          Useful links for Mathematics and Computer Science: schemes of work,
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