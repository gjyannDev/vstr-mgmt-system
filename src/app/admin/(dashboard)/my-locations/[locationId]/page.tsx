"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "next/navigation";
import { useGetLocationById } from "@/features/locations/queries/location.queries";
import VisitTypesTable from "@/features/visit-types/components/VisitTypesTable";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

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

  const tabTriggerClass =
    "p-0 border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-primary transition-colors rounded-none cursor-pointer";

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/admin">Admin</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/admin/my-locations">My Locations</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{location?.name ?? "Location"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h2 className="text-lg font-display mt-2">
          {location?.name ?? "Location"}
        </h2>
        <p className="text-sm text-muted-foreground">{address}</p>
      </div>

      <Tabs defaultValue="visit-types" className="w-full flex flex-col">
        <TabsList className="flex gap-6 bg-transparent justify-start border-none shadow-none p-0 mb-4">
          <TabsTrigger value="visit-types" className={tabTriggerClass}>
            Visit Types
          </TabsTrigger>
          <TabsTrigger value="kiosk" className={tabTriggerClass}>
            Kiosk
          </TabsTrigger>
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
