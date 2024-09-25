import { gql, useQuery } from "@apollo/client";
import React from "react";
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
                        {data?.allCategories.categories?.map(category => <Category key={category.id} coverImg={category.coverImg} name={category.name} />)}
                    </div>
                    <div className="grid grid-cols-3 gap-7 mt-10">
                        {data?.restaurants.results?.map((restaurant) => (<Restaurant key={restaurant.id} coverImg={restaurant.coverImg} name={restaurant.name} categoryName={restaurant.category?.name} />))}
                    </div>
                </div>
            }
        </div>
    )
}