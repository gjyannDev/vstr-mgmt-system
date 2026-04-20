"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md border-none shadow-none bg-transparent focus-visible:ring-0">
        <CardContent className="p-0 text-center">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              {/* Header */}
              <div className="flex flex-col gap-2">
                <h1 className="text-5xl font-display tracking-tight">
                  Activate Kiosk
                </h1>
                <p className="font-sanstext-md text-muted-foreground leading-relaxed">
                  Enter the activation code provided by your administrator to
                  link this device to a location.
                </p>
              </div>

              {/* Illustration */}
              <div className="mb-8 flex justify-center">
                <img
                  src="/images/activate_icon.svg"
                  alt="Kiosk"
                  className="w-80 h-auto"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button
                className="w-full h-12"
                size="lg"
                onClick={() => router.push("/activate/verify-manual")}
              >
                Manual Input
              </Button>

              <Button variant="outline" className="w-full h-12" size="lg">
                Scan QR Code
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
