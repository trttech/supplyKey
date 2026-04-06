<template>
	<div class="relative min-h-screen">
		<ToastContainer />

		<div class="fixed top-4 right-4 z-50">
			<ThemeToggle />
		</div>

		<slot />
	</div>
</template>
