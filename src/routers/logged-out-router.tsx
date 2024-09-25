import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Login } from "../pages/login";
import { CreateAccount } from "../pages/create-account";
import { NotFound } from '../pages/notfound';


export const LoggedOutRouter = () => {
    return (
        <Router>
            <Switch>
                <Route path="/create-account">
                    <CreateAccount />
                </Route>
                <Route path="/" exact>
                    <Login />
                </Route>
                <Route>
                    <NotFound />
                </Route>
            </Switch>
        </Router>
    )
}