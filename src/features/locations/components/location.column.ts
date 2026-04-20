import React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import type { Location } from "@/features/locations/schemas/location.schemas";
import LocationDropDown from "@/features/locations/components/LocationDropDown";

const EMPTY_VALUE = "-";

export const locationColumns: ColumnDef<Location>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => row.original.type ?? EMPTY_VALUE,
  },
  {
    accessorKey: "city",
    header: "City",
    cell: ({ row }) => row.original.city ?? EMPTY_VALUE,
  },
  {
    accessorKey: "state",
    header: "State",
    cell: ({ row }) => row.original.state ?? EMPTY_VALUE,
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      return Number.isNaN(date.getTime())
        ? EMPTY_VALUE
        : date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) =>
      React.createElement(LocationDropDown, {
        location: row.original,
      }),
  },
];
