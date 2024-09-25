import { gql } from "@apollo/client"
import React from "react"

const CATEGORY_QUERY = gql`
    query categoryQuery($input: CategoryInput!) {
        category(input: $input) {
            ok
            error
            totalPages
            totalResults
            restaurants{
                id
                name
                coverImg
                category{
                    name
                }
                address
                isPromoted  
            }
        }
    }
`

export const Category = () => {
    return (
        <div>
            <h1>Category</h1>
        </div>
    )
}