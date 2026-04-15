"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

type TextFieldProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  label?: string;
  placeholder?: string;
  type?: string;
  step?: number | "any";
  min?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  register: UseFormRegister<TFieldValues>;
  registerOptions?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  error?: string;
  autoComplete?: string;
  disabled?: boolean;
};

export function TextField<TFieldValues extends FieldValues>({
  name,
  label,
  placeholder,
  type = "text",
  step,
  min,
  inputMode,
  register,
  registerOptions,
  error,
  autoComplete,
  disabled,
}: TextFieldProps<TFieldValues>) {
  return (
    <Field className="flex flex-col gap-1">
      {label && (
        <FieldLabel
          htmlFor={name}
          className="text-sm font-display font-bold text-black-secondary"
        >
          {label}
        </FieldLabel>
      )}
      <Input
        id={name} // important: links label and input
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="placeholder:text-sm placeholder:text-placeholder"
        step={type === "number" ? (step ?? "any") : undefined}
        min={type === "number" ? min : undefined}
        inputMode={inputMode}
        {...register(name, registerOptions)}
        disabled={disabled}
      />
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
