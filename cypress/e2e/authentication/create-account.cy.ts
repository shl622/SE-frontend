describe("create account page", () => {
    const user = cy
    it("should display validation errors", () => {
        user.visit("/")
        user.findByText(/create an account/i).click()
        user.findByPlaceholderText(/email/i).type("test")
        user.findByRole("alert").should("have.text", "Please enter a valid email")
        user.findByPlaceholderText(/email/i).clear()
        user.findByRole("alert").should("have.text", "Email is required")
        user.findByPlaceholderText(/email/i).type("test@test.com")
        user.findByPlaceholderText(/password/i).type("testtest").clear()
        user.findByRole("alert").should("have.text", "Password is required")
        user.findByPlaceholderText(/password/i).type("test")
        user.findByRole("alert").should("have.text", "Password must be at least 5 characters")
    })
    it("should render the create account page", () => {
        user.visit("/")
        user.findByText(/create an account/i).click()
        user.url().should("include", "/create-account")
    })
})