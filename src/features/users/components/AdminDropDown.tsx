"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import AdminFormSheet from "./AdminFormSheet";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useDeleteAdminUser } from "@/features/users/queries/users.queries";
import { CustomDialog } from "@/my-components/dialog/CustomDialog";

export default function AdminDropDown({ admin }: { admin: any }) {
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { mutate: deleteAdmin, isPending } = useDeleteAdminUser();

  const handleDelete = () => {
    deleteAdmin(admin.id);
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-1">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => setEditOpen(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setConfirmOpen(true)}
            variant="destructive"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CustomDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Delete ${admin.full_name}?`}
        description={`Are you sure you want to delete ${admin.full_name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="error"
        onConfirm={handleDelete}
      />

      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent className="flex flex-col p-0 sm:max-w-md z-50">
          <div className="sticky top-0 z-10 border-b bg-background p-4">
            <SheetHeader className="flex flex-col gap-0">
              <SheetTitle className="font-display text-lg">
                Edit Admin
              </SheetTitle>
              <SheetDescription className="text-sm text-black-secondary font-body">
                Update admin details
              </SheetDescription>
            </SheetHeader>
          </div>
          <div className="scroll-area flex-1 overflow-y-auto p-4">
            <AdminFormSheet
              mode="edit"
              initialData={admin}
              onClose={() => setEditOpen(false)}
              onSuccess={() => setEditOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
