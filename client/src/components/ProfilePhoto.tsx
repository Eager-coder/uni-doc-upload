import { useRef, MouseEvent, useContext } from "react"
import { UserContext } from "../context/UserContext"
import client from "../utils/client"

const ProfilePhoto = () => {
	const { user, setUser } = useContext(UserContext)
	console.log(user.profile_picture_url)

	const hiddenFileInput = useRef<HTMLInputElement>(null)
	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		if (hiddenFileInput.current) {
			hiddenFileInput.current.click()
		}
	}
	const handleChange = async (event: any) => {
		const fileUploaded = event.target.files[0]
		const formData = new FormData()
		formData.append("profile-image", fileUploaded)
		console.log(fileUploaded)
		const res = await fetch("/api/uploads/profile-image", {
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
		const json = await res.text()
		console.log(json)
	}
	return (
		<div className="my-2 p-4 border-2 rounded-md">
			<h2 className="text-xl font-medium mb-2">3x4 profile photo</h2>
			<div className="flex justify-between items-center">
				<img
					className="w-24"
					src={
						"/api/uploads/" + user.profile_picture_url ||
						"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKZwmqodcPdQUDRt6E5cPERZDWaqy6ITohlQ&usqp=CAU"
					}
					alt=""
				/>
				<input
					onChange={handleChange}
					ref={hiddenFileInput}
					type="file"
					accept="image/*"
					name="profile-image"
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

export default ProfilePhoto
