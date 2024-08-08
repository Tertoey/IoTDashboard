import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const dateString = searchParams.get("date");
  const valueString = searchParams.get("value");
  const date: string[] = dateString ? dateString.split(",") : [];
  const value: string[] = valueString ? valueString.split(",") : [];

  // Constructing the select object to specify which values to retrieve
  const select: any = { timestamp: true };
  value.forEach((val) => {
    select[val] = true;
  });

  const data = await prismadb.restroom.findMany({
    where: {
      timestamp: {
        gte: date[0],
        lte: date[1],
      },
    },
    orderBy: {
      timestamp: "asc", // Ordering by timestamp in descending order
    },
    select, // Include the select object to specify the fields to retrieve
  });

  return NextResponse.json({
    datebetween: `${date[0]} to ${date[1]}`,
    result: data,
  });
}
