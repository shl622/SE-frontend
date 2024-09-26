import { ApolloProvider } from "@apollo/client"
import { render, RenderResult, waitFor } from "../../test-utils"
import { CREATE_ACCOUNT_MUTATION, CreateAccount } from "../create-account"
import { createMockClient, MockApolloClient } from "mock-apollo-client"
import userEvent from "@testing-library/user-event"

describe("Create Account", () => {
    let mockedClient: MockApolloClient
    let renderResult: RenderResult
    beforeEach(() => {
        mockedClient = createMockClient()
        renderResult = render(
            <ApolloProvider client={mockedClient}>
                <CreateAccount />
            </ApolloProvider>
        )
    })
    it("should render successfully", async () => {
        await waitFor(() => {
            expect(document.title).toBe("Signup | Super Eats")
        })
    })
    it("should display email validation error", async () => {
        const { getByPlaceholderText, getByRole } = renderResult
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
        const { getByPlaceholderText, getByRole } = renderResult
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
            password: "123123",
            role: "Client"
        }
        const { getByPlaceholderText, getByRole } = renderResult
        const emailInput = getByPlaceholderText(/email/i)
        const passwordInput = getByPlaceholderText(/password/i)
        const roleInput = getByRole("select")
        const submitButton = getByRole("button")
        const mockedMutationResponse = jest.fn().mockResolvedValue({
            data: {
                createAccount: {
                    ok: true,
                    error: null
                }
            }
        })
        mockedClient.setRequestHandler(CREATE_ACCOUNT_MUTATION, mockedMutationResponse)
        await waitFor(() => {
            userEvent.type(emailInput, formData.email)
            userEvent.type(passwordInput, formData.password)
            userEvent.selectOptions(roleInput, formData.role)
            userEvent.click(submitButton)
        })
        expect(mockedMutationResponse).toHaveBeenCalledTimes(1)
        expect(mockedMutationResponse).toHaveBeenCalledWith({
            createAccountInput: {
                email: formData.email,
                password: formData.password,
                role: formData.role
            }
        })
    })
    it("should display signup error", async () => {
        const formData = {
            email: "test@test.com",
            password: "123123",
            role: "Client"
        }
        const { getByPlaceholderText, getByRole } = renderResult
        const emailInput = getByPlaceholderText(/email/i)
        const passwordInput = getByPlaceholderText(/password/i)
        const roleInput = getByRole("select")
        const submitButton = getByRole("button")
        const mockedMutationResponse = jest.fn().mockResolvedValue({
            data: {
                createAccount: {
                    ok: false,
                    error: "Signup failed"
                }
            }
        })
        mockedClient.setRequestHandler(CREATE_ACCOUNT_MUTATION, mockedMutationResponse)
        await waitFor(() => {
            userEvent.type(emailInput, formData.email)
            userEvent.type(passwordInput, formData.password)
            userEvent.selectOptions(roleInput, formData.role)
            userEvent.click(submitButton)
        })
        expect(mockedMutationResponse).toHaveBeenCalledTimes(1)
        expect(mockedMutationResponse).toHaveBeenCalledWith({
            createAccountInput: {
                email: formData.email,
                password: formData.password,
                role: formData.role
            }
        })
        expect(getByRole("alert")).toHaveTextContent(/signup failed/i)
    })
})