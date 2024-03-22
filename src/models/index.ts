import { z } from "zod";

export const createLinkSchema = z.object({
    code: z.string().min(3),
    url: z.string().url()
})
