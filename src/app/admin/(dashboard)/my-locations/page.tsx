"use client";

import Link from "next/link";
import { useGetLocationsSimple } from "@/features/locations/queries/location.queries";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MyLocationsPage() {
  const { data } = useGetLocationsSimple({ search: undefined });

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-lg font-display mb-4">My Locations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.rows?.map((loc: any) => (
          <Card key={loc.id} className="border">
            <CardHeader>
              <CardTitle>{loc.name}</CardTitle>
              <CardDescription>
                {loc.city ?? ""} {loc.state ? `• ${loc.state}` : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end">
                <Link href={`/admin/my-locations/${loc.id}`}>
                  <Button>Manage</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
