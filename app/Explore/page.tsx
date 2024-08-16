"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import CircularProgress from '@mui/material/CircularProgress';

const Explore: React.FC = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate a fetch call
        setTimeout(() => {
            setLoading(false);
        }, 1000); // Adjust the timeout as needed
    }, []);

    return (
        <>
            <Navbar />
            <div className="max-w-full flex flex-col items-center bg-white text-black min-h-screen">
                {loading ? (
                    <div className="flex justify-center items-center h-screen">
                        <CircularProgress color="success" />
                    </div>
                ) : (
                    <>
                        <h1 className="m-4 text-xl md:text-2xl font-bold">Explore Opportunities to build your profile</h1>
                        <h2 className="m-2 text-xl md:text-2xl font-medium"></h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                            <Card title="Projects" link="/Projects" />
                            <Card title="Courses" link="/Courses" />
                            <Card title="Internships" link="/Internships" />
                            <Card title="Hackathons" link="/Hackathon" />
                        </div>
                    </>
                )}
            </div>
        </>
    );
};
export default Explore;