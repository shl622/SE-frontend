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
    const {data, loading} = useQuery<RestaurantsPageQueryQuery, RestaurantsPageQueryQueryVariables>(RESTAURANTS_QUERY, {
        variables: {
            input: {
                page: 1
            }
        }
    })
    console.log(data)
    return(
        <div>
            <HelmetProvider>
                <Helmet>
                    <title>Restaurants | Super Eats</title>
                </Helmet>
            </HelmetProvider>
            <h1>Restaurants</h1>
        </div>
    )
}