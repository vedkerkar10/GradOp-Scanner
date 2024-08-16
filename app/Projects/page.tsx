"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import CircularProgress from '@mui/material/CircularProgress';

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
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/projects');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setProjects(data.projects);
                setFilteredProjects(data.projects); // Initially, all projects are displayed
            } catch (err:any) {
                setError(err.message);
                console.error("Fetch error:", err);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchProjects();
    }, []);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null); // Reset error state
        const filtered = projects.filter(project =>
            project.project_title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProjects(filtered);
    };

    return (
        <>
            <Navbar />
            <div className="flex flex-col md:flex-row p-8 bg-white">
                <div className="flex flex-col w-full px-8 text-black bg-white">
                    {loading ? (
                        <div className="flex w-full justify-center items-center h-screen">
                            <CircularProgress color="success" />
                        </div>
                    ) : (
                        <>
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
                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 items-center gap-8 justify-center items-center">
                                {filteredProjects.length > 0 ? (
                                    filteredProjects.map((project, index) => (
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
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Projects;