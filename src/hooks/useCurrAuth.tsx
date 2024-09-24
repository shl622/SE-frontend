import { gql, useQuery } from "@apollo/client";
import { CurrAuthQuery } from "../__generated__/graphql";

const CURRAUTH_QUERY = gql`
    query currAuth{
        currAuth{
            id
            email
            role
            verified
        }
    }
`

export const useCurrAuth = () => {
    return useQuery<CurrAuthQuery>(CURRAUTH_QUERY)
}