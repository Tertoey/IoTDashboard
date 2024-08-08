"use client";

import "../globals.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faRestroom } from "@fortawesome/free-solid-svg-icons";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbars";
import { Separator } from "@/components/ui/separator";
import { useNavContext } from "@/context/Navcontext";
import RestroomStatus from "@/components/restroom/status/page";
import RestroomRealtime from "@/components/restroom/realtime/page";
import RestroomHistory from "@/components/restroom/history/page";

const Restroom = () => {
  // const [date, setDate]:any = useState<DateRange | undefined >()
  const { isNavOpen, setIsNavOpen } = useNavContext();
  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
    console.log(isNavOpen);
  };
  const [page, setPage] = useState("Status");

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
        {page === "Status" && <RestroomStatus />}
        {page === "Realtime Data" && <RestroomRealtime />}
        {page === "Report" && <RestroomHistory />}
      </div>
    </div>
  );
};

export default Restroom;
