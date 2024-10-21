import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"


export interface IDishProps {
    id: number
    name: string
    price: number
    description: string
    photo: string
    options: {
        name: string,
        choices: { name: string, extra: number }[],
        extra: number
    }[]
    restaurantId: number
    isSelected?: boolean
    orderStarted?: boolean
    addItemToOrder: (itemId: number) => void
}
export const Dish: React.FC<IDishProps> = ({ orderStarted = false, id, name, price, description, photo, options, restaurantId, addItemToOrder }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isModalOpen])

    return (
        <>
            <div
                className="px-8 py-4 border cursor-pointer hover:border-gray-800 transition-all"
                onClick={() => setIsModalOpen(true)}
            >
                <h3 className="text-lg font-medium mb-5">{name}</h3>
                <span className="font-light">${price.toFixed(2)}</span>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-5 rounded-lg max-w-lg w-11/12 max-h-[90vh] overflow-auto">
                        <div className="flex justify-between mb-5">
                            <Link to={`/restaurant/${restaurantId}/edit-dish/${id}`} className="text-sm bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700 transition">
                                Edit
                            </Link>
                            <button
                                className="text-gray-500 hover:text-gray-700 transition"
                                onClick={() => setIsModalOpen(false)}
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>
                        <img src={photo} alt={name} className="w-full h-auto" />
                        <p className="mt-4 font-bold text-lg">{description}</p>
                        <p className="mt-2">${price.toFixed(2)}</p>
                        <div className="mt-4">
                            {options.map((option) => (
                                <div key={option.name}>
                                    <h4 className="font-bold">{option.name}</h4>
                                    {option.extra !== 0 && (
                                        <p>+${option.extra.toFixed(2)}</p>
                                    )}
                                    <ul>
                                        {option.choices.map((choice) => (
                                            <li key={choice.name}>
                                                {choice.name} (+${choice.extra.toFixed(2)})
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}