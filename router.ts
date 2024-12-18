
import { Router } from "oak"
import Connection from "./Connection.ts"
const router = new Router()

router.
    get("/db", async (ctx) => {
        if (ctx.request.url.searchParams.has("q")) {
            const searchText = ctx.request.url.searchParams.get("q");
            ctx.response.body = "search param:" + searchText;

        } else {
            ctx.response.body = "no search param provided";
        }
    }).
    get("/schema", async (ctx) => {
        const client = Connection.Instance
        await client.connect()
        if (ctx.request.url.searchParams.has("q")) {
            const searchText = ctx.request.url.searchParams.get("q");
            ctx.response.body = JSON.stringify((await client.query(`SELECT distinct(table_schema) as name
                FROM information_schema.tables  where table_schema ~ $1
                ORDER BY table_schema `, [searchText || ""])).rows, null, 2);
        } else {

            ctx.response.body = JSON.stringify((await client.query(`SELECT distinct(table_schema) as name
                FROM information_schema.tables
                ORDER BY table_schema;`)).rows, null, 2);
        }
    }).
    get("/table", async (ctx) => {
        const client = Connection.Instance
        await client.connect()
        if (ctx.request.url.searchParams.has("q")) {
            const searchText = ctx.request.url.searchParams.get("q");
            ctx.response.body = JSON.stringify((await client.query(`SELECT table_name as name FROM information_schema.tables 
                where table_name ~ $1`, [searchText || ""])).rows, null, 2);

        } else {
            ctx.response.body = JSON.stringify((await client.query(`SELECT table_name as name FROM information_schema.tables`)).rows, null, 2);
        }
    }).
    get("/column", async (ctx) => {
        const client = Connection.Instance
        await client.connect()
        if (ctx.request.url.searchParams.has("q")) {
            const searchText = ctx.request.url.searchParams.get("q");
            ctx.response.body = JSON.stringify((await client.query(`select  table_schema as schema, 
            table_name as table, 
            ordinal_position as position,
            is_nullable as required,
            data_type as type,
            is_identity as isKey,
			column_name as name
    from information_schema.columns where column_name ~ $1`, [searchText || ""])).rows, null, 2);

        } else {
            ctx.response.body = JSON.stringify((await client.query(`select  table_schema as schema, 
            table_name as table, 
            ordinal_position as position,
            is_nullable as required,
            data_type as type,
            is_identity as isKey,
            column_name as name
        from information_schema.columns`)).rows, null, 2);

        }
    }).
    get("/policy", async (ctx) => {
        const client = Connection.Instance
        await client.connect()
        if (ctx.request.url.searchParams.has("q")) {
            const searchText = ctx.request.url.searchParams.get("q");
            ctx.response.body = "search param:" + searchText;
            ctx.response.body = JSON.stringify((await client.query(`
                select  
                    schemaname as schema, 
                    tablename as table, 
                    policyname as name, 
                    roles,cmd,qual, 
                    with_check as rule  
                from pg_policies where policyname ~ $1`, [searchText || ""])).rows, null, 2);

        } else {
            ctx.response.body = JSON.stringify((await client.query(`
                select  
                    schemaname as schema,
                    tablename as table, 
                    policyname as name, 
                    roles,cmd,qual, 
                    with_check as rule 
                FROM pg_policies`)).rows, null, 2);
        }
    }).
    get("/functions", async (ctx) => {
        const client = Connection.Instance
        await client.connect()
        if (ctx.request.url.searchParams.has("q")) {
            const searchText = ctx.request.url.searchParams.get("q");
            ctx.response.body = "search param:" + searchText;
            ctx.response.body = JSON.stringify((await client.query(`SELECT
                routine_name as name FROM 
                    information_schema.routines
                where 
                    routine_type = 'FUNCTION'
                AND 
                    routine_name ~$1 `, [searchText || ""])).rows, null, 2);

        } else {
            ctx.response.body = JSON.stringify((await client.query(`SELECT
                routine_name as name FROM 
                    information_schema.routines
                where 
                    routine_type = 'FUNCTION'`)).rows, null, 2);
        }
    }).
    get("/procedures", async (ctx) => {
        const client = Connection.Instance
        await client.connect()
        if (ctx.request.url.searchParams.has("q")) {
            const searchText = ctx.request.url.searchParams.get("q");
            ctx.response.body = "search param:" + searchText;
            ctx.response.body = JSON.stringify((await client.query(`
                SELECT routine_schema As schema,
                       routine_name As name
                FROM information_schema.routines
                WHERE routine_type = 'PROCEDURE' 
                AND routine_name ~  $1 `, [searchText || ""])).rows, null, 2);

        } else {
            ctx.response.body = JSON.stringify((await client.query(`
                SELECT routine_schema As schema,
                       routine_name As name
                FROM information_schema.routines
                WHERE routine_type = 'PROCEDURE';
                `)).rows, null, 2);
        }
    })
export default router