import { getAdminUser } from "@/lib/supabase/requireAdmin";
import { getDashboardStats } from "@/lib/data/adminStats";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";

// GET /api/admin -> dashboard summary counts, admin only.
export async function GET() {
  const user = await getAdminUser();
  if (!user) return apiError("Unauthorized", 401);

  const stats = await getDashboardStats();
  return apiSuccess(stats);
}
