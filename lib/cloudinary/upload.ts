import "server-only";
import { cloudinary, CLOUDINARY_FOLDERS, type CloudinaryFolderKey } from "./config";

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
}

/**
 * Uploads an image buffer to Cloudinary under the given Frudex folder.
 * CLOUDINARY_API_SECRET never leaves the server — this must only be
 * called from Route Handlers / Server Actions.
 */
export async function uploadImageBuffer(
  buffer: Buffer,
  folderKey: CloudinaryFolderKey
): Promise<CloudinaryUploadResult> {
  const folder = CLOUDINARY_FOLDERS[folderKey];

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          width: result.width,
          height: result.height,
        });
      }
    );
    uploadStream.end(buffer);
  });
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
}

/** Builds an optimized delivery URL for a stored Cloudinary public_id. */
export function cloudinaryUrl(
  publicId: string,
  opts: { width?: number; height?: number } = {}
): string {
  return cloudinary.url(publicId, {
    secure: true,
    quality: "auto",
    fetch_format: "auto",
    crop: "fill",
    gravity: "auto",
    ...opts,
  });
}
