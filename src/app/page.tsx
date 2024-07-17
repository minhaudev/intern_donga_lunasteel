"use client";
import Button from "@/components/atoms/Button";
import Header from "@/components/layouts/Header/Header";

import Navigation from "@/components/molecules/Navigation";
import TableFuture from "@/components/molecules/TableFuture";
import {NavigationType} from "@/interfaces";
import {useState} from "react";
export default function Home() {
    // const [fileDetails, setFileDetails] = useState([]);

    // const handleFileDetailsChange = (details: any) => {
    //     setFileDetails(details);
    // };

    return (
        <div className="flex w-full">
            <Navigation type={NavigationType.CLIENT} />
            <Header />
            {/* <Button
                size="semi"
                variant="file"
                color="white"
                fileDetails={fileDetails}
                setFileDetails={handleFileDetailsChange}>
                Button
            </Button> */}
            {/* <TableFuture /> */}
        </div>
    );
}
