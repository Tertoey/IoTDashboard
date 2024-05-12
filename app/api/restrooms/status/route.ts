// import {useRestroomStatus} from "../../../../hook/restroomStore/store"

import { NextResponse } from "next/server";

type roomStatus = {
    Mroom1: Boolean
    Mroom2: Boolean
    Mroom3: Boolean
    Mroom4: Boolean
    Froom1: Boolean
    Froom2: Boolean
    Froom3: Boolean
    Froom4: Boolean
    leak1: Boolean
    leak2: Boolean
    disabledRoom: Boolean
    emergency: Boolean
}

const RoomStatus:roomStatus = {
    Mroom1:false,
    Mroom2:false,
    Mroom3:false,
    Mroom4:false,
    Froom1:false,
    Froom2:false,
    Froom3:false,
    Froom4:false,
    leak1:false,
    leak2:false,
    disabledRoom: false,
    emergency: false
}

export async function POST(req:Request){
    try{
        const data:roomStatus = await req.json()
        console.log(data);
        if(Object.keys(data).includes('Mroom1')){
            RoomStatus.Mroom1 = data.Mroom1
            return NextResponse.json({message:RoomStatus})
        }
        if(Object.keys(data).includes('Mroom2')){
            RoomStatus.Mroom2 = data.Mroom2
            return NextResponse.json({message:RoomStatus})
        }
        if(Object.keys(data).includes('Mroom3')){
            RoomStatus.Mroom3 = data.Mroom3
            return NextResponse.json({message:RoomStatus})
        }
        if(Object.keys(data).includes('Mroom4')){
            RoomStatus.Mroom4 = data.Mroom4
            return NextResponse.json({message:RoomStatus})
        }
        if(Object.keys(data).includes('Froom1')){
            RoomStatus.Froom1 = data.Froom1
            return NextResponse.json({message:RoomStatus})
        }
        if(Object.keys(data).includes('Froom2')){
            RoomStatus.Froom2 = data.Froom2
            return NextResponse.json({message:RoomStatus})
        }
        if(Object.keys(data).includes('Froom3')){
            RoomStatus.Froom3 = data.Froom3
            return NextResponse.json({message:RoomStatus})
        }
        if(Object.keys(data).includes('Froom4')){
            RoomStatus.Froom4 = data.Froom4
            return NextResponse.json({message:RoomStatus})
        }
        if(Object.keys(data).includes('leak1')){
            RoomStatus.leak1 = data.leak1
            return NextResponse.json({message:RoomStatus})
        }
        if(Object.keys(data).includes('leak2')){
            RoomStatus.leak2 = data.leak2
            return NextResponse.json({message:RoomStatus})
        }
        if(Object.keys(data).includes('disabledRoom')){
            RoomStatus.disabledRoom = data.disabledRoom
            return NextResponse.json({message:RoomStatus})
        }
        if(Object.keys(data).includes('emergency')){
            RoomStatus.emergency = data.emergency
            return NextResponse.json({message:RoomStatus})
        }else{
            return NextResponse.json({})
        }
    }catch(error){
        console.log(`Error at /api/restroom/status POST: ${error}`)
        return new NextResponse('Internal Server error',{status:500})
    }
}

export async function GET(req:Request){
    try{
        return NextResponse.json({"status":RoomStatus})
    }catch(error){
        console.log(`Error at /api/restrooms/status GET: ${error}`)
        return new NextResponse('Internal Server error',{status:500})
    }
}