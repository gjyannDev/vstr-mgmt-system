"use client";

import { useEffect, useState } from "react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/my-components/ui/data-table";
import { DataTablePagination } from "@/my-components/ui/data-table-paginated";
import { kioskColumns } from "@/features/kiosks/components/kiosk.columns";
import { useGetKiosks } from "@/features/kiosks/queries/kiosks.queries";
import {
  KioskFiltersSchema,
  type KioskFiltersValues,
} from "@/features/kiosks/schemas/kiosk.schemas";
import { TextField } from "@/my-components/shared/form/TextField";
import KioskFormSheet from "@/features/kiosks/components/KioskFormSheet";

interface Props {
  // optional default location filter
  locationId?: string;
}

export default function KiosksTable({ locationId }: Props) {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [createOpen, setCreateOpen] = useState(false);

  const form = useForm<KioskFiltersValues>({
    resolver: zodResolver(KioskFiltersSchema),
    defaultValues: { search: "", location_id: locationId ?? undefined },
  });

  const { register, watch } = form;
  const search = (watch("search") as string) || "";

  useEffect(() => setPageIndex(0), [search]);

  const { data, isLoading, isError, error } = useGetKiosks({
    pageIndex,
    pageSize,
    search: search || undefined,
    location_id: watch("location_id") as string | undefined,
  });

  // Debugging: log query result to help diagnose empty table issues
  // Remove or disable in production if noisy
  // eslint-disable-next-line no-console
  console.debug("KiosksTable: query", { data, isLoading, isError, error });

  const table = useReactTable<any>({
    data: data?.rows ?? [],
    columns: kioskColumns,
    pageCount: data ? Math.ceil(data.totalCount / pageSize) : 0,
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

  return (
    <div className="flex flex-col gap-4">
      <div className="border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-display">Filters</h3>
            <p className="text-sm text-muted-foreground">Filter kiosks</p>
          </div>

          <Button
            type="button"
            variant="default"
            className="h-10 rounded-md"
            size="lg"
            onClick={() => setCreateOpen(true)}
          >
            <PlusIcon className="mr-2 h-4 w-4" /> New Kiosk
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <TextField
            name="search"
            label="Search"
            placeholder="Search by name"
            register={register}
            disabled={createOpen}
          />
        </div>
      </div>

      <DataTable
        table={table}
        isLoading={isLoading}
        isError={isError}
        errorMessage={(error as any)?.message ?? "Failed to load kiosks"}
      />

      <DataTablePagination table={table} showSelected={false} />

      <KioskFormSheet
        mode="create"
        locationId={locationId}
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={() => setCreateOpen(false)}
      />
    </div>
  );
}
