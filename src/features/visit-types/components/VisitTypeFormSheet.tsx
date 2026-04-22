"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TextField } from "@/my-components/shared/form/TextField";
import {
  CreateVisitTypeSchema,
  type CreateVisitTypeValues,
  type VisitTypeField,
} from "@/features/visit-types/schemas/visit-type.schemas";
import {
  useCreateVisitType,
  useUpdateVisitType,
} from "@/features/visit-types/queries/visit-type.queries";
import FormFieldDialog from "@/features/visit-types/components/FormFieldDialog";

interface Props {
  mode: "create" | "edit";
  locationId: string;
  initialData?: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
}

export default function VisitTypeFormSheet({
  mode,
  locationId,
  initialData,
  open,
  onOpenChange,
  onSuccess,
  onDirtyChange,
}: Props) {
  const [fields, setFields] = useState<VisitTypeField[]>(
    initialData?.form_fields ?? [],
  );
  const [fieldDialogOpen, setFieldDialogOpen] = useState(false);

  useEffect(() => {
    setFields(initialData?.form_fields ?? []);
  }, [initialData]);

  const { mutate: createVisitType, isPending: isCreating } =
    useCreateVisitType(locationId);
  const { mutate: updateVisitType, isPending: isUpdating } =
    useUpdateVisitType(locationId);

  const form = useForm<CreateVisitTypeValues>({
    resolver: zodResolver(CreateVisitTypeSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      requires_approval: initialData?.requires_approval ?? false,
      active: initialData?.active ?? true,
      form_fields: [],
    },
  });

  const {
    register,
    handleSubmit,
    formState: { isDirty },
  } = form;

  // Propagate dirty state to parent (optional)
  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const onSubmit = (values: CreateVisitTypeValues) => {
    const payload = { ...values, form_fields: fields } as any;

    if (mode === "edit" && initialData?.id) {
      updateVisitType(
        { visitTypeId: initialData.id, body: payload },
        {
          onSuccess: () => {
            onSuccess?.();
            onOpenChange(false);
          },
        },
      );
      return;
    }

    createVisitType(payload, {
      onSuccess: () => {
        onSuccess?.();
        onOpenChange(false);
      },
    });
  };

  const handleAddField = (data: VisitTypeField) => {
    setFields((s) => [...s, data as VisitTypeField]);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col p-0 sm:max-w-md z-50">
        <div className="sticky top-0 z-10 border-b bg-background p-4">
          <SheetHeader className="flex flex-col gap-0">
            <SheetTitle className="font-display text-lg">
              {mode === "create" ? "Create Visit Type" : "Edit Visit Type"}
            </SheetTitle>
          </SheetHeader>
        </div>

        <div className="scroll-area flex-1 overflow-y-auto p-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <TextField name="name" label="Name" register={register} />

            <div>
              <div className="flex items-center justify-between">
                <h4 className="font-display font-semibold">Form Fields</h4>
                <Button type="button" onClick={() => setFieldDialogOpen(true)}>
                  Add Field
                </Button>
              </div>

              <div className="mt-2 space-y-2">
                {fields.map((f, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between border p-2 rounded"
                  >
                    <div>
                      <div className="font-medium">{f.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {f.type} • {f.name}
                      </div>
                    </div>
                    <div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setFields((s) => s.filter((_, i) => i !== idx))
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isCreating || isUpdating
                  ? "Saving..."
                  : mode === "create"
                    ? "Create"
                    : "Update"}
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>

      <FormFieldDialog
        open={fieldDialogOpen}
        onOpenChange={setFieldDialogOpen}
        onSave={handleAddField}
      />
    </Sheet>
  );
}
