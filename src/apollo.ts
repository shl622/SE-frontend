import { ApolloClient, createHttpLink, InMemoryCache, makeVar } from "@apollo/client";
import { LOCALSTORAGE_TOKEN } from "./constants";
import { setContext } from "@apollo/client/link/context";

const token = localStorage.getItem(LOCALSTORAGE_TOKEN)

// before login, token is null
// after login, token is not null
export const isLoggedInVar = makeVar(Boolean(token))
export const authToken = makeVar(token)

const httpLink = createHttpLink({
    uri: 'http://localhost:4000/graphql',
    credentials: 'include'
})

const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            "x-jwt": authToken() || ""
        }
    }
})

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    isLoggedIn: {
                        read() {
                            return isLoggedInVar
                        }
                    },
                    token:{
                        read(){
                            return authToken
                        }
                    }
                }
            }
        }
    }),
    credentials: 'include'
})
