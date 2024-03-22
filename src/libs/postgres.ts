import postgres from "postgres";

export const sql = postgres("postgresql://DOCKER:DOCKER@localhost:5433/shortLinks")