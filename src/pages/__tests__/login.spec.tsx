import { ApolloProvider } from "@apollo/client"
import { queryByRole, render, RenderResult, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { createMockClient } from "mock-apollo-client"
import { HelmetProvider } from "react-helmet-async"
import { BrowserRouter as Router } from "react-router-dom"
import { Login, LOGIN_MUTATION } from "../login"
import { LOCALSTORAGE_TOKEN } from "../../constants"


describe("<Login/>", () => {
    let renderResult: RenderResult
    let mockedClient: ReturnType<typeof createMockClient>
    beforeEach(async () => {
        await waitFor(() => {
            mockedClient = createMockClient()
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
    it("should display password validation error", async () => {
        const {getByPlaceholderText, getByRole } = renderResult
        const passwordInput = getByPlaceholderText(/password/i)
        await waitFor(() => {
            userEvent.type(passwordInput, "123")
        })
        let errorMessage = getByRole("alert")
        expect(errorMessage).toHaveTextContent(/password must be at least 5 characters/i)
        await waitFor(() => {
            userEvent.clear(passwordInput)
        })
        errorMessage = getByRole("alert")
        expect(errorMessage).toHaveTextContent(/password is required/i)
    })
    it("should submit form and call mutation", async () => {
        const formData = {
            email: "test@test.com",
            password: "123123"
        }
        const {getByPlaceholderText, getByRole } = renderResult
        const emailInput = getByPlaceholderText(/email/i)
        const passwordInput = getByPlaceholderText(/password/i)
        const submitButton = getByRole("button")
        const mockedMutationResponse = jest.fn().mockResolvedValue({
            data: {
                login: {
                    ok: true,
                    token: "test-token",
                    error: null
                }
            }
        })
        mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse)
        jest.spyOn(Storage.prototype, "setItem")
        await waitFor(() => {
            userEvent.type(emailInput, formData.email)
            userEvent.type(passwordInput, formData.password)
            userEvent.click(submitButton)
        })
        expect(mockedMutationResponse).toHaveBeenCalledTimes(1)
        expect(mockedMutationResponse).toHaveBeenCalledWith({ loginInput: {
            email: formData.email,
            password: formData.password
        } })
        expect(localStorage.setItem).toHaveBeenCalledWith(LOCALSTORAGE_TOKEN, "test-token")
    })
    it("should display login error", async () => {
        const formData = {
            email: "test@test.com",
            password: "123123"
        }
        const {getByPlaceholderText,getByRole, queryByRole, debug } = renderResult
        const emailInput = getByPlaceholderText(/email/i)
        const passwordInput = getByPlaceholderText(/password/i)
        const submitButton = getByRole("button")
        const mockedMutationResponse = jest.fn().mockResolvedValue({
            data: {
                login: {
                    ok: false,
                    token: null,
                    error: "Something went wrong. Please try again."
                }
            }
        })
        mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse)
        await waitFor(() => {
            userEvent.type(emailInput, formData.email)
            userEvent.type(passwordInput, formData.password)
            userEvent.click(submitButton)
        })
        expect(mockedMutationResponse).toHaveBeenCalledTimes(1)
        expect(mockedMutationResponse).toHaveBeenCalledWith({ loginInput: {
            email: formData.email,
            password: formData.password
        } })
        await waitFor(() => {
            const errorMessage = queryByRole("alert")
            expect(errorMessage).toHaveTextContent(/something went wrong. please try again/i)
        },{timeout:3000})
    })
})