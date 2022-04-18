export const base_url = process.env.NODE_ENV === "production" ? "/api" : "http://localhost:80/api"

export type ClientType = {
	ok: boolean
	message: string
	data?: object | Array<any> | any
	status?: number
}

export type Method = "GET" | "POST" | "PUT" | "DELETE"

const client = async (url: string, method: Method = "GET", body?: object): Promise<ClientType> => {
	try {
		const res = await fetch(base_url + url, {
			method,
			body: body && JSON.stringify(body),
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})
		if (res.status !== 401) {
			const json = await res.json()
			return {
				ok: res.ok,
				status: res.status,
				data: json.data,
				message: json.message,
			}
		}
		const { ok, status } = await fetch(base_url + "/auth/refresh-token", {
			method: "POST",
			credentials: "include",
		})
		if (ok && status !== 401) {
			const res2 = await fetch(base_url + url, {
				method,
				body: body && JSON.stringify(body),
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			})
			const json2 = await res2.json()
			console.log(json2)
			return {
				ok: res2.ok,
				status: res2.status,
				data: json2.data,
				message: json2.message,
			}
		}
		return {
			ok: false,
			status: 401,
			data: null,
			message: "Unauthorized",
		}
	} catch (error) {
		return {
			ok: false,
			status: 400,
			data: null,
			message: "Something went wrong",
		}
	}
}

export default client
