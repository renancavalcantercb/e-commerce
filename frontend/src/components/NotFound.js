import React from 'react';

function NotFound() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            <div className="bg-white p-8 rounded-md shadow-md">
                <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
                <p className="mb-4">Sorry, the page you are looking for does not exist.</p>
                <a href="/" className="text-blue-500 hover:underline">Go back to the home page</a>
            </div>
        </div>
    );
}

export default NotFound;
