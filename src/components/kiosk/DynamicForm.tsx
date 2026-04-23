"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextField } from "@/my-components/shared/form/TextField";
import { Button } from "@/components/ui/button";
import { type ZodTypeAny } from "zod";
import type { VisitTypeField } from "@/features/visit-types/schemas/visit-type.schemas";

type Props = {
  formFields: VisitTypeField[];
  defaultValues?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
};

export default function DynamicForm({
  formFields,
  defaultValues,
  onSubmit,
}: Props) {
  const shape: Record<string, any> = {};

  formFields?.forEach((f) => {
    const name = f.name;
    const required = Boolean(f.required);

    let schemaField: ZodTypeAny;

    switch (f.type) {
      case "number": {
        const num = z.preprocess(
          (val) => (val === "" ? undefined : Number(val)),
          z.number(),
        );
        schemaField = required ? num : num.optional();
        break;
      }
      case "checkbox":
        schemaField = required ? z.boolean() : z.boolean().optional();
        break;
      case "select":
        schemaField = required ? z.string().min(1) : z.string().optional();
        break;
      default: {
        schemaField = z.string();
        if (!required) schemaField = schemaField.optional();
        if (required)
          schemaField = (schemaField as any).min(
            1,
            `${f.label || name} is required`,
          );
        break;
      }
    }

    shape[name] = schemaField;
  });

  const schema = z.object(shape);

  const form = useForm<Record<string, any>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? {},
  });

  const { handleSubmit, register, formState } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {formFields?.map((f) => {
        const key = f.name;
        switch (f.type) {
          case "select":
            return (
              <div key={key}>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  {f.label}
                </label>
                <select
                  {...register(key)}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">Select</option>
                  {f.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {formState.errors?.[key] && (
                  <p className="text-sm text-red-500">
                    {String(formState.errors[key]?.message)}
                  </p>
                )}
              </div>
            );
          case "checkbox":
            return (
              <div key={key} className="flex items-center gap-2">
                <input type="checkbox" {...register(key)} />
                <label className="text-sm">{f.label}</label>
              </div>
            );
          default:
            return (
              <TextField
                key={key}
                name={key}
                label={f.label}
                placeholder={f.placeholder ?? ""}
                register={register}
                error={String(formState.errors?.[key]?.message ?? "")}
              />
            );
        }
      })}

      <div className="flex justify-end">
        <Button type="submit">Continue</Button>
      </div>
    </form>
  );
}
