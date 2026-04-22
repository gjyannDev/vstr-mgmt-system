"use client";

import { useState } from "react";
import { Edit2, MoreHorizontal, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useMutationCallbacks } from "@/hooks/use-mutation-callbacks";
import { useDeleteVisitType } from "@/features/visit-types/queries/visit-type.queries";
import type { VisitType } from "@/features/visit-types/schemas/visit-type.schemas";
import { CustomDialog } from "@/my-components/dialog/CustomDialog";
import VisitTypeFormSheet from "@/features/visit-types/components/VisitTypeFormSheet";

interface VisitTypeDropDownProps {
  visitType: VisitType;
}

export default function VisitTypeDropDown({
  visitType,
}: VisitTypeDropDownProps) {
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [showUpdateCloseConfirm, setShowUpdateCloseConfirm] = useState(false);
  const [isUpdateDirty, setIsUpdateDirty] = useState(false);

  const handleUpdateSheetOpenChange = (isOpen: boolean) => {
    if (!isOpen && isUpdateDirty) {
      setShowUpdateCloseConfirm(true);
      return;
    }

    setUpdateOpen(isOpen);
  };

  const handleConfirmUpdateClose = () => {
    setShowUpdateCloseConfirm(false);
    setUpdateOpen(false);
    setIsUpdateDirty(false);
  };

  const { buildCallbacks } = useMutationCallbacks({
    entityName: "Visit Type",
    onClose: () => setDeleteOpen(false),
  });

  const { mutate: deleteVisitType, isPending: isDeleting } = useDeleteVisitType(
    visitType.location_id,
  );

  const handleDelete = () => {
    deleteVisitType(visitType.id, buildCallbacks("delete", visitType.name));
  };

  return (
    <>
      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setUpdateOpen(true);
              setOpenDropdown(false);
            }}
            className="flex items-center gap-2"
          >
            <Edit2 className="text-black" />
            Edit Visit Type
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setDeleteOpen(true);
              setOpenDropdown(false);
            }}
            className="flex items-center gap-2"
          >
            <Trash2 className="text-black" />
            Delete Visit Type
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CustomDialog
        open={showUpdateCloseConfirm}
        onOpenChange={setShowUpdateCloseConfirm}
        title="Discard changes?"
        description="You have unsaved changes. Closing now will discard all progress. Are you sure?"
        confirmText="Discard"
        cancelText="Keep Editing"
        variant="error"
        onConfirm={handleConfirmUpdateClose}
      />

      <Sheet open={updateOpen} onOpenChange={handleUpdateSheetOpenChange}>
        <SheetContent className="flex flex-col p-0 sm:max-w-md z-50">
          <div className="sticky top-0 z-10 border-b bg-background p-4">
            <SheetHeader className="flex flex-col gap-0">
              <SheetTitle className="font-display text-lg">
                Edit Visit Type
              </SheetTitle>
            </SheetHeader>
          </div>

          <div className="scroll-area flex-1 overflow-y-auto p-4">
            <VisitTypeFormSheet
              mode="edit"
              locationId={visitType.location_id}
              initialData={visitType}
              open={updateOpen}
              onOpenChange={setUpdateOpen}
              onSuccess={() => setUpdateOpen(false)}
              onDirtyChange={setIsUpdateDirty}
            />
          </div>
        </SheetContent>
      </Sheet>

      <CustomDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Visit Type"
        description={`Are you sure you want to delete ${visitType.name}?`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="default"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  );
}
