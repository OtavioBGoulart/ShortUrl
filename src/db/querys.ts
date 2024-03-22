import { sql } from "../libs/postgres";

async function result(code: string, url: string) { 
    
    const result = await sql/*sql*/`
        
        INSERT INTO short_links (code, original_url)
        VALUES (${code}, ${url})
        RETURNING id
    
    `
    return result[0];
}

export { result };