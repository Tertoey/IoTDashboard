'use client'

import { useNavContext } from "@/context/Navcontext";
import { useEffect } from "react";
import useSWR from "swr";

const fetcher = (url:any) => fetch(url).then((res) => res.json());

const Building = () => {
    const {isNavOpen, setIsNavOpen} = useNavContext()
    const { data, error, isLoading } = useSWR('/api/restrooms/status', fetcher)
    if (error) return <div>Failed to fetch users.</div>;
    if (isLoading) return <h2>Loading...</h2>;
    return (
        <div>
            <h3>Test SWR</h3>
            <div>{!!data.status.Mroom1 ? <>1</>:<>2</>}</div>
            <div>{isNavOpen ? <>true</>:<>false</>}</div>
        </div>
    );
}
 
export default Building;