'use client'

import { MapPin, User } from "lucide-react";
import { ModeToggle } from "../theme-toggle";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation";

const Navbar = () => {
    const router = useRouter()
    return ( 
        <div className="flex flex-row right-2">
            <ModeToggle/>
            {/* <div className="text-sm">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MapPin/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push('/')}>
                    Home
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/restroom')}>
                    Restroom
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            </div>
            <div className="text-sm">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <div className="avatar rounded-full h-8 w-8 bg-emerald-500 flex justify-center items-center">
                            GG
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push('/')}>
                    Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            </div> */}
        </div>
     );
}
 
export default Navbar;