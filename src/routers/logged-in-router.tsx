import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { UserRole } from "../__generated__/graphql";
import { isLoggedInVar } from "../apollo";
import { Header } from "../components/header";
import { LOCALSTORAGE_TOKEN } from "../constants";
import { useCurrAuth } from "../hooks/useCurrAuth";
import { Category } from "../pages/client/category";
import { Restaurants } from "../pages/client/restaurants";
import { Search } from "../pages/client/search";
import { NotFound } from "../pages/notfound";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { EditProfile } from "../pages/user/edit-profile";

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
    </Route>,
    <Route key={5} path="/category/:slug">
        <Category />
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