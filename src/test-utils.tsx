import { render } from "@testing-library/react"
import { HelmetProvider } from "react-helmet-async"
import { BrowserRouter as Router } from "react-router-dom"

const alltheProviders = ({children}:{children:React.ReactNode}) => {
    return(
        <HelmetProvider>
            <Router>
                {children}
            </Router>
        </HelmetProvider>
    )
}

const customRender = (ui:React.ReactElement, options?:any) => render(ui, {wrapper: alltheProviders, ...options})

export * from "@testing-library/react"

export {customRender as render}