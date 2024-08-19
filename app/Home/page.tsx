"use client";


import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";
import router from "next/router";
import axios from "axios";

const Main: React.FC = () => {
  const [result, setResult] = useState({});
  const [jobs, setJobs] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [dateSincePosted, setDateSincePosted] = useState("");
  const [jobType, setJobType] = useState("");
  const [remoteFilter, setRemoteFilter] = useState("");
  const [salary, setSalary] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [limit, setLimit] = useState("20");
  

  const handleJobSearch = async (query: { keyword: string; location: string; dateSincePosted: string; jobType: string; remoteFilter: string; salary: string; experienceLevel: string; limit: string; sortBy: string; }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/jobs",
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

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const searchParams = {
      keyword,
      location,
      dateSincePosted,
      jobType,
      remoteFilter,
      salary,
      experienceLevel,
      limit,
      sortBy,
    };
    handleJobSearch(searchParams); // Call handleJobSearch with the same parameters
  };
  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row min-h-screen bg-white">
        <div className="w-full p-4 md:w-1/2 my-2">
          <form
            onSubmit={handleSearch}
            className="w-full max-w-lg md:mx-8 text-black bg-gray-100 p-8 rounded-lg shadow-md"
          >
            <div className="mb-4">
              <label className="block text-gray-700">
                Which degree are you having or currently pursuing?
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                placeholder="Educational qualification"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">
                What are your career ambitions?
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                placeholder="Fields of Interests"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">
                Which skills do you possess?
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                placeholder="Technical, Non-Technical"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">
                Preferred Job Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                placeholder="Location"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Submit
            </button>
          </form>
          <h2 className="text-black my-4 text-center font-extrabold">OR</h2>
          <p className="text-center">
            <Link className="font-extrabold text-blue-500" href={"/CV"}>
              Upload your CV
            </Link>{" "}
            <span className="text-green-600">
              and start your journey today.
            </span>
          </p>
        </div>
        <img
          src="/illustration.png"
          alt="Illustration"
          className="w-full p-4 md:w-1/2 hidden md:block"
        />
      </div>
    </>
  );
};

export default Main;