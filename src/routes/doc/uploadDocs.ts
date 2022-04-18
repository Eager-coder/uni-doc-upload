import express, { Router } from "express"
import multer from "multer"
import pool from "../../db"
import { verifyAuth } from "../../middlewares/auth"

const router = Router()

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "../uploads")
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	},
})

var upload = multer({ storage })

router.get("*", express.static("../uploads"))

// This route is for 3x4 profile image
router.post("/profile-image", verifyAuth, upload.single("profile-image"), async (req, res) => {
	try {
		// SAVE profile image url in our SQL database
		await pool.query("UPDATE users SET profile_picture_url = $1 WHERE user_id = $2", [
			req.file?.filename,
			res.locals.user.user_id,
		])
		res.json({ message: "Uploaded" })
	} catch (error) {
		console.log("/profile-image POST", error)

		return res.status(500).json({ message: "Something went wrong" })
	}
})

router.post("/attestat", verifyAuth, upload.single("attestat"), async (req, res) => {
	try {
		await pool.query("UPDATE users SET attestat_url = $1 WHERE user_id = $2", [
			req.file?.filename,
			res.locals.user.user_id,
		])
		res.json({ message: "Uploaded" })
	} catch (error) {
		console.log("/attestat POST", error)
		return res.status(500).json({ message: "Something went wrong" })
	}
})

router.post("/personal-id", verifyAuth, upload.single("personal-id"), async (req, res) => {
	try {
		await pool.query("UPDATE users SET personal_id_url = $1 WHERE user_id = $2", [
			req.file?.filename,
			res.locals.user.user_id,
		])
		res.json({ message: "Uploaded" })
	} catch (error) {
		console.log("/personal-id POST", error)
		return res.status(500).json({ message: "Something went wrong" })
	}
})

router.post("/unt-certificate", verifyAuth, upload.single("unt-certificate"), async (req, res) => {
	try {
		await pool.query("UPDATE users SET unt_certificate_url = $1 WHERE user_id = $2", [
			req.file?.filename,
			res.locals.user.user_id,
		])
		res.json({ message: "Uploaded" })
	} catch (error) {
		console.log("/unt-certificate POST", error)
		return res.status(500).json({ message: "Something went wrong" })
	}
})

router.post("/medical-certificate", verifyAuth, upload.single("medical-certificate"), async (req, res) => {
	try {
		await pool.query("UPDATE users SET medical_certificate_url = $1 WHERE user_id = $2", [
			req.file?.filename,
			res.locals.user.user_id,
		])
		res.json({ message: "Uploaded" })
	} catch (error) {
		console.log("/medical-certificate POST", error)
		return res.status(500).json({ message: "Something went wrong" })
	}
})

router.post(
	"/non-conviction-certificate",
	verifyAuth,
	upload.single("non-conviction-certificate"),
	async (req, res) => {
		try {
			await pool.query("UPDATE users SET non_conviction_certificate_url = $1 WHERE user_id = $2", [
				req.file?.filename,
				res.locals.user.user_id,
			])
			res.json({ message: "Uploaded" })
		} catch (error) {
			console.log("/non-conviction-certificate POST", error)
			return res.status(500).json({ message: "Something went wrong" })
		}
	},
)

router.post("/passport", verifyAuth, upload.single("passport"), async (req, res) => {
	try {
		await pool.query("UPDATE users SET passport_url = $1 WHERE user_id = $2", [
			req.file?.filename,
			res.locals.user.user_id,
		])
		res.json({ message: "Uploaded" })
	} catch (error) {
		console.log("/passport POST", error)
		return res.status(500).json({ message: "Something went wrong" })
	}
})

export { router as uploadsRouter }
