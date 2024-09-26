import { gql, useQuery } from "@apollo/client"
import { useParams } from "react-router-dom"
import { CategoryQueryQuery, CategoryQueryQueryVariables } from "../../__generated__/graphql"
import { Restaurant } from "../../components/restaurant"
import { Helmet, HelmetProvider } from "react-helmet-async"
import { useEffect, useState } from "react"

const CATEGORY_QUERY = gql`
    query categoryQuery($input: CategoryInput!) {
        category(input: $input) {
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
            category{
                name
                coverImg
                slug
            }
        }
    }
`
interface ICategoryParams {
    slug: string
}

export const Category = () => {
    const [categoryName, setCategoryName] = useState("")
    const params = useParams<ICategoryParams>()
    const { data, loading } = useQuery<CategoryQueryQuery, CategoryQueryQueryVariables>(CATEGORY_QUERY, {
        variables: {
            input: {
                page: 1,
                slug: params.slug
            }
        }
    })
    useEffect(() => {
        setCategoryName(data?.category?.category?.name ?? "")
    }, [data])

    return (
        <div>
            <HelmetProvider>
                <Helmet>
                    <title>{categoryName} | Super Eats</title>
                </Helmet>
            </HelmetProvider>
            <div className="bg-teal-950 w-full py-10 md:py-20 flex items-center justify-left px-4 md:px-10 mb-10">
                <div className="flex items-center">
                    <img className="w-16 h-16 rounded-full opacity-90" src={data?.category?.category?.coverImg ?? ""} alt={data?.category?.category?.name ?? ""} />
                    <h1 className="text-2xl font-xs text-gray-100">{data?.category?.category?.name}</h1>
                </div>
            </div>
            {!loading &&
                <div className="grid px-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 items-center mx-auto">
                    {data?.category?.restaurants?.map((restaurant) => (
                        <Restaurant key={restaurant.id} id={restaurant.id + ""} coverImg={restaurant.coverImg} name={restaurant.name} categoryName={restaurant.category?.name} />
                    ))}
                </div>
            }
        </div>
    )
}