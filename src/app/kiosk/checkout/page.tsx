"use client";

import React, { useState } from "react";
import { kiosksService } from "@/features/kiosks/services/kiosks.services";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function Page() {
  const [code, setCode] = useState("");
  const [visit, setVisit] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const router = useRouter();

  const lookup = async () => {
    setLoading(true);
    try {
      const res = await kiosksService.getVisitByQr(code.trim());
      setVisit(res);
    } catch (err) {
      console.error(err);
      setVisit(null);
    } finally {
      setLoading(false);
    }
  };

  const checkout = async () => {
    if (!visit?.visit?.id) return;
    setCheckingOut(true);
    try {
      await kiosksService.checkoutVisit(visit.visit.id);
      router.push("/kiosk/checkout/success");
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Check‑out</h2>
      <div className="flex gap-2 mb-4">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter card code"
          className="border px-2 py-1 rounded"
        />
        <Button onClick={lookup} disabled={loading || !code.trim()}>
          {loading ? "Looking up..." : "Lookup"}
        </Button>
      </div>

      {visit && (
        <Card>
          <CardContent>
            <h3 className="font-bold">
              {visit.visit?.visitor?.full_name ?? "Visitor"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {visit.visit?.visitor?.company}
            </p>
            <p className="mt-2">Status: {visit.visit?.status}</p>
            <div className="mt-4 flex gap-2">
              <Button onClick={checkout} disabled={checkingOut}>
                {checkingOut ? "Checking out..." : "Confirm Checkout"}
              </Button>
              <Button variant="ghost" onClick={() => setVisit(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
