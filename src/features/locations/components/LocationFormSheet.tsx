"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { useMutationCallbacks } from "@/hooks/use-mutation-callbacks";
import { TextField } from "@/my-components/shared/form/TextField";
import { SelectField } from "@/my-components/shared/form/SelectField";
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

const LOCATION_TYPE_OPTIONS = [
  { value: "store", label: "Store" },
  { value: "warehouse", label: "Warehouse" },
  { value: "hub", label: "Hub" },

  // Office / Corporate
  { value: "office", label: "Office" },
  { value: "head_office", label: "Head Office" },
  { value: "coworking_space", label: "Co-working Space" },

  // Residential
  { value: "condominium", label: "Condominium" },
  { value: "apartment", label: "Apartment" },
  { value: "subdivision", label: "Subdivision / Village" },

  // Commercial / Public
  { value: "mall", label: "Shopping Mall" },
  { value: "restaurant", label: "Restaurant" },
  { value: "hotel", label: "Hotel" },
  { value: "event_venue", label: "Event Venue" },

  // Institutional
  { value: "school", label: "School / University" },
  { value: "hospital", label: "Hospital / Clinic" },
  { value: "government", label: "Government Office" },

  // Industrial
  { value: "factory", label: "Factory" },
  { value: "plant", label: "Plant / Industrial Site" },

  // Transport / Security-heavy
  { value: "airport", label: "Airport" },
  { value: "seaport", label: "Seaport" },

  // Misc
  { value: "data_center", label: "Data Center" },
  { value: "other", label: "Other" },
];

const LOCATION_STATE_OPTIONS = [
  { value: "ncr", label: "NCR (National Capital Region)" },
  { value: "car", label: "CAR (Cordillera Administrative Region)" },
  { value: "ilocos", label: "Ilocos Region" },
  { value: "cagayan_valley", label: "Cagayan Valley" },
  { value: "central_luzon", label: "Central Luzon" },
  { value: "calabarzon", label: "CALABARZON" },
  { value: "mimaropa", label: "MIMAROPA" },
  { value: "bicol", label: "Bicol Region" },
  { value: "western_visayas", label: "Western Visayas" },
  { value: "central_visayas", label: "Central Visayas" },
  { value: "eastern_visayas", label: "Eastern Visayas" },
  { value: "zamboanga", label: "Zamboanga Peninsula" },
  { value: "northern_mindanao", label: "Northern Mindanao" },
  { value: "davao", label: "Davao Region" },
  { value: "soccsksargen", label: "SOCCSKSARGEN" },
  { value: "caraga", label: "Caraga" },
  { value: "barmm", label: "BARMM" },
];

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
    control,
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
        <SelectField
          name="type"
          label="Type"
          control={control}
          options={LOCATION_TYPE_OPTIONS}
          placeholder="Select type"
          fullWidth
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
        <SelectField
          name="state"
          label="State"
          control={control}
          options={LOCATION_STATE_OPTIONS}
          placeholder="Select state"
          fullWidth
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
