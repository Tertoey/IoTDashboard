"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RestroomData = {
    timestamp: string; // Assuming timestamp is a string in ISO 8601 format
    M_totalUser: number;
    M_tissueLevel: number;
    M_ammonia: number;
    M_temp: number;
    M_humidity: number;
    F_totalUser: number;
    F_tissueLevel: number;
    F_ammonia: number;
    F_temp: number;
    F_humidity: number;
    D_totalUser: number;
    D_tissueLevel: number;
    D_ammonia: number;
    D_temp: number;
    D_humidity: number;
  };

export const columns: ColumnDef<RestroomData>[] = [
  {
    accessorKey: "timestamp",
    header: "Timestamp",
  },
  {
    accessorKey: "M_temp",
    header: "M Temperature",
  },
  {
    accessorKey: "M_humidity",
    header: "M Humidity",
  },
  {
    accessorKey: "M_totalUser",
    header: "M TotalUser",
  },
  {
    accessorKey: "M_tissueLevel",
    header: "M TissueLevel",
  },
  {
    accessorKey: "M_ammonia",
    header: "M Ammonia",
  },
  {
    accessorKey: "F_temp",
    header: "F Temperature",
  },
  {
    accessorKey: "F_humidity",
    header: "F Humidity",
  },
  {
    accessorKey: "F_totalUser",
    header: "F TotalUser",
  },
  {
    accessorKey: "F_tissueLevel",
    header: "F TissueLevel",
  },
  {
    accessorKey: "F_ammonia",
    header: "F Ammonia",
  },
  {
    accessorKey: "D_temp",
    header: "D Temperature",
  },
  {
    accessorKey: "D_humidity",
    header: "D Humidity",
  },
  {
    accessorKey: "D_totalUser",
    header: "D TotalUser",
  },
  {
    accessorKey: "D_tissueLevel",
    header: "D TissueLevel",
  },
  {
    accessorKey: "D_ammonia",
    header: "D Ammonia",
  },
]
