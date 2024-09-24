import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { Restaurants } from "../pages/client/restaurants";
import { isLoggedInVar } from "../apollo";
import { LOCALSTORAGE_TOKEN } from "../constants";
import { Header } from "../components/header";
import { useCurrAuth } from "../hooks/useCurrAuth";
import { UserRole } from "../__generated__/graphql";

const ClientRoutes = [
    <Route path="/" exact>
        <Restaurants />
    </Route>
]

export const LoggedInRouter = () => {
    const { data, loading, error } = useCurrAuth()
    if (!data || loading || error) {
        return <div>Loading...</div>
    }
    if(data.currAuth?.role === UserRole.Owner){
        return(
            <div>
                <h1>Owner</h1>
                <button onClick={()=>{isLoggedInVar(false)
                    localStorage.removeItem(LOCALSTORAGE_TOKEN)
                }}>Log out</button>
            </div>
        )
    }
    return (
        <Router>
            <Header/>
            <Switch>
                {data.currAuth?.role === UserRole.Client && ClientRoutes}
                <Redirect to="/" />
            </Switch>
        </Router>
    )
}