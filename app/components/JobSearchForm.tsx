import React, { useState } from "react";

interface JobSearchFormProps {
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

const JobSearchForm: React.FC<JobSearchFormProps> = ({ onSearch }) => {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [dateSincePosted, setDateSincePosted] = useState("");
  const [jobType, setJobType] = useState("");
  const [remoteFilter, setRemoteFilter] = useState("");
  const [salary, setSalary] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [limit, setLimit] = useState("10");
  const [sortBy, setSortBy] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
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
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col justify-center items-start p-4 text-black"
    >
      <h1 className="text-2xl font-bold mb-4">Job Search</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        <div className="flex flex-col">
          <label className="text-white mb-2">Job Role:</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Keyword"
            className="input-field p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-white mb-2">Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="input-field p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-white mb-2">Date Since Posted:</label>
          <input
            type="text"
            value={dateSincePosted}
            onChange={(e) => setDateSincePosted(e.target.value)}
            placeholder="Date Since Posted"
            className="input-field p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-white mb-2">Job Type:</label>
          <input
            type="text"
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            placeholder="Job Type"
            className="input-field p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-white mb-2">Remote Filter:</label>
          <input
            type="text"
            value={remoteFilter}
            onChange={(e) => setRemoteFilter(e.target.value)}
            placeholder="Remote Filter"
            className="input-field p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-white mb-2">Salary:</label>
          <input
            type="text"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            placeholder="Salary"
            className="input-field p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-white mb-2">Experience Level:</label>
          <input
            type="text"
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            placeholder="Experience Level"
            className="input-field p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-white mb-2">Limit:</label>
          <input
            type="text"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            placeholder="Limit"
            className="input-field p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-white mb-2">Sort By:</label>
          <input
            type="text"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            placeholder="Sort By"
            className="input-field p-2 border border-gray-300 rounded"
          />
        </div>
      </div>
      <button
        className="text-white bg-blue-500 rounded-full p-2 mt-4"
        type="submit"
      >
        Search
      </button>
    </form>
  );
};

export default JobSearchForm;