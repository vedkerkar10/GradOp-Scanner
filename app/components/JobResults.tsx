import React from 'react';

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
  return (
    <div className="mt-8">
      {jobs.length > 0 ? (
        jobs.map((job, index) => (
          <div key={index} className="text-black bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <img src={job.companyLogo} alt={`${job.company} logo`} className="w-12 h-12 rounded-full mr-4" />
              <div>
                <h2 className="text-xl font-semibold">{job.position}</h2>
                <p className="text-gray-600">{job.company}</p>
                <a href={job.companyUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  View Company
                </a>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-gray-800"><strong>Location:</strong> {job.location}</p>
              <p className="text-gray-800"><strong>Date:</strong> {job.date}</p>
              <p className="text-gray-800"><strong>Salary:</strong> {job.salary}</p>
            </div>
            <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              View Job
            </a>
            {job.applyUrl && (
              <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline">
                Easy Apply
              </a>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-600">No jobs found</p>
      )}
    </div>
  );
};

export default JobResults;