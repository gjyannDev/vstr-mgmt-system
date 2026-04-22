"use client";

import Link from "next/link";
import { useGetLocationsSimple } from "@/features/locations/queries/location.queries";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

export default function MyLocationsPage() {
  const { data } = useGetLocationsSimple({ search: undefined });

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
              <BreadcrumbPage>My Locations</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.rows?.map((loc: any) => {
          const address = loc.address_line1
            ? loc.address_line1
            : [loc.city, loc.state].filter(Boolean).join(" ");

          return (
            <Card
              key={loc.id}
              className="border-0 shadow-md bg-background rounded-2xl"
            >
              <CardHeader className="flex flex-col items-center text-center gap-1 pb-2 pt-6">
                <div className="h-14 w-14 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold shrink-0">
                  {loc.name?.charAt(0) ?? "L"}
                </div>

                <CardTitle className="text-xl font-bold text-foreground">
                  {loc.name}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground font-normal">
                  {address ?? "No address"}
                </CardDescription>
              </CardHeader>

              <CardFooter className="flex justify-center pt-4 pb-6 border-none">
                <Link href={`/admin/my-locations/${loc.id}`}>
                  <Button
                    size="sm"
                    className="rounded-md h-10 px-16 text-white font-sans shadow-none border-0"
                  >
                    Manage
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
