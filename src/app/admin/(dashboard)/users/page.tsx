"use client";

import { useEffect, useState } from "react";
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

import { userColumns } from "@/features/users/components/user.column";
import { useGetAdminUsers } from "@/features/users/queries/users.queries";
import { DataTable } from "@/my-components/ui/data-table";
import { DataTablePagination } from "@/my-components/ui/data-table-paginated";
import { CustomDialog } from "@/my-components/dialog/CustomDialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { TextField } from "@/my-components/shared/form/TextField";
import AdminFormSheet from "@/features/users/components/AdminFormSheet";

export default function UsersPage() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [createOpen, setCreateOpen] = useState(false);
  const [showCreateCloseConfirm, setShowCreateCloseConfirm] = useState(false);
  const [isCreateDirty, setIsCreateDirty] = useState(false);

  const { register, watch } = useForm({
    defaultValues: { search: "" },
  });

  const search = watch("search");

  useEffect(() => {
    setPageIndex(0);
  }, [search]);

  const {
    data: usersData,
    isLoading,
    isError,
  } = useGetAdminUsers({
    pageIndex,
    pageSize,
    search: search?.trim() || undefined,
  });

  const table = useReactTable({
    data: usersData?.rows ?? [],
    columns: userColumns,
    pageCount: usersData ? Math.ceil(usersData.totalCount / pageSize) : 0,
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
              <CardTitle className="text-lg font-display">
                Admin Users
              </CardTitle>
              <CardDescription className="font-body">
                Manage system admin users
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
              New Admin User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <TextField
            name="search"
            label="Search"
            placeholder="Search by name or email"
            register={register}
            disabled={createOpen}
          />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <DataTable
          table={table}
          isLoading={isLoading}
          isError={isError}
          errorMessage="Failed to load admin users"
          noDataMessage="No admin users found."
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
                Create Admin User
              </SheetTitle>
              <SheetDescription className="text-sm text-black-secondary font-body">
                Add a new admin user to the system.
              </SheetDescription>
            </SheetHeader>
          </div>
          <div className="scroll-area flex-1 overflow-y-auto p-4">
            <AdminFormSheet
              mode="create"
              onClose={() => setCreateOpen(false)}
              onSuccess={() => setCreateOpen(false)}
              onDirtyChange={(d) => setIsCreateDirty(d)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
