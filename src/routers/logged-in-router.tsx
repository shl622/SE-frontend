import React from "react";
import { gql, useQuery } from "@apollo/client";
import { CurrAuthQuery, CurrAuthQueryVariables, UserRole } from "../__generated__/graphql";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { Restaurants } from "../pages/client/restaurants";
import { isLoggedInVar } from "../apollo";
import { LOCALSTORAGE_TOKEN } from "../constants";

const ClientRoutes = [
    <Route path="/" exact>
        <Restaurants />
    </Route>
]


const CURRAUTH_QUERY = gql`
    query currAuth{
        currAuth{
            id
            email
            role
            verified
        }
    }
`;

export const LoggedInRouter = () => {
    const { data, loading, error } = useQuery<CurrAuthQuery, CurrAuthQueryVariables>(CURRAUTH_QUERY,{
        fetchPolicy: "network-only"
    })
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
            <Switch>
                {data.currAuth?.role === UserRole.Client && ClientRoutes}
                <Redirect to="/" />
            </Switch>
        </Router>
    )
}