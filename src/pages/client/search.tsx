import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useHistory, useLocation } from "react-router-dom";
import { SearchRestaurantsQuery, SearchRestaurantsQueryVariables } from "../../__generated__/graphql";

const SEARCH_RESTAURANTS_QUERY = gql`
    query searchRestaurants($input: SearchRestaurantInput!){
        searchRestaurant(input: $input){
            ok
            error
            totalPages
            totalResults
            restaurants{
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

export const Search = () => {
    const location = useLocation()
    const history = useHistory()
    const [callRestaurantQuery, {loading, data, called}] = useLazyQuery<SearchRestaurantsQuery, SearchRestaurantsQueryVariables>(SEARCH_RESTAURANTS_QUERY)
    const [searchQuery, setSearchQuery] = useState("")
    useEffect(() => {
        const [_, searchQuery] = location.search.split("?term=")
        setSearchQuery(searchQuery)
        if(!searchQuery){
            history.replace("/")
        }
        callRestaurantQuery({
            variables: {
                input: {
                    page: 1,
                    query: searchQuery
                }
            }
        })
    }, [history, location])
    console.log(loading,data, called)
    return (
        <div>
            <HelmetProvider>
                <Helmet>
                    <title>{searchQuery ? `${searchQuery} | Super Eats` : "Search | Super Eats"}</title>
                </Helmet>
            </HelmetProvider>
            <h1>Search</h1>
        </div>
    )
}