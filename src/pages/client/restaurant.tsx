import { gql, useQuery } from "@apollo/client"
import { useParams } from "react-router-dom"
import { RestaurantQuery, RestaurantQueryVariables } from "../../__generated__/graphql"
import { Helmet, HelmetProvider } from "react-helmet-async"
import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleInfo, faXmark } from "@fortawesome/free-solid-svg-icons"

const RESTAURANT_QUERY = gql`
    query restaurant($input: RestaurantInput!) {
        restaurant(input: $input) {
            ok
            error
            restaurant {
                id
                name
                coverImg
                category{
                    name
                    coverImg
                }
                address
                isPromoted
            }
        }
    }
`

interface IRestaurantParams {
    id: string
}

export const Restaurant= () => {
    const params = useParams<IRestaurantParams>()
    const [restaurantName, setRestaurantName] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { data, loading } = useQuery<RestaurantQuery, RestaurantQueryVariables>(RESTAURANT_QUERY, {
        variables: {
            input: {
                restaurantId: +params.id
            }
        }
    })
    useEffect(() => {
        if (data) {
            setRestaurantName(data.restaurant.restaurant?.name!)
        }
    }, [data])
    console.log(data)
    return (
        <div>
            <HelmetProvider>
                <Helmet>
                    <title>
                        {restaurantName} | Super Eats
                    </title>
                </Helmet>
            </HelmetProvider>
            <div className="py-48 bg-cover bg-center" style={{ backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})` }}>
            </div>
            <div className="mt-5">
                <div className="px-5 md:px-10 lg:px-20 xl:px-20">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-medium mb-1">{restaurantName}</h1>
                        <button
                            className="underline text-medium text-gray-500"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <FontAwesomeIcon icon={faCircleInfo} />
                        </button>
                    </div>
                    {data?.restaurant.restaurant?.isPromoted && (
                        <span className="text-green-600 font-medium">Promoted</span>
                    )}
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
                            <h3 className="text-xl font-medium mb-2">Cuisine: {data?.restaurant.restaurant?.category?.name}</h3>
                            <p className="text-lg mb-4">{data?.restaurant.restaurant?.address}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}