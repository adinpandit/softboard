"use client";

import Link from "next/link";
import { useActionState } from "react";

import { login, signup, type AuthFormState } from "@/lib/auth/actions";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "@/lib/auth/credentials";

const INITIAL: AuthFormState = {};

interface AuthFormProps {
  mode: "login" | "signup";
  redirectTo?: string;
  /** Seed message shown before the first submit (e.g. "password updated"). */
  initialState?: AuthFormState;
}

export function AuthForm({ mode, redirectTo, initialState }: AuthFormProps) {
  const action = mode === "login" ? login : signup;
  const [state, formAction, pending] = useActionState(
    action,
    initialState ?? INITIAL,
  );

  const isLogin = mode === "login";

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">
        {isLogin ? "Log in to Softboard" : "Create your account"}
      </h1>

      {redirectTo ? (
        <input type="hidden" name="redirectTo" value={redirectTo} />
      ) : null}

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Email</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className="rounded-md border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Password</span>
        <input
          name="password"
          type="password"
          autoComplete={isLogin ? "current-password" : "new-password"}
          required
          minLength={PASSWORD_MIN_LENGTH}
          maxLength={PASSWORD_MAX_LENGTH}
          className="rounded-md border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900"
        />
      </label>

      {isLogin ? (
        <p className="-mt-1 text-right text-sm">
          <Link href="/forgot-password" className="text-neutral-500 underline">
            Forgot password?
          </Link>
        </p>
      ) : null}

      {state.error ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      ) : null}
      {state.notice ? (
        <p role="status" className="text-sm text-green-700 dark:text-green-400">
          {state.notice}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-white dark:text-neutral-900"
      >
        {pending
          ? isLogin
            ? "Logging in…"
            : "Creating account…"
          : isLogin
            ? "Log in"
            : "Sign up"}
      </button>

      <p className="text-sm text-neutral-500">
        {isLogin ? (
          <>
            No account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Log in
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
