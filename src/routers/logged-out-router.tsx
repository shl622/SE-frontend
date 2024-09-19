import React from "react";
import { isLoggedInVar } from "../apollo";
import { useForm } from "react-hook-form";

interface IForm {
    email: string
    password: string
}

export const LoggedOutRouter = () => {
    const { register, watch, handleSubmit, formState: { errors } } = useForm<IForm>()
    const onSubmit = () => {
        console.log(watch("email"))
        isLoggedInVar(true)
    }
    const onInvalid = () => {
        console.log("invalid")
    }
    return (
        <div>
            <h1>Logged Out</h1>
            <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
                <div>
                    <input
                        {...register("email", {
                            required: "This is required",
                            pattern: /^[A-Za-z0-9._%+-]+@gmail.com$/,
                        })}
                        name="email"
                        placeholder="email" />
                        {errors.email?.message && <span className="text-red-500 text-sm">{errors.email?.message}</span>}
                        {errors.email?.type === "pattern" && <span className="text-red-500 text-sm">Please enter a valid email address</span>}
                </div>
                <div>
                    <input
                        {...register("password", {
                            required: "Password is required"
                        })}
                        type="password"
                        required
                        placeholder="password"
                        className="border border-gray-300 rounded-md p-2 1-64 mx-auto block"
                    />
                </div>
                <div>
                    <button className="bg-yellow-300 text-white" type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}