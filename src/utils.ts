import { sign } from "jsonwebtoken"

// Returns current time in UNIX
export const getUnixTimeNow = () => {
	return Math.floor(Date.now() / 1000)
}

// Generates tokens for authorization
export const generateTokens = (user_id: string) => {
	const access_token = sign({ user_id }, process.env.ACCESS_TOKEN_SECRET!, {
		expiresIn: "15min",
	})
	const refresh_token = sign({ user_id }, process.env.REFRESH_TOKEN_SECRET!, {
		expiresIn: "14d",
	})

	return { access_token, refresh_token }
}
