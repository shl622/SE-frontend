import { render, waitFor } from "@testing-library/react"
import App from "../app"
import { isLoggedInVar } from "../../apollo"

jest.mock("../../routers/logged-out-router", ()=>{
    return {
        LoggedOutRouter: ()=> <span>Logged Out</span>
    }
})
jest.mock("../../routers/logged-in-router", ()=>{
    return {
        LoggedInRouter: ()=> <span>Logged In</span>
    }
})

describe("App", () => {
  it("renders logged out", () => {
    const { getByText } = render(<App />)
    getByText("Logged Out")
  })
  it("renders logged in", async() => {
    const { getByText } = render(<App />)
    await waitFor(()=>{
        isLoggedInVar(true)
    })
    getByText("Logged In")
  })
})
