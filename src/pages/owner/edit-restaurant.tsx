import { gql, useMutation } from "@apollo/client"
import { Helmet, HelmetProvider } from "react-helmet-async"
import { DeleteRestaurantMutation, DeleteRestaurantMutationVariables, EditRestaurantMutation, EditRestaurantMutationVariables } from "../../__generated__/graphql"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useHistory, useParams } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faImage, faTrash } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../components/button"
import { FormError } from "../../components/form-error"

const EDIT_RESTAURANT_MUTATION = gql`
    mutation EditRestaurant($input: EditRestaurantInput!) {
        editRestaurant(input: $input) {
            ok
            error
        }
    }
`

const DELETE_RESTAURANT_MUTATION = gql`
    mutation DeleteRestaurant($input: DeleteRestaurantInput!) {
        deleteRestaurant(input: $input) {
            ok
            error
        }
    }
`

interface IFormProps {
    name?: string
    file?: FileList
    address?: string
}

interface IParamsProps {
    restaurantId: string
}

export const EditRestaurant = () => {
    const history = useHistory()
    const { restaurantId } = useParams<IParamsProps>()
    const [editRestaurant, { data }] = useMutation<EditRestaurantMutation, EditRestaurantMutationVariables>(EDIT_RESTAURANT_MUTATION, {
        update(cache, { data: mutationData }) {
            if (mutationData?.editRestaurant.ok) {
                cache.modify({
                    id: `Restaurant:${restaurantId}`,
                    fields: {
                        name(_, { readField }) {
                            return getValues().name || readField('name');
                        },
                        address(_, { readField }) {
                            return getValues().address || readField('address');
                        },
                        coverImg(_, { readField }) {
                            return readField('coverImg');
                        },
                    },
                })
            }
        }
    })
    const [deleteRestaurant, { data: deleteData }] = useMutation<DeleteRestaurantMutation, DeleteRestaurantMutationVariables>(DELETE_RESTAURANT_MUTATION)
    const [uploadingImage, setUploadingImage] = useState(false)
    const [fileName, setFileName] = useState("")
    const { register, handleSubmit, getValues, watch } = useForm<IFormProps>({
        mode: "onChange"
    })
    const watchFile = watch("file")
    useEffect(() => {
        if (watchFile && watchFile.length > 0) {
            setFileName(watchFile[0].name)
        } else {
            setFileName("")
        }
    }, [watchFile])
    const onSubmit = async () => {
        try {
            setUploadingImage(true)
            const { file, name, address } = getValues()
            const input: EditRestaurantMutationVariables['input'] = {
                restaurantId: +restaurantId
            }
            if (file && file.length > 0) {
                const readFile = file[0]
                const formBody = new FormData()
                formBody.append('file', readFile)
                const { url: coverImg } = await (
                    await fetch('http://localhost:4000/uploads/', {
                        method: 'POST',
                        body: formBody
                    })
                ).json()
                input.coverImg = coverImg
            }
            if (name) {
                input.name = name
            }

            if (address) {
                input.address = address
            }

            const result = await editRestaurant({
                variables: { input }
            })
            if (result.data?.editRestaurant.ok) {
                history.push(`/restaurant/${restaurantId}`)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setUploadingImage(false)
        }
    }
    const onDeleteClick = () => {
        const confirmed = window.confirm("Are you sure you want to delete this restaurant?")
        if (confirmed) {
            try {
                deleteRestaurant({
                    variables: {
                        input: {
                            restaurantId: +restaurantId
                        }
                    }
                })
                if (deleteData?.deleteRestaurant.ok) {
                    alert("Restaurant deleted successfully")
                    history.push("/")
                } else {
                    alert(deleteData?.deleteRestaurant.error || "Failed to delete restaurant")
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
    return (
        <div className="max-w-screen-sm mx-auto mt-10 px-4">
            <HelmetProvider>
                <Helmet>
                    <title>Edit Restaurant | Super Eats</title>
                </Helmet>
            </HelmetProvider>
            <h1 className="text-4xl font-bold mb-4">Edit Restaurant</h1>
            <span className="block text-gray-600 mb-6">
                Please fill out the form below to edit your restaurant on Super Eats.
                <br />
                The restaurant will be visible to the users once you submit the form.
                <br />
                For categories, please create a new restaurant with the new category.
                <br />
                Thank you again for choosing Super Eats!
            </span>
            <form className="bg-white shadow-md rounded-lg p-6 flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
                <div className="relative">
                    <input
                        {...register("file")}
                        type="file"
                        accept="image/*"
                        id="image-upload"
                        className="hidden"
                    />
                    <label
                        htmlFor="image-upload"
                        className={`cursor-pointer flex items-center justify-center w-full h-12 rounded-md transition-colors ${fileName ? 'bg-lime-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                    >
                        <FontAwesomeIcon icon={faImage} className={fileName ? 'text-white' : 'text-gray-600'} />
                        <span className={`ml-2 ${fileName ? 'text-white' : 'text-gray-600'} truncate`}>
                            {fileName || 'Upload Image'}
                        </span>
                    </label>
                </div>
                <input {...register("name")}
                    className="input"
                    type="text"
                    placeholder="Restaurant Name" />
                <input {...register("address")}
                    className="input"
                    type="text"
                    placeholder="Address" />
                <Button loading={uploadingImage} canClick={true} actionText="Edit Restaurant" />
                <button
                    className="text-white text-lg font-medium py-2.5 focus:outline-none bg-red-600 shadow-inner hover:bg-red-700 transition-colors"
                    onClick={onDeleteClick}
                >
                    Delete Restaurant
                </button>
                {data?.editRestaurant.error && <FormError errorMessage={data.editRestaurant.error} />}
            </form>
        </div>
    )
}