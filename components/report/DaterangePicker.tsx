import * as React from "react";
import { addDays, addWeeks, addMonths, format, startOfDay, endOfDay } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { DateRange } from "react-day-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";

interface DatePickerProps {
  className?: React.HTMLAttributes<HTMLDivElement>;
  date: DateRange | { from?: Date; to?: Date } | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

export function DatePickerWithRange({ className, date, setDate }: DatePickerProps) {
  const handleLastDay = () => {
    const lastDay = startOfDay(addDays(new Date(), -1));
    const toDay = startOfDay(new Date());
    setDate({ from: lastDay, to: toDay });
  };

  const handleLastWeek = () => {
    const lastWeek = { from: startOfDay(addDays(new Date(), -7)), to: startOfDay(new Date()) };
    setDate(lastWeek);
  };

  const handleLastMonth = () => {
    const lastMonth = { from: startOfDay(addMonths(new Date(), -1)), to: startOfDay(new Date()) };
    setDate(lastMonth);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y HH:mm")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-col gap-2">
                <DropdownMenu>
                  <div className="mt-3 ml-2 mr-2 border rounded-sm">
                    <DropdownMenuTrigger className="flex justify-between w-5/6 items-center m-2 ml-[20px] text-sm ">Select date<ChevronDown/></DropdownMenuTrigger>
                  </div>
                  <DropdownMenuContent className="ml-1 w-[260px]">
                    <DropdownMenuItem onClick={handleLastDay}>Last Day</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLastWeek}>Last Week</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLastMonth}>Last Month</DropdownMenuItem>
                  </DropdownMenuContent>
              </DropdownMenu>
            {/* <Select>
                <SelectTrigger className="w-auto">
                    <SelectValue placeholder="Select a date fillter" />
                </SelectTrigger>
                <SelectContent className="flex flex-col">
                    <SelectGroup className="flex flex-col">
                      <Button variant="ghost" onClick={handleLastDay}>Last Day</Button>
                      <Button variant="ghost" onClick={handleLastWeek}>Last Week</Button>
                      <Button variant="ghost" onClick={handleLastMonth}>Last Month</Button>
                    </SelectGroup>
                </SelectContent>
            </Select> */}
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date as DateRange}
              onSelect={setDate}
              disabled={date?.from}
              
            //   numberOfMonths={2}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
