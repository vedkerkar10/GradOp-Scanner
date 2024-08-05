import Link from "next/link";
import React, { useState } from "react";

interface HeroSectionProps {
  onSearch: (searchParams: {
    keyword: string;
    location: string;
    dateSincePosted: string;
    jobType: string;
    remoteFilter: string;
    salary: string;
    experienceLevel: string;
    limit: string;
    sortBy: string;
  }) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [dateSincePosted, setDateSincePosted] = useState("");
  const [jobType, setJobType] = useState("");
  const [remoteFilter, setRemoteFilter] = useState("");
  const [salary, setSalary] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [limit, setLimit] = useState("20");
  const [sortBy, setSortBy] = useState("");

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch({
      keyword,
      location,
      dateSincePosted,
      jobType,
      remoteFilter,
      salary,
      experienceLevel,
      limit,
      sortBy,
    });
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-white">
      <div className="flex flex-col w-full md:w-1/2">
        <h1 className="w-full text-black text-3xl md:text-5xl font-bold mb-4">
          Find a job that suits
        </h1>
        <h1 className="text-black text-3xl md:text-5xl font-bold mb-4">
          your interest & skills.
        </h1>
        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 md:mt-8"
        >
          <input
            type="text"
            placeholder="Job title, skills, Keyword..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="text-black border border-gray-300 p-2 rounded-md w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text"
            placeholder="Your Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="text-black border border-gray-300 p-2 rounded-md w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            className="bg-green-500 text-white w-full md:w-32 p-2 rounded-md"
            type="submit"
          >
            Find Job
          </button>
        </form>
        <p className="mt-12 p-12 text-center text-gray-600">
          Not sure where to start your job search? Our questionnaire will help
          you pinpoint the right roles!
        </p>
        <button className=" bg-green-500 text-white p-2 rounded-md mx-auto">
        <Link href={'/Home'}>
        Find My Fit
          </Link>
        </button>
        
      </div>
      <div className="flex-shrink-0 w-full md:w-1/2 mt-4 md:mt-0">
        <img
          src="illustration.png"
          alt="Job Search Illustration"
          className="w-full h-auto"
        />
      </div>
    </div>
  );
};

export default HeroSection;
