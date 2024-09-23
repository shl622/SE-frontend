module.exports = {
    client: {
        includes: ["./src/**/*.tsx"],
        tagName: "gql",
        service: {
            name: "ue-backend",
            url: "http://localhost:4000/graphql",
        },
    },
};