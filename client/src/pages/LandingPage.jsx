import Hero from "../features/landing/components/Hero";
import HowItWorks from "../features/landing/components/HowItWorks";
import Commitments from "../features/landing/components/Commitments";

/** Homepage: thin page that only composes landing sections. */
export default function LandingPage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Commitments />
    </>
  );
}
