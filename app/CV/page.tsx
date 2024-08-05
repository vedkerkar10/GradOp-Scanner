"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

const CV = () => {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setExtractedText(response.data.extracted_text);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleQuestionSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/ask", {
        extracted_text: extractedText,
        question: question,
      });
      setAnswer(response.data.answer);
    } catch (error) {
      console.error("Error asking question:", error);
    }
  };

  const renderAnswer = (answer) => {
    return answer.split("\n").map((line, index) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={index}>
          {parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={index}>{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row p-8 bg-white">
        <div className="flex flex-col w-full md:w-[65%] px-8 text-black">
          <h1 className="w-full text-black text-2xl md:text-2xl font-bold mb-4">
            Upload CV
          </h1>
          <input
            type="file"
            id="uploadInput"
            accept="image/*"
            onChange={handleFileChange}
          />
          <button
            onClick={handleUpload}
            className="mt-4 px-4 py-2 bg-[#49AA4D] text-white rounded"
          >
            Upload
          </button>
          <h2 className="mt-4 text-xl">Resume Analysis Overview</h2>
          <textarea
            readOnly
            className="text-black p-2 border border-gray-300 rounded bg-white-100"
            rows={5}
            value={extractedText}
          />
          <div className="flex flex-col items-center p-8">
            <h1 className="text-black mt-8 font-bold text-xl">
              Ask for Career Advice
            </h1>
            <form className="w-full mt-4" onSubmit={handleQuestionSubmit}>
              <textarea
                className="text-black w-full p-2 border border-gray-300 rounded"
                rows={1}
                placeholder="Enter your question or prompt here..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <button
                type="submit"
                className="justify-items-end mt-2 px-4 py-2 bg-[#49AA4D] text-white rounded"
              >
                Generate
              </button>
            </form>
            {answer && (
              <div className="mt-4 p-4 border border-gray-300 rounded bg-gray-50">
                <h2 className="text-lg font-bold"></h2>
                <div className="text-black whitespace-pre-line">
                  {renderAnswer(answer)}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col w-full md:w-[35%] px-4 text-black">
          <div className="flex flex-col items-center p-2 bg-[#49AA4D] text-white rounded-lg">
            <div className="flex flex-row items-center mb-2 w-full text-md md:text-lg gap-4">
              <img
                className="mb-2 w-24"
                src="Grad.svg"
                alt="Job Search Illustration"
              />
              <div className="flex flex-col">
                <span className="">
                  Uploading your resume makes applying for jobs easy!
                </span>
                <span className="">
                  Discover related job roles and skills to find your ideal
                  position.
                </span>
              </div>
            </div>
          </div>
          <h1 className="text-xl font-bold mt-20">
            Here are some Jobs for you
          </h1>
        </div>
      </div>
    </>
  );
};

export default CV;
