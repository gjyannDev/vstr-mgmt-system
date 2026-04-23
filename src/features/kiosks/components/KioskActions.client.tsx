"use client";

import { useState } from "react";
import { useGetKioskById } from "@/features/kiosks/queries/kiosks.queries";
import Countdown from "@/features/kiosks/components/Countdown.client";
import KioskDetailsDialog from "@/features/kiosks/components/KioskDetailsDialog.client";
import { MoreHorizontal, Key, RefreshCw, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CustomDialog } from "@/my-components/dialog/CustomDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useMutationCallbacks } from "@/hooks/use-mutation-callbacks";
import {
  useRegenerateKioskCode,
  useRevokeKioskTokens,
} from "@/features/kiosks/queries/kiosks.queries";
import type { Kiosk } from "@/features/kiosks/schemas/kiosk.schemas";

interface Props {
  kiosk: Kiosk;
}

export default function KioskActions({ kiosk }: Props) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState<
    "regenerate" | "revoke" | null
  >(null);
  const [codeDialogOpen, setCodeDialogOpen] = useState(false);
  const [codeValue, setCodeValue] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  const [detailsOpen, setDetailsOpen] = useState(false);

  const { data: detailData, isLoading: isDetailLoading } = useGetKioskById(
    kiosk.id,
  );

  const { buildCallbacks } = useMutationCallbacks({ entityName: "Kiosk" });

  const { mutateAsync: regenerateMutateAsync, status: regenerateStatus } =
    useRegenerateKioskCode();
  const isRegenerating = regenerateStatus === "pending";

  const { mutateAsync: revokeMutateAsync, status: revokeStatus } =
    useRevokeKioskTokens();
  const isRevoking = revokeStatus === "pending";

  const openRegenerateConfirm = () => {
    setConfirmType("regenerate");
    setConfirmOpen(true);
    setOpenDropdown(false);
  };

  const openRevokeConfirm = () => {
    setConfirmType("revoke");
    setConfirmOpen(true);
    setOpenDropdown(false);
  };

  const handleConfirm = async () => {
    if (confirmType === "regenerate") {
      try {
        const data = await regenerateMutateAsync(kiosk.id);
        setCodeValue(data.activation_code);
        setExpiresAt(data.activation_expires_at ?? null);
        // persist the shown code so it can be viewed from the details dialog
        try {
          const key = `kiosk:${kiosk.id}:activation_code`;
          sessionStorage.setItem(
            key,
            JSON.stringify({
              code: data.activation_code,
              expiresAt: data.activation_expires_at ?? null,
            }),
          );
        } catch (e) {
          // ignore
        }
        setCodeDialogOpen(true);
        buildCallbacks("create", kiosk.name).onSuccess();
      } catch (err) {
        buildCallbacks("create", kiosk.name).onError(err);
      }
    }

    if (confirmType === "revoke") {
      try {
        await revokeMutateAsync(kiosk.id);
        buildCallbacks("change", kiosk.name).onSuccess();
      } catch (err) {
        buildCallbacks("change", kiosk.name).onError(err);
      }
    }

    setConfirmOpen(false);
    setConfirmType(null);
  };

  const handleCopy = async () => {
    if (!codeValue) return;
    try {
      await navigator.clipboard.writeText(codeValue);
    } catch (e) {
      // ignore
    }
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
              openRegenerateConfirm();
            }}
            className="flex items-center gap-2"
          >
            <Key className="text-black" />
            Generate Activation Code
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              openRevokeConfirm();
            }}
            className="flex items-center gap-2"
          >
            <Power className="text-black" />
            Revoke Tokens
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setDetailsOpen(true);
              setOpenDropdown(false);
            }}
            className="flex items-center gap-2"
          >
            <RefreshCw className="text-black" />
            Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CustomDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={
          confirmType === "regenerate"
            ? "Generate activation code?"
            : "Revoke kiosk tokens?"
        }
        description={
          confirmType === "regenerate"
            ? "This will invalidate any previous activation codes and return a new one. The code is shown only once."
            : "This will revoke all active kiosk tokens immediately. Devices may need to re-activate."
        }
        confirmText={confirmType === "regenerate" ? "Generate" : "Revoke"}
        cancelText="Cancel"
        variant={confirmType === "revoke" ? "error" : "default"}
        onConfirm={handleConfirm}
        isLoading={isRegenerating || isRevoking}
      />

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
              <Button onClick={handleCopy}>Copy</Button>
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
      <KioskDetailsDialog
        kiosk={kiosk}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        detailData={detailData}
        onGenerateClick={() => {
          setConfirmType("regenerate");
          setConfirmOpen(true);
        }}
        onRevokeClick={() => {
          setConfirmType("revoke");
          setConfirmOpen(true);
        }}
        isRegenerating={isRegenerating}
        isRevoking={isRevoking}
      />
    </>
  );
}
