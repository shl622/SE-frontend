import React from "react";
import eatsLogo from "../assets/mobile-logo.png";
import { useCurrAuth } from "../hooks/useCurrAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export const Header: React.FC = () => {
    const { data } = useCurrAuth()
    return (
        <>
            {!data?.currAuth.verified &&
                <div role="verify-email" className="bg-red-500 text-center text-sm p-3">
                    <span>Please verify your email</span>
                </div>}
            <header className="py-4">
                <div className="w-full px-5 xl:px-0max-w-screen-xl mx-auto flex justify-between items-center">
                    <Link to="/">
                        <div className="flex items-center gap-2">
                            <img src={eatsLogo} className="w-12 border-2 border-lime-600 border-opacity-40 rounded-full" alt="Super Eats" />
                            <h1 className="text-2xl font-semibold bg-gradient-to-r from-lime-600 to-green-400 text-transparent bg-clip-text">Super Eats</h1>
                        </div>
                    </Link>
                    <span className="text-xs flex items-center gap-2">
                        <Link to="/edit-profile">
                            <FontAwesomeIcon icon={faUser} />
                        </Link>
                        <span className="text-sm">{data?.currAuth?.email}</span>
                    </span>
                </div>
            </header>
        </>
    )
}