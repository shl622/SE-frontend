import { gql, useMutation, useQuery } from "@apollo/client";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { AllCategoriesQuery, AllCategoriesQueryVariables, CreateRestaurantMutation, CreateRestaurantMutationVariables } from "../../__generated__/graphql";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";

const CREATE_RESTAURANT_MUTATION = gql`
    mutation createRestaurant($input: CreatesRestaurantInput!) {
        createRestaurant(input: $input) {
            ok
            error
            restaurantId
        }
    }
`

const ALL_CATEGORIES_QUERY = gql`
    query allCategories {
        allCategories {
            ok
            error
            categories {
                id
                name
            }
        }
    }
`

interface IFormProps {
    name: string
    file: FileList
    address: string
    categoryId: string
    newCategory: string
}

export const AddRestaurant = () => {
    const history = useHistory()
    const [createRestaurant, { data }] = useMutation<CreateRestaurantMutation, CreateRestaurantMutationVariables>(CREATE_RESTAURANT_MUTATION, {
        onCompleted: (data) => {
            const { ok, error } = data.createRestaurant
            if (ok) {
                setUploadingImage(false)
            }
        }
    })
    const { data: categoriesData } = useQuery<AllCategoriesQuery, AllCategoriesQueryVariables>(ALL_CATEGORIES_QUERY)
    const { register, handleSubmit, formState: { errors, isValid }, getValues, formState, watch } = useForm<IFormProps>({
        mode: "onChange"
    })
    const [uploadingImage, setUploadingImage] = useState(false)
    const [fileName, setFileName] = useState("")
    const watchCategoryId = watch("categoryId");
    const watchFile = watch("file")
    useEffect(()=>{
        if (watchFile && watchFile.length > 0) {
            setFileName(watchFile[0].name)
        }else{
            setFileName("")
        }
    }, [watchFile])
    const onSubmit = async () => {
        try {
            setUploadingImage(true)
            const { file, name, address, newCategory, categoryId } = getValues()
            const readFile = file[0]
            const formBody = new FormData()
            formBody.append('file', readFile)
            const { url: coverImg } = await (
                await fetch('http://localhost:4000/uploads/', {
                    method: 'POST',
                    body: formBody
                })
            ).json()
            const categoryName = categoryId === "other"
                ? newCategory.charAt(0).toUpperCase() + newCategory.slice(1)
                : categoriesData?.allCategories.categories?.find(cat => cat.id === parseInt(categoryId))?.name
            const result = await createRestaurant({
                variables: {
                    input: {
                        name,
                        address,
                        categoryName: categoryName!,
                        coverImg,
                    }
                }
            })
            if(result.data?.createRestaurant.ok){
                history.push('/')
            }
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
                <label 
                    htmlFor="image-upload" 
                    className={`cursor-pointer flex items-center justify-center w-full h-12 rounded-md transition-colors ${
                        fileName ? 'bg-lime-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                >
                    <FontAwesomeIcon icon={faImage} className={fileName ? 'text-white' : 'text-gray-600'} />
                    <span className={`ml-2 ${fileName ? 'text-white' : 'text-gray-600'} truncate`}>
                        {fileName || 'Upload Image'}
                    </span>
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
                <select
                    {...register("categoryId", { required: "Category is required" })}
                    className="input"
                >
                    <option value="">Select a category</option>
                    {categoriesData?.allCategories.categories?.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                    <option value="other">Other...</option>
                </select>
                {watchCategoryId === "other" && (
                    <input
                        {...register("newCategory", { required: "New category name is required" })}
                        className="input"
                        type="text"
                        placeholder="New Category Name"
                    />
                )}
                <Button loading={uploadingImage} canClick={formState.isValid} actionText="Add Restaurant" />
                {data?.createRestaurant.error && <FormError errorMessage={data.createRestaurant.error} />}
            </form>
        </div>
    )
}