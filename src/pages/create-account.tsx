import React from "react"
import { useForm } from "react-hook-form"
import { FormError } from "../components/form-error"
import { ApolloError, gql, useMutation } from "@apollo/client"
import { CreateAccountMutation, CreateAccountMutationVariables, UserRole } from "../__generated__/graphql"
import eatsLogo from "../assets/horizontal-logo.png"
import { Button } from "../components/button"
import { Link, useHistory } from "react-router-dom"
import { Helmet, HelmetProvider } from "react-helmet-async"
import { EMAIL_REGEX } from "../constants"

const CREATE_ACCOUNT_MUTATION = gql`
    mutation createAccount($createAccountInput:CreateAccountInput!){
        createAccount(input: $createAccountInput){
            ok
            error
        }
    }
`

interface ISignupForm {
    email: string
    password: string
    role: UserRole
}

export const CreateAccount = () => {
    const { register, getValues, formState: { errors }, handleSubmit, formState } = useForm<ISignupForm>({
        defaultValues: {
            role: UserRole.Client
        }
    })
    const history = useHistory()
    const [createAccountMutation, { loading, data:createAccountMutationResult }] = useMutation<CreateAccountMutation, CreateAccountMutationVariables>(CREATE_ACCOUNT_MUTATION, {
        onCompleted: (data: CreateAccountMutation) => {
            const { createAccount: { ok } } = data
            if (ok) {
                history.push("/")
                console.log('Account created successfully')
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
                const { email, password, role } = getValues()
                await createAccountMutation({ variables: { createAccountInput: { email, password, role } } })
            }
        } catch (error) {
            console.error('Signup error:', error)
        }
    }
    return (
        <div className="h-screen flex items-center flex-col mt-10 lg:mt-32">
            <HelmetProvider>
                <Helmet>
                    <title>Signup | Super Eats</title>
                </Helmet>
            </HelmetProvider>
            <div className="w-full max-w-screen-sm flex flex-col items-center px-5">
                <img src={eatsLogo} alt="super-eats" className="w-52 -mb-10" />
                <h4 className="w-full font-urbanist text-left text-2xl mb-5">Let's get started</h4>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 mt-2 w-full mb-3">
                    <input
                        {...register("email", {
                            required: "Please enter an email", pattern: {
                                value: EMAIL_REGEX,
                                message: "Please enter a valid email"
                            }
                        })}
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
                    <select className="input" {...register("role", { required: true })}>
                        {Object.keys(UserRole).map((role, index) => <option key={index}>{role}</option>)}
                    </select>
                    <Button canClick={formState.isValid} loading={loading} actionText="Sign up" />
                    {createAccountMutationResult?.createAccount.error && <FormError errorMessage={createAccountMutationResult.createAccount.error} />}
                </form>
                <div>
                    Already have an account? <Link to="/" className="text-lime-600 hover:underline">Login</Link>
                </div>
            </div>
        </div>
    )
}
