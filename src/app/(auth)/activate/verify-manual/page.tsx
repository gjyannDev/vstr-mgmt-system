"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TextField } from "@/my-components/shared/form/TextField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { activationSchema } from "@/features/auth/schemas/auth.schema";

export default function Page() {
  const form = useForm<z.infer<typeof activationSchema>>({
    resolver: zodResolver(activationSchema),
    defaultValues: {
      activationCode: "",
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = (data: z.infer<typeof activationSchema>) => {
    console.log("Activation code:", data.activationCode);
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
                name="activationCode"
                label="Activation Code"
                placeholder="Enter code"
                register={register}
                error={errors.activationCode?.message}
                autoComplete="one-time-code"
              />
              <Button className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Activating..." : "Activate"}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
