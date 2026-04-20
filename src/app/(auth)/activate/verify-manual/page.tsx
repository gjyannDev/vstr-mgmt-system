"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useKioskActivate } from "@/features/auth/queries/auth.queries";
import {
  kioskActivationSchema,
  type KioskActivationValues,
} from "@/features/auth/schemas/auth.schema";
import { useMutationCallbacks } from "@/hooks/use-mutation-callbacks";
import { TextField } from "@/my-components/shared/form/TextField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function Page() {
  const router = useRouter();
  const activateKioskMutation = useKioskActivate();
  const { buildCallbacks } = useMutationCallbacks({
    entityName: "Kiosk",
  });

  const form = useForm<KioskActivationValues>({
    resolver: zodResolver(kioskActivationSchema),
    defaultValues: {
      code: "",
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = form;

  const onSubmit = (data: KioskActivationValues) => {
    activateKioskMutation.mutate(
      {
        code: data.code,
      },
      buildCallbacks("change", "Activation", {
        successMessage: "Kiosk activated successfully.",
        errorMessage: "Activation failed.",
        onSuccess: () => {
          router.replace("/activate/success");
        },
      }),
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md border-none shadow-none bg-transparent focus-visible:ring-0">
        <CardContent className="p-0 text-center">
          <div className="flex flex-col gap-12">
            {/* Header */}
            <div className="flex flex-col gap-2">
              <h1 className="text-5xl font-display tracking-tight">
                Activate Kiosk
              </h1>
              <p className="font-sanstext-md text-muted-foreground leading-relaxed">
                Enter the activation code provided by your administrator to link
                this device to a location.
              </p>
            </div>

            {/* Actions */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4 text-left"
              noValidate
            >
              <TextField
                name="code"
                label="Activation Code"
                placeholder="Enter code"
                register={register}
                registerOptions={{
                  setValueAs: (value) =>
                    typeof value === "string"
                      ? value.trim().toUpperCase()
                      : value,
                }}
                error={errors.code?.message}
                autoComplete="one-time-code"
              />
              <Button
                className="w-full"
                size="lg"
                disabled={activateKioskMutation.isPending}
              >
                {activateKioskMutation.isPending ? "Activating..." : "Activate"}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
