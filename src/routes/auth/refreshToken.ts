import { Router } from "express"
import { verify } from "jsonwebtoken"
import pool from "../../db"
import { generateTokens, getUnixTimeNow } from "../../utils"
const refreshTokenRouter = Router()

refreshTokenRouter.post("/", async (req, res) => {
	const oldToken = req?.cookies?.refresh_token
	try {
		const decoded: any = verify(oldToken, process.env.REFRESH_TOKEN_SECRET!)
		const { access_token, refresh_token } = generateTokens(decoded.user_id)
		const expires_in = getUnixTimeNow() + 14 * 86400
		await pool.query("DELETE FROM refresh_tokens WHERE token = $1", [oldToken])
		await pool.query(`INSERT INTO refresh_tokens (user_id, token, expires_in) VALUES ($1, $2, $3)`, [
			decoded.user_id,
			refresh_token,
			expires_in,
		])
		res.clearCookie("refresh_token")
		res.clearCookie("access_token")
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
		res.send()
		console.log("refreshed")
	} catch (error) {
		console.log("/refresh-token", error)
		if (oldToken) {
			await pool.query("DELETE FROM refresh_tokens WHERE token = $1", [oldToken])
		}
		res.status(401).json({ message: "You are unauthorized. Sign up or log in." })
	}
})

export { refreshTokenRouter }
