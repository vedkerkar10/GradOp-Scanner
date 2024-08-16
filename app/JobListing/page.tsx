"use client";

import React, { useEffect, useState } from "react";
import JobResults from "../components/JobResults";
import Navbar from "../components/Navbar";

interface Job {
  position: string;
  company: string;
  companyLogo: string;
  location: string;
  date: string;
  salary: string;
  jobUrl: string;
  companyUrl: string;
  applyUrl: string;
}

const JobListingPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const storedJobs = localStorage.getItem("jobs");
    if (storedJobs) {
      setJobs(JSON.parse(storedJobs).slice(0, 20)); 
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="bg-white min-h-screen">
        <JobResults jobs={jobs} />
      </div>
    </>
  );
};

export default JobListingPage;