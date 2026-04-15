<script setup lang="ts">
definePageMeta({
	layout: "empty",
	middleware: ["authenticated"],
})

onMounted(() => {
	navigateTo("/auth/login", { replace: true })
})
</script>

<template>
	<div />
</template>
