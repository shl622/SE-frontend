describe("login page", () => {
    const user = cy
    it("should render the login page", () => {
        user.visit("/").title().should("eq", "Login | Super Eats")
    })
    it("should display validation errors", () => {
        user.visit("/")
        user.findByPlaceholderText(/email/i).type("test")
        user.findByRole("alert")
        user.should("have.text", "Please enter a valid email")
        user.findByPlaceholderText(/email/i).clear().type("test@test.com")
        user.findByPlaceholderText(/password/i).type("123")
        user.findByRole("alert").should("have.text", "Password must be at least 5 characters")
        user.findByPlaceholderText(/password/i).clear()
        user.findByRole("alert").should("have.text", "Password is required")
        //check backend validation errors
        user.findByPlaceholderText(/email/i).clear().type("cypress@cypress.com")
        user.findByPlaceholderText(/password/i).type("cypresstest")
        user.findByRole("button").should("not.have.class", "pointer-events-none").click()
        user.findByRole("alert").should("have.text", "Something went wrong. Please try again.")
    })
    it("should allow user to fill the form", () => {
        user.visit("/")
        user.findByPlaceholderText(/email/i).type("front1@gmail.com")
        user.findByPlaceholderText(/password/i).type("asdf1234")
        user.findByRole("button").should("not.have.class", "pointer-events-none").click()
        user.window().its("localStorage.super-eats-token").should("be.a", "string")
    })
})