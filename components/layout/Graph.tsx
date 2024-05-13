import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
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
import {
  faBell,
  faFemale,
  faFileExport,
  faMale,
  faRestroom,
  faRunning,
  faSearch,
  faThermometerHalf,
  faToilet,
  faToiletPaper,
  faWheelchair,
} from "@fortawesome/free-solid-svg-icons";

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const xLabels = [
  "Page A",
  "Page B",
  "Page C",
  "Page D",
  "Page E",
  "Page F",
  "Page G",
];

const formSchema = z.object({
  date: z.object(
    {
      from: z.date(),
      to: z.date(),
    },
    {
      message: "Date Range is required",
    }
  ),
});

export default function Graph() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<RestroomData[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  function onSubmitDate(value: z.infer<typeof formSchema> | any) {
    const DateTo = new Date(value.date.to);
    const DateFrom = new Date(value.date.from);
    DateTo.setHours(DateTo.getHours() + 7);
    DateFrom.setHours(DateFrom.getHours() + 7);
    const isoDateTo = DateTo.toISOString();
    const isoDateFrom = DateFrom.toISOString();
    console.log(value.date.to, value.date.from, isoDateTo, isoDateFrom);
    setLoading(true);
    if (!!isoDateFrom && !!isoDateTo) {
      axios
        .get(`/api/restrooms/db?date=${isoDateFrom},${isoDateTo}`)
        .then((result: any) => {
          toast({
            variant: "success",
            description: "Success",
          });
          setReport(result.data.result);
          // console.log(result.data.result,report)
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          toast({
            variant: "destructive",
            description: "Something went wrong",
          });
          setLoading(false);
        });
    } else {
      toast({
        variant: "destructive",
        description: "Please fill date filter",
      });
    }
  }
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitDate)}>
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="mt-4">
                <div className="flex flex-row">
                  <DatePickerWithRange
                    date={field.value}
                    setDate={field.onChange}
                  />
                  {loading ? (
                    <>
                      <Button disabled className="ml-3">
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Please wait
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
              </FormItem>
            )}
          />
        </form>
      </Form>
      <LineChart
        width={500}
        height={300}
        series={[
          { data: pData, label: "pv" },
          { data: uData, label: "uv" },
        ]}
        xAxis={[{ scaleType: "point", data: xLabels }]}
      />
    </div>
  );
}
