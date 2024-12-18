import { Client } from "pg";

// const connetion = await client.connect();
// console.log(connetion, client);
// const res = await client.queryObject(`SELECT table_schema,table_name
//     FROM information_schema.tables
//     ORDER BY table_schema,table_name;`);
// console.log(res);
export default class Connection {
  private static _connection: Connection;
  static get Instance() {
    if (this._connection) {
      return this._connection;
    } else return new Connection();
  }

  private _client: Client = new Client({
    user: Deno.env.get('PGUSER') || "postgres",
    password: Deno.env.get('PGPASSWORD') || "postgres",
    hostname: Deno.env.get('PGHOST') || "localhost",
    port: +(Deno.env.get('PGPORT') || "5432"),
    database: Deno.env.get('PGDATABASE') || "postgres",
    tls: { enforce: false },
  });

  constructor() {
  }

  public async connect() {
    await this._client.connect();
  }

  async query(query: string, args?: string[]) {
    return await this._client.queryObject(query, args);
  }
}
