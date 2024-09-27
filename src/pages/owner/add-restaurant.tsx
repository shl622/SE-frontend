import { gql, useMutation } from "@apollo/client";
import { CreateRestaurantMutation, CreateRestaurantMutationVariables } from "../../__generated__/graphql";

const CREATE_RESTAURANT_MUTATION = gql`
    mutation createRestaurant($input: CreatesRestaurantInput!) {
        createRestaurant(input: $input) {
            ok
            error
        }
    }
`

export const AddRestaurant = () => {
    const [createRestaurant, { loading,data }] = useMutation<CreateRestaurantMutation, CreateRestaurantMutationVariables>(CREATE_RESTAURANT_MUTATION)
    return (
        <div>
            <h1>Add Restaurant</h1>
        </div>
    )
}