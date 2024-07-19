"use client";

import { useState } from "react";
import JobSearchForm from "./components/JobSearchForm";
import JobResults from "./components/JobResults";
import axios from "axios";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState({});
  const [jobs, setJobs] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received data:", data);
      setResult(data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const handleJobSearch = async (query) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/jobs",
        query
      );
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const renderExtractedKeywordsForm = () => {
    return (
      <form className="space-y-4">
        {Object.keys(result).map((field) => (
          <div key={field} className="flex flex-col">
            <label className="text-black font-semibold mb-2">{field}</label>
            <input
              type="text"
              value={result[field]}
              readOnly
              className="text-black p-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>
        ))}
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-black-100 mx-8">
      <h1 className="text-3xl font-bold my-7">Keyword Parser</h1>
      <div className="w-full bg-black shadow-md rounded-lg flex flex-col md:flex-row ">
        <form
          onSubmit={handleSubmit}
          className="h-full w-full max-w-xl bg-white p-8 shadow-md rounded mx-2"
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            className="text-black w-full p-2 border border-gray-300 rounded mb-4"
            placeholder="Enter text here..."
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-800 transition duration-200"
          >
            Extract
          </button>
        </form>
        <div className="h-full w-full max-w-xl bg-white shadow-md rounded mx-2 my-2 md:my-0">
          {Object.keys(result).length > 0 && (
            <div className="w-full max-w-lg bg-white p-8 shadow-md rounded">
              <h2 className="text-black text-2xl font-semibold mb-4">
                Extracted Keywords:
              </h2>
              {renderExtractedKeywordsForm()}
            </div>
          )}
        </div>
      </div>
      <div>
      <h1>Job Search</h1>
      <JobSearchForm onSearch={handleJobSearch} />
      {jobs.length > 0 ? (
        <div>
          {jobs.map((job, index) => (
            <div key={index} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
              <img src={job.companyLogo} alt={`${job.company} logo`} style={{ width: '50px', height: '50px' }} />
              <h2>{job.position}</h2>
              <p><strong>Company:</strong> {job.company}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Date Posted:</strong> {job.date}</p>
              <p><strong>Salary:</strong> {job.salary}</p>
              <p><strong>Posted:</strong> {job.agoTime}</p>
              <a href={job.jobUrl} target="_blank" rel="noopener noreferrer">View Job</a>
            </div>
          ))}
        </div>
      ) : (
        <p>No jobs found</p>
      )}
    </div>
    </div>
  );
}
