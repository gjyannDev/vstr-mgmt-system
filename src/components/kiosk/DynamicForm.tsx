"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { TextField } from "@/my-components/shared/form/TextField";
import { SelectField } from "@/my-components/shared/form/SelectField";
import { CheckboxField } from "@/my-components/shared/form/CheckBoxField";
import { TextAreaField } from "@/my-components/shared/form/TextAreaField";
import type { VisitTypeField } from "@/features/visit-types/schemas/visit-type.schemas";

type Props = {
  formFields: VisitTypeField[];
};

export default function DynamicForm({ formFields }: Props) {
  const { register, formState, control } = useFormContext();

  return (
    <div className="flex flex-col gap-4">
      {formFields?.map((f) => {
        const key = f.name;
        switch (f.type) {
          case "select": {
            const options = (f.options ?? []).map((opt: any) => ({
              value: String(opt ?? ""),
              label: String(opt ?? ""),
            }));

            return (
              <SelectField
                key={key}
                name={key}
                label={f.label}
                control={control}
                options={options}
                fullWidth
                error={String(formState.errors?.[key]?.message ?? "")}
              />
            );
          }

          case "checkbox":
            return (
              <CheckboxField
                key={key}
                name={key}
                control={control}
                label={f.label}
                error={String(formState.errors?.[key]?.message ?? "")}
              />
            );

          case "textarea":
            return (
              <TextAreaField
                key={key}
                name={key}
                label={f.label}
                placeholder={f.placeholder ?? ""}
                register={register}
                error={String(formState.errors?.[key]?.message ?? "")}
              />
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
