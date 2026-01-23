import { redirect, error } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { UserRoles } from "$lib/types/User.types";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user || !locals.user.roles.includes(UserRoles.SuperAdmin)) {
    throw redirect(302, "/home");
  }
};