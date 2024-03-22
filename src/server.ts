import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { createLinkSchema } from "./models";
import { result } from "./db/querys";
import { z } from "zod"


const app = fastify();

app.post("/links", async (req: FastifyRequest, res: FastifyReply) => {
    console.log(req.body)

    const { code, url } = createLinkSchema.parse(req.body);

    console.log("aqui");

    const link = await result(code, url);

    return res.status(201).send({ shortLinkId: link.id })
})

app.listen(({
    port: 3334,
})).then(() => {
    console.log("HTTP Sever is running")
})