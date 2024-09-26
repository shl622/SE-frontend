import { gql, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link, useHistory, useLocation } from "react-router-dom";
import { CategoryQueryQuery, CategoryQueryQueryVariables, SearchRestaurantsQuery, SearchRestaurantsQueryVariables } from "../../__generated__/graphql";
import { Restaurant } from "../../components/restaurant";
import { Category } from "../../components/category";

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

const SEARCH_CATEGORIES_QUERY = gql`
    query searchCategories($input: CategoryInput!){
        category(input: $input){
            ok
            error
            totalResults
            category{
                id
                name
                coverImg
                slug
            }
        }
    }
`
export const Search = () => {
    const location = useLocation()
    const history = useHistory()
    const [callRestaurantQuery, { loading, data }] = useLazyQuery<SearchRestaurantsQuery, SearchRestaurantsQueryVariables>(SEARCH_RESTAURANTS_QUERY)
    const [callCategoryQuery, { loading: categoryLoading, data: categoryData }] = useLazyQuery<CategoryQueryQuery, CategoryQueryQueryVariables>(SEARCH_CATEGORIES_QUERY)
    const [searchQuery, setSearchQuery] = useState("")
    useEffect(() => {
        const [_, searchQuery] = location.search.split("?term=")
        const safeQuery = searchQuery || ""
        setSearchQuery(safeQuery)
        console.log("searchQuery", searchQuery)
        if (!searchQuery) {
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
        callCategoryQuery({
            variables: {
                input: {
                    page: 1,
                    slug: searchQuery
                }
            }
        })
    }, [history, location])
    console.log("slug", categoryData?.category?.category?.slug)
    return (
        <div>
            <HelmetProvider>
                <Helmet>
                    <title>
                        {searchQuery 
                            ? `Search Results for ${searchQuery} | Super Eats` 
                            : "Search | Super Eats"}
                    </title>
                </Helmet>
            </HelmetProvider>
            <div className="bg-teal-950 w-full py-10 md:py-20 flex items-center justify-left px-4 md:px-10 mb-10">
                <div className="flex items-center">
                    <h1 className="text-2xl font-xs text-gray-100">
                        Showing {(data?.searchRestaurant?.totalResults || 0) + (categoryData?.category.category ? 1 : 0)} results for "{searchQuery}"
                    </h1>
                </div>
            </div>
            {!loading && !categoryLoading && (
                <div className="px-4">
                    {/* Category Results */}
                    {categoryData?.category?.category && (
                        <div className="mb-8">
                            <h2 className="border-b-2 border-gray-300 pb-2 text-xl font-semibold mb-4">Category</h2>
                            <div className="flex items-center space-x-4">
                                <Link to={`/category/${categoryData?.category?.category?.slug + ""}`}>
                                    <Category coverImg={categoryData?.category?.category?.coverImg} name={categoryData?.category?.category?.name} />
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Restaurant Results */}
                    <h2 className="border-b-2 border-gray-300 text-xl font-semibold mb-4">Restaurants</h2>
                    {data?.searchRestaurant?.totalResults === 0 ? (
                        <div className="text-center text-xl text-gray-600">
                            Sorry, no restaurants were found.
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 items-center">
                            {data?.searchRestaurant?.restaurants?.map((restaurant) => (
                                <Restaurant
                                    key={restaurant.id}
                                    id={restaurant.id + ""}
                                    coverImg={restaurant.coverImg}
                                    name={restaurant.name}
                                    categoryName={restaurant.category?.name}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}