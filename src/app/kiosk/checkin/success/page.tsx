"use client";

import React from "react";
import { useRouter } from "next/navigation";
import VisitCard from "@/components/kiosk/VisitCard";
import { useKioskStore } from "@/stores/useKioskStore";
import { Button } from "@/components/ui/button";

export default function Page() {
  const store = useKioskStore();
  const router = useRouter();

  const printCard = () => {
    window.print();
  };

  const done = () => {
    store.clearAll();
    router.push("/kiosk/start");
  };

  return (
    <div className="p-4 flex flex-col items-center gap-6">
      <h2 className="text-2xl">Check‑in Successful</h2>
      <VisitCard
        name={store.visitor?.full_name}
        company={store.visitor?.company}
        imageUrl={store.imageUrl}
        qrPayload={
          store.qrCode
            ? `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/v/${store.qrCode}`
            : undefined
        }
      />

      <div className="flex gap-2">
        <Button onClick={printCard}>Print / Download</Button>
        <Button variant="ghost" onClick={done}>
          Done
        </Button>
      </div>
    </div>
  );
}
