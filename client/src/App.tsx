import { useContext, useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom"
import { UserContext } from "./context/UserContext"
import client from "./utils/client"

function App() {
	const { user, setUser } = useContext(UserContext)
	const [loading, setIsLoading] = useState(true)

	const getProfile = async () => {
		const { data, ok } = await client("/profile", "GET")
		if (ok && data) {
			setUser({ ...data, isLoggedIn: true })
		}
		setIsLoading(false)
	}

	useEffect(() => {
		getProfile()
	}, [])
	return (
		<div className="App">
			<header className="bg-blue-100">
				<div className="flex justify-between items-center max-w-7xl m-auto py-3 px-6">
					<h1 className="text-3xl font-bold">YerDee</h1>
					<div>
						{user.isLoggedIn ? (
							<Link to="/dashboard">{user.full_name}</Link>
						) : (
							<>
								<Link className="mr-6" to="/login">
									Login
								</Link>
								<Link to="/register">Register</Link>
							</>
						)}
					</div>
				</div>
			</header>
			<main className="max-w-7xl m-auto px-6">{loading ? <>Loading...</> : <Outlet />}</main>
		</div>
	)
}

export default App
