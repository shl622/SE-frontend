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
        user.findByPlaceholderText("Email").type("test")
        user.findByRole("alert")
        user.should("have.text", "Please enter a valid email")
    })
})