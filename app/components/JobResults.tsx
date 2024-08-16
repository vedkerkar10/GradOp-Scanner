import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Link from "next/link";

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

interface JobResultsProps {
  jobs: Job[];
}

const JobResults: React.FC<JobResultsProps> = ({ jobs }) => {
  const [matchPercentages, setMatchPercentages] = useState<number[]>([]);
  const [showPopup, setShowPopup] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (jobs.length > 0) {
      setMatchPercentages(jobs.map(() => Math.floor(Math.random() * 101))); // Initialize with random percentages
    }
  }, [jobs]);

  const handleMouseEnter = (index: number) => {
    setShowPopup((prev) => ({ ...prev, [index]: true }));
  };

  const handleMouseLeave = (index: number) => {
    setShowPopup((prev) => ({ ...prev, [index]: false }));
  };

  return (
    <div className="w-full flex flex-col justify-center items-start px-12 text-black ">
      <span className="text-black text-2xl font-bold mt-8">Featured Jobs</span>
      <div className="w-full justify-center items-start mt-8 text-black grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {jobs.length > 0 ? (
          jobs.map((job, index) => (
            <div
              key={index}
              className="text-black bg-white shadow-md rounded-lg p-6 mb-6 relative"
            >
              <div className="flex items-center mb-4 ">
                <img
                  src={job.companyLogo}
                  alt={`${job.company} logo`}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h2 className="text-xl font-semibold">{job.position}</h2>
                  <p className="text-gray-600">{job.company}</p>
                  <a
                    href={job.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Company
                  </a>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-gray-800">
                  <strong>Location:</strong> {job.location}
                </p>
                <p className="text-gray-800">
                  <strong>Date:</strong> {job.date}
                </p>
                <p className="text-gray-800">
                  <strong>Salary:</strong> {job.salary}
                </p>
              </div>
              <a
                href={job.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View Job
              </a>
              {job.applyUrl && (
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-500 hover:underline"
                >
                  Easy Apply
                </a>
              )}
              <div 
                className="absolute bottom-4 right-4 md:w-40 md:h-40 w-28 h-28 flex flex-col items-center"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave(index)}
              >
                <CircularProgressbar
                  value={matchPercentages[index]}
                  text={`${matchPercentages[index]}%`}
                  styles={buildStyles({
                    textSize: '25px',
                    pathColor: `rgba(62, 152, 199, ${matchPercentages[index] / 100})`,
                    textColor: '#000',
                    trailColor: '#d6d6d6',
                  })}
                />
                <h1 className="text-md font-medium mt-2 text-center">Percentage Match</h1>
                {showPopup[index] && (
                  <div className="absolute bottom-full mb-2 w-64 p-4 bg-white border border-gray-300 rounded shadow-lg text-center">
                    <p className="mb-2">Here are some courses, projects, and internships to improve your chances for the job:</p>
                    <div className="flex flex-col gap-2">
                      <Link href="/courses" legacyBehavior>
                        <a className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-700">Courses</a>
                      </Link>
                      <Link href="/projects" legacyBehavior>
                        <a className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-700">Projects</a>
                      </Link>
                      <Link href="/internships" legacyBehavior>
                        <a className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-700">Internships</a>
                      </Link>
                      <Link href="/Hackathon" legacyBehavior>
                        <a className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-700">Hackathon</a>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No jobs found</p>
        )}
      </div>
    </div>
  );
};

export default JobResults;