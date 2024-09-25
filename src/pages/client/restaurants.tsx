import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { RestaurantsPageQueryQuery, RestaurantsPageQueryQueryVariables } from "../../__generated__/graphql";

const RESTAURANTS_QUERY = gql`
    query restaurantsPageQuery($input: RestaurantsInput!) {
        allCategories{
            ok
            error
            categories{
                id
                name
                coverImg
                slug
                restaurantCount
            }
        }
        restaurants(input: $input){
            ok
            error
            totalPages
            totalResults
            results{
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

export const Restaurants = () => {
    const { data, loading } = useQuery<RestaurantsPageQueryQuery, RestaurantsPageQueryQueryVariables>(RESTAURANTS_QUERY, {
        variables: {
            input: {
                page: 1
            }
        }
    })
    return (
        <div>
            <HelmetProvider>
                <Helmet>
                    <title>Restaurants | Super Eats</title>
                </Helmet>
            </HelmetProvider>
            <form className="bg-teal-950 w-full py-40 flex items-center justify-center">
                <input className="input w-2/4 rounded-md border-0 px-5 py-2.5 placeholder-gray-500" type="search" placeholder="What are you craving today?" />
            </form>
            {!loading &&
                <div className="max-w-screen-xl mx-auto mt-5">
                    <div className="flex justify-around mx-auto">
                        {data?.allCategories.categories?.map(category => <div key={category.id} className="flex flex-col items-center group">
                            <div key={category.id} className="w-16 h-16 rounded-full bg-cover group-hover:bg-gray-200 cursor-pointer"
                                style={{ backgroundImage: `url(${category.coverImg})` }}></div>
                            <span key={category.name} className="mt-1 text-gray-800 text-sm font-medium cursor-pointer">{category.name}</span>
                        </div>)}
                    </div>
                    <div className="grid grid-cols-3 gap-7 mt-10">
                        {data?.restaurants.results?.map((restaurant) => (
                            <div key={restaurant.id}>
                            <div className="py-28 bg-cover bg-center mb-2"
                                style={{ backgroundImage: `url(${restaurant.coverImg})` }}></div>
                            <span key={restaurant.name} className="mt-1 text-gray-800 text-lg font-medium">{restaurant.name}</span>
                            <span key={restaurant.category?.name} className="mt-1 text-gray-500 text-sm font-medium">{restaurant.category?.name}</span>
                        </div>))}
                    </div>
                </div>
            }
        </div>
    )
}