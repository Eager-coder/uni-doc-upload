import { FC, FormEvent, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router"
import client from "../utils/client"
import cn from "classnames"
import { UserContext } from "../context/UserContext"

const LoginPage: FC = () => {
	const { user, setUser } = useContext(UserContext)
	const [form, setForm] = useState({ email: "", password: "" })
	const [message, setMessage] = useState({ text: "", ok: false })
	const [isLoading, setIsLoading] = useState(false)
	let navigate = useNavigate()

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsLoading(true)
		const res = await client("/auth/login", "POST", form)
		if (res.ok) {
			const { data, ok } = await client("/profile", "GET")
			if (ok) {
				setUser({ ...data, isLoggedIn: true })
				setIsLoading(false)

				return navigate("/dashboard")
			}
		}
		if (res.message) {
			setMessage({ text: res.message, ok: res.ok })
		}
		setIsLoading(false)
	}
	useEffect(() => {
		if (user.isLoggedIn) {
			navigate("/dashboard")
		}
	}, [user])
	return (
		<div>
			<h1 className="mt-20 mb-5 text-center text-4xl font-bold">Log in</h1>
			<form className="flex flex-col items-center max-w-xl mx-auto space-y-4" onSubmit={handleSubmit}>
				<input
					className="border border-black rounded h-10 w-full pl-4"
					placeholder="Email"
					type="email"
					name="email"
					id="email"
					required
					onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
				/>
				<input
					className="border border-black rounded h-10 w-full pl-4"
					placeholder="Password"
					type="password"
					name="password"
					id="password"
					required
					onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
				/>

				<div className={cn({ "text-red-600": !message.ok })}>{message.text}</div>
				<button
					disabled={isLoading}
					className="bg-black text-white border border-black rounded h-10 w-40 disabled:opacity-10"
					type="submit">
					Log in
				</button>
			</form>
		</div>
	)
}
export default LoginPage
