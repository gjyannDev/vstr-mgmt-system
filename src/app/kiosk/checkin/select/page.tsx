"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useFetchVisitTypes } from "@/features/kiosk/queries/kiosk.queries";

export default function Page() {
  const locationId = process.env.NEXT_PUBLIC_KIOSK_LOCATION_ID ?? "";
  const { data, isLoading, isError } = useFetchVisitTypes(locationId);

  const visitTypes = (data as any)?.rows ?? [];

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Select Visit Type</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>Error loading visit types.</p>
      ) : visitTypes.length === 0 ? (
        <p>No visit types found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {visitTypes.map((vt: any) => (
            <Card key={vt.id}>
              <CardContent>
                <h3 className="font-bold">{vt.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {vt.description}
                </p>
                <div className="mt-3">
                  <Link href={`/kiosk/checkin/form/${vt.id}`}>
                    <Button>Select</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
