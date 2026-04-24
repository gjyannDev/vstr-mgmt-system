"use client";

import { useRouter } from "next/navigation";
import { useFetchVisitTypes } from "@/features/kiosks/queries/kiosks.queries";
import { useGetKioskMe } from "@/features/auth/queries/auth.queries";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  UserRound,
  Wrench,
  HardHat,
  PackageOpen,
  Truck,
  BadgeCheck,
  Briefcase,
  Users,
  ShieldCheck,
  HandshakeIcon,
  LucideIcon,
} from "lucide-react";

const VISIT_TYPE_ICONS: { keywords: string[]; icon: LucideIcon }[] = [
  { keywords: ["guest", "visitor", "visit"], icon: UserRound },
  { keywords: ["maintenance", "repair", "technician"], icon: Wrench },
  { keywords: ["contractor", "construction", "builder"], icon: HardHat },
  { keywords: ["delivery", "courier", "parcel", "package"], icon: Truck },
  { keywords: ["supplier", "vendor"], icon: PackageOpen },
  { keywords: ["interview", "applicant", "candidate"], icon: Briefcase },
  { keywords: ["meeting", "partner", "client"], icon: HandshakeIcon },
  { keywords: ["staff", "employee", "team"], icon: Users },
  { keywords: ["vip", "official", "executive"], icon: BadgeCheck },
  { keywords: ["security", "guard", "inspector"], icon: ShieldCheck },
];

function getVisitTypeIcon(name: string): LucideIcon {
  const lower = name.toLowerCase();
  for (const { keywords, icon } of VISIT_TYPE_ICONS) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return icon;
    }
  }
  return UserRound; // default fallback
}

export default function Page() {
  const router = useRouter();
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

  const { data, isLoading, isError } = useFetchVisitTypes(locationId);
  const visitTypes = (data as any)?.rows ?? [];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <div className="flex flex-col gap-12 items-center w-full">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-8xl font-display italic text-primary mb-6">
            VisitNa!
          </h1>
          <div className="flex flex-col gap-2">
            <div className="text-center">
              <p className="text-3xl font-display text-foreground">
                Welcome to
              </p>
              <p className="text-3xl font-display text-foreground">
                {kioskData?.kiosk?.location?.name ?? "our kiosk"}!
              </p>
            </div>
            <p className="text-muted-foreground">
              Choose any from below to start.
            </p>
          </div>
        </div>

        {/* Visit Type Cards */}
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Spinner />
          </div>
        ) : isError ? (
          <p className="text-destructive">Error loading visit types.</p>
        ) : visitTypes.length === 0 ? (
          <p className="text-muted-foreground">No visit types found.</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {visitTypes.map((vt: any) => {
              const Icon = getVisitTypeIcon(vt.name);
              return (
                <Card
                  key={vt.id}
                  onClick={() => router.push(`/kiosk/checkin/form/${vt.id}`)}
                  className="w-44 h-44 rounded-2xl border-2 border-primary/20 hover:border-primary/60 hover:bg-secondary/50 cursor-pointer transition-all duration-200 shadow-sm"
                >
                  <CardContent className="flex flex-col items-center justify-center h-full gap-3 p-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-12 h-12 text-primary" />
                    </div>
                    <span className="text-primary font-semibold text-base text-center">
                      {vt.name}
                    </span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="absolute bottom-8 text-sm text-muted-foreground">
        Powered by <span className="text-primary font-medium">VisitNa.</span>
      </p>
    </div>
  );
}
