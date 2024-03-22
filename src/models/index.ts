import { z } from "zod";

const createLinkSchema = z.object({
    code: z.string().min(3),
    url: z.string().url()
})

const getLinkSchema = z.object({
    code: z.string().min(3)
})

export { createLinkSchema, getLinkSchema }
