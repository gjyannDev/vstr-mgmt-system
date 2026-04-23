"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { TextField } from "@/my-components/shared/form/TextField";
import type { VisitTypeField } from "@/features/visit-types/schemas/visit-type.schemas";

type Props = {
  formFields: VisitTypeField[];
};

export default function DynamicForm({ formFields }: Props) {
  const { register, formState } = useFormContext();

  return (
    <div className="flex flex-col gap-4">
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
    </div>
  );
}
