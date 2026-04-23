"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useKioskStore } from "@/stores/useKioskStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const QRCode = dynamic(() => import("react-qr-code"), { ssr: false }) as any;

type Props = {
  name?: string | null;
  company?: string | null;
  imageUrl?: string | null;
  qrPayload?: string | null;
  idNumber?: string | null;
};

export default function VisitCard({
  name,
  company,
  imageUrl,
  qrPayload,
  idNumber,
}: Props) {
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

        {/* Landscape Visitor Card */}
        <Card className="w-[520px] overflow-hidden shadow-2xl border border-border rounded-2xl relative">
          {/* Lanyard hole */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-5 bg-background rounded-b-full z-10 flex items-end justify-center pb-0.5 pointer-events-none">
            <div className="w-4 h-3 rounded-full border-2 border-border" />
          </div>

          <CardContent className="p-0 flex flex-row">
            {/* Left — dark sidebar */}
            <div className="bg-[#1e2d4a] w-40 shrink-0 flex flex-col items-center justify-between py-6 px-4">
              {/* Logo slot */}
              <div className="w-16 h-16 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                <span className="text-white/40 text-[10px] font-bold tracking-widest uppercase">
                  Logo
                </span>
              </div>

              {/* Visit type + date */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-white text-sm tracking-[0.2em] uppercase font-black">
                  {visitType}
                </span>
                <span className="text-white/40 text-[10px] tracking-wide">
                  {formattedDate}
                </span>
              </div>
            </div>

            {/* Right — white content area */}
            <div className="flex flex-row flex-1 bg-white dark:bg-card">
              {/* Center — visitor info */}
              <div className="flex flex-col justify-center gap-3 flex-1 px-5 py-4">
                {/* Photo + name */}
                <div className="flex items-center gap-3">
                  {displayImage ? (
                    <img
                      src={typeof displayImage === "string" ? displayImage : ""}
                      alt="visitor"
                      className="w-16 h-16 rounded-xl object-cover border border-border shadow-sm shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-muted border border-border flex items-center justify-center shrink-0">
                      <svg
                        className="w-9 h-9 text-muted-foreground/40"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                      </svg>
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="text-[#1e2d4a] dark:text-foreground text-lg font-black leading-tight truncate">
                      {displayName ?? "Guest"}
                    </p>

                    <div className="flex flex-col gap-1 mt-0.5">
                      <div className="flex items-center gap-3">
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

                      {displayId && (
                        <div className="mt-1">
                          <span className="text-[10px] text-muted-foreground uppercase">
                            ID
                          </span>
                          <div className="text-base font-mono font-semibold text-[#1e2d4a]">
                            {displayId}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="border-dashed" />

                {/* Badge + footer */}
                <div className="flex items-center justify-between gap-2">
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
              </div>

              {/* QR section */}
              {displayQr && (
                <>
                  <Separator orientation="vertical" className="my-4" />
                  <div className="flex flex-col items-center justify-center gap-1.5 px-5 w-36">
                    <div className="bg-white p-1.5 rounded-lg border border-border shadow-sm">
                      <QRCode value={displayQr} size={96} />
                    </div>
                    <p className="text-muted-foreground/50 text-[9px] tracking-widest uppercase">
                      Scan to verify
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
