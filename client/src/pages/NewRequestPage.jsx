import PageHeader from "../components/common/PageHeader";
import RequestForm from "../features/requests/components/RequestForm";

export default function NewRequestPage() {
  return (
    <>
      <PageHeader
        title="Request a service"
        subtitle="Tell us what needs fixing and where."
      />
      <RequestForm />
    </>
  );
}
