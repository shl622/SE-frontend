import { ApolloProvider } from "@apollo/client"
import { render, RenderResult, waitFor } from "../../test-utils"
import { CreateAccount } from "../create-account"
import { createMockClient, MockApolloClient } from "mock-apollo-client"

describe("Create Account", () => {
    let mockedClient: MockApolloClient
    let renderResult: RenderResult
    beforeEach(() => {
        mockedClient = createMockClient()
        render(
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
})