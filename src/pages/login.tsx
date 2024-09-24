import React from "react"
import { useForm } from "react-hook-form"
import { FormError } from "../components/form-error"
import { ApolloError, gql, useMutation } from "@apollo/client"
import { LoginMutation, LoginMutationVariables } from "../__generated__/graphql"
import eatsLogo from "../assets/horizontal-logo.png"
import { Button } from "../components/button"
import { Link } from "react-router-dom"
import { Helmet, HelmetProvider } from "react-helmet-async"
import { isLoggedInVar } from "../apollo"

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
    const { register, getValues, formState: { errors }, handleSubmit, formState } = useForm<ILoginForm>()
    const [loginMutation, { data: loginResult, loading }] = useMutation<LoginMutation, LoginMutationVariables>(LOGIN_MUTATION, {
        onCompleted: (data: LoginMutation) => {
            const { login: { ok, error, token } } = data
            if (ok) {
                console.log(token)
                isLoggedInVar(true)
            }
        },
        onError: (error: ApolloError) => {
            console.error('Apollo error:', error);
            console.error('Network error:', error.networkError);
            console.error('GraphQL errors:', error.graphQLErrors);
        }
    })
    const onSubmit = async () => {
        try {
            if (!loading) {
                const { email, password } = getValues()
                await loginMutation({ variables: { loginInput: { email, password } } })
            }
        } catch (error) {
            console.error('Login error:', error)
        }
    }
    return (
        <div className="h-screen flex items-center flex-col mt-10 lg:mt-32">
            <HelmetProvider>
                <Helmet>
                    <title>Login | Super Eats</title>
                </Helmet>
            </HelmetProvider>
            <div className="w-full max-w-screen-sm flex flex-col items-center px-5">
                <img src={eatsLogo} alt="super-eats" className="w-52 -mb-10" />
                <h4 className="w-full font-urbanist text-left text-2xl mb-5">Welcome back</h4>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 mt-2 w-full mb-3">
                    <input
                        {...register("email", { required: "Please enter a valid email" })}
                        type="email"
                        required
                        className="input transition-colors"
                        placeholder="Email" />
                    {errors.email?.message && <FormError errorMessage={errors.email.message} />}
                    <input
                        {...register("password", { required: "Password is required", minLength: 5 })}
                        type="password"
                        required
                        className="input transition-colors"
                        placeholder="Password" />
                    {errors.password?.message && <FormError errorMessage={errors.password.message} />}
                    {errors.password?.type === "minLength" && <FormError errorMessage="Password must be at least 5 characters" />}
                    <Button canClick={formState.isValid} loading={loading} actionText="Log in" />
                    {loginResult?.login.error && <FormError errorMessage={loginResult.login.error} />}
                </form>
                <div>
                    New to Super Eats? <Link to="/create-account" className="text-lime-600 hover:underline">Create an Account</Link>
                </div>
            </div>
        </div>
    )
}

function setNetworkError(arg0: null) {
    throw new Error("Function not implemented.")
}
