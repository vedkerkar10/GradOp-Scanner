"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import CircularProgress from '@mui/material/CircularProgress';

interface Hackathon {
    title: string;
    collegeName: string;
    seoUrl: string;
    logoUrl: string;
    daysLeft: string;
}

const Hackathons = () => {
    const [hackathons, setHackathons] = useState<Hackathon[]>([]);
    const [filteredHackathons, setFilteredHackathons] = useState<Hackathon[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [domain, setDomain] = useState("");

    useEffect(() => {
        if (process.env.NEXT_PUBLIC_DOMAIN) {
          setDomain(process.env.NEXT_PUBLIC_DOMAIN);
        }
      },
      []);

    useEffect(() => {
        const fetchHackathons = async () => {
            setError(null); // Reset error state
            try {
                const response = await fetch(`${domain}/api/hackathons`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setHackathons(data.hackathons);  // Access the hackathons array from the response object
                setFilteredHackathons(data.hackathons); // Initially display all hackathons
            } catch (err: any) {
                setError(err.message);
                console.error("Fetch error:", err);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchHackathons();
    }, []);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const filtered = hackathons.filter(hackathon =>
            hackathon.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredHackathons(filtered);
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
                                Find your ideal hackathon
                            </h1>
                            <form className="w-96" onSubmit={handleSearch}>
                                <input
                                    className="text-black w-full p-2 border border-gray-300 rounded"
                                    placeholder="Search for hackathons"
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
                                {filteredHackathons.length > 0 ? (
                                    filteredHackathons.map((hackathon, index) => (
                                        <div key={index} className="flex border p-4 mb-4 rounded shadow-lg">
                                            <img src={hackathon.logoUrl} alt={hackathon.title} className="w-24 h-24 object-cover rounded mr-4" />
                                            <div>
                                                <h2 className="text-xl font-bold mb-2">{hackathon.title}</h2>
                                                <p className="text-gray-700 mb-2"><strong>College:</strong> {hackathon.collegeName}</p>
                                                <p className="text-gray-700 mb-2"><strong>Days Left:</strong> {hackathon.daysLeft}</p>
                                                <a href={hackathon.seoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                    More Info
                                                </a>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No hackathons found.</p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Hackathons;  