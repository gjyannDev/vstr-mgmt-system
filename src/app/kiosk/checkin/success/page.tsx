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
    <div className="flex flex-col items-center gap-2">
      <VisitCard
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
        <Button onClick={printCard}>Print / Download</Button>
        <Button variant="ghost" onClick={done}>
          Done
        </Button>
      </div>
    </div>
  );
}
