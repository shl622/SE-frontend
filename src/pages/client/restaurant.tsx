import { gql, useQuery } from "@apollo/client"
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { Helmet, HelmetProvider } from "react-helmet-async"
import { useParams } from "react-router-dom"
import { RestaurantQuery, RestaurantQueryVariables } from "../../__generated__/graphql"
import { MenuItem } from "../../components/menu-item"

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
                address
                isPromoted
            }
        }
    }
`

interface IRestaurantParams {
    id: string
}

export const Restaurant = () => {
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
    console.log(data)
    useEffect(() => {
        if (data) {
            setRestaurantName(data.restaurant.restaurant?.name!)
        }
    }, [data])
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

            {data?.restaurant.restaurant?.menu?.length === 0 ? (
                <div className="text-center text-lg mt-10">
                    <p>Coming Soon...</p>
                </div>
            ) : (
                <div className="px-5 md:px-10 lg:px-20 xl:px-20 mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {data?.restaurant.restaurant?.menu?.map((dish: any) => (
                        <MenuItem
                            key={dish.id}
                            id={dish.id}
                            name={dish.name}
                            price={dish.price}
                            description={dish.description}
                            photo={dish.photo}
                            options={dish.options || []}
                            restaurantId={data?.restaurant.restaurant?.id!} />
                    ))}
                </div>
            )}
        </div>
    )
}