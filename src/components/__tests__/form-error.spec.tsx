import { render } from "@testing-library/react"
import { FormError } from "../form-error"


describe("<FormError/>",()=>{
    it("should render successfully",()=>{
        const {getByText} = render(<FormError errorMessage={"test"}/>)
        getByText("test")
    })
})