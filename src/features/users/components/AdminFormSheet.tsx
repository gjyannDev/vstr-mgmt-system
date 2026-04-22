"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { TextField } from "@/my-components/shared/form/TextField";
import { CheckboxField } from "@/my-components/shared/form/CheckBoxField";
import { useMutationCallbacks } from "@/hooks/use-mutation-callbacks";
import {
  useCreateAdminUser,
  useUpdateAdminUser,
} from "@/features/users/queries/users.queries";
import {
  AdminUserMutationSchema,
  AdminUserUpdateSchema,
  type AdminUserMutationValues,
} from "@/features/users/schemas/users.schemas";
import { useGetLocationsSimple } from "@/features/locations/queries/location.queries";

interface AdminFormSheetProps {
  mode: "create" | "edit";
  initialData?: any;
  onClose: () => void;
  onSuccess?: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
}

const getTodayDate = () => new Date().toISOString().slice(0, 10);

type AdminFormValues = AdminUserMutationValues & {
  locationsMap?: Record<string, boolean>;
};

export default function AdminFormSheet({
  mode,
  initialData,
  onClose,
  onSuccess,
  onDirtyChange,
}: AdminFormSheetProps) {
  const { buildCallbacks } = useMutationCallbacks({
    entityName: "Admin",
    onClose,
  });

  const { mutate: createAdmin, isPending: isCreating } = useCreateAdminUser();
  const { mutate: updateAdmin, isPending: isUpdating } = useUpdateAdminUser();

  // Fetch simple locations for selector
  const { data: locationsData } = useGetLocationsSimple({ search: undefined });

  const form = useForm<AdminFormValues>({
    resolver: zodResolver(
      mode === "create" ? AdminUserMutationSchema : AdminUserUpdateSchema,
    ),
    defaultValues: {
      full_name: initialData?.full_name ?? "",
      email: initialData?.email ?? "",
      password: "",
      location_ids: initialData?.locations ?? [],
      locationsMap: {},
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = form;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  // When locationsData or initialData change, populate locationsMap defaults
  useEffect(() => {
    const map: Record<string, boolean> = {};
    (locationsData?.rows ?? []).forEach((loc: any) => {
      map[loc.id] = Boolean(initialData?.locations?.includes(loc.id));
    });

    // reset only the locationsMap and keep other values
    form.reset({
      full_name: initialData?.full_name ?? "",
      email: initialData?.email ?? "",
      password: "",
      location_ids: initialData?.locations ?? [],
      locationsMap: map,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationsData, initialData]);

  const onSubmit = (values: AdminUserMutationValues) => {
    const payload: any = {
      name: values.full_name?.trim(),
      email: values.email?.trim(),
      password: values.password?.trim(),
      location_ids: values.location_ids,
    };

    if (mode === "edit" && initialData?.id) {
      updateAdmin(
        { adminId: initialData.id, payload },
        buildCallbacks("update", payload.name, { onSuccess }),
      );
      return;
    }

    createAdmin(payload, buildCallbacks("create", payload.name, { onSuccess }));
  };

  const isPending = isCreating || isUpdating;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-full flex-col gap-4"
    >
      <div className="grid grid-cols-1 gap-3">
        <TextField
          name="full_name"
          label="Name"
          register={register}
          error={errors.full_name?.message}
        />
        <TextField
          name="email"
          label="Email"
          register={register}
          error={errors.email?.message}
        />
        <TextField
          name="password"
          label={
            mode === "edit" ? "Password (leave blank to keep)" : "Password"
          }
          register={register}
          error={errors.password?.message}
          type="password"
        />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-display font-bold text-black-secondary">
            Assigned locations
          </label>
          <div className="max-h-48 overflow-y-auto rounded-md border p-2">
            {locationsData?.rows?.map((loc: any) => (
              <div key={loc.id} className="flex items-center py-1">
                <Controller
                  name="location_ids"
                  control={control}
                  render={({ field }) => {
                    const checked = field.value?.includes(loc.id) ?? false;
                    return (
                      <>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const next = Array.isArray(field.value)
                              ? [...field.value]
                              : [];
                            if (e.target.checked) next.push(loc.id);
                            else {
                              const idx = next.indexOf(loc.id);
                              if (idx > -1) next.splice(idx, 1);
                            }
                            field.onChange(next);
                          }}
                        />
                        <span className="ml-2">{loc.name}</span>
                      </>
                    );
                  }}
                />
              </div>
            ))}
          </div>
          {/* show simple error from zod */}
          {errors.location_ids && (
            <p className="text-destructive text-sm">
              {String(errors.location_ids.message)}
            </p>
          )}
        </div>
      </div>

      <div className="mt-auto flex justify-end gap-2 border-t pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending
            ? mode === "edit"
              ? "Updating..."
              : "Creating..."
            : mode === "edit"
              ? "Update Admin"
              : "Create Admin"}
        </Button>
      </div>
    </form>
  );
}
