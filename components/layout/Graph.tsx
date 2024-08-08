"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import "../../app/globals.css";
import moment from "moment";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import { useCallback, useEffect, useState } from "react";
import { DatePickerWithRange } from "../report/DaterangePicker";
import { RestroomData } from "./Columns";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
const formSchema = z.object({
  // date: z.object(
  //   {
  //     from: z.date(),
  //     to: z.date(),
  //   },
  //   {
  //     message: "Date Range is required",
  //   }
  // ),
  field: z.string().min(1, {
    message: "Field is required",
  }),
});

export default function Graph() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [graph, setGraph] = useState<RestroomData[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmitDate(value: z.infer<typeof formSchema> | any) {
    const field = value.field;
    const DateTo = new Date();
    const DateFrom = new Date();
    DateTo.setHours(DateTo.getHours() + 7);
    DateFrom.setHours(DateFrom.getHours() - 100);
    const isoDateTo = DateTo.toISOString();
    const isoDateFrom = DateFrom.toISOString();
    setLoading(true);
    if (!!field) {
      const result = await axios.get(
        `/api/restrooms/graph?date=${isoDateFrom},${isoDateTo}&value=${field}`
      );
      const data = result.data.result;
      const lineData = data.map((item: RestroomData) => {
        const date = new Date(item.timestamp);
        date.setHours(date.getHours() + 7);
        const timestamp = date
          .toISOString()
          .replace("T", " ")
          .replace(/\.\d{3}Z$/, "")
          .slice(0, 19);
        return { ...item, Timestamp: timestamp };
      });
      setGraph(lineData);
      toast({
        variant: "success",
        description: "Success",
      });
      setLoading(false);
    } else {
      toast({
        variant: "destructive",
        description: "Please fill date filter",
      });
    }
  }
  const fetchGraphRealtime = useCallback(async () => {
    const a = form.watch("field");
    try {
      const DateTo = new Date();
      const DateFrom = new Date();
      DateTo.setHours(DateTo.getHours() + 7);
      DateFrom.setHours(DateFrom.getHours() - 100);
      const isoDateTo = DateTo.toISOString();
      const isoDateFrom = DateFrom.toISOString();
      if (a === undefined) {
        const result = await axios.get(
          `/api/restrooms/graph?date=${isoDateFrom},${isoDateTo}&value=M_temp,F_temp,D_temp`
        );
        const data = result.data.result;
        const lineData = data.map((item: RestroomData) => {
          const date = new Date(item.timestamp);
          date.setHours(date.getHours() + 7);
          const timestamp = date
            .toISOString()
            .replace("T", " ")
            .replace(/\.\d{3}Z$/, "")
            .slice(0, 19);
          return { ...item, Timestamp: timestamp };
        });
        setGraph(lineData);
      } else {
        const result = await axios.get(
          `/api/restrooms/graph?date=${isoDateFrom},${isoDateTo}&value=${a}`
        );
        const data = result.data.result;
        const lineData = data.map((item: RestroomData) => {
          const date = new Date(item.timestamp);
          date.setHours(date.getHours() + 7);
          const timestamp = date
            .toISOString()
            .replace("T", " ")
            .replace(/\.\d{3}Z$/, "")
            .slice(0, 19);
          return { ...item, Timestamp: timestamp };
        });
        setGraph(lineData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchGraphRealtime();
    const intervalId = setInterval(() => {
      fetchGraphRealtime();
    }, 10000); // 10000 milliseconds = 10 seconds
    // Clear the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchGraphRealtime]);

  return (
    <div className="mt-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitDate)}>
          <div className="flex flex-row mt-2 gap-2">
            {/* <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <div>
                    <DatePickerWithRange
                      date={field.value}
                      setDate={field.onChange}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name="field"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Temperature" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="M_totalUser,F_totalUser,D_totalUser">
                        Total user
                      </SelectItem>
                      <SelectItem value="M_tissueLevel,F_tissueLevel,D_tissueLevel">
                        Tissue Level
                      </SelectItem>
                      <SelectItem value="M_ammonia,F_ammonia,D_ammonia">
                        Ammonia
                      </SelectItem>
                      <SelectItem value="M_temp,F_temp,D_temp">
                        Temperature
                      </SelectItem>
                      <SelectItem value="M_humidity,F_humidity,D_humidity">
                        Humidity
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {loading ? (
              <>
                <Button disabled className="ml-3">
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> Please
                  wait
                </Button>
              </>
            ) : (
              <>
                <Button variant="default" type="submit" className="ml-3">
                  <FontAwesomeIcon className="mr-1" icon={faSearch} />
                  Search
                </Button>
              </>
            )}
          </div>
        </form>
      </Form>
      {graph.length === 0 ? (
        <div className="flex flex-row mt-3">
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          <p className="text-gray-500">Please wait...</p>
        </div>
      ) : (
        <div className="flex justify-center mx-5 mt-3">
          <ApexChart
            type="line"
            options={{
              chart: {
                id: "apexchart-example",
                toolbar: {
                  show: false,
                },
                foreColor: "#ffffff",
              },
              xaxis: {
                type: "datetime",
                categories: graph.map(
                  (item: any) => item[Object.keys(item)[4]]
                ),
                title: {
                  text: "Timestamp",
                },
                max: new Date(
                  new Date().getTime() + 7 * 60 * 60 * 1000
                ).getTime(),
                min: new Date(
                  new Date().getTime() - 100 * 60 * 60 * 1000
                ).getTime(),
                tickAmount: 15,
              },
              stroke: {
                curve: "smooth",
              },
              markers: {
                size: 1,
              },
              yaxis: {
                min: 0,
                max: 100,
                title: {
                  text: "Data",
                },
              },
              title: {
                text: "Data Last 24 Hrs",
                align: "left",
              },
              legend: {
                position: "top",
                horizontalAlign: "center",
                floating: true,
                offsetY: -25,
                offsetX: -5,
              },
              tooltip: {
                x: {
                  format: "dd MMM HH:mm",
                },
              },
            }}
            series={[
              {
                name: `${Object.keys(graph[0])[1]}`,
                data: graph.map((item: any) => item[Object.keys(item)[1]]),
              },
              {
                name: `${Object.keys(graph[0])[2]}`,
                data: graph.map((item: any) => item[Object.keys(item)[2]]),
              },
              {
                name: `${Object.keys(graph[0])[3]}`,
                data: graph.map((item: any) => item[Object.keys(item)[3]]),
              },
            ]}
            height={350}
            width={1800}
          />
        </div>
      )}
    </div>
  );
}
