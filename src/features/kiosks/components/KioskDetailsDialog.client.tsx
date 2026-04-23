"use client";

import { useEffect, useState } from "react";
import type { Kiosk } from "@/features/kiosks/schemas/kiosk.schemas";
import Countdown from "@/features/kiosks/components/Countdown.client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Props {
  kiosk: Kiosk;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerateClick?: () => void;
  onRevokeClick?: () => void;
  detailData?: any;
  isLoading?: boolean;
  isRegenerating?: boolean;
  isRevoking?: boolean;
}

export default function KioskDetailsDialog({
  kiosk,
  open,
  onOpenChange,
  onGenerateClick,
  onRevokeClick,
  detailData,
  isRegenerating,
  isRevoking,
}: Props) {
  const [storedCode, setStoredCode] = useState<{
    code: string;
    expiresAt?: string | null;
  } | null>(null);

  useEffect(() => {
    if (!open) return;

    const key = `kiosk:${kiosk.id}:activation_code`;
    try {
      const raw = sessionStorage.getItem(key);
      if (!raw) {
        setStoredCode(null);
        return;
      }

      const parsed = JSON.parse(raw);
      const expiresAt = parsed?.expiresAt;
      if (!expiresAt) {
        sessionStorage.removeItem(key);
        setStoredCode(null);
        return;
      }

      const expires = new Date(expiresAt);
      if (isNaN(expires.getTime()) || expires.getTime() <= Date.now()) {
        sessionStorage.removeItem(key);
        setStoredCode(null);
      } else {
        setStoredCode({ code: parsed.code, expiresAt });
      }
    } catch (e) {
      setStoredCode(null);
    }
  }, [open, kiosk.id, detailData?.kiosk?.active_code_expires_at]);

  const handleCopy = async () => {
    if (!storedCode?.code) return;
    try {
      await navigator.clipboard.writeText(storedCode.code);
    } catch (e) {
      // ignore
    }
  };

  const expiresAt =
    detailData?.kiosk?.active_code_expires_at ?? kiosk.active_code_expires_at;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kiosk details</DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-4">
          <div>
            <div className="text-sm text-muted-foreground">Name</div>
            <div className="font-medium">
              {detailData?.kiosk?.name ?? kiosk.name}
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground">Kiosk ID</div>
            <div className="font-mono text-sm">
              {detailData?.kiosk?.id ?? kiosk.id}
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground">Status</div>
            <div className="font-medium">
              {detailData?.kiosk?.status ?? kiosk.status}
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground">
              Active code expiry
            </div>
            <div>
              <Countdown expiresAt={expiresAt} />
            </div>
          </div>

          {storedCode ? (
            <div>
              <div className="text-sm text-muted-foreground">
                Activation code
              </div>
              <div className="rounded-md border bg-muted px-4 py-3 font-mono text-lg flex items-center justify-between">
                <span>{storedCode.code}</span>
                <div className="flex gap-2 ml-4">
                  <Button onClick={handleCopy}>Copy</Button>
                </div>
              </div>
            </div>
          ) : (
            expiresAt && (
              <div className="text-sm text-muted-foreground">
                An active activation code exists but was shown only once.
                Generate a new one if needed.
              </div>
            )
          )}

          <div className="flex gap-2">
            <Button onClick={onGenerateClick} disabled={!!isRegenerating}>
              Generate
            </Button>

            <Button
              variant="destructive"
              onClick={onRevokeClick}
              disabled={!!isRevoking}
            >
              Revoke Tokens
            </Button>
          </div>
        </div>

        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}
