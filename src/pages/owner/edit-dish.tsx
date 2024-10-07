import { gql, useMutation, useQuery } from "@apollo/client"
import { Helmet, HelmetProvider } from "react-helmet-async"
import { useHistory, useParams } from "react-router-dom"
import { EditDishMutation, EditDishMutationVariables, GetDishQuery, GetDishQueryVariables } from "../../__generated__/graphql"
import { useEffect, useState } from "react"
import { Control, useFieldArray, useForm, UseFormRegister } from "react-hook-form"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faImage, faPlus, faX } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../components/button"

interface IEditDishParams {
    dishId: string
    restaurantId: string
}

interface IFormProps {
    name: string
    price: number
    description: string
    photo: FileList
    options: {
        name: string
        choices: { name: string, extra: number }[]
        extra: number
    }[]
}

const EDIT_DISH_MUTATION = gql`
    mutation editDish($input: EditDishInput!) {
        editDish(input: $input) {
            ok
            error
        }
    }
`

const GET_DISH_QUERY = gql`
    query getDish($input: GetDishInput!) {
        getDish(input: $input) {
            ok
            error
            dish {
                name
                price
                description
                photo
                options {
                    name
                    extra
                    choices {
                        name
                        extra
                    }
                }
            }
        }
    }
`

export const EditDish = () => {
    const history = useHistory()
    const [uploadingImage, setUploadingImage] = useState(false)
    const { restaurantId, dishId } = useParams<IEditDishParams>()
    const [editDish, { loading }] = useMutation<EditDishMutation, EditDishMutationVariables>(EDIT_DISH_MUTATION)
    const [fileName, setFileName] = useState("")
    const { data } = useQuery<GetDishQuery, GetDishQueryVariables>(GET_DISH_QUERY, {
        variables: {
            input: {
                id: +dishId
            }
        }
    })
    const { register, handleSubmit, formState: { errors, isValid }, getValues, watch, control } = useForm<IFormProps>({
        mode: "onChange",
        defaultValues: {
            name: data?.getDish.dish?.name ?? '',
            price: data?.getDish.dish?.price ?? 0,
            description: data?.getDish.dish?.description ?? '',
            options: data?.getDish.dish?.options?.map(option => ({
                name: option?.name ?? '',
                extra: option?.extra ?? 0,
                choices: option?.choices?.map(choice => ({
                    name: choice?.name ?? '',
                    extra: choice?.extra ?? 0
                })) ?? []
            })) ?? []
        }
    })
    const { fields, append, remove } = useFieldArray({
        control,
        name: "options"
    })
    const watchFile = watch("photo")
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
            const { name, price, description, photo, options } = getValues()
            const readFile = photo[0]
            const formBody = new FormData()
            formBody.append('file', readFile)
            const { url: photoUrl } = await (
                await fetch('http://localhost:4000/uploads/', {
                    method: 'POST',
                    body: formBody
                })
            ).json()
            const result = await editDish({
                variables: {
                    input: {
                        dishId: +dishId,
                        name,
                        price: +price,
                        photo: photoUrl,
                        description,
                        options: options.map(option => ({
                            name: option.name,
                            extra: +option.extra,
                            choices: option.choices.map(choice => ({
                                name: choice.name,
                                extra: +choice.extra
                            }))
                        }))
                    }
                }
            })
            if(result.data?.editDish.ok){
                history.goBack()
            }
        }catch(error){
            console.log(error)
        }
    }
    return (
        <div className="max-w-screen-sm mx-auto mt-10 px-4 pb-20">
            <HelmetProvider>
                <Helmet>
                    <title>Edit Menu Item | Super Eats</title>
                </Helmet>
            </HelmetProvider>
            <h1 className="text-4xl font-bold mb-4">Edit Menu Item</h1>
            <span className="block text-gray-600 mb-6">
                Please fill out the form below to edit your menu item.
                <br />
                The edited menu item will be visible to the users once you submit the form.
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
                        {...register("photo", { required: "File is required" })}
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
                    min={0}
                    placeholder="Price" />
                <textarea {...register("description", { required: "Description is required" })}
                    className="input resize-y min-h-[250px] h-64 md:h-80 lg:h-96"
                    placeholder="Description" />
                <div className="mt-4 overflow-visible">
                    <button
                        type="button"
                        onClick={() => append({ name: "", choices: [], extra: 0 })}
                        className="flex items-center text-lime-600 hover:text-lime-700 transition-colors mb-2"
                    >
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        Add Option
                    </button>
                    {fields.map((field, index) => (
                        <div key={field.id} className="mb-4 p-4 border border-gray-200 rounded-md">
                            <div className="flex items-center space-x-2 mb-2">
                                <input
                                    {...register(`options.${index}.name` as const, { required: "Option Name is required" })}
                                    className="input flex-grow"
                                    placeholder="Option Name"
                                />
                                <input
                                    {...register(`options.${index}.extra` as const, { required: "Extra Price is required", valueAsNumber: true })}
                                    className="input w-24"
                                    type="number"
                                    placeholder="Extra Price"
                                />
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="text-gray-600 hover:text-red-600 transition-colors"
                                >
                                    <FontAwesomeIcon icon={faX} />
                                </button>
                            </div>
                            <div className="ml-4">
                                <h4 className="font-semibold mb-2">Choices:</h4>
                                <ChoicesFieldArray nestIndex={index} {...{ control, register }} />
                            </div>
                        </div>
                    ))}
                </div>
                <Button loading={loading} canClick={isValid} actionText="Edit Menu Item" />
            </form>
        </div>
    )
}

interface ChoicesFieldArrayProps {
    nestIndex: number
    control: Control<IFormProps>
    register: UseFormRegister<IFormProps>
}

const ChoicesFieldArray = ({ nestIndex, control, register }: ChoicesFieldArrayProps) => {
    const { fields, remove, append } = useFieldArray({
        control,
        name: `options.${nestIndex}.choices` as const
    })

    return (
        <div>
            {fields.map((item, k) => {
                return (
                    <div key={item.id} className="flex items-center space-x-2 mb-2">
                        <input
                            {...register(`options.${nestIndex}.choices.${k}.name` as const, {
                                required: true
                            })}
                            className="input flex-grow"
                            placeholder="Choice name"
                        />
                        <input
                            {...register(`options.${nestIndex}.choices.${k}.extra` as const, {
                                valueAsNumber: true,
                                required: true
                            })}
                            className="input w-24"
                            type="number"
                            placeholder="Price"
                        />
                        <button type="button" onClick={() => remove(k)} className="text-gray-600 hover:text-red-600 transition-colors">
                            <FontAwesomeIcon icon={faX} />
                        </button>
                    </div>
                );
            })}
            <button
                type="button"
                onClick={() => append({ name: "", extra: 0 })}
                className="text-sm text-lime-600 hover:text-lime-700 transition-colors"
            >
                Add Choice
            </button>
        </div>
    )
}