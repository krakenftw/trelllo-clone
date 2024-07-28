import { app } from "./app";
import Database from "./common/db";
import * as dotenv from "dotenv";
dotenv.config();

const port = app.get("port");

const server = app.listen(port, onListening);

export const db = new Database(process.env.DATABASE_URI!);
db.init();

function onListening() {
  console.log(`Listening on ${port}`);
}

export default server;
