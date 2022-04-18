import React, { MouseEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Doc from "../components/Doc"
import ProfilePhoto from "../components/ProfilePhoto"

import { UserContext } from "../context/UserContext"
import client from "../utils/client"

const Dashboard = () => {
	const { user, setUser } = React.useContext(UserContext)
	const [university, setUniversity] = useState("KBTU")
	let navigate = useNavigate()
	useEffect(() => {
		if (!user.isLoggedIn) {
			navigate("/login")
		}
	}, [user])
	const handleUniversity = async (e: MouseEvent<HTMLButtonElement>) => {
		const res = await client("/profile/university", "POST", { university })
		if (res.ok) {
			const { data, ok } = await client("/profile", "GET")
			if (ok && data) {
				setUser({ ...data, isLoggedIn: true })
			}
		}
	}
	return (
		<div>
			<h1 className="text-3xl pt-6 mb-4 font-bold">Dashboard</h1>
			{user.university ? (
				<>
					<div className="flex justify-between">
						<h2 className="text-2xl font-medium mb-4">Your university: {user.university}</h2>
						<button
							onClick={() => setUser({ ...user, university: null })}
							className=" border-2 border-black text-xl  rounded-md h-10 w-32 disabled:opacity-10 block">
							Change
						</button>
					</div>

					<ProfilePhoto />
					<Doc header="Personal ID" type="personal-id" />
					<Doc header="Attestat" type="attestat" />
					<Doc header="UNT Certificate" type="unt-certificate" />
					<Doc header="Medical Certificate #087" type="medical-certificate" />
					<Doc header="Non-conviction Certificate" type="non-conviction-certificate" />
					<Doc header="Passport" type="passport" />
				</>
			) : (
				<>
					<h2 className="text-4xl font-bold text-center mb-4">Choose a university</h2>
					<select
						value={university}
						onChange={e => setUniversity(e.target.value)}
						name="university"
						className="text-2xl font-medium block mx-auto mb-52"
						id="">
						<option value="KBTU">KBTU</option>
						<option value="NU">NU</option>
						<option value="AITU">AITU</option>
						<option value="MUIT">MUIT</option>
						<option value="ENU">ENU</option>
						<option value="KAZGU">KAZGU</option>
					</select>
					<button
						onClick={handleUniversity}
						className=" border-2 border-black text-white text-2xl bg-black rounded-xl h-12 w-40 disabled:opacity-10 block mx-auto">
						Continue
					</button>
				</>
			)}
		</div>
	)
}

export default Dashboard
