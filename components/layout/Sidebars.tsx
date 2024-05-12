'use client'

import React, { useState } from "react";
import { Button } from "../ui/button"
import { ChevronFirst, ChevronLast, EllipsisVertical } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { DashboardIcon } from "@radix-ui/react-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faRestroom } from "@fortawesome/free-solid-svg-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import logo from '../../image/logo.png'
import Image from "next/image";
import { Separator } from "../ui/separator";
import { useNavContext } from "@/context/Navcontext";


export default function Sidebars() {
  // const {isNavOpen, setIsNavOpen} = useNavContext()
  const [isNavOpen, setIsNavOpen] = useState(false);
  
  const pathname = usePathname()
  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
    console.log(isNavOpen)
  };
  return (

    <div className={`${isNavOpen ? 'w-[320px]' : 'w-[60px]'} flex flex-col border-r min-h-screen pt-3 duration-100 whitespace-nowrap overflow-hidden`}>
      { isNavOpen ? <div className="mx-2 pl-5 flex flex-col grow">
        {/* <div className="flex flex-row items-center">
            <Image src={logo} className="grow -left-2 relative" width={200} alt="logo"/>
            <Button variant="outline" size="icon" className=" border-none" onClick={toggleNav}>
              <ChevronFirst className="w-12 h-12"/>
            </Button>
        </div> */}
        <div className="flex flex-row items-center mt-3">
            <DashboardIcon  className="font-bold w-8 h-8"/>
            <h2 className="ml-2 text-3xl font-bold grow">Dashboard</h2>
            <Button variant="outline" size="icon" className=" border-none" onClick={toggleNav}>
              <ChevronFirst className="w-12 h-12"/>
            </Button>
        </div>
        <div className="flex flex-col text-lg mt-6">
          <div className={`py-2 flex flex-row items-center gap-3 hover:bg-blue-100 relative -left-3 rounded-md ${pathname === "/restroom" ? 'bg-blue-400 relative -left-3 rounded-md ' : ''}`}>
            <FontAwesomeIcon className={`w-6 h-6 ml-3 `} icon={faRestroom} />
            <a className="hover:underline" href="restroom">Smart Restroom</a>
          </div>
          <div className={`py-2 flex flex-row items-center gap-3 mt-2 hover:bg-blue-100 relative -left-3 rounded-md ${pathname === "/building" ? 'bg-blue-400 rounded-md relative -left-3' : ''}`}>
            <FontAwesomeIcon className={`w-6 h-6 ml-3 `} icon={faBuilding} />
            <a className="hover:underline" href="building">Smart Building</a>
          </div>
        </div>
        </div>:<div className="grow">
        <div className="flex justify-center mt-3">
          <Button variant="outline" size="icon" className="border-none" onClick={toggleNav}>
            <ChevronLast className="w-12 h-12"/>
          </Button>
        </div>
        {/* <div className="flex justify-center mt-12">
            <DashboardIcon  className="font-bold w-6 h-6"/>
        </div> */}
          <div className={`flex justify-center mt-6 py-2 mx-2 hover:bg-blue-100 rounded-md ${pathname === "/restroom" ? 'bg-blue-400 rounded-md ' : ''}`}>
            <a className="hover:underline" href="restroom"><FontAwesomeIcon className="w-6 h-6 flex items-center"  icon={faRestroom} /></a>
          </div>
          <div className={`flex justify-center mt-3 py-2 mx-2 hover:bg-blue-100 rounded-md ${pathname === "/building" ? 'bg-blue-400 rounded-md ' : ''}`}>
            <a className="hover:underline" href="building"><FontAwesomeIcon className="w-6 h-6 flex items-center" icon={faBuilding} /></a>
          </div>
      </div>
      }
      <Separator/>
      {isNavOpen ? 
          <div className="flex flex-row p-3 items-center gap-1">
          <div className="avatar rounded-full h-11 w-10 bg-emerald-500 flex justify-center items-center">
            GG
          </div>
          <div className="flex flex-col text-sm ml-1">
            <span>Tanawat.toey@gmail.com</span>
            <span>Tanawat</span>
          </div>
          <div>
          <Popover>
            <PopoverTrigger><EllipsisVertical/></PopoverTrigger>
            <PopoverContent>Logout</PopoverContent>
          </Popover>
          </div>
          </div>:<div className="p-3 items-center flex justify-center gap-2">
          <Popover>
            <PopoverTrigger>
              <div className="avatar rounded-full h-11 w-10 bg-emerald-500 flex justify-center items-center">
                GG
              </div>
            </PopoverTrigger>
            <PopoverContent>Logout</PopoverContent>
        </Popover>
          </div>}
    </div>
  )
}
