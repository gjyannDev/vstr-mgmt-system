"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import React from "react";

interface EmptyStateSmallProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
  navigateString?: string;
  buttonText?: string;
}

export function EmptyStateSmallPage({
  icon: Icon,
  title,
  description,
  children,
  className = "",
  navigateString,
  buttonText,
}: EmptyStateSmallProps) {
  const router = useRouter();
  return (
    <div
      className={`flex flex-col items-center justify-center gap-12 rounded-md border border-dashed p-24 text-center ${className}`}
    >
      <div className="flex items-center justify-center rounded-full">
        <Icon className="h-28 w-28 text-muted-foreground" />{" "}
      </div>
      <div className="flex flex-col gap-12 items-center">
        <div className="flex flex-col gap-0">
          <h3 className="font-display text-lg">{title}</h3>
          <p className="text-sm text-black-secondary max-w-[360px]">
            {description}
          </p>
          {children}
        </div>
        {buttonText && navigateString && (
          <Button
            type="button"
            size="sm"
            onClick={() => router.push(navigateString)}
          >
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
}
