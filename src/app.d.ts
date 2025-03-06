// See https://svelte.dev/docs/kit/types#app.d.ts

import type { UserModelType } from "$lib/types/User.types";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: string | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
