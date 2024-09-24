import React from "react";

interface IButtonProps {
    canClick: boolean;
    loading: boolean;
    actionText: string;
}

export const Button: React.FC<IButtonProps> = ({ canClick, loading, actionText }) => {
    return <button className={`text-white text-lg font-medium py-2.5 focus:outline-none ${canClick ? "bg-lime-600 shadow-inner hover:bg-lime-700 transition-colors" : "bg-gray-300 pointer-events-none"}`}>
        {loading ? "Loading..." : actionText}
    </button>
}