"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "next/navigation";
import { useGetLocationById } from "@/features/locations/queries/location.queries";
import VisitTypesTable from "@/features/visit-types/components/VisitTypesTable";

export default function LocationDetailsPage() {
  const params = useParams();
  const locationId = params?.locationId as string;

  const { data } = useGetLocationById(locationId);

  const location = data?.location;
  const address = location
    ? [location.address_line1, location.city, location.state]
        .filter(Boolean)
        .join(", ")
    : undefined;

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-lg font-display">{location?.name ?? "Location"}</h2>
        <p className="text-sm text-muted-foreground">{address}</p>
      </div>

      <Tabs defaultValue="visit-types" className="w-full flex flex-col">
        <TabsList className="w-fit mb-4 flex gap-12">
          <TabsTrigger value="visit-types">Visit Types</TabsTrigger>
          <TabsTrigger value="kiosk">Kiosk</TabsTrigger>
        </TabsList>

        <TabsContent value="visit-types" className="w-full">
          <VisitTypesTable locationId={locationId} />
        </TabsContent>
        <TabsContent value="kiosk" className="w-full">
          <h1>Kiosk Management</h1>
        </TabsContent>
      </Tabs>
    </div>
  );
}
