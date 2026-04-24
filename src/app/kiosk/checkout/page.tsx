"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLookupVisitByIdNumber } from "@/features/kiosks/queries/kiosks.queries";
import { useMutationCallbacks } from "@/hooks/use-mutation-callbacks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { TextField } from "@/my-components/shared/form/TextField";

export default function Page() {
  const { register, handleSubmit, formState } = useForm<{ code: string }>({
    defaultValues: { code: "" },
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const router = useRouter();

  const { buildCallbacks } = useMutationCallbacks({ entityName: "Visit" });
  const { mutateAsync: lookupMutateAsync, status: lookupStatus } =
    useLookupVisitByIdNumber();
  const isLookingUp = lookupStatus === "pending";

  const lookup = async (values: { code: string }) => {
    const code = (values.code ?? "").trim();
    setErrorMessage(null);
    try {
      const res = await lookupMutateAsync(code);

      if (res && res.visit?.id) {
        router.push(`/kiosk/checkout/visit/${res.visit.id}`);
        return;
      }

      const notFoundErr = {
        status: 404,
        message: "Visitor not found for given ID.",
      };
      buildCallbacks("change", code, {
        errorMessage: "Visitor not found",
      }).onError(notFoundErr);
      setErrorMessage("Visitor not found for given ID.");
    } catch (err) {
      console.error(err);
      buildCallbacks("change", code, { errorMessage: "Lookup failed" }).onError(
        err,
      );
      setErrorMessage(
        (err as any)?.message ?? "Visitor not found for given ID.",
      );
    }
  };

  // Checkout handled on the dedicated visit detail page.

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md border-none shadow-none bg-transparent focus-visible:ring-0">
        <CardContent className="p-0 text-center">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-2">
              <h1 className="text-5xl font-display tracking-tight">
                Check‑out
              </h1>
              <p className="font-sanstext-md text-muted-foreground leading-relaxed">
                Enter the visitor card code to lookup and check them out.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(lookup)}
              className="flex flex-col gap-4 text-left"
              noValidate
            >
              <TextField
                name="code"
                label="Card code"
                placeholder="Enter card code"
                register={register}
                error={formState.errors.code?.message as any}
                autoComplete="one-time-code"
              />

              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={isLookingUp}>
                  {isLookingUp ? "Looking up..." : "Lookup"}
                </Button>
              </div>

              {errorMessage && (
                <p className="text-sm text-red-600">{errorMessage}</p>
              )}
            </form>

            {/* Visit details now shown on a dedicated page at /kiosk/checkout/visit/[visitId] */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
