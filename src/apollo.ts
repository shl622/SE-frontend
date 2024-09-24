import { ApolloClient, createHttpLink, InMemoryCache, makeVar } from "@apollo/client";
import { LOCALSTORAGE_TOKEN } from "./constants";

const token = localStorage.getItem(LOCALSTORAGE_TOKEN)

// before login, token is null
// after login, token is not null
export const isLoggedInVar = makeVar(Boolean(token))
export const authToken = makeVar(token)

console.log('isloggedinvar default value: ', isLoggedInVar())
console.log('authtoken default value: ', authToken())

const httpLink = createHttpLink({
    uri: 'http://localhost:4000/graphql',
    credentials: 'include'
})

export const client = new ApolloClient({
    link: httpLink,
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