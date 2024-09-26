import { ApolloProvider } from "@apollo/client"
import { render, RenderResult, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { createMockClient } from "mock-apollo-client"
import { HelmetProvider } from "react-helmet-async"
import { BrowserRouter as Router } from "react-router-dom"
import { Login } from "../login"


describe("<Login/>", () => {
    let renderResult: RenderResult
    beforeEach(async () => {
        await waitFor(() => {
            const mockedClient = createMockClient()
            renderResult = render(
                <HelmetProvider>
                    <ApolloProvider client={mockedClient}>
                        <Router>
                            <Login />
                        </Router>
                    </ApolloProvider>
                </HelmetProvider>
            )
        }) 
    })
    it("should render successfully", async () => {
        await waitFor(() => {
            expect(document.title).toBe("Login | Super Eats")
        })
    })
    it("should display email validation error", async () => {
        const {getByPlaceholderText, getByRole } = renderResult
        const emailInput = getByPlaceholderText(/email/i)
        await waitFor(() => {
            userEvent.type(emailInput, "te")
        })
        let errorMessage = getByRole("alert")
        expect(errorMessage).toHaveTextContent(/please enter a valid email/i)
        await waitFor(() => {
            userEvent.clear(emailInput)
        })
        errorMessage = getByRole("alert")
        expect(errorMessage).toHaveTextContent(/email is required/i)
    })
})