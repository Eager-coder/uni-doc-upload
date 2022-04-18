import { compare } from "bcrypt"
import { Router } from "express"
import pool from "../../db"
import { generateTokens, getUnixTimeNow } from "../../utils"
const loginRouter = Router()

loginRouter.post("/", async (req, res) => {
	try {
		// Get email and password from the user
		const { email, password } = req.body
		// If no email or password, send error message
		if (!email?.length || !password?.length) {
			return res.status(400).json({ message: "Please fill all the fields" })
		}

		// Find the user from our SQL database
		const { rows } = await pool.query(`SELECT * FROM users WHERE email = $1`, [email])

		// if user not found it means he/she not registered. Send error message
		if (!rows.length) {
			return res.status(400).json({ message: "Email or password is incorrect" })
		}
		const user = rows[0]

		// Check if password is correct. If not, send error message
		if (!(await compare(password, user.password))) {
			return res.status(400).json({ message: "Email or password is incorrect" })
		}

		// Delete old authorization token
		await pool.query("DELETE FROM refresh_tokens WHERE token = $1", [req?.cookies?.refresh_token || ""])

		// Get new access and refresh tokens
		const { access_token, refresh_token } = generateTokens(user.user_id)
		const expires_in = getUnixTimeNow() + 14 * 86400
		// Save tokens in SQL database
		await pool.query(`INSERT INTO refresh_tokens (user_id, token, expires_in) VALUES ($1, $2, $3)`, [
			user.user_id,
			refresh_token,
			expires_in,
		])

		// Set the tokens as browser cookies of user
		res.cookie("access_token", access_token, {
			maxAge: 15 * 60 * 1000, // 15 min
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
		})
		res.cookie("refresh_token", refresh_token, {
			maxAge: 86400 * 14 * 1000, // 14 days
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
		})
		// WELCOME MESSAGE!!!
		res.json({ message: "Welcome back!" })
	} catch (error) {
		console.log("/login", error)
		return res.status(500).json({ message: "Something went wrong" })
	}
})

export { loginRouter }
