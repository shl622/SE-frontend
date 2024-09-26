import { render, waitFor } from "@testing-library/react"
import { NotFound } from "../notfound"
import { BrowserRouter as Router } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"

describe("<NotFound/>", () => {
    it("should render successfully", async () => {
        render(
            <HelmetProvider>
                <Router>
                    <NotFound />
                </Router>
            </HelmetProvider>
        )
        await waitFor(() => {
            expect(document.title).toBe("Not Found | Super Eats")
        })
    })
})