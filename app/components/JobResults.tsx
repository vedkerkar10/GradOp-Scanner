import React from 'react';

const JobResults = ({ jobs }) => {
  return (
    <div>
      {jobs.length > 0 ? (
        jobs.map((job, index) => (
          <div key={index}>
            <h2>{job.title}</h2>
            <p>{job.company}</p>
            <p>{job.location}</p>
          </div>
        ))
      ) : (
        <p>No jobs found</p>
      )}
    </div>
  );
};

export default JobResults;