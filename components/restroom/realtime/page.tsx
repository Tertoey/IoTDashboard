import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faRunning,
  faThermometerHalf,
  faToilet,
  faToiletPaper,
} from "@fortawesome/free-solid-svg-icons";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Droplets } from "lucide-react";
import Graph from "@/components/layout/Graph";

const RestroomRealtime = () => {
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
  const fetchDataRealtime = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:3000/api/restrooms/realtime"
      );
      setRealtime(response.data.restroom);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  const fetchDataStatus = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:3000/api/restrooms/status"
      );
      setStatus(response.data.status);
    } catch (error) {
      console.log("Error fetching data from api/restroom/status", error);
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchDataRealtime();
      fetchDataStatus();
    }, 5000); // 10000 milliseconds = 10 seconds
    // Clear the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchDataRealtime, fetchDataStatus]);
  return (
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
                {realtime.M_ammonia} {realtime.M_ammonia !== "Loading" && "ppm"}
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
                {realtime.M_humidity} {realtime.M_humidity !== "Loading" && "%"}
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
                  <div className="text-red-800 animate-bounce">Water Leak</div>
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
                {realtime.F_ammonia} {realtime.F_ammonia !== "Loading" && "ppm"}
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
                {realtime.F_humidity} {realtime.F_humidity !== "Loading" && "%"}
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
                  <div className="text-red-800 animate-bounce">Water Leak</div>
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
                {realtime.D_ammonia} {realtime.D_ammonia !== "Loading" && "ppm"}
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
                {realtime.D_humidity} {realtime.D_humidity !== "Loading" && "%"}
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
                  <div className="text-red-800 animate-bounce">Emergency</div>
                ) : (
                  <>Normal</>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-between mt-4">
          <h3>History Graph</h3>
          <div className="flex justify-end">
            Last Update:{" "}
            {realtime.timestamp
              .replace("T", " ")
              .replace(/\.\d{3}Z$/, "")
              .slice(0, 19)}
          </div>
        </div>
        <div className="h-[440px] grow">
          <Graph />
        </div>
      </div>
    </>
  );
};

export default RestroomRealtime;
