"use client";

import { useState } from "react";

export default function Home() {
  const [extractedText, setExtractedText] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      setExtractedText(data.extracted_text);
    } else {
      console.error("Error uploading file");
    }
  };

  const handleAskQuestion = async () => {
    const response = await fetch("http://localhost:5000/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        extracted_text: extractedText,
        question: question,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setAnswer(data.answer);
    } else {
      console.error("Error asking question");
    }
  };

  return (
    <div className="min-h-screen bg-black-100 mx-8">
      <h1 className="text-3xl font-bold my-7">CV Analyzer</h1>
      <input
        type="file"
        accept=".pdf, image/*"
        onChange={handleFileUpload}
        className="mb-4"
      />
      {extractedText && (
        <div className="bg-white p-4 rounded shadow-md text-black">
          <p>
            {extractedText.split("\n").map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </p>
        </div>
      )}
      {extractedText && (
        <div className="mt-4">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about the text"
            className="border p-2 rounded text-black"
          />
          <button
            onClick={handleAskQuestion}
            className="ml-2 bg-blue-500 text-white p-2 rounded"
          >
            Ask
          </button>
        </div>
      )}
      {answer && (
        <div className="bg-white p-4 rounded shadow-md mt-4 text-black">
          <h2 className="text-black text-xl font-semibold">Answer:</h2>
          <p>
            {answer.split("\n").map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </p>
        </div>
      )}
    </div>
  );
}
