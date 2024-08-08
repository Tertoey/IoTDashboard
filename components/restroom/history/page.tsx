"use client";

import axios from "axios";
import { ReloadIcon } from "@radix-ui/react-icons";
import "../../../app/globals.css";
import { DatePickerWithRange } from "@/components/report/DaterangePicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFemale,
  faFileExport,
  faMale,
  faSearch,
  faWheelchair,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { RestroomData } from "@/components/layout/Columns";
import { Pagination } from "@mui/material";

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

function convertToCSV(data: RestroomData[]) {
  const header = [
    "Timestamp",
    "Male User",
    "Male Tissue",
    "Male Ammonia",
    "Male Temperature",
    "Male Humidity",
    "Female User",
    "Female Tissue",
    "Female Ammonia",
    "Female Temperature",
    "Female Humidity",
    "Disabled User",
    "Disabled Tissue",
    "Disabled Ammonia",
    "Disabled Temperature",
    "Disabled Humidity",
  ];
  const sumOfM_totalUser = data.reduce(
    (acc, curr) => acc + curr.M_totalUser,
    0
  );
  const sumOfF_totalUser = data.reduce(
    (acc, curr) => acc + curr.F_totalUser,
    0
  );
  const sumOfD_totalUser = data.reduce(
    (acc, curr) => acc + curr.D_totalUser,
    0
  );
  const csvContent = [
    header.join(","),
    ...data?.map(
      (item: RestroomData) =>
        `${item.timestamp.replace("T", " ").replace(/\.\d{3}Z$/, "")},${
          item.M_totalUser
        },${item.M_tissueLevel}%,${item.M_ammonia} ppm,${item.M_temp} C,${
          item.M_humidity
        }%,${item.F_totalUser},${item.F_tissueLevel}%,${item.F_ammonia} ppm,${
          item.F_temp
        } C,${item.F_humidity}%,${item.D_totalUser},${item.D_tissueLevel}%,${
          item.D_ammonia
        } ppm,${item.D_temp} C,${item.D_humidity}%`
    ),
    "",
    `Total Male user`,
    `${sumOfM_totalUser}`,
    `Total Female user`,
    `${sumOfF_totalUser}`,
    `Total Disabled user`,
    `${sumOfD_totalUser}`,
  ].join("\n");

  return csvContent;
}

const itemsPerPage = 6;

const RestroomHistory = () => {
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

  function ExportToCSV() {
    if (report.length > 0) {
      const date = form.watch("date");
      const DateTo = new Date(date.to);
      const DateFrom = new Date(date.from);
      DateTo.setHours(DateTo.getHours() + 7);
      DateFrom.setHours(DateFrom.getHours() + 7);
      const isoDateTo = DateTo.toISOString().slice(0, 10);
      const isoDateFrom = DateFrom.toISOString().slice(0, 10);
      const csvContent = convertToCSV(report);
      const blob = new Blob([csvContent], { type: "text/csv" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      // link.download = `${report[report.length - 1].timestamp.slice(0, 10)} to ${report[0].timestamp.slice(0, 10)} Report`;
      link.download = `${isoDateFrom} to ${isoDateTo} Report`;
      link.click();
    }
  }

  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (event: any, page: any) => {
    setCurrentPage(page);
  };
  const pageCount = Math.ceil(report.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;
  const currentItems = report.slice(startIndex, endIndex);
  return (
    <div className="flex flex-col mt-4">
      <div className="flex flex-row">
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitDate)}>
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-4 items-end text-lg">
                      History Report
                      <FormMessage />
                    </div>
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
                          <Button
                            variant="default"
                            type="submit"
                            className="ml-3"
                          >
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
        </div>
        <div className="flex items-end">
          {report.length > 0 ? (
            <>
              <Button variant="default" className="ml-3" onClick={ExportToCSV}>
                <FontAwesomeIcon icon={faFileExport} className="mr-1" />
                Export to Excel
              </Button>
            </>
          ) : (
            <>
              <Button disabled className="ml-3">
                <FontAwesomeIcon className="mr-1" icon={faFileExport} />
                Export to Excel
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="mt-2 flex flex-col">
        {/* {report?.length > 0 && <div className='border border-white rounded-md'>
                    <DataTable columns={columns} data={report}/>
                    </div>} */}
        <div className="flex flex-row mt-4 border border-black rounded-t-md">
          <div className="w-1/5 text-center font-bold p-5 border-r border-black">
            Timestamp
          </div>
          <div className="w-4/5 text-center font-bold border-black p-5">
            Data
          </div>
        </div>
        <div className="max-h-[800px] overflow-auto">
          {currentItems.length > 0 ? (
            <>
              {currentItems.map((res, index) => (
                <div
                  className="flex flex-row border border-black border-t-transparent"
                  key={index}
                >
                  <div className="w-1/5 text-center self-center p-5">
                    {res.timestamp.replace("T", " ").replace(/\.\d{3}Z$/, "")}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-x-8 p-5 w-4/5 overflow-hidden border-l border-black">
                    <div className="flex justify-center">
                      <FontAwesomeIcon
                        className="text-lg text-blue-600 mr-1"
                        icon={faMale}
                      />{" "}
                      Total User:{" "}
                      <a className="text-blue-600 ml-1">
                        {res.M_totalUser} person
                      </a>
                    </div>
                    <div className="flex justify-center">
                      <FontAwesomeIcon
                        className="text-lg text-blue-600 mr-1"
                        icon={faMale}
                      />{" "}
                      Tissue Level:{" "}
                      <a className="text-blue-600 ml-1">
                        {res.M_tissueLevel} %
                      </a>
                    </div>
                    <div className="flex justify-center">
                      <FontAwesomeIcon
                        className="text-lg text-blue-600 mr-1"
                        icon={faMale}
                      />{" "}
                      Ammonia:{" "}
                      <a className="text-blue-600 ml-1">{res.M_ammonia} ppm</a>
                    </div>
                    <div className="flex justify-center">
                      <FontAwesomeIcon
                        className="text-lg text-blue-600 mr-1"
                        icon={faMale}
                      />{" "}
                      Temperature:{" "}
                      <a className="text-blue-600 ml-1">{res.M_temp} °C</a>
                    </div>
                    <div className="flex justify-center">
                      <FontAwesomeIcon
                        className="text-lg text-blue-600 mr-1"
                        icon={faMale}
                      />{" "}
                      Humidity:{" "}
                      <a className="text-blue-600 ml-1">{res.M_humidity} %</a>
                    </div>
                    <div className="flex justify-center">
                      <FontAwesomeIcon
                        className="text-lg text-pink-600 mr-1"
                        icon={faFemale}
                      />{" "}
                      Total User:{" "}
                      <a className="text-blue-600 ml-1">
                        {res.F_totalUser} person
                      </a>
                    </div>
                    <div className="flex justify-center">
                      <FontAwesomeIcon
                        className="text-lg text-pink-600 mr-1"
                        icon={faFemale}
                      />{" "}
                      Tissue Level:{" "}
                      <a className="text-blue-600 ml-1">
                        {res.F_tissueLevel} %
                      </a>
                    </div>
                    <div className="flex justify-center">
                      <FontAwesomeIcon
                        className="text-lg text-pink-600 mr-1"
                        icon={faFemale}
                      />{" "}
                      Ammonia:{" "}
                      <a className="text-blue-600 ml-1">{res.F_ammonia} ppm</a>
                    </div>
                    <div className="flex justify-center">
                      <FontAwesomeIcon
                        className="text-lg text-pink-600 mr-1"
                        icon={faFemale}
                      />{" "}
                      Temperature:{" "}
                      <a className="text-blue-600 ml-1">{res.F_temp} °C</a>
                    </div>
                    <div className="flex justify-center">
                      <FontAwesomeIcon
                        className="text-lg text-pink-600 mr-1"
                        icon={faFemale}
                      />{" "}
                      Humidity:{" "}
                      <a className="text-blue-600 ml-1">{res.F_humidity} %</a>
                    </div>
                    <div className="flex justify-center">
                      <FontAwesomeIcon
                        className="text-sm self-center mr-1"
                        icon={faWheelchair}
                      />{" "}
                      Total User:{" "}
                      <a className="text-blue-600 ml-1">
                        {res.D_totalUser} person
                      </a>
                    </div>
                    <div className="flex justify-center">
                      <FontAwesomeIcon
                        className="text-sm self-center mr-1"
                        icon={faWheelchair}
                      />{" "}
                      Tissue Level:{" "}
                      <a className="text-blue-600 ml-1">
                        {res.D_tissueLevel} %
                      </a>
                    </div>
                    <div className="flex justify-center">
                      <FontAwesomeIcon
                        className="text-sm self-center mr-1"
                        icon={faWheelchair}
                      />{" "}
                      Ammonia:{" "}
                      <a className="text-blue-600 ml-1">{res.D_ammonia} ppm</a>
                    </div>
                    <div className="flex justify-center">
                      <FontAwesomeIcon
                        className="text-sm self-center mr-1"
                        icon={faWheelchair}
                      />{" "}
                      Temperature:{" "}
                      <a className="text-blue-600 ml-1">{res.D_temp} °C</a>
                    </div>
                    <div className="flex justify-center">
                      <FontAwesomeIcon
                        className="text-sm self-center mr-1"
                        icon={faWheelchair}
                      />{" "}
                      Humidity:{" "}
                      <a className="text-blue-600 ml-1">{res.D_humidity} %</a>
                    </div>
                  </div>
                </div>
              ))}
              {pageCount > 1 && (
                <div className="flex justify-center mt-4">
                  <Pagination
                    count={pageCount}
                    page={currentPage}
                    onChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="my-10 flex justify-center">
              No data available for this period.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestroomHistory;
