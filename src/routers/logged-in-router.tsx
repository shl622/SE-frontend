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
import { Restaurant } from "../pages/client/restaurant";
import { MyRestaurants } from "../pages/owner/myrestaurants";
import { AddRestaurant } from "../pages/owner/add-restaurant";
import { MyRestaurant } from "../pages/owner/my-restaurant";
import { EditRestaurant } from "../pages/owner/edit-restaurant";
import { AddDish } from "../pages/owner/add-dish";

const clientRoutes = [
    {
        path: "/",
        component: <Restaurants />
    },
    {
        path:"/search",
        component: <Search />
    },
    {
        path:"/category/:slug",
        component: <Category />
    },
    {
        path: "/restaurant/:id",
        component: <Restaurant />
    }
]

const commonRoutes = [
    {
        path: "/confirm",
        component: <ConfirmEmail />
    },
    {
        path: "/edit-profile",
        component: <EditProfile />
    }
]

const OwnerRoutes = [
    {
        path: "/",
        component: <MyRestaurants />
    },
    {
        path: "/add-restaurant",
        component: <AddRestaurant />
    },
    {
        path: "/restaurant/:restaurantId",
        component: <MyRestaurant />
    },
    {
        path: "/restaurant/:restaurantId/edit",
        component: <EditRestaurant />
    },
    {
        path: "/restaurant/:restaurantId/add-dish",
        component: <AddDish />
    }
]

export const LoggedInRouter = () => {
    const { data, loading, error } = useCurrAuth()
    if (!data || loading || error) {
        return <div>Loading...</div>
    }
    return (
        <Router>
            <Header />
            <Switch>
                {data.currAuth?.role === UserRole.Client && clientRoutes.map(route =>(
                    <Route key={route.path} path={route.path} exact>
                        {route.component}
                    </Route>
                ))}
                {commonRoutes.map(route =>(
                    <Route key={route.path} path={route.path} exact>
                        {route.component}
                    </Route>
                ))}
                {data.currAuth?.role === UserRole.Owner && OwnerRoutes.map(route =>(
                    <Route key={route.path} path={route.path} exact>
                        {route.component}
                    </Route>
                ))}
                <Route>
                    <NotFound />
                </Route>
            </Switch>
        </Router>
    )
}