import { sql } from "../libs/postgres";

async function result(code, url) { sql/*sql*/`
        
        INSERT INTO short_links (code, original_url)
        VALUES (${code}, ${url})
        RETURNING id
    
    `
}

export { result };