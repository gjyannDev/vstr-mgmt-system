"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGetKioskMe } from "@/features/auth/queries/auth.queries";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

export default function Page() {
  const { data: kioskData } = useGetKioskMe();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      {/* Header */}
      <div className="flex flex-col gap-12">
        <div className="text-center">
          <h1 className="text-8xl font-display italic text-primary mb-6">
            VisitNa!
          </h1>
          <div className="flex flex-col gap">
            <h2 className="text-3xl font-display text-foreground">
              Welcome to Hotel
            </h2>
            <p className="text-muted-foreground">
              Choose any from below to start.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <Button asChild size="lg" className="w-full text-lg py-6 rounded-lg">
            <Link href="/kiosk/checkin/select">
              <ArrowUpRight className="mr-2 h-5 w-5" />
              Check In
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="secondary"
            className="w-full text-lg py-6 rounded-lg"
          >
            <Link href="/kiosk/checkout">
              <ArrowDownLeft className="mr-2 h-5 w-5" />
              Check Out
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <p className="absolute bottom-8 text-sm text-muted-foreground">
        Powered by <span className="text-primary font-medium">VisitNa.</span>
      </p>
    </div>
  );
}
