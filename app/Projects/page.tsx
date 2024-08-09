"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";

interface Project {
    project_image_URL: string;
    project_title: string;
    project_organization: string;
    skills: string;
    project_Certificate_type: string;
    project_URL: string;
}

const Projects = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [projects, setProjects] = useState<Project[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null); // Reset error state
        try {
            const response = await fetch(`http://localhost:5000/api/projects?title=${searchTerm}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setProjects(data.projects);  // Access the projects array from the response object
        } catch (err) {
            setError(err.message);
            console.error("Fetch error:", err);
        }
    };

    return (
        <>
            <Navbar />
            <div className="flex flex-col md:flex-row p-8 bg-white">
                <div className="flex flex-col w-full md:w-[65%] px-8 text-black bg-white">
                    <h1 className="w-full text-black text-2xl md:text-2xl font-bold mb-4">
                        Boost your skills with these projects
                    </h1>
                    <h1 className="text-black mt-4 font-light text-lg">
                        Search for projects
                    </h1>
                    <form className="w-96" onSubmit={handleSearch}>
                        <input
                            className="text-black w-full p-2 border border-gray-300 rounded"
                            placeholder="Search for projects"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="w-24 justify-items-end mt-2 px-4 py-2 bg-[#49AA4D] text-white rounded"
                        >
                            Search
                        </button>
                    </form>
                    {error && <p className="text-red-500 mt-4">{error}</p>}
                    <div className="mt-8">
                        {projects.length > 0 ? (
                            projects.map((project, index) => (
                                <div key={index} className="flex border p-4 mb-4 rounded shadow-lg">
                                    <img src={project.project_image_URL} alt={project.project_title} className="w-24 h-24 object-cover rounded mr-4" />
                                    <div>
                                        <h2 className="text-xl font-bold mb-2">{project.project_title}</h2>
                                        <p className="text-gray-700 mb-2"><strong>Organization:</strong> {project.project_organization}</p>
                                        <p className="text-gray-700 mb-2"><strong>Skills:</strong> {project.skills}</p>
                                        <p className="text-gray-700 mb-2"><strong>Certificate Type:</strong> {project.project_Certificate_type}</p>
                                        <a href={project.project_URL} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                            View Project
                                        </a>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No projects found.</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col w-full md:w-[35%] px-4 text-black bg-white">
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
                    </h1>
                </div>
            </div>
        </>
    );
};

export default Projects;