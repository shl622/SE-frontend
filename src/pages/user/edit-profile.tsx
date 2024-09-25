import React from "react"
import { useCurrAuth } from "../../hooks/useCurrAuth"
import { Button } from "../../components/button"
import { useForm } from "react-hook-form"
import { gql, useMutation } from "@apollo/client"
import { EditProfileMutation, EditProfileMutationVariables } from "../../__generated__/graphql"
import { EMAIL_REGEX } from "../../constants"
const EDIT_PROFILE_MUTATION = gql`
    mutation editProfile($input: EditProfileInput!) {
        editProfile(input: $input) {
            ok
            error
        }
    }
`

interface IFormProps {
    email?: string
    password?: string
}

export const EditProfile = () => {
    const { data: userData } = useCurrAuth()
    const [editProfile, { loading }] = useMutation<EditProfileMutation, EditProfileMutationVariables>(EDIT_PROFILE_MUTATION, {
        onCompleted: (data: EditProfileMutation) => {
            const { editProfile: { ok } } = data
            if (ok) {
                //update the cache
                console.log('Profile updated successfully')
            }
        }
    })
    const { register, getValues, handleSubmit, formState } = useForm<IFormProps>({
        defaultValues: {
            email: userData?.currAuth?.email
        },
        mode: "onChange"
    })
    const onSubmit = () => {
        const { email, password } = getValues()
        editProfile({
            variables: {
                input: {
                    email,
                    ...(password !== "" && { password })
                }
            }
        })
    }
    return (
        <div className="flex flex-col items-center justify-center mt-10 lg:mt-32">
            <h4 className="font-semibold text-2xl mb-3">Edit Profile</h4>
            <h4 className="font-medium text-md mb-1">Updating your profile will require you to verify your new email</h4>
            <form className="grid gap-3 mt-5 mb-5 w-full max-w-screen-sm" onSubmit={handleSubmit(onSubmit)}>
                <input
                    {...register("email", {
                        required: "Please enter an email",
                        pattern: {
                            value: EMAIL_REGEX,
                            message: "Please enter a valid email"
                        }
                    })}
                    className="input" type="email" placeholder="Email" />
                <input
                    {...register("password")}
                    className="input" type="password" placeholder="Password" />
                <Button loading={loading} canClick={formState.isValid} actionText={"Update Profile"} />
            </form>
        </div>
    )
}