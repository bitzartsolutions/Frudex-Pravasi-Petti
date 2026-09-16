import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/supabase/requireAdmin";
import { settingsSchema } from "@/lib/validations/settings";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";

// Writes to Supabase — never attempt static generation/caching for this route.
export const dynamic = "force-dynamic";

// PATCH /api/settings -> update store settings (currently just the
// WhatsApp number), admin only.
export async function PATCH(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return apiError("Unauthorized", 401);

  const body = await request.json().catch(() => null);
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "Invalid settings", 422);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("settings")
    .update({ whatsapp_number: parsed.data.whatsapp_number })
    .eq("id", "default")
    .select()
    .single();

  if (error) return apiError(error.message, 500);
  return apiSuccess(data);
}
