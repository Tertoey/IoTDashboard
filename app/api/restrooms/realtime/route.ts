import { NextResponse } from "next/server"
import prismadb from "@/lib/prismadb";

type Data = {
    tokenKey: string;
    data:{
        timestamp: string
        M_totalUser: number | string
        M_tissueLevel: number | string
        M_ammonia:number | string
        M_temp:number | string
        M_humidity:number | string
        F_totalUser:number | string
        F_tissueLevel:number | string
        F_ammonia:number | string
        F_temp:number | string
        F_humidity:number | string
        D_totalUser:number | string
        D_tissueLevel:number | string
        D_ammonia:number | string
        D_temp:number | string
        D_humidity:number | string
    }
}

const restroom:Data["data"] = {
    timestamp:"Loading",
    M_totalUser:"Loading",
    M_tissueLevel:"Loading",
    M_ammonia:"Loading",
    M_temp:"Loading",
    M_humidity:"Loading",
    F_totalUser:"Loading",
    F_tissueLevel:"Loading",
    F_ammonia:"Loading",
    F_temp:"Loading",
    F_humidity:"Loading",
    D_totalUser:"Loading",
    D_tissueLevel:"Loading",
    D_ammonia:"Loading",
    D_temp:"Loading",
    D_humidity:"Loading",
}




export async function POST(req:Request){
    try{
        const data:Data = await req.json();
        console.log(data)
        if(data.tokenKey !== 'ev01eAiez0QiLjDhcce4jsKG51VBO2ATdpxCo2TFDfohs9f62WC1IhgA7WmwiIKx'){
            return NextResponse.json({message:"key not found"})
        }
        Object.assign(restroom,data.data)
        return NextResponse.json({restroom})
    }catch(error){
        console.log(error);
    }
}

export async function GET(res:Response){
    return NextResponse.json({restroom})
}

// setInterval(() => {
//     const date = new Date()
//     console.log(date,restroom,"test") // Fetch data every 10 seconds
// }, 60000)