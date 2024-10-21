import { useEffect, useState } from "react"
import { IDishProps } from "./dish"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"


export const MenuItem: React.FC<IDishProps> = ({ id, name, price, description, photo, options, restaurantId, addItemToOrder, orderStarted=false}) => {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedOptions, setSelectedOptions] = useState({})

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isModalOpen])

    return (
        <>
            <div>
                <div className="cursor-pointer flex flex-col bg-white shadow-md rounded-lg overflow-hidden w-full max-w-md mx-auto"
                onClick={() => setIsModalOpen(true)}
                >
                    <img src={photo} alt={name} className="w-full h-64 object-cover" />
                    <div className="p-6">
                        <h3 className="text-2xl font-semibold mb-2">{name}</h3>
                        <p className="text-xl font-medium text-gray-700 mb-3">${price}</p>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-5 rounded-lg max-w-lg w-11/12 max-h-[90vh] overflow-auto">
                        <div className="flex justify-between mb-5">
                            <h2 className="text-2xl font-semibold mb-4">{name}</h2>
                            <button className="text-gray-500 hover:text-gray-700 transition"
                            onClick={() => setIsModalOpen(false)}
                        >
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>
                        <div>
                        <p className="mb-4">{description}</p>
                        <p className="text-xl font-medium text-gray-700 mb-4">${price}</p>
                        
                        {options && options.map((option, index) => (
                            <div key={index} className="mb-4">
                                <label className="block mb-2">{option.name}</label>
                                <select 
                                    className="w-full p-2 border rounded"
                                    onChange={(e) => setSelectedOptions({...selectedOptions, [option.name]: e.target.value})}
                                >
                                    {option.choices.map((choice, idx) => (
                                        <option key={idx} value={choice.extra}>{`${choice.name} + $${choice.extra}`}</option>
                                    ))}
                                </select>
                                </div>
                            ))}
                            <button className="bg-lime-600 text-white px-5 py-2 rounded-md mt-5 hover:bg-lime-700 transition"
                            onClick={() => (orderStarted ? addItemToOrder(id) : null)}
                            >Add to Order</button>
                        </div>
                    </div>
            
                </div>
            )}
        </>
    )
}