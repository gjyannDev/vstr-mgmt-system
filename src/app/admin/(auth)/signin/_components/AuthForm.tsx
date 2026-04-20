"use client";

import { Button } from "@/components/ui/button";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import type { z } from "zod";
import { PasswordField } from "@/my-components/shared/form/PasswordField";
import { TextField } from "@/my-components/shared/form/TextField";

type AuthFormValues = {
  email: string;
  password: string;
};

type AuthFormProps = {
  schema: z.ZodType<AuthFormValues>;
  onSubmit: SubmitHandler<AuthFormValues>;
  defaultValues?: Partial<AuthFormValues>;
  isSubmittingExternal?: boolean;
  showForgotPasswordLink?: boolean;
  forgotPasswordHref?: string;
};

export default function AuthForm({
  schema,
  onSubmit,
  defaultValues,
  isSubmittingExternal,
  showForgotPasswordLink = true,
  forgotPasswordHref = "/password/forgot",
}: AuthFormProps) {
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = form;

  const disabled = Boolean(isSubmittingExternal) || isSubmitting;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-sm mx-auto"
      noValidate
    >
      <FieldSet>
        <FieldGroup>
          {/* Email */}
          <TextField
            name="email"
            label="Email"
            type="email"
            placeholder="Enter email"
            autoComplete="email"
            register={register}
            error={errors.email?.message}
          />

          {/* Password */}
          <PasswordField
            name="password"
            label="Password"
            placeholder="Enter password"
            autoComplete="current-password"
            register={register}
            error={errors.password?.message}
          />

          {/* {showForgotPasswordLink && (
            <p className="text-sm text-black-secondary">
              <a href={forgotPasswordHref}>Forgot Password?</a>
            </p>
          )} */}
        </FieldGroup>
      </FieldSet>

      <Button
        type="submit"
        variant="default"
        size="sm"
        className="w-full h-10"
        disabled={disabled}
      >
        {disabled ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
