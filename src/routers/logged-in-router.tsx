import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { Restaurants } from "../pages/client/restaurants";
import { isLoggedInVar } from "../apollo";
import { LOCALSTORAGE_TOKEN } from "../constants";
import { Header } from "../components/header";
import { useCurrAuth } from "../hooks/useCurrAuth";
import { UserRole } from "../__generated__/graphql";
import { NotFound } from "../pages/notfound";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { EditProfile } from "../pages/user/edit-profile";
import { Search } from "../pages/client/search";

const ClientRoutes = [
    <Route key={1} path="/" exact>
        <Restaurants />
    </Route>,
    <Route key={2} path="/confirm">
        <ConfirmEmail />
    </Route>,
    <Route key={3} path="/edit-profile">
        <EditProfile />
    </Route>,
    <Route key={4} path="/search">
        <Search />
    </Route>
]

export const LoggedInRouter = () => {
    const { data, loading, error } = useCurrAuth()
    if (!data || loading || error) {
        return <div>Loading...</div>
    }
    if (data.currAuth?.role === UserRole.Owner) {
        return (
            <div>
                <h1>Owner</h1>
                <button onClick={() => {
                    isLoggedInVar(false)
                    localStorage.removeItem(LOCALSTORAGE_TOKEN)
                }}>Log out</button>
            </div>
        )
    }
    return (
        <Router>
            <Header />
            <Switch>
                {data.currAuth?.role === UserRole.Client && ClientRoutes}
                <Route>
                    <NotFound />
                </Route>
            </Switch>
        </Router>
    )
}