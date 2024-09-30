import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { RestaurantsPageQueryQuery, RestaurantsPageQueryQueryVariables } from "../../__generated__/graphql";
import { Category } from "../../components/category";
import { Restaurant } from "../../components/restaurant";

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

interface IFormProps {
    searchQuery: string
}

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
    const renderPageNumbers = () => {
        const totalPages = data?.restaurants.totalPages || 0
        const pageNumbers = []
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`mx-2 px-3 py-1 rounded focus:outline-none ${i === page
                            ? 'font-bold text-teal-950'
                            : 'font-normal text-gray-500 hover:text-teal-950'
                        }`}
                >
                    {i}
                </button>
            )
        }
        return pageNumbers
    }
    const { register, handleSubmit, getValues } = useForm<IFormProps>()
    const onSearchSubmit = () => {
        const { searchQuery } = getValues()
        history.push({
            pathname: "/search",
            search: `?term=${searchQuery}`
        })
    }
    const history = useHistory()
    return (
        <div>
            <HelmetProvider>
                <Helmet>
                    <title>Restaurants | Super Eats</title>
                </Helmet>
            </HelmetProvider>
            <form onSubmit={handleSubmit(onSearchSubmit)} className="bg-teal-950 w-full py-20 md:py-40 flex items-center justify-center px-4 md:px-0">
                <input
                    {...register("searchQuery", { required: true, minLength: 3 })}
                    className="input w-3/4 rounded-md border-0 px-5 py-2.5 placeholder-gray-500 md:w-1/2" name="searchQuery" type="search" placeholder="What are you craving today?" />
            </form>
            {!loading &&
                <div className="max-w-screen-2xl mx-auto mt-5 pb-20">
                    <div className="grid grid-cols-4 gap-x-4 gap-y-6 mx-auto px-4 md:flex md:justify-around md:px-0">
                        {data?.allCategories.categories?.map(category => (
                            <Link to={`/category/${category.slug}`} key={category.id}>
                                <Category key={category.id} coverImg={category.coverImg} name={category.name} />
                            </Link>
                        ))}
                    </div>
                    <div className="grid px-4 md:px-1 md:grid-cols-3 gap-7 mt-10">
                        {data?.restaurants.results?.map((restaurant) => (
                            <Restaurant key={restaurant.id} id={restaurant.id + ""} coverImg={restaurant.coverImg} name={restaurant.name} categoryName={restaurant.category?.name} />
                        ))}
                    </div>
                    <div className="flex justify-center items-center mt-10">
                        {renderPageNumbers()}
                    </div>
                </div>
            }
        </div>
    )
}