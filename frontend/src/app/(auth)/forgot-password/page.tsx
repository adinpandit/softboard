import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

// Sits in the (auth) group: the shared layout centers the card and bounces
// already-signed-in users to the dashboard.
export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
