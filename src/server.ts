import fastify from "fastify";

const app = fastify();

app.get("/", () => {
    return("Hello Word")
})

app.listen(({
    port: 3334,
})).then(() => {
    console.log("HTTP Sever is running")
})