"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import CircularProgress from '@mui/material/CircularProgress';

interface Course {
    course_image_URL: string;
    course_title: string;
    course_organization: string;
    skills: string;
    course_Certificate_type: string;
    course_URL: string;
}

const Courses = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/courses');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setCourses(data.courses);
                setFilteredCourses(data.courses);
            } catch (err: any) {
                setError(err.message);
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const filtered = courses.filter(course =>
            course.course_title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCourses(filtered);
    };

    return (
        <>
            <Navbar />
            <div className="flex flex-col md:flex-row p-8 bg-white">
                <div className="flex flex-col w-full px-8 text-black bg-white">
                    {loading ? (
                        <div className="flex justify-center items-center h-screen">
                            <CircularProgress color="success" />
                        </div>
                    ) : (
                        <>
                            <h1 className="w-full text-black text-2xl md:text-2xl font-bold mb-4">
                                Boost your skills with these courses
                            </h1>
                            <h1 className="text-black mt-4 font-light text-lg">
                                Search for courses
                            </h1>
                            <form className="w-96" onSubmit={handleSearch}>
                                <input
                                    className="text-black w-full p-2 border border-gray-300 rounded"
                                    placeholder="Search for courses"
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
                                {filteredCourses.length > 0 ? (
                                    filteredCourses.map((course, index) => (
                                        <div key={index} className="flex border p-4 mb-4 rounded shadow-lg">
                                            <img src={course.course_image_URL} alt={course.course_title} className="w-24 h-24 object-cover rounded mr-4" />
                                            <div>
                                                <h2 className="text-xl font-bold mb-2">{course.course_title}</h2>
                                                <p className="text-gray-700 mb-2"><strong>Organization:</strong> {course.course_organization}</p>
                                                <p className="text-gray-700 mb-2"><strong>Skills:</strong> {course.skills}</p>
                                                <p className="text-gray-700 mb-2"><strong>Certificate Type:</strong> {course.course_Certificate_type}</p>
                                                <a href={course.course_URL} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                    View Course
                                                </a>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No courses found.</p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Courses;