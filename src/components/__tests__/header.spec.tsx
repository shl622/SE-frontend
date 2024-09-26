import { render, waitFor } from "@testing-library/react"
import { Header } from "../header"
import { MockedProvider } from "@apollo/client/testing"
import { BrowserRouter as Router } from "react-router-dom"
import { CURRAUTH_QUERY } from "../../hooks/useCurrAuth"


describe("<Header/>", () => {
    const verified_mocks = [
        {
            request: {
                query: CURRAUTH_QUERY
            },
            result: {
                data: {
                    currAuth: {
                        id: 1,
                        email: "",
                        role: "",
                        verified: true
                    }
                }
            }
        }
    ]
    const unverified_mocks = [
        {
            request: {
                query: CURRAUTH_QUERY
            },
            result: {
                data: {
                    currAuth: {
                        id: 1,
                        email: "",
                        role: "",
                        verified: false
                    }
                }
            }
        }
    ]
    it("should not render unverified message", async () => {
        await waitFor(async () => {
            const { queryByText } = render(
                <MockedProvider mocks={verified_mocks}>
                    <Router>
                        <Header />
                    </Router>
                </MockedProvider>
            )
            await new Promise(resolve => setTimeout(resolve, 0))
            expect(queryByText("Please verify your email")).not.toBeInTheDocument()
        })
    })
    it("should render unverified message", async () => {
        await waitFor(async () => {
            const { getByText } = render(
                <MockedProvider mocks={unverified_mocks}>
                    <Router>
                        <Header />
                    </Router>
                </MockedProvider>
            )
            await new Promise(resolve => setTimeout(resolve, 0))
            getByText("Please verify your email")
        })
    })
})