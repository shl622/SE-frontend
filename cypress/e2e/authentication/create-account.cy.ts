describe("create account page", () => {
    const user = cy
    it("should display validation errors", () => {
        user.visit("/")
        user.findByText(/create an account/i).click()
        user.url().should("include", "/create-account")
        user.findByPlaceholderText(/email/i).type("test")
        user.findByRole("alert").should("have.text", "Please enter a valid email")
        user.findByPlaceholderText(/email/i).clear()
        user.findByRole("alert").should("have.text", "Email is required")
        user.findByPlaceholderText(/email/i).type("test@test.com")
        user.findByPlaceholderText(/password/i).type("testtest").clear()
        user.findByRole("alert").should("have.text", "Password is required")
        user.findByPlaceholderText(/password/i).type("test")
        user.findByRole("alert").should("have.text", "Password must be at least 5 characters")
        user.findByPlaceholderText(/email/i).clear().type("cypress@test.com")
        user.findByPlaceholderText(/password/i).clear().type("cypress")
        user.findByRole("select").select("Client")
        user.findByRole("button").should("not.have.class", "pointer-events-none").click()
        user.findByRole("alert").should("exist")
    })
    it("should render the create account page", () => {
        user.intercept("http://localhost:4000/graphql", (req) => {
            const { operationName } = req.body
            if (operationName && operationName === "createAccount") {
                req.reply((res) => {
                    res.send({
                        data: {
                            createAccount: {
                                ok: true,
                                error: null,
                                __typename: "CreateAccountOutput"
                            }
                        }
                    })
                })
            }
        })
        user.visit("/create-account")
        user.findByPlaceholderText(/email/i).type("cypress@test.com")
        user.findByPlaceholderText(/password/i).type("cypress")
        user.findByRole("select").select("Client")
        user.findByRole("button").should("not.have.class", "pointer-events-none").click()
        user.wait(1000)
        user.login("cypress@test.com", "cypress")
    })
})