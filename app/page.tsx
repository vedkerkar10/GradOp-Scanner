"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Main from "./components/Main";

export default function Home() {
  const [result, setResult] = useState({});
  const [domain, setDomain] = useState("");

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DOMAIN) {
      setDomain(process.env.NEXT_PUBLIC_DOMAIN);
    }
  },
  []);

  const handleTextSubmit = async (text: string) => {
    try {
      const response = await fetch("http://localhost:5000/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();
      console.log("Received data:", data);
      setResult({ extractedText: data });
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  
  // const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;
  // console.log(DOMAIN);

  const handleJobSearch = async (query: any) => {
    try {
      const response = await axios.post(
        `${domain}/api/jobs`,
        query
      );
      // Store jobs in local storage
      localStorage.setItem("jobs", JSON.stringify(response.data.results));
      // Redirect to FeaturedJobs page
      window.location.href = "/FeaturedJobs"; // Adjust the path if necessary
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0]">
      <Navbar />
      <Main onSearch={handleJobSearch} />
    </div>
  );
}