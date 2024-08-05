import React from 'react';

const Main = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <form className="w-full max-w-lg bg-gray-100 p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <label className="block text-gray-700">Which degree are you having or currently pursuing?</label>
                    <input type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded" placeholder="Educational qualification" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">What are your career ambitions?</label>
                    <input type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded" placeholder="Fields of Interests" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Which skills do you possess?</label>
                    <input type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded" placeholder="Technical, Non-Technical" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Preferred Job Location</label>
                    <input type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded" placeholder="Location" />
                </div>
                <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">Submit</button>
            </form>
            <div className="mt-6">
                <p className="text-gray-600">OR</p>
                <p className="text-green-500">Upload your CV and start your journey today.</p>
            </div>
            <img src="/illustration.png" alt="Illustration" className="mt-6 w-1/2" />
        </div>
    );
};

export default Main;