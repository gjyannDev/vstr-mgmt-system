"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useFetchVisitTypes } from "@/features/kiosks/queries/kiosks.queries";
import { useGetKioskMe } from "@/features/auth/queries/auth.queries";

export default function Page() {
  const router = useRouter();
  const { data: kioskData } = useGetKioskMe();

  // Prefer kiosk-provided location_id; fall back to env only if it's a real value
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

  const { data, isLoading, isError } = useFetchVisitTypes(locationId);

  const visitTypes = (data as any)?.rows ?? [];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-bold italic text-primary mb-4">
          VisitNa!
        </h1>
        <h2 className="text-2xl font-bold text-gray-800">Welcome to Example</h2>
        <p className="text-gray-500 mt-1">Choose any from below to start.</p>
      </div>

      {/* Visit Type Cards */}
      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : isError ? (
        <p className="text-red-400">Error loading visit types.</p>
      ) : visitTypes.length === 0 ? (
        <p className="text-gray-500">No visit types found.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {visitTypes.map((vt: any) => (
            <button
              key={vt.id}
              onClick={() => router.push(`/kiosk/checkin/form/${vt.id}`)}
              className="flex flex-col items-center justify-center w-44 h-44 rounded-2xl border-2 border-[#A8C8EE] bg-white hover:bg-[#EBF3FB] hover:border-[#6FA3D8] transition-all duration-200 shadow-sm"
            >
              {/* Placeholder icon area */}
              <div className="w-16 h-16 rounded-full bg-[#D6E8F7] flex items-center justify-center mb-3">
                <span className="text-2xl text-[#6FA3D8]">✦</span>
              </div>
              <span className="text-[#6FA3D8] font-semibold text-base">
                {vt.name}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Footer */}
      <p className="mt-16 text-sm text-gray-400">
        Powered by <span className="text-[#6FA3D8] font-medium">VisitNa.</span>
      </p>
    </div>
  );
}
