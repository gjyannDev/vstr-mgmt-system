"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  expiresAt?: string | null;
}

export default function Countdown({ expiresAt }: CountdownProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!expiresAt)
    return <span className="text-sm text-muted-foreground">-</span>;

  const end = new Date(expiresAt).getTime();
  if (Number.isNaN(end))
    return <span className="text-sm text-muted-foreground">-</span>;

  const diff = end - now;
  if (diff <= 0)
    return <span className="text-sm text-destructive">Expired</span>;

  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  return (
    <span className="font-mono text-sm">
      {minutes}:{String(seconds).padStart(2, "0")}
    </span>
  );
}
