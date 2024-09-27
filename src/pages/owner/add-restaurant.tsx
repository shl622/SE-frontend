import { gql, useMutation } from "@apollo/client";
import { CreateRestaurantMutation, CreateRestaurantMutationVariables } from "../../__generated__/graphql";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { Helmet, HelmetProvider } from "react-helmet-async";

const CREATE_RESTAURANT_MUTATION = gql`
    mutation createRestaurant($input: CreatesRestaurantInput!) {
        createRestaurant(input: $input) {
            ok
            error
        }
    }
`

interface IFormProps {
    name: string;
    address: string;
    categoryName: string;
}

export const AddRestaurant = () => {
    const [createRestaurant, { loading,data }] = useMutation<CreateRestaurantMutation, CreateRestaurantMutationVariables>(CREATE_RESTAURANT_MUTATION)
    const { register, handleSubmit, formState: { errors, isValid }, getValues, formState } = useForm<IFormProps>({
        mode: "onChange"
    })
    const onSubmit = () => {
        const { name, address, categoryName } = getValues()
        console.log(getValues())
    }
    return (
        <div className="max-w-screen-sm mx-auto mt-10 px-4">
            <HelmetProvider>
                <Helmet>
                    <title>Register Restaurant | Super Eats</title>
                </Helmet>
            </HelmetProvider>
            <h1 className="text-4xl font-bold mb-4">Register Restaurant</h1>
            <span className="block text-gray-600 mb-6">
               Please fill out the form below to register your restaurant on Super Eats.
               <br />
               The restaurant will be visible to the users once you submit the form.
               <br />
               Thank you for choosing Super Eats!
            </span>
            <form className="bg-white shadow-md rounded-lg p-6 flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
                <input {...register("name", { required: "Name is required" })} 
                className="input"
                type="text" 
                placeholder="RestaurantName" />
                <input {...register("address", { required: "Address is required" })} 
                className="input"
                type="text" 
                placeholder="Address" />
                <input {...register("categoryName", { required: "Category Name is required" })} 
                className="input"
                type="text" 
                placeholder="Category Name" />
                <Button loading={loading} canClick={formState.isValid} actionText="Add Restaurant" />
            </form>
        </div>
    )
}