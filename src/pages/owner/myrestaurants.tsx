import { gql, useQuery } from "@apollo/client"
import { MyRestaurantsQuery, MyRestaurantsQueryVariables } from "../../__generated__/graphql"
import { Helmet, HelmetProvider } from "react-helmet-async"
import { Link } from "react-router-dom"
import { Restaurant } from "../../components/restaurant"

const MY_RESTAURANTS_QUERY = gql`
    query myRestaurants {
        myRestaurants {
            ok
            error
            myRestaurants{
                id
                name
                coverImg
                category{
                    name
                }
                address
                isPromoted  
            }
        }
    }
`

export const MyRestaurants = () => {
    const { data } = useQuery<MyRestaurantsQuery, MyRestaurantsQueryVariables>(MY_RESTAURANTS_QUERY)
    return (
        <div>
            <HelmetProvider>
                <Helmet>
                    <title>Dashboard | Super Eats</title>
                </Helmet>
            </HelmetProvider>
            <div className="flex justify-between items-center mb-6 px-3 md:px-5">
                <h1 className="text-2xl md:text-3xl font-bold">Owner Dashboard</h1>
                <Link to="/add-restaurant" className="bg-lime-500 text-white px-4 py-2 rounded-md hover:bg-lime-600">
                    + New Restaurant
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">My Restaurants</h2>
                    {data?.myRestaurants.ok && data.myRestaurants.myRestaurants?.length === 0 ? (
                        <p className="text-gray-600">You have no restaurants</p>
                    ) : (
                        <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {data?.myRestaurants.myRestaurants?.map(restaurant => (
                                <li key={restaurant.id} className="mb-2">
                                     <Restaurant key={restaurant.id} id={restaurant.id + ""} coverImg={restaurant.coverImg} name={restaurant.name} categoryName={restaurant.category?.name} />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Price Generated</h2>
                    {/* Add price generated content here */}
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Current Orders</h2>
                    {/* Add current orders content here */}
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Archived Orders</h2>
                    {/* Add archived orders content here */}
                </div>
            </div>
        </div>
    )
}