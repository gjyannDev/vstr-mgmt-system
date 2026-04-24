"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import VisitCard from "@/components/kiosk/VisitCard";
import { captureElementToPdf } from "@/lib/pdf/captureElementToPdf";
import { useKioskStore } from "@/stores/useKioskStore";
import { Button } from "@/components/ui/button";

export default function Page() {
  const store = useKioskStore();
  const router = useRouter();

  const cardRef = useRef<HTMLDivElement | null>(null);

  const downloadPdf = async () => {
    try {
      await captureElementToPdf(
        cardRef.current,
        `${store.visitor?.full_name ?? "visit-card"}.pdf`,
      );
    } catch (err) {
      console.error("Failed to generate PDF", err);
    }
  };

  const done = () => {
    store.clearAll();
    router.push("/kiosk/start");
  };

  return (
    <div className="flex flex-col items-center gap-12 py-24">
      <VisitCard
        ref={cardRef}
        name={store.visitor?.full_name ?? store.visitor?.name}
        company={store.visitor?.company}
        idNumber={store.visitor?.id_number}
        imageUrl={store.imageUrl}
        qrPayload={
          store.qrCode
            ? `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/v/${store.qrCode}`
            : undefined
        }
      />

      <div className="flex gap-2">
        <Button
          className="px-6 py-4 text-base font-sans"
          size="lg"
          onClick={downloadPdf}
        >
          Download PDF
        </Button>
        <Button
          className="px-6 py-4 text-base font-sans"
          size="lg"
          variant="ghost"
          onClick={done}
        >
          Done
        </Button>
      </div>
    </div>
  );
}
