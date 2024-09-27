describe("login page", () => {
    const user = cy
    it("should render the login page", () => {
        user.visit("/").title().should("eq", "Login | Super Eats")
    })
    it("should allow user to fill the form", () => {
        user.visit("/")
        user.findByPlaceholderText(/email/i).type("front1@gmail.com")
        user.findByPlaceholderText(/password/i).type("123456")
        user.findByRole("button")
        user.should("not.have.class", "pointer-events-none")
        //to-do: user can login
    })
    it("should display error message for invalid email", () => {
        user.visit("/")
        user.findByPlaceholderText(/email/i).type("test")
        user.findByRole("alert")
        user.should("have.text", "Please enter a valid email")
    })
    it("should display error message for invalid password", () => {
        user.visit("/")
        user.findByPlaceholderText(/password/i).type("123")
        user.findByRole("alert")
        user.should("have.text", "Password must be at least 5 characters")
        user.findByPlaceholderText(/password/i).clear()
        user.findByPlaceholderText(/email/i).type("test@test.com")
        user.findByPlaceholderText(/password/i).type("test").clear()
        user.findByRole("alert")
        user.should("have.text", "Password is required")
    })
})