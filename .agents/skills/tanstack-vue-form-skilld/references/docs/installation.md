---
id: installation
title: Installation
---

TanStack Form is compatible with various front-end frameworks, including React, Vue, and Solid. Install the corresponding adapter for your framework using your preferred package manager:



react: @tanstack/react-form
vue: @tanstack/vue-form
angular: @tanstack/angular-form
solid: @tanstack/solid-form
lit: @tanstack/lit-form
svelte: @tanstack/svelte-form





# React

## Meta-frameworks

If you're using a meta-framework, TanStack Form provides additional adapters to streamline integration:

- TanStack Start
- Next.js
- Remix





react: @tanstack/react-form-start
react: @tanstack/react-form-nextjs
react: @tanstack/react-form-remix





# React

## Devtools

Developer tools are available using TanStack Devtools. Install the devtools adapter for your framework as a dev dependency to debug forms and inspect their state.

# Solid

## Devtools

Developer tools are available using TanStack Devtools. Install the devtools adapter for your framework as a dev dependency to debug forms and inspect their state.





react: @tanstack/react-devtools
react: @tanstack/react-form-devtools
solid: @tanstack/solid-devtools
solid: @tanstack/solid-form-devtools



> [!NOTE]- Polyfill requirements
> Depending on your environment, you might need to add polyfills. If you want to support older browsers, you need to transpile the library from `node_modules` yourself.
