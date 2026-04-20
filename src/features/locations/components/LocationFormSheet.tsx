"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { useMutationCallbacks } from "@/hooks/use-mutation-callbacks";
import { TextField } from "@/my-components/shared/form/TextField";
import {
  useCreateLocation,
  useUpdateLocation,
} from "@/features/locations/queries/location.queries";
import {
  LocationMutationSchema,
  type Location,
  type LocationMutationValues,
} from "@/features/locations/schemas/location.schemas";

interface LocationFormSheetProps {
  mode: "create" | "edit";
  initialData?: Location;
  onClose: () => void;
  onSuccess?: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
}

const normalizeOptional = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

export default function LocationFormSheet({
  mode,
  initialData,
  onClose,
  onSuccess,
  onDirtyChange,
}: LocationFormSheetProps) {
  const { buildCallbacks } = useMutationCallbacks({
    entityName: "Location",
    onClose,
  });

  const { mutate: createLocation, isPending: isCreating } = useCreateLocation();
  const { mutate: updateLocation, isPending: isUpdating } = useUpdateLocation();

  const form = useForm<LocationMutationValues>({
    resolver: zodResolver(LocationMutationSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      type: initialData?.type ?? "",
      address_line1: initialData?.address_line1 ?? "",
      city: initialData?.city ?? "",
      state: initialData?.state ?? "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = form;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const onSubmit = (values: LocationMutationValues) => {
    const payload: LocationMutationValues = {
      name: values.name.trim(),
      type: normalizeOptional(values.type),
      address_line1: normalizeOptional(values.address_line1),
      city: normalizeOptional(values.city),
      state: normalizeOptional(values.state),
    };

    if (mode === "edit" && initialData?.id) {
      updateLocation(
        { locationId: initialData.id, body: payload },
        buildCallbacks("update", payload.name, {
          onSuccess: onSuccess,
        }),
      );
      return;
    }

    createLocation(
      payload,
      buildCallbacks("create", payload.name, {
        onSuccess: onSuccess,
      }),
    );
  };

  const isPending = isCreating || isUpdating;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-full flex-col gap-4"
    >
      <div className="grid grid-cols-1 gap-3">
        <TextField
          name="name"
          label="Location Name"
          placeholder="Main Branch"
          register={register}
          error={errors.name?.message}
        />
        <TextField
          name="type"
          label="Type"
          placeholder="Store / Warehouse / Hub"
          register={register}
          error={errors.type?.message}
        />
        <TextField
          name="address_line1"
          label="Address"
          placeholder="Street, building, landmark"
          register={register}
          error={errors.address_line1?.message}
        />
        <TextField
          name="city"
          label="City"
          placeholder="City"
          register={register}
          error={errors.city?.message}
        />
        <TextField
          name="state"
          label="State"
          placeholder="State"
          register={register}
          error={errors.state?.message}
        />
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
              ? "Update Location"
              : "Create Location"}
        </Button>
      </div>
    </form>
  );
}
