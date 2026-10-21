import PageHeader from "../components/common/PageHeader";
import PasswordForm from "../features/profile/components/PasswordForm";
import ProfileForm from "../features/profile/components/ProfileForm";
import ProfileSummary from "../features/profile/components/ProfileSummary";
import useAuth from "../hooks/useAuth";

/** Same page for citizens and admins. */
export default function ProfilePage() {
  const { citizen } = useAuth();

  return (
    <>
      <PageHeader title="My profile" subtitle="See and update your details." />
      <div className="grid gap-6 lg:grid-cols-3">
        <ProfileSummary citizen={citizen} />
        <div className="space-y-6 lg:col-span-2">
          <ProfileForm />
          <PasswordForm />
        </div>
      </div>
    </>
  );
}
