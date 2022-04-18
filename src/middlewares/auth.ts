import { NextFunction, Request, Response } from "express"
import { verify } from "jsonwebtoken"

export function verifyAuth(req: Request, res: Response, next: NextFunction) {
	const token = req.cookies.access_token
	console.log("COOKIES:", req.cookies)

	try {
		if (!token) {
			return res.status(401).json({ message: "Please log in to continue" })
		}
		const decoded = verify(token, process.env.ACCESS_TOKEN_SECRET!)
		res.locals.user = decoded
		next()
	} catch (error) {
		console.log("verifyAuth", error)
		res.status(401).json({ message: "Please log in to continue" })
	}
}

export function checkAuth(req: Request, res: Response, next: NextFunction) {
	res.locals.user = {}
	const token = req.cookies.access_token

	try {
		const decoded: Object = verify(token, process.env.ACCESS_TOKEN_SECRET!)
		res.locals.user = { ...decoded, isLoggedIn: true }
	} catch {
		res.locals.user.isLoggedIn = false
	} finally {
		next()
	}
}
