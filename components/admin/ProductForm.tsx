"use client";

import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "./ImageUploader";
import { MultiImageUploader } from "./MultiImageUploader";
import { VariantForm } from "./VariantForm";
import { FormSection } from "./FormSection";
import { productSchema, type ProductFormValues } from "@/lib/validations/product";
import { slugify } from "@/lib/utils/slug";
import type { Category } from "@/types/category";

export function ProductForm({
  categories,
  defaultValues,
  onSubmit,
  isSubmitting,
}: {
  categories: Category[];
  defaultValues?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => void;
  isSubmitting: boolean;
}) {
  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      category_id: categories[0]?.id ?? "",
      image_url: null,
      cloudinary_public_id: null,
      is_active: true,
      is_featured: false,
      display_order: 0,
      variants: [{ variant_type: "weight", variant_value: "", price: 0, is_available: true, display_order: 0 }],
      images: [],
      ...defaultValues,
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const name = watch("name");
  // Auto-slug only kicks in for brand-new products; editing an existing
  // product must never silently overwrite a slug someone already saved.
  const slugTouched = useRef(Boolean(defaultValues?.slug));

  useEffect(() => {
    if (!slugTouched.current) {
      setValue("slug", slugify(name || ""));
    }
  }, [name, setValue, slugTouched]);

  const imageUrl = watch("image_url");
  const cloudinaryPublicId = watch("cloudinary_public_id");
  const images = watch("images");

  // Submitting while an upload is still in flight would silently drop that
  // image, since form state only updates once the upload resolves — so
  // Save stays disabled until every uploader reports idle.
  const [isCoverUploading, setIsCoverUploading] = useState(false);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);
  const isAnyImageUploading = isCoverUploading || isGalleryUploading;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-variant/40 px-space-lg">
          <FormSection title="Basic Details" description="What customers see on the product card.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              <div className="space-y-1">
                <Label htmlFor="name">Product Name *</Label>
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

            <div className="space-y-1">
              <Label htmlFor="category_id">Category *</Label>
              <Select id="category_id" error={!!errors.category_id} {...register("category_id")}>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={3} {...register("description")} />
            </div>
          </FormSection>

          <FormSection title="Product Image" description="JPG, PNG or WEBP — uploaded straight to Cloudinary.">
            <ImageUploader
              folder="products"
              value={imageUrl ? { url: imageUrl, publicId: cloudinaryPublicId ?? null } : null}
              onChange={(next) => {
                setValue("image_url", next?.url ?? null);
                setValue("cloudinary_public_id", next?.publicId ?? null);
              }}
              onUploadingChange={setIsCoverUploading}
            />
          </FormSection>

          <FormSection
            title="Additional Images"
            description="Extra gallery photos customers can browse in a lightbox — the Product Image above stays as the card thumbnail."
          >
            <MultiImageUploader
              folder="products"
              value={images.map((img) => ({
                id: img.id,
                url: img.image_url,
                publicId: img.cloudinary_public_id ?? null,
              }))}
              onChange={(next) =>
                setValue(
                  "images",
                  next.map((img, index) => ({
                    id: img.id,
                    image_url: img.url,
                    cloudinary_public_id: img.publicId,
                    display_order: index,
                  }))
                )
              }
              onUploadingChange={setIsGalleryUploading}
            />
          </FormSection>

          <FormSection
            title="Visibility & Ordering"
            description="Control whether it's live on the storefront and where it appears in the grid."
          >
            <div className="flex flex-wrap items-center gap-space-lg">
              <label className="flex items-center gap-2">
                <Checkbox {...register("is_active")} />
                <span className="font-label-md text-label-md">Active</span>
              </label>
              <label className="flex items-center gap-2">
                <Checkbox {...register("is_featured")} />
                <span className="font-label-md text-label-md">Featured</span>
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

          <FormSection
            title="Variants"
            description="Weight, pack or piece-count options customers choose from, each with its own price."
          >
            <VariantForm />
          </FormSection>
        </div>

        <div className="sticky bottom-0 mt-space-lg py-space-md bg-background/95 backdrop-blur-sm space-y-2">
          {isAnyImageUploading ? (
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              Waiting for image upload to finish…
            </p>
          ) : null}
          <Button
            type="submit"
            disabled={isSubmitting || isAnyImageUploading}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? "Saving…" : "Save Product"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
