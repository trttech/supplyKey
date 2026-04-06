export default defineNuxtRouteMiddleware(async (to) => {
	const publicRoutes = ["/", "/auth/login", "/auth/verify"]
	const isPublicRoute = publicRoutes.includes(to.path)

	const { loggedIn, fetch: refreshSession } = useUserSession()
	await refreshSession()

	if (loggedIn.value && (to.path === "/" || to.path === "/auth/login")) {
		return navigateTo("/dashboard")
	}

	if (isPublicRoute) {
		return
	}

	if (!loggedIn.value) {
		return navigateTo({
			path: "/auth/login",
			query: { redirect: to.fullPath },
		})
	}
})

