import { gql, useQuery } from "@apollo/client"
import { faCircleInfo, faShoppingCart, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { Helmet, HelmetProvider } from "react-helmet-async"
import { useParams } from "react-router-dom"
import { CreateOrderItemInput, RestaurantQuery, RestaurantQueryVariables } from "../../__generated__/graphql"
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

const CREATE_ORDER_MUTATION = gql`
    mutation createOrder($input: CreateOrderInput!) {
        createOrder(input: $input) {
            ok
            error
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
    const [orderStarted, setOrderStarted] = useState(false)
    const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([])
    const triggerStartOrder = () => {
        setOrderStarted(true)
    }
    const addItemToOrder = (itemId: number) => {
        if (orderItems.find((orderItem)=> orderItem.dishId === itemId)) return
        setOrderItems(current=> [{dishId:itemId}, ...current])
    }
    console.log(orderItems)
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
                    <button className="bg-lime-600 text-white px-5 py-2 rounded-md mt-5 hover:bg-lime-700 transition flex items-center gap-2" onClick={triggerStartOrder}>
                        <FontAwesomeIcon icon={faShoppingCart} />
                        {orderStarted ? `Ordering ${orderItems.length}` : "Start Order"}
                    </button>
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
            {data?.restaurant.restaurant?.menu?.length === 0 ? (
                <div className="text-center text-lg mt-10">
                    <p>Coming Soon...</p>
                </div>
            ) : (
                <div className="px-5 md:px-10 lg:px-20 xl:px-20 mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {data?.restaurant.restaurant?.menu?.map((dish: any) => (
                        <MenuItem
                            isSelected = {orderItems.find((orderItem)=> orderItem.dishId === dish.id) ? true : false}
                            orderStarted = {orderStarted}
                            key={dish.id}
                            id={dish.id}
                            name={dish.name}
                            price={dish.price}
                            description={dish.description}
                            photo={dish.photo}
                            options={dish.options || []}
                            restaurantId={data?.restaurant.restaurant?.id!}
                            addItemToOrder={addItemToOrder}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}