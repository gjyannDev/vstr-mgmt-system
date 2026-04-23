import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md border-none shadow-none bg-transparent focus-visible:ring-0">
        <CardContent className="p-0 text-center">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-6">
              {/* Header */}
              <div className="flex flex-col gap-2">
                <h1 className="text-5xl font-display tracking-tight">
                  Kiosk Activated
                </h1>
                <p className="font-sanstext-md text-muted-foreground leading-relaxed">
                  Activation complete. This kiosk is now connected to its
                  assigned location.
                </p>
              </div>

              {/* Illustration */}
              <div className="flex flex-col gap-6 justify-center items-center">
                <img
                  src="/images/completed_icon.svg"
                  alt="Kiosk"
                  className="w-80 h-auto"
                />
                <p className="font-sans text-base">
                  Activation successful. You may now proceed.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Link href="/kiosk/start">
                <Button className="w-full h-12" size="lg">
                  Start Kiosk
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
