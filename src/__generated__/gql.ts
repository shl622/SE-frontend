/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n    query currAuth{\n        currAuth{\n            id\n            email\n            role\n            verified\n        }\n    }\n": types.CurrAuthDocument,
    "\n    query categoryQuery($input: CategoryInput!) {\n        category(input: $input) {\n            ok\n            error\n            totalPages\n            totalResults\n            restaurants{\n                id\n                name\n                coverImg\n                category{\n                    name\n                }\n                address\n                isPromoted  \n            }\n            category{\n                name\n                coverImg\n                slug\n            }\n        }\n    }\n": types.CategoryQueryDocument,
    "\n    query restaurant($input: RestaurantInput!) {\n        restaurant(input: $input) {\n            ok\n            error\n            restaurant {\n                id\n                name\n                coverImg\n                category{\n                    name\n                    coverImg\n                }\n                address\n                isPromoted\n            }\n        }\n    }\n": types.RestaurantDocument,
    "\n    query restaurantsPageQuery($input: RestaurantsInput!) {\n        allCategories{\n            ok\n            error\n            categories{\n                id\n                name\n                coverImg\n                slug\n                restaurantCount\n            }\n        }\n        restaurants(input: $input){\n            ok\n            error\n            totalPages\n            totalResults\n            results{\n                id\n                name\n                coverImg\n                category{\n                    name\n                }\n                address\n                isPromoted\n            }\n        }\n    }\n": types.RestaurantsPageQueryDocument,
    "\n    query searchRestaurants($input: SearchRestaurantInput!){\n        searchRestaurant(input: $input){\n            ok\n            error\n            totalPages\n            totalResults\n            restaurants{\n                id\n                name\n                coverImg\n                category{\n                    name\n                }\n                address\n                isPromoted\n            }\n        }\n    }\n": types.SearchRestaurantsDocument,
    "\n    query searchCategories($input: CategoryInput!){\n        category(input: $input){\n            ok\n            error\n            totalResults\n            category{\n                id\n                name\n                coverImg\n                slug\n            }\n        }\n    }\n": types.SearchCategoriesDocument,
    "\n    mutation createAccount($createAccountInput:CreateAccountInput!){\n        createAccount(input: $createAccountInput){\n            ok\n            error\n        }\n    }\n": types.CreateAccountDocument,
    "\n    mutation login($loginInput:LoginInput!){\n        login(input: $loginInput){\n            ok\n            error\n            token\n        }\n    }\n": types.LoginDocument,
    "\n    mutation createRestaurant($input: CreatesRestaurantInput!) {\n        createRestaurant(input: $input) {\n            ok\n            error\n        }\n    }\n": types.CreateRestaurantDocument,
    "\n    query myRestaurants {\n        myRestaurants {\n            ok\n            error\n            myRestaurants{\n                id\n                name\n                coverImg\n                category{\n                    name\n                }\n                address\n                isPromoted  \n            }\n        }\n    }\n": types.MyRestaurantsDocument,
    "\n    mutation verifyEmail($input: VerifyEmailInput!) {\n        verifyEmail(input: $input) {\n            ok\n            error\n        }\n    }\n": types.VerifyEmailDocument,
    "\n                        fragment VerifiedUser on User {\n                            verified\n                        }\n                    ": types.VerifiedUserFragmentDoc,
    "\n    mutation editProfile($input: EditProfileInput!) {\n        editProfile(input: $input) {\n            ok\n            error\n        }\n    }\n": types.EditProfileDocument,
    "\n                            fragment UpdatedUser on User {\n                                verified\n                                email\n                            }\n                        ": types.UpdatedUserFragmentDoc,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query currAuth{\n        currAuth{\n            id\n            email\n            role\n            verified\n        }\n    }\n"): (typeof documents)["\n    query currAuth{\n        currAuth{\n            id\n            email\n            role\n            verified\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query categoryQuery($input: CategoryInput!) {\n        category(input: $input) {\n            ok\n            error\n            totalPages\n            totalResults\n            restaurants{\n                id\n                name\n                coverImg\n                category{\n                    name\n                }\n                address\n                isPromoted  \n            }\n            category{\n                name\n                coverImg\n                slug\n            }\n        }\n    }\n"): (typeof documents)["\n    query categoryQuery($input: CategoryInput!) {\n        category(input: $input) {\n            ok\n            error\n            totalPages\n            totalResults\n            restaurants{\n                id\n                name\n                coverImg\n                category{\n                    name\n                }\n                address\n                isPromoted  \n            }\n            category{\n                name\n                coverImg\n                slug\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query restaurant($input: RestaurantInput!) {\n        restaurant(input: $input) {\n            ok\n            error\n            restaurant {\n                id\n                name\n                coverImg\n                category{\n                    name\n                    coverImg\n                }\n                address\n                isPromoted\n            }\n        }\n    }\n"): (typeof documents)["\n    query restaurant($input: RestaurantInput!) {\n        restaurant(input: $input) {\n            ok\n            error\n            restaurant {\n                id\n                name\n                coverImg\n                category{\n                    name\n                    coverImg\n                }\n                address\n                isPromoted\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query restaurantsPageQuery($input: RestaurantsInput!) {\n        allCategories{\n            ok\n            error\n            categories{\n                id\n                name\n                coverImg\n                slug\n                restaurantCount\n            }\n        }\n        restaurants(input: $input){\n            ok\n            error\n            totalPages\n            totalResults\n            results{\n                id\n                name\n                coverImg\n                category{\n                    name\n                }\n                address\n                isPromoted\n            }\n        }\n    }\n"): (typeof documents)["\n    query restaurantsPageQuery($input: RestaurantsInput!) {\n        allCategories{\n            ok\n            error\n            categories{\n                id\n                name\n                coverImg\n                slug\n                restaurantCount\n            }\n        }\n        restaurants(input: $input){\n            ok\n            error\n            totalPages\n            totalResults\n            results{\n                id\n                name\n                coverImg\n                category{\n                    name\n                }\n                address\n                isPromoted\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query searchRestaurants($input: SearchRestaurantInput!){\n        searchRestaurant(input: $input){\n            ok\n            error\n            totalPages\n            totalResults\n            restaurants{\n                id\n                name\n                coverImg\n                category{\n                    name\n                }\n                address\n                isPromoted\n            }\n        }\n    }\n"): (typeof documents)["\n    query searchRestaurants($input: SearchRestaurantInput!){\n        searchRestaurant(input: $input){\n            ok\n            error\n            totalPages\n            totalResults\n            restaurants{\n                id\n                name\n                coverImg\n                category{\n                    name\n                }\n                address\n                isPromoted\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query searchCategories($input: CategoryInput!){\n        category(input: $input){\n            ok\n            error\n            totalResults\n            category{\n                id\n                name\n                coverImg\n                slug\n            }\n        }\n    }\n"): (typeof documents)["\n    query searchCategories($input: CategoryInput!){\n        category(input: $input){\n            ok\n            error\n            totalResults\n            category{\n                id\n                name\n                coverImg\n                slug\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation createAccount($createAccountInput:CreateAccountInput!){\n        createAccount(input: $createAccountInput){\n            ok\n            error\n        }\n    }\n"): (typeof documents)["\n    mutation createAccount($createAccountInput:CreateAccountInput!){\n        createAccount(input: $createAccountInput){\n            ok\n            error\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation login($loginInput:LoginInput!){\n        login(input: $loginInput){\n            ok\n            error\n            token\n        }\n    }\n"): (typeof documents)["\n    mutation login($loginInput:LoginInput!){\n        login(input: $loginInput){\n            ok\n            error\n            token\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation createRestaurant($input: CreatesRestaurantInput!) {\n        createRestaurant(input: $input) {\n            ok\n            error\n        }\n    }\n"): (typeof documents)["\n    mutation createRestaurant($input: CreatesRestaurantInput!) {\n        createRestaurant(input: $input) {\n            ok\n            error\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query myRestaurants {\n        myRestaurants {\n            ok\n            error\n            myRestaurants{\n                id\n                name\n                coverImg\n                category{\n                    name\n                }\n                address\n                isPromoted  \n            }\n        }\n    }\n"): (typeof documents)["\n    query myRestaurants {\n        myRestaurants {\n            ok\n            error\n            myRestaurants{\n                id\n                name\n                coverImg\n                category{\n                    name\n                }\n                address\n                isPromoted  \n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation verifyEmail($input: VerifyEmailInput!) {\n        verifyEmail(input: $input) {\n            ok\n            error\n        }\n    }\n"): (typeof documents)["\n    mutation verifyEmail($input: VerifyEmailInput!) {\n        verifyEmail(input: $input) {\n            ok\n            error\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n                        fragment VerifiedUser on User {\n                            verified\n                        }\n                    "): (typeof documents)["\n                        fragment VerifiedUser on User {\n                            verified\n                        }\n                    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation editProfile($input: EditProfileInput!) {\n        editProfile(input: $input) {\n            ok\n            error\n        }\n    }\n"): (typeof documents)["\n    mutation editProfile($input: EditProfileInput!) {\n        editProfile(input: $input) {\n            ok\n            error\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n                            fragment UpdatedUser on User {\n                                verified\n                                email\n                            }\n                        "): (typeof documents)["\n                            fragment UpdatedUser on User {\n                                verified\n                                email\n                            }\n                        "];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;