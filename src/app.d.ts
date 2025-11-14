import type { UserType } from "$lib/types/User.types";

declare global {
    namespace App {
        interface Locals {
            user: UserType | null;
        }
    }
}

export {};