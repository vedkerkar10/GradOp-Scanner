"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import CircularProgress from '@mui/material/CircularProgress';

interface Internship {
    logo: string;
    title: string;
    company: string;
    location: string;
    stipend: string;
    link: string;
}

const Internships = () => {
    const [internships, setInternships] = useState<Internship[]>([]);
    const [filteredInternships, setFilteredInternships] = useState<Internship[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInternships = async () => {
            setError(null); // Reset error state
            try {
                const response = await fetch(`http://localhost:5000/api/internships`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setInternships(data.internships);  // Access the internships array from the response object
                setFilteredInternships(data.internships); // Initially display all internships
            } catch (err: any) {
                setError(err.message);
                console.error("Fetch error:", err);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchInternships();
    }, []);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const filtered = internships.filter(internship =>
            internship.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredInternships(filtered);
    };

    return (
        <>
            <Navbar />
            <div className="flex p-8 bg-white">
                <div className="flex flex-col w-full px-8 text-black bg-white">
                    {loading ? (
                        <div className="flex justify-center items-center h-screen">
                            <CircularProgress color="success" />
                        </div>
                    ) : (
                        <>
                            <h1 className="w-full text-black text-2xl md:text-2xl font-bold mb-4">
                                Find your ideal internship
                            </h1>
                            <form className="w-96" onSubmit={handleSearch}>
                                <input
                                    className="text-black w-full p-2 border border-gray-300 rounded"
                                    placeholder="Search for internships"
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
                                {filteredInternships.length > 0 ? (
                                    filteredInternships.map((internship, index) => (
                                        <div key={index} className="flex border p-4 mb-4 rounded shadow-lg">
                                            <img src={internship.logo} alt={internship.title} className="w-24 h-24 object-cover rounded mr-4" />
                                            <div>
                                                <h2 className="text-xl font-bold mb-2">{internship.title}</h2>
                                                <p className="text-gray-700 mb-2"><strong>Company:</strong> {internship.company}</p>
                                                <p className="text-gray-700 mb-2"><strong>Location:</strong> {internship.location}</p>
                                                <p className="text-gray-700 mb-2"><strong>Stipend:</strong> {internship.stipend}</p>
                                                <a href={internship.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                    View Internship
                                                </a>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No internships found.</p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Internships;