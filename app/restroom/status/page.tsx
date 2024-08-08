"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import fl1 from "@/public/floor/floor1.png";
import { Home } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const RestroomStatus = () => {
  const [selectedFloor, setSelectedFloor] = useState("Floor 1");
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

  // const { data, isLoading } = useQuery({
  //   queryKey: ["restroomStatus"],
  //   queryFn: () =>
  //     fetch("http://127.0.0.1:3000/api/restrooms/status").then((res) =>
  //       res.json()
  //     ),
  //   refetchInterval: 5000,
  // });

  // if (isLoading) {
  //   return <span>Loading...</span>;
  // }
  const fetchDataStatus = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:3000/api/restrooms/status"
      );
      setStatus(response.data.status);
    } catch (error) {
      console.log("Error fetching data from api/restroom/status", error);
    }
  }, [setStatus]);

  useEffect(() => {
    fetchDataStatus();
    const intervalId = setInterval(() => {
      fetchDataStatus(); // Fetch data every 5 seconds
    }, 5000); // 5000 milliseconds = 5 seconds
    // Clear the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchDataStatus]);

  return (
    <div className="h-[90vh] flex flex-col gap-5">
      <div className="flex flex-row items-center gap-3 ml-3">
        <a href="/restroom">
          <Home />
        </a>
        <Select
          value={selectedFloor}
          onValueChange={(value) => {
            setSelectedFloor(value);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a Floor" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Floor 1">Floor 1</SelectItem>
              <SelectItem value="Floor 2">Floor 2</SelectItem>
              <SelectItem value="Floor 3">Floor 3</SelectItem>
              <SelectItem value="Floor 4">Floor 4</SelectItem>
              <SelectItem value="Floor 5">Floor 5</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {selectedFloor === "Floor 1" && (
        <div className="flex flex-col">
          <div className="flex justify-center">Floor 1</div>
          <div className="flex justify-center">
            <Image src={fl1} alt="FL1" className="object-contain" />
          </div>
          <div
            className={`${
              status.Mroom1 ? "bg-red-600" : "bg-green-600"
            } w-[70px] h-[117px] border-2 border-black opacity-65`}
          ></div>
          {/* <div
            className={`${
              status.Mroom2 ? "bg-red-600" : "bg-green-600"
            } w-[70px] h-[117px] border-2 border-black opacity-65`}
          ></div> */}
          {/* <div
            className={`${
              data.status.Mroom1 ? "bg-red-600" : "bg-green-600"
            } w-[70px] h-[117px] border-2 border-black opacity-65 -top-12 relative `}
          ></div> */}
        </div>
      )}
      {selectedFloor === "Floor 2" && (
        <div className="flex flex-col">
          <div className="flex justify-center">Floor 2</div>
          <div className="flex justify-center">
            {/* <div className="grid grid-cols-4 mt-3">
              <div
                className={`${
                  status.Mroom1 ? "bg-red-600" : "bg-green-600"
                } w-[70px] h-[117px] border-2 border-black opacity-65`}
              ></div>
              <div
                className={`${
                  status.Mroom2 ? "bg-red-600" : "bg-green-600"
                } w-[70px] h-[117px] border-2 border-black opacity-65`}
              ></div>
              <div
                className={`${
                  status.Mroom3 ? "bg-red-600" : "bg-green-600"
                } w-[70px] h-[117px] border-2 border-black opacity-65`}
              ></div>
              <div
                className={`${
                  status.Mroom4 ? "bg-red-600" : "bg-green-600"
                } w-[70px] h-[117px] border-2 border-black opacity-65`}
              ></div>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default RestroomStatus;
