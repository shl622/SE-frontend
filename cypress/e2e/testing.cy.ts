describe("login page", () => {
    it("should render the login page", () => {
        cy.visit("/").title().should("eq", "Login | Super Eats")
    })
    it("should allow user to fill the form", () => {
        cy.visit("/")
        cy.findByPlaceholderText(/email/i).type("front1@gmail.com")
        cy.findByPlaceholderText(/password/i).type("123456")
        cy.findByRole("button")
        cy.should("not.have.class", "pointer-events-none")
        //to-do: user can login
    })
    it("should display error message for invalid email", () => {
        cy.visit("/")
        cy.findByPlaceholderText("Email").type("test")
        cy.findByRole("alert")
        cy.should("have.text", "Please enter a valid email")
    })
})