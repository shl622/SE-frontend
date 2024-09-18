import React from "react";
import { isLoggedInVar } from "../apollo";
import { useForm } from "react-hook-form";


export const LoggedOutRouter = () => {
    const onClick = () => {
        isLoggedInVar(true)
    }
    const { register } = useForm()
    return (
        <div>
            <h1>Logged Out</h1>
            <form>
                <div>
                    <input
                        {...register("email", {
                            required: "This is required",
                            pattern: /^[A-Za-z0-9._%+-]+@gmail.com$/,
                        })}
                        type="email"
                        placeholder="email" />
                </div>
                <div>
                    <input 
                    {...register("password",{
                        required: "Password is required"
                    })}
                    type="password" 
                    required 
                    placeholder="password" />
                </div>
                <div>
                    <button className="bg-yellow-300 text-white" onClick={onClick}>Submit</button>
                </div>
            </form>
        </div>
    )
}