"use client"

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import CircularProgress from '@mui/material/CircularProgress';

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

const JobResults: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedJobs, setLikedJobs] = useState<boolean[]>([]);
  const [leftCount, setLeftCount] = useState(0);
  const [rightCount, setRightCount] = useState(0);
  const [matchPercentages, setMatchPercentages] = useState<number[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedJobs = localStorage.getItem("jobs");
    if (storedJobs) {
      const parsedJobs = JSON.parse(storedJobs);
      setJobs(parsedJobs);
      setLikedJobs(new Array(parsedJobs.length).fill(false));
      setMatchPercentages(new Array(parsedJobs.length).fill(75)); // Initialize with dummy percentage value
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const handleNext = () => {
    if (rightCount < 5) {
      setMatchPercentages((prevPercentages) => {
        const newPercentages = [...prevPercentages];
        newPercentages[currentIndex] = Math.floor(Math.random() * 101); // Update current job's percentage
        return newPercentages;
      });
      setCurrentIndex((prevIndex) => (prevIndex + 1) % jobs.length);
      setRightCount((prevCount) => prevCount + 1);
      setLeftCount(0); // Reset left count when moving right
    }
  };

  const handlePrev = () => {
    if (leftCount < 5) {
      setMatchPercentages((prevPercentages) => {
        const newPercentages = [...prevPercentages];
        newPercentages[currentIndex] = Math.floor(Math.random() * 101); // Update current job's percentage
        return newPercentages;
      });
      setCurrentIndex((prevIndex) => (prevIndex - 1 + jobs.length) % jobs.length);
      setLeftCount((prevCount) => prevCount + 1);
      setRightCount(0); // Reset right count when moving left
    }
  };

  const handleLike = () => {
    setLikedJobs((prevLikedJobs) => {
      const newLikedJobs = [...prevLikedJobs];
      newLikedJobs[currentIndex] = !newLikedJobs[currentIndex];
      return newLikedJobs;
    });
  };

  return (
    <>
      <Navbar />
      <div className="w-full h-screen flex flex-col items-center px-4 md:px-12 text-black bg-white">
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <CircularProgress color="success" />
          </div>
        ) : (
          <>
            <span className="text-black mt-8 md:mt-8 mb-8 md:mb-0 text-2xl md:text-3xl font-bold">Featured Jobs</span>
            <div className="w-full flex justify-center items-center text-black">
              {jobs.length > 0 ? (
                <div className="relative w-full max-w-4xl md:max-w-5xl">
                  <div className="text-black bg-white shadow-md rounded-lg md:p-12 relative">
                    <div className="flex flex-col md:flex-row items-center mb-8">
                      <img
                        src={jobs[currentIndex].companyLogo}
                        alt={`${jobs[currentIndex].company} logo`}
                        className="w-24 h-24 md:w-32 md:h-32 rounded-full  md:mb-0 md:mr-8"
                      />
                      <div className="text-center md:text-left">
                        <h2 className="text-2xl md:text-3xl font-semibold">{jobs[currentIndex].position}</h2>
                        <p className="text-gray-600 text-xl md:text-2xl">{jobs[currentIndex].company}</p>
                        <Link href={jobs[currentIndex].companyUrl} target="_blank" rel="noopener noreferrer" legacyBehavior>
                          <a className="text-blue-500 hover:underline text-lg md:text-xl">View Company</a>
                        </Link>
                      </div>
                    </div>
                    <div className="mb-8">
                      <p className="text-gray-800 text-lg md:text-xl">
                        <strong>Location:</strong> {jobs[currentIndex].location}
                      </p>
                      <p className="text-gray-800 text-lg md:text-xl">
                        <strong>Date:</strong> {jobs[currentIndex].date}
                      </p>
                      <p className="text-gray-800 text-xl md:text-2xl">
                        <strong>Salary:</strong> {jobs[currentIndex].salary}
                      </p>
                    </div>
                    <Link href={jobs[currentIndex].jobUrl} target="_blank" rel="noopener noreferrer" legacyBehavior>
                      <a className="text-blue-500 hover:underline text-lg md:text-xl">View Job</a>
                    </Link>
                    {jobs[currentIndex].applyUrl && (
                      <Link href={jobs[currentIndex].applyUrl} target="_blank" rel="noopener noreferrer" legacyBehavior>
                        <a className="text-red-500 hover:underline text-lg md:text-xl">Easy Apply</a>
                      </Link>
                    )}
                    <button
                      onClick={handleLike}
                      className="absolute top-8 right-4 md:right-24 flex items-center justify-center w-12 h-12 rounded-lg cursor-pointer border-none bg-transparent group"
                    >
                      <svg
                        className="md:w-12 md:h-12  w-8 h-8 transition-transform duration-200 group-hover:scale-125"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20.503"
                        height="20.625"
                        viewBox="0 0 17.503 15.625"
                      >
                        <path
                          id="Fill"
                          d="M8.752,15.625h0L1.383,8.162a4.824,4.824,0,0,1,0-6.762,4.679,4.679,0,0,1,6.674,0l.694.7.694-.7a4.678,4.678,0,0,1,6.675,0,4.825,4.825,0,0,1,0,6.762L8.752,15.624ZM4.72,1.25A3.442,3.442,0,0,0,2.277,2.275a3.562,3.562,0,0,0,0,5l6.475,6.556,6.475-6.556a3.563,3.563,0,0,0,0-5A3.443,3.443,0,0,0,12.786,1.25h-.01a3.415,3.415,0,0,0-2.443,1.038L8.752,3.9,7.164,2.275A3.442,3.442,0,0,0,4.72,1.25Z"
                          transform="translate(0 0)"
                          className={`transition-colors duration-200 ${likedJobs[currentIndex] ? 'fill-green-500' : 'fill-black'} group-hover:fill-green-500`}
                        ></path>
                      </svg>
                    </button>
                    <div 
                      className="absolute bottom-8 right-4 md:right-8 w-40 h-40 flex flex-col items-center"
                      onMouseEnter={() => setShowPopup(true)}
                      onMouseLeave={() => setShowPopup(false)}
                    >
                      <CircularProgressbar
                        value={matchPercentages[currentIndex]}
                        text={`${matchPercentages[currentIndex]}%`}
                        styles={buildStyles({
                          textSize: '35px',
                          pathColor: `rgba(62, 152, 199, ${matchPercentages[currentIndex] / 100})`,
                          textColor: '#000',
                          trailColor: '#d6d6d6',
                        })}
                      />
                      <h1 className="text-md font-medium mt-2 text-center">Percentage Match</h1>
                      {showPopup && (
                        <div className="absolute bottom-full mb-2 w-64 p-4 bg-white border border-gray-300 rounded shadow-lg text-center">
                          <p className="mb-2">Improve your chances for the job by enrolling in:</p>
                          <div className="flex flex-col gap-2">
                            <Link href="/Courses" legacyBehavior>
                              <a className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-700">Courses</a>
                            </Link>
                            <Link href="/Projects" legacyBehavior>
                              <a className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-700">Projects</a>
                            </Link>
                            <Link href="/Internships" legacyBehavior>
                              <a className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-700">Internships</a>
                            </Link>
                            <Link href="/Hackathon" legacyBehavior>
                              <a className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-700">Hackathons</a>
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handlePrev}
                    className={`absolute md:left-[-40px] left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 md:p-4 rounded-full text-2xl md:text-3xl ${leftCount >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={leftCount >= 5}
                  >
                    &lt;
                  </button>
                  <button
                    onClick={handleNext}
                    className={`absolute md:right-[-40px] right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 md:p-4 rounded-full text-2xl md:text-3xl ${rightCount >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={rightCount >= 5}
                  >
                    &gt;
                  </button>
                </div>
              ) : (
                <p className="text-gray-600 text-xl md:text-2xl">No jobs found</p>
              )}
            </div>
            <div className="flex flex-row items-center justify-center gap-8">
              <Link href={"/Explore"}>
                <button className="bg-green-500 text-white p-2 md:p-4 rounded-full text-lg md:text-xl mt-8">
                  Explore Opportunities
                </button>
              </Link>
              <Link href={"/JobListing"}>
                <button className="bg-green-500 text-white p-2 md:p-4 rounded-full text-lg md:text-xl mt-8">
                  Show All Jobs
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default JobResults;