"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";

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

    const handleSearch = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/api/courses?title=${searchTerm}`);
        const data = await response.json();
        setCourses(data.courses);  // Access the courses array from the response object
    };

    return (
        <>
            <Navbar />
            <div className="flex flex-col md:flex-row p-8 bg-white">
                <div className="flex flex-col w-full md:w-[65%] px-8 text-black bg-white">
                    <h1 className="w-full text-black text-2xl md:text-2xl font-bold mb-4">
                        Boost your chances of getting your desired job with these courses
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
                    <div className="mt-8">
                        {courses.length > 0 ? (
                            courses.map((course, index) => (
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

export default Courses;