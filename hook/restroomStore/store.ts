// // RestroomStore.ts
// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// type Status = {
//   Mroom1: boolean;
//   Mroom2: boolean;
//   Mroom3: boolean;
//   Mroom4: boolean;
//   Froom1: boolean;
//   Froom2: boolean;
//   Froom3: boolean;
//   Froom4: boolean;
//   leak1: boolean;
//   leak2: boolean;
//   disabledRoom: boolean;
//   emergency: boolean;
// };
// interface RestroomStoreState {
//   status: Status;
//   setStatus: (status: Status) => void;
// }
// export const useRestroomStore = create<RestroomStoreState>()(
//   persist(
//     (set) => ({
//       status: {
//         Mroom1: false,
//         Mroom2: false,
//         Mroom3: false,
//         Mroom4: false,
//         Froom1: false,
//         Froom2: false,
//         Froom3: false,
//         Froom4: false,
//         leak1: false,
//         leak2: false,
//         disabledRoom: false,
//         emergency: false,
//       },
//       setStatus: (status: Status) => {
//         set({ status: status });
//       },
//     }),
//     {
//       name: "RoomStatus",
//     }
//   )
// );

// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// interface Status {
//   Mroom1: boolean;
//   Mroom2: boolean;
//   Mroom3: boolean;
//   Mroom4: boolean;
//   Froom1: boolean;
//   Froom2: boolean;
//   Froom3: boolean;
//   Froom4: boolean;
//   leak1: boolean;
//   leak2: boolean;
//   disabledRoom: boolean;
//   emergency: boolean;
//   setMroom1: (Mroom1: boolean) => void;
//   setMroom2: (Mroom2: boolean) => void;
//   setMroom3: (Mroom3: boolean) => void;
//   setMroom4: (Mroom4: boolean) => void;
//   setFroom1: (Froom1: boolean) => void;
//   setFroom2: (Froom2: boolean) => void;
//   setFroom3: (Froom3: boolean) => void;
//   setFroom4: (Froom4: boolean) => void;
//   setleak1: (leak1: boolean) => void;
//   setleak2: (leak2: boolean) => void;
//   setdisabledRoom: (disabledRoom: boolean) => void;
//   setemergency: (emergency: boolean) => void;
// }

// export const useRestroomStore = create<Status>()(
//   persist(
//     (set) => ({
//       Mroom1: false,
//       Mroom2: false,
//       Mroom3: false,
//       Mroom4: false,
//       Froom1: false,
//       Froom2: false,
//       Froom3: false,
//       Froom4: false,
//       leak1: false,
//       leak2: false,
//       disabledRoom: false,
//       emergency: false,
//       setMroom1: (Mroom1: boolean) => {
//         set({ Mroom1 });
//       },
//       setMroom2: (Mroom2: boolean) => {
//         set({ Mroom2 });
//       },
//       setMroom3: (Mroom3: boolean) => {
//         set({ Mroom3 });
//       },
//       setMroom4: (Mroom4: boolean) => {
//         set({ Mroom4 });
//       },
//       setFroom1: (Froom1: boolean) => {
//         set({ Froom1 });
//       },
//       setFroom2: (Froom2: boolean) => {
//         set({ Froom2 });
//       },
//       setFroom3: (Froom3: boolean) => {
//         set({ Froom3 });
//       },
//       setFroom4: (Froom4: boolean) => {
//         set({ Froom4 });
//       },
//       setleak1: (leak1: boolean) => {
//         set({ leak1 });
//       },
//       setleak2: (leak2: boolean) => {
//         set({ leak2 });
//       },
//       setdisabledRoom: (disabledRoom: boolean) => {
//         set({ disabledRoom });
//       },
//       setemergency: (emergency: boolean) => {
//         set({ emergency });
//       },
//     }),
//     {
//       name: "Roomstatus",
//     }
//   )
// );
