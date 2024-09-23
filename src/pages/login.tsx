import React from "react"
import { useForm } from "react-hook-form"
import { FormError } from "../components/form-error"
import { gql, useMutation } from "@apollo/client"
import {LoginMutation, LoginMutationVariables} from "../__generated__/graphql"

const LOGIN_MUTATION = gql`
    mutation login($loginInput:LoginInput!){
        login(input: $loginInput){
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
    const {register, getValues, formState: {errors}, handleSubmit, watch } = useForm<ILoginForm>()
    const [loginMutation, {data: loginResult}] = useMutation<LoginMutation, LoginMutationVariables>(LOGIN_MUTATION, {
        onCompleted: (data: LoginMutation) => {
            const {login: {ok, error, token}} = data
            if(ok){
                console.log(token)
            }
        }
    })
    const onSubmit = () => {
        const {email, password} = getValues()
        loginMutation({variables: {loginInput: {email, password}}})
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
                    {loginResult?.login.error && <FormError errorMessage={loginResult.login.error} />}
                </form>
            </div>
        </div>
    )
}