"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function QBOTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "deadline", desc: false }, // Default sort by deadline ascending
  ]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead 
                    key={header.id}
                    className="font-semibold"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No QBOs found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end p-2">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <div className="flex-1">
            <span className="font-medium">SUM</span>
          </div>
          <div className="flex items-center">
            {/* Calculate sum of points */}
            <span className="font-medium">
              {data.reduce((sum, item: any) => sum + (item.points || 0), 0)}
            </span>
          </div>
          <div className="flex-1">
            <span className="font-medium">AVERAGE</span>
          </div>
          <div className="flex items-center">
            {/* Calculate average progress */}
            <span className="font-medium">
              {data.length > 0 
                ? (data.reduce((sum, item: any) => {
                    const beginValue = item.beginningValue || 0;
                    const currentValue = item.currentValue || 0;
                    const targetValue = item.targetValue || 1;
                    let progress = 0;
                    if (targetValue !== beginValue) {
                      progress = ((currentValue - beginValue) / (targetValue - beginValue)) * 100;
                    }
                    return sum + progress;
                  }, 0) / data.length).toFixed(2) + '%'
                : '0%'
              }
            </span>
          </div>
          <div className="flex-1">
            <span className="font-medium">AVERAGE</span>
          </div>
        </div>
      </div>
    </div>
  );
}