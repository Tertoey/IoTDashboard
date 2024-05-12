import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
    try{
        const body = await req.json();
        if(body.tokenKey !== 'ev01eAiez0QiLjDhcce4jsKG51VBO2ATdpxCo2TFDfohs9f62WC1IhgA7WmwiIKx'){
            return NextResponse.json({message:"key not found"})
        }
        const restroom = await prismadb.restroom.create({
            data:{
                ...body.data
            }
        })
        return NextResponse.json(restroom)
    }catch(error){
        console.log(`Error at api/restroom/db ${error}`);
    }
}

export async function GET(req:Request){
    const { searchParams } = new URL(req.url);
    const dateString  = searchParams.get("date");
    const date:string[] = dateString ? dateString.split(',') : []
    const data = await prismadb.restroom.findMany({
        where:{
            timestamp:{
                gte:date[0],
                lte:date[1]
            }
        },
        orderBy: {
            timestamp: 'desc' // Ordering by timestamp in descending order
        }
    })
    console.log(data)
    return NextResponse.json({datebetween:`${date[0]} to ${date[1]}`,result:data})
}