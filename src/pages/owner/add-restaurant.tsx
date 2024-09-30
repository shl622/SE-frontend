import { gql, useMutation } from "@apollo/client";
import { CreateRestaurantMutation, CreateRestaurantMutationVariables } from "../../__generated__/graphql";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { FormError } from "../../components/form-error";

const CREATE_RESTAURANT_MUTATION = gql`
    mutation createRestaurant($input: CreatesRestaurantInput!) {
        createRestaurant(input: $input) {
            ok
            error
        }
    }
`

interface IFormProps {
    name: string
    file: FileList
    address: string
    categoryName: string
}

export const AddRestaurant = () => {
    const [createRestaurant, { data }] = useMutation<CreateRestaurantMutation, CreateRestaurantMutationVariables>(CREATE_RESTAURANT_MUTATION,{
        onCompleted: (data) => {
            const { ok, error } = data.createRestaurant
            if (ok){
                setUploadingImage(false)
            }
        }
    })
    const { register, handleSubmit, formState: { errors, isValid }, getValues, formState } = useForm<IFormProps>({
        mode: "onChange"
    })
    const [uploadingImage, setUploadingImage] = useState(false)
    const onSubmit = async () => {
        try {
            const { file, name, address, categoryName } = getValues()
            const readFile = file[0]
            const formBody = new FormData()
            formBody.append('file', readFile)
            const {url:coverImg} = await (
                await fetch('http://localhost:4000/uploads/', {
                    method: 'POST',
                    body: formBody
                })
            ).json()
            createRestaurant({
                variables: {
                    input: {
                        name,
                        address,
                        categoryName,
                        coverImg,
                    }
                }
            })
        } catch (error) {
            console.log(error)
        }
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
                <div className="relative">
                    <input
                        {...register("file", { required: "File is required" })}
                        type="file"
                        accept="image/*"
                        id="image-upload"
                        className="hidden"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer flex items-center justify-center w-full h-12 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                        <FontAwesomeIcon icon={faImage} className="text-gray-600 text-xl" />
                        <span className="ml-2 text-gray-600">Upload Image</span>
                    </label>
                </div>
                <input {...register("name", { required: "Name is required" })}
                    className="input"
                    type="text"
                    placeholder="Restaurant Name" />
                <input {...register("address", { required: "Address is required" })}
                    className="input"
                    type="text"
                    placeholder="Address" />
                <input {...register("categoryName", { required: "Category Name is required" })}
                    className="input"
                    type="text"
                    placeholder="Category Name" />
                <Button loading={uploadingImage} canClick={formState.isValid} actionText="Add Restaurant" />
                {data?.createRestaurant.error && <FormError errorMessage={data.createRestaurant.error} />}
            </form>
        </div>
    )
}