import { gql, useMutation } from "@apollo/client"
import { useParams } from "react-router-dom"
import { CreateDishMutation, CreateDishMutationVariables } from "../../__generated__/graphql"

interface IAddDishParams {
    restaurantId: string
}

const CREATE_DISH_MUTATION = gql`
    mutation createDish($input: CreateDishInput!) {
        createDish(input: $input) {
            ok
            error
        }
    }
`

export const AddDish = () => {
    const { restaurantId } = useParams<IAddDishParams>()
    const [createDish, { loading }] = useMutation<CreateDishMutation, CreateDishMutationVariables>(CREATE_DISH_MUTATION)
    return (
        <div>
            <h1> Add Dish</h1>
        </div>
    )
}