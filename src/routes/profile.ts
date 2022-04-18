import { Router } from "express"
import pool from "../db"
import { verifyAuth } from "../middlewares/auth"

const router = Router()
// Get all user information
router.get("/", verifyAuth, async (req, res) => {
	try {
		const { user_id } = res.locals.user
		// Select all user info from users table in SQL database
		const { rows } = await pool.query("SELECT * FROM users WHERE user_id = $1", [user_id])
		// Remove password because we cannot send it
		delete rows[0].password
		// Send the data
		return res.json({ data: rows[0] })
	} catch (error) {
		console.log("/profile GET", error)
		res.status(500).json({ message: "Something went wrong" })
	}
})

// THis route is for choosing university
router.post("/university", verifyAuth, async (req, res) => {
	try {
		// Get user id
		const { user_id } = res.locals.user
		// Get university name
		const { university } = req.body
		// Save the univestity in SQL database for that user
		const { rows } = await pool.query("UPDATE users SET university = $1 WHERE user_id = $2", [university, user_id])
		return res.json({ message: "Success!" })
	} catch (error) {
		console.log("/profile/university POST ", error)
		res.status(500).json({ message: "Something went wrong" })
	}
})
export { router as profileRouter }
