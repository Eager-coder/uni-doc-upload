import { FormEvent, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router"
// import client from "../utils/client"
import cn from "classnames"
import client from "../utils/client"
import { UserContext } from "../context/UserContext"

const RegisterPage = () => {
	const { user, setUser } = useContext(UserContext)

	const [form, setForm] = useState({ full_name: "", email: "", password: "", password2: "" })
	const [message, setMessage] = useState({ text: "", ok: false })
	const [isLoading, setIsLoading] = useState(false)
	let navigate = useNavigate()
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsLoading(true)
		const res = await client("/auth/register", "POST", form)
		console.log(res)
		if (res.ok) {
			return navigate("/dashboard")
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
			<h1 className="mt-20 mb-5 text-center text-4xl font-bold">Sign up</h1>
			<form className="flex flex-col items-center max-w-xl mx-auto space-y-4" onSubmit={handleSubmit}>
				<input
					className="border border-black rounded h-10 w-full pl-4"
					placeholder="Full name (ФИО)"
					type="text"
					name="full_name"
					id="name"
					required
					onChange={e => setForm(prev => ({ ...prev, full_name: e.target.value }))}
				/>
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
				<input
					className="border border-black rounded h-10 w-full pl-4"
					placeholder="Repeat password"
					type="password"
					name="repeat_password"
					id="repeat_password"
					required
					onChange={e => setForm(prev => ({ ...prev, password2: e.target.value }))}
				/>
				<div className={cn({ "text-red-600": !message.ok })}>{message.text}</div>
				<button
					disabled={isLoading}
					className="bg-black text-white border border-black rounded h-10 w-40 disabled:opacity-10"
					type="submit">
					Sign up
				</button>
			</form>
		</div>
	)
}
export default RegisterPage
