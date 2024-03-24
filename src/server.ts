import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { createLinkSchema, getLinkSchema } from "./models";
import { getCode, getLinks, result } from "./db/querys";
import { z } from "zod"
import postgres from "postgres";
import { getRedis } from "./libs/redis";


const app = fastify();

app.get("/:code", async(req: FastifyRequest, res: FastifyReply) => {

    try {
        const { code } = getLinkSchema.parse(req.params);

        const result = await getCode(code);
        if (result.length === 0) return res.status(400).send({ message: "Not Found!" })
        console.log(result)

        
        const redis = await getRedis();
        await redis.zIncrBy("metricsr", 1, String(result[0].id))

        //301 - permanente
        //302 - temporário

        return res.redirect(301, result[0].original_url)


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

app.get("/api/metrics", async(req: FastifyRequest, res: FastifyReply) => {
    //console.log("oi")
    const redis = await getRedis();
    const result = await redis.zRangeByScoreWithScores("metricsr", 0, 50);

    const metrics = result
    .sort((a, b) => b.score - a.score)
    .map(item => {
        return { shortLinkId: Number(item.value),
        clicks: item.score
        }
    })

    return metrics;
})

app.listen(({
    port: 3334,
})).then(() => {
    console.log("HTTP Sever is running")
})