import { gql, useApolloClient, useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import { VerifyEmailMutation, VerifyEmailMutationVariables } from "../../__generated__/graphql";
import { useHistory, useLocation } from "react-router-dom";
import { useCurrAuth } from "../../hooks/useCurrAuth";

const VERIFY_EMAIL_MUTATION = gql`
    mutation verifyEmail($input: VerifyEmailInput!) {
        verifyEmail(input: $input) {
            ok
            error
        }
    }
`

export const ConfirmEmail = () => {
    const client = useApolloClient()
    const {data: userData} = useCurrAuth()
    const history = useHistory()
    const [verifyEmail, {loading:verifyingEmail}] = useMutation<VerifyEmailMutation, VerifyEmailMutationVariables>(VERIFY_EMAIL_MUTATION,{
        onCompleted: (data:VerifyEmailMutation) => {
            const { verifyEmail: { ok } } = data
            if (ok && userData?.currAuth?.id) {
                client.writeFragment({
                    id: `User:${userData?.currAuth?.id}`,
                    fragment: gql`
                        fragment VerifiedUser on User {
                            verified
                        }
                    `,
                    data: { verified: true }
                })
                console.log('Email verified successfully')
                history.push("/")
            }
        }
    })
    useEffect(()=>{
       const [_, code] = window.location.href.split("code=")
       verifyEmail({
        variables:{
            input:{
                code
            }
        }
       })
    },[])
    return (
        <div className="h-screen flex items-center flex-col mt-10 lg:mt-32">
            <h2 className="text-2xl font-semibold mb-1">Confirming Email...</h2>
            <h4 className="text-lg text-gray-700 font-medium">Please wait and do not close this page</h4>
        </div>
    )
}