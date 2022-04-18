import { hash } from "bcrypt"
import { Router } from "express"
import pool from "../../db"
import { generateTokens, getUnixTimeNow } from "../../utils"
import crypto from "crypto"
const registerRouter = Router()

registerRouter.post("/", async (req, res) => {
	try {
		const { email, password, password2, full_name } = req.body
		if (!email?.trim() || !password?.trim() || !full_name?.trim()) {
			return res.status(400).json("Please fill all the fields!")
		}
		if (password.trim() !== password2.trim()) {
			return res.status(400).json("Passwords do not match!")
		}
		if (password.trim().length < 8) {
			return res.status(400).json("Password is too short!")
		}

		const { rows } = await pool.query("SELECT email FROM users WHERE email = $1", [email])
		if (rows.length) {
			return res.status(400).json({ message: "This email is already used" })
		}
		const encryptedPassword = await hash(password, 12)
		const userId = crypto.randomUUID()
		await pool.query(
			`INSERT INTO users (user_id, email, password, full_name, created_at) 
    VALUES ($1, $2, $3, $4, $5)`,
			[userId, email, encryptedPassword, full_name, getUnixTimeNow()],
		)
		const { access_token, refresh_token } = generateTokens(userId)
		const expires_in = getUnixTimeNow() + 14 * 86400
		await pool.query(`INSERT INTO refresh_tokens (user_id, token, expires_in) VALUES ($1, $2, $3)`, [
			userId,
			refresh_token,
			expires_in,
		])
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
		res.status(201).json({ message: "Successfully registered!" })
	} catch (error) {
		console.log("/register POST", error)

		return res.status(500).json("Something went wrong")
	}
})

export { registerRouter }
