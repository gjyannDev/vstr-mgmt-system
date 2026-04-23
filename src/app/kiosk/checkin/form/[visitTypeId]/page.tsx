"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import DynamicForm from "@/components/kiosk/DynamicForm";
import CameraCapture from "@/components/kiosk/CameraCapture";
import { useKioskStore } from "@/stores/useKioskStore";
import {
  useCreateOrSaveVisit,
  useFetchVisitTypeById,
} from "@/features/kiosk/queries/kiosk.queries";
import { Button } from "@/components/ui/button";

export default function Page() {
  const params = useParams() as Record<string, string>;
  const visitTypeId = params?.visitTypeId;
  const locationId = process.env.NEXT_PUBLIC_KIOSK_LOCATION_ID ?? "";
  const kioskStore = useKioskStore();
  const router = useRouter();
  const createMutation = useCreateOrSaveVisit();

  const { data, isLoading, isError } = useFetchVisitTypeById(
    locationId,
    visitTypeId,
  );
  const visitType = (data as any)?.visit_type ?? null;

  const onSubmit = (formData: Record<string, any>) => {
    const visitor = {
      full_name: formData.full_name || kioskStore.visitor.full_name,
      email: formData.email || kioskStore.visitor.email,
      phone: formData.phone || kioskStore.visitor.phone,
    };

    const payload: any = {
      visit_type_id: visitTypeId,
      is_final: true,
      visitor,
      form_data: formData,
    };

    if (kioskStore.imageUrl) payload.image_url = kioskStore.imageUrl;

    createMutation.mutate(payload, {
      onSuccess: (data: any) => {
        kioskStore.setVisitId(data.visit_id ?? null);
        kioskStore.setSessionKey(data.session_key ?? null);
        kioskStore.setQrCode(data.qr_code ?? null);
        router.push("/kiosk/checkin/success");
      },
    });
  };

  if (isLoading) return <p>Loading visit type…</p>;
  if (isError) return <p>Error loading visit type.</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Check‑in: {visitType.name}</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <DynamicForm
            formFields={visitType.form_fields ?? []}
            onSubmit={onSubmit}
          />
        </div>
        {visitType.is_camera_active && (
          <div>
            <CameraCapture
              onUpload={(url) => useKioskStore.getState().setImageUrl(url)}
              onChange={() => {}}
            />
          </div>
        )}
      </div>

      <div className="mt-4">
        <Button
          onClick={() => {
            // simple preview route (not implemented) — placeholder
            router.push("/kiosk/checkin/preview");
          }}
        >
          Preview
        </Button>
      </div>
    </div>
  );
}
