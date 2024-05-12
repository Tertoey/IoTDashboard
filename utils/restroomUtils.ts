// utils/restroomUtils.ts

import {RestroomStore} from "@/hook/restroomStore/store";

export const updateRestroomState = async (data: any) => {
    const { setRoom1, setRoom2, setRoom3, setRoom4 }:any = RestroomStore.getState();

    if (Object.keys(data).includes('room1')) {
        setRoom1(data.room1);
        return { message: "updated room1" };
    }
    if (Object.keys(data).includes('room2')) {
        setRoom2(data.room2);
        return { message: "updated room2" };
    }
    if (Object.keys(data).includes('room3')) {
        setRoom3(data.room3);
        return { message: "updated room3" };
    }
    if (Object.keys(data).includes('room4')) {
        setRoom4(data.room4);
        return { message: "updated room4" };
    }
    return null;
};
