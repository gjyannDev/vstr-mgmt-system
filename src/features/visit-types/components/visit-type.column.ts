import React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import type { VisitType } from "@/features/visit-types/schemas/visit-type.schemas";
import VisitTypeDropDown from "@/features/visit-types/components/VisitTypeDropDown";

const EMPTY_VALUE = "-";

export const visitTypeColumns: ColumnDef<VisitType>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.original.name,
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
      React.createElement(VisitTypeDropDown, { visitType: row.original }),
  },
];
