import React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import type { Kiosk } from "@/features/kiosks/schemas/kiosk.schemas";
import KioskActions from "@/features/kiosks/components/KioskActions.client";
import Countdown from "@/features/kiosks/components/Countdown.client";

const EMPTY_VALUE = "-";

export const kioskColumns: ColumnDef<Kiosk>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: "id",
    header: "Kiosk ID",
    cell: ({ row }) => row.original.id.split("-")[0],
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const cls =
        status === "active"
          ? "text-green-600 font-medium"
          : "text-muted-foreground";

      return <span className={cls}>{status ?? EMPTY_VALUE}</span>;
    },
  },
  {
    accessorKey: "visit_types",
    header: "Visit Types",
    cell: ({ row }) => {
      const vts = row.original.visit_types;
      const vtNames =
        vts && vts.length > 0
          ? vts.map((t: any) => t.name).join(", ")
          : row.original.visit_type_ids &&
              row.original.visit_type_ids.length > 0
            ? row.original.visit_type_ids
                .map((id: string) => String(id).split("-")[0])
                .join(", ")
            : EMPTY_VALUE;

      return <span className="text-sm">{vtNames}</span>;
    },
  },
  {
    accessorKey: "last_seen_at",
    header: "Last seen",
    cell: ({ row }) => {
      const dateStr = row.original.last_seen_at;
      if (!dateStr)
        return <span className="text-sm text-muted-foreground">-</span>;
      const date = new Date(dateStr);
      return Number.isNaN(date.getTime()) ? (
        <span className="text-sm text-muted-foreground">-</span>
      ) : (
        <span className="text-sm">{date.toLocaleString()}</span>
      );
    },
  },
  {
    id: "active_code_expires_at",
    header: "Active code expiry",
    cell: ({ row }) =>
      React.createElement(Countdown, {
        expiresAt: row.original.active_code_expires_at,
      }),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) =>
      React.createElement(KioskActions, { kiosk: row.original }),
  },
];
