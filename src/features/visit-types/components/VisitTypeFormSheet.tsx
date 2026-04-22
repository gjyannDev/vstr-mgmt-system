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
import { TextAreaField } from "@/my-components/shared/form/TextAreaField";
import { CheckboxField } from "@/my-components/shared/form/CheckBoxField";
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
import { PlusIcon, Trash2Icon } from "lucide-react";

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
      is_camera_active: initialData?.is_camera_active ?? false,
      requires_approval: initialData?.requires_approval ?? false,
      active: initialData?.active ?? true,
      form_fields: [],
    },
  });

  const {
    register,
    handleSubmit,
    control,
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
      <SheetContent className="flex flex-col p-0 sm:max-w-md z-50 h-full">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b bg-background p-4">
          <SheetHeader className="flex flex-col gap-0">
            <SheetTitle className="font-display text-lg">
              {mode === "create" ? "Create Visit Type" : "Edit Visit Type"}
            </SheetTitle>
          </SheetHeader>
        </div>

        {/* Scrollable Content */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {/* ALL YOUR FORM CONTENT HERE (no buttons) */}

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <TextField name="name" label="Name" register={register} />

                <TextAreaField
                  name="description"
                  label="Description"
                  register={register}
                />
              </div>

              <CheckboxField
                name="is_camera_active"
                control={control}
                label="Capture visitor photo"
                description="Ask admin if they'd like to capture a visitor's picture"
              />
            </div>

            {/* Form Fields Section */}
            <div>
              <div className="flex items-center justify-between">
                <h4 className="font-display font-semibold">Form Fields</h4>
                <Button
                  type="button"
                  className="rounded-full w-8 h-8"
                  onClick={() => setFieldDialogOpen(true)}
                >
                  <PlusIcon className="h-4 w-4" />
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
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setFields((s) => s.filter((_, i) => i !== idx))
                      }
                    >
                      <Trash2Icon />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t p-4 flex justify-end gap-2 bg-background sticky bottom-0">
            <Button
              type="button"
              variant="outline"
              className="h-10 px-10 text-base"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="h-10 px-10 text-base"
              disabled={isCreating || isUpdating}
            >
              {isCreating || isUpdating
                ? "Saving..."
                : mode === "create"
                  ? "Create"
                  : "Update"}
            </Button>
          </div>
        </form>
      </SheetContent>

      <FormFieldDialog
        open={fieldDialogOpen}
        onOpenChange={setFieldDialogOpen}
        onSave={handleAddField}
      />
    </Sheet>
  );
}
