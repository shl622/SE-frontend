import { render } from "@testing-library/react"
import { Restaurant } from "../restaurant"
import { BrowserRouter as Router } from "react-router-dom"

describe("<Restaurant/>",()=>{
    it("should render successfully",()=>{
        const restaurantProps = {
            id: "1",
            coverImg: "imgTest",
            name: "nameTest",
            categoryName: "catTest"
        }
        const {getByText, container} = render(
        <Router>
            <Restaurant {...restaurantProps} />
        </Router>)
        getByText("nameTest")
        getByText("catTest")
        expect(container.firstChild).toHaveAttribute("href",`/restaurant/${restaurantProps.id}`)
    })
})