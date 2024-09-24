import React from "react";
import { isLoggedInVar } from "../apollo"
import { gql, useQuery } from "@apollo/client";
import { CurrAuthQuery, CurrAuthQueryVariables } from "../__generated__/graphql";

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
    const {data, loading,error} = useQuery<CurrAuthQuery, CurrAuthQueryVariables>(CURRAUTH_QUERY)
    if(!data || loading || error){
        return <div>Loading...</div>
    }
    return (
        <div>
            <h1>Hi, {data.currAuth?.email}({data.currAuth?.role})</h1>
            <button onClick={()=>{isLoggedInVar(false)}}>Log out</button>
        </div>
    )
}