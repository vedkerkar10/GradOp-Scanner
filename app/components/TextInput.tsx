import React, { useState } from "react";

interface TextInputProps {
    onSubmit: (text: string) => void;
    extractedText?: string; // Optional prop for extracted text
}

const TextInput: React.FC<TextInputProps> = ({ onSubmit, extractedText }) => {
    const [text, setText] = useState<string>("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(text); // Pass the text to the parent component
    };

    const renderExtractedKeywordsForm = () => {
        return (
            <div className="flex flex-col">
                <label className="text-black font-semibold mb-2">Extracted Text</label>
                <textarea
                    value={extractedText || ""}
                    readOnly
                    className="text-black p-2 border border-gray-300 rounded bg-gray-100"
                    rows={10}
                />
            </div>
        );
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="h-full w-full max-w-xl bg-white p-8 shadow-md rounded mx-2">
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
                    type="button" // Changed to button for upload
                    className="w-full bg-blue-500 mt-2 text-white py-2 px-4 rounded hover:bg-blue-800 transition duration-200"
                    onClick={() => console.log("Upload functionality here")} // Placeholder for upload functionality
                >
                    Upload
                </button>
            </form>
            {extractedText && renderExtractedKeywordsForm()} {/* Render extracted keywords form if text is available */}
        </div>
    );
};

export default TextInput;