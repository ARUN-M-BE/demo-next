import React from "react";
import { cn } from "../utils/cn";

export interface TableColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string;
  emptyMessage?: string;
  className?: string;
}

/**
 * Responsive data table using UI Astra surface and border tokens.
 */
export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "No records found.",
  className,
}: TableProps<T>) {
  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-2xl border border-grayscale-border bg-card scrollbar-thin",
        className
      )}
    >
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-grayscale-border bg-grayscale-surface-subtle">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-3 text-xs font-semibold uppercase tracking-wider text-grayscale-textIcon-caption",
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-grayscale-border">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-sm text-grayscale-textIcon-body"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={keyExtractor(row, idx)}
                className="transition-colors hover:bg-grayscale-surface-subtle/60"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-4 py-3.5 text-grayscale-textIcon-title",
                      col.className
                    )}
                  >
                    {col.render
                      ? col.render(row)
                      : String(row[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
