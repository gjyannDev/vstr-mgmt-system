import { ColumnDef } from "@tanstack/react-table";
import { AdminUser } from "@/features/users/schemas/users.schemas";
import React from "react";
import AdminDropDown from "@/features/users/components/AdminDropDown";

export const userColumns: ColumnDef<AdminUser>[] = [
  {
    accessorKey: "full_name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
  },
  // TODO: Add actions column for edit/delete
  {
    id: "actions",
    header: "",
    cell: ({ row }) =>
      React.createElement(AdminDropDown, {
        admin: row.original,
      }),
  },
];
