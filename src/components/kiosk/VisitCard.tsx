"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";

const QRCode = dynamic(() => import("react-qr-code"), { ssr: false }) as any;

type Props = {
  name?: string;
  company?: string;
  imageUrl?: string | null;
  qrPayload?: string | null;
};

export default function VisitCard({
  name,
  company,
  imageUrl,
  qrPayload,
}: Props) {
  return (
    <Card className="max-w-sm">
      <CardContent className="p-4 flex flex-col items-center gap-3">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="visitor"
            className="w-24 h-24 rounded-full object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-muted/60" />
        )}

        <div className="text-center">
          <h3 className="text-lg font-bold">{name}</h3>
          {company && (
            <p className="text-sm text-muted-foreground">{company}</p>
          )}
        </div>

        {qrPayload && (
          <div className="bg-white p-2">
            <QRCode value={qrPayload} size={128} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
