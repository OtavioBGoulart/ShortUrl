import { createClient } from "redis";

export const redis = createClient({
    url: "postgresql://docker:docker@localhost:6379"
})