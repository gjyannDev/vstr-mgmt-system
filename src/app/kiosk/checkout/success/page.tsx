"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.push("/kiosk/start"), 2000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md border-none shadow-none bg-transparent focus-visible:ring-0">
        <CardContent className="p-0 text-center">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-2">
              <h1 className="text-5xl font-display tracking-tight">Checkout</h1>
              <p className="font-sanstext-md text-muted-foreground leading-relaxed">
                The visitor has been checked out.
              </p>
            </div>

            <div className="w-full">
              <Card>
                <CardContent className="p-6 text-center">
                  <h2 className="text-2xl font-bold mb-2">
                    Checkout successful
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Returning to kiosk start…
                  </p>
                  <div className="flex justify-center">
                    <Button onClick={() => router.push("/kiosk/start")}>
                      Return now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
