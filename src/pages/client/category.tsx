import { gql, useQuery } from "@apollo/client"
import { useLocation, useParams } from "react-router-dom"
import { CategoryQueryQuery, CategoryQueryQueryVariables } from "../../__generated__/graphql"

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
        }
    }
`
interface ICategoryParams {
    slug: string
}

export const Category = () => {
    const location = useLocation()
    const params = useParams<ICategoryParams>()
    const {data, loading} = useQuery<CategoryQueryQuery, CategoryQueryQueryVariables>(CATEGORY_QUERY, {
        variables: {
            input: {
                page: 1,
                slug: params.slug
            }
        }
    })
    return (
        <div>
            <h1>Category</h1>
        </div>
    )
}