import { env } from "$env/dynamic/private";
import pg from "pg";

import { drizzle } from "drizzle-orm/node-postgres";
import EventEmitter from "$lib/core/utils/eventListener";

const pool = new pg.Pool({ connectionString: env.PG_CONNECTION_STRING });
const db = drizzle(pool);
export const dbEventListener = new EventEmitter();

export default db;
