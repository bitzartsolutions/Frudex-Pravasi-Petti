"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { settingsSchema, type SettingsFormValues } from "@/lib/validations/settings";

export function SettingsForm({ whatsappNumber }: { whatsappNumber: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: { whatsapp_number: whatsappNumber },
  });

  async function onSubmit(values: SettingsFormValues) {
    setIsSubmitting(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error ?? "Failed to save settings");
        return;
      }
      setSaved(true);
      router.refresh();
    } catch {
      setError("Network error — please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-space-md">
      <div className="space-y-1">
        <Label htmlFor="whatsapp_number">WhatsApp Business Number</Label>
        <Input
          id="whatsapp_number"
          placeholder="e.g. 919876543210"
          error={!!errors.whatsapp_number}
          {...register("whatsapp_number", {
            onChange: () => setSaved(false),
          })}
        />
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Digits only, with country code, no spaces or symbols. Orders are sent here.
        </p>
        {errors.whatsapp_number ? (
          <p className="text-error text-label-sm font-label-sm">
            {errors.whatsapp_number.message}
          </p>
        ) : null}
      </div>

      {error ? <p className="text-error text-label-sm font-label-sm">{error}</p> : null}
      {saved ? (
        <p className="text-secondary text-label-sm font-label-sm font-semibold">Saved.</p>
      ) : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save"}
      </Button>
    </form>
  );
}
