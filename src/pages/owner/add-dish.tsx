import { gql, useMutation } from "@apollo/client"
import { useHistory, useParams } from "react-router-dom"
import { CreateDishMutation, CreateDishMutationVariables } from "../../__generated__/graphql"
import { Helmet, HelmetProvider } from "react-helmet-async"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faImage } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../components/button"
import { MY_RESTAURANTS_QUERY } from "./myrestaurants"

interface IAddDishParams {
    restaurantId: string
}

interface IFormProps {
    file: FileList
    name: string
    price: number
    description: string
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
    const history = useHistory()
    const { restaurantId } = useParams<IAddDishParams>()
    const [uploadingImage, setUploadingImage] = useState(false)
    const [fileName, setFileName] = useState("")
    const [createDish, { loading }] = useMutation<CreateDishMutation, CreateDishMutationVariables>(CREATE_DISH_MUTATION, {
        refetchQueries: [{
            query: MY_RESTAURANTS_QUERY,
            variables: {
                input: {
                    id: +restaurantId
                }
            }
        }],
        onCompleted: (data) => {
            const { ok, error } = data.createDish
            if (ok) {
                setUploadingImage(false)
            }
        }
    })
    const { register, handleSubmit, formState: { errors, isValid }, getValues, formState, watch } = useForm<IFormProps>({
        mode: "onChange"
    })
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
            const { name, price, description, file } = getValues()
            const readFile = file[0]
            const formBody = new FormData()
            formBody.append('file', readFile)
            const { url: photo } = await (
                await fetch('http://localhost:4000/uploads/', {
                    method: 'POST',
                    body: formBody
                })
            ).json()
            const result = await createDish({
                variables: {
                    input: {
                        name,
                        price: +price,
                        photo,
                        description,
                        restaurantId: +restaurantId
                    }
                }
            })
            if (result.data?.createDish.ok) {
                history.goBack()
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="max-w-screen-sm mx-auto mt-10 px-4">
            <HelmetProvider>
                <Helmet>
                    <title> Add Menu Item | Super Eats</title>
                </Helmet>
            </HelmetProvider>
            <h1 className="text-4xl font-bold mb-4">Add Menu Item</h1>
            <span className="block text-gray-600 mb-6">
                Please fill out the form below to add a menu item.
                <br />
                The menu item will be visible to the users once you submit the form.
                <br />
                Thank you for choosing Super Eats!
            </span>
            <form className="bg-white shadow-md rounded-lg p-6 flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
                <input {...register("name", { required: "Name is required" })}
                    className="input"
                    type="text"
                    placeholder="Menu Name" />
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
                        className={`cursor-pointer flex items-center justify-center w-full h-12 rounded-md transition-colors ${fileName ? 'bg-lime-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                    >
                        <FontAwesomeIcon icon={faImage} className={fileName ? 'text-white' : 'text-gray-600'} />
                        <span className={`ml-2 ${fileName ? 'text-white' : 'text-gray-600'} truncate`}>
                            {fileName || 'Upload Image'}
                        </span>
                    </label>
                </div>
                <input {...register("price", { required: "Price is required" })}
                    className="input"
                    type="number"
                    placeholder="Price" />
                <textarea {...register("description", { required: "Description is required" })}
                    className="input resize-y min-h-[250px] h-64 md:h-80 lg:h-96"
                    placeholder="Description" />
                <Button loading={loading} canClick={formState.isValid} actionText="Create Menu Item" />
            </form>
        </div>
    )
}