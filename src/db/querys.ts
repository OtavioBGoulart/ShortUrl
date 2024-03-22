import { sql } from "../libs/postgres";

async function result(code: string, url: string) { 
    
    const result = await sql/*sql*/`
        
        INSERT INTO short_links (code, original_url)
        VALUES (${code}, ${url})
        RETURNING id
    
    `
    return result[0];
}

async function getLinks() {

    const result = await sql/*sql*/`
        
        SELECT * FROM short_links 
        ORDER BY created_at DESC
    
    `

    return result
}

async function getCode(code: string) {
    const result = await sql/*sql*/`
        
    SELECT id, original_url FROM short_links 
    WHERE short_links.code = (${code})

`
    return result
}

export { result, getLinks, getCode };