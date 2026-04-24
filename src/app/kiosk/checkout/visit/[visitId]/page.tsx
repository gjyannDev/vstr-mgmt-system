"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useGetVisitById,
  useCheckoutVisit,
} from "@/features/kiosks/queries/kiosks.queries";
import { useMutationCallbacks } from "@/hooks/use-mutation-callbacks";

export default function Page() {
  const params = useParams();
  const rawVisitId = params?.visitId;
  const visitId = Array.isArray(rawVisitId)
    ? rawVisitId[0]
    : typeof rawVisitId === "string"
      ? rawVisitId
      : undefined;
  const router = useRouter();

  const { data: visit, isLoading, isError } = useGetVisitById(visitId);

  const { mutateAsync: checkoutMutateAsync, status: checkoutStatus } =
    useCheckoutVisit();
  const isCheckingOut = checkoutStatus === "pending";

  const { buildCallbacks } = useMutationCallbacks({ entityName: "Visit" });

  const handleCheckout = async () => {
    if (!visitId) return;
    try {
      await checkoutMutateAsync(visitId);
      const subject =
        typeof visit?.visitor?.full_name === "string"
          ? visit.visitor.full_name
          : visitId;
      buildCallbacks("change", subject).onSuccess();
      router.push("/kiosk/checkout/success");
    } catch (err) {
      const subject =
        typeof visit?.visitor?.full_name === "string"
          ? visit.visitor.full_name
          : (visitId ?? "");
      buildCallbacks("change", subject).onError(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md border-none shadow-none bg-transparent focus-visible:ring-0">
        <CardContent className="p-0 text-center">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-5xl font-display tracking-tight">
                Check-out
              </h1>
              <p className="font-sanstext-md text-muted-foreground leading-relaxed">
                Enter the visitor card code to lookup and check them out.
              </p>
            </div>

            {isLoading ? (
              <p>Loading...</p>
            ) : isError || !visit ? (
              <p className="text-sm text-red-600">Visit not found.</p>
            ) : (
              <Card className="w-full">
                <CardContent>
                  <h3 className="font-bold">
                    {visit?.visitor?.full_name ??
                      visit.visit?.visitor_id ??
                      "Visitor"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {visit?.visitor?.company ?? ""}
                  </p>
                  <p className="mt-2">Status: {visit.visit?.status}</p>
                  <div className="mt-12 flex flex-col gap-2 justify-center">
                    <Button
                      onClick={handleCheckout}
                      size="lg"
                      disabled={isCheckingOut}
                      className="px-6 py-5"
                    >
                      {isCheckingOut ? "Checking out..." : "Confirm Checkout"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={() => router.push("/kiosk/checkout")}
                      className="px-6 py-5"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
