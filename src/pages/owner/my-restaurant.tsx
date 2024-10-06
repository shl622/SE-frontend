import { gql, useQuery } from "@apollo/client"
import { Link, useParams } from "react-router-dom"
import { MyRestaurantQuery, MyRestaurantQueryVariables } from "../../__generated__/graphql"
import { Helmet, HelmetProvider } from "react-helmet-async"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleInfo, faPencilAlt, faXmark } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from "react"
import { Dish } from "../../components/dish"

interface IParams {
    restaurantId: string
}

export const MY_RESTAURANT_QUERY = gql`
    query myRestaurant($input: MyRestaurantInput!) {
        myRestaurant(input: $input) {
            ok
            error
            restaurant {
                id
                name
                address
                createdAt
                updatedAt
                category {
                    name
                }
                menu{
                    id
                    name
                    price
                    description
                    photo
                    options{
                        name
                        extra
                        choices{
                            name
                            extra
                        }
                    }
                }
                coverImg
                address
                isPromoted
                promotedUntil
            }
        }
    }
`
export const MyRestaurant = () => {
    const { restaurantId } = useParams<IParams>()
    const { data } = useQuery<MyRestaurantQuery, MyRestaurantQueryVariables>(MY_RESTAURANT_QUERY, {
        variables: {
            input: {
                id: +restaurantId
            }
        }
    })
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [restaurantName, setRestaurantName] = useState("")
    useEffect(() => {
        if (data) {
            setRestaurantName(data.myRestaurant.restaurant?.name!)
        }
    }, [data])
    return (
        <div>
            <HelmetProvider>
                <Helmet>
                    <title>
                        {restaurantName} Admin | Super Eats
                    </title>
                </Helmet>
            </HelmetProvider>
            <div className="py-48 bg-cover bg-center" style={{ backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})` }}>
            </div>
            <div className="mt-5">
                <div className="px-5 md:px-10 lg:px-20 xl:px-20">
                    <div className="flex flex-col items-start">
                        <Link
                            to={`/restaurant/${restaurantId}/edit`}
                            className="mb-3 text-sm bg-lime-600 text-white py-1 px-3 rounded hover:bg-lime-700 transition"
                        >
                            <FontAwesomeIcon icon={faPencilAlt} className="mr-1" />
                            Edit
                        </Link>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-medium">{restaurantName}</h1>
                            <button
                                className="text-sm text-gray-500 hover:text-gray-700"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <FontAwesomeIcon icon={faCircleInfo} className="mr-1" />
                            </button>
                        </div>
                        <div className="mt-2 flex items-center gap-3">
                            {data?.myRestaurant.restaurant?.isPromoted ? (
                                <span className="text-green-600 font-medium mt-1">Promoted</span>
                            ) : (
                                <Link
                                    to={``}
                                    className="mt-2 text-sm bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700 transition"
                                >
                                    Purchase Promotion
                                </Link>
                            )}
                            <Link
                                to={`/restaurant/${restaurantId}/add-dish`}
                                className="mt-2 text-sm bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700 transition"
                            >
                                Add Menu Item
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold">{restaurantName}</h2>
                                <button
                                    className="text-gray-500 hover:text-gray-700 transition"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    <FontAwesomeIcon icon={faXmark} />
                                </button>
                            </div>
                            <h3 className="text-xl font-medium mb-2">Cuisine: {data?.myRestaurant.restaurant?.category?.name}</h3>
                            <p className="text-lg mb-4">{data?.myRestaurant.restaurant?.address}</p>
                        </div>
                    </div>
                </div>
            )}
            <div>
                {data?.myRestaurant.restaurant?.menu?.length === 0 ? (
                    <h4 className="text-2xl font-medium text-center mt-10">Please upload menu items</h4>
                ) : 
                <div className="px-5 md:px-10 lg:px-20 xl:px-20 mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {data?.myRestaurant.restaurant?.menu?.map((dish:any)=>(
                        <Dish 
                        key={dish.id} 
                        name={dish.name} 
                        price={dish.price} 
                        description={dish.description} 
                        photo={dish.photo} 
                        options={dish.options || []} />
                    ))}
                </div>}
            </div>
        </div>

    )
}