import React from "react";
import eatsLogo from "../assets/mobile-logo.png";
import { useCurrAuth } from "../hooks/useCurrAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export const Header: React.FC = () => {
    const { data } = useCurrAuth()
    return (
        <header className="py-4">
            <div className="w-full px-5 xl:px-0max-w-screen-xl mx-auto flex justify-between items-center">
                <img src={eatsLogo} className="w-12" alt="Super Eats" />
                <span className="text-xs flex items-center">
                    <FontAwesomeIcon icon={faUser}/>
                    <span className="text-sm">{data?.currAuth?.email}</span>
                </span>
            </div>
        </header>
    )
}