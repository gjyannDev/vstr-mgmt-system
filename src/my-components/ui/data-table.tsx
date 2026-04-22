"use client";

import { ErrorAlert } from "@/my-components/ui/ErrorAlert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyStateSmallPage } from "@/my-components/ui/EmptyStateSmallPage";
import type { Table as RTTable } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { List } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DataTableProps<TData> {
  table: RTTable<TData>;
  noDataMessage?: string;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRowClick?: (row: TData) => void;
}

export function DataTable<TData>({
  table,
  noDataMessage,
  isLoading = false,
  isError = false,
  errorMessage,
  onRowClick,
}: DataTableProps<TData>) {
  const colSpan = table.getAllColumns().length;

  const renderBody = () => {
    // Loading state
    if (isLoading) {
      const widthPattern = ["w-3/4", "w-1/2", "w-2/3", "w-5/6", "w-1/3"];
      return (
        <>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i} className="hover:bg-transparent">
              {Array.from({ length: colSpan }).map((_, j) => (
                <TableCell
                  key={j}
                  className="px-3 py-3 border-b border-gray-200 last:border-r-0"
                >
                  <Skeleton
                    className={`h-6 ${widthPattern[(i + j) % widthPattern.length]} rounded-md`}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </>
      );
    }

    // Error state
    if (isError) {
      return (
        <TableRow>
          <TableCell
            colSpan={colSpan}
            className="h-32 border-b border-gray-200 px-3"
          >
            <ErrorAlert message={errorMessage} />
          </TableCell>
        </TableRow>
      );
    }

    // Empty state
    if (!table.getRowModel().rows.length) {
      return (
        <TableRow>
          <TableCell
            colSpan={colSpan}
            className="h-32 text-center border-b border-gray-200"
          >
            <EmptyStateSmallPage
              icon={List}
              title={noDataMessage ? "No Data Found" : "No Results Found"}
              description={
                noDataMessage ??
                "Try adjusting your filters or search criteria."
              }
              className="border-none"
            />
          </TableCell>
        </TableRow>
      );
    }

    // Data rows
    return table.getRowModel().rows.map((row) => (
      <Tooltip key={row.id}>
        <TooltipTrigger asChild>
          <TableRow
            key={row.id}
            data-state={row.getIsSelected() && "selected"}
            className={`hover:bg-gray-50 transition-colors${onRowClick ? " cursor-pointer" : ""}`}
            onClick={() => onRowClick?.(row.original)}
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell
                key={cell.id}
                className="px-3 py-3 text-sm text-gray-700 text-left border-b border-gray-200 last:border-r-0"
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        </TooltipTrigger>
        {onRowClick && (
          <TooltipContent side="top">
            <p>Click to view details</p>
          </TooltipContent>
        )}
      </Tooltip>
    ));
  };

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden bg-background">
      <Table>
        {/* ===== TABLE HEADER ===== */}
        <TableHeader className="bg-background-rev">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="px-3 py-3 text-sm font-semibold text-gray-700 text-left border-b border-gray-200 last:border-r-0"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        {/* ===== TABLE BODY ===== */}
        <TableBody>{renderBody()}</TableBody>
      </Table>
    </div>
  );
}
