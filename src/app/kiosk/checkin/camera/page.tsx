"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CameraCapture from "@/components/kiosk/CameraCapture";
import { useKioskStore } from "@/stores/useKioskStore";
import { useCreateOrSaveVisit } from "@/features/kiosks/queries/kiosks.queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Page() {
  const router = useRouter();
  const store = useKioskStore();
  const create = useCreateOrSaveVisit();
  const [uploaded, setUploaded] = useState<boolean>(false);

  const handleUpload = (url: string) => {
    useKioskStore.getState().setImageUrl(url);
    setUploaded(true);
  };

  const onSubmit = () => {
    const payload: any = {
      visit_type_id: store.visitType?.id,
      session_key: store.sessionKey,
      is_final: true,
      visitor: store.visitor,
      form_data: store.formData,
    };

    if (store.imageUrl) {
      if (
        typeof store.imageUrl === "string" &&
        store.imageUrl.startsWith("data:")
      ) {
        payload.image_base64 = store.imageUrl;
      } else {
        payload.image_url = store.imageUrl;
      }
    }

    console.log("payload", payload);

    create.mutate(payload, {
      onSuccess: (data: any) => {
        store.setVisitId(data.visit_id ?? null);
        store.setQrCode(data.qr_code ?? null);
        store.setSessionKey(data.session_key ?? null);
        router.push("/kiosk/checkin/success");
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <div className="flex flex-col gap-12 items-center w-full">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-display italic text-primary mb-6">
            VisitNa!
          </h1>
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-display text-foreground">
              Smile for the camera
            </h2>
            <p className="text-muted-foreground">
              Take a quick photo to complete your check-in.
            </p>
          </div>
        </div>

        {/* Camera Card */}
        <Card className="w-full max-w-md rounded-2xl border-2 border-primary/20 shadow-sm">
          <CardContent className="flex flex-col items-center gap-6 p-6">
            <CameraCapture onUpload={handleUpload} onChange={() => {}} />

            <div className="flex gap-3 w-full mt-2">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => router.back()}
              >
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={onSubmit}
                disabled={!uploaded && !store.imageUrl}
              >
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
