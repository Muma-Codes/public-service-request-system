import { Link } from "react-router-dom";
import Button from "../../../components/ui/Button";
import ExampleRequests from "./ExampleRequests";
import { PATHS } from "../../../routes/paths";

/** Welcome message, the two entry actions and a preview of request tracking. */
export default function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-2 lg:gap-16 lg:py-20">
      <div>
        <h1 className="max-w-xl text-3xl font-semibold tracking-tight md:text-5xl md:leading-tight">
          Welcome. Tell us what needs fixing in your neighborhood.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-ink-muted">
          A broken streetlight, a water problem, garbage that hasn&rsquo;t been
          collected? Log in or create an account to request a service, then
          follow it from Pending to Resolved.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {/* The one accent (orange) button on this screen */}
          <Button
            as={Link}
            to={PATHS.REGISTER}
            variant="accent"
            className="w-full sm:w-auto"
          >
            Create an account
          </Button>
          <Button
            as={Link}
            to={PATHS.LOGIN}
            variant="secondary"
            className="w-full sm:w-auto"
          >
            Log in
          </Button>
        </div>
      </div>

      <ExampleRequests />
    </section>
  );
}
