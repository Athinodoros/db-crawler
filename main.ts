import Connection from "./Connection.ts";
import { parse } from "parse";
import { Application } from "oak";
import router from "./router.ts";
const client = new Connection();
try {
  await client.connect()
  console.log("connected");
} catch (error) {
  console.log(error);
}
const args = parse(Deno.args);

if (Object.keys(args).length == 1) {
  // potentially can be replaced with a function that checks the args in detail to allow for the port to be set
  console.log("no args passed on execution starting in server mode on port:9000");
  
  const app = new Application()
  app.use(router.routes());
  app.listen({port:9000})
} else {
console.log("crawling the database for your input");

}