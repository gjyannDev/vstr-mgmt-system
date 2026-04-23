"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { kioskKeys } from "@/features/kiosks/queries/kiosk.keys";
import { useGetVisitTypes } from "@/features/visit-types/queries/visit-type.queries";

import { Button } from "@/components/ui/button";
import { SelectField } from "@/my-components/shared/form/SelectField";
import { TextField } from "@/my-components/shared/form/TextField";
import { useCreateKiosk } from "@/features/kiosks/queries/kiosks.queries";
import {
  CreateKioskSchema,
  type CreateKioskValues,
} from "@/features/kiosks/schemas/kiosk.schemas";
import { useGetLocationsSimple } from "@/features/locations/queries/location.queries";
import { useMutationCallbacks } from "@/hooks/use-mutation-callbacks";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Props {
  mode: "create" | "edit";
  locationId?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function KioskFormSheet({
  mode,
  locationId,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const { buildCallbacks } = useMutationCallbacks({ entityName: "Kiosk" });

  const { mutate: createKiosk, isPending: isCreating } = useCreateKiosk();

  const queryClient = useQueryClient();

  const [codeDialogOpen, setCodeDialogOpen] = useState(false);
  const [codeValue, setCodeValue] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  const { data: locations } = useGetLocationsSimple({});

  const form = useForm<CreateKioskValues>({
    resolver: zodResolver(CreateKioskSchema),
    defaultValues: {
      name: "",
      location_id: locationId ?? "",
      visit_type_ids: [],
      status: "active",
    },
  });

  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = form;

  const selectedLocation = watch("location_id") ?? locationId ?? "";
  const { data: visitTypes } = useGetVisitTypes(String(selectedLocation), {
    pageIndex: 0,
    pageSize: 200,
  });

  useEffect(() => {
    // noop: we don't need to perform extra side-effects on open
  }, [open]);

  const onSubmit = (values: CreateKioskValues) => {
    createKiosk(values, {
      onSuccess: (data: any) => {
        // close the sheet first
        onSuccess?.();

        const activation = data?.activation_code ?? null;
        const activationExpires = data?.activation_expires_at ?? null;

        if (activation) {
          setCodeValue(activation);
          setExpiresAt(activationExpires ?? null);
          setCodeDialogOpen(true);
        }

        // Show standard toast
        buildCallbacks("create", values.name).onSuccess();

        // Ensure kiosk list refreshes and optimistically insert created kiosk into cached paginated lists
        try {
          // Invalidate to trigger refetch for active queries
          queryClient.invalidateQueries({ queryKey: kioskKeys.list.all() });

          const created = data?.kiosk;
          if (created) {
            // Update any paginated list caches that match
            const queries = queryClient.getQueriesData({
              queryKey: kioskKeys.list.all(),
            });
            queries.forEach(([key, old]: any) => {
              try {
                queryClient.setQueryData(key, (prev: any) => {
                  if (!prev) {
                    return { rows: [created], totalCount: 1 };
                  }

                  // If the paginated query had filters, ensure location filter matches
                  const lastKey = Array.isArray(key)
                    ? key[key.length - 1]
                    : null;
                  const filters = typeof lastKey === "object" ? lastKey : {};
                  if (
                    filters.location_id &&
                    filters.location_id !== created.location_id
                  ) {
                    return prev;
                  }

                  // Prepend the newly created kiosk to current rows and increment totalCount
                  return {
                    ...prev,
                    rows: [created, ...((prev.rows as any[]) || [])],
                    totalCount: (prev.totalCount || 0) + 1,
                  };
                });
              } catch (e) {
                // ignore per-list update errors
              }
            });
          }
        } catch (e) {
          // ignore
        }
      },
      onError: (err) => {
        buildCallbacks("create", values.name).onError(err);
      },
    });
  };

  return (
    <Sheet open={!!open} onOpenChange={(v) => onOpenChange?.(v)}>
      <SheetContent className="flex flex-col p-0 sm:max-w-md z-50 h-full">
        <div className="sticky top-0 z-10 border-b bg-background p-4">
          <SheetHeader className="flex flex-col gap-0">
            <SheetTitle className="font-display text-lg">
              {mode === "create" ? "Create Kiosk" : "Edit Kiosk"}
            </SheetTitle>
          </SheetHeader>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-3">
              <TextField
                name="name"
                label="Kiosk name"
                placeholder="Front Desk Kiosk"
                register={register}
                error={errors.name?.message}
              />

              <SelectField
                name="location_id"
                label="Location"
                control={control}
                options={(locations?.rows ?? []).map((l: any) => ({
                  value: l.id,
                  label: l.name,
                }))}
                placeholder="Select location"
                fullWidth
                error={errors.location_id?.message}
              />

              <div>
                <div className="text-sm text-muted-foreground">
                  Visit Types (optional)
                </div>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {(visitTypes?.rows ?? []).map((vt: any) => (
                    <label key={vt.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={vt.id}
                        {...register("visit_type_ids")}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">{vt.name}</span>
                    </label>
                  ))}
                </div>
                {errors.visit_type_ids?.message && (
                  <div className="text-red-600 text-sm">
                    {String(errors.visit_type_ids?.message)}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t p-4 flex justify-end gap-2 bg-background sticky bottom-0">
            <Button
              type="button"
              variant="outline"
              className="h-10 px-10 text-base"
              onClick={() => onOpenChange?.(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="h-10 px-10 text-base"
              disabled={isCreating}
            >
              {isCreating
                ? "Creating..."
                : mode === "create"
                  ? "Create Kiosk"
                  : "Update Kiosk"}
            </Button>
          </div>
        </form>
      </SheetContent>

      <Dialog open={codeDialogOpen} onOpenChange={setCodeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Activation Code</DialogTitle>
            <p className="text-sm text-muted-foreground">
              This code is shown only once. Copy it to the kiosk or scan the QR.
            </p>
          </DialogHeader>

          <div className="mt-4 flex flex-col items-center gap-4">
            <div className="rounded-md border bg-muted px-4 py-3 font-mono text-lg">
              {codeValue}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={async () => {
                  if (!codeValue) return;
                  try {
                    await navigator.clipboard.writeText(codeValue);
                  } catch (e) {
                    // ignore
                  }
                }}
              >
                Copy
              </Button>
              <Button
                variant="outline"
                onClick={() => setCodeDialogOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>

          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>
    </Sheet>
  );
}
