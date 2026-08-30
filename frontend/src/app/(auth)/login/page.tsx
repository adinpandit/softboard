import { AuthForm } from "@/components/auth/AuthForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const { redirectTo } = await searchParams;
  return <AuthForm mode="login" redirectTo={redirectTo} />;
}
