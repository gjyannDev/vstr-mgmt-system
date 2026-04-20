"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { locationColumns } from "@/features/locations/components/location.column";
import LocationFormSheet from "@/features/locations/components/LocationFormSheet";
import { useGetLocations } from "@/features/locations/queries/location.queries";
import {
  LocationFiltersSchema,
  type LocationFiltersValues,
} from "@/features/locations/schemas/location.schemas";
import { DataTable } from "@/my-components/ui/data-table";
import { DataTablePagination } from "@/my-components/ui/data-table-paginated";
import { SelectField } from "@/my-components/shared/form/SelectField";
import { TextField } from "@/my-components/shared/form/TextField";
import { CustomDialog } from "@/my-components/dialog/CustomDialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const LOCATION_TYPE_OPTIONS = [
  { value: "store", label: "Store" },
  { value: "warehouse", label: "Warehouse" },
  { value: "hub", label: "Hub" },
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

const getTodayDate = () => new Date().toISOString().slice(0, 10);

export default function LocationsPage() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [createOpen, setCreateOpen] = useState(false);
  const [showCreateCloseConfirm, setShowCreateCloseConfirm] = useState(false);
  const [isCreateDirty, setIsCreateDirty] = useState(false);

  const form = useForm<LocationFiltersValues>({
    resolver: zodResolver(LocationFiltersSchema),
    defaultValues: {
      createdDate: getTodayDate(),
      type: "",
      state: "",
      search: "",
    },
  });

  const {
    control,
    register,
    watch,
    formState: { errors },
  } = form;

  const createdDate = watch("createdDate");
  const type = watch("type");
  const state = watch("state");
  const search = watch("search");

  useEffect(() => {
    setPageIndex(0);
  }, [createdDate, type, state, search]);

  const {
    data: locationsData,
    isLoading,
    isError,
  } = useGetLocations({
    createdDate,
    type: type || undefined,
    state: state || undefined,
    search: search?.trim() || undefined,
    pageIndex,
    pageSize,
  });

  const table = useReactTable({
    data: locationsData?.rows ?? [],
    columns: locationColumns,
    pageCount: locationsData
      ? Math.ceil(locationsData.totalCount / pageSize)
      : 0,
    state: { pagination: { pageIndex, pageSize } },
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(newState.pageIndex);
      setPageSize(newState.pageSize);
    },
  });

  const handleCreateSheetOpenChange = (isOpen: boolean) => {
    if (!isOpen && isCreateDirty) {
      setShowCreateCloseConfirm(true);
      return;
    }

    setCreateOpen(isOpen);
  };

  const handleConfirmCreateClose = () => {
    setShowCreateCloseConfirm(false);
    setCreateOpen(false);
    setIsCreateDirty(false);
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <Card className="border bg-card shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-display">Filters</CardTitle>
              <CardDescription className="font-body">
                Narrow down locations using the filters below
              </CardDescription>
            </div>

            <Button
              type="button"
              variant="default"
              className="h-10 rounded-md"
              size="lg"
              onClick={() => setCreateOpen(true)}
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              New Location
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <TextField
              name="createdDate"
              label="Created Date"
              type="date"
              register={register}
              error={errors.createdDate?.message}
              disabled={createOpen}
            />

            <TextField
              name="search"
              label="Search"
              placeholder="Search by location name"
              register={register}
              error={errors.search?.message}
              disabled={createOpen}
            />

            <SelectField
              name="type"
              label="Type"
              control={control}
              options={LOCATION_TYPE_OPTIONS}
              placeholder="All types"
              isClearable
              fullWidth
              error={errors.type?.message}
            />

            <SelectField
              name="state"
              label="State"
              control={control}
              options={LOCATION_STATE_OPTIONS}
              placeholder="All states"
              isClearable
              fullWidth
              error={errors.state?.message}
            />
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-4">
        <DataTable
          table={table}
          isLoading={isLoading}
          isError={isError}
          errorMessage="Failed to load locations"
          noDataMessage={
            !createdDate ? "Please select a date." : "No locations found."
          }
        />
        <DataTablePagination table={table} showSelected={false} />
      </div>

      <CustomDialog
        open={showCreateCloseConfirm}
        onOpenChange={setShowCreateCloseConfirm}
        title="Discard changes?"
        description="You have unsaved changes. Closing now will discard all progress. Are you sure?"
        confirmText="Discard"
        cancelText="Keep Editing"
        variant="error"
        onConfirm={handleConfirmCreateClose}
      />

      <Sheet open={createOpen} onOpenChange={handleCreateSheetOpenChange}>
        <SheetContent className="flex flex-col p-0 sm:max-w-md z-50">
          <div className="sticky top-0 z-10 border-b bg-background p-4">
            <SheetHeader className="flex flex-col gap-0">
              <SheetTitle className="font-display text-lg">
                Create Location
              </SheetTitle>
              <SheetDescription className="text-sm text-black-secondary font-body">
                Add a new location for your organization.
              </SheetDescription>
            </SheetHeader>
          </div>

          <div className="scroll-area flex-1 overflow-y-auto p-4">
            <LocationFormSheet
              mode="create"
              onClose={() => setCreateOpen(false)}
              onSuccess={() => setCreateOpen(false)}
              onDirtyChange={setIsCreateDirty}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
