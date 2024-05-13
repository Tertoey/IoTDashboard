"use client";

import axios from "axios";
import { ReloadIcon } from "@radix-ui/react-icons";
import "../globals.css";
import { DatePickerWithRange } from "@/components/report/DaterangePicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faFemale,
  faFileExport,
  faList,
  faMale,
  faRestroom,
  faRunning,
  faSearch,
  faThermometerHalf,
  faToilet,
  faToiletPaper,
  faWheelchair,
} from "@fortawesome/free-solid-svg-icons";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCallback, useEffect, useState } from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { ChevronFirst, Droplets } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DataTable } from "@/components/layout/DataTable";
import { RestroomData, columns } from "@/components/layout/Columns";
import { Pagination } from "@mui/material";
import Navbar from "@/components/layout/Navbars";
import { Separator } from "@/components/ui/separator";
import Graph from "../../components/layout/Graph";
import { useNavContext } from "@/context/Navcontext";

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

const Restroom = () => {
  // const [date, setDate]:any = useState<DateRange | undefined >()
  const { isNavOpen, setIsNavOpen } = useNavContext();
  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
    console.log(isNavOpen);
  };
  // useEffect(() => {
  //   if (isNavOpen) {
  //     document.addEventListener("click", toggleNav);
  //   }
  //   return () => {
  //     document.removeEventListener("click", toggleNav);
  //   };
  // }, [isNavOpen]); // Re-run effect when isNavOpen changes

  const { toast } = useToast();
  const [status, setStatus] = useState({
    Mroom1: false,
    Mroom2: false,
    Mroom3: false,
    Mroom4: false,
    Froom1: false,
    Froom2: false,
    Froom3: false,
    Froom4: false,
    leak1: false,
    leak2: false,
    disabledRoom: false,
    emergency: false,
  });
  const [realtime, setRealtime] = useState({
    timestamp: "Loading",
    M_totalUser: "Loading",
    M_tissueLevel: "Loading",
    M_ammonia: "Loading",
    M_temp: "Loading",
    M_humidity: "Loading",
    F_totalUser: "Loading",
    F_tissueLevel: "Loading",
    F_ammonia: "Loading",
    F_temp: "Loading",
    F_humidity: "Loading",
    D_totalUser: "Loading",
    D_tissueLevel: "Loading",
    D_ammonia: "Loading",
    D_temp: "Loading",
    D_humidity: "Loading",
  });
  const [page, setPage] = useState("Status");
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

  const fetchDataStatus = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:3000/api/restrooms/status"
      );
      setStatus(response.data.status);
      console.log(response.data.status);
    } catch (error) {
      console.log("Error fetching data from api/restroom/status", error);
    }
  }, []);

  const fetchDataRealtime = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:3000/api/restrooms/realtime"
      );
      setRealtime(response.data.restroom);
      console.log(response.data.restroom);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchDataStatus();
    fetchDataRealtime();
    const intervalId = setInterval(() => {
      fetchDataRealtime();
      fetchDataStatus(); // Fetch data every 10 seconds
    }, 5000); // 10000 milliseconds = 10 seconds
    // Clear the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchDataStatus, fetchDataRealtime]);

  return (
    <div className={`flex flex-col ${isNavOpen && "blur-sm"}`}>
      <div>
        <div className="flex flex-row items-center px-5 gap-2">
          <Button
            variant="ghost"
            size="icon"
            className=" border-none"
            onClick={toggleNav}
          >
            <FontAwesomeIcon className="w-7 h-7" icon={faList} />
          </Button>
          <FontAwesomeIcon className="w-10 h-10" icon={faRestroom} />
          <div className="font-bold text-2xl">Smart Restroom</div>
          <div className="grow">
            <Tabs defaultValue="Status" className="w-[400px]">
              <TabsList>
                <TabsTrigger onClick={() => setPage("Status")} value="Status">
                  Status
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => setPage("Realtime Data")}
                  value="Realtime Data"
                >
                  Realtime Data
                </TabsTrigger>
                <TabsTrigger onClick={() => setPage("Report")} value="Report">
                  Report
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <Navbar />
        </div>
        <Separator className="mt-3 text-white" />
      </div>
      <div className="px-5 overflow-auto">
        {page === "Status" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 ">
            <div className="flex flex-col gap-6">
              <div>{status.Mroom1 ? <>In Use</> : <>Vacant</>}</div>
              <div>{status.Mroom2 ? <>In Use</> : <>Vacant</>}</div>
              <div>{status.Mroom3 ? <>In Use</> : <>Vacant</>}</div>
              <div>{status.Mroom4 ? <>In Use</> : <>Vacant</>}</div>
            </div>
            <div className="flex-1 flex flex-col gap-6">
              <div>{status.Froom1 ? <>In Use</> : <>Vacant</>}</div>
              <div>{status.Froom2 ? <>In Use</> : <>Vacant</>}</div>
              <div>{status.Froom3 ? <>In Use</> : <>Vacant</>}</div>
              <div>{status.Froom4 ? <>In Use</> : <>Vacant</>}</div>
            </div>
            <div>
              <div>{status.disabledRoom ? <>In Use</> : <>Vacant</>}</div>
            </div>
          </div>
        )}
        {page === "Realtime Data" && (
          <>
            <div className="flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 mt-4">
                <div className="RealtimeCardgradient">
                  <div className="CardIcon">
                    <FontAwesomeIcon
                      className="w-16 h-16 text-blue-600"
                      icon={faRunning}
                    />
                  </div>
                  <div className="CardTextLayout">
                    <div className="flex justify-center my-2">TOTAL USERS</div>
                    <div className="flex justify-center my-2 items-center">
                      {realtime.M_totalUser === "Loading" && (
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {realtime.M_totalUser}{" "}
                      {realtime.M_totalUser !== "Loading" && "Persons"}
                    </div>
                  </div>
                </div>
                <div className="RealtimeCardgradient">
                  <div className="CardIcon">
                    <FontAwesomeIcon
                      className="w-16 h-16 text-blue-600"
                      icon={faToiletPaper}
                    />
                  </div>
                  <div className="CardTextLayout">
                    <div className="flex justify-center my-2">TISSUE LEVEL</div>
                    <div className="flex justify-center my-2 items-center">
                      {realtime.M_tissueLevel === "Loading" && (
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {realtime.M_tissueLevel}{" "}
                      {realtime.M_tissueLevel !== "Loading" && "%"}
                    </div>
                  </div>
                </div>
                <div className="RealtimeCardgradient">
                  <div className="CardIcon">
                    <FontAwesomeIcon
                      className="w-16 h-16 text-blue-600"
                      icon={faToilet}
                    />
                  </div>
                  <div className="CardTextLayout">
                    <div className="flex justify-center my-2">AMMONIA</div>
                    <div className="flex justify-center my-2 items-center">
                      {realtime.M_ammonia === "Loading" && (
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {realtime.M_ammonia}{" "}
                      {realtime.M_ammonia !== "Loading" && "ppm"}
                    </div>
                  </div>
                </div>
                <div className="RealtimeCardgradient">
                  <div className="CardIcon">
                    <FontAwesomeIcon
                      className="w-16 h-16 text-blue-600"
                      icon={faThermometerHalf}
                    />
                  </div>
                  <div className="CardTextLayout">
                    <div className="flex justify-center my-2">TEMPERATURE</div>
                    <div className="flex justify-center my-2 items-center">
                      {realtime.M_temp === "Loading" && (
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {realtime.M_temp} {realtime.M_temp !== "Loading" && "°C"}
                    </div>
                  </div>
                </div>
                <div className="RealtimeCardgradient">
                  <div className="CardIcon">
                    <Droplets className="w-16 h-16 text-blue-600" />
                  </div>
                  <div className="CardTextLayout">
                    <div className="flex justify-center my-2">HUMIDITY</div>
                    <div className="flex justify-center my-2 items-center">
                      {realtime.M_humidity === "Loading" && (
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {realtime.M_humidity}{" "}
                      {realtime.M_humidity !== "Loading" && "%"}
                    </div>
                  </div>
                </div>
                <div className="flex border rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 p-2">
                  <div className="CardIcon">
                    {status.leak1 ? (
                      <>
                        <FontAwesomeIcon
                          className="w-16 h-16 animate-pulse duration-500 text-red-800"
                          icon={faBell}
                        />
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon
                          className="text-green-700 w-16 h-16"
                          icon={faBell}
                        />
                      </>
                    )}
                  </div>
                  <div className="CardTextLayout">
                    <div className="flex justify-center my-2">LEAK1</div>
                    <div className="flex justify-center my-2 items-center">
                      {status.leak1 ? (
                        <div className="text-red-800 animate-bounce">
                          Water Leak
                        </div>
                      ) : (
                        <>Normal</>
                      )}
                    </div>
                  </div>
                </div>
                <div className="RealtimeCardgradient">
                  <div className="CardIcon">
                    <FontAwesomeIcon
                      className="w-16 h-16 text-pink-500"
                      icon={faRunning}
                    />
                  </div>
                  <div className="CardTextLayout">
                    <div className="flex justify-center my-2">TOTAL USERS</div>
                    <div className="flex justify-center my-2 items-center">
                      {realtime.F_totalUser === "Loading" && (
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {realtime.F_totalUser}{" "}
                      {realtime.F_totalUser !== "Loading" && "Persons"}
                    </div>
                  </div>
                </div>
                <div className="RealtimeCardgradient">
                  <div className="CardIcon">
                    <FontAwesomeIcon
                      className="w-16 h-16 text-pink-500"
                      icon={faToiletPaper}
                    />
                  </div>
                  <div className="CardTextLayout">
                    <div className="flex justify-center my-2">TISSUE LEVEL</div>
                    <div className="flex justify-center my-2 items-center">
                      {realtime.F_tissueLevel === "Loading" && (
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {realtime.F_tissueLevel}{" "}
                      {realtime.F_tissueLevel !== "Loading" && "%"}
                    </div>
                  </div>
                </div>
                <div className="RealtimeCardgradient">
                  <div className="CardIcon">
                    <FontAwesomeIcon
                      className="w-16 h-16 text-pink-500"
                      icon={faToilet}
                    />
                  </div>
                  <div className="CardTextLayout">
                    <div className="flex justify-center my-2">AMMONIA</div>
                    <div className="flex justify-center my-2 items-center">
                      {realtime.F_ammonia === "Loading" && (
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {realtime.F_ammonia}{" "}
                      {realtime.F_ammonia !== "Loading" && "ppm"}
                    </div>
                  </div>
                </div>
                <div className="RealtimeCardgradient">
                  <div className="CardIcon">
                    <FontAwesomeIcon
                      className="w-16 h-16 text-pink-500"
                      icon={faThermometerHalf}
                    />
                  </div>
                  <div className="CardTextLayout">
                    <div className="flex justify-center my-2">TEMPERATURE</div>
                    <div className="flex justify-center my-2 items-center">
                      {realtime.F_temp === "Loading" && (
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {realtime.F_temp} {realtime.F_temp !== "Loading" && "°C"}
                    </div>
                  </div>
                </div>
                <div className="RealtimeCardgradient">
                  <div className="CardIcon">
                    <Droplets className="w-16 h-16 text-pink-500" />
                  </div>
                  <div className="CardTextLayout">
                    <div className="flex justify-center my-2">HUMIDITY</div>
                    <div className="flex justify-center my-2 items-center">
                      {realtime.F_humidity === "Loading" && (
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {realtime.F_humidity}{" "}
                      {realtime.F_humidity !== "Loading" && "%"}
                    </div>
                  </div>
                </div>
                <div className="flex border rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 p-2">
                  <div className="CardIcon">
                    {status.leak2 ? (
                      <>
                        <FontAwesomeIcon
                          className="w-16 h-16 animate-pulse duration-500 text-red-800"
                          icon={faBell}
                        />
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon
                          className="text-green-700 w-16 h-16"
                          icon={faBell}
                        />
                      </>
                    )}
                  </div>
                  <div className="CardTextLayout">
                    <div className="flex justify-center my-2">LEAK2</div>
                    <div className="flex justify-center my-2 items-center">
                      {status.leak2 ? (
                        <div className="text-red-800 animate-bounce">
                          Water Leak
                        </div>
                      ) : (
                        <>Normal</>
                      )}
                    </div>
                  </div>
                </div>
                <div className="RealtimeCardgradient">
                  <div className="CardIcon">
                    <FontAwesomeIcon
                      className="text-black w-16 h-16"
                      icon={faRunning}
                    />
                  </div>
                  <div className="CardTextLayout">
                    <div className="flex justify-center my-2">TOTAL USERS</div>
                    <div className="flex justify-center my-2 items-center">
                      {realtime.D_totalUser === "Loading" && (
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {realtime.D_totalUser}{" "}
                      {realtime.D_totalUser !== "Loading" && "Persons"}
                    </div>
                  </div>
                </div>
                <div className="RealtimeCardgradient">
                  <div className="CardIcon">
                    <FontAwesomeIcon
                      className="text-black w-16 h-16"
                      icon={faToiletPaper}
                    />
                  </div>
                  <div className="CardTextLayout">
                    <div className="flex justify-center my-2">TISSUE LEVEL</div>
                    <div className="flex justify-center my-2 items-center">
                      {realtime.D_tissueLevel === "Loading" && (
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {realtime.D_tissueLevel}{" "}
                      {realtime.D_tissueLevel !== "Loading" && "%"}
                    </div>
                  </div>
                </div>
                <div className="RealtimeCardgradient">
                  <div className="CardIcon">
                    <FontAwesomeIcon
                      className="text-black w-16 h-16"
                      icon={faToilet}
                    />
                  </div>
                  <div className="CardTextLayout">
                    <div className="flex justify-center my-2">AMMONIA</div>
                    <div className="flex justify-center my-2 items-center">
                      {realtime.D_ammonia === "Loading" && (
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {realtime.D_ammonia}{" "}
                      {realtime.D_ammonia !== "Loading" && "ppm"}
                    </div>
                  </div>
                </div>
                <div className="RealtimeCardgradient">
                  <div className="CardIcon">
                    <FontAwesomeIcon
                      className="text-black w-16 h-16"
                      icon={faThermometerHalf}
                    />
                  </div>
                  <div className="CardTextLayout">
                    <div className="flex justify-center my-2">TEMPERATURE</div>
                    <div className="flex justify-center my-2 items-center">
                      {realtime.D_temp === "Loading" && (
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {realtime.D_temp} {realtime.D_temp !== "Loading" && "°C"}
                    </div>
                  </div>
                </div>
                <div className="RealtimeCardgradient">
                  <div className="CardIcon">
                    <Droplets className="text-black w-16 h-16" />
                  </div>
                  <div className="CardTextLayout">
                    <div className="flex justify-center my-2">HUMIDITY</div>
                    <div className="flex justify-center my-2 items-center">
                      {realtime.D_humidity === "Loading" && (
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {realtime.D_humidity}{" "}
                      {realtime.D_humidity !== "Loading" && "%"}
                    </div>
                  </div>
                </div>
                <div className="flex border rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 p-2">
                  <div className="CardIcon">
                    {status.emergency ? (
                      <>
                        <FontAwesomeIcon
                          className="w-16 h-16 animate-pulse duration-500 text-red-800"
                          icon={faBell}
                        />
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon
                          className="text-green-700 w-16 h-16"
                          icon={faBell}
                        />
                      </>
                    )}
                  </div>
                  <div className="CardTextLayout">
                    <div className="flex justify-center my-2">EMERGENCY</div>
                    <div className="flex justify-center my-2 items-center">
                      {status.emergency ? (
                        <div className="text-red-800 animate-bounce">
                          Emergency
                        </div>
                      ) : (
                        <>Normal</>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <Graph />
              <div className="flex justify-end">
                Last Update:{" "}
                {realtime.timestamp
                  .replace("T", " ")
                  .replace(/\.\d{3}Z$/, "")
                  .slice(0, 19)}
              </div>
            </div>
          </>
        )}
        {page === "Report" && (
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
                                  <FontAwesomeIcon
                                    className="mr-1"
                                    icon={faSearch}
                                  />
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
                    <Button
                      variant="default"
                      className="ml-3"
                      onClick={ExportToCSV}
                    >
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
                          {res.timestamp
                            .replace("T", " ")
                            .replace(/\.\d{3}Z$/, "")}
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
                            <a className="text-blue-600 ml-1">
                              {res.M_ammonia} ppm
                            </a>
                          </div>
                          <div className="flex justify-center">
                            <FontAwesomeIcon
                              className="text-lg text-blue-600 mr-1"
                              icon={faMale}
                            />{" "}
                            Temperature:{" "}
                            <a className="text-blue-600 ml-1">
                              {res.M_temp} °C
                            </a>
                          </div>
                          <div className="flex justify-center">
                            <FontAwesomeIcon
                              className="text-lg text-blue-600 mr-1"
                              icon={faMale}
                            />{" "}
                            Humidity:{" "}
                            <a className="text-blue-600 ml-1">
                              {res.M_humidity} %
                            </a>
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
                            <a className="text-blue-600 ml-1">
                              {res.F_ammonia} ppm
                            </a>
                          </div>
                          <div className="flex justify-center">
                            <FontAwesomeIcon
                              className="text-lg text-pink-600 mr-1"
                              icon={faFemale}
                            />{" "}
                            Temperature:{" "}
                            <a className="text-blue-600 ml-1">
                              {res.F_temp} °C
                            </a>
                          </div>
                          <div className="flex justify-center">
                            <FontAwesomeIcon
                              className="text-lg text-pink-600 mr-1"
                              icon={faFemale}
                            />{" "}
                            Humidity:{" "}
                            <a className="text-blue-600 ml-1">
                              {res.F_humidity} %
                            </a>
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
                            <a className="text-blue-600 ml-1">
                              {res.D_ammonia} ppm
                            </a>
                          </div>
                          <div className="flex justify-center">
                            <FontAwesomeIcon
                              className="text-sm self-center mr-1"
                              icon={faWheelchair}
                            />{" "}
                            Temperature:{" "}
                            <a className="text-blue-600 ml-1">
                              {res.D_temp} °C
                            </a>
                          </div>
                          <div className="flex justify-center">
                            <FontAwesomeIcon
                              className="text-sm self-center mr-1"
                              icon={faWheelchair}
                            />{" "}
                            Humidity:{" "}
                            <a className="text-blue-600 ml-1">
                              {res.D_humidity} %
                            </a>
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
        )}
      </div>
    </div>
  );
};

export default Restroom;
