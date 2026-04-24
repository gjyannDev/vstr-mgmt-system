"use client";

import React, { forwardRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useKioskStore } from "@/stores/useKioskStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const QRCode = dynamic(() => import("react-qr-code"), { ssr: false }) as any;

type Props = {
  name?: string | null;
  company?: string | null;
  imageUrl?: string | null;
  qrPayload?: string | null;
  idNumber?: string | null;
  onlyCard?: boolean;
};

const VisitCard = forwardRef<HTMLDivElement, Props>(function VisitCard(
  { name, company, imageUrl, qrPayload, idNumber, onlyCard }: Props,
  ref,
) {
  const router = useRouter();
  const store = useKioskStore();

  // Prefer passed props, fallback to kiosk store
  const displayName = name ?? store.visitor?.full_name ?? store.visitor?.name;
  const displayCompany = company ?? store.visitor?.company;
  const displayImage = imageUrl ?? store.imageUrl;
  const displayQr =
    qrPayload ??
    (store.qrCode
      ? `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/v/${store.qrCode}`
      : undefined);
  const displayId = idNumber ?? store.visitor?.id_number;
  const visitType = store.visitType?.name ?? "VISITOR";
  const formattedDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const cardElement = (
    <Card className="w-[320px] overflow-hidden shadow-2xl border border-border rounded-2xl relative">
      {/* Top stripe with logo */}
      <div className="bg-[#1e2d4a] w-full py-3 flex items-center justify-center">
        <div className="w-14 h-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
          <span className="text-white/40 text-[10px] font-bold tracking-widest uppercase">
            Logo
          </span>
        </div>
      </div>

      <CardContent className="p-4 flex flex-col items-center gap-3">
        {/* Photo */}
        {displayImage ? (
          <img
            src={typeof displayImage === "string" ? displayImage : ""}
            alt="visitor"
            className="w-28 h-28 rounded-xl object-cover border border-border shadow-sm"
          />
        ) : (
          <div className="w-28 h-28 rounded-xl bg-muted border border-border flex items-center justify-center">
            <svg
              className="w-9 h-9 text-muted-foreground/40"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
        )}

        {/* Name */}
        <p className="text-[#1e2d4a] text-xl font-black leading-tight truncate">
          {displayName ?? "Guest"}
        </p>

        {/* Company / contact */}
        <div className="flex flex-col items-center gap-1 text-center">
          {displayCompany && (
            <p className="text-muted-foreground text-xs font-medium truncate">
              {displayCompany}
            </p>
          )}
          {store.visitor?.email && (
            <p className="text-muted-foreground text-xs truncate">
              {store.visitor.email}
            </p>
          )}
          {store.visitor?.phone && (
            <p className="text-muted-foreground text-xs truncate">
              {store.visitor.phone}
            </p>
          )}
        </div>

        {/* ID */}
        {displayId && (
          <div className="mt-1 w-full text-center">
            <div className="text-[10px] text-muted-foreground uppercase">
              ID
            </div>
            <div className="text-base font-mono font-semibold text-[#1e2d4a]">
              {displayId}
            </div>
          </div>
        )}

        {/* QR */}
        {displayQr && (
          <div className="mt-2 flex flex-col items-center">
            <div className="bg-white p-1.5 rounded-lg border border-border shadow-sm">
              <QRCode value={displayQr} size={120} />
            </div>
            <p className="text-muted-foreground/50 text-[9px] tracking-widest uppercase mt-1">
              Scan to verify
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-3 w-full flex items-center justify-between">
          <Badge
            variant="secondary"
            className="text-[10px] tracking-wider uppercase"
          >
            {visitType}
          </Badge>
          <p className="text-muted-foreground/50 text-[9px] tracking-wide uppercase text-right leading-tight">
            Please return to reception upon leaving
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const wrappedCard = (
    <div ref={ref as any} style={{ display: "inline-block" }}>
      {cardElement}
    </div>
  );

  if (onlyCard)
    return (
      <div className="flex items-center justify-center">{wrappedCard}</div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col gap-10 items-center w-full">
        {/* Header — matches VisitNa style */}
        <div className="text-center">
          <h1 className="text-8xl font-display italic text-primary mb-6">
            VisitNa!
          </h1>
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-display text-foreground">
              Your visit has been checked-in!
            </h2>
            <p className="text-muted-foreground">
              Your ID Pass is now available.
            </p>
          </div>
        </div>

        {wrappedCard}
      </div>
    </div>
  );
});

export default VisitCard;
