import { type NextRequest } from "next/server";
import { getAdminUser } from "@/lib/supabase/requireAdmin";
import { uploadImageBuffer } from "@/lib/cloudinary/upload";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";
import type { CloudinaryFolderKey } from "@/lib/cloudinary/config";

// POST-only route, but declared explicitly for consistency with the other
// Supabase/Cloudinary-backed routes in this folder.
export const dynamic = "force-dynamic";

const ACCEPTED_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB
const VALID_FOLDERS: CloudinaryFolderKey[] = ["products", "categories", "branding"];

// POST /api/upload (multipart/form-data: file, folder) -> Cloudinary upload, admin only.
// CLOUDINARY_API_SECRET is only ever used server-side, inside lib/cloudinary.
export async function POST(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return apiError("Unauthorized", 401);

  const formData = await request.formData().catch(() => null);
  if (!formData) return apiError("Invalid form data", 400);

  const file = formData.get("file");
  const folderInput = formData.get("folder");
  const folder = (typeof folderInput === "string" ? folderInput : "products") as CloudinaryFolderKey;

  if (!(file instanceof File)) return apiError("No file provided", 400);
  if (!ACCEPTED_TYPES.has(file.type)) {
    return apiError("Only JPG, PNG and WEBP images are accepted", 422);
  }
  if (file.size > MAX_SIZE_BYTES) {
    return apiError("Image must be smaller than 8MB", 422);
  }
  if (!VALID_FOLDERS.includes(folder)) {
    return apiError("Invalid upload destination", 400);
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadImageBuffer(buffer, folder);
    return apiSuccess({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch {
    return apiError("Image upload failed. Please try again.", 500);
  }
}
