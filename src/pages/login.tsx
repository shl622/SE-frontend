import React from "react"
import { useForm } from "react-hook-form"

interface ILoginForm {
    email?: string
    password?: string
}

export const Login = () => {
    const {register, getValues, formState: {errors}, handleSubmit } = useForm<ILoginForm>()
    const onSubmit = () => {
        console.log(getValues())
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
                    {errors.email?.message && <span className="font-medium text-red-500">{errors.email.message}</span>}
                    <input
                        {...register("password", {required: "Password is required", minLength: 5})}
                        type="password"
                        required
                        className="input"
                        placeholder="Password" />
                    {errors.password?.message && <span className="font-medium text-red-500">{errors.password.message}</span>}
                    {errors.password?.type === "minLength" && <span className="font-medium text-red-500">Password must be at least 5 characters</span>}
                    <button className="mt-3 button">
                        Log in
                    </button>
                </form>
            </div>
        </div>
    )
}