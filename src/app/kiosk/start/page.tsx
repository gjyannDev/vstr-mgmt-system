"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/40">
      <Card className="w-full max-w-md text-center">
        <CardContent className="p-8">
          <h1 className="text-4xl font-display mb-4">Welcome</h1>
          <p className="text-muted-foreground mb-6">
            Start check‑in or check‑out
          </p>
          <div className="flex flex-col gap-4">
            <Link href="/kiosk/checkin/select">
              <Button className="w-full" size="lg">
                Check‑in
              </Button>
            </Link>
            <Link href="/kiosk/checkout">
              <Button variant="ghost" className="w-full" size="lg">
                Check‑out
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
