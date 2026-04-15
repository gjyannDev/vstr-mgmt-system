"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import type { z } from "zod";
import { PasswordField } from "@/my-components/shared/form/PasswordField";

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
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="Enter email"
              className="placeholder:text-sm placeholder:text-placeholder"
              {...register("email")}
            />
            <FieldError>{errors.email?.message}</FieldError>
          </Field>

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
        className="w-full"
        disabled={disabled}
      >
        {disabled ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
