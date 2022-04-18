import cookieParser from "cookie-parser"
import { config } from "dotenv"
import express from "express"
import { loginRouter } from "./routes/auth/login"
import { registerRouter } from "./routes/auth/register"
import cors from "cors"
import { refreshTokenRouter } from "./routes/auth/refreshToken"
import { profileRouter } from "./routes/profile"
import { uploadsRouter } from "./routes/doc/uploadDocs"
import path from "path"
import * as fs from "fs"

// Initialize express server
const app = express()
const PORT = process.env.PORT || 80

// Initialize environmental variables
config({ path: __dirname + "/../.env" })

// Create "uploads" folder for user documents if does not exist
fs.mkdir("./uploads", { recursive: true }, err => {
	if (err) throw err
})

app.use(cors({ origin: "http://localhost:3000", credentials: true }))
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Routes
app.use("/api/auth/register", registerRouter)
app.use("/api/auth/login", loginRouter)
app.use("/api/auth/refresh-token", refreshTokenRouter)

app.use("/api/profile", profileRouter)
app.use("/api/uploads", uploadsRouter)

// Use /client/build folder to send html, css, js files to the client
app.use(express.static("../client/build"))
app.get("/*", (req, res) => res.sendFile(path.join(__dirname, "../client/build/index.html")))

// Start the server
app.listen(PORT, () => console.log(`App is listening at port ${PORT}`))
