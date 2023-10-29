import type { Config } from "drizzle-kit";
import { config } from "dotenv";
config()

export default {
    schema: "./src/lib/**/schemas/*.ts",
    out: "./migration",
    dbCredentials: {
        connectionString: process.env.PG_CONNECTION_STRING!
    },
    driver: "pg",
} satisfies Config
