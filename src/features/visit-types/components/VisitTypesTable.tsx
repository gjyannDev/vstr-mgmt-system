"use client";

import { useEffect, useState } from "react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/my-components/ui/data-table";
import { DataTablePagination } from "@/my-components/ui/data-table-paginated";
import VisitTypeFormSheet from "@/features/visit-types/components/VisitTypeFormSheet";
import { useGetVisitTypes } from "@/features/visit-types/queries/visit-type.queries";
import { visitTypeColumns } from "@/features/visit-types/components/visit-type.column";
import type { VisitType } from "@/features/visit-types/schemas/visit-type.schemas";
import { TextField } from "@/my-components/shared/form/TextField";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface Props {
  locationId: string;
}

export default function VisitTypesTable({ locationId }: Props) {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [createOpen, setCreateOpen] = useState(false);

  const form = useForm<{ search?: string }>({ defaultValues: { search: "" } });
  const { register, watch } = form;
  const search = (watch("search") as string) || "";

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
      <Card className="border bg-card shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-display">Filters</CardTitle>
              <CardDescription className="font-body">
                Filter visit types
              </CardDescription>
            </div>

            <Button
              type="button"
              variant="default"
              className="h-10 rounded-md"
              size="lg"
              onClick={() => setCreateOpen(true)}
            >
              <PlusIcon className="mr-2 h-4 w-4" /> New Visit Type
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <TextField
              name="search"
              label="Search"
              placeholder="Search by name"
              register={register}
              disabled={createOpen}
            />
          </div>
        </CardContent>
      </Card>

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
