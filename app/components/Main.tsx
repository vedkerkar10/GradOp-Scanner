import React, { useState } from 'react';
import Link from "next/link";

interface Main {
    onSearch: (searchParams: {
        keyword: string;
        location: string;
        dateSincePosted: string;
        jobType: string;
        remoteFilter: string;
        salary: string;
        experienceLevel: string;
        limit: string;
        sortBy: string;
    }) => void;
}

const Main: React.FC<Main> = ({ onSearch }) => {
    const [keyword, setKeyword] = useState("");
    const [location, setLocation] = useState("");
    const [dateSincePosted, setDateSincePosted] = useState("");
    const [jobType, setJobType] = useState("");
    const [remoteFilter, setRemoteFilter] = useState("");
    const [salary, setSalary] = useState("");
    const [experienceLevel, setExperienceLevel] = useState("");
    const [limit, setLimit] = useState("20");
    const [sortBy, setSortBy] = useState("");
    const [step, setStep] = useState(0);

    const nextStep = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setStep(step + 1);
    };

    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSearch({
            keyword,
            location,
            dateSincePosted,
            jobType,
            remoteFilter,
            salary,
            experienceLevel,
            limit,
            sortBy,
        });
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, type: string, value: string) => {
        e.preventDefault();
        if (type === 'keyword') {
            setKeyword(value);
        } else if (type === 'location') {
            setLocation(value);
        }
        nextStep(e);
    };

    return (
        <div className="flex flex-col md:flex-row items-center md:justify-center min-h-screen bg-white p-4 md:p-8">
            <div className="w-full md:w-1/2 mx-4 md:mx-8 relative text-black">

                <form
                    onSubmit={handleSearch}
                    className="w-full bg-gray-100 p-4 md:p-6 rounded-lg shadow-md overflow-hidden"
                >
                    <div className={`w-full flex flex-col transition-opacity duration-500 ease-in-out ${step === 0 ? 'opacity-100' : 'opacity-0'} ${step === 0 ? 'block' : 'hidden'}`}>
                        <span className='md:text-7xl text-4xl mb-4'>Looking for the perfect job?</span>
                        <span className='md:text-4xl text-2xl'> We've got you covered!</span>
                        <button className='text-white bg-green-500 p-4 mt-8 w-36' type='button' onClick={nextStep} >Get Started</button>
                    </div>

                    <div className={`transition-opacity duration-500 ease-in-out ${step === 1 ? 'opacity-100' : 'opacity-0'} ${step === 1 ? 'block' : 'hidden'}`}>
                        <h2 className="text-xl md:text-2xl font-bold mb-4">Which degree are you having or currently pursuing?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-1">
                            <button type="button" onClick={nextStep} className="p-2 border border-gray-300 rounded">Computer Science</button>
                            <button type="button" onClick={nextStep} className="p-2 border border-gray-300 rounded">Mechanical Engineering</button>
                            <button type="button" onClick={nextStep} className="p-2 border border-gray-300 rounded">Civil Engineering</button>
                            <button type="button" onClick={nextStep} className="p-2 border border-gray-300 rounded">Electronic and Telecommunication</button>
                        </div>
                    </div>
                    <div className={`transition-opacity duration-500 ease-in-out ${step === 2 ? 'opacity-100' : 'opacity-0'} ${step === 2 ? 'block' : 'hidden'}`}>
                        <h2 className="text-xl md:text-2xl font-bold mb-4">What are your career interests?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-1">
                            <button type="button" onClick={nextStep} className="p-2 border border-gray-300 rounded">Software Developer</button>
                            <button type="button" onClick={nextStep} className="p-2 border border-gray-300 rounded">UI/UX Designer</button>
                            <button type="button" onClick={nextStep} className="p-2 border border-gray-300 rounded">AI Engineer</button>
                            <button type="button" onClick={nextStep} className="p-2 border border-gray-300 rounded">Cybersecurity</button>
                        </div>
                    </div>
                    <div className={`transition-opacity duration-500 ease-in-out ${step === 3 ? 'opacity-100' : 'opacity-0'} ${step === 3 ? 'block' : 'hidden'}`}>
                        <h2 className="text-xl md:text-2xl font-bold mb-4">Which skills do you possess?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-1">
                            <button type="button" onClick={(e) => handleClick(e, 'keyword', 'Frontend Developer')} className="p-2 border border-gray-300 rounded">Frontend Developer</button>
                            <button type="button" onClick={(e) => handleClick(e, 'keyword', 'Backend Developer')} className="p-2 border border-gray-300 rounded">Backend Developer</button>
                            <button type="button" onClick={(e) => handleClick(e, 'keyword', 'AI ML')} className="p-2 border border-gray-300 rounded">AI ML</button>
                            <button type="button" onClick={(e) => handleClick(e, 'keyword', 'Fullstack Developer')} className="p-2 border border-gray-300 rounded">Fullstack Developer</button>
                        </div>
                        <div className="mt-4">
                            <input 
                                type="text" 
                                placeholder="Enter custom location" 
                                value={location} 
                                onChange={(e) => setLocation(e.target.value)} 
                                className="p-2 border border-gray-300 rounded w-full"
                            />
                            <button 
                                type="button" 
                                onClick={(e) => handleClick(e, 'location', location)} 
                                className="mt-2 p-2 bg-blue-500 text-white rounded"
                            >
                                Submit Location
                            </button>
                        </div>
                    </div>
                    <div className={`transition-opacity duration-500 ease-in-out ${step === 4 ? 'opacity-100' : 'opacity-0'} ${step === 4 ? 'block' : 'hidden'}`}>
                        <h2 className="text-xl md:text-2xl font-bold mb-4">Preferred Job Location</h2>
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-1">
                            <button type="button" onClick={(e) => handleClick(e, 'location', 'Bangalore')} className="p-2 border border-gray-300 rounded">Bangalore</button>
                            <button type="button" onClick={(e) => handleClick(e, 'location', 'Mumbai')} className="p-2 border border-gray-300 rounded">Mumbai</button>
                            <button type="button" onClick={(e) => handleClick(e, 'location', 'Chennai')} className="p-2 border border-gray-300 rounded">Chennai</button>
                            <button type="button" onClick={(e) => handleClick(e, 'location', 'Hyderabad')} className="p-2 border border-gray-300 rounded">Hyderabad</button>
                        </div>
                    </div>
                    {step === 5 && (
                        <>
                            <div className="mt-6">
                                <p className="text-gray-600">OR</p>
                                <p className="text-green-500">Upload your CV and start your journey today.</p>
                                <input type="file" className="mt-2 block w-full text-gray-700 border border-gray-300 rounded p-2" />
                            </div>
                            <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 mt-4">Submit</button>
                        </>
                    )}
                </form>
            </div>
            <img src="/illustration.png" alt="Illustration" className="mt-6 w-full md:w-1/2" />
        </div>
    );
};

export default Main;