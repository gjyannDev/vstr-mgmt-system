"use client";

import { useEffect, useState } from "react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/my-components/ui/data-table";
import { DataTablePagination } from "@/my-components/ui/data-table-paginated";
import VisitTypeFormSheet from "@/features/visit-types/components/VisitTypeFormSheet";
import { useGetVisitTypes } from "@/features/visit-types/queries/visit-type.queries";
import { visitTypeColumns } from "@/features/visit-types/components/visit-type.column";
import type { VisitType } from "@/features/visit-types/schemas/visit-type.schemas";

interface Props {
  locationId: string;
}

export default function VisitTypesTable({ locationId }: Props) {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [createOpen, setCreateOpen] = useState(false);

  const [search, setSearch] = useState("");

  useEffect(() => setPageIndex(0), [search]);

  const { data, isLoading, isError, error } = useGetVisitTypes(locationId, {
    pageIndex,
    pageSize,
    search: search || undefined,
  });

  const table = useReactTable<VisitType>({
    data: data?.rows ?? [],
    columns: visitTypeColumns,
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

  const handleDeleteConfirm = () => {
    // deletion is handled in the action dropdown now
    return;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div />
        <div className="flex items-center gap-2">
          <input
            placeholder="Search"
            className="input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={() => setCreateOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" /> New Visit Type
          </Button>
        </div>
      </div>

      <DataTable
        table={table}
        isLoading={isLoading}
        isError={isError}
        errorMessage={(error as any)?.message ?? "Failed to load visit types"}
      />

      <DataTablePagination table={table} showSelected={false} />

      <VisitTypeFormSheet
        mode="create"
        locationId={locationId}
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={() => {
          setCreateOpen(false);
        }}
      />
    </div>
  );
}
