/// <reference types="cypress" />

import "@testing-library/cypress/add-commands"

declare global {
    namespace Cypress {
        interface Chainable {
            assertLoggedIn(): Chainable<void>
            assertLoggedOut(): Chainable<void>
            login(email: string, password: string): Chainable<void>
        }
    }
}

Cypress.Commands.add("assertLoggedIn", () => {
    cy.window().its("localStorage.super-eats-token").should("be.a", "string")
})

Cypress.Commands.add("assertLoggedOut", () => {
    cy.window().its("localStorage.super-eats-token").should("be.undefined")
})

Cypress.Commands.add("login", (email: string, password: string) => {
    cy.title().should("eq", "Login | Super Eats")
    cy.assertLoggedOut()
    cy.findByPlaceholderText(/email/i).type(email)
    cy.findByPlaceholderText(/password/i).type(password)
    cy.findByRole("button").should("not.have.class", "pointer-events-none").click()
    cy.assertLoggedIn()
})

