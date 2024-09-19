import React from "react";
import { isLoggedInVar } from "../apollo";
import { useForm } from "react-hook-form";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Login } from "../pages/login";
import { SignUp } from "../pages/signup";


export const LoggedOutRouter = () => {
    return (
        <Router>
            <Switch>
                <Route path="/signup">
                    <SignUp />
                </Route>
                <Route path="/">
                    <Login />
                </Route>
            </Switch>
        </Router>
    )
}