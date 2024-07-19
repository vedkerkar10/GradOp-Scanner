import React from 'react';

interface Job {
  position: string;
  company: string;
  companyLogo: string;
  location: string;
  date: string;
  salary: string;
  jobUrl: string;
}

interface JobResultsProps {
  jobs: Job[];
}

const JobResults: React.FC<JobResultsProps> = ({ jobs }) => {
  return (
    <div>
      {jobs.length > 0 ? (
        jobs.map((job, index) => (
          <div key={index} className="job-card">
            <h2>{job.position}</h2>
            <p>{job.company}</p>
            <img src={job.companyLogo} alt={`${job.company} logo`} className="company-logo" />
            <p>{job.location}</p>
            <p>{job.date}</p>
            <p>{job.salary}</p>
            <a href={job.jobUrl} target="_blank" rel="noopener noreferrer">View Job</a>
          </div>
        ))
      ) : (
        <p>No jobs found</p>
      )}
    </div>
  );
};

export default JobResults;