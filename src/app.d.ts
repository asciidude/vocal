// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type { UserType } from "$lib/types/User.types";

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: UserType | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
