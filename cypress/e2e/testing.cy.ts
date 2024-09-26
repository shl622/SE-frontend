describe("first test", () => {
    it("should go to the home page", () => {
        cy.visit("http://localhost:3000").title().should("eq", "Login | Super Eats")
    })
})