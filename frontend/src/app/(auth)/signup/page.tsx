import { AuthForm } from "@/components/auth/AuthForm";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const { redirectTo } = await searchParams;
  return <AuthForm mode="signup" redirectTo={redirectTo} />;
}
