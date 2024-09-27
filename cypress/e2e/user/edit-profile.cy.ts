describe("edit profile page", () => {
    const user = cy
    beforeEach(() => {
        user.visit("/")
        user.login("cypress@test.com", "cypress")
        user.get("a[href='/edit-profile']").click()
    })
    it("should render the edit profile page via link on header", () => {
        user.checkTitle("Edit Profile")
    })
    it("should change email on user submission", () => {
        user.intercept("POST", "http://localhost:4000/graphql", (req) => {
            console.log(req.body)
            if(req.body.operationName === "editProfile") {
                // @ts-ignore
                req.body.variables?.input?.email = "cypress@test.com"
            }
        })
        user.findByPlaceholderText(/email/i).clear().type("cypress2@test.com")
        user.findByRole("button").click()
        user.wait(1000)
        user.findByRole("verify-email").should("exist")
    })

    it("should change password on user submission", ()=>{
        user.intercept("POST", "http://localhost:4000/graphql", (req) => {
            if(req.body.operationName === "editProfile") {
                // @ts-ignore
                req.body.variables?.input?.password = "cypress"
            }
        })
        user.findByPlaceholderText(/password/i).clear().type("cypress25")
        user.findByRole("button").click()
    })

    it("should logout user on clicking logout button", ()=>{
        user.findByRole("logout-button").click()
        user.checkTitle("Login")
    })
})