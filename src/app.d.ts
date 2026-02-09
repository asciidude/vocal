import type { UserType } from "src/lib/types/User.type";

declare global {
    namespace App {
        interface Locals {
            user: UserType | null;
        }
    }
}

export {};