import { render } from "@testing-library/react"
import { Category } from "../category"

describe("<Category/>", () => {
    it("should render successfully", () => {
        const { getByText,debug } = render(<Category coverImg={null} name="test" />)
        getByText("test")
        debug()
    })
})