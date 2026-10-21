import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import Button from "../../../components/ui/Button";
import { PATHS } from "../../../routes/paths";

const COMMITMENTS = [
  "Every request is tracked from Pending to Resolved.",
  "No payment or favors are ever needed.",
  "No issue is too small to report.",
];

/** Reassurance: why citizens should not hesitate to ask for help. */
export default function Commitments() {
  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-2 lg:gap-16">
      <div>
        <h2 className="text-2xl font-semibold md:text-3xl">
          We&rsquo;re here to make your neighborhood better
        </h2>
        <p className="mt-4 max-w-xl text-ink-muted">
          Caring about where you live is how things get better. Every request
          you send is recorded and given a status you can follow, so you always
          know where it stands. Please don&rsquo;t hesitate to ask.
        </p>
      </div>

      <div>
        <ul className="space-y-3">
          {COMMITMENTS.map((text) => (
            <li key={text} className="flex items-start gap-3">
              <CheckCircle2
                className="mt-0.5 h-5 w-5 shrink-0 text-success-600"
                aria-hidden="true"
              />
              <span>{text}</span>
            </li>
          ))}
        </ul>
        <Button as={Link} to={PATHS.REGISTER} className="mt-6 w-full sm:w-auto">
          Create an account
        </Button>
      </div>
    </section>
  );
}
