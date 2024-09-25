import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { RestaurantsPageQueryQuery, RestaurantsPageQueryQueryVariables } from "../../__generated__/graphql";
import { Restaurant } from "../../components/restaurant";
import { Category } from "../../components/category";

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
    const [page, setPage] = useState(1)
    const { data, loading } = useQuery<RestaurantsPageQueryQuery, RestaurantsPageQueryQueryVariables>(RESTAURANTS_QUERY, {
        variables: {
            input: {
                page
            }
        }
    })
    const onNextPageClick = () => setPage((current) => current + 1)
    const onPrevPageClick = () => setPage((current) => current - 1)
    return (
        <div>
            <HelmetProvider>
                <Helmet>
                    <title>Restaurants | Super Eats</title>
                </Helmet>
            </HelmetProvider>
            <form className="bg-teal-950 w-full py-20 md:py-40 flex items-center justify-center px-4 md:px-0">
                <input className="input w-3/4 rounded-md border-0 px-5 py-2.5 placeholder-gray-500 md:w-1/2" type="search" placeholder="What are you craving today?" />
            </form>
            {!loading &&
                <div className="max-w-screen-2xl mx-auto mt-5 pb-20">
                    <div className="grid grid-cols-4 gap-x-4 gap-y-6 mx-auto px-4 md:flex md:justify-around md:px-0">
                        {data?.allCategories.categories?.map(category => (
                            <Category key={category.id} coverImg={category.coverImg} name={category.name} />
                        ))}
                    </div>
                    <div className="grid px-4 md:px-1 md:grid-cols-3 gap-7 mt-10">
                        {data?.restaurants.results?.map((restaurant) => (
                            <Restaurant key={restaurant.id} id={restaurant.id + ""} coverImg={restaurant.coverImg} name={restaurant.name} categoryName={restaurant.category?.name} />
                        ))}
                    </div>
                    <div className="flex justify-center items-center mt-10">
                        <span className="mx-1">
                        {page} of {data?.restaurants.totalPages}
                        </span>
                        {page !== data?.restaurants.totalPages &&
                            <button className="font-medium text-lg focus:outline-none" onClick={onNextPageClick}>&rarr;</button>
                        }
                        {page !== 1 &&
                            <button className="font-medium text-lg focus:outline-none" onClick={onPrevPageClick}>&larr;</button>
                        }
                    </div>
                </div>
            }
        </div>
    )
}