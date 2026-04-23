"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useKioskStore } from "@/stores/useKioskStore";
import { useCreateOrSaveVisit } from "@/features/kiosk/queries/kiosk.queries";
import { Button } from "@/components/ui/button";

export default function Page() {
  const store = useKioskStore();
  const router = useRouter();
  const create = useCreateOrSaveVisit();

  const onSubmit = () => {
    const payload: any = {
      visit_type_id: store.visitType?.id,
      session_key: store.sessionKey,
      is_final: true,
      visitor: store.visitor,
      form_data: store.formData,
      image_url: store.imageUrl,
    };

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
    <div className="p-4">
      <h2 className="text-2xl mb-4">Preview</h2>
      <div className="space-y-3">
        <div>
          <strong>Name:</strong> {store.visitor?.full_name}
        </div>
        <div>
          <strong>Email:</strong> {store.visitor?.email}
        </div>
        <div>
          <strong>Phone:</strong> {store.visitor?.phone}
        </div>
        <div>
          <strong>Form:</strong>
          <pre className="bg-muted p-2 rounded">
            {JSON.stringify(store.formData, null, 2)}
          </pre>
        </div>
        {store.imageUrl && (
          <img
            src={store.imageUrl}
            alt="preview"
            className="w-40 h-40 object-cover rounded"
          />
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <Button onClick={() => router.back()} variant="ghost">
          Back
        </Button>
        <Button onClick={onSubmit} disabled={(create as any).isPending}>
          {(create as any).isPending ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </div>
  );
}
