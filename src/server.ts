import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { createLinkSchema } from "./models";
import { getLinks, result } from "./db/querys";
import { z } from "zod"
import postgres from "postgres";


const app = fastify();

app.get("/:code", async(req: FastifyRequest, res: FastifyReply) => {
})

app.get("/api/links", async(req: FastifyRequest, res: FastifyReply) => {

    try {
        const links = await getLinks()
        return res.status(200).send(links)
    } catch(error) {
        
        if (error instanceof postgres.PostgresError) {
            if (error.code === "23505") {
                res.status(400).send({ message: "Duplicated code!"})
            }
        }

        console.log(error);

        return res.status(500).send({ message: "Internal Server Error"})
    }
})

app.post("/api/links", async (req: FastifyRequest, res: FastifyReply) => {
    console.log(req.body)

    try {
        const { code, url } = createLinkSchema.parse(req.body);
        const link = await result(code, url);

        
        return res.status(201).send({ shortLinkId: link.id })
    
    } catch(error) {
        if (error instanceof postgres.PostgresError) {
            if (error.code === "23505") {
                res.status(400).send({ message: "Duplicated code!"})
            }
        }

        console.log(error);

        return res.status(500).send({ message: "Internal Server Error"})
    }

    
})

app.listen(({
    port: 3334,
})).then(() => {
    console.log("HTTP Sever is running")
})