import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import fl1 from "@/image/image.png";

const RestroomStatus = () => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
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
        <div>{status.disabledRoom ? <>In Use</> : <>Vacant</>}</div>
      </div>
    </div>
  );
};

export default RestroomStatus;
