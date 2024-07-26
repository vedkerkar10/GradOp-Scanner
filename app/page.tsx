"use client";

import { useState } from "react";
import JobSearchForm from "./components/JobSearchForm";
import JobResults from "./components/JobResults";
import axios from "axios";
import Link from "next/link";

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

      // Changed to directly receive text response
      const data = await response.text(); // Changed from response.json() to response.text()
      console.log("Received data:", data);
      setResult({ extractedText: data }); // Set result as an object with extractedText
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
      setJobs(response.data.results);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const renderExtractedKeywordsForm = () => {
    return (
      <form className="space-y-4">
        {/* Changed to display extracted text directly */}
        <div className="flex flex-col">
          <label className="text-black font-semibold mb-2">
            Extracted Text
          </label>
          <textarea
            value={result.extractedText || ""}
            readOnly
            className="text-black p-2 border border-gray-300 rounded bg-gray-100"
            rows={10}
          />
        </div>
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
          <button
            type="submit"
            className="w-full bg-blue-500 mt-2 text-white py-2 px-4 rounded hover:bg-blue-800 transition duration-200"
          >
            Upload
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
      <div className="mt-8">
        Want to Analyze your CV and see where you stand?
        <Link
          className="bg-blue-500 text-white m-3 px-3 py-1 rounded-md"
          href={"/CV"}
        >
          Click
        </Link>
      </div>
      <div>
        <JobSearchForm onSearch={handleJobSearch} />
        <JobResults jobs={jobs} />
      </div>
    </div>
  );
}
