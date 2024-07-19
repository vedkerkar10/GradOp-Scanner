import React, { useState } from 'react';

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
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [dateSincePosted, setDateSincePosted] = useState('');
  const [jobType, setJobType] = useState('');
  const [remoteFilter, setRemoteFilter] = useState('');
  const [salary, setSalary] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [limit, setLimit] = useState('10');
  const [sortBy, setSortBy] = useState('');

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
    <form onSubmit={handleSubmit} className='text-black'>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Keyword"
      />
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location"
      />
      <input
        type="text"
        value={dateSincePosted}
        onChange={(e) => setDateSincePosted(e.target.value)}
        placeholder="Date Since Posted"
      />
      <input
        type="text"
        value={jobType}
        onChange={(e) => setJobType(e.target.value)}
        placeholder="Job Type"
      />
      <input
        type="text"
        value={remoteFilter}
        onChange={(e) => setRemoteFilter(e.target.value)}
        placeholder="Remote Filter"
      />
      <input
        type="text"
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
        placeholder="Salary"
      />
      <input
        type="text"
        value={experienceLevel}
        onChange={(e) => setExperienceLevel(e.target.value)}
        placeholder="Experience Level"
      />
      <input
        type="text"
        value={limit}
        onChange={(e) => setLimit(e.target.value)}
        placeholder="Limit"
      />
      <input
        type="text"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        placeholder="Sort By"
      />
      <button className='text-white' type="submit">Search</button>
    </form>
  );
};

export default JobSearchForm;