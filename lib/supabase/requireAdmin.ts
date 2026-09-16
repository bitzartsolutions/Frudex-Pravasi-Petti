import "server-only";
import { createClient } from "./server";

/** Returns the signed-in admin user, or null if the request is unauthenticated. */
export async function getAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
