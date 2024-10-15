import { IDishProps } from "./dish"

export const MenuItem: React.FC<IDishProps> = ({ id, name, price, description, photo, options, restaurantId }) => {
    return (
        <div>
            <div className="flex flex-col bg-white shadow-md rounded-lg overflow-hidden w-full max-w-md mx-auto">
                <img src={photo} alt={name} className="w-full h-64 object-cover" />
                <div className="p-6">
                    <h3 className="text-2xl font-semibold mb-2">{name}</h3>
                    <p className="text-xl font-medium text-gray-700 mb-3">${price}</p>
                    <p className="text-base text-gray-600 overflow-hidden">{description}</p>
                </div>
            </div>
        </div>
    )
}