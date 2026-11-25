"use client";

import React from "react";
import { Download, FileSpreadsheet, Printer } from "lucide-react";
import { Dropdown, GlassButton, useToast } from "@/UI";
import { exportToCsv } from "@/lib/utils";
import type { CountryStats } from "../types/analytics";

export interface ExportMenuProps {
  countries: CountryStats[];
}

export function ExportMenu({ countries }: ExportMenuProps) {
  const { toast } = useToast();

  const handleCsvExport = () => {
    exportToCsv(
      "astra-analytics-report.csv",
      countries.map((c) => ({
        Country: c.name,
        Code: c.code,
        Visitors: c.visitors,
        Sessions: c.sessions,
        ConversionRate: `${c.conversionRate}%`,
        Change: `${c.change}%`,
      }))
    );
    toast({
      type: "success",
      title: "CSV Exported",
      description: "Downloaded astra-analytics-report.csv.",
    });
  };

  const handlePrintPdf = () => {
    window.print();
    toast({
      type: "info",
      title: "Print / Save PDF",
      description: "Opened browser print dialog for PDF export.",
    });
  };

  return (
    <Dropdown
      align="right"
      trigger={
        <GlassButton variant="accent" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>
          Export Report
        </GlassButton>
      }
      items={[
        {
          id: "csv",
          label: "Export CSV",
          icon: <FileSpreadsheet className="h-4 w-4 text-emerald-500" />,
          onClick: handleCsvExport,
        },
        {
          id: "pdf",
          label: "Export PDF / Print",
          icon: <Printer className="h-4 w-4 text-cyan-500" />,
          onClick: handlePrintPdf,
        },
      ]}
    />
  );
}
