import React, { useState } from 'react';

const JobSearchForm = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [dateSincePosted, setDateSincePosted] = useState('');
  const [jobType, setJobType] = useState('');
  const [remoteFilter, setRemoteFilter] = useState('');
  const [salary, setSalary] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [limit, setLimit] = useState('10');
  const [sortBy, setSortBy] = useState('');

  const handleSubmit = (event) => {
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
    <form onSubmit={handleSubmit}>
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
      <button type="submit">Search</button>
    </form>
  );
};

export default JobSearchForm;