import React from "react"

export const Login = () => {
    return (
        <div className="h-screen flex items-center justify-center bg-gray-800 font-sans">
            <div className="bg-white w-full max-w-screen-sm py-10 rounded-lg text-center">
                <h3 className="text-3xl text-gray-800"> Log in </h3>
                <form className="flex flex-col mt-5 px-5">
                    <input
                        className="bg-gray-100 mb-3 py-3 px-5 rounded-lg shadow-inner focus:outline-none border-2 focus:border-green-800 focus:border-opacity-50 text-gray-800"
                        placeholder="Email" />
                    <input
                        className="bg-gray-100 py-3 px-5 rounded-lg shadow-inner focus:outline-none border-2 focus:border-green-800 focus:border-opacity-50 text-gray-800"
                        placeholder="Password" />
                    <button className="bg-green-800 text-white py-2.5 rounded-lg shadow-inner focus:outline-none mt-3 text-lg hover:opacity-90">
                        Log in
                    </button>
                </form>
            </div>
        </div>
    )
}