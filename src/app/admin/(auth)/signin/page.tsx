"use client";

import { Card, CardContent } from "@/components/ui/card";
import AuthForm from "@/app/admin/(auth)/signin/_components/AuthForm";
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
  const handleSubmit = async (_data: z.infer<typeof signInSchema>) => {};

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
            <AuthForm schema={signInSchema} onSubmit={handleSubmit} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
