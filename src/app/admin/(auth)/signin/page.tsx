"use client";

import { Card, CardContent } from "@/components/ui/card";
import AuthForm from "@/app/admin/(auth)/signin/_components/AuthForm";
import { useSignIn } from "@/features/auth/queries/auth.queries";
import { useMutationCallbacks } from "@/hooks/use-mutation-callbacks";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";

type SignInPageProps = {
  title?: string;
  subtitle?: string;
};

const signInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export default function SignInPage({
  title = "Administrator Access",
  subtitle = "Enter your credentials to continue to the system.",
}: SignInPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl") ?? "/admin";

  const signInMutation = useSignIn();
  const { buildCallbacks } = useMutationCallbacks({
    entityName: "Authentication",
  });

  const handleSubmit = async (data: z.infer<typeof signInSchema>) => {
    signInMutation.mutate(
      { ...data, device_name: "admin-web" },
      buildCallbacks("change", "Session", {
        successMessage: "Signed in successfully.",
        errorMessage: "Sign in failed.",
        onSuccess: () => {
          router.replace(redirectUrl);
        },
      }),
    );
  };

  return (
    <section className="min-h-screen flex justify-center py-24">
      <div className="w-full max-w-md p-6">
        <div className="flex flex-col gap-4">
          <h1 className="font-display text-4xl text-black text-center">
            {title}
          </h1>
          {subtitle && (
            <p className="font-body text-sm text-center text-black-secondary">
              {subtitle}
            </p>
          )}
        </div>

        <Card className="w-full max-w-lg rounded-2xl border-none shadow-xs mt-8 py-12 px-4">
          <CardContent>
            <AuthForm
              schema={signInSchema}
              onSubmit={handleSubmit}
              isSubmittingExternal={signInMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
