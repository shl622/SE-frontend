import React from "react"
import { useForm } from "react-hook-form"
import { FormError } from "../components/form-error"
import { gql, useMutation } from "@apollo/client"
import {login, loginVariables} from "../../__generated__/login"

const LOGIN_MUTATION = gql`
    mutation login($email: String!, $password: String!){
        login(input: {email: $email, password: $password}){
            ok
            error
            token
        }
    }
`

interface ILoginForm {
    email: string
    password: string
}

export const Login = () => {
    const {register, getValues, formState: {errors}, handleSubmit } = useForm<ILoginForm>()
    const [loginMutation, {data}] = useMutation<login, loginVariables>(LOGIN_MUTATION)
    const onSubmit = () => {
        const {email, password} = getValues()
        loginMutation({variables: {email, password}})
    }
    return (
        <div className="h-screen flex items-center justify-center bg-gray-800 font-sans">
            <div className="bg-white w-full max-w-screen-sm pt-5 pb-7 rounded-lg text-center">
                <h3 className="text-3xl text-gray-800"> Log in </h3>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 mt-5 px-5">
                    <input
                        {...register("email", {required: "Please enter a valid email"})}
                        required
                        className="input"
                        placeholder="Email" />
                    {errors.email?.message && <FormError errorMessage={errors.email.message} />}
                    <input
                        {...register("password", {required: "Password is required", minLength: 5})}
                        type="password"
                        required
                        className="input"
                        placeholder="Password" />
                    {errors.password?.message && <FormError errorMessage={errors.password.message} />}
                    {errors.password?.type === "minLength" && <FormError errorMessage="Password must be at least 5 characters" />}
                    <button className="mt-3 button">
                        Log in
                    </button>
                </form>
            </div>
        </div>
    )
}