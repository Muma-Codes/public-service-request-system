// A true sequence, so numbering is meaningful here
const STEPS = [
  {
    title: "Log in or create an account",
    text: "It takes a minute and keeps all your requests in one place.",
  },
  {
    title: "Describe what needs fixing",
    text: "Tell us what the problem is and where it is.",
  },
  {
    title: "Follow it to resolution",
    text: "Watch your request move from Pending to In progress to Resolved.",
  },
];

export default function HowItWorks() {
  return (
    <section
      className="border-y border-line bg-white"
      aria-labelledby="how-it-works"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 id="how-it-works" className="section-title mb-8">
          How it works
        </h2>
        <ol className="grid gap-8 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700">
                {index + 1}
              </span>
              <div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="helper-text mt-1">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
