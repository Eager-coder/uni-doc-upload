import { createContext, FC, useEffect, useState } from "react"

interface User {
	isLoggedIn: boolean
	full_name: string | null
	email: string | null
	profile_picture_url: string | null
	passport_url: string | null
	personal_id_url: string | null
	attestat_url: string | null
	unt_certificate_url: string | null
	non_conviction_certificate_url: string | null
	medical_certificate_url: string | null
	university: string | null
}

const defaultState = {
	isLoggedIn: false,
	full_name: null,
	email: null,
	profile_picture_url: null,
	personal_id_url: null,
	passport_url: null,
	attestat_url: null,
	unt_certificate_url: null,
	non_conviction_certificate_url: null,
	medical_certificate_url: null,
	university: null,
}

const UserContext = createContext<{
	user: User
	setUser: (user: User) => void
}>({
	user: defaultState,
	setUser: () => {},
})

const UserProvider: any = ({ children }: any) => {
	const [user, setUser] = useState<User>(defaultState)
	return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}

export { UserProvider, UserContext }
