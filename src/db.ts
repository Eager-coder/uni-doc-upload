import { Pool } from "pg"
import { config } from "dotenv"
config({ path: __dirname + "/../.env" })

// Connect to SQL database

const pool = new Pool({
	ssl: {
		rejectUnauthorized: false,
	},
	connectionString: process.env.PG_URI,
	min: 2,
	max: 5,
})

export default pool
