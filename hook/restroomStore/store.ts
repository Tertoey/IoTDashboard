'use client'

// RestroomStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const RestroomStore = create(persist(
    (set) => ({
        room1: false,
        room2: false,
        room3: false,
        room4: false,
        setRoom1: (setR1:any)=> set((state:any)=>({
            room1:{...state.room1,...setR1}
        })),
        setRoom2: (state: boolean) => set({ room2: state }),
        setRoom3: (state: boolean) => set({ room3: state }),
        setRoom4: (state: boolean) => set({ room4: state }),
    }),
    {
        name: 'restroom-status',
        getStorage: () => sessionStorage // Use sessionStorage to persist the state
    }
));

export const userStore = create((set)=>({
    user:{
        fullname:"toey"
    }
}))
