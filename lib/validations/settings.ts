import { z } from "zod";

export const settingsSchema = z.object({
  whatsapp_number: z
    .string()
    .trim()
    .regex(/^\d{7,15}$/, "Enter digits only, with country code (e.g. 919876543210)"),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;
