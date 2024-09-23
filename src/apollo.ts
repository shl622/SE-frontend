import { ApolloClient, createHttpLink, InMemoryCache, makeVar } from "@apollo/client";

export const isLoggedInVar = makeVar(false)

const httpLink = createHttpLink({
    uri: 'http://localhost:4000/graphql',
    credentials: 'include'
})

export const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache({
        typePolicies: {
            // Query: {
            //     fields: {
            //         isLoggedIn: {
            //             read() {
            //                 return isLoggedInVar
            //             }
            //         }
            //     }
            // }
        }
    }),
    credentials: 'include'
})