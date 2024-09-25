import React from "react";

interface ICategoryProps {
    coverImg: string | null | undefined
    name: string
}

export const Category: React.FC<ICategoryProps> = ({ coverImg, name }) => {
    return (
        <div className="flex flex-col items-center group">
            <div className="w-16 h-16 rounded-full bg-cover group-hover:bg-gray-200 cursor-pointer"
                style={{ backgroundImage: `url(${coverImg})` }}>
            </div>
            <span className="mt-1 text-gray-800 text-sm font-medium cursor-pointer">{name}</span>
        </div>
    )
}