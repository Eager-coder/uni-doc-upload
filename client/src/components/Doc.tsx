import React, { FC, MouseEvent, useContext, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { UserContext } from "../context/UserContext"
import client from "../utils/client"

interface Props {
	header: string
	type:
		| "unt-certificate"
		| "attestat"
		| "personal-id"
		| "medical-certificate"
		| "non-conviction-certificate"
		| "passport"
}
function getUrl(type: string) {
	switch (type) {
		case "unt-certificate":
			return "unt_certificate_url"
		case "attestat":
			return "attestat_url"
		case "passport":
			return "passport_url"
		case "medical-certificate":
			return "medical_certificate_url"
		case "non-conviction-certificate":
			return "non_conviction_certificate_url"
		default:
			return "personal_id_url"
	}
}

const Doc: FC<Props> = ({ header, type }) => {
	const { user, setUser } = useContext(UserContext)

	const hiddenFileInput = useRef<HTMLInputElement>(null)
	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		if (hiddenFileInput.current) {
			hiddenFileInput.current.click()
		}
	}
	const handleChange = async (event: any) => {
		const fileUploaded = event.target.files[0]
		const formData = new FormData()
		formData.append(type, fileUploaded)
		const res = await fetch(`/api/uploads/${type}`, {
			method: "POST",
			body: formData,
			credentials: "include",
		})
		if (res.ok) {
			const { data, ok } = await client("/profile", "GET")
			if (ok && data) {
				setUser({ ...data, isLoggedIn: true })
			}
		}
	}

	return (
		<div className="my-2 p-4 border-2 rounded-md">
			<h2 className="text-xl font-medium mb-2">{header}</h2>
			<div className="flex justify-between items-center">
				<div>
					Link:{" "}
					{user[getUrl(type)] ? (
						<a href={"/api/uploads/" + user[getUrl(type)] || ""} target="_blank">
							{user[getUrl(type)]}
						</a>
					) : (
						"not uploaded"
					)}
				</div>
				<input
					onChange={handleChange}
					ref={hiddenFileInput}
					type="file"
					name={type}
					id=""
					style={{ display: "none" }}
				/>
				<button onClick={handleClick} className=" border-2 border-black rounded h-10 w-32 disabled:opacity-10">
					Upload
				</button>
			</div>
		</div>
	)
}

export default Doc
