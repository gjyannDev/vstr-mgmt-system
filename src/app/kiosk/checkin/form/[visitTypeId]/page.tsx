"use client";

import { useParams, useRouter } from "next/navigation";
import DynamicForm from "@/components/kiosk/DynamicForm";
import CameraCapture from "@/components/kiosk/CameraCapture";
import { useKioskStore } from "@/stores/useKioskStore";
import {
  useCreateOrSaveVisit,
  useFetchVisitTypeById,
} from "@/features/kiosks/queries/kiosks.queries";
import { useGetKioskMe } from "@/features/auth/queries/auth.queries";

export default function Page() {
  const params = useParams() as Record<string, string>;
  const visitTypeId = params?.visitTypeId;
  const kioskStore = useKioskStore();
  const router = useRouter();
  const createMutation = useCreateOrSaveVisit();

  const { data: kioskData } = useGetKioskMe();

  const envLocation = process.env.NEXT_PUBLIC_KIOSK_LOCATION_ID;
  const defaultLocation =
    envLocation &&
    envLocation !== "REPLACE_WITH_LOCATION_UUID" &&
    !envLocation.includes("REPLACE_WITH")
      ? envLocation
      : undefined;

  const rawLocation = kioskData?.kiosk?.location_id ?? defaultLocation;
  const locationId: string | undefined =
    rawLocation != null ? String(rawLocation) : undefined;

  const { data, isLoading, isError, error } = useFetchVisitTypeById(
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EFF3FA]">
        <p className="text-gray-400">Loading visit type…</p>
      </div>
    );
  }

  if (isError) {
    console.error("useFetchVisitTypeById error:", error);

    let errorMessage = "An unknown error occurred.";
    try {
      const raw = (error as any)?.response?.data ?? error;
      if (raw instanceof Error) {
        errorMessage = raw.message;
      } else if (typeof raw === "string") {
        errorMessage = raw;
      } else {
        errorMessage = JSON.stringify(raw, Object.getOwnPropertyNames(raw), 2);
      }
    } catch {
      errorMessage = String(error);
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EFF3FA]">
        <div className="text-center">
          <p className="text-red-400 font-medium">Error loading visit type.</p>
          <pre className="mt-2 text-xs text-gray-400 whitespace-pre-wrap">
            {errorMessage}
          </pre>
        </div>
      </div>
    );
  }

  if (!visitType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EFF3FA]">
        <div className="text-center">
          <p className="text-gray-600">Visit type data is not available.</p>
          <p className="text-xs text-gray-400 mt-2">
            Ensure kiosk/location is configured and retry.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EFF3FA] flex flex-col items-center px-6 py-10">
      {/* Back button */}
      <div className="w-full max-w-xl mb-2">
        <button
          onClick={() => router.back()}
          className="text-gray-500 hover:text-gray-700 transition-colors text-xl"
        >
          ←
        </button>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold italic text-[#6FA3D8]">VisitNa!</h1>
        <p className="text-gray-600 mt-2 text-base">
          {visitType?.name ?? "Unnamed"} Check - In.
        </p>
      </div>

      {/* Form card */}
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm p-8 flex flex-col gap-6">
        <DynamicForm
          formFields={visitType?.form_fields ?? []}
          onSubmit={onSubmit}
        />

        {visitType?.is_camera_active && (
          <div className="mt-2">
            <CameraCapture
              onUpload={(url) => useKioskStore.getState().setImageUrl(url)}
              onChange={() => {}}
            />
          </div>
        )}

        {/* Submit button */}
        <button
          form="dynamic-form"
          type="submit"
          disabled={createMutation.isPending}
          className="w-full py-3 rounded-xl bg-[#7FB3E0] hover:bg-[#6FA3D8] text-white font-medium text-base transition-colors disabled:opacity-60"
        >
          {createMutation.isPending ? "Submitting…" : "Check In"}
        </button>
      </div>
    </div>
  );
}
