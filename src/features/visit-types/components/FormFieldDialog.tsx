"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextField } from "@/my-components/shared/form/TextField";
import { SelectField } from "@/my-components/shared/form/SelectField";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CreateFormFieldSchema,
  type VisitTypeField,
} from "@/features/visit-types/schemas/visit-type.schemas";
import { Trash2Icon } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Partial<VisitTypeField>;
  onSave: (data: VisitTypeField) => void;
}

export default function FormFieldDialog({
  open,
  onOpenChange,
  initial,
  onSave,
}: Props) {
  const { register, handleSubmit, watch, reset, control } = useForm<
    Partial<VisitTypeField>
  >({
    resolver: zodResolver(CreateFormFieldSchema),
    defaultValues: initial
      ? { ...initial, options: initial.options ?? [] }
      : {
          label: "",
          name: "",
          type: "text",
          required: false,
          options: [],
        },
  });

  const type = watch("type");

  // useFieldArray for dynamic options (array of strings)
  const {
    fields: optionFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "options",
  });

  const submit = (values: Partial<VisitTypeField>) => {
    const payload: any = {
      ...values,
      options: type === "select" ? (values.options ?? []) : undefined,
    };

    onSave(payload as VisitTypeField);
    reset();
    onOpenChange(false);
  };

  const addOption = () => append("");
  const removeOptionField = (idx: number) => remove(idx);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Field" : "Add Field"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="grid gap-3 py-2">
          <TextField name="label" label="Label" register={register} />
          <TextField name="name" label="Name" register={register} />
          <SelectField
            name="type"
            label="Type"
            control={control}
            options={[
              { value: "text", label: "Text" },
              { value: "textarea", label: "Textarea" },
              { value: "number", label: "Number" },
              { value: "select", label: "Select" },
              { value: "checkbox", label: "Checkbox" },
              { value: "date", label: "Date" },
            ]}
            fullWidth
          />

          <div className="flex items-center gap-2">
            <Controller
              control={control}
              name="required"
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="required"
                    checked={!!field.value}
                    onCheckedChange={(val) => field.onChange(Boolean(val))}
                  />
                  <span className="text-sm font-display">Required</span>
                </div>
              )}
            />
          </div>

          {type === "select" && (
            <div className="w-full">
              <label className="text-sm font-display font-bold">Options</label>

              <div className="flex flex-col gap-2 mt-2 w-full">
                {optionFields.map((optField, idx) => (
                  <div key={optField.id} className="flex gap-2 w-full">
                    <input
                      className="input flex-1 w-full"
                      defaultValue={
                        (watch("options") as string[] | undefined)?.[idx] ??
                        (initial?.options ? initial.options[idx] : "")
                      }
                      {...register(`options.${idx}` as unknown as any)}
                    />

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                      onClick={() => removeOptionField(idx)}
                    >
                      <Trash2Icon size={16} />
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  onClick={addOption}
                  variant="outline"
                  className="w-full"
                >
                  Add option
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
