import { render, RenderResult, waitFor } from "../../test-utils"
import { NotFound } from "../notfound"

describe("<NotFound/>", () => {
    it("should render successfully", async () => {
        render(
            <NotFound />
        )
        await waitFor(() => {
            expect(document.title).toBe("Not Found | Super Eats")
        })
    })
})