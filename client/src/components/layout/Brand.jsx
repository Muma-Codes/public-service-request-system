import { Link } from "react-router-dom";
import { Landmark } from "lucide-react";
import { PATHS } from "../../routes/paths";

/** Logo mark + brand name. The red tile is the brand's small accent of "love for the city". */
export default function Brand() {
  return (
    <Link
      to={PATHS.HOME}
      className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-love-600 text-white">
        <Landmark className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="text-sm font-semibold leading-tight text-ink sm:text-base">
        Public Service
        <br className="sm:hidden" /> Request System
      </span>
    </Link>
  );
}
