"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "./ImageUploader";
import { FormSection } from "./FormSection";
import { categorySchema, type CategoryFormValues } from "@/lib/validations/category";
import { slugify } from "@/lib/utils/slug";

export function CategoryForm({
  defaultValues,
  onSubmit,
  isSubmitting,
}: {
  defaultValues?: Partial<CategoryFormValues>;
  onSubmit: (values: CategoryFormValues) => void;
  isSubmitting: boolean;
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      image_url: null,
      cloudinary_public_id: null,
      is_active: true,
      display_order: 0,
      ...defaultValues,
    },
  });

  const name = watch("name");
  const slugTouched = useRef(Boolean(defaultValues?.slug));

  useEffect(() => {
    if (!slugTouched.current) {
      setValue("slug", slugify(name || ""));
    }
  }, [name, setValue, slugTouched]);

  const imageUrl = watch("image_url");
  const cloudinaryPublicId = watch("cloudinary_public_id");

  // Submitting while the upload is still in flight would silently drop the
  // image, since form state only updates once the upload resolves.
  const [isImageUploading, setIsImageUploading] = useState(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-variant/40 px-space-lg">
        <FormSection title="Basic Details" description="What customers see on the category tab.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            <div className="space-y-1">
              <Label htmlFor="name">Category Name *</Label>
              <Input id="name" error={!!errors.name} {...register("name")} />
              {errors.name ? (
                <p className="text-error text-label-sm font-label-sm">{errors.name.message}</p>
              ) : null}
            </div>
            <div className="space-y-1">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                error={!!errors.slug}
                {...register("slug", {
                  onChange: () => {
                    slugTouched.current = true;
                  },
                })}
              />
              {errors.slug ? (
                <p className="text-error text-label-sm font-label-sm">{errors.slug.message}</p>
              ) : null}
            </div>
          </div>
        </FormSection>

        <FormSection title="Category Image" description="JPG, PNG or WEBP — uploaded straight to Cloudinary.">
          <ImageUploader
            folder="categories"
            value={imageUrl ? { url: imageUrl, publicId: cloudinaryPublicId ?? null } : null}
            onChange={(next) => {
              setValue("image_url", next?.url ?? null);
              setValue("cloudinary_public_id", next?.publicId ?? null);
            }}
            onUploadingChange={setIsImageUploading}
          />
        </FormSection>

        <FormSection
          title="Visibility & Ordering"
          description="Control whether it's live on the storefront and where it appears among the tabs."
        >
          <div className="flex flex-wrap items-center gap-space-lg">
            <label className="flex items-center gap-2">
              <Checkbox {...register("is_active")} />
              <span className="font-label-md text-label-md">Active</span>
            </label>
            <div className="flex items-center gap-2">
              <Label htmlFor="display_order" className="whitespace-nowrap">
                Display Order
              </Label>
              <Input
                id="display_order"
                type="number"
                className="w-24"
                {...register("display_order", { valueAsNumber: true })}
              />
            </div>
          </div>
        </FormSection>
      </div>

      <div className="sticky bottom-0 mt-space-lg py-space-md bg-background/95 backdrop-blur-sm space-y-2">
        {isImageUploading ? (
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            Waiting for image upload to finish…
          </p>
        ) : null}
        <Button type="submit" disabled={isSubmitting || isImageUploading} className="w-full sm:w-auto">
          {isSubmitting ? "Saving…" : "Save Category"}
        </Button>
      </div>
    </form>
  );
}
