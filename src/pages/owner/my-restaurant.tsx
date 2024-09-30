import { gql, useQuery } from "@apollo/client"
import { useParams } from "react-router-dom"
import { MyRestaurantQuery, MyRestaurantQueryVariables } from "../../__generated__/graphql"

interface IParams {
    restaurantId: string
}

const MY_RESTAURANT_QUERY = gql`
    query myRestaurant($input: MyRestaurantInput!) {
        myRestaurant(input: $input) {
            ok
            error
            restaurant {
                id
                name
                address
                createdAt
                updatedAt
                category {
                    name
                }
                coverImg
                address
                isPromoted
                promotedUntil
            }
        }
    }
`
export const MyRestaurant = () => {
    const { restaurantId } = useParams<IParams>()
    console.log("restaurantId", restaurantId)
    const { data } = useQuery<MyRestaurantQuery, MyRestaurantQueryVariables>(MY_RESTAURANT_QUERY, {
        variables: {
            input: {
                id: +restaurantId
            }
        }
    })
    return(
        <div>
            <h1>{data?.myRestaurant.restaurant?.name}</h1>
        </div>

    )
}